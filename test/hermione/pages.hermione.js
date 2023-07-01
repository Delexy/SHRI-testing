describe('Страницы', async function () {
  it('Cтраницы главная, условия доставки, контакты должны иметь статическое содержимое', async function ({ browser }) {
    await browser.setWindowSize(1920, 1080);
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto('http://localhost:3000/hw/store');

    await page.waitForSelector('body', { timeout: 5000 });    

    await browser.assertView('main-page', 'body');
    const deliveryLink = await browser.$('[href*="/delivery"]');
    await deliveryLink.click();
    await browser.assertView('delivery-page', 'body', {
      screenshotDelay: '1000',
    });
    const contactsLink = await browser.$('[href*="/cart"]');
    await contactsLink.click();
    await browser.assertView('contacts-page', 'body', {
      screenshotDelay: '1000',
    });
  });
});
