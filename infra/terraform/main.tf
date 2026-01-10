# ------------------------------------------------------------------------------
# ROUTE 53 ZONE LOOKUP
# ------------------------------------------------------------------------------
data "aws_route53_zone" "main" {
  zone_id = "Z04955823HLJB9D4I2QWR"
}

# ------------------------------------------------------------------------------
# DEMO ENVIRONMENT
# ------------------------------------------------------------------------------
module "demo" {
  source      = "./modules/website"
  environment = "demo"
  domain_name = "best-shot-demo.mario.productions"
  zone_id     = data.aws_route53_zone.main.zone_id
  providers = {
    aws           = aws
    aws.us_east_1 = aws.virginia
  }
}

# ------------------------------------------------------------------------------
# STAGING ENVIRONMENT
# ------------------------------------------------------------------------------
module "staging" {
  source      = "./modules/website"
  environment = "staging"
  domain_name = "best-shot-staging.mario.productions"
  zone_id     = data.aws_route53_zone.main.zone_id
  providers = {
    aws           = aws
    aws.us_east_1 = aws.virginia
  }
}

# ------------------------------------------------------------------------------
# PRODUCTION ENVIRONMENT
# ------------------------------------------------------------------------------
module "production" {
  source      = "./modules/website"
  environment = "production"
  domain_name = "best-shot.mario.productions"
  zone_id     = data.aws_route53_zone.main.zone_id
  providers = {
    aws           = aws
    aws.us_east_1 = aws.virginia
  }
}

# ------------------------------------------------------------------------------
# OUTPUTS (For GitHub Secrets)
# ------------------------------------------------------------------------------
output "demo_bucket_id" {
  value = module.demo.s3_bucket_id
}
output "demo_cloudfront_id" {
  value = module.demo.cloudfront_distribution_id
}

output "staging_bucket_id" {
  value = module.staging.s3_bucket_id
}
output "staging_cloudfront_id" {
  value = module.staging.cloudfront_distribution_id
}

output "production_bucket_id" {
  value = module.production.s3_bucket_id
}
output "production_cloudfront_id" {
  value = module.production.cloudfront_distribution_id
}
