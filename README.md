# Computer Vision for Assistive Object-Finding: A Survey of Mobile and Senior-Oriented Methods

Static, accessible tutorial website suitable for GitHub Pages deployment.

## Features
- Semantic HTML5 with landmarks (`header`, `nav`, `main`, `footer`), skip link, and labeled controls
- Mobile-first responsive layout; base font size ≥ 18px
- Text Size toggle (normal/large) and High Contrast toggle; persisted via `localStorage`
- Dark/light theme respects OS preference (`prefers-color-scheme`)
- Global navigation on all pages; `aria-current` highlights the active page
- Footer shows last-updated date; link to Annotated Bibliography
- Audio player slot on every page (`assets/audio/*.mp3`)
- Anchored citations like `[1]` linking to `sections/annotated-bibliography.html#ref-1`

## Structure
```
/ (root)
├─ index.html
├─ 404.html
├─ README.md
├─ .nojekyll
├─ assets/
│  ├─ css/styles.css
│  ├─ js/main.js
│  ├─ img/
│  └─ audio/
└─ sections/
   introduction.html
   related-work.html
   classical-methods.html
   modern-on-device.html
   datasets-evaluation.html
   accessibility-privacy.html
   challenges-gaps.html
   future-conclusion.html
   annotated-bibliography.html
   quiz.html
```

## Local preview
Use any static server to preview locally, for example Python:

```bash
cd "Project 1 Niha"
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Deploy to GitHub Pages
1. Create a new GitHub repository and push this folder's contents to the `main` (or `master`) branch.
2. Ensure `.nojekyll` exists at the root (included) to disable Jekyll processing.
3. On GitHub, go to Settings → Pages:
   - Source: Deploy from a branch
   - Branch: `main` (or `master`), folder: `/root`
4. Save. Your site will be available at the provided Pages URL.

### Custom domain (optional)
Add a `CNAME` file at the root with your domain, then configure DNS per GitHub Pages docs.

## Accessibility notes
- All interactive controls have accessible names and `aria-pressed` states.
- High contrast and large-text modes are available and persisted.
- Navigation indicates the current page via `aria-current="page"`.
- Each image should include meaningful `alt` text; replace placeholder assets accordingly.
- Each page includes an audio player for narration; add MP3 files under `assets/audio/`.

## Adding content
- Replace placeholder text in each `sections/*.html` with your content.
- Add images to `assets/img/` and reference them with `alt` text.
- Update citations to point to real references in `sections/annotated-bibliography.html` using anchors like `#ref-3`.

## Audio checklist (MP3s)
1. Export MP3 files for each page using consistent names:
   - Home: `assets/audio/index.mp3`
   - Sections: `assets/audio/<page-name>.mp3` (e.g., `introduction.mp3`, `related-work.mp3`)
2. Verify playback locally (open DevTools console for errors if any).
3. Ensure transcripts are added by replacing the placeholder `<details>` content under each page’s audio block.

## Production tips
- JS is small and loaded with `defer`.
- Images are lightweight SVG placeholders; replace with optimized PNG/SVG and set `loading="lazy"`.
- Confirm color contrast (≥ 4.5:1) when customizing colors.


