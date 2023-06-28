describe("Общие требования", async function () {
it("На ширине меньше 576px навигационное меню должно скрываться за гамбургер и при клике на пункт меню закрываться", async function ({ browser }) {
  await browser.setWindowSize(320, 1080);
  const puppeteer = await browser.getPuppeteer();
  const [page] = await puppeteer.pages();

  await page.goto("http://localhost:3000/hw/store");

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
