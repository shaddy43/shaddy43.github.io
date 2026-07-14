// Fills each project repo card with live language, stars and forks from the
// GitHub API. Results are cached in localStorage for an hour, keeping each
// visitor well under the unauthenticated limit of 60 requests/hour. On any
// failure (offline / rate-limited) the card simply shows tags + description
// with the stats row left empty.
(function () {
    var CACHE_TTL_MS = 60 * 60 * 1000;

    // A small subset of GitHub's linguist language colours; anything not listed
    // falls back to a neutral grey dot.
    var LANG_COLORS = {
        'C': '#555555', 'C++': '#f34b7d', 'C#': '#178600', 'Python': '#3572A5',
        'Java': '#b07219', 'JavaScript': '#f1e05a', 'TypeScript': '#3178c6',
        'Go': '#00ADD8', 'Rust': '#dea584', 'Shell': '#89e051', 'PowerShell': '#012456',
        'Assembly': '#6E4C13', 'HTML': '#e34c26', 'CSS': '#563d7c', 'Ruby': '#701516',
        'PHP': '#4F5D95', 'Kotlin': '#A97BFF', 'Swift': '#F05138', 'Dockerfile': '#384d54'
    };

    // github.com/{owner}/{repo} links, plus {owner}.github.io/{repo} project
    // pages (e.g. the MalwareAnalysisSeries card), map back to their repo.
    function repoFromLink(href) {
        var m = href.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
        if (m) return m[1] + '/' + m[2];
        m = href.match(/^https:\/\/([^.]+)\.github\.io\/([^/#?]+)/);
        if (m) return m[1] + '/' + m[2];
        return null;
    }

    function readCache(repo) {
        try {
            var entry = JSON.parse(localStorage.getItem('gh-stats:' + repo));
            if (entry && Date.now() - entry.ts < CACHE_TTL_MS) return entry;
        } catch (e) { /* corrupt or disabled storage */ }
        return null;
    }

    function writeCache(repo, data) {
        try {
            localStorage.setItem('gh-stats:' + repo, JSON.stringify({
                stars: data.stars, forks: data.forks, lang: data.lang, ts: Date.now()
            }));
        } catch (e) { /* storage full or disabled: skip caching */ }
    }

    function fillCard(card, d) {
        if (d.lang) {
            var langEl = card.querySelector('.repo-lang');
            langEl.querySelector('.lang-name').textContent = d.lang;
            langEl.querySelector('.lang-dot').style.background = LANG_COLORS[d.lang] || '#8b8b8b';
            langEl.hidden = false;
        }
        if (typeof d.stars === 'number') {
            var s = card.querySelector('.repo-stars');
            s.querySelector('.n').textContent = d.stars;
            s.hidden = false;
        }
        if (typeof d.forks === 'number' && d.forks > 0) {
            var f = card.querySelector('.repo-forks');
            f.querySelector('.n').textContent = d.forks;
            f.hidden = false;
        }
    }

    document.querySelectorAll('#projects a.repo').forEach(function (card) {
        var repo = repoFromLink(card.href);
        if (!repo) return;

        var cached = readCache(repo);
        if (cached) { fillCard(card, cached); return; }

        fetch('https://api.github.com/repos/' + repo)
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (data) {
                if (!data || typeof data.stargazers_count !== 'number') return;
                var d = { stars: data.stargazers_count, forks: data.forks_count, lang: data.language };
                writeCache(repo, d);
                fillCard(card, d);
            })
            .catch(function () { /* offline or rate-limited: leave stats empty */ });
    });
})();
