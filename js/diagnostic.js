document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    const root = document.getElementById('diagnostico');
    if (!root || !window.__i18n) return;
    const t = key => window.__i18n.translations[document.documentElement.lang === 'en' ? 'en' : 'pt'][key];
    const groups = [
        ['objective', ['saas', 'app', 'architecture', 'ai']],
        ['stage', ['idea', 'mvp', 'operating']],
        ['users', ['customers', 'team', 'both']],
        ['obstacle', ['scope', 'integration', 'scale', 'data']]
    ];
    const answers = {};
    let step = 0;
    let completed = false;
    const start = root.querySelector('[data-diagnostic-start]');
    const form = root.querySelector('form');
    const fieldset = form.querySelector('fieldset');
    const back = form.querySelector('[data-back]');
    const next = form.querySelector('[type=submit]');
    const result = root.querySelector('[data-result]');
    const error = root.querySelector('[data-diagnostic-error]');
    const progress = root.querySelector('[data-progress]');
    function render(focus = true) {
        const [name, options] = groups[step];
        progress.textContent = t('diag_progress').replace('{step}', step + 1);
        fieldset.replaceChildren();
        const legend = document.createElement('legend');
        legend.textContent = t('diag_' + name); legend.tabIndex = -1;
        fieldset.append(legend);
        for (const value of options) {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio'; input.name = name; input.value = value; input.required = true;
            input.checked = answers[name] === value;
            input.addEventListener('change', () => { answers[name] = value; error.textContent = ''; });
            label.append(input, document.createTextNode(t('diag_' + value)));
            fieldset.append(label);
        }
        back.disabled = step === 0;
        next.textContent = t(step === 3 ? 'diag_finish' : 'diag_next');
        error.textContent = '';
        if (focus) {
            legend.focus({ preventScroll: true });
            form.scrollIntoView({ block: 'start', behavior: 'auto' });
        }
    }
    function showResult(focus = true) {
        form.hidden = true; result.hidden = false;
        result.querySelector('[data-advice]').textContent = ['advice_' + answers.objective, 'advice_' + answers.stage, 'advice_' + answers.users, 'advice_' + answers.obstacle].map(t).join(' ');
        const cases = {saas:['case-native-ip.html','diag_case_saas'], app:['index.html#case-samu','diag_case_app'], architecture:['index.html#case-samu','diag_case_architecture'], ai:['index.html#case-banana','diag_case_ai']};
        const [href, label] = cases[answers.objective];
        const caseLink = result.querySelector('[data-case]'); caseLink.href = href; caseLink.textContent = t(label);
        const summary = [t('diag_message'), ...groups.map(([key]) => `${t('diag_' + key)} ${t('diag_' + answers[key])}`)].join('\n');
        result.querySelector('[data-summary]').textContent = summary;
        const wa = result.querySelector('[data-whatsapp]');
        wa.href = 'https://wa.me/5551980120387?text=' + encodeURIComponent(summary);
        wa.dataset.projectType = answers.objective;
        if (focus) {
            result.querySelector('h3').focus({ preventScroll: true });
            result.scrollIntoView({ block: 'start', behavior: 'auto' });
        }
    }
    start.hidden = false;
    start.addEventListener('click', () => {
        start.hidden = true; form.hidden = false;
        window.GBAnalytics?.track('diagnostic_start', 'diagnostic'); render();
    });
    back.addEventListener('click', () => { if (step > 0) { step--; render(); } });
    form.addEventListener('submit', event => {
        event.preventDefault();
        const [name, values] = groups[step];
        if (!values.includes(answers[name])) {
            error.textContent = t('diag_error'); fieldset.querySelector('input').focus(); return;
        }
        if (step < 3) { step++; render(); return; }
        if (!completed) window.GBAnalytics?.track('diagnostic_complete', 'diagnostic', answers.objective);
        completed = true; showResult();
    });
    result.querySelector('[data-edit]').addEventListener('click', () => {
        result.hidden = true; form.hidden = false; step = 0; render();
    });
    document.addEventListener('languagechange', () => {
        if (!form.hidden) render(false);
        if (!result.hidden) showResult(false);
    });
});
