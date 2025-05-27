/*
  * This Terraform configuration sets up an AWS RDS PostgreSQL database instance for the E-commerce application.
 */
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
  db_subnet_group_name = aws_db_subnet_group.default.name
  tags = {
    Name    = "ecommerce_postgresql"
    Project = "ecommerce_showcase"
  }
}

resource "aws_db_subnet_group" "default" {
  name       = "db_subnet_group"
  subnet_ids = [aws_subnet.this["pvt_a"].id, aws_subnet.this["pvt_b"].id]
  tags = merge(
    local.common_tags,
    {
      Name = "db_subnet_group"
    }
  )
}
