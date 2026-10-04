document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const hasGoogle = window.GBGoogleAnalytics?.configured() === true;
    const hasClarity = window.GBClarity?.configured() === true;
    if ((!hasGoogle && !hasClarity) || !window.GBAnalytics || !window.__i18n) return;
    const privacySignal = () => navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
    const consentKey = 'gb_analytics_consent';
    const readChoice = () => { try { return localStorage.getItem(consentKey); } catch { return null; } };
    const saveChoice = value => { try { localStorage.setItem(consentKey, value); } catch {} };
    let choice = readChoice();
    if (privacySignal()) {
        choice = 'denied';
        saveChoice(choice);
    }

    const panel = document.createElement('section');
    panel.id = 'analytics-consent-panel';
    panel.className = 'analytics-consent';
    panel.setAttribute('aria-labelledby', 'analytics-consent-title');
    panel.innerHTML = `<h2 id="analytics-consent-title" data-i18n="analytics_title"></h2>
        <p data-i18n="${hasGoogle ? (hasClarity ? 'analytics_description_both' : 'analytics_description_google') : 'analytics_description'}"></p>
        ${hasGoogle ? '<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" data-i18n="analytics_privacy_google"></a>' : ''}
        ${hasClarity ? '<a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer" data-i18n="analytics_privacy"></a>' : ''}
        <p class="analytics-signal" data-i18n="analytics_signal" hidden></p>
        <div class="analytics-actions"><button type="button" data-analytics-choice="granted" data-i18n="analytics_accept"></button>
        <button type="button" data-analytics-choice="denied" data-i18n="analytics_decline"></button></div>`;
    document.body.appendChild(panel);
    const preferences = document.createElement('button');
    preferences.type = 'button';
    preferences.className = 'analytics-preferences';
    preferences.dataset.i18n = 'analytics_preferences';
    preferences.setAttribute('aria-controls', panel.id);
    (document.querySelector('footer') || document.body).appendChild(preferences);

    function render() {
        const t = window.__i18n.translations[document.documentElement.lang === 'en' ? 'en' : 'pt'];
        for (const element of [...panel.querySelectorAll('[data-i18n]'), preferences]) element.textContent = t[element.dataset.i18n];
        const blocked = privacySignal();
        panel.querySelector('[data-analytics-choice="granted"]').disabled = blocked;
        panel.querySelector('.analytics-signal').hidden = !blocked;
    }
    function show(open) {
        panel.hidden = !open;
        document.body.classList.toggle('privacy-panel-open', open);
        preferences.setAttribute('aria-expanded', String(open));
    }
    panel.addEventListener('click', event => {
        const button = event.target.closest('[data-analytics-choice]');
        if (!button) return;
        choice = button.dataset.analyticsChoice;
        saveChoice(choice);
        show(false);
        preferences.focus({ preventScroll: true });
        window.GBAnalytics.setConsent(choice === 'granted');
    });
    preferences.addEventListener('click', () => {
        render();
        show(panel.hidden);
        if (!panel.hidden) panel.querySelector('[data-analytics-choice="denied"]').focus();
    });
    document.addEventListener('languagechange', render);
    // Keep other open tabs in sync, particularly when consent is withdrawn.
    window.addEventListener('storage', event => {
        if (event.key !== consentKey && event.key !== null) return;
        choice = readChoice();
        show(choice !== 'granted' && choice !== 'denied');
        window.GBAnalytics.setConsent(choice === 'granted');
    });
    render();
    show(choice !== 'granted' && choice !== 'denied');
    window.GBAnalytics.setConsent(choice === 'granted');
});
