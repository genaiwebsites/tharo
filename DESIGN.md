# THARO — Landing Page Build Brief
### Handover document for Claude Design
**Client:** Tharo — Designed For You · Bespoke menswear · 31 Allenby Road, Bhawanipore, Kolkata 700020
**Deliverable:** Single-page immersive landing site. Desktop-first, fully responsive.
**Conversion goal:** A booked fitting appointment via WhatsApp (`wa.me/919062512323`) or store visit. There is no e-commerce. Do not build a cart, a shop grid, or product detail pages.

---

## 0. Read this first — the non-negotiables

1. **Do not produce the AI-default look.** No warm cream `#F4F1EA` background with terracotta accent. No near-black with acid-green. No broadsheet hairline-rule layout. No glassmorphism, no purple/teal gradients, no floating 3D blobs, no particle sparkles, no cursor trails, no infinite "LUXURY • LUXURY •" marquees.
2. **Do not use Cormorant, Playfair Display, or Italiana.** These are the three most common tells of a generated luxury site.
3. **Do not build 3D cloth or 3D garments.** Real-time cloth simulation with embroidery lands in the uncanny valley and permanently destroys the luxury read. Garments are always photographic.
4. **Never dither, blur, or stylise the embroidery.** The embroidery *is* the product. Effects go on backgrounds and transitions, never on the surface work.
5. **One easing family across the whole site.** Inconsistent easing is what makes a site feel assembled from tutorials.
6. **Nothing loops forever.** Ambient infinite animation reads as template. Motion resolves and rests.

---

## 1. The brand — what you are designing for

Tharo is a Marwari-founded bespoke menswear house in Bhowanipore, Kolkata. Instagram `@tharo_designedforyou`, 126 posts, ~3,700 followers, no website currently.

**The name is the entire concept.** The bio opens *"Khammagani from Tharo"* — *Khamma Ghani* is the Rajasthani greeting, and **`tharo` means "yours" in Marwari.** So the brand name literally reads: **Tharo → Yours → Designed for you.** This is the spine of the site. Right now it is buried in a bio line. Surface it.

> **Positioning line to design against:**
> *Rajasthani hand-work. Calcutta tailoring. Cut for one person.*

**What they actually sell:** The silhouettes are conventional — tuxedos, bandhgalas, sherwanis, kurtas, bandis, shirting. The differentiator is **surface embroidery**: silver cornelli/soutache squiggles across a shoulder, marbled thread topography down a sleeve, bugle-bead scatter on a lapel, thread-painted florals on pastel kurtas. Design the site so the embroidery is the hero, not the tailoring.

**Their own voice — use it, it's good.** Pull copy tone from their real captions. Do not write new marketing language that sounds like anyone else:
- "Just unforgettable, not loud."
- "The art of dressing without excess."
- "Clean lines, composed presence."
- "Comfort stitched into every panel."
- "Tharo tailoring — designed for legacy, worn with grace."
- "Every great outfit starts with a great shirt."

**Banned copy:** "Elevate your style." "Where tradition meets modernity." "Redefining menswear." "Crafted with passion." Anything with an em-dash-heavy aspirational cadence.

**Audience:** Two segments. (a) Kolkata/Marwari wedding buyers — grooms and groom's families, planning 3–6 months out, buying for a five-event wedding sequence. (b) Younger professionals buying occasion shirting and dinner jackets. Segment (a) is the revenue.

**A real business constraint that must shape the design:** Their Google reviews (4.0, only 9 reviews) split hard, and the criticism is specifically about *made-to-measure fit not landing after multiple visits*. A site that dazzles and then sets no expectations makes this worse. The Fitting section (§4.6) is therefore mandatory, not optional — it does customer-experience work disguised as motion design.

---

## 2. The concept — three devices

### Device A — The Thread
One continuous silver embroidery stitch, drawn from Tharo's own cornelli motif (trace it from the supplied images — do not invent a generic squiggle), runs unbroken through the entire page as an SVG path.

