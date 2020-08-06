const puppeteer = require('puppeteer');
 
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://nytand.se');
  await page.screenshot({path: 'bildenMas.jpg'});
 
  await browser.close();
})();