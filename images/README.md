# Photos

## How photos work here

```
images/source/   full-size originals (drop phone photos here)
images/          web-sized .webp + .jpg the page actually loads
```

Put a full-size photo in `images/source/`, make sure it is listed in
`scripts/optimise-images.mjs`, then run:

```bash
npm run images
```

That resizes and compresses it into `images/`. A 630 kB phone photo comes out around
70 kB, which is what keeps the page fast. **Never point the page at a file in
`images/source/` directly** — those are the heavy originals.

## What is filled in now

| Slot | Photo | Status |
| --- | --- | --- |
| Hero | `hero-item` — gold ring on dark cloth | filled (from `solitaire-imperial-ring.jpg`) |
| Services — Gold jewellery | `service-gold` — gold cuff | filled (from `sovereign-fluted-cuff.jpg`) |

These two came with the project. They are jewellery product shots, not photos of your
centre — good enough to make the page look right, worth replacing when you can.

## What is still needed

Three service cards — Coins & bars, Silver items, and Purity & composition — carry
**drawn illustrations** on a dark backdrop, matching the photographed card beside them.
They are artwork, not photographs, so they never pretend to be your actual coins, your
actual silver or your actual machine reading. They look finished, and a real photo is
still better. The machine and shop front slots remain plain panels.

They are deliberately **not** filled with the leftover jewellery pictures, because a
jewellery photo would be misleading in each case:

| Filename to save as | What to photograph | Shape |
| --- | --- | --- |
| `machine.jpg` | Your testing machine — whole unit, switched on, shot straight on. **Most important one.** | 16:10 |
| `service-coins.jpg` | Gold coins and bars together. *(illustration in place)* | 3:2 |
| `service-silver.jpg` | Silver items — jewellery or articles. *(illustration in place)* | 3:2 |
| `service-result.jpg` | A result being explained, or the reading on the machine's screen. *(illustration in place)* | 3:2 |
| `shopfront.jpg` | Your entrance from outside, with the board readable. | 16:10 |

To replace an illustration with a photo, delete the `<svg class="shot-art">` block from
that card's `<figure>` and put the `<picture>` block there instead.

To add one: save it into `images/source/`, add a line for it in
`scripts/optimise-images.mjs` (copy an existing line), run `npm run images`, then in
`index.html` find that slot's `PHOTO SLOT` comment and copy the `<picture>` block the
hero already uses.

## How to take them

- **Daylight is best.** Near a window or door, not under a single yellow bulb.
- **Plain background.** Nothing cluttered behind the machine.
- **Fill the frame.** Get close; don't shoot from across the room.
- **Hold the phone sideways** (landscape) — the slots are wide.
- **Don't shrink them.** Send the biggest version your phone made; `npm run images`
  does the shrinking properly.

## Please don't include

- Customers' faces, or their items, without asking them first.
- Any document showing a customer's name, phone number or address.
- Photos taken from Google or another jeweller's website.

## Unused originals

`aeterna-pave-band.jpg` and `eclipse-solaire-collar.jpg` sit in `images/source/` unused.
They are left over from the previous website.
