import { Chapter, Occasion, FittingStage, LoupePlate, RailItem, DiaryEntry } from './types';

export const CHAPTERS: Chapter[] = [
  { id: 'meaning', label: 'The Name' },
  { id: 'blue-room', label: 'The Blue Room' },
  { id: 'rail', label: 'The Rail' },
  { id: 'the-hand', label: 'The Hand' },
  { id: 'warm-room', label: 'The Warm Room' },
  { id: 'fitting', label: 'The Fitting' },
  { id: 'diaries', label: 'Client Diaries' },
  { id: 'fitting-room', label: 'Be Measured' }
];

export const OCCASIONS: Occasion[] = [
  {
    id: 'haldi',
    name: 'Haldi',
    color: '#c9971f',
    note: 'Yellow, worn in daylight',
    hero: '/images/collection/tharo-haldi-yellow-festive-kurta.png',
    heroAlt: 'THARO marigold yellow festive silk kurta with tonal hand embroidery for Haldi ceremony',
    detail: '/images/collection/tharo-haldi-yellow-kurta-couple-ensemble.png',
    detailAlt: 'THARO bespoke yellow kurta wedding couple celebration ensemble',
    support: '/images/collection/tharo-rose-pink-silk-kurta-churidar.png',
    supportAlt: 'THARO rose pink silk kurta with embroidered chest panel and tailored churidar'
  },
  {
    id: 'sangeet',
    name: 'Sangeet',
    color: '#b3707a',
    note: 'Rose and blush, thread-painted',
    hero: '/images/collection/tharo-rose-pink-silk-kurta-churidar.png',
    heroAlt: 'THARO rose pink silk kurta with artisanal thread-painted floral embroidery for Sangeet',
    detail: '/images/craft/tharo-rose-silk-floral-resham-macro.png',
    detailAlt: 'Macro closeup of THARO handcrafted floral resham needlework on pure rose silk sleeve',
    support: '/images/collection/tharo-grey-raw-silk-floral-embroidered-kurta.png',
    supportAlt: 'THARO charcoal grey raw silk kurta with silver floral embroidery'
  },
  {
    id: 'wedding',
    name: 'Wedding',
    color: '#d8c9a3',
    note: 'Ivory and metallic thread',
    hero: '/images/collection/tharo-ivory-sherwani-safaa-groom-turban.png',
    heroAlt: 'THARO regal groom wearing ivory silk wedding sherwani and safaa turban with emerald mala',
    detail: '/images/craft/tharo-ivory-zari-needlework-macro.png',
    detailAlt: 'Macro detail of THARO heritage zardozi metallic gold and silver needlework on ivory silk',
    support: '/images/collection/tharo-ivory-regal-wedding-sherwani.png',
    supportAlt: 'THARO bespoke ivory royal wedding sherwani with tonal architectural embroidery'
  },
  {
    id: 'reception',
    name: 'Reception',
    color: '#9aa892',
    note: 'Sage and powder blue',
    hero: '/images/collection/tharo-sage-green-tailored-bandi-jacket.png',
    heroAlt: 'THARO sage green tailored Nehru bandi jacket over matching silk kurta set',
    detail: '/images/collection/tharo-powder-blue-hand-tailored-bandi-jacket.png',
    detailAlt: 'THARO powder blue hand-tailored bandi over an ivory kurta with fine silver accents',
    support: '/images/collection/tharo-grey-raw-silk-floral-embroidered-kurta.png',
    supportAlt: 'THARO grey raw silk kurta with silver floral threadwork across the chest'
  }
];

