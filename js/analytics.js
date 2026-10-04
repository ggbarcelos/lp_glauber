(() => {
    'use strict';
    const config = window.GB_ANALYTICS_CONFIG || {};
    const pages = ['index.html', 'desenvolvimento-saas.html', 'desenvolvimento-web.html', 'desenvolvimento-mobile-desktop.html', 'dev-as-a-service.html', 'case-native-ip.html'];
    const current = location.pathname.split('/').pop() || 'index.html';
    const page = pages.includes(current) ? current : 'other';
    const events = ['cta_click', 'diagnostic_start', 'diagnostic_complete', 'whatsapp_click', 'email_click', 'form_start', 'form_submit_success', 'form_submit_error'];
    const origins = ['hero', 'navigation', 'services', 'cases', 'diagnostic', 'contact', 'floating', 'footer', 'content'];
    const types = ['saas', 'app', 'architecture', 'ai', 'web', 'consulting', 'unspecified'];
    const privacySignal = () => navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
    let consent = false;
    const campaign = {};
    const params = new URLSearchParams(location.search);
    // Exact approved codes only. Arbitrary UTMs can contain names, emails or IDs.
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
        const value = params.get(key);
        if (value && /^[a-z0-9_-]{1,48}$/.test(value) && config.campaigns?.[key]?.includes(value)) campaign[key] = value;
    }
    function track(event, origin = 'content', type = 'unspecified') {
        if (!config.enabled || !consent || privacySignal() || !events.includes(event) || typeof config.send !== 'function') return;
        const payload = Object.freeze({ event, page, origin: origins.includes(origin) ? origin : 'content', type: types.includes(type) ? type : 'unspecified', ...campaign });
        try { Promise.resolve(config.send(payload)).catch(() => {}); } catch { /* Analytics cannot interrupt contact. */ }
    }
    window.GBAnalytics = Object.freeze({
        track,
        // A consent manager calls this after explicit choice, and false on withdrawal.
        // No persistence or replay of interactions collected before consent.
        setConsent(value) {
            consent = value === true && !privacySignal();
            try { config.onConsent?.(config.enabled && consent, page); } catch { /* Optional SDK cannot interrupt the site. */ }
        }
    });
    document.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link) return;
        const url = new URL(link.href, location.href);
        const type = link.dataset.projectType || ({'desenvolvimento-saas.html':'saas','desenvolvimento-mobile-desktop.html':'app','desenvolvimento-web.html':'web','dev-as-a-service.html':'consulting'}[url.pathname.split('/').pop()]) || ({'desenvolvimento-saas.html':'saas','desenvolvimento-mobile-desktop.html':'app','desenvolvimento-web.html':'web','dev-as-a-service.html':'consulting','case-native-ip.html':'web'}[page]) || 'unspecified';
        const origin = link.dataset.origin || (link.closest('footer') ? 'footer' : link.closest('nav') ? 'navigation' : link.closest('.hero, .hero-section') ? 'hero' : link.closest('#diagnostico') ? 'diagnostic' : link.closest('#contato') ? 'contact' : link.closest('#solucoes, .section--offer-rail') ? 'services' : link.closest('#cases') ? 'cases' : link.matches('.whatsapp-float') ? 'floating' : 'content');
        if (link.matches('[data-cta], .button, .inline-arrow, .text-link, .nav-cta')) track('cta_click', origin, type);
        if (url.hostname === 'wa.me') track('whatsapp_click', origin, type);
        if (url.protocol === 'mailto:') track('email_click', origin, type);
        // Preserve only approved attribution on internal navigation. Never send it to WhatsApp.
        if (url.origin === location.origin && pages.includes(url.pathname.split('/').pop()) && !link.hasAttribute('download')) {
            for (const [key, value] of Object.entries(campaign)) url.searchParams.set(key, value);
            link.href = url.href;
        }
    });
})();
