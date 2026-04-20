# Giiift Homepage and Know You Redesign

**Date:** 2026-04-21

## Summary

Redesign the Giiift homepage and the `/know-you/` product page so they feel polished, product-led, and clearly useful to first-time visitors. The homepage should still feel personal and founder-built by surfacing Tianfu's avatar and contact methods near the top, but the primary job of the page is to help visitors quickly understand the products and click into `Know You`.

`Know You` should be repositioned from a vague reflection tool into a concrete macOS app for answering a practical question: "What did I actually do today?" The page should explain that value in plain English, show real screenshots, and make the download path feel trustworthy and direct.

## Goals

1. Make the homepage immediately more attractive and easier to scan.
2. Move contact information close to the top of the homepage instead of burying it at the bottom.
3. Add a small founder avatar to the homepage and use light motion so the site feels personal, not corporate.
4. Compress the product directory so visitors can see products and contact options without scrolling deep into the page.
5. Rewrite `/know-you/` for end users in English with work-focused positioning.
6. Add real screenshots and screenshot-led explanation to the `Know You` page.
7. Keep the site lightweight and easy to deploy in the current static-site setup.

## Non-Goals

1. Redesign `Who is Right` in this pass.
2. Add analytics, forms, CMS tooling, or a JavaScript framework.
3. Change the download endpoint behavior for `/know-you/download`.
4. Introduce heavy animation libraries.

## Audience

### Homepage

- Curious visitors landing on `giiift.site`
- Potential users deciding which product to click
- People who want to understand who built the products and how to reach him

### Know You page

- macOS users evaluating whether `Know You` is useful for their workflow
- People who struggle to remember what they did during the day
- Users preparing work logs, weekly syncs, or end-of-day recaps

## Design Direction

Use the approved direction: **Product-first, Personal Accent**.

This means:

- The homepage leads with a sharp product-oriented headline and clear CTA.
- Founder presence is visible near the top through a small avatar and compact contact chips.
- The page feels handcrafted and personal, but not diary-like or messy.
- The visual system should move away from a soft editorial feel and toward a cleaner modern product presentation, while preserving warmth.

## Homepage Information Architecture

### 1. Top bar

- Keep simple brand-first navigation.
- Prioritize `Know You`, `Who is Right`, and a contact anchor.
- Keep the nav compact.

### 2. Hero

- Use a stronger product/company headline that can support both products, while still biasing the page toward `Know You`.
- Show the founder avatar in or near the hero copy area.
- Add a subtle horizontal sway/float motion to the avatar so it feels alive but not distracting.
- Surface compact contact chips near the avatar:
  - X
  - Email
  - Discord
  - GitHub
- Keep the primary CTA focused on `Know You`.
- Support with a secondary CTA for browsing products.
- Show a real `Know You` screenshot in the hero visual.

### 3. Product shelf

- Replace oversized product sections with a tighter card shelf.
- `Know You` should be visually primary.
- `Who is Right` should remain visible but secondary.
- Cards should include:
  - product name
  - platform/type label
  - short one-line promise
  - compact visual or icon treatment

### 4. Founder/about strip

- Keep a short founder note, but compress it into a tighter section.
- It should reinforce independent-builder credibility without interrupting the conversion path.

## Know You Page Information Architecture

### 1. Hero

- Headline should clearly state the core value in work language.
- Working direction:
  - `Remember what you actually did today.`
- Supporting copy should explain that `Know You` turns computer activity into a readable daily story, rather than a pile of logs.
- CTA should remain direct and download-focused.
- The page should signal:
  - macOS
  - private/local-feeling product
  - fast recap value

### 2. Value section

Explain the top reasons someone would want it:

- end-of-day recap
- weekly sync or status prep
- rebuilding context after interruptions
- writing work logs or diaries from real activity

### 3. Screenshot section

Use real product screenshots, not abstract placeholders.

The screenshot section should help users quickly understand the product layout and what they are looking at. It should include short callouts or captions that translate the interface into user value.

### 4. How it works / promise section

Explain the product in simple language:

- it observes your workday context
- it turns that into a readable story
- it helps you recover memory and narrative

Avoid overclaiming technical details or making the page sound like surveillance software.

### 5. Trust/fit section

Reassure the user about fit and platform:

- made for macOS
- built for individual use
- good for people with fragmented workdays

### 6. Final CTA

- Keep the final CTA short and direct.
- Make it obvious that the download is for macOS.

## Copy Direction

### Homepage tone

- clean
- smart
- human
- independent
- lightly playful

### Know You tone

- practical
- calming
- credible
- user-facing
- not overly poetic

### Copy constraints

- English only
- avoid relationship-first messaging on the `Know You` page
- avoid vague "reflection and clarity" language unless anchored to specific work use cases

## Visual Direction

### Homepage

- Retain warmth, but sharpen hierarchy and spacing.
- Introduce clearer visual contrast between hero, cards, and support sections.
- Use smaller, denser components so more value appears above the fold.
- The avatar should feel integrated into the design, not pasted on as a profile photo.

### Know You page

- Make screenshots the proof.
- Use sections that alternate between copy and visual evidence.
- Keep the page premium and readable on desktop and mobile.

## Interaction and Motion

- Avatar gets a subtle looping sway or float animation.
- Buttons/cards can keep lightweight hover lift.
- Motion should remain CSS-only unless a tiny inline script is clearly justified.

## Technical Approach

- Continue using the current static HTML/CSS structure.
- Update `index.html` and `know-you/index.html`.
- Extend `assets/css/site.css` with new layout primitives, responsive rules, and small motion treatments.
- Add any new optimized image assets needed for avatar usage in `assets/images/`.
- Keep markup semantic and dependency-free.

## Accessibility and Responsiveness

- Maintain readable contrast.
- Ensure contact chips and CTAs remain tappable on mobile.
- Use descriptive `alt` text for screenshots and avatar.
- Keep hero and screenshot sections readable without hover.

## Content Inputs

### Existing assets to reuse

- `assets/images/know-you-shot.png`
- `assets/images/who-is-right-shot.png`

### Founder asset

- Convert the provided HEIC avatar into a web-safe asset and crop it appropriately for homepage use.

### Contact links

- X: `https://x.com/TianfuW49629`
- Email: `mailto:cestlouiswu@gmail.com`
- Discord: `https://discord.gg/ZrqF5jwQ`
- GitHub: `https://github.com/gift-is-coding`

## Testing and Verification

1. Open the homepage locally and verify the hero hierarchy, avatar motion, and compressed product/contact layout.
2. Open `/know-you/` locally and verify the new work-focused positioning and screenshot sections.
3. Check responsive behavior on desktop-width and mobile-width viewports.
4. Confirm that `/know-you/download` remains unchanged and still points to the release download path.
5. Verify there are no broken asset paths.

## Risks and Mitigations

### Risk: The homepage becomes too founder-centric

Mitigation:
- keep the avatar small
- keep the main headline product-led
- keep `Know You` as the dominant CTA

### Risk: The Know You page overpromises

Mitigation:
- use concrete work use cases
- let screenshots do the proof
- avoid exaggerated technical copy

### Risk: Too much visual change breaks the current site style

Mitigation:
- preserve the brand name, product structure, and direct static-site architecture
- evolve the visual system instead of replacing everything with an unrelated aesthetic
