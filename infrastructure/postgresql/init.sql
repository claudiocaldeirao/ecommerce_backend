-- ===========================
-- Schema creation
-- ===========================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Customers
CREATE TABLE Customer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    birthdate DATE
);

CREATE TABLE Address (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(id),
    street VARCHAR(100),
    city VARCHAR(50)
);

CREATE TABLE Profile (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(id),
    photo VARCHAR(255)
);

CREATE TABLE Preferences (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(id),
    language VARCHAR(10)
);

-- Products
CREATE TABLE Product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price NUMERIC(10,2),
    stock INTEGER,
    category VARCHAR(50)
);

-- Shopping Cart
CREATE TABLE Cart (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(id)
);

CREATE TABLE CartItem (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Product(id),
    quantity INTEGER
);

-- Orders and Payments
CREATE TABLE "Order" (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(id),
    date TIMESTAMP,
    status VARCHAR(20)
);

CREATE TABLE Invoice (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES "Order"(id)
);

CREATE TABLE Transaction (
    id SERIAL PRIMARY KEY,
    total_amount NUMERIC(10,2),
    description TEXT
);

-- Shipping and Logistics
CREATE TABLE Delivery (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES "Order"(id)
);

CREATE TABLE Tracking (
    code VARCHAR(50) PRIMARY KEY
);

CREATE TABLE Carrier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE DeliveryStatus (
    id SERIAL PRIMARY KEY
);

-- Auth & Authz
CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE jwt_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Promotions
CREATE TABLE Coupon (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50),
    validity DATE
);

CREATE TABLE DiscountRule (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    value NUMERIC(10,2)
);

CREATE TABLE Campaign (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- Admin
CREATE TABLE OrderDashboard (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES "Order"(id)
);

CREATE TABLE ProductManagement (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES Product(id)
);

CREATE TABLE Reports (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(id)
);

-- Support
CREATE TABLE ReturnRequest (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(id)
);

CREATE TABLE SupportTicket (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(id),
    description TEXT
);

CREATE TABLE Feedback (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Customer(id)
);

-- ===========================
-- Seed data
-- ===========================

-- Customers
INSERT INTO Customer (id, name, email, birthdate) VALUES
(1, 'Ana Costa', 'ana@example.com', '1990-05-01'),
(2, 'João Silva', 'joao@example.com', '1985-08-22');

INSERT INTO Address (id, customer_id, street, city) VALUES
(1, 1, 'Rua A', 'São Paulo'),
(2, 2, 'Rua B', 'Rio de Janeiro');

INSERT INTO Profile (id, customer_id, photo) VALUES
(1, 1, 'ana.jpg'),
(2, 2, 'joao.jpg');

INSERT INTO Preferences (id, customer_id, language) VALUES
(1, 1, 'pt-BR'),
(2, 2, 'en-US');

-- Products
INSERT INTO Product (id, name, description, price, stock, category) VALUES
(1, 'Notebook', 'Notebook i5 8GB', 3500.00, 10, 'Eletrônicos'),
(2, 'Mouse', 'Mouse sem fio', 120.00, 50, 'Acessórios');

-- Shopping Cart
INSERT INTO Cart (id, customer_id) VALUES (1, 1);
INSERT INTO CartItem (id, product_id, quantity) VALUES
(1, 1, 1),
(2, 2, 2);

-- Orders and Payments
INSERT INTO "Order" (id, customer_id, date, status) VALUES
(1, 1, NOW(), 'processing');

INSERT INTO Invoice (id, order_id) VALUES (1, 1);
INSERT INTO Transaction (id, total_amount, description) VALUES (1, 3740.00, 'Pedido #1');

-- Shipping
INSERT INTO Delivery (id, order_id) VALUES (1, 1);
INSERT INTO Tracking (code) VALUES ('TRACK123');
INSERT INTO Carrier (id, name) VALUES (1, 'Correios');
INSERT INTO DeliveryStatus (id) VALUES (1);

-- Auth
INSERT INTO app_user (id, name, email, password_hash, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin', 'admin@example.com', '$2a$10$7k7XUBYf4prTOmYMYZ8HtOCeFLz7OAt70pU5ltVyyg4qls/pFwDAu', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'cliente', 'cliente@example.com', '$2a$10$7k7XUBYf4prTOmYMYZ8HtOCeFLz7OAt70pU5ltVyyg4qls/pFwDAu', NOW(), NOW());

INSERT INTO Role (id, name) VALUES
(1, 'Admin'),
(2, 'Customer');

-- Promo
INSERT INTO Coupon (id, code, validity) VALUES
(1, 'DESC10', '2025-12-31');

INSERT INTO DiscountRule (id, type, value) VALUES
(1, 'percent', 10);

INSERT INTO Campaign (id, name) VALUES
(1, 'Natal 2025');

-- Admin
INSERT INTO OrderDashboard (id, order_id) VALUES (1, 1);
INSERT INTO ProductManagement (id, product_id) VALUES (1, 1);
INSERT INTO Reports (id, customer_id) VALUES (1, 1);

-- Suporte
INSERT INTO ReturnRequest (id, customer_id) VALUES (1, 1);
INSERT INTO SupportTicket (id, customer_id, description) VALUES
(1, 1, 'Produto com defeito');

INSERT INTO Feedback (id, customer_id) VALUES (1, 1);
