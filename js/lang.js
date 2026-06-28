/*
    Language switcher: defaults to English, lets the visitor pick Korean
    from the dropdown in the top-right corner. Choice is remembered via
    localStorage so it persists across visits.
*/
(function () {
    var STORAGE_KEY = 'preferred-lang';
    var root = document.documentElement;
    var switcher = document.getElementById('language-switcher');
    var toggleBtn = document.getElementById('language-switcher-toggle');
    var currentLabel = document.getElementById('language-switcher-current');
    var options = document.querySelectorAll('#language-switcher-dropdown a');

    var labels = { en: 'EN', ko: 'KO' };

    function updateTimelineDates(lang) {
        document.querySelectorAll('.vtimeline-content').forEach(function (content) {
            var dateSpan = content.parentNode.querySelector('.vtimeline-date');
            if (!dateSpan) return;
            var koDate = content.getAttribute('data-date-ko');
            var enDate = content.getAttribute('data-date');
            dateSpan.textContent = (lang === 'ko' && koDate) ? koDate : enDate;
        });
    }

    function applyLanguage(lang) {
        root.setAttribute('data-lang', lang);
        root.setAttribute('lang', lang);
        currentLabel.textContent = labels[lang];
        options.forEach(function (opt) {
            opt.classList.toggle('active', opt.getAttribute('data-lang-option') === lang);
        });
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    }

    function setLanguage(lang) {
        if (lang !== 'en' && lang !== 'ko') lang = 'en';
        applyLanguage(lang);
        updateTimelineDates(lang);
    }

    function closeDropdown() {
        switcher.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var willOpen = !switcher.classList.contains('open');
        switcher.classList.toggle('open', willOpen);
        toggleBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    options.forEach(function (opt) {
        opt.addEventListener('click', function (e) {
            e.preventDefault();
            setLanguage(opt.getAttribute('data-lang-option'));
            closeDropdown();
        });
    });

    document.addEventListener('click', function (e) {
        if (!switcher.contains(e.target)) closeDropdown();
    });

    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var initialLang = (saved === 'en' || saved === 'ko') ? saved : 'en';

    // Apply right away so the rest of the page never flashes the wrong
    // language. The experience timeline's <span class="vtimeline-date">
    // elements don't exist yet though - they're built by the template's
    // own jQuery ready handler (scripts.min.js), which fires on
    // DOMContentLoaded slightly *after* this script runs. Defer just the
    // timeline date update until that's done.
    applyLanguage(initialLang);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            updateTimelineDates(initialLang);
        });
    } else {
        updateTimelineDates(initialLang);
    }
})();
