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

### 📄 License

This project is licensed under the [MIT License](LISCENCE).
