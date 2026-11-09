// @ts-nocheck
/*
 * The games board's live previews (Sani 2026-11-06: "live svg animated running, not an image — a dumbed down
 * performance version of the game movements, for all 19"). Each preview is ONE 320×200 SVG string: the game's own
 * drawn scene, and two to four of its own pieces (riders, fish, the lorry, the cows…) moving by CSS transform and
 * opacity only (preview.css), with no answers in them and no sound.
 *
 * API, kept small for the language demos:
 *   previewSvg(gid)          the preview for a game id (the ids of GAME_LIST), or null
 *   setPreviewSkin(source)   a language's own previews, (gid) => svg | null; whatever it does not draw falls back
 *                            to the Hausa one here. kratu-langs registers SKIN.scene this way:
 *                            setPreviewSkin((gid) => SKIN && SKIN.scene[gid]).
 * Their strings are 320×200 too, so the two swap without any change to the board.
 */
import { SCENES4 } from '../../features/games/lab/scenes4';
import { durbarRider, maiFanka } from '../../features/games/lab/durbar';
import { argunguScene, argunguWater, fisherman, fish4 } from '../../features/games/lab/kamun';
import { kalanguScene } from '../../features/games/lab/kalangu';
import { teaStall, waiter as teaWaiter, okada } from '../../features/games/lab/teastall';
import { kasuwaScene } from '../../features/games/lab/sc-kasuwa';
import { dillaliScene } from '../../features/games/lab/sc-dillali';
import { gyadaScene, gyLorry } from '../../features/games/lab/sc-gyada';
import { suyaScene, stand } from '../../features/games/lab/sc-suya';
import { alloScene } from '../../features/games/lab/sc-allo';
import { jirgiScene, engineBoat, person, bird, goat, canoe } from '../../features/games/lab/sc-jirgi';
import { kogiScene } from '../../features/games/lab/sc-kogi';
import { ruwaScene, rainSheet, millet } from '../../features/games/lab/sc-ruwa';
import { tukwaneScene, tukPot } from '../../features/games/lab/sc-tukwane';
import { buloScene, buloHouse } from '../../features/games/lab/sc-bulo';
import { wasikaScene, postRider } from '../../features/games/lab/sc-wasika';
import { riniScene, dyeCloth } from '../../features/games/lab/sc-rini';
import { shanuScene } from '../../features/games/lab/sc-shanu';
import { garkeScene, kraalBack, kraalFront, kraalCow } from '../../features/games/lab/sc-garke';

export type PreviewSource = (gid: string) => string | null | undefined;
let skin: PreviewSource | null = null;
/** A language's own previews; null goes back to the Hausa ones. */
export function setPreviewSkin(source: PreviewSource | null): void { skin = source; }
/** The preview for a game: the language's own if it has one, else the Hausa one. Built once per game. */
export function previewSvg(gid: string): string | null { return (skin && skin(gid)) || hausa(gid); }

const BUILT: Record<string, string> = {};
function hausa(gid: string): string | null { const f = HAUSA[gid]; return f ? (BUILT[gid] ??= f()) : null; }

/** A drawing placed in the 320×200 frame at (x, y), w × h, inside a group that moves (cls, preview.css). */
const put = (svg: string, x: number, y: number, w: number, h: number, cls = '') =>
  '<g class="pv ' + cls + '"><svg class="pvbox" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" overflow="visible">' + svg + '</svg></g>';
/** Bare SVG shapes (already in frame units) in a moving group. */
const g = (inner: string, cls: string) => '<g class="pv ' + cls + '">' + inner + '</g>';
const frame = (scene: string, parts: string, id: string) =>
  '<svg class="gpv gpv-' + id + '" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' + put(scene, 0, 0, 320, 200, 'pv-scene') + parts + '</svg>';

