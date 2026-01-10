# Terraform Basics & Workflow

This guide explains how Terraform works and how we will use it to restore the Best Shot infrastructure.

## What is Terraform?

Terraform is an **Infrastructure as Code (IaC)** tool. Instead of clicking buttons in the AWS Console, you write code (in `.tf` files) that describes what you want your infrastructure to look like.

### Key Concepts

1.  **HCL (HashiCorp Configuration Language)**: The language used in `.tf` files. It's declarative, meaning you describe the _desired end state_ (e.g., "I want an S3 bucket named X"), and Terraform figures out how to create it.
2.  **Provider**: The plugin that talks to a specific cloud (e.g., the `aws` provider). This is how Terraform "syncs" with AWS—it uses the AWS API just like the CLI does.
3.  **State File (`terraform.tfstate`)**: A JSON file where Terraform keeps track of the resources it has created. This maps your code to the actual resources in AWS. **It is crucial not to lose this file.**

## How it Syncs with AWS

Terraform doesn't have a "login" command. Instead, it uses the credentials configured in your environment.

When you run a Terraform command, it looks for credentials in this order:

1.  Environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`).
2.  Shared credentials file (`~/.aws/credentials`), which is what the **AWS CLI** uses.

**To enable Terraform to "sync" (make changes):**
You simply run `aws configure` (or use your existing setup) to ensure your terminal session has valid AWS admin credentials.

## The Workflow: 3 Main Commands

Once we have written the Terraform files, you will run these three commands in your terminal:

### 1. `terraform init`

- **What it does:** Initializes the working directory.
- **Action:** Downloads the AWS Provider plugin and sets up the backend.
- **When to run:** Only once, when you start working in a directory or add new providers.

### 2. `terraform plan`

- **What it does:** "Dry Run". It compares your code (desired state) with the `tfstate` file and the real AWS environment.
- **Output:** It tells you exactly what it _will_ do (e.g., "+ create S3 bucket", "~ update CloudFront distribution").
- **Safety:** This command **does not** change anything in AWS. It's safe to run anytime.

### 3. `terraform apply`

- **What it does:** Executes the plan.
- **Action:** It calls the AWS APIs to create/update/delete resources to match your code.
- **Safety:** It will ask for confirmation (`yes`) before proceeding.

## Summary of Next Steps

1.  **I will write the `.tf` files** (Implementation).
2.  **You will authenticate** with AWS via your terminal (`aws sso login` or `export AWS_PROFILE=...`).
3.  **You will run:**
    ```bash
    cd infra/terraform
    terraform init
    terraform plan   # Check the output
    terraform apply  # Confirm and create resources
    ```
