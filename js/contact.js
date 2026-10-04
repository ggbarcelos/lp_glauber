// Service pages retain their inline styles and use the same language preference.
document.addEventListener('DOMContentLoaded', () => {
    window.__i18n?.applyLang(window.__i18n.detectLang());
});

// Standalone service navigation remains reachable by touch and keyboard.
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.service-menu-toggle');
    const menu = document.getElementById('serviceMenu');
    if (!toggle || !menu) return;
    const close = () => {
        document.body.classList.remove('service-menu-open');
        toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
        const open = document.body.classList.toggle('service-menu-open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            close();
            toggle.focus();
        }
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('.service-nav')) close();
    });
    matchMedia('(min-width: 901px)').addEventListener('change', event => {
        if (event.matches) close();
    });
});
