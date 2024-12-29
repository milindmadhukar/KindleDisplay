const puppeteer = require('puppeteer');
const execFile = require('child_process').execFile;

async function takeScreenshot() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setViewport({ width: 600, height: 800 });

  // TO CHANGE
  await page.goto(process.env.SCREENSHOT_URL || 'https://darksky.net/details/40.7127,-74.0059/2021-1-6/us12/en');
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });

  await page.screenshot({
    path: '/tmp/screenshot.png',
  });

  await browser.close();

  await convert('/tmp/screenshot.png');
}

function convert(filename) {
  return new Promise((resolve, reject) => {
    const args = [
      filename,
      '-gravity', 'center',
      '-extent', '600x800',
      '-colorspace', 'gray',
      '-depth', '8',
      filename
    ];
    execFile('convert', args, (error, stdout, stderr) => {
      if (error) {
        console.error({ error, stdout, stderr });
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Run immediately
takeScreenshot();
