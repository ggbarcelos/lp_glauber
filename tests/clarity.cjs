// Uses a mocked Clarity tag only: no recordings, analytics requests or email sends.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:8000';
const files = ['index.html', 'desenvolvimento-saas.html', 'desenvolvimento-web.html', 'desenvolvimento-mobile-desktop.html', 'dev-as-a-service.html', 'case-native-ip.html'];
const config = fs.readFileSync('js/analytics-config.js', 'utf8');
let checks = 0;
function ok(value, message) { assert.ok(value, message); checks++; }

(async () => {
    const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    async function setup({ noId = false, privacy, deniedStorage = false, failedTag = false, pendingTag = false } = {}) {
        const context = await browser.newContext({ locale: 'pt-BR', viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
        const errors = [];
        let requests = 0;
        await context.addInitScript(({ privacy, deniedStorage }) => {
            if (privacy) Object.defineProperty(navigator, privacy, { value: privacy === 'doNotTrack' ? '1' : true, configurable: true });
            if (deniedStorage) for (const method of ['getItem', 'setItem', 'removeItem']) Storage.prototype[method] = () => { throw Error('Storage denied'); };
            addEventListener('unhandledrejection', event => { throw event.reason; });
            addEventListener('beforeunload', () => {
                try { sessionStorage.setItem('test_clarity_calls', JSON.stringify(window.__clarityCalls || [])); } catch {}
            });
        }, { privacy, deniedStorage });
        await context.route('**/*', async route => {
            const url = new URL(route.request().url());
            if (url.origin === base && url.pathname === '/js/analytics-config.js') {
                return route.fulfill({ contentType: 'text/javascript', body: noId ? config.replace(/clarityProjectId: '[^']*'/, "clarityProjectId: ''") : config.replace(/clarityProjectId: '[^']*'/, "clarityProjectId: 'testproject'") });
            }
            if (url.hostname === 'www.clarity.ms' && url.pathname === '/tag/testproject') {
                requests++;
                if (failedTag) return route.abort();
                if (pendingTag) return; // Leave the tag request pending until navigation.
                return route.fulfill({ contentType: 'text/javascript', body: `
                    window.__clarityCalls = window.clarity.q || [];
                    window.clarity = (...args) => { window.__clarityCalls.push(args); return args[0] === 'identify' ? Promise.resolve({}) : undefined; };
                ` });
            }
            if (url.origin !== base) return route.abort();
            return route.continue();
        });
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base, { waitUntil: 'domcontentloaded' });
        return { context, page, errors, requests: () => requests };
    }
    const calls = page => page.evaluate(() => window.__clarityCalls || []);
    const identify = async page => (await calls(page)).find(call => call[0] === 'identify');
    try {
        const test = await setup();
        const { page } = test;
        await page.evaluate(() => GBAnalytics.track('cta_click', 'hero', 'saas'));
        ok(test.requests() === 0, 'No SDK or events before consent');
        ok(await page.evaluate(() => !localStorage.getItem('gb_clarity_visitor') && !sessionStorage.getItem('gb_clarity_session')), 'No IDs before consent');
        ok(await page.locator('.analytics-consent').isVisible(), 'First-visit choice is visible');
        ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Consent UI fits mobile');
        await page.setViewportSize({ width: 320, height: 400 });
        // Chromium updates viewport-relative CSS on the next rendering frame.
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const bounds = await page.locator('.analytics-consent').evaluate(element => {
            const rect = element.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: innerWidth, height: innerHeight, maxHeight: getComputedStyle(element).maxHeight };
        });
        ok(bounds.top >= 0 && bounds.bottom <= bounds.height && bounds.left >= 0 && bounds.right <= bounds.width, 'Consent UI stays inside a short 320px viewport: ' + JSON.stringify(bounds));
        await page.setViewportSize({ width: 390, height: 844 });
        await page.screenshot({ path: '/private/tmp/clarity-consent-mobile.png' });
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.screenshot({ path: '/private/tmp/clarity-consent-desktop.png' });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.locator('.nav-toggle').click();
        await page.locator('#langToggle').click();
        await page.keyboard.press('Escape');
        ok(await page.locator('[data-analytics-choice="granted"]').innerText() === 'Accept analytics', 'English consent translations');
        await page.locator('[data-analytics-choice="granted"]').click();
        await page.waitForFunction(() => window.__clarityCalls?.some(call => call[0] === 'identify'));
        const first = await identify(page);
        ok(/^gbv_[a-f0-9]{32}$/.test(first[1]) && /^gbs_[a-f0-9]{32}$/.test(first[2]), 'Anonymous, secure visitor and session IDs');
        ok(first.length === 4 && first[3] === 'index.html', 'Correct Identify API signature without friendly name');
        ok(test.requests() === 1, 'One SDK load after acceptance');
        ok((await calls(page)).some(call => call[0] === 'consentv2' && call[1].analytics_Storage === 'granted' && call[1].ad_Storage === 'denied'), 'Analytics consent does not grant advertising storage');
        ok(await page.locator('#contactForm').getAttribute('data-clarity-mask') === 'true' && await page.locator('#diagnostico').getAttribute('data-clarity-mask') === 'true', 'Contact and diagnostic masked');
        await page.evaluate(() => {
            for (const event of ['cta_click', 'diagnostic_start', 'diagnostic_complete', 'whatsapp_click', 'form_submit_success']) GBAnalytics.track(event, 'hero', 'saas');
            GBAnalytics.track('unknown', 'secret@example.com');
            GBAnalytics.track('cta_click', 'secret@example.com', '5551987654321');
        });
        const events = (await calls(page)).filter(call => call[0] === 'event');
        ok(events.length === 6, 'Five supported events forwarded, unknown event ignored');
        ok(!JSON.stringify(await calls(page)).includes('secret@example.com') && !JSON.stringify(await calls(page)).includes('5551987654321'), 'Custom tags exclude arbitrary personal values');
        for (const file of files) {
            await page.goto(`${base}/${file}?email=secret@example.com#contato`, { waitUntil: 'domcontentloaded' });
            await page.waitForFunction(() => window.__clarityCalls?.some(call => call[0] === 'identify'));
            const current = await identify(page);
            ok(current[1] === first[1] && current[2] === first[2] && current[3] === file, `${file}: stable IDs and safe page identifier`);
            ok(await page.locator('.analytics-preferences').count() === 1 && await page.locator('.analytics-consent').isHidden(), `${file}: saved choice and withdrawal control`);
        }
        await page.locator('.analytics-preferences').click();
        const beforeWithdrawal = test.requests();
        await Promise.all([page.waitForEvent('domcontentloaded'), page.locator('[data-analytics-choice="denied"]').click()]);
        const previous = await page.evaluate(() => JSON.parse(sessionStorage.getItem('test_clarity_calls')));
        ok(previous.some(call => call[0] === 'consentv2' && call[1].analytics_Storage === 'denied' && call[1].ad_Storage === 'denied'), 'Withdrawal informs Clarity before unloading');
        ok(test.requests() === beforeWithdrawal, 'Withdrawal reloads without loading SDK');
        ok(await page.evaluate(() => localStorage.getItem('gb_analytics_consent') === 'denied' && !localStorage.getItem('gb_clarity_visitor') && !sessionStorage.getItem('gb_clarity_session')), 'Withdrawal removes IDs and saves denial');
        ok(test.errors.length === 0, 'No JavaScript errors in consent/navigation flow: ' + test.errors);
        await test.context.close();

        for (const privacy of ['doNotTrack', 'globalPrivacyControl']) {
            const blocked = await setup({ privacy });
            await blocked.page.evaluate(() => { GBAnalytics.setConsent(true); GBAnalytics.track('cta_click'); });
            ok(blocked.requests() === 0, `${privacy}: programmatic acceptance cannot load SDK`);
            await blocked.page.locator('.analytics-preferences').click();
            ok(await blocked.page.locator('[data-analytics-choice="granted"]').isDisabled(), `${privacy}: UI prevents tracking`);
            ok(blocked.errors.length === 0, `${privacy}: no page errors`);
            await blocked.context.close();
        }
        const noId = await setup({ noId: true });
        await noId.page.evaluate(() => GBAnalytics.setConsent(true));
        ok(noId.requests() === 0 && await noId.page.locator('.analytics-consent').count() === 0, 'Unconfigured project sends no requests or consent prompt');
        await noId.context.close();

        const storage = await setup({ deniedStorage: true });
        await storage.page.locator('[data-analytics-choice="granted"]').click();
        await storage.page.waitForFunction(() => window.__clarityCalls?.some(call => call[0] === 'identify'));
        ok(Boolean(await identify(storage.page)), 'Storage denial falls back to in-memory IDs');
        await storage.page.locator('.nav-toggle').click();
        await storage.page.locator('#langToggle').click();
        ok(storage.errors.length === 0, 'Storage denial does not break page or language toggle');
        await storage.context.close();

        const failed = await setup({ failedTag: true });
        await failed.page.locator('[data-analytics-choice="granted"]').click();
        await failed.page.waitForFunction(() => document.querySelector('script[src*="clarity.ms/tag"]') === null);
        await failed.page.evaluate(() => GBAnalytics.track('form_submit_success', 'contact', 'saas'));
        ok(failed.errors.length === 0, 'Blocked SDK does not break contact events');
        await failed.page.evaluate(() => GBAnalytics.setConsent(true));
        await failed.page.waitForFunction(() => document.querySelector('script[src*="clarity.ms/tag"]') === null);
        ok(failed.requests() === 2, 'Failed SDK load can retry');
        await failed.context.close();

        const pending = await setup({ pendingTag: true });
        await pending.page.locator('[data-analytics-choice="granted"]').click();
        await pending.page.waitForFunction(() => window.clarity?.q?.some(call => call[0] === 'identify'));
        await pending.page.locator('.analytics-preferences').click();
        await Promise.all([pending.page.waitForEvent('domcontentloaded'), pending.page.locator('[data-analytics-choice="denied"]').click()]);
        ok(pending.requests() === 1 && await pending.page.evaluate(() => typeof window.clarity === 'undefined'), 'Withdrawal during pending load removes the queued SDK');
        ok(pending.errors.length === 0, 'Pending-load withdrawal has no page errors');
        await pending.context.close();
        console.log(`PASS: ${checks} Clarity assertions; mocked SDK, all pages, consent, identifiers, events, privacy signals and failures.`);
    } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
