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

// Keep the shortcut clear of controls at every size, and mobile reading content.
document.addEventListener('DOMContentLoaded', () => {
    const floating = document.querySelector('.whatsapp-float');
    if (!floating) return;
    let pending = false;
    const update = () => {
        pending = false;
        const mobile = matchMedia('(max-width: 700px)').matches;
        const box = floating.getBoundingClientRect();
        const blocked = document.body.classList.contains('privacy-panel-open') || document.body.classList.contains('menu-open');
        const protectedContent = mobile
            ? 'main p, main h1, main h2, main h3, main a, main button, main input, main textarea, main select, main img, header p, header h1, header a, header button, header .hero-bottom, header .delivery-bottom, footer p, footer h2, footer h3, footer a, footer button'
            : 'main a, main button, main input, main textarea, main select, header a, header button, footer a, footer button';
        const intersects = [...document.querySelectorAll(protectedContent)].some(element => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && rect.left < box.right && rect.right > box.left && rect.top < box.bottom && rect.bottom > box.top;
        });
        document.body.classList.toggle('floating-obstructed', blocked || intersects);
    };
    const schedule = () => { if (!pending) { pending = true; requestAnimationFrame(update); } };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    document.addEventListener('focusin', schedule);
    document.addEventListener('click', schedule);
    document.addEventListener('languagechange', schedule);
    update();
});
