# Giiift Homepage and Know You Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh the homepage and `/know-you/` so the site feels polished and personal, explains `Know You` in work-focused language, and uses real screenshots plus founder presence to improve clarity and conversion.

**Architecture:** Keep the current static-site architecture and update the two HTML entrypoints plus the shared stylesheet. Add one web-safe founder avatar asset, then rebuild the homepage hierarchy and the `Know You` product page around denser sections, better copy, and screenshot-led proof.

**Tech Stack:** Static HTML, shared CSS, optimized PNG/JPG image assets

---

## File Structure

- Create: `assets/images/tianfu-avatar.png`
- Modify: `index.html`
- Modify: `know-you/index.html`
- Modify: `assets/css/site.css`
- Verify: manual browser checks on `/` and `/know-you/`

### Task 1: Prepare the founder avatar asset

**Files:**
- Create: `assets/images/tianfu-avatar.png`

- [ ] **Step 1: Export a web-safe avatar asset from the provided source**

Run:

```bash
mkdir -p /tmp/giiift-site-assets
sips -s format png /Users/wutianfu/Downloads/IMG_1912.HEIC --out /tmp/giiift-site-assets/tianfu-avatar.png
```

Expected: `/tmp/giiift-site-assets/tianfu-avatar.png` exists and opens correctly.

- [ ] **Step 2: Copy the exported avatar into the site asset directory**

Run:

```bash
cp /tmp/giiift-site-assets/tianfu-avatar.png /Users/wutianfu/Code/giiift-site/assets/images/tianfu-avatar.png
```

Expected: `assets/images/tianfu-avatar.png` exists in the repository.

- [ ] **Step 3: Verify the asset metadata**

Run:

```bash
sips -g pixelWidth -g pixelHeight /Users/wutianfu/Code/giiift-site/assets/images/tianfu-avatar.png
```

Expected: valid pixel dimensions are printed with no read error.

- [ ] **Step 4: Commit the asset addition**

```bash
git add assets/images/tianfu-avatar.png
git commit -m "feat: add founder avatar asset for homepage"
```

### Task 2: Rebuild the homepage markup around the approved direction

**Files:**
- Modify: `index.html:6-154`

- [ ] **Step 1: Replace the homepage metadata and hero copy with the new product-first message**

Update the document head and hero copy to use product-led language:

```html
<title>Giiift | AI products that help you remember and communicate better</title>
<meta
  name="description"
  content="Independent AI products by Tianfu Wu. Know You for macOS helps you remember what you actually did today."
/>
...
<p class="eyebrow">Independent AI products by Tianfu Wu</p>
<h1>AI products that help you remember, reflect, and communicate better.</h1>
<p class="lede">
  Giiift builds compact products with a human point of view. Right now the focus is
  Know You, a macOS app that turns your workday into a readable story you can
  revisit before you forget what happened.
</p>
```

- [ ] **Step 2: Add the founder chip row and compact contact links inside the hero**

Insert founder identity and contact links near the top of the hero:

```html
<div class="founder-strip">
  <img
    class="founder-avatar"
    src="/assets/images/tianfu-avatar.png"
    alt="Portrait of Tianfu Wu"
  />
  <div class="founder-meta">
    <strong>Tianfu Wu</strong>
    <span>Builder of Giiift</span>
  </div>
</div>

<div class="contact-pills" aria-label="Contact links">
  <a class="pill-link" href="https://x.com/TianfuW49629" target="_blank" rel="noreferrer">X</a>
  <a class="pill-link" href="mailto:cestlouiswu@gmail.com">Email</a>
  <a class="pill-link" href="https://discord.gg/ZrqF5jwQ" target="_blank" rel="noreferrer">Discord</a>
  <a class="pill-link" href="https://github.com/gift-is-coding" target="_blank" rel="noreferrer">GitHub</a>
</div>
```

- [ ] **Step 3: Replace the oversized product directory with a tighter featured shelf**

Update the homepage body so `Know You` is the hero product and `Who is Right` remains visible but secondary:

