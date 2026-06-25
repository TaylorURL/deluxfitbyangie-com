import puppeteer from 'puppeteer-core'

const URL = 'http://localhost:5174/preview-portal.html'
const widths = [375, 768, 1280]

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser',
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

for (const w of widths) {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 })
  await new Promise(r => setTimeout(r, 600))
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  const overflow = metrics.scrollWidth - metrics.innerWidth
  console.log(`w=${w} ->`, JSON.stringify(metrics), `| horizontalOverflow=${overflow > 1 ? 'YES(' + overflow + 'px)' : 'none'}`)
  await page.screenshot({ path: `/tmp/portal-${w}.png`, fullPage: true })
  await page.close()
}

await browser.close()
console.log('done')
