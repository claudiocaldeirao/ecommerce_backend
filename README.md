# 🛒 E-Commerce Backend API

This project is a backend API for an e-commerce platform built with [NestJS](https://nestjs.com/) and [PostgreSQL](https://www.postgresql.org/), structured using **Domain-Driven Design (DDD)** principles.

---

## 🧱 Technologies Used

- **NestJS** — A scalable and modular Node.js framework
- **TypeORM** — ORM for PostgreSQL integration
- **PostgreSQL** — Relational database
- **Jest** — Unit testing framework
- **Docker** — Containerized development environment

---

## 🚀 Getting Started

### Prerequisites

- Docker + Docker Compose
- Node.js (v18+)

## Running Locally with localstack

@todo

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
