# Applying the Infrastructure

## Step 1: Configure AWS CLI

Yes, you need the AWS CLI configured so Terraform can talk to your account.

1.  **Check if installed**:
    ```bash
    aws --version
    ```
2.  **Configure Credentials**:
    Run this command and enter your **Access Key ID** and **Secret Access Key** when prompted.
    ```bash
    aws configure
    ```
    - **Region**: Enter `us-east-2` (Ohio).
    - **Format**: `json`.

## Step 2: Initialize Terraform

Navigate to the terraform directory:

```bash
cd infra/terraform
```

Initialize the project (downloads the AWS provider):

```bash
terraform init
```

## Step 3: Preview Changes

See what will be created:

```bash
terraform plan
```

- It should show roughly **12 resources to add** (3 certs, 3 buckets, 3 distributions, 3 DNS records).

## Step 4: Apply

Create the resources:

```bash
terraform apply
```

- Type `yes` when asked.
- **Wait**: It might take **15-30 minutes** for CloudFront distributions to deploy.

## Step 5: Get IDs for GitHub

After it finishes, get the Output values (Bucket IDs and CloudFront IDs) to update your GitHub Secrets.

```bash
terraform output
```
