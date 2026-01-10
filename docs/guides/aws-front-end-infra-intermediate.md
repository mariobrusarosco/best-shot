# AWS Frontend Infrastructure: Intermediate Concepts

Once you understand the basics (S3 + CloudFront + Route53), we need to look at how to make it secure, maintainable, and robust.

## 1. Infrastructure as Code (IaC) vs. ClickOps

- **ClickOps**: Manually clicking around the AWS Console.
  - _Pros_: Visual, good for learning.
  - _Cons_: Error-prone, unrepeatable, hard to debug "what changed?"
- **IaC (Terraform)**: Writing code to define your infrastructure.
  - _Pros_: Reproducible (create 3 environments instantly), version-controlled (git), self-documenting.
  - _Concept_: **State File**. Terraform keeps a "map" (`terraform.tfstate`) of what it created. If you delete a resource from the code, Terraform deletes it from the cloud.

## 2. Origin Access Control (OAC)

This is the modern way to secure your S3 bucket.

- **Old Way (OAI)**: Deprecated.
- **New Way (OAC)**: Uses AWS Signature V4 (SigV4) to sign requests.
- **How it works**:
  1.  Your S3 bucket policy says: _"Deny everyone EXCEPT requests signed by CloudFront Distribution X."_
  2.  CloudFront signs every request it sends to S3.
  3.  If a user tries to access the S3 URL directly, they get Access Denied.

## 3. Cache Invalidation

When you deploy new code (`yarn build`), the filenames usually change (e.g., `main-xyz123.js`) because of "hashing." This breaks the cache automatically (users get the new file).

- **The Problem**: `index.html` **_never changes its name_**.
- **The Risk**: CloudFront might serve the _old_ `index.html` (pointing to old JS files) for 24 hours.
- **The Fix**: In your CD pipeline, you must run an **Invalidation** command:
  ```bash
  aws cloudfront create-invalidation --paths "/*"
  ```
  This forces CloudFront to drop its cache and fetch the fresh `index.html` from S3.

## 4. The "US-East-1" Certificate Rule

This is a classic "gotcha."

- **ACM (Certificate Manager)** is regional. A cert in Ohio only works in Ohio.
- **CloudFront** is global. However, its control plane lives physically in **N. Virginia (us-east-1)**.
- **Constraint**: For a CloudFront distribution to use an ACM certificate, that certificate **MUST** exist in `us-east-1`, regardless of where your S3 bucket or users are.

## 5. Security Headers (The Next Step)

To make your app secure, you should eventually configure CloudFront (via Terraform) to add **HTTP Security Headers** to every response:

- `Strict-Transport-Security` (HSTS): Force HTTPS.
- `X-Content-Type-Options`: Prevent MIME sniffing.
- `X-Frame-Options`: Prevent Clickjacking (iframe embedding).
- `Content-Security-Policy` (CSP): Control what scripts can run.