```html
<section class="feature feature-shelf" id="products">
  <div class="section-label">Products</div>
  <div class="section-heading">
    <h2>Built small, meant to be useful.</h2>
    <p>Two live products so far. Know You leads, Who is Right stays one click away.</p>
  </div>
  <div class="product-grid">
    <a class="product-card product-card-primary" href="/know-you/">
      <span class="card-kicker">For macOS</span>
      <strong>Know You</strong>
      <span class="card-copy">Remember what you actually did today, without reading raw logs.</span>
    </a>
    <a class="product-card product-card-secondary" href="/who-is-right/">
      <span class="card-kicker">On the web</span>
      <strong>Who is Right</strong>
      <span class="card-copy">A playful AI judge for arguments, disputes, and chaotic group chats.</span>
    </a>
  </div>
</section>
```

- [ ] **Step 4: Compress the bottom of the homepage into a tighter founder/about section**

Replace the large contact block and oversized about section with a compact founder note:

```html
<section class="about about-compact" id="about">
  <div class="section-label">About</div>
  <p>
    I make small, opinionated AI products with a human tone. Giiift is where those
    products ship in public.
  </p>
</section>
```

- [ ] **Step 5: Run a focused diff check on the homepage file**

Run:

```bash
git diff -- index.html
```

Expected: the diff shows the new hero structure, founder/contact markup, tighter product shelf, and updated homepage copy.

- [ ] **Step 6: Commit the homepage markup changes**

```bash
git add index.html
git commit -m "feat: redesign giiift homepage structure"
```

### Task 3: Rewrite the Know You product page for work-focused users

**Files:**
- Modify: `know-you/index.html:6-68`

- [ ] **Step 1: Replace the page metadata with work-focused messaging**

Update the page head:

```html
<title>Know You for macOS | Remember what you actually did today</title>
<meta
  name="description"
  content="Know You is a macOS app that turns your day on the computer into a readable story for end-of-day recaps, weekly reviews, and work logs."
/>
<meta
  property="og:description"
  content="Remember what you actually did today with a readable story built from your workday on macOS."
/>
```

- [ ] **Step 2: Replace the minimal hero with a product hero plus screenshot**

Use a split hero with proof and a clearer value statement:

```html
<section class="hero hero-product hero-product-split">
  <div class="hero-copy">
    <p class="eyebrow">For macOS</p>
    <h1>Remember what you actually did today.</h1>
    <p class="lede">
      Know You turns your day on the computer into a readable story, so you can
      recap your work, rebuild context after interruptions, and write updates
      without guessing what happened.
    </p>
    <div class="hero-actions">
      <a class="button button-primary" href="/know-you/download" download>Download for macOS</a>
      <a class="button button-secondary" href="/">Back to Giiift</a>
    </div>
  </div>
  <div class="product-shot">
    <div class="screenshot-frame screenshot-frame-hero">
      <img
        class="screenshot-image screenshot-image-hero"
        src="/assets/images/know-you-shot.png"
        alt="Know You app showing a daily story and supporting context"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add concrete use-case sections and trust cues**

Create sections that explain why the app exists:

```html
<section class="feature">
  <div class="section-label">Why people use it</div>
  <h2>Built for the moments when your workday turns blurry.</h2>
  <div class="use-case-grid">
    <article class="info-card">
      <strong>End-of-day recap</strong>
      <p>See what actually happened before you shut down for the day.</p>
    </article>
    <article class="info-card">
      <strong>Weekly sync prep</strong>
      <p>Reconstruct the week faster when you need to explain progress clearly.</p>
    </article>
    <article class="info-card">
      <strong>Interrupted work recovery</strong>
      <p>Pick up the thread after meetings, context switching, or an overloaded day.</p>
    </article>
  </div>
</section>
```

- [ ] **Step 4: Add a screenshot-led explanation section**

Translate the interface into plain language:

```html
<section class="feature feature-proof">
  <div class="section-label">What you are looking at</div>
  <div class="proof-layout">
    <div class="proof-copy">
      <h2>A readable story instead of a pile of activity.</h2>
      <p>The interface is designed to help you move from raw context to an understandable day narrative.</p>
      <ul class="feature-list">
        <li>Browse recent days on the left.</li>
        <li>Read the main story in the center.</li>
        <li>Use the supporting sources on the right when you need detail.</li>
      </ul>
    </div>
    <div class="screenshot-frame screenshot-frame-proof">
      <img
        class="screenshot-image screenshot-image-proof"
        src="/assets/images/know-you-shot.png"
        alt="Know You interface with day navigation, story view, and supporting sources"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 5: Add a final platform-fit CTA**

Close the page with platform reassurance:

