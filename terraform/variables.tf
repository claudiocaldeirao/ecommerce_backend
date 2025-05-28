variable "aws_region" {
  type        = string
  description = "The AWS region to deploy resources in"
}

variable "db_username" {
  type        = string
  description = "The username for the PostgreSQL database"
}

variable "db_password" {
  type        = string
  description = "The password for the PostgreSQL database"
}

variable "db_name" {
  type        = string
  description = "The name of the PostgreSQL database"
}

variable "db_port" {
  type    = number
  default = 5432
}

variable "ec2_user" {}

variable "ec2_password" {}
