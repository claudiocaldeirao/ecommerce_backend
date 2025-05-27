/*
 * s3 will be used to store the source code of the ecommerce application.
 * The code will be uploaded as a tar.gz file, which will be downloaded by the EC2 instance
 * during the user data execution.
 */
resource "aws_s3_bucket" "ecommerce_app_code" {
  bucket        = "ecommerce-app-code-${random_id.suffix.hex}"
  force_destroy = true

  tags = merge(
    local.common_tags,
    {
      Name = "ecommerce_app_code_bucket"
    }
  )
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_s3_bucket_versioning" "versioning" {
  bucket = aws_s3_bucket.ecommerce_app_code.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "block_public" {
  bucket = aws_s3_bucket.ecommerce_app_code.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_object" "ecommerce_app_archive" {
  bucket = aws_s3_bucket.ecommerce_app_code.bucket
  key    = "app.tar.gz"
  source = "../app.tar.gz"
  etag   = filemd5("../app.tar.gz")
}
