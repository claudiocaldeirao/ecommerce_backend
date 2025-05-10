# 📦 Domain Model

This document describes the domain structure and core entities of the E-Commerce system, organized using **Bounded Contexts** in the context of **Domain-Driven Design (DDD)**.

## 1. Product Catalog

- `Product`:
  - `id`, `name`, `description`, `price`, `stock`, `category`

---

## 2. Shopping Cart

- `Cart`:
  - `id`, `customer_id`
- `CartItem`:
  - `id`, `product_id`, `quantity`

---

## 3. Orders and Payments

- `Order`:
  - `id`, `customer_id`, `date`, `status`
- `Invoice`:
  - `id`, `order_id`
- `Transaction`:
  - `id`, `total_amount`, `description`

---

## 4. Customers

- `Customer`:
  - `id`, `name`, `email`, `birthdate`
- `Address`:
  - `id`, `customer_id`, `street`, `city`
- `Profile`:
  - `id`, `customer_id`, `photo`
- `Preferences`:
  - `id`, `customer_id`, `language`

---

## 5. Shipping and Logistics

- `Delivery`:
  - `id`, `order_id`
- `Tracking`:
  - `code`
- `Carrier`:
  - `id`, `name`
- `DeliveryStatus`:
  - `id`

---

## 6. Authentication and Authorization

- `User`:
  - `id`, `name`
- `Role`:
  - `id`, `name`
- `Permission`:
  - `id`, `value`
- `Token`:
  - `id`

---

## 7. Promotions and Discounts

- `Coupon`:
  - `id`, `code`, `validity`
- `DiscountRule`:
  - `id`, `type`, `value`
- `Campaign`:
  - `id`, `name`

---

## 8. Administration and Backoffice

- `OrderDashboard`:
  - `id`, `order_id`
- `ProductManagement`:
  - `id`, `product_id`
- `Reports`:
  - `id`, `customer_id`

---

## 9. Support and After-Sales

- `ReturnRequest`:
  - `id`, `customer_id`
- `SupportTicket`:
  - `id`, `customer_id`, `description`
- `Feedback`:
  - `id`, `customer_id`
