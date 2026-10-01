(() => {
    'use strict';
    const config = window.GB_ANALYTICS_CONFIG || {};
    const visitorKey = 'gb_clarity_visitor';
    const sessionKey = 'gb_clarity_session';
    const privacySignal = () => navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
    const configured = () => config.enabled === true && /^[a-z0-9]{1,64}$/.test(config.clarityProjectId || '');
    let active = false;
    let requested = false;
    let visitorId;
    let sessionId;

    function storedId(storageName, key, prefix) {
        let storage;
        try {
            storage = window[storageName];
            const existing = storage.getItem(key);
            if (new RegExp(`^${prefix}[a-f0-9]{32}$`).test(existing || '')) return existing;
        } catch { /* Use an in-memory ID when storage is blocked. */ }
        const bytes = window.crypto.getRandomValues(new Uint8Array(16));
        const id = prefix + Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
        try { storage?.setItem(key, id); } catch { /* Identification still works on this page. */ }
        return id;
    }

    function call(...args) {
        try { Promise.resolve(window.clarity?.(...args)).catch(() => {}); } catch { /* Never interrupt navigation or contact. */ }
    }

    function clearIds() {
        visitorId = sessionId = undefined;
        try { window.localStorage.removeItem(visitorKey); } catch {}
        try { window.sessionStorage.removeItem(sessionKey); } catch {}
    }

    function setConsent(value, page) {
        const granted = value === true && configured() && !privacySignal();
        if (!granted) {
            const wasActive = active;
            active = false;
            clearIds();
            if (wasActive && requested) {
                try { window.localStorage.setItem('gb_analytics_consent', 'denied'); } catch {}
                call('consentv2', { analytics_Storage: 'denied', ad_Storage: 'denied' });
                // ConsentV2 alone allows cookieless recording. Reload without the SDK
                // to stop recording entirely, including a still-pending tag request.
                window.location.reload();
            }
            return;
        }
        if (active) return;

        if (typeof window.clarity !== 'function') {
            window.clarity = function (...args) { (window.clarity.q = window.clarity.q || []).push(args); };
        }
        active = true;
        call('consentv2', { analytics_Storage: 'granted', ad_Storage: 'denied' });
        // There is no authenticated account on this site. Never use contact fields as IDs.
        try {
            visitorId = visitorId || storedId('localStorage', visitorKey, 'gbv_');
            sessionId = sessionId || storedId('sessionStorage', sessionKey, 'gbs_');
            call('identify', visitorId, sessionId, page);
        } catch { /* Leave Clarity's default IDs if secure randomness is unavailable. */ }
        call('set', 'page', page);
        if (requested) return;
        requested = true;
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.clarity.ms/tag/${config.clarityProjectId}`;
        script.onerror = () => {
            active = requested = false;
            if (window.clarity.q) window.clarity.q.length = 0;
            script.remove();
        };
        document.head.appendChild(script);
    }

    function track(payload) {
        if (!active || privacySignal()) return;
        // GBAnalytics passes only allowlisted values; no DOM, contact fields or URL here.
        call('set', 'page', payload.page);
        call('set', 'origin', payload.origin);
        call('set', 'project_type', payload.type);
        for (const key of ['utm_source', 'utm_medium', 'utm_campaign']) {
            if (payload[key]) call('set', key, payload[key]);
        }
        call('event', payload.event);
    }

    window.GBClarity = Object.freeze({ configured, privacySignal, setConsent, track });
})();
