# AWS S3 File Uploader with Next.js

This project demonstrates how to create a secure file upload system using **Next.js** and **AWS S3** as a Content Delivery Network (CDN). It includes user authentication through **NextAuth** with **GitHub** sign-in, allowing only authenticated users to interact with the S3 bucket.

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Setup](#step-by-step-setup)
    - [AWS S3 Setup](#aws-s3-setup)
    - [Set IAM User Credentials](#set-iam-user-credentials)
    - [Environment Variables](#environment-variables)
4. [Installation](#installation)
5. [Usage](#usage)
6. [Configuration](#configuration)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)
9. [API Documentation](#api-documentation)
10. [Examples](#examples)

---

## Introduction
This project allows users to upload images and videos to an S3 bucket in AWS after authenticating with GitHub. It uses signed URLs to securely upload files to the S3 bucket without exposing sensitive credentials on the client side.

## Prerequisites
1. **AWS Account** with IAM user permissions for S3.
2. **GitHub OAuth App** for user authentication with NextAuth.
3. **Node.js** installed on your system.
4. **AWS SDK for JavaScript**.

## Step-by-Step Setup

### AWS S3 Setup
1. **Create an S3 Bucket**:
   - Go to your AWS Console > S3 > Create Bucket.
   - Set a unique bucket name (e.g., `nameer-first-s3-bucket`).
   - Select a region and keep other settings as default.
   - Ensure the bucket has the correct permissions.

2. **Configure Bucket Policy**:
   Add this policy to make the bucket accessible:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "PublicReadGetObject",
               "Effect": "Allow",
               "Principal": "*",
               "Action": "s3:GetObject",
               "Resource": "arn:aws:s3:::your-first-s3-bucket/*"
           }
       ]
   }
   ```
   3. **Set Bucket CORS Policy**:
   - Go to the **Permissions** tab of the S3 bucket and click on **CORS configuration**.
   - Add the following CORS configuration to allow requests from your domain:
   ```xml
   <CORSRule>
       <AllowedOrigin>http://localhost:3000</AllowedOrigin>
       <AllowedOrigin>https://your-production-domain.com</AllowedOrigin>
       <AllowedMethod>GET</AllowedMethod>
       <AllowedMethod>POST</AllowedMethod>
       <AllowedMethod>PUT</AllowedMethod>
       <AllowedHeader>*</AllowedHeader>
   </CORSRule>
   ```
 4. **Create an S3 Bucket Policy**:
- Add this policy to the Bucket Policy tab to allow public read access:
```json

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Statement1",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:PutObject",
            "Resource": "arn:aws:s3:::your-first-s3-bucket/*"
        },
        {
            "Sid": "Statement2",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your-first-s3-bucket/*"
        }
    ]
}
```
5. **Set IAM User Credentials**:
- Go to IAM > Users > Add User.
- Set a username and select Programmatic access for access type.
- Attach the AmazonS3FullAccess policy (or a more restricted policy) to the user.
- Save the Access Key ID and Secret Access Key for later use.

6. **Environment Variables**:

```json
{
    "AWS_ACCESS_KEY_ID": "your-aws-access-key",
    "AWS_SECRET_ACCESS_KEY": "your-aws-secret-key",
    "AWS_REGION": "your-aws-region",
    "AWS_BUCKET_NAME": "your-s3-bucket-name",
    "NEXTAUTH_URL": "http://localhost:3000",
    "NEXTAUTH_SECRET": "your-nextauth-secret",
    "GITHUB_ID": "your-github-client-id",
    "GITHUB_SECRET": "your-github-client-secret"
}
```
---

## Installation
To get this project up and running locally, follow these steps:

1. Clone this repository:
```bash
   git clone https://github.com/nameerakhter/learning-s3-file-upload
```
   
3. Change into the project directory:
```bash
cd learning-s3-file-upload
```

3. Install the dependencies:
```bash
npm install
```

4. Run the development server:
```bash
npm run dev
```

---

**Usage**:
- After running the development server, navigate to http://localhost:3000 in your browser.

- Sign in with GitHub using the OAuth authentication provided by NextAuth. You'll be redirected to GitHub's OAuth flow and asked for permission.

- Once authenticated, you will be able to upload files to the S3 bucket using the provided upload form.

- The file upload interface allows you to select files and upload them directly to your S3 bucket using the signed URLs.
