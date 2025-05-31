# 📦 Domain Model

This document describes the domain structure and core entities of the E-Commerce system, organized using **Bounded Contexts** in the context of **Domain-Driven Design (DDD)**.

## 1. Product Catalog

- `product`:
  - `id`, `name`, `description`, `price`, `stock`, `category`

---

## 2. Shopping Cart

- `cart`:
  - `id`, `user_id`
- `cart_item`:
  - `id`, `product_id`, `quantity`

---

## 3. Orders and Payments

- `order_record`:
  - `id`, `user_id`, `date`, `status`
- `order_invoice`:
  - `id`, `order_id`
- `order_transaction`:
  - `id`, `total_amount`, `description`
- `order_item`:
  - `id`, `order_id`, `product_id`, `quantity`, `price`

---

## 4. Users

- `user_account`:
  - `id`, `name`, `email`, `birthdate`, `password_hash`, `created_at`, `updated_at`
- `user_address`:
  - `id`, `user_id`, `street`, `city`
- `user_profile`:
  - `id`, `user_id`, `photo`
- `user_preferences`:
  - `id`, `user_id`, `language`

---

## 5. Authentication and Authorization

- `role`:
  - `id`, `name`
- `user_role`:
  - `user_id`, `role_id`
- `jwt_token`:
  - `id`, `email`, `expires_at`, `created_at`, `updated_at`, `revoked`

---
