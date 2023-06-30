import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
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

  it("Отрабатывает оформление заказа", async () => {
    const basename = `/cart`;
    const api = new StubApi("test");
    const productCount = 1;
    const initialCartState = { [product.id]: { ...product, count: productCount } };

    const cart = new StubCartApi(initialCartState);
    // @ts-ignore
    const store = initStore(api, cart);

    const cartApp = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );

    const { getByRole } = render(cartApp);

    const nameInput = await waitFor(() => getByRole("textbox", { name: "Name" }));
    const phoneInput = await waitFor(() => getByRole("textbox", { name: "Phone" }));
    const addressInput = await waitFor(() => getByRole("textbox", { name: "Address" }));
    const checkoutBtn = await waitFor(() => getByRole("button", { name: "Checkout" }));

    await userEvent.type(nameInput, "Test");
    await userEvent.type(phoneInput, "89148288888");
    await userEvent.type(addressInput, "Test");

    await userEvent.click(checkoutBtn);

    const wellDoneHeader = await waitFor(() => getByRole("heading", { name: "Well done!" }));

    expect(wellDoneHeader).toBeInTheDocument();
  });

  it("Проверка валидации номера на форме срабатывает корректно", async () => {
    const basename = `/cart`;
    const api = new StubApi("test");
    const productCount = 1;
    const initialCartState = { [product.id]: { ...product, count: productCount } };

    const cart = new StubCartApi(initialCartState);
    // @ts-ignore
    const store = initStore(api, cart);

    const cartApp = (
      <MemoryRouter initialEntries={[basename]}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </MemoryRouter>
    );

    const { getByRole } = render(cartApp);

    const nameInput = await waitFor(() => getByRole("textbox", { name: "Name" }));
    const phoneInput = await waitFor(() => getByRole("textbox", { name: "Phone" }));
    const addressInput = await waitFor(() => getByRole("textbox", { name: "Address" }));
    const checkoutBtn = await waitFor(() => getByRole("button", { name: "Checkout" }));

    await userEvent.type(nameInput, "111");
    await userEvent.type(phoneInput, "89135545544");
    await userEvent.type(addressInput, "11");
    await userEvent.click(checkoutBtn);

    expect(Array.from(phoneInput.classList)).not.toContain('is-invalid');
  });
});