It enters in the hero, becomes the scroll-progress indicator down the left edge, forms every section divider, loops through the "O" of the wordmark, underlines every CTA on hover, and at the very bottom resolves into a signature line on the booking card. **The whole page is one unbroken stitch — which is what a garment is.** Animate with `stroke-dasharray` / `stroke-dashoffset` driven by scroll progress.

### Device B — The Two Rooms
Do not build "sections." Build a **continuous camera move through a space.** Scroll is a dolly, not a jump cut. Tharo shoots in two real, distinct worlds and doesn't realise it's a system:

- **The Blue Room** — deep navy wainscot panelling, plaster plinths, cool hard light. Tuxedos, bandhgalas, oxblood dinner jackets, black shirting. This is their strongest work.
- **The Warm Room** — limewash walls, arched niches, curtains, terracotta light. Sherwani, kurta, bandi. Wedding and festive.

**Journey:** Threshold → Blue Room → The Rail → Warm Room → The Hand → The Fitting → Client Diaries → The Fitting Room (booking).

**The continuity trick that matters most:** a single global light-temperature value, driven by scroll progress, interpolates continuously from cool (~6000K, navy) at the top to warm (~2700K, ivory) at the wedding chapter. It drives background colour, shadow hue, image grading overlay, and any canvas lighting — all from one variable. This is the difference between "a film" and "a template with sections."

### Device C — The site measures you
The name means *yours*, so the site behaves like a fitting. Quiet and ambient, never a gimmick quiz:
- Pointer velocity subtly affects how the hero fabric catches light.
- Visitor's local time nudges the room's ambient warmth.
- The store's **live open/closed status** renders in the header and footer (Mon–Sat 11:30–19:30 IST; Sunday by appointment only).
- The closing CTA personalises to the visitor's city if available, falling back gracefully.

---

## 3. Tech stack

### Core
| Layer | Choice | Why |
|---|---|---|
| Markup | Semantic HTML5, single page | SEO — they are currently invisible in search |
| Styling | Vanilla CSS with custom properties. **No Tailwind.** | Tailwind's utility defaults push toward the generic look. Custom properties also let the global light-temperature variable drive everything from one place. |
| Animation | **GSAP 3 + ScrollTrigger** (CDN) | Scroll choreography, pinning, timelines |
| SVG path animation | **GSAP DrawSVG** technique via `stroke-dashoffset` | The Thread, pattern-piece drawing |
| Smooth scroll | **Lenis** (CDN), `lerp: 0.075–0.09`, no rubber-band | Luxury motion has mass |
| Canvas / shader work | **OGL** (~10kb) — *not* three.js (~150kb) | Only shader planes are needed. Bundle size matters enormously on Indian 4G. |
| Split text | Manual char/word wrapping in JS | Avoid paid plugins |
| Images | AVIF with WebP fallback, responsive `srcset`, `loading="lazy"` below fold | |

### Explicitly do not use
Tailwind · three.js · Spline · Lottie for anything decorative · React/Next for this build (single static page; keep it dependency-light) · any paid GSAP plugin.

### Performance budget — hard targets
- Hero LCP **under 2.5s** on throttled 4G, mid-tier Android. Most traffic will arrive from Instagram on mid-range Android phones — the client's own screenshots are from a Xiaomi.
- Total JS under 150kb gzipped.
- Lazy-load the canvas/OGL bundle behind the fold; hero must render from HTML+CSS+image alone.
- 60fps scroll on desktop; if it drops, cut the effect, not the frame rate.

### Degradation ladder (build all three paths)
1. **Full:** WebGL available, `prefers-reduced-motion: no-preference`, device not low-power → everything.
2. **Reduced motion:** All GSAP timelines set to `duration: 0` progress-complete states. Content fully readable and navigable. The Thread renders statically drawn. No parallax.
3. **No WebGL / low-end:** Hero canvas replaced by a graded still with CSS-only parallax that still looks intentional. Loupe becomes tap-to-zoom.

