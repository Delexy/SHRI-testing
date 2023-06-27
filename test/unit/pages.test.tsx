import React from 'react';
import { getAllByRole, getByRole, render, screen } from '@testing-library/react';
import { events } from '@testing-library/user-event';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { Application } from '../../src/client/Application';
import { ExampleApi, CartApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';

describe('Общие требования', () => {
  it('При выборе элемента из меню "гамбургера", меню должно закрываться', async () => {
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
  
    const toggleBtn = getByRole(container, 'link', {
      name: /toggle navigation/i,
    });
  
    await events.click(toggleBtn)
  
    // screen.logTestingPlaygroundURL();
  
    // expect(headerLinks.getAttribute('href')).toBe(basename);
  });
});
