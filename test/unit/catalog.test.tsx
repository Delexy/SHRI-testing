import React from 'react';
import { getAllByRole, getByRole, render, screen, waitFor } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Catalog } from '../../src/client/pages/Catalog';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';

import { CartState, CheckoutFormData, CheckoutResponse, Product, ProductShortInfo } from '../../src/common/types';

const products: ProductShortInfo[] = [
  { id: 1, name: 'Name 1', price: 100 },
  { id: 2, name: 'Name 2', price: 200 },
];
const product: Product = { ...products[0], description: 'product description', material: 'product material', color: 'product color' };

class StubApi {
  constructor(private readonly basename: string) {}

  // @ts-ignore
  getProducts() {
    return products;
  }

  // @ts-ignore
  async getProductById(id: number) {
    return Promise.resolve(product);
  }

  // @ts-ignore
  async checkout(form: CheckoutFormData, cart: CartState) {
    return Promise.resolve();
  }
}

describe('Общие требования', () => {
  it('В каталоге должны отображаться товары, список которых приходит с сервера', async () => {
    const basename = '/';

    const api = new StubApi(basename);
    const cart = new CartApi();
    // @ts-ignore
    const store = initStore(api, cart);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);

    waitFor(() => {

      console.log(container.outerHTML);
    });


    // const headerLinks = getAllByRole(container, 'link', {
    //   name: /catalog|delivery|contacts|cart/i,
    // });

    // expect(headerLinks.length).toBe(4);
  });
});
