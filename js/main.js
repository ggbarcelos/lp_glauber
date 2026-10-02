document.addEventListener('DOMContentLoaded', () => {
    if (window.__i18n) window.__i18n.applyLang(window.__i18n.detectLang());

    const getTranslations = () => {
        const lang = document.documentElement.lang === 'en' ? 'en' : 'pt';
        return window.__i18n?.translations?.[lang] || {};
    };

    const nav = document.querySelector('.site-nav');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const navMenu = document.querySelector('.nav-links');

    const closeMenu = () => {
        if (!navMenu || !navToggle) return;
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    navToggle?.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.classList.toggle('menu-open', isOpen);
    });

    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
            closeMenu();
            navToggle.focus();
        }
    });

    const handleScroll = () => {
        nav?.classList.toggle('is-scrolled', window.scrollY > 25);
        let current = '';
        document.querySelectorAll('header[id], section[id]').forEach(section => {
            if (window.scrollY >= section.offsetTop - 180) current = section.id;
        });
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    };
    let scrollPending = false;
    window.addEventListener('scroll', () => {
        if (scrollPending) return;
        scrollPending = true;
        requestAnimationFrame(() => { handleScroll(); scrollPending = false; });
    }, { passive: true });
    handleScroll();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const target = document.getElementById(anchor.hash.slice(1));
            if (!target) return;
            event.preventDefault();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
            target.focus({ preventScroll: true });
        });
    });

    const revealItems = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach(item => observer.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
    }

    const contactForm = document.getElementById('contactForm');
    const contactFields = document.getElementById('contactFields');
    const contactField = document.getElementById('contact');
    const submitButton = contactForm?.querySelector('button[type="submit"]');
    const fallback = document.getElementById('formFallback');
    let submitting = false;
    // Progressive enhancement: no-JS users have direct contact links, no accidental GET with PII.
    if (contactFields) contactFields.disabled = false;
    const showFallback = () => { if (fallback) fallback.hidden = false; };

    const setFieldState = (field, message) => {
        if (!field) return;
        const formField = field.closest('.form-field');
        let errorEl = formField?.querySelector('.field-error');
        if (!errorEl && formField) {
            errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            errorEl.id = `${field.id}-error`;
            errorEl.setAttribute('role', 'alert');
            formField.appendChild(errorEl);
        }
        field.classList.toggle('is-invalid', Boolean(message));
        field.setAttribute('aria-invalid', String(Boolean(message)));
        if (errorEl) field.setAttribute('aria-describedby', errorEl.id);
        if (errorEl) {
            errorEl.textContent = message || '';
            errorEl.style.display = message ? 'block' : 'none';
        }
    };

    const showFormStatus = (message, type = 'info') => {
        const status = document.getElementById('formStatus');
        if (!status) return;
        status.textContent = message;
        status.className = `form-status ${type}`;
        status.style.display = 'block';
    };

    contactField?.addEventListener('input', () => {
        let value = contactField.value.replace(/\D/g, '').slice(0, 11);
        if (value.length <= 2) contactField.value = value ? `(${value}` : '';
        else if (value.length <= 7) contactField.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        else contactField.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    });

    contactForm?.addEventListener('submit', async event => {
        event.preventDefault();
        if (submitting) return;
        const nameField = document.getElementById('name');
        const messageField = document.getElementById('message');
        const values = { name: nameField?.value.trim() || '', contact: contactField?.value.trim() || '', message: messageField?.value.trim() || '' };
        const phoneDigits = values.contact.replace(/\D/g, '');
        const t = getTranslations();
        const errors = {
            name: values.name.length < 3 ? t.err_name : '',
            contact: phoneDigits.length < 10 || phoneDigits.length > 11 ? t.err_contact : '',
            message: values.message.length < 10 ? t.err_message : ''
        };
        setFieldState(nameField, errors.name);
        setFieldState(contactField, errors.contact);
        setFieldState(messageField, errors.message);
        if (Object.values(errors).some(Boolean)) {
            showFormStatus(t.err_fields, 'error');
            [nameField, contactField, messageField].find(field => field?.classList.contains('is-invalid'))?.focus();
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.dataset.originalHtml = submitButton.dataset.originalHtml || submitButton.innerHTML;
            submitButton.innerHTML = t.sending;
        }
        submitting = true;
        contactForm.setAttribute('aria-busy', 'true');
        if (fallback) fallback.hidden = true;
        showFormStatus(t.sending, 'info');
        const allowedTypes = ['saas', 'app', 'architecture', 'ai', 'web', 'consulting'];
        const selectedType = document.getElementById('projectType')?.value;
        const projectType = allowedTypes.includes(selectedType) ? selectedType : 'unspecified';
        const projectLabel = t['project_' + projectType];
        // Keep the existing template compatible by including optional type in message.
        const message = projectLabel ? `${projectLabel}\n\n${values.message}` : values.message;
        let timeout;
        try {
            if (!window.emailjs) throw new Error('Email service unavailable');
            await Promise.race([window.emailjs.send('service_1u29mnn', 'template_776y0px', {
            name: values.name,
            contact: values.contact,
            message,
            email: 'formulario@portifolio.com',
            from_name: values.name,
            reply_to: 'formulario@portifolio.com',
            to_name: 'Glauber'
            }), new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('timeout')), 20000); })]);
            showFormStatus(getTranslations().sent_ok, 'success');
            window.GBAnalytics?.track('form_submit_success', 'contact', projectType);
            contactForm.reset();
        } catch {
            showFormStatus(getTranslations().send_error, 'error');
            showFallback();
        } finally {
            clearTimeout(timeout);
            submitting = false;
            contactForm.setAttribute('aria-busy', 'false');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = getTranslations().send_btn_original || submitButton.dataset.originalHtml;
            }
        }
    });
});

// Business priorities: no projections or invented results, just a direction and measures.
document.addEventListener('DOMContentLoaded', () => {
    const choices = [...document.querySelectorAll('[data-impact]')];
    const panel = document.querySelector('.impact-detail');
    if (!choices.length || !panel) return;
    const prefixes = { performance: 'perf', cost: 'cost', growth: 'growth' };
    let selected = 'performance';
    const render = () => {
        const lang = document.documentElement.lang === 'en' ? 'en' : 'pt';
        const t = window.__i18n?.translations[lang];
        if (!t) return;
        const prefix = prefixes[selected];
        panel.querySelector('[data-impact-title]').setAttribute('data-i18n', `gb_${prefix}_title`);
        panel.querySelector('[data-impact-copy]').setAttribute('data-i18n', `gb_${prefix}_copy`);
        panel.querySelector('[data-impact-measures]').setAttribute('data-i18n', `gb_${prefix}_measures`);
        panel.querySelector('[data-impact-title]').textContent = t[`gb_${prefix}_title`];
        panel.querySelector('[data-impact-copy]').textContent = t[`gb_${prefix}_copy`];
        panel.querySelector('[data-impact-measures]').textContent = t[`gb_${prefix}_measures`];
        choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.impact === selected)));
    };
    choices.forEach(button => button.addEventListener('click', () => { selected = button.dataset.impact; render(); }));
    document.addEventListener('languagechange', render);
    render();
});
