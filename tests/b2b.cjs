// Run with Playwright available through NODE_PATH; see docs/B2B-VALIDACAO.md.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8000';
const pages = ['index.html', 'desenvolvimento-saas.html', 'desenvolvimento-web.html', 'desenvolvimento-mobile-desktop.html', 'dev-as-a-service.html', 'case-native-ip.html'];
let checks = 0;
const ok = (v, message) => { assert.ok(v, message); checks++; };
(async () => {
    const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    try {
        const context = await browser.newContext({ locale: 'pt-BR', reducedMotion: 'reduce' });
        const errors = [], broken = [];
        await context.route('**/api.emailjs.com/**', route => { throw new Error('Unexpected real EmailJS request: ' + route.request().url()); });
        await context.route('**/@emailjs/browser@4/dist/email.min.js', route => route.fulfill({ contentType: 'text/javascript', body: 'window.emailjs={init(){},send(){return Promise.reject(new Error("Mock only"))}};' }));
        const page = await context.newPage();
        page.on('pageerror', e => errors.push(e.message));
        page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) broken.push(r.url()); });
        for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 900 });
            for (const file of pages) {
                await page.goto(`${base}/${file}`);
                const audit = await page.evaluate(() => {
                    const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
                    const canonical = document.querySelector('[rel=canonical]')?.href;
                    const headings = [...document.querySelectorAll('h1')];
                    const localLinks = [...document.querySelectorAll('a[href],img[src],script[src],link[href],source[srcset]')].map(e => e.getAttribute('href') || e.getAttribute('src') || e.getAttribute('srcset')).filter(Boolean);
                    const badImgs = [...document.images].filter(e => !e.hasAttribute('alt') || !Number(e.getAttribute('width')) || !Number(e.getAttribute('height'))).map(e => e.src);
                    const missingKeys = [...document.querySelectorAll('[data-i18n]')].filter(e => ['pt','en'].some(l => !Object.hasOwn(window.__i18n.translations[l], e.dataset.i18n))).map(e => e.dataset.i18n);
                    const schemas = [...document.querySelectorAll('[type="application/ld+json"]')].map(e => JSON.parse(e.textContent));
                    return { duplicateIds: ids.length !== new Set(ids).size, canonical, h1: headings.length, localLinks, badImgs, missingKeys, schemas: schemas.length, title: document.title, description: document.querySelector('[name=description]')?.content, og: document.querySelector('[property="og:url"]')?.content, overflow: document.documentElement.scrollWidth > innerWidth };
                });
                ok(!audit.duplicateIds, `${file}: duplicate IDs`);
                ok(audit.h1 === 1, `${file}: one H1`);
                ok(audit.schemas > 0 && audit.description && audit.title, `${file}: metadata`);
                ok(audit.canonical === 'https://glauberbarcelos.com.br/' + (file === 'index.html' ? '' : file), `${file}: canonical`);
                ok(audit.og === audit.canonical, `${file}: OG URL`);
                ok(!audit.overflow, `${file}: overflow at ${width}`);
                ok(!audit.badImgs.length, `${file}: image dimensions/alt ${audit.badImgs}`);
                ok(!audit.missingKeys.length, `${file}: missing translations ${audit.missingKeys}`);
                for (const href of audit.localLinks) {
                    const url = new URL(href, `${base}/${file}`);
                    if (url.origin !== base) continue;
                    const local = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
                    ok(fs.existsSync(local), `${file}: missing local target ${href}`);
                    if (url.hash && local.endsWith('.html')) {
                        const markup = fs.readFileSync(local, 'utf8');
                        ok(markup.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${file}: missing anchor ${href}`);
                    }
                }
                // Actual lazy images must decode; scroll instantly (CSS smooth scrolling is reduced).
                await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(e => e.loading = 'eager'));
                await page.waitForFunction(() => [...document.images].every(i => i.complete));
                ok(await page.evaluate(() => [...document.images].every(i => i.naturalWidth > 0)), `${file}: image load`);
            }
        }
        await page.goto(base);
        await page.setViewportSize({ width:390, height:844 });
        await page.locator('.nav-toggle').click();
        ok(await page.locator('.nav-toggle').getAttribute('aria-expanded') === 'true', 'Mobile menu opens');
        await page.keyboard.press('Escape');
        ok(await page.locator('.nav-toggle').evaluate(e => e === document.activeElement), 'Escape restores focus');
        await page.locator('.nav-toggle').click();
        await page.locator('nav a[href="#diagnostico"]').click();
        ok(await page.locator('.nav-toggle').getAttribute('aria-expanded') === 'false', 'Mobile navigation closes');
        await page.locator('[data-diagnostic-start]').click();
        await page.locator('.diagnostic-form [type=submit]').click();
        ok((await page.locator('[data-diagnostic-error]').innerText()).length > 0, 'Diagnostic requires a selection');
        await page.keyboard.press('Space'); // first focused native radio, SaaS
        await page.locator('.diagnostic-form [type=submit]').click();
        await page.locator('[data-back]').click();
        ok(await page.locator('input[value=saas]').isChecked(), 'Back preserves answer');
        await page.locator('.diagnostic-form [type=submit]').click();
        for (const value of ['idea','customers','scope']) { await page.locator(`input[value=${value}]`).check(); await page.locator('.diagnostic-form [type=submit]').click(); }
        ok(await page.locator('[data-result]').isVisible(), 'Diagnostic completes');
        ok(await page.locator('[data-result] h3').evaluate(e => e === document.activeElement), 'Result gets focus');
        ok(await page.locator('[data-result] h3').evaluate(e => e.getBoundingClientRect().top >= document.querySelector('.site-nav').getBoundingClientRect().bottom), 'Result heading clears sticky navigation');
        const wa = new URL(await page.locator('[data-whatsapp]').getAttribute('href'));
        ok(wa.searchParams.get('text').includes('SaaS') && wa.searchParams.get('text').includes('Ideia a validar'), 'Readable encoded WhatsApp summary');
        await page.setViewportSize({width:1440,height:1000});
        await page.locator('#langToggle').click();
        ok((await page.locator('[data-summary]').innerText()).includes('Idea to validate'), 'Result re-translates');
        await page.locator('#langToggle').click();
        // Exercise all other objectives and result edits.
        for (const objective of ['app','architecture','ai']) {
            await page.locator('[data-edit]').click();
            for (const value of [objective,'operating','both','integration']) { await page.locator(`input[value=${value}]`).check(); await page.locator('.diagnostic-form [type=submit]').click(); }
            ok((await page.locator('[data-advice]').innerText()).includes('APIs'), 'Result considers obstacle');
            ok((await page.locator('[data-case]').getAttribute('href')).includes(objective === 'ai' ? 'case-banana' : 'case-samu'), 'Relevant case');
        }
        // Form: validation, success, rejection, missing SDK, synchronous failure. No real sends.
        await page.locator('#contactForm [type=submit]').click();
        ok(await page.locator('#name').getAttribute('aria-invalid') === 'true', 'Form validation');
        ok(await page.locator('#name').evaluate(e => e === document.activeElement), 'First invalid field focus');
        async function fill() {
            await page.locator('#name').fill('Pessoa Teste');
            await page.locator('#contact').fill('51999990000');
            await page.locator('#message').fill('Contexto fictício usado somente no mock local.');
            await page.locator('#projectType').selectOption('saas');
        }
        await fill();
        await page.evaluate(() => { window.__calls=[]; window.emailjs.send=(...args)=>{window.__calls.push(args); return Promise.resolve({status:200});}; });
        await page.locator('#contactForm [type=submit]').click();
        await page.waitForFunction(() => document.querySelector('#formStatus').classList.contains('success'));
        const call = await page.evaluate(() => window.__calls[0]);
        ok(call[0] === 'service_1u29mnn' && call[1] === 'template_776y0px', 'Existing service and template preserved');
        ok(call[2].message.startsWith('SaaS\n') && call[2].contact, 'Optional type sent through existing message field');
        ok(await page.locator('#name').inputValue() === '', 'Success resets form');
        for (const failure of ['reject','missing','throw']) {
            await fill();
            await page.evaluate(failure => { window.emailjs = failure === 'missing' ? undefined : {send:()=>{if(failure==='throw')throw new Error('mock');return Promise.reject(new Error('mock'))}}; }, failure);
            await page.locator('#contactForm [type=submit]').click();
            await page.waitForFunction(() => document.querySelector('#formStatus').classList.contains('error'));
            ok(await page.locator('#formFallback').isVisible(), `Fallback on ${failure}`);
            ok(await page.locator('#message').inputValue() !== '', 'Failure preserves context');
            ok(await page.locator('#contactForm [type=submit]').isEnabled(), 'Retry available');
        }
        // Timeout and duplicate submits, accelerated only inside the test.
        await page.evaluate(() => {window.__attempts=0;window.emailjs={send:()=>{window.__attempts++;return new Promise(()=>{})}};const real=window.setTimeout;window.setTimeout=(fn,ms,...rest)=>real(fn,ms===20000?50:ms,...rest);});
        await page.locator('#contactForm').evaluate(e => { e.requestSubmit(); e.requestSubmit(); });
        await page.waitForFunction(() => !document.querySelector('#contactForm [type=submit]').disabled);
        ok(await page.evaluate(() => window.__attempts === 1), 'Duplicate submissions blocked');
        ok(await page.locator('#formFallback').isVisible(), 'Timeout offers fallback');
        // Integration configured only in this browser test. Attack strings must never enter events.
        await page.goto(`${base}/?utm_source=linkedin&utm_medium=cpc&utm_campaign=person%40example.com&email=secret`);
        await page.evaluate(() => { window.__events=[];window.GB_ANALYTICS_CONFIG={enabled:true,send:event=>window.__events.push(event),campaigns:{utm_source:['linkedin'],utm_medium:['cpc'],utm_campaign:['launch']}}; });
        await page.addScriptTag({path:'js/analytics.js'});
        await page.evaluate(() => GBAnalytics.track('cta_click','hero','saas'));
        ok(await page.evaluate(() => __events.length === 0), 'No events before consent');
        await page.evaluate(() => {GBAnalytics.setConsent(true);for(const event of ['cta_click','diagnostic_start','diagnostic_complete','whatsapp_click','form_submit_success'])GBAnalytics.track(event,'hero','saas');GBAnalytics.track('cta_click','person@example.com','secret');});
        const events = await page.evaluate(() => __events);
        ok(events.length === 6, 'All five events supported with consent');
        ok(events.every(e => !JSON.stringify(e).includes('@') && !JSON.stringify(e).includes('secret') && !Object.hasOwn(e,'utm_campaign')), 'PII excluded including UTMs');
        ok(events[0].utm_source === 'linkedin' && events[0].utm_medium === 'cpc', 'Approved attribution preserved');
        await page.evaluate(() => {GBAnalytics.setConsent(false);GBAnalytics.track('cta_click');});
        ok(await page.evaluate(() => __events.length === 6), 'Consent withdrawal');
        await page.evaluate(() => {Object.defineProperty(navigator,'globalPrivacyControl',{value:true,configurable:true});GBAnalytics.setConsent(true);GBAnalytics.track('cta_click');});
        ok(await page.evaluate(() => __events.length === 6), 'GPC respected');
        // Storage denial must not prevent initialization or language switching.
        const denied = await browser.newContext({locale:'pt-BR'});
        await denied.addInitScript(() => {Storage.prototype.getItem=()=>{throw new Error('denied')};Storage.prototype.setItem=()=>{throw new Error('denied')};});
        const deniedPage = await denied.newPage(); await deniedPage.goto(base);
        ok(await deniedPage.locator('[data-diagnostic-start]').isVisible(), 'Storage denial works');
        await deniedPage.locator('#langToggle').click();
        ok(await deniedPage.locator('html').getAttribute('lang') === 'en', 'Language toggle with storage denied');
        await denied.close();
        const nojs = await browser.newContext({javaScriptEnabled:false, viewport:{width:390,height:844}});
        const staticPage = await nojs.newPage(); await staticPage.goto(base);
        ok(await staticPage.locator('.hero-title').evaluate(e => getComputedStyle(e.parentElement).opacity === '1'), 'No-JS hero visible');
        ok(await staticPage.locator('.diagnostic-fallback').isVisible(), 'No-JS guidance');
        ok(await staticPage.locator('#contactForm [type=submit]').isDisabled(), 'No-JS form cannot leak PII through GET');
        ok(await staticPage.locator('a[href="mailto:ggbarcelos@gmail.com"]').count() > 0, 'No-JS email alternative');
        await nojs.close();
        ok(!errors.length, 'No JS errors: ' + errors.join('; '));
        ok(!broken.length, 'No broken local requests: ' + broken.join('; '));
        fs.mkdirSync('docs/evidence',{recursive:true});
        await page.setViewportSize({width:390,height:844});
        await page.goto(base); await page.screenshot({path:'docs/evidence/home-mobile.png'});
        await page.locator('#diagnostico').scrollIntoViewIfNeeded();
        await page.locator('[data-diagnostic-start]').click();
        for(const value of ['saas','idea','customers','scope']) {await page.locator(`input[value=${value}]`).check();await page.locator('.diagnostic-form [type=submit]').click();}
        await page.locator('[data-result]').evaluate(e => e.scrollIntoView({block:'start'})); await page.screenshot({path:'docs/evidence/diagnostic-mobile.png'});
        await page.setViewportSize({width:1440,height:1000}); await page.goto(base); await page.screenshot({path:'docs/evidence/home-desktop.png'});
        await page.goto(base+'/desenvolvimento-saas.html'); await page.screenshot({path:'docs/evidence/saas-desktop.png'});
        console.log(`PASS: ${checks} assertions; desktop/mobile, metadata, local links, diagnostic, form mocks, analytics privacy and no-JS.`);
    } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode=1; });