```html
<section class="feature feature-cta">
  <div class="section-label">Made for macOS</div>
  <h2>For people whose days move faster than their memory.</h2>
  <p>Know You is built for individual use on Mac and works best when you need a clear recap before the details disappear.</p>
  <div class="hero-actions">
    <a class="button button-primary" href="/know-you/download" download>Download Know You</a>
  </div>
</section>
```

- [ ] **Step 6: Run a focused diff check on the Know You page**

Run:

```bash
git diff -- know-you/index.html
```

Expected: the diff shows the new hero, use-case sections, screenshot proof block, and final CTA.

- [ ] **Step 7: Commit the Know You page rewrite**

```bash
git add know-you/index.html
git commit -m "feat: rewrite know you landing page"
```

### Task 4: Extend the shared CSS for the new layout and motion

**Files:**
- Modify: `assets/css/site.css:1-535`

- [ ] **Step 1: Refresh the theme tokens and typography hierarchy**

Update the root palette and base layout to feel more product-polished:

```css
:root {
  color-scheme: light;
  --bg: #efe6d8;
  --bg-accent: #f8f2ea;
  --panel: rgba(255, 251, 247, 0.88);
  --panel-strong: #fff8f1;
  --text: #201813;
  --muted: #6b5c52;
  --line: rgba(32, 24, 19, 0.12);
  --accent: #1e3d36;
  --accent-soft: #edf6f2;
  --shadow: 0 28px 70px rgba(48, 31, 20, 0.12);
}
```

- [ ] **Step 2: Add homepage-specific layout blocks**

Introduce reusable homepage classes:

```css
.founder-strip {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(255, 248, 241, 0.76);
}

.founder-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  animation: avatar-sway 4.8s ease-in-out infinite;
}

.contact-pills,
.product-grid,
.use-case-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
```

- [ ] **Step 3: Add Know You proof layout and denser card styles**

Add the new section classes used by both pages:

```css
.hero-product-split,
.proof-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.96fr);
  gap: 24px;
  align-items: center;
}

.info-card,
.pill-link {
  border: 1px solid var(--line);
  background: var(--panel);
}

.feature-list {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
}
```

- [ ] **Step 4: Add the founder avatar motion and mobile responsive rules**

Extend the animation and mobile layout support:

```css
@keyframes avatar-sway {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25% { transform: translateX(2px) rotate(1.2deg); }
  75% { transform: translateX(-2px) rotate(-1.2deg); }
}

@media (max-width: 720px) {
  .hero,
  .hero-product-split,
  .proof-layout {
    grid-template-columns: 1fr;
  }

  .contact-pills,
  .product-grid,
  .use-case-grid {
    flex-direction: column;
  }
}
```

- [ ] **Step 5: Run a focused diff check on the shared stylesheet**

Run:

```bash
git diff -- assets/css/site.css
```

Expected: the diff shows theme updates, founder strip/avatar styles, new card and proof layouts, and responsive rules for the redesigned pages.

- [ ] **Step 6: Commit the CSS changes**

```bash
git add assets/css/site.css
git commit -m "feat: add styling for redesigned landing pages"
```

### Task 5: Verify the redesigned pages end to end

**Files:**
- Verify: `index.html`
- Verify: `know-you/index.html`
- Verify: `functions/know-you/download.js`

- [ ] **Step 1: Start a local static server for the site**

Run:

```bash
python3 -m http.server 4173
```

Expected: local server starts in the repository root and serves `http://localhost:4173/`.

- [ ] **Step 2: Check the homepage and product page in a browser**

Visit:

```text
http://localhost:4173/
http://localhost:4173/know-you/
```

Expected:
- homepage hero shows the avatar, contact pills, and compressed product shelf
- `Know You` page shows the new work-focused hero and screenshot-led sections

- [ ] **Step 3: Check the download endpoint wiring remains untouched**

Run:

```bash
sed -n '1,200p' functions/know-you/download.js
```

Expected: the redirect logic is unchanged by this redesign work.

- [ ] **Step 4: Run a final repository diff review**

Run:

```bash
git status --short
git diff -- assets/css/site.css index.html know-you/index.html
```

Expected: only the intended landing-page files plus the avatar asset are changed.

- [ ] **Step 5: Commit the verified redesign**

```bash
git add assets/images/tianfu-avatar.png assets/css/site.css index.html know-you/index.html
git commit -m "feat: redesign giiift homepage and know you page"
```
