# Deployment Restoration Plan

## Goal

Restore the AWS infrastructure (S3 Buckets + CloudFront Distributions + Route 53 Records) for `best-shot-app` (Frontend) using Terraform. This will recreate the environments for `demo`, `staging`, and `production` that were lost when the previous AWS account was deleted.

## User Review Required

> [!IMPORTANT] > **AWS Credentials**: You must have AWS CLI configured locally with credentials for your new account to apply the Terraform configuration.

> [!WARNING] > **DNS Propagation**: Creating new ACM certificates and CloudFront distributions can take 15-45 minutes. DNS changes might take time to propagate.

> [!NOTE] > **GitHub Secrets**: After the infrastructure is created, you MUST manually update the `AWS_BUCKET_ID` and `AWS_CLOUDFRONT_ID` secrets in your GitHub Repository settings for each environment (Demo, Staging, Production).

## Proposed Changes

I will create a new `infra/terraform` directory in the `best-shot` repository with the following structure:

### Infrastructure Code (`infra/terraform/`)

#### [NEW] `modules/website/main.tf`

- **S3 Bucket**: Private bucket for static hosting.
- **CloudFront Origin Access Control (OAC)**: Secure access from CloudFront to S3.
- **CloudFront Distribution**:
  - configured for SPA routing (404/403 -> 200 /index.html).
  - HTTPS enabled.
  - IPv6 enabled.
- **ACM Certificate**: SSL certificate for the domain.
- **Route 53**: A records pointing to CloudFront.

#### [NEW] `modules/website/variables.tf` & `outputs.tf`

- Input variables for domain name, environment name, etc.
- Outputs for Bucket ID and CloudFront ID (needed for GitHub Secrets).

#### [NEW] `main.tf`

- Orchestrates the creation of 3 environments:
  - **Demo**: `best-shot-demo.mariobrusarosco.com`
  - **Staging**: `best-shot-staging.mariobrusarosco.com`
  - **Production**: `best-shot.mariobrusarosco.com`

#### [NEW] `provider.tf`

- AWS Provider configuration (us-east-1 is required for CloudFront certs).

## Verification Plan

### Automated Verification

- `terraform validate`: Ensure syntax is correct.
- `terraform plan`: Preview changes before applying.

### Manual Verification

1.  **Apply Infrastructure**: User runs `terraform init` and `terraform apply`.
2.  **Update Secrets**: User updates GitHub Secrets.
3.  **Trigger Deployment**: User re-runs the GitHub Action (or pushes a commit) to verify the pipeline works.
4.  **Browser Test**: Visit the URLs to confirm the site loads (it will be empty until the first deployment).
