# DoodhBook — explainer site

Standalone marketing/explainer page for **DoodhBook** — a per-customer daily
ledger for milk, newspaper and water-can delivery vendors.

> **Daily delivery, month-end sorted.** — Rs 399/mo

This is **not** the app. It is a static, self-contained explainer page whose one
job is to make the product idea instantly clear to (a) a non-technical Indian SMB
owner and (b) an investor skimming for 30 seconds.

## The wedge

A tiffin subscription is one fixed number a month. DoodhBook is the opposite: the
delivered quantity changes every single day and customers skip days. That daily
variation is exactly what makes month-end tallying error-prone and disputed. So
DoodhBook keeps a per-customer **daily** ledger (a default quantity + per-day
overrides + skip/holiday days) and auto-sums the monthly bill as
`sum(qty × rate)` per product.

## Files

| File          | What it is                                                        |
| ------------- | ----------------------------------------------------------------- |
| `index.html`  | All page markup, in the required section order.                   |
| `styles.css`  | All styling. Palette built around the accent `#0284C7`.           |
| `app.js`      | Sticky nav + the signature: a live daily ledger that fills in row by row and counts the month total up. |
| `favicon.svg` | Inline SVG mark (milk bottle + ledger tally lines).               |

## Run it

No build step, no dependencies, no network calls. Open the file directly:

```
open index.html
```

or serve the folder with any static server:

```
python3 -m http.server 8000
```

## Design notes

- **Palette:** accent sky-blue `#0284C7`, deep near-black navy ink `#0F1B24`,
  warm dairy-cream paper `#FBF9F4`, pale blue-grey tint `#E3EEF3`, and a muted
  register-red `#B4471F` used sparingly for skip-days and disputes.
- **Signature element:** a ruled *ledger register* — the diary the vendor already
  keeps by hand — rendered as the hero card and echoed in the product preview,
  now with the month total adding itself up.
- Fully self-contained: all CSS inline in `styles.css`, all imagery is inline
  SVG, no CDNs, no external fonts. Deploys to any static host unchanged.
- Accessible: keyboard focus rings, `prefers-reduced-motion` respected, no
  horizontal scroll on mobile (wide app preview scrolls inside its container).

---

A **KARYA** studio build · sreeni.nintendo@gmail.com
