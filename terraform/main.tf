terraform {
  required_version = ">= 1.12.1"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0-beta2"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_db_instance" "ecommerce_postgresql" {
  allocated_storage    = 20
  db_name              = "ecommercedb"
  engine               = "postgres"
  engine_version       = "17.5"
  instance_class       = "db.t3.micro"
  username             = var.db_username
  password             = var.db_password
  parameter_group_name = "default.postgres17"
  skip_final_snapshot  = true
  publicly_accessible  = false
  tags = {
    Name = "ecommerce_postgresql"
  }
}
