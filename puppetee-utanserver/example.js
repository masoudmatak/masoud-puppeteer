const puppeteer = require('puppeteer');
 
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://nytand.se');
  await page.screenshot({path: 'example.pdf'});
 
  await browser.close();
})();