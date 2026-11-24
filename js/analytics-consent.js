document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const hasGoogle = window.GBGoogleAnalytics?.configured() === true;
    const hasClarity = window.GBClarity?.configured() === true;
    if ((!hasGoogle && !hasClarity) || !window.GBAnalytics || !window.__i18n) return;

    const optOutKey = 'gb_analytics_opt_out';
    const legacyChoiceKey = 'gb_analytics_consent';
    const optOutCookie = 'gb_analytics_opt_out';
    const privacySignal = () => navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;

    function readCookie() {
        try {
            const item = document.cookie.split(';').map(value => value.trim()).find(value => value.startsWith(optOutCookie + '='));
            return item ? decodeURIComponent(item.slice(optOutCookie.length + 1)) : null;
        } catch {
            return null;
        }
    }

    function readOptOut() {
        try {
            const saved = localStorage.getItem(optOutKey);
            if (saved === '1') return true;
            if (saved === '0') return false;
        } catch {}
        if (readCookie() === '1') return true;
        try { return localStorage.getItem(legacyChoiceKey) === 'denied'; } catch { return false; }
    }

    function saveOptOut(value) {
        try {
            localStorage.setItem(optOutKey, value ? '1' : '0');
            localStorage.setItem(legacyChoiceKey, value ? 'denied' : 'granted');
        } catch {}
        try {
            if (value) {
                document.cookie = optOutCookie + '=1; Max-Age=31536000; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
            } else {
                document.cookie = optOutCookie + '=; Max-Age=0; Path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
            }
        } catch {}
    }

    let optedOut = privacySignal() || readOptOut();
    const row = document.createElement('div');
    row.className = 'analytics-footer-row';
    row.innerHTML = '<p class="analytics-footer-notice"></p>' +
        '<div class="analytics-footer-actions">' +
        '<a href="privacidade.html" class="analytics-details"></a>' +
        '<button type="button" class="analytics-toggle" aria-pressed="false"></button></div>' +
        '<p class="analytics-signal" role="status" hidden></p>' +
        '<span class="analytics-action-status" role="status" aria-live="polite" hidden></span>';
    const footer = document.querySelector('footer');
    const footerShell = footer?.querySelector('.shell') || footer;
    (footerShell || document.body).appendChild(row);

    const notice = row.querySelector('.analytics-footer-notice');
    const details = row.querySelector('.analytics-details');
    const toggle = row.querySelector('.analytics-toggle');
    const signal = row.querySelector('.analytics-signal');
    const status = row.querySelector('.analytics-action-status');

    function render() {
        const t = window.__i18n.translations[document.documentElement.lang === 'en' ? 'en' : 'pt'];
        const noticeKey = hasGoogle ? (hasClarity ? 'analytics_notice_both' : 'analytics_notice_google') : 'analytics_notice_clarity';
        notice.textContent = privacySignal() ? '' : t[optedOut ? 'analytics_notice_opted_out' : noticeKey];
        details.textContent = t.analytics_details;
        toggle.textContent = t[optedOut ? 'analytics_enable' : 'analytics_disable'];
        toggle.disabled = privacySignal();
        toggle.setAttribute('aria-pressed', String(!optedOut));
        signal.textContent = t.analytics_signal;
        signal.hidden = !privacySignal();
        status.textContent = t[optedOut ? 'analytics_status_disabled' : 'analytics_status_enabled'];
    }

    toggle.addEventListener('click', () => {
        if (privacySignal()) return;
        optedOut = !optedOut;
        saveOptOut(optedOut);
        render();
        status.hidden = false;
        window.GBAnalytics.setEnabled(!optedOut);
    });

    document.addEventListener('languagechange', render);
    window.addEventListener('storage', event => {
        if (event.key !== optOutKey && event.key !== legacyChoiceKey && event.key !== null) return;
        optedOut = privacySignal() || readOptOut();
        render();
        window.GBAnalytics.setEnabled(!optedOut);
    });

    render();
    window.GBAnalytics.setEnabled(!optedOut);
});
