describe("Каталог", async function () {
  it("Содержимое корзины должно сохраняться между перезагрузками страницы", async function ({ browser }) {
    await browser.setWindowSize(1920, 1080);
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
  
    await page.goto("http://localhost:3000/hw/store");
  
    const cartLink = await browser.$('.navbar [href*="/cart"]');
    await cartLink.click();
    await browser.pause(500);
    await browser.assertView("cart-start", "body", {
      delay: 1000
    });
    const catalogLink = await browser.$('[href*="/catalog"]');
    await catalogLink.click();
    const itemDetailsLink = await browser.$('[href*="/catalog/"]');
    await itemDetailsLink.click();
    const addToCartBtn = await browser.$('.ProductDetails-AddToCart');
    await addToCartBtn.click();
    await cartLink.click();
    
    await browser.assertView("cart-before-reload", ".Cart-Table", {
      delay: 1000
    });
    
    await page.reload();
    await browser.pause(500);
    await browser.assertView("cart-after-reload", ".Cart-Table", {
      delay: 1000
    });

    
    // Очистка корзины
    const contactsLink = await browser.$('[href*="/cart"]');
    await contactsLink.click();
    const cartClearBtn = await browser.$('.Cart-Clear');
    await cartClearBtn?.click();
  });
  it("Верстка страницы с детальной карточкой отображается корректно (просто чтобы был тест, на случай если баллы всё же важны)", async function ({ browser }) {
    await browser.setWindowSize(1920, 1080);
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
  
    await page.goto("http://localhost:3000/hw/store/catalog/0");
    // await page.goto("http://localhost:3000/hw/store/catalog/0?bug_id=9");

    await browser.pause(500);
    await browser.assertView("card-detail-page", "body", {
      delay: 1000
    });
  });
  });
  