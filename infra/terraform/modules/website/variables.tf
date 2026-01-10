variable "domain_name" {
  description = "The comprehensive domain name for the website (e.g., app.example.com)"
  type        = string
}

variable "zone_id" {
  description = "The Route 53 Hosted Zone ID where the DNS record will be created"
  type        = string
}

variable "environment" {
  description = "Environment name (BS-demo, BS-staging, BS-prod) for tagging"
  type        = string
}
