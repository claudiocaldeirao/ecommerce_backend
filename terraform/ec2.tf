/*
 * This Terraform configuration sets up a EC2 instance for the E-commerce application.
 * The instance is configured to run Node.js v20 and will download the application code from an S3 bucket.
 * The user data script installs Node.js, downloads the application code, extracts it, installs dependencies,
 * and starts the application in the background.
 */
resource "aws_instance" "ecommerce_app_instance" {
  ami           = "ami-084568db4383264d4"
  instance_type = "t3.micro"
  subnet_id     = aws_subnet.this["pub_a"].id
  user_data     = <<-EOF
    #!/bin/bash

    echo "${var.ec2_user}:${var.ec2_password}" | chpasswd

    # Update package list
    apt-get update -y

    # Install Node.js v20 (latest 20.x version)
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs

    # Create the application directory
    mkdir -p /app
    cd /app

    # Download the source code archive from S3
    aws s3 cp s3://${aws_s3_bucket.ecommerce_app_code.bucket}/app.tar.gz .

    # Extract the contents
    tar -xzf app.tar.gz

    # install psql and seed db
    apt install -y postgresql-client
    PGPASSWORD="${var.db_password} psql -h ${aws_db_instance.ecommerce_postgresql.endpoint} -U ${var.db_username} -d ${var.db_name} -f init.sql

    # set environment variables
    export POSTGRES_USER=${var.db_username}
    export POSTGRES_PASSWORD=${var.db_password}
    export POSTGRES_DB=${var.db_name}
    export POSTGRES_HOST=${aws_db_instance.ecommerce_postgresql.endpoint}
    export POSTGRES_PORT=${var.db_port}

    # Install only production dependencies (optional if already bundled)
    npm install pnpm
    pnpm install --frozen-lockfile --prod --ignore-scripts

    # Start the application in the background
    nohup node dist/main.js > app.log 2>&1 &
  EOF

  tags = merge(
    local.common_tags,
    {
      Name = "ecommerce_app_instance"
    }
  )
}