**Mobile is a different film, not a broken one.** Kill scroll-hijacking entirely on touch. Keep native scroll momentum. Sections become vertical stacked reveals with staggered fades. Keep the Embroidery Loupe as tap-to-zoom — it is the highest-value interaction and must survive.

---

## 4. Section-by-section build spec

### 4.1 Threshold (Hero)
**Layout:** Full-viewport. Wordmark THARO centred, generously tracked. Beneath it, small caps: DESIGNED FOR YOU. Below that, one line in Devanagari or Latin: *Khamma Ghani.* Bottom-left: live store status. Bottom-right: scroll cue as the first stitch of The Thread.

**Canvas effect:** A single OGL fullscreen plane displaying a fabric texture, displaced subtly and lit with an **anisotropic specular highlight** that follows the pointer. Anisotropic (directional, streaked) specular is the actual optical signature of silk — standard Blinn-Phong is why most "luxury" hero shaders read as plastic. The highlight sweep reveals the wordmark.

**Critical:** Do **not** use procedural Perlin-noise "silk." It is the number-one tell of a generated site. Use a real fabric photograph as the texture and normal map source (see §5 for placeholder guidance).

**Motion:** Single 1400ms entrance on load, `expo.out`. Wordmark letters stagger in at 50ms. No bounce, no elastic.

---

### 4.2 The Rail
Horizontal-drag corridor of garments on brass rails. Source directly from the supplied store-interior frames (Image 5, middle-left tile: garments on brass rails with THARO-branded hangers; and Image 5, bottom-left: the lit store interior).

**Interaction:** Drag or scroll moves the rail horizontally. Scroll velocity applies a slight **skew transform + directional blur**, settling to zero when motion stops. This is a velocity-driven inertia effect — GSAP `quickTo` on skewX is the clean way.

**This is the one place dithering earns its keep.** See §6.

---

### 4.3 The Hand — Embroidery Loupe *(highest-value section — build this even if you build nothing else)*
Because the surface work is the intellectual property, this is the most valuable interaction on the site.

**Interaction:** Hovering a garment swaps the cursor into a circular **magnifier loupe** revealing a true macro crop underneath — thread twist, bead facet, the sheen shift where the cornelli turns. Implement as a masked second image layer at higher resolution, positioned inversely to cursor movement.

**Content:** Four signature techniques, each with a large macro plate and one line of provenance:
1. **Cornelli** — the silver soutache topography (Image 1, tiles 7 and 12)
2. **Bead scatter** — the bugle-bead lapel constellation (Image 1, tile 2 and bottom-centre)
3. **Zardozi** — the metallic wedding work (Image 4)
4. **Thread-painted floral** — the pastel kurta chest work (Image 6, top row)

**Why it matters commercially:** Nobody in Indian menswear is doing this online. It directly answers *"why does this cost what it costs"* before the customer has to ask.

---

### 4.4 Warm Room — the Wedding chapter
Arch-framed compositions, echoing the real arched niches in their festive shoots (Image 2, top row).

**Transition technique:** Do not use wipes or standard crossfades. Use a **flow-map dissolve masked by Tharo's own embroidery motif** — one look dissolves into the next *through the shape of their signature stitch*. This is ownable because the mask is their artwork, not a stock effect.

**Occasion selector:** Let the visitor pick — Haldi / Sangeet / Wedding / Reception. Selecting shifts the room's palette and light temperature. This maps to how the buyer actually thinks: they are not shopping garments, they are shopping five events.

Palette per occasion, drawn from their real work: Haldi = marigold yellow; Sangeet = blush/rose; Wedding = ivory + gold; Reception = sage or powder blue.

---

