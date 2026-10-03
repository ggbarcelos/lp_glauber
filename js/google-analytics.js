(() => {
    'use strict';
    const config = window.GB_ANALYTICS_CONFIG || {};
    const id = config.googleMeasurementId || '';
    const configured = () => config.enabled === true && /^G-[A-Z0-9]+$/.test(id);
    const privacySignal = () => navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
    let active = false;
    let requested = false;
    let pageViewed = false;

    function call(...args) {
        try { window.gtag?.(...args); } catch { /* Analytics cannot interrupt contact. */ }
    }

    function setConsent(value, page) {
        const granted = value === true && configured() && !privacySignal();
        window[`ga-disable-${id}`] = !granted;
        if (!granted) {
            const wasActive = active;
            active = false;
            if (wasActive && requested) {
                try { window.localStorage.setItem('gb_analytics_consent', 'denied'); } catch {}
                // Stop loaded or pending tags and discard queued events on withdrawal.
                window.location.reload();
            }
            return;
        }
        if (active) return;
        active = true;
        if (!requested) {
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
            call('consent', 'default', {
                analytics_storage: 'denied', ad_storage: 'denied',
                ad_user_data: 'denied', ad_personalization: 'denied'
            });
            call('consent', 'update', { analytics_storage: 'granted' });
            call('js', new Date());
            // Exclude query strings, fragments and external referrer paths.
            call('config', id, {
                send_page_view: false,
                page_location: location.origin + location.pathname,
                page_referrer: safeReferrer(),
                allow_google_signals: false,
                allow_ad_personalization_signals: false
            });
            requested = true;
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
            script.onerror = () => {
                active = requested = pageViewed = false;
                window[`ga-disable-${id}`] = true;
                window.dataLayer.length = 0;
                script.remove();
            };
            document.head.appendChild(script);
        }
        if (!pageViewed) {
            call('event', 'page_view', { send_to: id, page, page_title: document.title });
            pageViewed = true;
        }
    }

    function safeReferrer() {
        try {
            const url = new URL(document.referrer);
            return url.origin === location.origin ? url.origin + url.pathname : url.origin;
        } catch { return ''; }
    }

    function track(payload) {
        if (!active || !configured() || privacySignal()) return;
        const { event, type, ...parameters } = payload;
        call('event', event, { ...parameters, project_type: type, send_to: id });
    }

    window.GBGoogleAnalytics = Object.freeze({ configured, privacySignal, setConsent, track });
})();
