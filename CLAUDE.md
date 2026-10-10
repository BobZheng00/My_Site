# CLAUDE.md

Guidance for working on this repository: Bob Zheng's single-page portfolio at
<https://bobzheng.com>. Plain HTML, CSS and JS; no framework, no build step. See `README.md`
for structure, content updates and deployment.

## Design language

The site follows the International Typographic Style (Swiss Style), interpreted through the
**Rhine Lab** identity from *Arknights* (Hypergryph). The primary reference is the official
*Rhine Lab: Access* film, with Josef Müller-Brockmann's posters and Dieter Rams' Braun products
as secondary references. It's an unofficial homage and uses no game assets.

- **Ground:** warm eggshell, sampled from the film (`#F0F0E4` → `#E4E4DE`). The site is light
  throughout; no dark hero, no dark mode.
- **One heavy element per section:** a green-black section block with a four-letter code
  (`PRFL`, `EXPR`, `RSCH`, `PROJ`, `STCK`, `CNTC`), a "Section 0X" tab and a descriptor. It sits
  in the left index column and stays pinned (CSS sticky) while the section scrolls.
- **Structure:** a full-height hairline rule separates the index column from the content; a
  small lime marker on it shows scroll position. Every band uses the same `.frame` grid.
- **Name tags:** roles and featured items use the personnel-tag format:
  role / **NAME** / hairline / credential, with dates on the right.
- **Type:** Montserrat (the identity's geometric sans) for structure, labels and display;
  Inter for running text. Hierarchy comes from scale and weight, not colour.
- **Colour:** a signal, never a field. Rhine orange (`--signal`) marks a few pixels: the hero
  arc, the active nav line, hover underlines, the figure's highlighted layer. Lime (`--lime`)
  marks position and "active". Nothing saturated covers a large area.
- **Restraint:** few focal points per screen. No glow, no scanlines, no decorative telemetry,
  no tickers, no hazard tape, no canvases.

All colours, fonts and spacing are tokens at the top of `assets/css/site.css`; change them there.

## Copy rules

- **No em dashes ("—") in visible site text.** The owner finds they make copy read as
  AI-generated. Use commas, colons, periods or parentheses. Date ranges use en dashes
  (`Sep 2026 – Dec 2026`, `2023–28`).
- **English only.** No Chinese or other CJK text on the site.
- Keep claims plain and factual; everything must trace back to the owner's resume. Don't
  restate the EMNLP paper in the hero (Profile and Research cover it).
- Contact: `b63zheng@uwaterloo.ca` is the primary email (internships); `shenyanzheng00@gmail.com`
  is personal. No phone number anywhere on the site.

## Before finishing a change

- Run the CI checks locally (commands in `README.md`): `html-validate` and
  `.github/scripts/check_links.py` must both pass, or the deploy is blocked.
- Look at the result in a browser at desktop (1440 px) and phone (390 px) widths; there should be
  no horizontal scroll and no console errors.
- Text colour pairs must meet WCAG AA (4.5:1); the existing tokens already do.
