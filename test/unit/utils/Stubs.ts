import { ExampleApi, CartApi } from '../../../src/client/api';
import { CartState, CheckoutFormData, Product as ProductType, ProductShortInfo } from '../../../src/common/types';

export class StubApi implements ExampleApi {
  constructor(private readonly basename: string) {}

  // @ts-ignore
  async getProducts() {
    return await Promise.resolve({ data: products });
  }

  // @ts-ignore
  async getProductById(id: number) {
    return await Promise.resolve({ data: products.find((item) => item.id == id) });
  }

  // @ts-ignore
  async checkout(form: CheckoutFormData, cart: CartState) {
    return await Promise.resolve({ data: { id: 1 } });
  }
}


export class StubCartApi {
  initialState: CartState;

  constructor(initialState: CartState) {
    this.initialState = initialState;
  }
  getState(): CartState {
      try {
          return this.initialState;
      } catch {
          return {};
      }
  }

  setState(cart: CartState) {
      this.initialState = cart;
  }
}

export const products: ProductShortInfo[] = [
  { id: 111, name: 'Name 1', price: 100 },
  { id: 222, name: 'Name 2', price: 200 },
];

export const product: ProductType = { ...products[0], description: 'product description', material: 'product material', color: 'product color' };
export const secondProduct: ProductType = { ...products[1], description: 'second product description', material: 'second product material', color: 'second product color' };
