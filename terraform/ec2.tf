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