/** Fashe's balloons, in its colours, with no letters on them. */
const balloon = (x: number, c: string, d: number) => g('<g transform="translate(' + x + ' 220)"><path d="M0 26 Q-3 34 1 42" stroke="#6B4A2A" stroke-width=".8" fill="none"/><ellipse cx="0" cy="0" rx="14" ry="17" fill="' + c + '"/><path d="M-2 16 L2 16 L0 20 Z" fill="' + c + '"/><ellipse cx="-5" cy="-6" rx="3.4" ry="5" fill="#fff" opacity=".35"/></g>', 'pv-rise pv-d' + d);
/** Kalangu's talking drum (the band in the game is HTML, not SVG): an hourglass drum with its cords, and the beat's rings. */
const drum = '<g transform="translate(160 150)"><ellipse cx="0" cy="26" rx="24" ry="4" fill="rgba(40,20,6,.35)"/>' +
  '<path d="M-20 -22 Q-6 0 -20 22 L20 22 Q6 0 20 -22 Z" fill="#A0632E" stroke="#5B3018" stroke-width="2"/>' +
  '<g stroke="#F4E7C9" stroke-width=".9" opacity=".8"><path d="M-18 -21 L-4 21 M-10 -21 L4 21 M-2 -21 L12 21 M6 -21 L18 18 M14 -21 L-14 21"/></g>' +
  '<ellipse cx="0" cy="-22" rx="20" ry="5" fill="#E8D3A8" stroke="#5B3018" stroke-width="1.6"/><ellipse cx="0" cy="22" rx="20" ry="5" fill="#C9A26B" stroke="#5B3018" stroke-width="1.6"/></g>';
const rings = '<g transform="translate(160 128)" fill="none" stroke="#FFE58A" stroke-width="2.4"><circle class="pv-ring" r="20"/><circle class="pv-ring pv-d2" r="20"/></g>';
const stick = '<g transform="translate(184 112)"><path d="M0 0 Q10 -8 22 -10" stroke="#5B3018" stroke-width="3" stroke-linecap="round" fill="none"/></g>';
const paddler = (x: number, y: number) => canoe(x, y, 70) + person(x - 13, y - 2, 26, { kind: 'man', skin: 1, robe: '#2F6B9A', trou: '#2F6B9A', hat: 'hula', hatc: '#F4EBD0' });

