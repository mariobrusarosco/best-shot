terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Default Provider: us-east-2 (Ohio) where your S3 buckets will live
provider "aws" {
  region = "us-east-2"
}

# Aliased Provider: us-east-1 (N. Virginia) REQUIRED for CloudFront ACM certificates
provider "aws" {
  alias  = "virginia"
  region = "us-east-1"
}
