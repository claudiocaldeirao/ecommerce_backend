import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@/app.module';

describe('E-commerce API E2E', () => {
  let app: INestApplication;
  let server: any;

  let token: string;
  let userId: string;
  let cartId: string;
  let productId: string;
  let cartItemId: string;

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
        email: 'Jordan.Brown@yahoo.com',
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

    productId = res.body[0].id;
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
      .post(`/cart-item/${cartId}/product/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 3 })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.quantity).toBe(3);

    cartItemId = res.body.id;
  });

  it('should remove product from cart', async () => {
    const res = await request(server)
      .delete(`/cart-item/${cartItemId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toHaveProperty('affected');
    expect(res.body.affected).toBe(1);
  });

  afterAll(async () => {
    await app.close();
  });
});
