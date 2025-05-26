provider "aws" {
  access_key                  = var.aws_access_key
  secret_key                  = var.aws_secret_key
  region                      = var.region
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    rds = "http://localhost:4566"
  }
}

resource "aws_db_instance" "postgres" {
  allocated_storage   = 20              # Storage size in GB
  engine              = "postgres"      # Database engine
  engine_version      = "13.4"          # PostgreSQL version
  instance_class      = "db.t3.micro"   # Instance type
  identifier          = "ecommerce-db"  # Unique name for the instance
  username            = var.db_username # DB master username
  password            = var.db_password # DB master password
  db_name             = var.db_name     # Initial database name
  publicly_accessible = true            # Set to true if you want public access
  skip_final_snapshot = true            # Skips the final snapshot upon deletion
}

resource "null_resource" "db_seed" {
  depends_on = [aws_db_instance.postgres]

  provisioner "local-exec" {
    command = <<EOT
      PGPASSWORD=${var.db_password} psql -h ${aws_db_instance.postgres.address} -U ${var.db_username} -d ${var.db_name} -f ./postgresql/init.sql
    EOT
  }
}