### 4.5 The Fitting *(mandatory — do not cut)*
Pinned horizontal sequence, five stages: **Consultation → Fabric → Measure → First Fit → Final.**

**Technique:** SVG pattern pieces draw themselves in stroke-by-stroke as the user scrolls (`stroke-dashoffset` driven by ScrollTrigger), then assemble into a shirt. Cheap to run, fast, and reads unmistakably as craft.

**Include real numbers** — get these from the client, placeholder until then: *how many measurements taken, how many fittings scheduled, how many days from consult to delivery.*

**Why:** A visitor who arrives at the store already knowing it takes three fittings does not leave a two-star review about the second one. This section is expectation-setting disguised as motion design.

---

### 4.6 Client Diaries
Their real customers, from the "Client Edit" highlight (Image 3, bottom two rows): a groom under a floral arch, a couple at a wedding, a man holding his newborn in a Tharo bandi, a haldi in yellow.

**For the wedding buyer this converts harder than any model shot** — they are buying a memory, not a jacket.

**Critical treatment note:** These are phone-grade photos of inconsistent quality. **Unify them with a single grade** — one LUT-equivalent CSS filter stack, consistent crop ratio, subtle film grain overlay. This makes quality inconsistency disappear.

**Motion:** Slow horizontal marquee with velocity skew. Hover freezes the marquee and expands the card with the couple's name and occasion. On mobile: swipeable, no auto-scroll.

---

### 4.7 The Fitting Room (close)
**Not a contact form. An invitation.**

Three inputs — Occasion, Date, City — rendering live into a **letterpressed appointment card**. The Thread signs off at the bottom of the card as a signature.

Primary action hands off to WhatsApp via `wa.me/919062512323` with a pre-filled message assembled from the three inputs. Secondary: the address, live store status, and a link to the map location.

> Store hours: Mon–Sat 11:30 AM – 7:30 PM · Sunday by appointment only
> 31 Allenby Road, Bhawanipore, Kolkata 700020

---

## 5. Images — what to use and how

### Supplied assets
Six Instagram grid screenshots are provided. **These are grid screenshots, not individual images** — each must be cropped into its component tiles before use. Crop generously, keep the garment and the embroidery, discard the Instagram UI chrome (status bar, nav, play badges, carousel icons).

**Best usable tiles by source image:**
- **Image 1 (Blue Room formal):** navy sequin tuxedo, black shirt with silver cornelli shoulder, oxblood dinner jacket, bead-scatter macro. → Hero, Blue Room, Loupe.
- **Image 2 (Warm Room ethnic + casual shirting):** ivory sherwani with turban, cream sherwani, light-wash denim + white shirt, black shirting trio, white shirts with blue thread motif. → Warm Room, Rail.
- **Image 3 (Product + Client Edit):** blush shirt on branded hanger, THARO shopping bag, white shirt with grey cornelli, and the six client photos. → Product moments, Client Diaries.
- **Image 4 (Festive kurta/bandi):** rose kurta with floral sleeve, haldi-yellow kurta pair, sage bandi set, black and maroon shirts on hangers. → Warm Room, Occasion selector.
- **Image 5 (Blue Room + store interior):** brass rail with branded hangers, lit store interior, navy shirting, the formal pairs. → The Rail, Threshold.
- **Image 6 (Profile + new work):** grey kurta with silver floral, powder-blue bandi. Also the source for the **logotype** — wide-tracked serif THARO with the distinctive O, and "DESIGNED FOR YOU" beneath in small caps.

### AI placeholder generation — where and how
Some assets do not exist in the supplied set and must be generated as temporary placeholders. **Generate only these five categories.** Do not AI-generate garments — the real garments are the product and generated ones will not match the embroidery language.

