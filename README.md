# sangwookim CV

Live: https://swtbkim.github.io/sangwookim/

Personal CV site built on [sharu725/online-cv](https://github.com/sharu725/online-cv), with a monochrome (`mono`) skin.

## Editing content
- All content lives in `_data/data.yml`.
- Profile photo: put a square image in `assets/images/` and set `sidebar.avatar`.
- Up to three publication blocks (`publications`, `publications2`, `publications3`) and three experience blocks (`experiences`, `experiences2`, `experiences3`); comment out a block to hide it.
- Sidebar supports `orcid`, `scholar`, `pdf-en`, `pdf-kr` in addition to the template defaults.

## Colors
`_sass/skins/_mono.scss` — keep this file ASCII-only (non-ASCII comments break the GitHub Pages Sass build).

## Local preview
```bash
bundle install
bundle exec jekyll serve
```

## English / Korean pages
- English: `/sangwookim/` (`index.html`), Korean: `/sangwookim/ko/` (`ko/index.html`)
- Both pages share the section order in `_includes/cv-body.html`.
- In `_data/data.yml`, add a `_ko` field next to any text field (e.g. `role_ko`, `title_ko`).
  The Korean page uses it when present and falls back to the English value otherwise.
- `present` in `time` fields is shown as `현재` on the Korean page automatically.
- Lists: `research-interests.info_ko` replaces `info` on the Korean page.
- Helper: `_includes/t.html`.

## CV PDF / last-updated date
- `sidebar.last-updated` in `_data/data.yml` is shown at the bottom of the sidebar and in the PDF.
- PDFs live in `assets/pdf/` and are linked from the sidebar (`pdf-en`, `pdf-kr`).
- After editing content, update `last-updated` and rebuild the PDFs:
  ```bash
  bash tools/make-pdf.sh
  ```
  Requires Ruby/Bundler (Jekyll), Node and Playwright (`npm i -g playwright && npx playwright install chromium`).
