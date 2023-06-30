import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";

import { Application } from "../../src/client/Application";

import { initStore } from "../../src/client/store";

import { product, secondProduct, StubApi, StubCartApi } from "./utils/Stubs";
import { Cart } from "../../src/client/pages/Cart";

describe("Корзина", () => {
  it("В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней", async () => {
    const basename = "/";

    const api = new StubApi("test");

    const cart = new StubCartApi({
      [product.id]: { ...product, count: 5 },
      [secondProduct.id]: { ...secondProduct, count: 20 },
    });
    // @ts-ignore
    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );
    const { queryByText } = render(application);
    await waitFor(() => {
      expect(queryByText(`Cart (${Object.keys(cart.getState()).length})`)).toBeInTheDocument();
    });
  });

  it("Для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа", async () => {
    const basename = "/";

    const api = new StubApi("test");

    const productCount = 5;
    const cart = new StubCartApi({
      [product.id]: { ...product, count: productCount },
      [secondProduct.id]: { ...secondProduct, count: 1 },
    });
    // @ts-ignore
    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );
    const { queryByText } = render(application);
    await waitFor(() => {
      expect(queryByText(product.name)).toBeInTheDocument();
      expect(queryByText(`$${product.price}`)).toBeInTheDocument();
      expect(queryByText(productCount)).toBeInTheDocument();
      expect(queryByText(`$${productCount * product.price}`)).toBeInTheDocument();
      expect(queryByText(`$${productCount * product.price + secondProduct.price}`)).toBeInTheDocument();
    });
  });

  it('В корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
    const basename = "/cart";

    const api = new StubApi("test");

    const productCount = 5;
    const cart = new StubCartApi({
      [product.id]: {
        ...product,
        count: productCount,
      },
    });
    // @ts-ignore
    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );


    const { findByRole } = render(application);
    const clearCartBtn = await waitFor(() => findByRole("button", { name: "Clear shopping cart" }));
    await clearCartBtn.click();

    expect(cart.getState()).toEqual({});
  });

  it("Если корзина пустая, должна отображаться ссылка на каталог товаров", async () => {
    const basename = "/";

    const api = new StubApi("test");
    const cart = new StubCartApi({});
    // @ts-ignore
    const store = initStore(api, cart);

    const application = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );
    const { queryByRole } = render(application);
    const clearCartBtn = await waitFor(() =>
      queryByRole("link", {
        name: "catalog",
      })
    );

    expect(clearCartBtn).toBeInTheDocument();
  });
});
