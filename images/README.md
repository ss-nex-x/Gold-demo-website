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

| Slot | Photo shown | Subject matches the card? |
| --- | --- | --- |
| Hero | gold ring on dark cloth | yes |
| Gold jewellery | gold cuff | yes |
| Coins & bars | gold band | **no — it is a ring, not coins or bars** |
| Silver items | diamond-set gold collar | **no — it is gold jewellery, not silver** |
| Purity & composition | gold bangle | loosely — an item, not a reading |

Every photo in this project is gold jewellery: the four product shots that came with the
old website, plus `showcase-bangle.jpg`, a still taken from the 300-frame jewellery clip in
`ezgif-27fd5a89d62bf8c0-png-split/`. There are no photographs of coins, bars, silver
articles, testing equipment or the premises anywhere in the repository.

The bottom three cards therefore show jewellery under headings about coins, silver and
readings. That was a deliberate choice to make the row look complete. **Replacing them with
photographs of the real subjects is the single biggest improvement left on this page** — a
visitor who reads "gold coins, biscuits and bars" and sees a diamond ring notices.

## What is still needed

The machine and shop front slots still show plain gold panels. Send these photos to
replace the stand-ins above and fill the two remaining slots:

| Filename to save as | What to photograph | Shape |
| --- | --- | --- |
| `machine.jpg` | Your testing machine — whole unit, switched on, shot straight on. **Most important one.** Already wired: drop the file in and run `npm run images`. | 16:10 |
| `service-coins.jpg` | Gold coins and bars together. *(currently a ring)* | 3:2 |
| `service-silver.jpg` | Silver items — jewellery or articles. *(currently gold jewellery)* | 3:2 |
| `service-result.jpg` | A result being explained, or the reading on the machine's screen. *(currently a bangle)* | 3:2 |
| `shopfront.jpg` | Your entrance from outside, with the board readable. | 16:10 |

Replacing a stand-in is easy: save your photo into `images/source/` under the same name
listed in `scripts/optimise-images.mjs`, run `npm run images`, and the card updates. No HTML
change needed.

The machine slot is already listed in `scripts/optimise-images.mjs` and its card carries a
zoom-in effect, so `machine.jpg` needs no code changes — just the file.

To fill the shop front slot: save it into `images/source/`, add a line for it in
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

## Originals

All five files in `images/source/` are now in use. Four came with the previous website;
`showcase-bangle.jpg` was extracted from the old site's frame sequence.
