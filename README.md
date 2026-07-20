# shaddy43.github.io

> Personal portfolio of **Shayan Ahmed Khan** - *Threat Researcher* working across malware reverse engineering & development, detection/response engineering and technical threat reporting.

<p align="center">
  <a href="https://shaddy43.github.io"><strong>🌐 Live Site → shaddy43.github.io</strong></a>
</p>

<p align="center">
  <a href="https://github.com/shaddy43">GitHub</a> ·
  <a href="https://www.linkedin.com/in/shayan-ahmed-khan-517168120/">LinkedIn</a> ·
  <a href="https://medium.com/@shaddy43">Medium</a>
</p>

---

## Overview

A fast, dependency-light personal site built with **Jekyll** on **GitHub Pages** (Slate theme). It doubles as a home for my public work, malware analysis reports, offensive-security tooling, and detection research with a noir-terminal aesthetic to match the subject matter.

## Features

- **`#Whoami` panel**: an animated, CSS-layered noir "IDA" avatar (tint, cigarette-ember glow, drifting smoke, film grain, vignette) beside a live-styled `whoami` terminal.
- **Data-driven content**: posts and projects render from simple YAML; no HTML editing to publish.
- **Live GitHub stats**: project cards pull language, ⭐ stars, and forks straight from the GitHub API, cached in `localStorage` for an hour to stay well under the rate limit (degrades gracefully offline).
- **Client-side pagination**: cards paginate without a page reload; if JS is disabled, every card simply shows.
- **Privacy-friendly analytics**: GoatCounter records pageviews and outbound card clicks (no cookies, no personal data).
- **Responsive & progressive**: mobile layout stacks cleanly; core content works without JavaScript.

## Tech Stack

| Area        | Choice                                            |
|-------------|---------------------------------------------------|
| Site engine | Jekyll (GitHub Pages)                             |
| Theme       | `jekyll-theme-slate`                              |
| Templating  | Liquid + `_data/*.yml`                            |
| Styling     | Hand-written CSS (`assets/css/custom.css`)        |
| Fonts       | Carter One, JetBrains Mono (Google Fonts)         |
| Analytics   | GoatCounter                                       |

## Project Structure

```
.
├── index.html              # Home page - Whoami, posts & project cards (Liquid)
├── _config.yml             # Jekyll config (theme, title, description)
├── _layouts/default.html   # Base layout
├── _includes/head-custom.html  # Fonts, favicon, analytics hooks, custom CSS
├── _data/
│   ├── posts.yml           # Blog posts / analysis reports  → "Recent Posts"
│   └── projects.yml        # Repositories                   → "Projects"
├── assets/
│   ├── css/custom.css      # Cards, terminal, avatar animation, pagination
│   └── js/
│       ├── ida-avatar.js   # Generates the avatar's film-grain layer
│       ├── github-stats.js # Live stars/forks/language (cached)
│       ├── pagination.js   # Client-side card pagination
│       └── analytics.js    # Outbound-click event tracking
└── Assets/                 # Images, avatar GIF, card thumbnails
```

## Adding Content

Append an entry to the matching file in `_data/`, no HTML changes needed.

**New project**: `_data/projects.yml`:
```yaml
- title: "Project Name"
  description: "One-line summary of what it does."
  tags: [reversing, windows, yara]
  ribbon: "Latest"        # optional: Latest (blue) · Featured (gold) · Archived (grey)
  link: "https://github.com/shaddy43/your-repo"
```

**New post**: add an entry to `_data/posts.yml` following the existing format.

## Run Locally

```bash
# one-time setup (no Gemfile is committed; GitHub Pages builds without one)
gem install bundler jekyll github-pages
printf 'source "https://rubygems.org"\ngem "github-pages", group: :jekyll_plugins\n' > Gemfile
bundle install

# serve with live reload → http://localhost:4000
bundle exec jekyll serve --livereload
```

> Prefer not to install Ruby? `python3 -m http.server 8000` works for a quick look, but Liquid tags (avatar image, includes) won't resolve, use Jekyll for an accurate preview.

## Deployment

Every push to the default branch is built and published automatically by GitHub Pages. No build step to run by hand.

## License

Content and branding © Shayan Ahmed Khan. Code is available for reference and learning.