const HAUSA: Record<string, () => string> = {
  // the riders trot past the palace, the fan-bearer's fan swings
  'j-durbar': () => frame(SCENES4['palace'], put(durbarRider('', 0), 0, 64, 110, 120, 'pv-ride') + put(durbarRider('', 1), 0, 72, 100, 108, 'pv-ride pv-d3') + put(maiFanka(), 258, 70, 46, 84, 'pv-sway'), 'durbar'),
  // balloons rise into the sky and clouds drift
  'fashe': () => frame('<svg viewBox="0 0 320 200"><defs><linearGradient id="pv-fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7EC8EC"/><stop offset="1" stop-color="#FBE7C0"/></linearGradient></defs><rect width="320" height="200" fill="url(#pv-fsky)"/><path d="M0 178 Q80 168 160 176 T320 174 V200 H0 Z" fill="#C9A06A"/></svg>',
    g('<g fill="#fff" opacity=".9"><ellipse cx="60" cy="40" rx="26" ry="8"/><ellipse cx="74" cy="35" rx="14" ry="8"/></g>', 'pv-cloud') + balloon(60, '#E63946', 0) + balloon(130, '#2F6DB5', 2) + balloon(200, '#F2B632', 1) + balloon(262, '#2E9C57', 3), 'fashe'),
  // the market: motorbikes ride through
  'j-nemo': () => frame(kasuwaScene(), put(okada(), 0, 128, 70, 55, 'pv-ride') + put(okada('#C62828', '#2E7D32'), 0, 132, 64, 50, 'pv-ride pv-d3'), 'nemo'),
  // under the river: fish swim, the fisherman's net dips
  'j-abubuwa': () => frame(argunguScene(), put(argunguWater(), 0, 0, 320, 200) + put(fish4('', true), 0, 120, 70, 33, 'pv-swim') + put(fish4('', true), 0, 152, 60, 28, 'pv-swim pv-d2') + put(fish4('', true), 0, 96, 54, 26, 'pv-swim pv-d4') + put(fisherman(), 222, 20, 74, 80, 'pv-dip'), 'kifi'),
  // the drum beats, its rings spread
  'j-magana': () => frame(kalanguScene(), g(drum, 'pv-beat') + g(stick, 'pv-tap') + rings, 'kalangu'),
  // the tea seller's stall, the waiter carries tea, a bike passes
  'j-shayi': () => frame(SCENES4['teanight'], put(teaStall(), 40, 78, 150, 106) + put(teaWaiter(), 200, 92, 42, 90, 'pv-bob') + put(okada('#6A1B9A', '#F9A825'), 0, 142, 54, 42, 'pv-ride'), 'shayi'),
  // the auctioneer's square: a goat wanders, birds fly
  'j-dillali': () => frame(dillaliScene(), g(goat(0, 168, 1.6), 'pv-walk') + g(bird(40, 30, 2, '') + bird(70, 22, 1.6, ''), 'pv-fly'), 'dillali'),
  // the lorry comes for the groundnut sacks
  'j-gyada': () => frame(gyadaScene(), put(gyLorry(), 0, 112, 150, 70, 'pv-drive'), 'gyada'),
  // the suya stand smokes, a bike passes in the night
  'j-suya': () => frame(suyaScene(), put(stand(), 96, 80, 128, 102, 'pv-bob') + put(okada(), 0, 150, 50, 40, 'pv-ride pv-d2'), 'suya'),
  // the allo school: a goat walks, birds fly
  'j-allo': () => frame(alloScene(), g(goat(0, 176, 1.5), 'pv-walk') + g(bird(30, 36, 2, '') + bird(56, 26, 1.6, ''), 'pv-fly'), 'allo'),
  // the ferry sails across, rocking
  'j-jirgi': () => frame(jirgiScene(), put(engineBoat('', 3), 0, 120, 150, 59, 'pv-sail') + g(bird(30, 30, 2, ''), 'pv-fly'), 'jirgi'),
  // a canoe is paddled across the river
  'j-karatu': () => frame(kogiScene(), g(paddler(0, 150), 'pv-sail') + g(bird(40, 30, 2, ''), 'pv-fly pv-d2'), 'kwale'),
  // rain falls on the farm, the millet grows
  'j-ruwa': () => frame(ruwaScene(), put(rainSheet(), 40, -20, 240, 200, 'pv-rain') + put(millet(0), 70, 128, 36, 66, 'pv-grow') + put(millet(1), 142, 132, 34, 62, 'pv-grow pv-d2') + put(millet(2), 214, 128, 36, 66, 'pv-grow pv-d4'), 'ruwa'),
  // the potter's pots hop in turn
  'j-rubutu': () => frame(tukwaneScene(), put(tukPot(''), 92, 128, 40, 46, 'pv-hop') + put(tukPot(''), 140, 128, 40, 46, 'pv-hop pv-d1') + put(tukPot(''), 188, 128, 40, 46, 'pv-hop pv-d2'), 'tukwane'),
  // the house goes up, brick by brick, and settles
  'j-rubutu-say': () => frame(buloScene(), put(buloHouse(), 110, 76, 112, 96, 'pv-build') + g(bird(40, 30, 2, ''), 'pv-fly'), 'bulo'),
  // the post rider comes with the letters
  'j-marubuci': () => frame(wasikaScene(), put(postRider(), 0, 120, 96, 62, 'pv-ride') + g(bird(30, 30, 2, ''), 'pv-fly pv-d2'), 'wasika'),
  // the cloth dips into the dye pit and comes up blue
  'j-rini': () => frame(riniScene(), put(dyeCloth(), 110, 74, 100, 60, 'pv-dip') + g(bird(40, 28, 2, ''), 'pv-fly'), 'rini'),
  // the cattle walk through the market
  'j-shanu': () => frame(shanuScene(), put(kraalCow(0), 0, 118, 90, 60, 'pv-walk') + put(kraalCow(3), 0, 126, 80, 54, 'pv-walk pv-d3'), 'shanu'),
  // the herd walks into the kraal
  'j-garke': () => frame(garkeScene(), put(kraalBack(), 70, 104, 250, 70) + put(kraalCow(1), 0, 120, 80, 54, 'pv-in') + put(kraalCow(4), 0, 126, 74, 50, 'pv-in pv-d3') + put(kraalFront(), 70, 104, 250, 70), 'garke'),
};
