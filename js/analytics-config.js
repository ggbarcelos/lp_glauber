// Copy the project ID from Clarity > Settings > Setup > Installation.
// An empty ID keeps the SDK and consent interface disabled.
window.GB_ANALYTICS_CONFIG = {
    enabled: true,
    clarityProjectId: '',
    campaigns: { utm_source: [], utm_medium: [], utm_campaign: [] },
    send(payload) { window.GBClarity?.track(payload); },
    onConsent(value, page) { window.GBClarity?.setConsent(value, page); }
};
