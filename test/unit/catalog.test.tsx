import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { getAllByRole, getByRole, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { Application } from "../../src/client/Application";
import { ExampleApi, CartApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";

import { CartState, CheckoutFormData, CheckoutResponse, Product, ProductShortInfo } from "../../src/common/types";

export const handlers = [
  rest.get("http://test.dev/api/products", (req, res, ctx) => {
    return res(ctx.json(products));
  }),
];

const server = setupServer(...handlers);

const products: ProductShortInfo[] = [
  { id: 111, name: "Name 1", price: 100 },
  { id: 222, name: "Name 2", price: 200 },
];
const product: Product = { ...products[0], description: "product description", material: "product material", color: "product color" };

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe("Общие требования", () => {
  it("В каталоге должны отображаться товары, список которых приходит с сервера", async () => {
    const basename = "/catalog";

    const api = new ExampleApi("http://test.dev");

    const cart = new CartApi();
    // @ts-ignore
    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { queryByText, container } = render(application);
    await waitFor(() => {
      expect(queryByText(products[0].name)).toBeInTheDocument();
      expect(queryByText(`$${products[0].price}`)).toBeInTheDocument();
      expect(queryByText(products[1].name)).toBeInTheDocument();
      expect(queryByText(`$${products[1].price}`)).toBeInTheDocument();
      expect(queryByText('hello item')).not.toBeInTheDocument();
      expect(queryByText('hello item price')).not.toBeInTheDocument();
    });
    // expect(product!.querySelector('.ProductItem-Name')?.textContent).toBe(products[0].name);
    // expect(product!.querySelector('.ProductItem-Price')?.textContent).toBe(`$${products[0].price}`);
  });
});
