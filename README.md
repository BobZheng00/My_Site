# Bob Zheng · personal site

Source for **<https://bobzheng.com>**, a single-page portfolio.

No framework and no build step. GitHub Pages serves the files as they are, deployed by GitHub Actions.
Design notes and editing rules live in [`CLAUDE.md`](CLAUDE.md).

## Layout

| Path | What it is |
| --- | --- |
| `index.html` | All page content. Edit text here. |
| `assets/css/site.css` | Design tokens (top of file) and every component style |
| `assets/js/site.js` | Small progressive enhancements: auto status, scroll position, mobile menu, copy email |
| `assets/docs/Shenyan_Bob_Zheng_Resume.pdf` | The resume behind every "Resume" link |
| `assets/img/` | Favicon, touch icon, social preview card (`og-card.png`) |
| `404.html` | Self-contained "not found" page |
| `.github/workflows/deploy.yml` | CI/CD: checks every push and PR, deploys `main` to GitHub Pages |
| `.github/scripts/check_links.py` | Fails the build on any broken internal link, anchor or asset path |
| `.htmlvalidate.json` | HTML validator settings used in CI |
| `CLAUDE.md` | Design language and editing rules |
| `_archive/legacy-2024/` | The original 2023–24 site. Kept for reference, never deployed. |

The page works without JavaScript and with *reduced motion* turned on. Every piece of content
is in the HTML.

## Updating content

- **New role:** copy an `<li class="rec">` block in `#experience`. Set `data-start="YYYY-MM"`
  and `data-end="YYYY-MM"` (or `"present"`), plus a short `data-short` label. The
  Active/Complete chips, the hero's **Now** line and the *Current* list all work themselves out
  from today's date. Update the role count in the section's side note.
- **New project:** copy a `<details class="op">` row in `#projects`.
- **Resume:** replace `assets/docs/Shenyan_Bob_Zheng_Resume.pdf` and keep the filename.
- **Dates:** update "Last updated" in the footer.
- **Colours and type:** everything comes from the tokens at the top of `site.css`.

## Preview locally

```sh
python -m http.server 8000
# open http://localhost:8000
```

## Deploy

Every push and pull request runs the **Check and deploy** workflow:

1. **Check:** it assembles the published files (`index.html`, `404.html`, `assets/`), validates
   the HTML with `html-validate`, and runs `check_links.py` over every internal link, anchor and
   asset. Any failure stops the deploy.
2. **Deploy:** on `main` only, it publishes those files to GitHub Pages. The site updates about
   a minute after the push.

`README.md`, `CLAUDE.md`, `.idea/` and `_archive/` are never published.

To run the same checks locally:

```sh
mkdir -p _site && cp -r index.html 404.html assets _site/
npx html-validate index.html 404.html
python .github/scripts/check_links.py _site
```

### Custom domain

The site is served at `bobzheng.com`. That's configured in **Settings → Pages → Custom
domain**, not with a `CNAME` file, because the workflow deploys via Actions. DNS is managed in
Cloudflare, with every record set to **DNS only** (grey cloud) so GitHub can issue the HTTPS
certificate:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
| CNAME | `www` | `bobzheng00.github.io` |

GitHub redirects `www.bobzheng.com` and the old `bobzheng00.github.io/My_Site/` address to
`bobzheng.com`.
