// Tag chips + text search for the Recent Posts section.
//
// The chips are built from the tags already on the cards, so adding a tag in
// _data/posts.yml is all that's needed for a new chip to appear. Filtering is
// handed to the section's pager so paging and filtering stay in agreement
// instead of each hiding cards behind the other's back.
//
// Without this script the posts section still renders and pages normally; only
// the filter bar stays empty.
(function () {
    var section = document.getElementById('recent-posts');
    var pager = window.postsPager;
    if (!section || !pager) return;

    var searchBox = section.querySelector('.filter-search');
    var chipBox = section.querySelector('.filter-tags');
    var noResults = section.querySelector('.no-results');
    var cards = Array.prototype.slice.call(section.querySelectorAll('.card'));
    if (!searchBox || !chipBox) return;

    var activeTag = 'all';
    var query = '';

    function matches(card) {
        var tagOk = activeTag === 'all' ||
            (card.dataset.tags || '').split('|').indexOf(activeTag) !== -1;
        var textOk = query === '' ||
            (card.dataset.search || '').indexOf(query) !== -1;
        return tagOk && textOk;
    }

    function apply() {
        var count = pager.setFilter(matches);
        if (noResults) noResults.hidden = count > 0;
    }

    // Match on the lower-cased tag, but label the chip with the tag exactly as
    // written in _data/posts.yml so acronyms keep their case (DFIR, RAT).
    var labels = {};
    cards.forEach(function (card) {
        var keys = (card.dataset.tags || '').split('|');
        var names = (card.dataset.tagLabels || '').split('|');
        keys.forEach(function (key, i) {
            if (key) labels[key] = names[i] || key;
        });
    });

    ['all'].concat(Object.keys(labels).sort()).forEach(function (tag) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'filter-chip' + (tag === 'all' ? ' active' : '');
        chip.textContent = tag === 'all' ? 'All' : labels[tag];
        chip.dataset.tag = tag;
        chip.setAttribute('aria-pressed', tag === 'all' ? 'true' : 'false');
        chip.addEventListener('click', function () {
            activeTag = tag;
            Array.prototype.slice.call(chipBox.children).forEach(function (el) {
                var on = el.dataset.tag === tag;
                el.classList.toggle('active', on);
                el.setAttribute('aria-pressed', String(on));
            });
            apply();
        });
        chipBox.appendChild(chip);
    });

    searchBox.addEventListener('input', function () {
        query = searchBox.value.trim().toLowerCase();
        apply();
    });

    apply();
})();
