// Records outbound clicks on post/project cards as GoatCounter events,
// e.g. "outbound-post-emotet-malware-analysis". Page views are counted
// separately by the count.js loader included in the page head.
(function () {
    var GOATCOUNTER_URL = 'https://shaddy43.goatcounter.com/count';

    function slugify(text) {
        return text.toLowerCase().trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function trackEvent(name, title) {
        if (window.goatcounter && window.goatcounter.count) {
            window.goatcounter.count({ path: name, title: title, event: true });
        } else {
            // count.js not loaded (still downloading, or blocked): hit the
            // pixel endpoint directly so the click is not lost.
            (new Image()).src = GOATCOUNTER_URL +
                '?p=' + encodeURIComponent(name) +
                '&t=' + encodeURIComponent(title) +
                '&e=true';
        }
    }

    function handleClick(e) {
        // auxclick covers middle-click (open in new tab); ignore right-click
        if (e.type === 'auxclick' && e.button !== 1) return;

        // Social badges and certification badges carry an explicit event
        // name in data-event.
        var badge = e.target.closest('a[data-event]');
        if (badge) {
            trackEvent(badge.getAttribute('data-event'), badge.href);
            return;
        }

        var card = e.target.closest('a.card, a.card-square');
        if (!card) return;
        var titleEl = card.querySelector('.card-title');
        var title = titleEl ? titleEl.textContent.trim() : card.href;
        var kind = card.closest('#projects') ? 'project' : 'post';
        trackEvent('Portfolio-outbound-' + kind + '-' + slugify(title), card.href);
    }

    document.addEventListener('click', handleClick);
    document.addEventListener('auxclick', handleClick);
})();
