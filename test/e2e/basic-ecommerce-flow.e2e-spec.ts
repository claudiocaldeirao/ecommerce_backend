import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { Product } from '@/modules/product/entity/product.entity';

describe('E-commerce API E2E', () => {
  let app: INestApplication;
  let server: any;

  let token: string;
  let userId: string;
  let cartId: string;
  let product: Product;
  const quantity = 3;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer();
  });

  const loginUser = async () => {
    const res = await request(server)
      .post('/auth/login')
      .send({
        email: 'John95@gmail.com',
        password: '123',
      })
      .expect(201);

    return res.body;
  };

  it('should login the user', async () => {
    const { access_token, user_id } = await loginUser();

    expect(access_token).toBeDefined();
    expect(user_id).toBeDefined();

    token = access_token;
    userId = user_id;
  });

  it('should fetch product list and capture a productId', async () => {
    const res = await request(server).get('/products').expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    product = res.body[0];
  });

  it('should fetch the user cart', async () => {
    const res = await request(server)
      .get(`/cart/user/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('id');
    cartId = res.body.id;
  });

  it('should add product to cart', async () => {
    const res = await request(server)
      .post(`/cart-item/${cartId}/product/${product.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: quantity })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.quantity).toBe(quantity);
  });

  it('should checkout the cart and create a new order', async () => {
    const res = await request(server)
      .post(`/orders/checkout-from-cart`)
      .set('Authorization', `Bearer ${token}`)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('status', 'processing');
    expect(res.body).toHaveProperty('transaction');
    expect(res.body.transaction).toHaveProperty('total_amount');

    const totalExpected = (product.price * quantity).toString();
    expect(res.body.transaction.total_amount).toEqual(totalExpected);
  });

  afterAll(async () => {
    await app.close();
  });
});
