# Genesis-Engineered-===== README.md =====
```md
# Genesis Engineered — GitHub starter project

This folder contains the seven HTML pages:

- `index.html` — welcome / lift-the-gate page and the six-card portal
- `day-1.html` through `day-6.html` — the six linked interpretation pages
- `assets/styles.css` — shared visual design
- `assets/app.js` — portal controls and local progress tracking

## Run locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Put your existing pages into the project

Replace the placeholder body content in each `day-X.html` with the matching HTML page content. Keep these two lines near the bottom of every page so the progress bar continues to work:

```html
<link rel="stylesheet" href="assets/styles.css">
<script src="assets/app.js"></script>
<script>completeDay(1)</script>
```

Change the final number to the matching day. If your existing pages already have their own CSS, you can keep it and add the shared stylesheet after it, or copy the portal card styles into your existing stylesheet.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this folder, not the parent folder itself.
3. In GitHub, open **Settings → Pages**.
4. Select **Deploy from a branch**, choose `main`, and choose `/ (root)`.
5. Save. GitHub will provide the public site URL.

The links are relative (`day-1.html`, etc.), so they work on GitHub Pages and on a local server. Progress is saved in the visitor's browser with `localStorage`.

```