export const FITTING_STAGES: FittingStage[] = [
  {
    n: '01',
    name: 'Consultation',
    piece: 'Collar stand',
    note: 'The calendar first: which events, in which order, and who else is being dressed. Nothing is cut.',
    cut: 'M30 206C78 152 128 130 170 130C212 130 262 152 310 206L306 248C266 210 212 192 170 192C128 192 74 210 34 248Z',
    seam: 'M18 210C72 142 122 116 170 116C218 116 268 142 322 210L316 262C270 220 216 200 170 200C124 200 70 220 24 262Z',
    stitch: 'M44 210C84 164 132 144 170 144C208 144 256 164 296 210M40 232C82 194 130 176 170 176C210 176 258 194 300 232',
    mark: 'M170 128V194M110 178V208M230 178V208M286 216h16a5 5 0 0 1 0 10h-16a5 5 0 0 1 0-10ZM34 286h272M34 278v16M306 278v16M170 208V262M164 214l6-8 6 8M164 256l6 8 6-8'
  },
  {
    n: '02',
    name: 'Fabric',
    piece: 'Cuff',
    note: 'Cloth is chosen against the room it will be worn in, and against the light of the event, not a swatch book.',
    cut: 'M52 116H288A16 16 0 0 1 304 132V244A16 16 0 0 1 288 260H52A16 16 0 0 1 36 244V132A16 16 0 0 1 52 116Z',
    seam: 'M44 102H296A22 22 0 0 1 318 124V252A22 22 0 0 1 296 274H44A22 22 0 0 1 22 252V124A22 22 0 0 1 44 102Z',
    stitch: 'M54 130H286A8 8 0 0 1 294 138V238A8 8 0 0 1 286 246H54A8 8 0 0 1 46 238V138A8 8 0 0 1 54 130ZM104 116V260',
    mark: 'M64 166h26a5 5 0 0 1 0 10H64a5 5 0 0 1 0-10ZM64 200h26a5 5 0 0 1 0 10H64a5 5 0 0 1 0-10ZM258 165a6 6 0 1 0 12 0a6 6 0 1 0-12 0M258 205a6 6 0 1 0 12 0a6 6 0 1 0-12 0M188 140V236M182 146l6-8 6 8M182 230l6 8 6-8M36 288h268M36 282v12M304 282v12'
  },
  {
    n: '03',
    name: 'Measure',
    piece: 'Sleeve',
    note: 'A full set of measurements is taken and kept on file. Posture is recorded, not only size.',
    cut: 'M170 34C126 38 98 68 80 110C66 142 58 170 52 198L74 296C110 312 230 312 266 296L288 198C282 170 274 142 260 110C242 68 214 38 170 34Z',
    seam: 'M170 20C118 25 86 58 66 104C51 138 44 168 38 198L62 308C104 328 236 328 278 308L302 198C296 168 289 138 274 104C254 58 222 25 170 20Z',
    stitch: 'M78 286C112 300 228 300 262 286M170 46C134 50 110 76 94 114M170 46C206 50 230 76 246 114',
    mark: 'M52 198H288M84 100L98 112M240 100L254 112M234 114L248 126M170 140V266M164 146l6-8 6 8M164 260l6 8 6-8'
  },
  {
    n: '04',
    name: 'First fit',
    piece: 'Back yoke',
    note: 'The garment comes back inside-out and pinned. This is where it is wrong on purpose, so it can be made right.',
    cut: 'M34 122C110 88 230 88 306 122L298 208C232 182 108 182 42 208Z',
    seam: 'M22 110C104 70 236 70 318 110L310 222C238 194 102 194 30 222Z',
    stitch: 'M46 132C116 106 224 106 294 132M50 192C116 172 224 172 290 192',
    mark: 'M156 98V202M184 98V202M96 106V128M244 106V128M170 96V204M170 240V300M164 246l6-8 6 8M164 294l6 8 6-8M60 262h40M240 262h40'
  },
  {
    n: '05',
    name: 'Final',
    piece: 'Assembled',
    note: 'Final fitting, then pressed and bagged. If the fit has not landed, it goes back.',
    cut: 'M112 60L150 44C160 72 180 72 190 44L228 60L286 88L272 150L252 142L258 318C214 334 126 334 82 318L88 142L68 150L54 88Z',
    seam: 'M110 46L152 28C162 60 178 60 188 28L230 46L300 80L284 158L264 150L270 332C218 350 122 350 70 332L76 150L56 158L40 80Z',
    stitch: 'M118 68L150 54M190 54L222 68M258 318C214 332 126 332 82 318M170 264V326',
    mark: 'M150 46L128 132L154 150L158 212M190 46L212 132L186 150L182 212M150 46L170 64L190 46M162 216a7 7 0 1 0 14 0a7 7 0 1 0-14 0M162 256a7 7 0 1 0 14 0a7 7 0 1 0-14 0M96 238H148V254H96ZM192 238H244V254H192ZM106 168H136V178H106Z'
  }
];

export const LOUPE_PLATES: LoupePlate[] = [
  {
    n: '01',
    name: 'Cornelli',
    src: '/images/craft/tharo-cornelli-chain-stitch-embroidery-macro.png',
    alt: 'Macro closeup of THARO silver soutache cornelli embroidery coiling across black tailored jacket shoulder',
    note: 'Silver soutache laid as one continuous line, turned back on itself until the shoulder reads as topography.'
  },
  {
    n: '02',
    name: 'Bead scatter',
    src: '/images/craft/tharo-handcrafted-glass-beadwork-macro.png',
    alt: 'Macro detail of THARO bugle glass beads scattered across midnight navy lapel like a constellation',
    note: 'Bugle beads set individually across the lapel. Density falls away as it climbs — nothing is repeated.'
  },
  {
    n: '03',
    name: 'Zardozi',
    src: '/images/craft/tharo-ivory-zari-needlework-macro.png',
    alt: 'Macro detail of THARO metallic gold zardozi threadwork forming an avian motif on pure ivory silk',
    note: 'Metallic thread on ivory, worked for the wedding sequence. The heaviest hand in the house.'
  },
  {
    n: '04',
    name: 'Thread-painted floral',
    src: '/images/craft/tharo-rose-silk-floral-resham-macro.png',
    alt: 'Macro detail of THARO artisanal thread-painted resham floral embroidery on rose silk sleeve',
    note: 'Floral painting in thread. Colour is built in passes, the way a brush would build it.'
  }
];

