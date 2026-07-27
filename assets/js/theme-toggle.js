// Header light/dark toggle.
//
// With no stored choice the page simply follows the OS (handled in CSS by the
// prefers-color-scheme block). Clicking the toggle pins an explicit choice on
// <html data-theme> and remembers it; the inline script in the layout re-applies
// it before first paint so there is no flash on the next page load.
(function () {
    var root = document.documentElement;
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    var mq = window.matchMedia('(prefers-color-scheme: dark)');

    function current() {
        return root.getAttribute('data-theme') || (mq.matches ? 'dark' : 'light');
    }

    function label() {
        btn.setAttribute('aria-label',
            current() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }

    btn.addEventListener('click', function () {
        var next = current() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('sk-theme', next); } catch (e) {}
        label();
    });

    // Follow the OS while the visitor hasn't pinned a preference.
    mq.addEventListener('change', function () {
        if (!root.getAttribute('data-theme')) label();
    });

    label();
})();
