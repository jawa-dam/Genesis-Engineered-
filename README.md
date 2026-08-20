# Genesis Engineered 3.0 — GitHub starter project

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

## Change the random hero images

Open `assets/app.js` and edit the `HERO_IMAGES` array near the top. The starter project now includes six local PNGs in `assets/images/`, which prevents GitHub Pages or a browser preview from blocking remote images:

```js
const HERO_IMAGES = [
  'assets/images/hero-1.png',
  'assets/images/hero-2.png',
  'assets/images/hero-3.png'
];
```

You can replace those files with your own PNGs, add more files, or use full URLs instead:

```js
const HERO_IMAGES = [
  'https://your-website.com/first-image.png',
  'https://your-website.com/second-image.png'
];
```

One image is chosen randomly each time `index.html` is refreshed. The images are not displayed as a public gallery.

## Day-card sounds and progress

When a visitor taps a day card, the progress bar activates immediately and the card briefly flashes before opening the page. The sound is generated in the browser with the Web Audio API, so no audio files are required. Day 1 uses layered low impacts and filtered noise for a mountain-rubble effect; the other days use distinct rising tones. Browsers require the sound to begin from a user tap, which is why the effect is attached to the card click.

## Timed day unlocks

Day 1 is available immediately. Days 2–6 unlock in numerical order. Each day starts a persistent five-minute countdown when its page is opened. The **Speed Up the Water** button removes six seconds and plays a water sound. The countdown uses browser `localStorage`, so refreshing or leaving the page does not reset it. At zero, the timer remains at `00:00` and the next day is marked unlocked. Random blueprint messages and water-line motion keep the waiting screen active.
