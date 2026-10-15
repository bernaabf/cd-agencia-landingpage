import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});const results=[];
 for(const width of [1280,360]){
 const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3000',{waitUntil:'networkidle'});await page.waitForTimeout(3000);
 const read=()=>page.evaluate(()=>{const c=document.querySelector('canvas'),s=document.querySelector('#inicio'),v=document.querySelector('.hero-stage-viewport'),cs=c?getComputedStyle(c):null;return {canvas:!!c,ready:c?.dataset.worldReady,tier:c?.dataset.worldTier,metrics:c?.dataset.worldMetrics?JSON.parse(c.dataset.worldMetrics):null,benchmark:c?.dataset.worldBenchmark?JSON.parse(c.dataset.worldBenchmark):null,progress:c?.dataset.worldProgress,hero:{height:s.offsetHeight,viewport:v.offsetHeight},canvasStyle:cs?{width:cs.width,height:cs.height,pointerEvents:cs.pointerEvents}:null,scrollY,journey:s.style.getPropertyValue('--journey-progress'),lenis:document.documentElement.classList.contains('lenis'),overflow:document.documentElement.scrollWidth>innerWidth}});
 await page.screenshot({path:`/private/tmp/cd-header-after-underlay-${width}-0.png`,style:'header { visibility: hidden }'});const start=await read();const acts=[];
 for(let i=0;i<4;i++){await page.locator('.hero-scroll-cue').click({force:true});await page.waitForTimeout(1900);acts.push(await read());await page.screenshot({path:`/private/tmp/cd-header-after-underlay-${width}-${i+1}.png`,style:'header { visibility: hidden }'});}
 await page.screenshot({path:`/private/tmp/cd-header-after-${width}.png`});
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(1000);const reduced=await read();
 results.push({width,start,acts,reduced,errors});await page.close();
 }
 fs.writeFileSync('/private/tmp/cd-header-browser-after.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
