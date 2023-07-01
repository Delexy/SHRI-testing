describe("Общие требования", async function () {
  describe("Вёрстка должна адаптироваться под ширину экрана", () => {
    it("Верстка соответсвует скриншоту на 1920", async function () {
      const puppeteer = await this.browser.getPuppeteer();
      const [page] = await puppeteer.pages();

      await page.goto("http://localhost:3000/hw/store");

      await this.browser.setWindowSize(1920, 1080);
      await this.browser.assertView("plain", "body");
    });
    it("Верстка соответсвует скриншоту на 320", async function () {
      const puppeteer = await this.browser.getPuppeteer();
      const [page] = await puppeteer.pages();

      await page.goto("http://localhost:3000/hw/store");

      await this.browser.setWindowSize(320, 2000);
      await this.browser.assertView("plain", "body");
    });
  });
  it("На ширине меньше 576px навигационное меню должно скрываться за гамбургер и при клике на пункт меню закрываться", async function ({ browser }) {
    await browser.setWindowSize(320, 1080);
    const puppeteer = await browser.getPuppeteer();
    const [page] = await puppeteer.pages();

    await page.goto("http://localhost:3000/hw/store");
    // await page.goto("http://localhost:3000/hw/store?bug_id=4"); // Проверка бага

    await page.waitForSelector('.navbar', {timeout: 5000});
    await browser.assertView("plain", ".navbar");
    const toggler = await browser.$('.navbar-toggler');
    await toggler.click();
    await browser.assertView("opened", ".navbar", {
      screenshotDelay: '1000'
    });
    const firstLink = await browser.$('.nav-link:first-of-type');
    await firstLink.click();
    await page.waitForSelector('.navbar', {timeout: 5000});
    await browser.assertView("end", ".navbar", {
      screenshotDelay: '1000'
    });
  });
});
