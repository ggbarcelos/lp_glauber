// Motion is decorative: content and navigation work without this enhancement.
document.addEventListener('DOMContentLoaded', () => {
    if (!document.body.classList.contains('portal-site')) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const toggle = document.querySelector('.motion-toggle');
    let paused = preference.matches;
    const updateMotion = () => {
        document.body.classList.toggle('motion-paused', paused);
        toggle?.setAttribute('aria-pressed', String(paused));
        const label = toggle?.querySelector('[data-i18n]');
        const key = paused ? 'portal_play' : 'portal_pause';
        if (label) {
            label.dataset.i18n = key;
            const lang = document.documentElement.lang === 'en' ? 'en' : 'pt';
            label.textContent = window.__i18n.translations[lang][key];
        }
        // Respect the operating system even if an animation toggle is clicked.
        if (toggle) toggle.hidden = preference.matches;
    };
    toggle?.addEventListener('click', () => { paused = !paused; updateMotion(); });
    preference.addEventListener('change', () => { paused = preference.matches; updateMotion(); });
    document.addEventListener('languagechange', updateMotion);
    updateMotion();
    const scenes = document.querySelectorAll('.portal-stage, .method-next-grid, .intelligence-map');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => entry.target.classList.toggle('portal-in-view', entry.isIntersecting));
        }, { threshold: .08 });
        scenes.forEach(scene => observer.observe(scene));
    } else scenes.forEach(scene => scene.classList.add('portal-in-view'));
    document.addEventListener('visibilitychange', () => {
        document.body.classList.toggle('effects-hidden', document.hidden);
    });
    const footer = document.querySelector('.site-footer');
    let scheduled = false;
    const updateProgress = () => {
        const distance = document.documentElement.scrollHeight - innerHeight;
        document.body.style.setProperty('--reading-progress', String(distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0));
        const clearance = footer ? Math.max(0, innerHeight - footer.getBoundingClientRect().top) : 0;
        document.body.style.setProperty('--footer-clearance', `${clearance}px`);
        document.body.classList.toggle('floating-offscreen', clearance > innerHeight - 110);
        scheduled = false;
    };
    const scheduleProgress = () => {
        if (!scheduled) { scheduled = true; requestAnimationFrame(updateProgress); }
    };
    addEventListener('scroll', scheduleProgress, { passive: true });
    addEventListener('resize', scheduleProgress, { passive: true });
    updateProgress();
});
