# 🛒 E-Commerce Backend API

This project is a backend API for an e-commerce platform built with [NestJS](https://nestjs.com/) and [PostgreSQL](https://www.postgresql.org/), structured using **Domain-Driven Design (DDD)** principles.

---

## 🧱 Technologies Used

- **NestJS** — A scalable and modular Node.js framework
- **TypeORM** — ORM for PostgreSQL integration
- **PostgreSQL** — Relational database
- **Jest** — Unit testing framework
- **Terraform** — Infrastructure provisioning
- **Localstack** - (optional) to run locally

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Terraform (v1.5+)
- PostgreSQL CLI (e.g., `psql`) or database GUI (e.g., DBeaver)
- Localstack (v3.5+)

### 1. Provision Infrastructure with Terraform

Navigate to the `infrastructure/` directory:

```bash
cd infrastructure/
terraform init
terraform apply
```

This will provision the following infrastructure on AWS:

- **VPC —** Isolated network with subnets, route tables, and internet gateway

- **Security Groups —** Firewall rules for API and database access

- **IAM Roles and Policies —** Roles for EC2 and API Gateway with least-privilege access

- **EC2 Instance —** Hosts the NestJS API application in a containerized environment (e.g., using Docker on EC2)

- **RDS (PostgreSQL) —** Managed PostgreSQL instance used by the API

- **API Gateway —** Public-facing HTTP gateway to route requests to the EC2/NestJS backend

- **SSM Parameter Store —** Secure storage of environment variables and secrets

### 2. Configure Environment Variables

Create a .env file in the project root:

```js
DATABASE_URL=postgresql://user:password@host:port/dbname
```

## 🗂️ Project Structure

```js
src/
│
├── modules/
│   ├── product-catalog/
│   ├── shopping-cart/
│   ├── orders/
│   ├── customers/
│   ├── shipping/
│   ├── auth/
│   ├── promotions/
│   ├── support/
│   └── admin/
│
├── config/
├── shared/
└── main.ts
```

### 📘 Domain Model

The system follows a Domain-Driven Design (DDD) approach.

👉 See the full [Domain Model](docs/DOMAIN_MODEL.md)

### ✅ Running Tests

```js
npm run test
```

### 🔐 Secrets Detection

This project uses detect-secrets to identify secrets that may have been accidentally committed to the source code (such as API keys, tokens, or passwords).

#### ✅ Setup and Usage

**1 -** Install the tool:

```bash
python3 -m pip install detect-secrets
```

**2 -** Create or update the baseline:

This generates or updates the .secrets.baseline file with detected secrets. The pnpm-lock.yaml file will be excluded from the scan:

```bash
detect-secrets scan --update .secrets.baseline --exclude-files pnpm-lock.yaml
```

**3 -** Audit detected secrets:

Review and classify any potential secrets found in the baseline:

```bash
detect-secrets audit .secrets.baseline
```

⚠️ Make sure to include the .secrets.baseline file in version control to track detected secrets over time, but never commit files that contain actual sensitive data.

### 📄 License

This project is licensed under the [MIT License](LISCENCE).
