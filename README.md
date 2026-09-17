# Purity Testing Centre — landing page

A single-page, conversion-focused landing page for a gold and silver purity
testing centre. The design is deliberately plain and professional: a light UI,
one accent colour, system-weight typography and restrained motion.

## Stack

Static HTML, CSS and a small amount of vanilla JavaScript, bundled with Vite.
No UI framework, no animation library, no external requests other than the
Google Fonts stylesheet. `sharp` is a dev dependency used only by `npm run images`;
it is not shipped to the browser.

```
index.html    markup and content
styles.css    design tokens + all styling
app.js        progressive enhancement only
images/       web-sized photos the page loads
images/source/ full-size originals
scripts/      npm run images — resizes and compresses source photos
```

## Photo slots

Seven `.shot` slots carry the site's photography; two are filled (hero, gold jewellery)
and five are waiting on real photos of the centre. While a slot is empty it paints a
brushed-gold (or silver) panel with a faint line-art mark, so an empty slot reads as
deliberate rather than broken. Dropping an `<img>` inside the `<figure>` replaces the panel;
`aspect-ratio` reserves the box either way, so adding photos causes **zero layout shift**
(measured CLS 0.0000). No JavaScript is involved — the slots work with JS disabled.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview
npm run images   # re-compress photos from images/source/ into images/
```

## Before publishing — replace the placeholders

Nothing about the business has been invented. Every business-specific value is a
placeholder and must be replaced with real information. Search the source for
`PLACEHOLDER`, `SETUP` and `XXXXX` to find them all.

| What | Where | Current value |
| --- | --- | --- |
| Business name | `index.html` (header, footer, JSON-LD, `<title>`) | "Purity Testing Centre" |
| Phone number | every `tel:` link | `tel:+91XXXXXXXXXX` |
| WhatsApp number | every `wa.me` link | `wa.me/91XXXXXXXXXX` |
| Address | contact section, footer, JSON-LD | `PLACEHOLDER — street, area, city, postcode` |
| Opening hours | contact section, footer, JSON-LD | `PLACEHOLDER — e.g. Mon–Sat, 10:00–19:00` |
| Map link | "Get directions" buttons | `maps/search/?api=1&query=Your+business+address` |
| FAQ answers | `#faq` | four answers are marked `SETUP:` |
| Page title / meta description | `<head>` | add the real business name and city |
| Canonical URL | `<head>` | marked `SETUP:`, add once the domain is known |
| Map embed | contact section | a marked comment shows where the Google Maps iframe goes |
| Testing method | `#technology` | `SETUP:` note — name the method and say whether the item is affected |
| **Photos** | 5 of 7 slots | still empty gold panels — machine, coins, silver, result, shop front. See `images/README.md` |

The WhatsApp links carry pre-filled messages ("I would like to know more about
gold purity testing", "I would like to test my gold", "…your testing charges").
Adjust the wording per section as needed.

### FAQ answers that must come from the business

These are marked in the markup and currently contain no answer:

- How long does testing take? — the centre's real typical timeframe.
- Does testing damage my jewellery? — answer according to the actual method used.
- Do I need an appointment? — the actual walk-in policy.
- Will I receive a report? — what the customer actually takes away.

## What was deliberately left out

- **Testimonials and Google reviews.** A commented-out placeholder marks where
  the section goes. Add it only with genuine, attributable reviews.
- **Certifications, accreditations, years of experience, customer counts and
  accuracy percentages.** None are claimed anywhere on the page.
- **Equipment and premises photography.** The machine, coins, silver, result and
  shop front slots stay as designed panels rather than being filled with the
  jewellery product shots that came with the project — a jewellery photo under
  "Coins & bars", or standing in for your machine, would misrepresent the centre.
  The shot list is in `images/README.md`.

The one sample result card in the hero is labelled **"Illustrative example"**
and carries a note stating it is not a real customer result. Keep that labelling
if you change the numbers.

## Accessibility and performance notes

- Semantic landmarks, a single `h1`, and an ordered heading hierarchy.
- Gold is contrast-checked, not eyeballed: gold **text** uses `--gold-ink` (#8B6914,
  5.09:1 on white); the mid gold #B8860B fails at 3.25:1 and is never used for text.
  Gold buttons carry near-black labels, because white on gold is 2.65:1.
- Skip link, visible focus rings, 48px minimum touch targets.
- The purity guide is a proper ARIA tablist with arrow-key, Home and End support.
- The FAQ uses native `<details>`, so it opens and closes without JavaScript.
- Scroll reveal, the hero scan sweep and the meter fill are all disabled under
  `prefers-reduced-motion: reduce`, which shows their finished state instead.
- The hero scan line is decorative and marked `aria-hidden`.
- With JavaScript disabled the page still renders in full: all content, contact
  links, the FAQ and the purity guide's default panel remain available.
