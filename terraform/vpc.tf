/*
 * This file is part of the E-commerce Application Infrastructure as Code project.
 * It defines the AWS VPC, subnets, internet gateway, and route tables for the application.
 * The VPC is configured with public and private subnets across two availability zones.
 */
resource "aws_vpc" "this" {
  cidr_block = "192.168.0.0/16"
  tags = merge(
    local.common_tags,
    {
      Name = "ecommerce_vpc"
    }
  )
}

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags = merge(
    local.common_tags,
    {
      Name = "ecommerce_igw"
    }
  )
}

resource "aws_subnet" "this" {
  for_each = {
    "pub_a" : ["192.168.1.0/24", "${var.aws_region}a", "public_subnet_a"]
    "pub_b" : ["192.168.2.0/24", "${var.aws_region}b", "public_subnet_b"]
    "pvt_a" : ["192.168.3.0/24", "${var.aws_region}a", "private_subnet_a"]
    "pvt_b" : ["192.168.4.0/24", "${var.aws_region}b", "private_subnet_b"]
  }

  vpc_id            = aws_vpc.this.id
  cidr_block        = each.value[0]
  availability_zone = each.value[1]

  tags = merge(local.common_tags, { Name = each.value[2] })
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.this.id
  }
  tags = merge(
    local.common_tags,
    {
      Name = "ecommerce_public_route_table"
    }
  )
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id
  tags   = merge(local.common_tags, { Name = "ecommerce_private_route_table" })
}

resource "aws_route_table_association" "this" {
  for_each = local.subnet_ids

  subnet_id      = each.value
  route_table_id = substr(each.key, 0, 3) == "pub" ? aws_route_table.public.id : aws_route_table.private.id
}
