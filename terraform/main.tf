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
# ------------------------------------- Database Resources -----------------------------------
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
  db_subnet_group_name = aws_db_subnet_group.ecommerce_private_subnet_group.name
  tags = {
    Name              = "ecommerce_postgresql"
    "aws:application" = "ecommerce_showcase"
  }
}
# ------------------------------- VPC and Networking Resources -------------------------------
resource "aws_vpc" "ecommerce_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name              = "ecommerce_vpc"
    "aws:application" = "ecommerce_showcase"
  }
}

resource "aws_subnet" "ecommerce_public_subnet" {
  vpc_id     = aws_vpc.ecommerce_vpc.id
  cidr_block = "10.0.1.0/24"
  tags = {
    Name              = "ecommerce_public_subnet"
    "aws:application" = "ecommerce_showcase"
  }
}

resource "aws_subnet" "ecommerce_private_subnet_01a" {
  vpc_id            = aws_vpc.ecommerce_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name              = "ecommerce_private_subnet_1a"
    "aws:application" = "ecommerce_showcase"
  }
}

resource "aws_subnet" "ecommerce_private_subnet_01b" {
  vpc_id            = aws_vpc.ecommerce_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1b"
  tags = {
    Name              = "ecommerce_private_subnet_1b"
    "aws:application" = "ecommerce_showcase"
  }
}


resource "aws_internet_gateway" "ecommerce_igw" {
  vpc_id = aws_vpc.ecommerce_vpc.id
  tags = {
    Name              = "ecommerce_igw"
    "aws:application" = "ecommerce_showcase"
  }
}

resource "aws_route_table" "ecommerce_public_route_table" {
  vpc_id = aws_vpc.ecommerce_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ecommerce_igw.id
  }
  tags = {
    Name              = "ecommerce_public_route_table"
    "aws:application" = "ecommerce_showcase"
  }
}

resource "aws_route_table_association" "ecommerce_public_subnet_association" {
  subnet_id      = aws_subnet.ecommerce_public_subnet.id
  route_table_id = aws_route_table.ecommerce_public_route_table.id
}

resource "aws_db_subnet_group" "ecommerce_private_subnet_group" {
  name       = "ecommerce_private_subnet_group"
  subnet_ids = [aws_subnet.ecommerce_private_subnet_01a.id, aws_subnet.ecommerce_private_subnet_01b.id]
  tags = {
    Name              = "ecommerce_db_subnet_group"
    "aws:application" = "ecommerce_showcase"
  }
}
