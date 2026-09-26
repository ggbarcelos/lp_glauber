const {chromium} = require('playwright');
const fs = require('fs');
(async()=>{
const browser = await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{})});
const runs=[];
for(let i=0;i<3;i++){
 const context=await browser.newContext({viewport:{width:390,height:844},locale:'pt-BR',deviceScaleFactor:1});
 const page=await context.newPage();
 await page.route('**/api.emailjs.com/**',r=>r.abort());
 const cdp=await context.newCDPSession(page);
 await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:100,downloadThroughput:200000,uploadThroughput:100000});
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await page.addInitScript(()=>{window.metrics={lcp:0,cls:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});});
 await page.goto(process.env.TEST_BASE_URL || 'http://127.0.0.1:8000/',{waitUntil:'networkidle'});
 await page.waitForTimeout(1200);
 const initial=await page.evaluate(()=>({...window.metrics,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,dom:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,localBytes:performance.getEntriesByType('resource').filter(r=>r.name.startsWith(location.origin)).reduce((s,r)=>s+r.transferSize,0)}));

 runs.push(initial);
 await context.close();
}
fs.writeFileSync(process.argv[2] || '/tmp/gb-performance.json',JSON.stringify(runs,null,2));console.log(runs);await browser.close();
})();