1. **Macro fabric texture for the hero** — extreme close-up of navy silk shantung weave under raking light, no embroidery, no garment. Used as texture + normal map source.
2. **Macro embroidery plates for the Loupe** — extreme close-up of silver soutache/cornelli thread on dark navy fabric, raking light, shallow depth of field, thread twist visible. Generate four variants matching the four techniques in §4.3.
3. **Empty room plates** — deep navy wainscot panelling with plaster plinth, cool light, no person; and limewash wall with arched niche, warm light, no person. Used as scene backdrops behind cropped garment cutouts.
4. **Texture overlays** — paper grain, fine film grain, subtle fabric weave for overlay layers.
5. **Detail props** — brass rail hardware, tailor's chalk, measuring tape, pattern paper. Small, incidental, used sparingly.

**Placeholder discipline:** every AI-generated asset must be tagged in the markup with a `data-placeholder="true"` attribute and listed in a comment block at the top of the file, so the client can swap in real photography without hunting.

### What the client must shoot for the real build
Include this list as a comment in the delivered file. Roughly 70% of the "$50k feel" is asset production, not shader count:
- Macro fabric plate for the hero (one afternoon, macro lens, raking light)
- Four embroidery macro plates at 4000px for the Loupe
- One turntable image sequence (48–72 frames, motorised turntable, Blue Room) per hero garment — this replaces 3D entirely and gives dimensionality with 100% fabric fidelity
- **A re-shoot of the ethnic line to Blue Room standard.** Their festive photography currently drops to prosumer quality — visible curtain seams, houseplants in frame, flat light — and no amount of WebGL hides that at full-bleed scale.

---

## 6. Dithering — precise scope

Dithering reads *techno-brutalist*, and used decoratively it will fight this brand. Use it in exactly **three** places, each with a heritage justification rather than a trend one:

1. **Progressive image reveal** — images resolve from a fine ordered/blue-noise grain into full clarity, evoking rotogravure and offset halftone from print fashion editorials. Justified by print lineage, not by Awwwards.
2. **Blue-noise dither at 1–2% opacity over every large dark gradient.** Banding on big navy fields is the single most common tell of a cheap dark-luxury site. This is invisible to the eye and expensive-feeling in effect.
3. **The loading state.**

**Never dither the garment permanently.** See non-negotiable #4.

---

## 7. Motion system

| Property | Rule |
|---|---|
| Easing | One family site-wide. Long-tail cubic-bezier, e.g. `cubic-bezier(0.16, 1, 0.3, 1)`. Never `elastic`, never `back`, never `bounce`. |
| Micro-interactions | 200–300ms |
| Section transitions | 700–900ms |
| Cinematic moments | 1200–1600ms |
| In-between durations | Do not use. Nothing arbitrary. |
| Stagger | 40–60ms on every group entrance. Simultaneous entrances read cheap. |
| Scroll smoothing | Lenis `lerp: 0.075–0.09`, no rubber-band. Motion should have mass — start slowly, settle rather than snap. |
| Loops | None infinite. Motion resolves and rests. |

**Cursor:** Contextual, never a decorative blob.
- Default: a tailor's chalk mark
- Over the Loupe: the circular magnifier
- In the Fitting section: a measuring-tape readout
- Over links: the Thread underlines on hover

---

## 8. Typography & Font Pairing System

The website implements a cohesive, high-fashion 3-tier typographic system:

| Role | Font Family | Source & Weights | Usage Context |
|---|---|---|---|
| **Headings & Display** | **`Cormorant Garamond`** (`var(--font-cormorant)`) | Google Fonts (300, 400, 500, 600, 700) | All section titles (h1, h2, h3), editorial display quotes, and occasion cards. Characterized by high optical contrast, razor-sharp delicate serifs, and haute couture editorial rhythm. |
| **Brand Monograph & Badges** | **`Cinzel`** (`var(--font-cinzel)`) | Google Fonts (400, 500, 600, 700) | Brand wordmark **THARO**, Roman chapter milestones, and technical stage badges. |
| **Devanagari Cultural Calligraphy** | **`Noto Sans Devanagari`** (`var(--font-noto-devanagari)`) | Google Fonts (400, 500, 600, 700) | Cultural greetings (*खम्मा घणी*), Marwari etymology (*थारो*), and heritage seals. Styled with custom 3D metallic gold shader sweep. |
| **Body & Editorial Architecture** | **`Inter Tight`** (`var(--font-inter-tight)`) | Google Fonts (300, 400, 500, 600) | Paragraph copy, technical tailoring specs, form inputs, timecode clocks, and UI buttons. |

