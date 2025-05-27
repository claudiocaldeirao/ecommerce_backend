locals {
  subnet_ids = { for k, v in aws_subnet.this : v.tags.Name => v.id }

  common_tags = {
    Project     = "ecommerce_showcase"
    Environment = "development"
    ManagedBy   = "terraform"
  }
}
