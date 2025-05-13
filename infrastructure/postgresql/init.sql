-- ===========================
-- Schema creation
-- ===========================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users
CREATE TABLE user_account (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    birthdate DATE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_address (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_account(id),
    street VARCHAR(100),
    city VARCHAR(50)
);

CREATE TABLE user_profile (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_account(id),
    photo VARCHAR(255)
);

-- Auth & Authz
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE user_role (
    user_id UUID NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) REFERENCES user_account(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_role
        FOREIGN KEY (role_id) REFERENCES role(id)
        ON DELETE CASCADE
);

CREATE TABLE jwt_token (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

-- Products
CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price NUMERIC(10,2),
    stock INTEGER,
    category VARCHAR(50)
);

-- Shopping Cart
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_account(id)
);

CREATE TABLE cart_item (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES product(id),
    cart_id INTEGER REFERENCES cart(id),
    quantity INTEGER
);

-- Orders and Payments
CREATE TABLE order_record (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_account(id),
    date TIMESTAMP,
    status VARCHAR(20)
);

CREATE TABLE order_invoice (
    id SERIAL PRIMARY KEY,
    order_record_id INTEGER REFERENCES order_record(id)
);

CREATE TABLE order_transaction (
    id SERIAL PRIMARY KEY,
    total_amount NUMERIC(10,2),
    description TEXT
);

-- Shipping and Logistics
CREATE TABLE delivery (
    id SERIAL PRIMARY KEY,
    order_record_id INTEGER REFERENCES order_record(id)
);

CREATE TABLE tracking (
    code VARCHAR(50) PRIMARY KEY
);

CREATE TABLE carrier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

CREATE TABLE delivery_status (
    id SERIAL PRIMARY KEY
);

-- Support
CREATE TABLE return_request (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_account(id)
);

CREATE TABLE support_ticket (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_account(id),
    description TEXT
);

CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES user_account(id)
);

-- ===========================
-- Seed data
-- ===========================

-- Users
INSERT INTO user_account (id, name, email, birthdate, password_hash, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Ana Costa', 'ana@example.com', '1990-05-01', '$2b$10$aMG1tJGuDyvYJQYi/J4CA.zwvfOXz0jIxSI2Oj6nLF1fHsqd2wasy', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'João Silva', 'joao@example.com', '1985-08-22', '$2b$10$aMG1tJGuDyvYJQYi/J4CA.zwvfOXz0jIxSI2Oj6nLF1fHsqd2wasy', NOW(), NOW());

INSERT INTO user_address (id, user_id, street, city) VALUES
(1, '550e8400-e29b-41d4-a716-446655440000', 'Rua A', 'São Paulo'),
(2, '550e8400-e29b-41d4-a716-446655440001', 'Rua B', 'Rio de Janeiro');

INSERT INTO user_profile (id, user_id, photo) VALUES
(1, '550e8400-e29b-41d4-a716-446655440000', 'ana.jpg'),
(2, '550e8400-e29b-41d4-a716-446655440001', 'joao.jpg');

-- Auth
INSERT INTO role (id, name) VALUES
(1, 'admin'),
(2, 'manager'),
(3, 'support'),
(4, 'fulfillment'),
(5, 'product_manager'),
(6, 'marketing'),
(7, 'content_editor'),
(8, 'developer'),
(9, 'analyst'),
(10, 'customer'),
(11, 'guest'),
(12, 'subscriber');

INSERT INTO user_role (user_id, role_id) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 1),
('550e8400-e29b-41d4-a716-446655440001', 10);

-- Products
INSERT INTO product (id, name, description, price, stock, category) VALUES
(1, 'Notebook', 'Notebook i5 8GB', 3500.00, 10, 'Eletrônicos'),
(2, 'Mouse', 'Mouse sem fio', 120.00, 50, 'Acessórios');

-- Shopping Cart
INSERT INTO cart (id, user_id) VALUES (1, '550e8400-e29b-41d4-a716-446655440001');
INSERT INTO cart_item (id, product_id, cart_id, quantity) VALUES
(1, 1, 1, 1),
(2, 2, 1, 2);

-- Orders and Payments
INSERT INTO order_record (id, user_id, date, status) VALUES
(1, '550e8400-e29b-41d4-a716-446655440001', NOW(), 'processing');

INSERT INTO order_invoice (id, order_record_id) VALUES (1, 1);
INSERT INTO order_transaction (id, total_amount, description) VALUES (1, 3740.00, 'Pedido #1');

-- Shipping
INSERT INTO delivery (id, order_record_id) VALUES (1, 1);
INSERT INTO tracking (code) VALUES ('TRACK123');
INSERT INTO carrier (id, name) VALUES (1, 'Correios');
INSERT INTO delivery_status (id) VALUES (1);

-- -- Suporte
INSERT INTO return_request (id, user_id) VALUES (1, '550e8400-e29b-41d4-a716-446655440001');
INSERT INTO support_ticket (id, user_id, description) VALUES
(1, '550e8400-e29b-41d4-a716-446655440001', 'Produto com defeito');

INSERT INTO feedback (id, user_id) VALUES (1, '550e8400-e29b-41d4-a716-446655440001');