---

## 9. Colour & Metallic 3D Shaders

Derive everything from real high-fashion editorial photography and bespoke metalwork:

```css
--bg-primary: #0b0f18;      /* Deep midnight navy, Blue Room wainscot */
--bg-panel: #131b29;        /* Cool panel blue */
--bg-warm: #171412;         /* Limewash warm room */
--bg-warm-panel: #28211c;   /* Terracotta niche */
--fg-primary: #f3f5fe;      /* High-contrast off-white */
--fg-muted: #9397ab;        /* Cool slate text */
--fg-dim: #5f6472;          /* Subtle metadata */
--accent-cool: #cfd3e5;     /* Silver cornelli stitch */
--accent-gold: #c5a880;     /* Antique brass & zardozi gold */
--accent-terracotta: #b8624d;/* Rajasthani spice accent */
```

### 3D Metallic Shimmer Shader Architecture
- **`.hero-3d-monograph`**: Flowing multi-stop platinum metallic gradient with `@keyframes metallic-sheen` reflection sweep and dual-stage ambient drop shadows.
- **`.devanagari-3d-metallic`**: Sculpted 3D warm gold gradient with soft specular halo.
- **Atmospheric Behind-Text Aura**: Organic breathing radial backdrop glow highlighting the brand monograph without interfering with photographic backgrounds.

Note the deliberate absence of gold. Every Indian luxury site reaches for gold. Tharo's actual signature thread is **silver**. That restraint is the differentiator.

---

## 10. SEO and technical hygiene

They currently have zero search presence. A beautiful site nobody finds is an expensive PDF.

- Static HTML, server-rendered content — nothing critical behind JS
- `schema.org` structured data: `LocalBusiness` + `ClothingStore` with full address, hours, phone, geo
- Target queries in real page copy: *bespoke sherwani Kolkata*, *made to measure suits Kolkata*, *designer shirts Bhowanipore*, *wedding sherwani Kolkata*
- Open Graph and Twitter card images from their strongest Blue Room frame
- Descriptive `alt` text on every image — garment type, technique, occasion
- Visible keyboard focus states throughout
- Full `prefers-reduced-motion` path

---

## 11. Build order

Ship in this sequence. If time runs out, the earlier items still constitute a coherent site.

1. **Threshold + The Thread + Embroidery Loupe** — this trio alone establishes the tier
2. The Two Rooms camera continuity and light-temperature system
3. The Fitting (pattern-piece drawing)
4. Client Diaries
5. The Rail
6. The Fitting Room booking flow
7. Occasion selector

---

## 12. Definition of done

- [ ] Runs at 60fps on desktop; degrades cleanly on mid-tier Android
- [ ] Hero LCP under 2.5s on throttled 4G
- [ ] Full reduced-motion path — site is complete and readable with zero animation
- [ ] Fully keyboard navigable with visible focus
- [ ] Every AI placeholder tagged `data-placeholder="true"` and listed in a header comment
- [ ] WhatsApp handoff pre-fills correctly from the three booking inputs
- [ ] Live store status reflects real IST hours
- [ ] Zero items from the §0 banned list present anywhere
- [ ] No copy that Tharo hasn't written better themselves

---

*One last note for whoever builds this: spend the boldness in one place. The Embroidery Loupe is the signature. Keep everything around it quiet and disciplined. Chanel's rule applies — before you ship, look at it once more and remove one thing.*
