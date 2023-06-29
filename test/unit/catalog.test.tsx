import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Application } from '../../src/client/Application';
import { ProductDetails } from '../../src/client/components/ProductDetails';

import { initStore } from '../../src/client/store';

import { product, StubApi, products, StubCartApi } from './utils/Stubs';
import { CartState } from '../../src/common/types';

describe('Каталог', () => {
  it('В каталоге должны отображаться товары, список которых приходит с сервера', async () => {
    const basename = '/catalog';

    const api = new StubApi('test');

    const cart = new StubCartApi({});
    // @ts-ignore
    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { queryByText, queryAllByRole, queryByRole } = render(application);
    await waitFor(() => {
      expect(queryByText(products[0].name)).toBeInTheDocument();
      expect(queryByText(`$${products[0].price}`)).toBeInTheDocument();
      expect(queryByText(products[1].name)).toBeInTheDocument();
      expect(queryByText(`$${products[1].price}`)).toBeInTheDocument();
      expect(queryAllByRole('link', { name: `Details` })[0]).toBeInTheDocument();
      expect(queryByText('hello item')).not.toBeInTheDocument();
      expect(queryByText('hello item price')).not.toBeInTheDocument();
      expect(queryByRole('link', { name: `/catalog/randomProductId` })).not.toBeInTheDocument();
    });
  });

  it('На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async () => {
    const basename = `/catalog/${product.id}`;

    const api = new StubApi('test');

    const cart = new StubCartApi({});
    // @ts-ignore
    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <ProductDetails product={product} />
        </Provider>
      </MemoryRouter>
    );
    const { queryByText, getByRole, getByText } = render(application);
    await waitFor(() => {
      expect(queryByText(product.name)).toBeInTheDocument();
      expect(queryByText(`$${product.price}`)).toBeInTheDocument();
      expect(getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
      expect(getByText(product.material)).toBeInTheDocument();
      expect(getByText(product.color)).toBeInTheDocument();
      expect(getByText(product.description)).toBeInTheDocument();
    });
  });

  it('Если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async () => {
    const basename = `/catalog/${product.id}`;

    const api = new StubApi('test');

    const initialCartState = { [product.id]: { ...product, count: 1 } } as CartState;

    const cart = new StubCartApi(initialCartState);
    // @ts-ignore
    const store = initStore(api, cart);

    const detail = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <ProductDetails product={product} />
        </Provider>
      </MemoryRouter>
    );

    const catalog = (
      <MemoryRouter initialEntries={['/catalog']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getByText: detailGetByText, container: detailContainer } = render(detail);
    const { getAllByText: catalogGetAllByText, container: catalogContainer } = render(catalog);

    await waitFor(() => {
      expect(detailGetByText(/item in cart/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(catalogGetAllByText(/item in cart/i)[0]).toBeInTheDocument();
    });
  });

  it('Если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
    const basename = `/catalog/${product.id}`;

    const api = new StubApi('test');

    const productCount = 1;
    const initialCartState = { [product.id]: { ...product, count: productCount } } as CartState;

    const cart = new StubCartApi(initialCartState);
    // @ts-ignore
    const store = initStore(api, cart);

    const detail = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <ProductDetails product={product} />
        </Provider>
      </MemoryRouter>
    );

    const { getByText: detailGetByText } = render(detail);

    const add2CartBtn = await waitFor(() => detailGetByText(/add to cart/i));
    add2CartBtn.click();
    expect(store.getState().cart[product.id].count).toBe(productCount + 1);
  });
});
