# AWS Frontend Infrastructure: The Basics

This guide breaks down the core components used to host a modern Single Page Application (SPA) or static website on AWS.

## The Triad: Storage, Delivery, and Identity

### 1. Storage: Amazon S3 (Simple Storage Service)

Think of this as your **cloud hard drive**.

- **Role**: It holds your "build" files—the HTML, CSS, JavaScript, and images that `yarn build` produces.
- **Why we use it**: It is incredibly cheap, durable, and infinitely scalable. You don't need a "server" running Node.js just to serve these static files.
- **Best Practice**: Keep your S3 bucket **private**. Never open it to the public internet directly.

### 2. Delivery: Amazon CloudFront (CDN)

Think of this as your **global distribution center**.

- **Role**: It sits in front of your S3 bucket. It takes your files and copies them to hundreds of "Edge Locations" (servers) all around the world.
- **Why we use it**:
  - **Speed**: A user in Japan downloads your site from a server in Tokyo, not your S3 bucket in Ohio.
  - **Security**: It handles the SSL/TLS (HTTPS) encryption.
  - **Access Control**: It creates a secure door to your private S3 bucket (using **OAC** - Origin Access Control).

### 3. Identity: Route 53 (DNS)

Think of this as the **phone book**.

- **Role**: It translates `mario.productions` into the "phone number" (IP address) of your CloudFront distribution.
- **Why we use it**: It integrates seamlessly with other AWS services, allowing us to use "Alias" records which are faster and cheaper than standard CNAME records.

---

## How it flows

1.  **User** types `best-shot.mario.productions`.
2.  **Route 53** tells the browser: "Go to this CloudFront distribution."
3.  **CloudFront** checks its cache.
    - _Hit_: It serves the file immediately (super fast).
    - _Miss_: It securely asks your **S3 Bucket** for the file, serves it to the user, and saves a copy for next time.

## What is an SPA Routing issue?

In a React app (SPA), you have many "pages" (`/dashboard`, `/profile`) but only one real file (`index.html`).

- **Problem**: If a user goes directly to `/dashboard`, S3 looks for a file named `dashboard`. It doesn't exist, so S3 returns a **404 Error**.
- **Solution**: We configure CloudFront to intercept that 404 and serve `index.html` instead (with a 200 OK status). This loads React, which then looks at the URL and renders the Dashboard correctly.
