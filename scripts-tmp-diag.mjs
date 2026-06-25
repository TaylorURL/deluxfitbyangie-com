import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath:'/usr/bin/chromium-browser', headless:'new', args:['--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width:375, height:900 })
await page.goto('http://localhost:5174/preview-portal.html',{waitUntil:'networkidle0'})
await new Promise(r=>setTimeout(r,500))
const offenders = await page.evaluate(() => {
  const vw = window.innerWidth, out = []
  document.querySelectorAll('*').forEach(el => {
    const r = el.getBoundingClientRect()
    if (r.right > vw + 1) out.push({ tag: el.tagName, cls:(el.className||'').toString().slice(0,90), w:Math.round(r.width), right:Math.round(r.right) })
  })
  return out.slice(0,30)
})
console.log(JSON.stringify(offenders,null,1))
await browser.close()
