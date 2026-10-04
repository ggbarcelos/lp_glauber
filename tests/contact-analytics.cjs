// Isolated runtime checks. EmailJS and telemetry are mocked; no browser or network.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function element(value='') {
 const classes=new Set();return {value,hidden:true,disabled:false,innerHTML:'Submit',dataset:{},style:{},attrs:{},listeners:{},classList:{toggle(k,v){v?classes.add(k):classes.delete(k)},contains:k=>classes.has(k)},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.listeners[k]=fn},focus(){this.focused=true},querySelector(){return null},closest(){return this.wrapper},appendChild(el){this.error=el}};
}
function analytics(signal={}) {
 const sent=[],handlers={};const config={enabled:true,campaigns:{utm_source:['newsletter']},send:p=>sent.push(p)};
 const context={window:{GB_ANALYTICS_CONFIG:config},document:{addEventListener:(k,fn)=>handlers[k]=fn},location:{pathname:'/index.html',href:'https://test.local/index.html',search:'?utm_source=newsletter&utm_campaign=someone@example.com',origin:'https://test.local'},navigator:signal,URL,URLSearchParams,Promise,Object};vm.runInNewContext(fs.readFileSync('js/analytics.js','utf8'),context);
 return {api:context.window.GBAnalytics,sent,handlers};
}
function form(mode='success') {
 const ids={};for(const id of ['contactForm','contactFields','contact','name','message','formFallback','formStatus','projectType'])ids[id]=element();
 const button=element(); ids.contactForm.querySelector=()=>button;ids.contactForm.reset=()=>{ids.name.value='';ids.message.value='';};
 for(const id of ['name','contact','message']) {ids[id].wrapper=element();ids[id].wrapper.querySelector=()=>ids[id].wrapper.error||null;}
 const events=[],callbacks=[];let calls=0,resolve,reject;const t={err_name:'Name',err_contact:'Phone',err_message:'Message',err_fields:'Fields',sending:'Sending',sent_ok:'Accepted, delivery unverified',send_error:'Failed',send_btn_original:'Submit'};
 const context={window:{__i18n:{applyLang(){},detectLang:()=> 'pt',translations:{pt:t}},GBAnalytics:{track:(...p)=>events.push(p)},matchMedia:()=>({matches:true}),addEventListener(){}},document:{documentElement:{lang:'pt'},body:{classList:element().classList},addEventListener:(k,fn)=>{if(k==='DOMContentLoaded')callbacks.push(fn)},querySelector:()=>null,querySelectorAll:()=>[],getElementById:id=>ids[id],createElement:()=>element()},setTimeout:mode==='timeout'?(fn)=>setTimeout(fn,0):setTimeout,clearTimeout,requestAnimationFrame:fn=>fn(),Promise};
 if(mode!=='missing')context.window.emailjs={send(){calls++;return new Promise((res,rej)=>{resolve=res;reject=rej;});}};
 vm.runInNewContext(fs.readFileSync('js/main.js','utf8'),context);callbacks.forEach(fn=>fn());
 const submit=()=>ids.contactForm.listeners.submit({preventDefault(){}});const valid=()=>{ids.name.value='Local test';ids.contact.value='(51) 99999-0000';ids.message.value='Simulated contact request';};
 return {ids,button,events,submit,valid,resolve:()=>resolve({status:200}),reject:()=>reject(Error('test')),calls:()=>calls};
}
(async()=>{
 for(const signal of [{},{doNotTrack:'1'},{globalPrivacyControl:true}]){const a=analytics(signal);a.api.track('whatsapp_click','hero');assert.equal(a.sent.length,0);a.api.setConsent(true);a.api.track('whatsapp_click','personal@example.com','phone-123');assert.equal(a.sent.length,Object.keys(signal).length?0:1);if(a.sent.length){assert.deepEqual(JSON.parse(JSON.stringify(a.sent[0])),{event:'whatsapp_click',page:'index.html',origin:'content',type:'unspecified',utm_source:'newsletter'});a.api.track('unknown');assert.equal(a.sent.length,1);a.api.setConsent(false);a.api.track('email_click');assert.equal(a.sent.length,1);}}
 const a=analytics();a.api.setConsent(true);a.handlers.click({target:{closest:()=>({href:'mailto:public@example.com',dataset:{origin:'footer'},closest:()=>null,matches:()=>false})}});assert.equal(a.sent[0].event,'email_click');assert.equal(a.sent[0].origin,'footer');a.handlers.click({target:{closest:()=>({href:'https://wa.me/5551980120387?text=private',dataset:{origin:'hero',projectType:'web'},closest:()=>null,matches:()=>false})}});assert.equal(a.sent[1].event,'whatsapp_click');assert.equal(a.sent[1].origin,'hero');assert.equal(JSON.stringify(a.sent).includes('private'),false);
 const f=form();await f.submit();assert.equal(f.calls(),0);assert.equal(f.ids.name.focused,true);f.valid();f.ids.contactForm.listeners.input();f.ids.contactForm.listeners.change();assert.equal(f.events.filter(e=>e[0]==='form_start').length,1);const first=f.submit();assert.equal(f.button.disabled,true);assert.equal(f.ids.contactForm.attrs['aria-busy'],'true');await f.submit();assert.equal(f.calls(),1);f.resolve();await first;assert.equal(f.button.disabled,false);assert.equal(f.ids.formStatus.textContent,'Accepted, delivery unverified');assert.equal(f.ids.name.value,'');
 const fail=form();fail.valid();const pending=fail.submit();fail.reject();await pending;assert.equal(fail.ids.formFallback.hidden,false);assert.equal(fail.button.disabled,false);assert.equal(fail.ids.name.value,'Local test');const retry=fail.submit();fail.resolve();await retry;assert.equal(fail.calls(),2);
 for(const mode of ['missing','timeout']){const test=form(mode);test.valid();await test.submit();assert.equal(test.ids.formStatus.textContent,'Failed');assert.equal(test.button.disabled,false);assert.equal(test.ids.formFallback.hidden,false);}
 console.log('PASS: consent, DNT/GPC, filtered telemetry, email clicks; form validation, one start, pending state, duplicate guard, success, failure, retry, missing SDK and timeout. No real sends.');
})().catch(e=>{console.error(e);process.exitCode=1});
