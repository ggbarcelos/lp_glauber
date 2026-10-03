// GA4: Admin > Data streams > Web > Measurement ID (G-XXXXXXXXXX).
// Clarity: Settings > Setup > Installation. Empty IDs disable each provider.
window.GB_ANALYTICS_CONFIG = {
    enabled: true,
    googleMeasurementId: 'G-TJQEC00DF9',
    clarityProjectId: '',
    campaigns: { utm_source: [], utm_medium: [], utm_campaign: [] },
    send(payload) {
        window.GBGoogleAnalytics?.track(payload);
        window.GBClarity?.track(payload);
    },
    onConsent(value, page) {
        window.GBGoogleAnalytics?.setConsent(value, page);
        window.GBClarity?.setConsent(value, page);
    }
};
