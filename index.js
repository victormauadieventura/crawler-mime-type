const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://slick.pl/kb/htaccess/complete-list-mime-types/');
  // await page.screenshot({ path: 'example.png' });

  await page.waitForSelector('table', { timeout: 10000 });

  try {
    const tableList = await page.evaluate(() => Array.from(document.querySelectorAll('table tbody tr'), (e) => {
      const { children } = e;

      const childNodes = Array.from(children, (child) => child.innerText);

      const mimeType = childNodes[1] || '';
      let ext = childNodes[2] || '';

      ext = ext.replace('.', '');

      return {
        mimeType,
        ext,
      };
    }));

    await fs.writeFile('file-types.json', JSON.stringify(tableList, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Falha ao salvar o arquivo:', err);
        throw err;
      }
      console.log('Arquivo salvo com sucesso!');
    });
  } catch (error) {
    console.log(error);
  }

  await browser.close();
})();
