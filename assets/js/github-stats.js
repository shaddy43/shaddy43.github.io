// Replaces the stars/forks line on project cards with live counts from the
// GitHub API. Results are cached in localStorage for an hour, keeping each
// visitor far below the unauthenticated limit of 60 requests/hour. On any
// failure the hardcoded text from _data/projects.yml stays as the fallback.
(function () {
    var CACHE_TTL_MS = 60 * 60 * 1000;

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

    function writeCache(repo, stars, forks) {
        try {
            localStorage.setItem('gh-stats:' + repo,
                JSON.stringify({ stars: stars, forks: forks, ts: Date.now() }));
        } catch (e) { /* storage full or disabled: skip caching */ }
    }

    function showStats(card, stars, forks) {
        var meta = card.querySelector('.card-meta');
        if (!meta) {
            meta = document.createElement('p');
            meta.className = 'card-meta';
            card.querySelector('.card-content').appendChild(meta);
        }
        meta.textContent = 'Stars ☆: ' + stars + ', Forks: ' + forks;
    }

    document.querySelectorAll('#projects a.card-square').forEach(function (card) {
        var repo = repoFromLink(card.href);
        if (!repo) return;

        var cached = readCache(repo);
        if (cached) {
            showStats(card, cached.stars, cached.forks);
            return;
        }

        fetch('https://api.github.com/repos/' + repo)
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (data) {
                if (!data || typeof data.stargazers_count !== 'number') return;
                writeCache(repo, data.stargazers_count, data.forks_count);
                showStats(card, data.stargazers_count, data.forks_count);
            })
            .catch(function () { /* offline or rate-limited: keep fallback text */ });
    });
})();
