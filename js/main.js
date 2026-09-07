document.addEventListener('DOMContentLoaded', () => {
    if (window.__i18n) window.__i18n.applyLang(window.__i18n.detectLang());

    const getTranslations = () => {
        const lang = localStorage.getItem('gb_lang') || window.__i18n?.detectLang() || 'pt';
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
        if (event.key === 'Escape') closeMenu();
    });

    const handleScroll = () => {
        nav?.classList.toggle('is-scrolled', window.scrollY > 25);
        let current = '';
        document.querySelectorAll('header[id], section[id]').forEach(section => {
            if (window.scrollY >= section.offsetTop - 180) current = section.id;
        });
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', event => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
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
    const contactField = document.getElementById('contact');
    const submitButton = contactForm?.querySelector('button[type="submit"]');

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

    contactForm?.addEventListener('submit', event => {
        event.preventDefault();
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
        showFormStatus(t.sending, 'info');
        if (!window.emailjs) {
            showFormStatus(t.send_error, 'error');
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = t.send_btn_original || submitButton.dataset.originalHtml;
            }
            return;
        }
        window.emailjs.send('service_1u29mnn', 'template_776y0px', {
            name: values.name,
            contact: values.contact,
            message: values.message,
            email: 'formulario@portifolio.com',
            from_name: values.name,
            reply_to: 'formulario@portifolio.com',
            to_name: 'Glauber'
        }).then(() => {
            showFormStatus(getTranslations().sent_ok, 'success');
            contactForm.reset();
        }).catch(error => {
            console.error('EmailJS error:', error?.status, error?.text);
            showFormStatus(getTranslations().send_error, 'error');
        }).finally(() => {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = getTranslations().send_btn_original || submitButton.dataset.originalHtml;
            }
        });
    });
});
