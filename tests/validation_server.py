from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit,parse_qs
import re,json
# Test-only server: mocks EmailJS and analytics, never used by production HTML.
root=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*args,**kwargs): super().__init__(*args,directory=str(root),**kwargs)
 def do_GET(self):
  parsed=urlsplit(self.path); f=root/(parsed.path.lstrip('/') or 'index.html')
  if f.suffix!='.html' or not f.is_file(): return super().do_GET()
  mode=parse_qs(parsed.query).get('mock',['success'])[0]
  html=f.read_text()
  mock='''<script>window.GBGoogleAnalytics={configured:()=>true};window.testEvents=[]; window.testSendCount=0; window.testMetrics={lcp:0,cls:0};
try {new PerformanceObserver(l=>{for(const e of l.getEntries())window.testMetrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.testMetrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});}catch{}
window.emailjs={init(){},send(){window.testSendCount++;return new Promise((resolve,reject)=>setTimeout(()=>MODE==='failure'?reject(Error('simulated')):resolve({status:200}),1000));}};
if(MODE==='missing')delete window.emailjs;
addEventListener('load',()=>{const box=document.createElement('output');box.id='test-observation';box.hidden=true;document.body.append(box);setInterval(()=>{box.textContent=JSON.stringify({events:window.testEvents,sends:window.testSendCount,...window.testMetrics,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,dom:performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd,localBytes:performance.getEntriesByType('resource').filter(r=>r.name.startsWith(location.origin)).reduce((s,r)=>s+r.transferSize,0)});},100);});</script>'''.replace('MODE',json.dumps(mode))
  html=html.replace('<head>','<head>'+mock,1)
  html=re.sub(r'<script[^>]+src="[^"]*emailjs[^\"]*"[^>]*></script>','',html)
  html=html.replace('<script src="js/analytics-config.js"></script>','<script>window.GB_ANALYTICS_CONFIG={enabled:true,googleMeasurementId:"G-TJQEC00DF9",campaigns:{},send(p){window.testEvents.push(p)},onConsent(){}};</script>')
  # Versioned script tags also supported; avoid loading real providers in fixture.
  html=re.sub(r'<script src="js/analytics-config.js\?[^\"]*"></script>','<script>window.GB_ANALYTICS_CONFIG={enabled:true,googleMeasurementId:"G-TJQEC00DF9",campaigns:{},send(p){window.testEvents.push(p)},onConsent(){}};</script>',html)
  html=re.sub(r'<script src="js/(?:google-analytics|clarity)\.js[^\"]*"></script>','',html)
  data=html.encode();self.send_response(200);self.send_header('Content-Type','text/html; charset=utf-8');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
ThreadingHTTPServer(('127.0.0.1',8001),Handler).serve_forever()
