# 🧾 Functional Requirements – E-commerce Purchase Flow

## 1. Product Selection and Cart Management

**FR-1.1:** The system shall allow users to browse and view available products with details such as name, image, price, and description.

**FR-1.2:** The system shall allow users to add products to the shopping cart.

**FR-1.3:** The system shall allow users to modify quantities or remove items from the shopping cart.

**FR-1.4:** The system shall display a real-time summary of the cart, including subtotal and estimated shipping.

## 2. Checkout Process

**FR-2.1:** The system shall guide the user through a checkout process divided into steps:

- Personal information

- Shipping address

- Shipping method

- Payment method

**FR-2.2:** The system shall validate all mandatory fields before allowing the user to proceed.

**FR-2.3:** The system shall store the user’s checkout data temporarily until the order is confirmed.

## 3. Payment Processing

**FR-3.1:** The system shall support multiple payment methods (e.g., credit card, debit, bank slip, Pix).

**FR-3.2:** The system shall integrate with a payment gateway to securely process transactions.

**FR-3.3:** Upon successful payment authorization, the system shall create an order record with a “Paid” status.

**FR-3.4:** If the payment fails, the system shall notify the user and allow retry or method change.

## 4. Invoice Generation

**FR-4.1:** The system shall generate a digital invoice (in PDF or structured data format) immediately after payment confirmation.

**FR-4.2:** The invoice shall include:

- Customer information

- Order items, quantities, and prices

- Payment confirmation details

- Unique invoice number and order ID

- Date of issue

**FR-4.3:** The invoice shall be available to the user via email and in their account order history.

## 5. Order Fulfillment (Logistics Processing)

**FR-5.1:** Once payment is confirmed, the system shall mark the order as "Processing" and notify the fulfillment team.

**FR-5.2:** The system shall provide a picking list with product locations, quantities, and packaging instructions.

**FR-5.3:** The system shall update the order status to "Packed" once items are prepared for shipping.

## 6. Invoice and Tax Document Handling

**FR-6.1:** For regions where legally required (e.g., Brazil), the system shall generate and attach a legal electronic tax invoice (NF-e).

**FR-6.2:** The system shall ensure that both the commercial invoice and the tax invoice are attached to the shipment or sent via email.

**FR-6.3:** All invoice documents shall be stored and accessible in the user’s account for download.

## 7. Shipment and Tracking

**FR-7.1:** The system shall integrate with shipping carriers to register the shipment and retrieve a tracking code.

**FR-7.2:** The system shall update the order status to "Shipped" and notify the user with tracking information.

**FR-7.3:** The system shall provide real-time tracking updates in the user's order history page.

## 8. Delivery Confirmation

**FR-8.1:** The system shall receive delivery confirmation from the carrier (via webhook or manual input).

**FR-8.2:** Upon confirmation, the system shall update the order status to "Delivered".

**FR-8.3:** The system shall notify the customer of successful delivery and request optional feedback.

## 9. Post-Sale (Evaluation and Support)

**FR-9.1:** The system shall send a follow-up email after delivery, inviting the user to review the product and rate their experience.

**FR-9.2:** The system shall allow users to submit support tickets for returns, refunds, or issues.

**FR-9.3:** The system shall link customer service actions (e.g., refund, exchange) to the original order and invoice records.
