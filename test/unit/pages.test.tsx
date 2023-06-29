import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';

import { MemoryRouter } from 'react-router';
import { Provider } from 'react-redux';

import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';

describe('Страницы', () => {
  it('В магазине должны быть страницы: главная, каталог, условия доставки, контакты', async () => {
    const basename = '/hw/store';
    const user = userEvent.setup();

    const api = new ExampleApi(basename);
    const cart = new CartApi();
    // @ts-ignore
    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={['/']} initialIndex={0}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getByText } = render(application);
    expect(getByText(/Welcome to Example store!/i)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /Delivery/i }));
    expect(screen.getByRole('heading', { name: /delivery/i })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /contacts/i }));
    expect(screen.getByRole('heading', { name: /Contacts/i })).toBeInTheDocument();
    
    await user.click(screen.getByRole('link', { name: /Catalog/i }));
    expect(screen.getByRole('heading', { name: /Catalog/i })).toBeInTheDocument();
  });
});
