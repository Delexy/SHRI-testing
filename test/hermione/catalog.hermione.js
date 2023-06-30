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
  });
  });
  