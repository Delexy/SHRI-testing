import React from 'react';
import { getAllByRole, getByRole, render } from '@testing-library/react';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';

describe('Общие требования', () => {
  it('В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
    const basename = '/';

    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);

    const headerLinks = getAllByRole(container, 'link', {
      name: /catalog|delivery|contacts|cart/i,
    });

    expect(headerLinks.length).toBe(4);
  });
  it('Название магазина в шапке должно быть ссылкой на главную страницу', () => {
    const basename = '/';

    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);

    const logoLink = getByRole(container, 'link', {
      name: /example store/i,
    });

    expect(logoLink.getAttribute('href')).toBe(basename);
  });
});