export const RAIL_ITEMS: RailItem[] = [
  { src: '/images/editorial/tharo-bespoke-brass-rail-curated-shirting.png', alt: 'THARO bespoke brass rail with hand-tailored shirts and bespoke hangers at 31 Allenby Road Kolkata atelier', label: 'On the rail' },
  { src: '/images/collection/tharo-white-poplin-shirt-blue-thread-motif.png', alt: 'THARO bespoke white cotton poplin shirt with hand-embroidered blue thread motif', label: 'Blue thread motif' },
  { src: '/images/collection/tharo-white-shirt-grey-cornelli-embroidery.png', alt: 'THARO tailored white shirt featuring subtle grey cornelli needlework across the yoke', label: 'Grey cornelli' },
  { src: '/images/collection/tharo-white-shirt-blue-floral-shoulder-panel.png', alt: 'THARO white shirt with intricate royal blue floral resham threadwork panel', label: 'Floral panel' },
  { src: '/images/collection/tharo-blush-pink-formal-shirting-hanger.png', alt: 'THARO blush pink custom shirting on bespoke wooden hanger', label: 'Blush shirting' },
  { src: '/images/collection/tharo-blush-shirt-oxblood-sash-trousers.png', alt: 'THARO blush formal shirt with structured oxblood sash and tailored trousers', label: 'Sash detail' },
  { src: '/images/collection/tharo-black-kurta-silver-zari-threadwork.png', alt: 'THARO midnight black festive kurta shirt with silver zari contour embroidery', label: 'Silver on black' },
  { src: '/images/collection/tharo-maroon-shirt-tonal-beadwork.png', alt: 'THARO deep maroon evening shirt with delicate tonal hand-beadwork', label: 'Maroon, beaded' },
  { src: '/images/editorial/tharo-31-allenby-road-calcutta-atelier-store.png', alt: 'THARO luxury menswear atelier interior at 31 Allenby Road, Kolkata', label: '31 Allenby Road' },
  { src: '/images/editorial/tharo-signature-bespoke-packaging-bag.png', alt: 'THARO bespoke atelier garment packaging bag with gold-embossed monogram', label: 'Wrapped' }
];

export const CLIENT_DIARIES: DiaryEntry[] = [
  {
    src: '/images/diaries/tharo-client-diary-groom-palace-arch.png',
    occasion: 'Wedding',
    note: 'Ivory sherwani and turban, worn under the floral arch.',
    alt: 'THARO bespoke groom client wearing ivory silk sherwani and safaa turban beneath palace floral wedding arch'
  },
  {
    src: '/images/diaries/tharo-client-diary-wedding-reception-couple.png',
    occasion: 'Reception',
    note: 'Orange kurta, cut to sit beside her lehenga.',
    alt: 'Client wedding couple at reception, groom dressed in bespoke THARO festive kurta ensemble'
  },
  {
    src: '/images/diaries/tharo-client-diary-celebration-family-heirloom.png',
    occasion: 'First outing',
    note: 'Blue floral bandi, worn holding his son.',
    alt: 'Client in a bespoke powder blue floral THARO bandi jacket celebrating with his family'
  },
  {
    src: '/images/diaries/tharo-client-diary-sage-bandi-ceremony.png',
    occasion: 'Sangeet',
    note: 'Sage bandi over a matching kurta set.',
    alt: 'Client dressed in custom sage green THARO Nehru bandi jacket and silk kurta set'
  },
  {
    src: '/images/diaries/tharo-client-diary-heritage-doorway-portrait.png',
    occasion: 'Wedding',
    note: 'Red and ivory kurta set, photographed at home.',
    alt: 'Client in a bespoke red and ivory THARO wedding kurta set in heritage Kolkata architecture'
  }
];

export const OCCASION_OPTIONS = [
  'Wedding',
  'Sangeet',
  'Haldi',
  'Reception',
  'Formal / dinner jacket',
  'Shirting'
];
