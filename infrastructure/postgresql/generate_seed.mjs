import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

const NUM_USERS = 100;
const NUM_PRODUCTS = 50;
const NUM_ORDERS_PER_USER = 3;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUsers(n) {
  const users = [];
  for (let i = 0; i < n; i++) {
    users.push({
      id: uuidv4(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      birthdate: faker.date
        .between({ from: '1950-01-01', to: '2005-01-01' })
        .toISOString()
        .split('T')[0],
      password_hash:
        '$2b$10$aMG1tJGuDyvYJQYi/J4CA.zwvfOXz0jIxSI2Oj6nLF1fHsqd2wasy', // 123
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
  return users;
}

function generateAddresses(users) {
  return users.map((u, i) => ({
    id: i + 1,
    user_id: u.id,
    street: faker.location.streetAddress(),
    city: faker.location.city(),
  }));
}

function generateProfiles(users) {
  return users.map((u, i) => ({
    id: i + 1,
    user_id: u.id,
    photo: faker.system.fileName('jpg'),
  }));
}

function generateRoles() {
  const roles = [
    'admin',
    'manager',
    'support',
    'fulfillment',
    'product_manager',
    'marketing',
    'content_editor',
    'developer',
    'analyst',
    'customer',
    'guest',
    'subscriber',
  ];
  return roles.map((name, i) => ({ id: i + 1, name }));
}

function generateUserRoles(users, roles) {
  return users.map((u) => ({
    user_id: u.id,
    role_id: roles[randomInt(0, roles.length - 1)].id,
  }));
}

function generateProducts(n) {
  const categories = [
    'Eletrônicos',
    'Acessórios',
    'Roupas',
    'Brinquedos',
    'Livros',
  ];
  const products = [];
  for (let i = 1; i <= n; i++) {
    products.push({
      id: i,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price(10, 5000, 2)),
      stock: randomInt(0, 100),
      category: categories[randomInt(0, categories.length - 1)],
    });
  }
  return products;
}

function generateCarts(users, products) {
  const carts = [];
  const cartItems = [];
  let cartId = 1;
  let cartItemId = 1;

  users.forEach((user) => {
    carts.push({ id: cartId, user_id: user.id });
    const totalProducts = products.length;
    const itemCount = Math.min(5, totalProducts);
    const productIndices = faker.helpers.uniqueArray(
      [...Array(products.length).keys()],
      itemCount,
    );

    productIndices.forEach((pi) => {
      cartItems.push({
        id: cartItemId++,
        product_id: products[pi].id,
        cart_id: cartId,
        quantity: randomInt(1, 5),
      });
    });
    cartId++;
  });

  return { carts, cartItems };
}

function generateOrders(users) {
  const orders = [];
  const invoices = [];
  const transactions = [];
  let orderId = 1;
  let invoiceId = 1;
  let transactionId = 1;

  users.forEach((user) => {
    const orderCount = randomInt(0, NUM_ORDERS_PER_USER);
    for (let i = 0; i < orderCount; i++) {
      const totalAmount = parseFloat(faker.commerce.price(20, 10000, 2));
      orders.push({
        id: orderId,
        user_id: user.id,
        date: new Date(),
        status: faker.helpers.arrayElement([
          'processing',
          'shipped',
          'delivered',
          'cancelled',
        ]),
      });
      invoices.push({
        id: invoiceId,
        order_record_id: orderId,
      });
      transactions.push({
        id: transactionId,
        total_amount: totalAmount,
        description: `Pedido #${orderId}`,
      });
      orderId++;
      invoiceId++;
      transactionId++;
    }
  });

  return { orders, invoices, transactions };
}

function buildInsert(table, columns, data) {
  const values = data.map((row) => {
    const vals = columns.map((col) => {
      const v = row[col];
      if (v === null || v === undefined) return 'NULL';
      if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
      if (v instanceof Date)
        return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
      return v;
    });
    return `(${vals.join(', ')})`;
  });
  return `INSERT INTO ${table} (${columns.join(', ')}) VALUES\n${values.join(',\n')};\n`;
}

function main() {
  const users = generateUsers(NUM_USERS);
  const addresses = generateAddresses(users);
  const profiles = generateProfiles(users);
  const roles = generateRoles();
  const userRoles = generateUserRoles(users, roles);
  const products = generateProducts(NUM_PRODUCTS);
  const { carts, cartItems } = generateCarts(users, products);
  const { orders, invoices, transactions } = generateOrders(users);

  let sqlScript = `-- ===========================
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

-- ===========================
-- Seed data
-- ===========================
  `;

  sqlScript += buildInsert(
    'user_account',
    [
      'id',
      'name',
      'email',
      'birthdate',
      'password_hash',
      'created_at',
      'updated_at',
    ],
    users,
  );
  sqlScript += buildInsert(
    'user_address',
    ['id', 'user_id', 'street', 'city'],
    addresses,
  );
  sqlScript += buildInsert(
    'user_profile',
    ['id', 'user_id', 'photo'],
    profiles,
  );
  sqlScript += buildInsert('role', ['id', 'name'], roles);
  sqlScript += buildInsert('user_role', ['user_id', 'role_id'], userRoles);
  sqlScript += buildInsert(
    'product',
    ['id', 'name', 'description', 'price', 'stock', 'category'],
    products,
  );
  sqlScript += buildInsert('cart', ['id', 'user_id'], carts);
  sqlScript += buildInsert(
    'cart_item',
    ['id', 'product_id', 'cart_id', 'quantity'],
    cartItems,
  );
  sqlScript += buildInsert(
    'order_record',
    ['id', 'user_id', 'date', 'status'],
    orders,
  );
  sqlScript += buildInsert(
    'order_invoice',
    ['id', 'order_record_id'],
    invoices,
  );
  sqlScript += buildInsert(
    'order_transaction',
    ['id', 'total_amount', 'description'],
    transactions,
  );

  console.log(sqlScript);
}

main();
