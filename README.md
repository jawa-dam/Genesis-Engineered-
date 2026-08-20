# Genesis Engineered

A cinematic, framework-free static site for Wilbert Bouie Jr.'s Genesis
Engineered Interpretations of Genesis Chapter 1. Plain HTML, CSS, and
JavaScript only — no build step, no npm dependencies, no external
frameworks. Built to run as-is on GitHub Pages.

## Folder structure

```text
genesis-engineered/
├── index.html          Landing page — randomized artwork + 6-day portal
├── day-1.html           Day 1 content + unlock gate for Day 2
├── day-2.html           Day 2 content + unlock gate for Day 3
├── day-3.html           Day 3 content + unlock gate for Day 4
├── day-4.html           Day 4 content + unlock gate for Day 5
├── day-5.html           Day 5 content + unlock gate for Day 6
├── day-6.html           Day 6 content + completion message (no gate)
├── README.md            This file
└── assets/
    ├── styles.css        All visual styling and design tokens
    ├── app.js             All interactive logic (images, timers, sound)
    └── images/            Empty by default — see "Local images" below
```

Every page loads only `assets/styles.css` and `assets/app.js`. There is
no other JavaScript or CSS anywhere in the project, and nothing is
loaded from a remote CDN.

## About the hero images

The six hero-artwork URLs you sent me are hosted on `zyrosite.com`
(your existing yalltoo.com site). I wired those exact URLs directly into
`assets/app.js` so the site works immediately — no download step needed.
That's a deliberate deviation from "local by default," since you gave me
hosted URLs rather than the six transparent PNGs described in the brief.

**To switch to local images instead** (recommended for a fully
self-contained repo that doesn't depend on your other site staying up):

1. Save your six PNGs into `assets/images/` as `hero-1.png` through
   `hero-6.png` (or any names you like).
2. Open `assets/app.js` and find the `IMAGES` array near the top of the
   file. Replace the six URLs with relative paths, for example:

   ```js
   const IMAGES = [
     "assets/images/hero-1.png",
     "assets/images/hero-2.png",
     "assets/images/hero-3.png",
     "assets/images/hero-4.png",
     "assets/images/hero-5.png",
     "assets/images/hero-6.png"
   ];
   ```

You can list any number of images (not just six) — the landing page
always picks exactly one at random on each load, preloads it, and
silently tries the next one in the list if an image fails to load.

## Pasting your interpretation content

Each `day-X.html` file has one clearly marked spot to paste your
writing. Open the file and look for:

```html
<div class="content-slot">
  <!-- PASTE YOUR DAY X CONTENT HERE -->
  <p>Your Day X interpretation content goes here.</p>
</div>
```

Delete the placeholder paragraph and paste your own HTML in its place —
headings (`<h2>`, `<h3>`), paragraphs (`<p>`), lists (`<ul>`/`<ol>`), and
images all work fine inside that block. This section is plain HTML, so
it reads and displays correctly even for visitors with JavaScript
turned off.

## How the unlock timers work

Each day page (Days 1–5) shows a **Gate Status** panel with a countdown
from `05:00`. When it reaches `00:00`, the next day unlocks and stays
unlocked — a card that plays a soft chime and stays locked before that.

Technical details:

- The countdown is driven by a **target end time**, not a running
  interval, so it survives refreshes and closed tabs. The first time you
  visit a day page, `assets/app.js` stores `Date.now() + 5 minutes` as
  that day's end time in `localStorage`. Every later visit reads the
  same stored end time and just recalculates the remaining time.
- Once the countdown hits zero it **stays at `00:00`** — it never
  resets, and revisiting the page won't restart it.
- Day 6 has no "Day 7" to unlock, so it shows a completion panel instead
  of a gate — exactly as the brief asked for.
- Unlock state (which days are open) is stored separately from the
  timers, in a small progress object in `localStorage`, so a visitor
  can freely revisit any day they've already unlocked.

## How the "Speed Up the Water" button works

Every tap removes exactly **6 seconds** from that day's remaining time,
plays a short synthesized water-flow sound, and updates the display
immediately. It cannot push the timer below `00:00` — repeated taps
near the end simply hold it at zero and the gate opens normally.

## Sound design

All sound is generated live with the Web Audio API — there are no audio
files anywhere in the project. Sounds only ever start after a real tap
or click (never on page load), so they respect browser autoplay rules.
If Web Audio isn't available for any reason, those calls quietly do
nothing and the rest of the site keeps working normally.

## Running locally

From inside the `genesis-engineered/` folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/` in your browser. (This local URL is
only for testing on your own machine — it is never referenced anywhere
in the site's own code, which uses relative links throughout.)

## Publishing with GitHub Pages

1. Push this folder's contents to a GitHub repository (the six PNGs, if
   you switch to local images, should be committed inside
   `assets/images/`).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a
   branch," choose your default branch (e.g. `main`) and the `/ (root)`
   folder, then save.
4. GitHub will publish the site at
   `https://USERNAME.github.io/REPOSITORY-NAME/`. Because every link and
   asset path in this project is relative, it works correctly at that
   nested URL without any changes.

## Resetting local progress while testing

There is **no public reset button** — visitors can't wipe their own
progress by accident, and the site never exposes a way to do it from
the interface. For your own testing, open the browser's developer
console on any page of the site and run:

```js
GEI.reset()
```

This clears every `localStorage` key the site uses (unlock state,
visited days, and all six timers) and logs a confirmation message.
Refresh the page afterward to see the site as a brand-new visitor would.

You can also inspect current progress at any time with:

```js
GEI.progress()
```

## A note on the copy-code feature

As requested, this project does **not** include any public "copy HTML"
or source-viewing feature on the live site. Anyone can still use their
browser's own "View Source" (as with any website), but nothing in the
site itself surfaces or offers to copy its own code.

## Browser/device pass

This was reviewed with Chrome, Safari, Firefox, Android, and iPhone
behavior in mind:

- Timers use a stored end-timestamp (not `setInterval` alone), so
  backgrounding a mobile tab and returning to it won't desync or reset
  the countdown.
- All layout uses `clamp()` and CSS Grid/Flexbox with no fixed pixel
  widths that could overflow on small screens; `overflow-x` is
  constrained on `html`/`body` as a second safety net.
- No `position: fixed` is used anywhere, and all internal links use
  `href="..."` with plain relative paths (no `target="_top"` is needed
  here since this project isn't embedded in an iframe, unlike some of
  your other Hostinger-based projects).
- Every interactive element (portal cards, the entrance button, the
  speed-up button) is a real `<a>` or `<button>`, reachable and
  operable by keyboard alone, with a visible focus outline.
- `prefers-reduced-motion` is respected: ambient mist/light/portal
  animation and the card "shake" effect are all disabled for visitors
  who request reduced motion.
- Countdown and lock-message updates use `aria-live="polite"` regions
  so screen reader users hear the status changes without needing to
  navigate to them.
