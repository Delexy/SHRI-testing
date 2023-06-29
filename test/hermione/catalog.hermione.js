describe("Каталог", async function () {
  it("Содержимое корзины должно сохраняться между перезагрузками страницы", async function ({ browser }) {
    await browser.setWindowSize(1920, 1080);
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();
  
    await page.goto("http://localhost:3000/hw/store");
  
    const catalogLink = await browser.$('[href*="/catalog"]');
    await catalogLink.click();
    const itemDetailsLink = await browser.$('[href*="/catalog/"]');
    await itemDetailsLink.click();
    const addToCartBtn = await browser.$('.ProductDetails-AddToCart');
    await addToCartBtn.click();

    await browser.assertView("plain", ".navbar-nav", {
      delay: 1000
    });
    
    await page.reload();

    await browser.assertView("plain", ".navbar-nav", {
      delay: 2000
    });
  });
  });
  