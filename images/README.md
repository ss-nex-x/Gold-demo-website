# Photos needed for the website

The site is built and working, but every photo slot is currently an empty gold panel.
Send these photos and the site is finished. **A phone camera is fine** — daylight and a
steady hand matter far more than an expensive camera.

Save each file with the **exact filename** in this table, put it in this `images/` folder,
and the slot picks it up.

| Filename | What to photograph | Shape |
| --- | --- | --- |
| `hero-item.jpg` | One gold item (a ring, a chain, a bangle) close up on a plain dark cloth. This is the first thing visitors see. | Landscape, 4:3 |
| `machine.jpg` | Your testing machine — the whole unit, switched on, shot straight on. | Landscape, 16:10 |
| `service-gold.jpg` | A small group of gold jewellery — rings, chains, bangles together. | Landscape, 3:2 |
| `service-coins.jpg` | Gold coins and bars together. | Landscape, 3:2 |
| `service-silver.jpg` | Silver items — jewellery or articles. | Landscape, 3:2 |
| `service-result.jpg` | A result being shown or explained to a customer, or the reading on the machine's screen. | Landscape, 3:2 |
| `shopfront.jpg` | Your entrance from outside, with the board readable. | Landscape, 16:10 |

## How to take them

- **Daylight is best.** Near a window or door, not under a single yellow bulb.
- **Plain background.** A dark cloth for jewellery; nothing cluttered behind the machine.
- **Fill the frame.** Get close. Don't shoot the item from across the room.
- **Hold still**, tap the screen to focus on the item, then take the photo.
- **Landscape (sideways)**, not portrait — the slots are wide.
- **Big files are good.** At least 1600 pixels on the long side. Don't shrink them or send
  them through a compressor; they will be optimised here.

## Please don't include

- Customers' faces, or their items, without asking them first.
- Any document showing a customer's name, phone number or address.
- Photos taken from Google or another jeweller's website — the whole point is that these
  are really your centre.

## Adding a photo

Each slot in `index.html` has a comment above it showing exactly what to paste, for example:

```html
<!--
  PHOTO SLOT — hero. Replace this comment with your own photo:
  <img src="./images/hero-item.jpg" alt="A gold ring being tested at the centre"
       width="1200" height="900" decoding="async">
-->
<figure class="shot shot--item"></figure>
```

Put the `<img>` tag **inside** the `<figure>`, keep the `width` and `height` matching the
photo's real pixel size, and write an `alt` description of what is in the picture. The gold
panel disappears automatically once a photo is there.

## The four existing files

`aeterna-pave-band.jpg`, `eclipse-solaire-collar.jpg`, `solitaire-imperial-ring.jpg` and
`sovereign-fluted-cuff.jpg` are jewellery product shots left over from the previous website.
They are **not used** anywhere on this site — they show jewellery, not your testing centre.
