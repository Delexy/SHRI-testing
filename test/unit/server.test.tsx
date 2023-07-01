// @ts-nocheck
const request = require('supertest');
let app;
beforeAll(async () => {
  app = (await import('../../src/server/index')).default;
});

describe('Тестирование сервера', () => {
  it('Сервер отдает корректную информацию при запросе по ID', async () => {
    const productId = 1;
    const res = await request(app).get(`/hw/store/api/products/${productId}${process.env['BUG_ID'] == 3 ? '?bug_id=3' : ''}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(productId);
  });

  it('Сервер отдает полную краткую информацию при запросе', async () => {
    const res = await request(app).get(`/hw/store/api/products${process.env['BUG_ID'] == 1 ? '?bug_id=1' : ''}`);
    expect(res.status).toBe(200);
    const firstProduct = res.body[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('name');
    expect(firstProduct).toHaveProperty('price');
  });

  it('Сервер при оформлении заказа отдает корректный ID заказа', async () => {
    const res = await request(app).post(`/hw/store/api/checkout${process.env['BUG_ID'] == 2 ? '?bug_id=2' : ''}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(+res.body.id).toBeLessThanOrEqual(1000000);
  });
});
