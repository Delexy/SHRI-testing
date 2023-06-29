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

describe('Корзина', () => {
  it('В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async () => {
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
      screen.logTestingPlaygroundURL();
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
});
