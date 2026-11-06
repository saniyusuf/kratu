// @ts-nocheck
/*
 * The Yoruba and Igbo game scenes (Sani 2026-11-06; designs of 2026-10-28, https://claude.ai/artifact/W5cJfx4ngNGtVhPPzkBgSa).
 * Each Hausa game keeps how it plays, so each scene keeps the Hausa scene's layout: the sky and the far band where the
 * Hausa one has them, and open ground or open water wherever the game puts its own pieces (canoes, sacks, the stall,
 * Laila bottom centre). Only the world changes: south-western towns, lagoons and dress in the Yoruba build, red earth,
 * oil palms, the Niger and the dress of the east in the Igbo build.
 *
 * makeScenes('yo' | 'ig') gives the scenes by game id; skin.yo.ts / skin.ig.ts hand them to the engine (rest.ts).
 */
import { kit, person, crowd, rect, sun, cloud, birds, ridge, forest, ground, tufts, water, oilPalm, coconut, plantain, bigTree, bush, cocoaTree,
  cassava, yamMound, house, compound, obi, shed, umbrella, canopy, road, danfo, keke, lorry, canoe, goat, hen, bunting, parasol, flag, sceneSvg, f1, dk, lt, SKT } from './south';

/** the people of each build, by turn: men and women in that region's dress (u = the scene's pattern urls) */
function folkOf(L, u) {
  const yo = {
    man: [{ robe: u('aso'), hat: 'fila', hatc: '#2E5E8A' }, { robe: '#F4EBD0', hat: 'gobi', hatc: '#7A2E5C', agbada: 1 }, { robe: u('adire'), hat: 'fila', hatc: '#1F3A78' },
      { robe: '#5B8FC9', hat: 'fila', hatc: '#F4EBD0' }, { robe: u('aso2'), hat: 'gobi', hatc: '#2E5E8A', agbada: 1 }, { robe: '#E8DFC8', hat: 'fila', hatc: '#8E1B2A' }],
    woman: [{ robe: u('adire'), wrap: u('adire'), hat: 'gele', hatc: '#1F3A78' }, { robe: '#E8A317', wrap: u('aso'), hat: 'gele', hatc: '#7A2E5C' },
      { robe: '#F4EBD0', wrap: '#2E7D5A', hat: 'gele', hatc: '#2E7D5A' }, { robe: '#C2185B', wrap: u('aso2'), hat: 'gele', hatc: '#C2185B' },
      { robe: '#7A2E5C', wrap: '#E8A317', hat: 'gele', hatc: '#E8A317', ipele: '#7A2E5C' }, { robe: u('lace'), wrap: '#1F3A78', hat: 'gele', hatc: '#C9B88F' }],
  };
  const ig = {
    man: [{ robe: u('isiagu'), hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24' }, { robe: '#F4F1EA', hat: 'okpu', hatc: '#1E1E24', hatc2: '#B71C1C' },
      { robe: u('isiagu'), hat: 'okpuf', hatc: '#B71C1C', hatc2: '#1E1E24', beads: 1 }, { robe: '#2E5E8A', hat: 'none' }, { robe: '#F4F1EA', hat: 'okpu', hatc: '#B71C1C', hatc2: '#1E1E24' }, { robe: '#C9A35A', hat: 'none' }],
    woman: [{ robe: '#F4F1EA', wrap: u('george'), hat: 'tie', hatc: '#8E1B2A', beads: 1 }, { robe: '#1F6B4A', wrap: '#E8A317', hat: 'tie', hatc: '#E8A317' },
      { robe: u('lace'), wrap: u('george'), hat: 'tie', hatc: '#C9B88F', beads: 1 }, { robe: '#E8A317', wrap: '#B23A2E', hat: 'tie', hatc: '#B23A2E' },
      { robe: '#B23A2E', wrap: '#1F4E2E', hat: 'tie', hatc: '#1F4E2E' }, { robe: '#F4F1EA', wrap: '#2E5E8A', hat: 'braids' }],
  };
  const F = L === 'yo' ? yo : ig;
  /** person number i (men and women in turn unless o.kind says), feet at (x, y), h tall */
  return (i, x, y, h, o = {}) => {
    const kind = o.kind || (i % 2 ? 'woman' : 'man');
    const base = kind === 'man' ? F.man[i % F.man.length] : kind === 'woman' ? F.woman[i % F.woman.length]
      : kind === 'boy' ? { robe: ['#E8A317', '#2E7D5A', '#C62828', '#2E5E8A'][i % 4], hat: 'hair', trou: '#3B4A6B' }
      : { robe: ['#C2185B', '#E8A317', '#2E7D5A'][i % 3], wrap: ['#2E5E8A', '#7A2E5C', '#B23A2E'][i % 3], hat: 'braids' };
    return person(x, y, h, { kind: kind === 'girl' ? 'woman' : kind, skin: i, ...base, ...o });
  };
}
const yoHats = ['#2E5E8A', '#7A2E5C', '#1F3A78', '#E8A317', '#8E1B2A'], igHats = ['#B71C1C', '#1E1E24', '#8E1B2A', '#E8A317', '#1F6B4A'];
const CLOTH = ['#1F3A78', '#7A2E5C', '#E8A317', '#2E7D5A', '#C2185B', '#F4EBD0', '#2E5E8A', '#B23A2E'];

export function makeScenes(L: 'yo' | 'ig'): Record<string, () => string> {
  const Y = L === 'yo';
  const HATS = Y ? yoHats : igHats;
  const kt = (id) => { const k = kit(L + id); return { ...k, folk: folkOf(L, k.u), pid: L + id }; };
  /** the far town of each build along a horizon at y: Yoruba zinc roofs among coconut palms, Igbo red earth among oil palms */
  function farTown(y, k, s = 1, seed = 0) {
    let g = '';
    for (let i = 0; i < 9; i++) {
      const x = -6 + i * 38 + ((i * 13 + seed) % 9), w = (16 + (i * 7) % 10) * s, h = (8 + (i * 5) % 5) * s;
      g += Y ? house(x, y + (i % 2), w, h, ['#E9D7B4', '#D9C3A0', '#EADFC8', '#C9A27A'][i % 4], i % 3 ? 'zinc' : 'zincg', { pid: k.pid })
        : (i % 3 === 1 ? obi(x, y + (i % 2), w * .8, h, { pid: k.pid, roof: i % 2 ? 'zinc' : 'thatch' }) : house(x, y + (i % 2), w, h, ['#C8784A', '#D9A27A', '#E9D7B4'][i % 3], 'zinc', { pid: k.pid }));
      if (i % 2 === 0) g += (Y ? coconut : oilPalm)(x + w + 4, y + 1, .55 * s, 1);
    }
    return g;
  }
  const sky = (k, kind = 'day') => rect(k.u(kind)) + (kind === 'day' || kind === 'morn' ? cloud(60, 26, 1.1) + cloud(250, 18, .9) + cloud(170, 40, .6, '#fff', .7) : '');

  /* ---------------- Haruffa: the king's festival (Hawan Sallah's twin): Ojúde Ọba at Ijẹ̀bú-Òde, Ofala at Onitsha ---------------- */
  function durbar() {
    const k = kt('dur'), f = k.folk, q = k.q;
    // Ojúde Ọba: the Awujale's palace at Ijẹ̀bú-Òde, two storeys of white arcades under a red roof, a gate tower with the
    // royal crest; Ofala: the Obi's palace at Onitsha, a long portico of white columns, a red roof and an uli frieze
    const arches = (x0, x1, y, h, n, wall, dark) => { let g = '';
      for (let i = 0; i < n; i++) { const a = x0 + (x1 - x0) * i / n + 2, w = (x1 - x0) / n - 4;
        g += '<path d="M' + f1(a) + ' ' + y + ' V' + f1(y - h * .6) + ' Q' + f1(a + w / 2) + ' ' + f1(y - h * 1.02) + ' ' + f1(a + w) + ' ' + f1(y - h * .6) + ' V' + y + ' Z" fill="' + dark + '"/>' +
          '<path d="M' + f1(a + w * .1) + ' ' + y + ' V' + f1(y - h * .5) + '" stroke="' + wall + '" stroke-width=".5" opacity=".5"/>'; }
      return g; };
    const palaceY = Y
      ? '<path d="M44 108 V70 H276 V108 Z" fill="#F4EEE2"/><path d="M200 108 V70 H276 V108 Z" fill="#1a0e06" opacity=".07"/>' +
        '<path d="M40 70 L52 60 H268 L280 70 Z" fill="#A8432E"/><path d="M40 89 H280 V91.4 H40 Z" fill="#B23A2E"/><path d="M38 70 H282 V72 H38 Z" fill="#7A2E1E"/>' +
        arches(46, 138, 89, 16, 6, '#F4EEE2', '#5A4636') + arches(182, 274, 89, 16, 6, '#F4EEE2', '#5A4636') + arches(46, 138, 108, 15, 6, '#F4EEE2', '#4A382A') + arches(182, 274, 108, 15, 6, '#F4EEE2', '#4A382A') +
        // the gate tower: a pediment with the crest, carved posts (opó) each side of the great doors
        '<path d="M136 108 V56 H184 V108 Z" fill="#FAF6EC"/><path d="M132 56 L160 38 L188 56 Z" fill="#A8432E"/><path d="M132 56 H188 V59 H132 Z" fill="#7A2E1E"/>' +
        '<circle cx="160" cy="49" r="5" fill="#E8B830"/><circle cx="160" cy="49" r="3.2" fill="#1F5B8A"/><path d="M157.6 49 L160 45.6 L162.4 49 L160 52.4 Z" fill="#E8B830"/>' +
        '<path d="M146 108 V74 Q160 62 174 74 V108 Z" fill="#6E3A1E"/><path d="M160 108 V68" stroke="#3A1E0E" stroke-width="1"/>' +
        [150, 154, 166, 170].map((x) => '<circle cx="' + x + '" cy="88" r=".8" fill="#E8B830"/><circle cx="' + x + '" cy="96" r=".8" fill="#E8B830"/>').join('') +
        [140, 180].map((x) => '<path d="M' + (x - 2.4) + ' 108 V66 H' + (x + 2.4) + ' V108 Z" fill="#8A5A2E"/><circle cx="' + x + '" cy="72" r="2" fill="#6E3A1E"/><path d="M' + (x - 2) + ' 80 h4 M' + (x - 2) + ' 90 h4 M' + (x - 2) + ' 100 h4" stroke="#E8C39A" stroke-width=".5"/>').join('') +
        flag(44, 60, 16, '#1F3A78', '#E8B830') + flag(276, 60, 16, '#7A2E5C', '#E8B830') + flag(160, 38, 12, '#2E7D5A', '#F4EBD0')
      : '<path d="M30 108 V76 H290 V108 Z" fill="#F4F1EA"/><path d="M210 108 V76 H290 V108 Z" fill="#1a0e06" opacity=".07"/>' +
        '<path d="M30 76 H290 V83 H30 Z" fill="url(#' + q + 'uli)"/><path d="M24 76 L40 66 H280 L296 76 Z" fill="#9E2A20"/>' +
        Array.from({ length: 14 }, (_, i) => { const x = 40 + i * 18.4; return '<path d="M' + f1(x - 1.6) + ' 108 V84 H' + f1(x + 1.6) + ' V108 Z" fill="#FFFFFF"/><path d="M' + f1(x + .4) + ' 108 V84 H' + f1(x + 1.6) + ' V108 Z" fill="#1a0e06" opacity=".12"/>'; }).join('') +
        '<path d="M42 108 V86 H278 V108 Z" fill="#3A2A20" opacity=".55"/>' +
        '<path d="M128 108 V60 H192 V108 Z" fill="#FFFFFF"/><path d="M122 60 L160 40 L198 60 Z" fill="#9E2A20"/><path d="M128 60 H192 V66 H128 Z" fill="url(#' + q + 'uli)"/>' +
        '<path d="M146 108 V80 Q160 70 174 80 V108 Z" fill="#2A1A10"/><circle cx="160" cy="51" r="5" fill="#B71C1C"/><circle cx="160" cy="51" r="2.6" fill="#F4F1EA"/>' +
        flag(36, 66, 16, '#B71C1C', '#F4F1EA') + flag(284, 66, 16, '#1F6B4A', '#E8B830');
    const flags = bunting(0, 54, 320, 50, Y ? ['#1F3A78', '#E8A317', '#7A2E5C', '#2E7D5A'] : ['#B71C1C', '#F4F1EA', '#1F6B4A', '#E8A317'], 10);
    // the stands: chiefs and guests seated under awnings, fanning themselves
    const stand = (x, w, c1, c2) => { let g = canopy(x, 112, w, c1, c2, 22);
      for (let i = 0; i < Math.floor(w / 9); i++) g += f(i + 3, x + 5 + i * 9, 112, 15, { kind: i % 3 === 1 ? 'woman' : 'man', agbada: Y && i % 3 === 0 ? 1 : 0, al: i % 4 === 0 ? 'wave' : 'down', alc: 'x-wv', beads: !Y && i % 2 === 0 });
      return g + '<path d="M' + x + ' 106 H' + (x + w) + ' V112 H' + x + ' Z" fill="' + (Y ? '#7A2E5C' : '#1F4E2E') + '"/><path d="M' + x + ' 106 H' + (x + w) + '" stroke="#E8B830" stroke-width=".8"/>'; };
    // the age groups (regbẹrẹgbẹ / the age grades): each in its own matching cloth under its own umbrella, two rows deep
    const group = (x0, n, c, c2, hatK, kind, y, h) => { let g = '';
      for (let i = 0; i < n; i++) g += f(i + x0, x0 + i * h * .36, y + (i % 2) * 1.2, h, { kind, robe: c, wrap: c, wrap2: kind === 'woman' ? c2 : undefined, hat: hatK, hatc: kind === 'woman' ? c2 : c, hatc2: c2, agbada: kind === 'man' && Y ? 1 : 0, robe2: c2, beads: !Y,
        cls: 'hop', ar: i % 3 === 1 ? 'wave' : 'down', arc: 'x-wv', al: i % 4 === 2 ? 'wave' : 'down', alc: 'x-wv' });
      return g; };
    const G = Y ? [['#1F3A78', '#E8B830', 'gele', 'woman'], ['#7A2E5C', '#E8B830', 'fila', 'man'], ['#2E7D5A', '#F4EBD0', 'gele', 'woman'], ['#E8A317', '#7A2E5C', 'gobi', 'man']]
      : [['#B71C1C', '#1E1E24', 'okpuf', 'man'], ['#F4F1EA', '#8E1B2A', 'tie', 'woman'], ['#1F4E2E', '#E8B830', 'okpu', 'man'], ['#E8A317', '#1E1E24', 'tie', 'woman']];
    const groups = parasol(26, 126, 10, G[0][0], G[0][1]) + parasol(294, 126, 10, G[3][0], G[3][1]) + parasol(60, 128, 9, G[1][0], G[1][1]) + parasol(258, 128, 9, G[2][0], G[2][1]) +
      group(6, 6, G[0][0], G[0][1], G[0][2], G[0][3], 128, 22) + group(240, 6, G[3][0], G[3][1], G[3][2], G[3][3], 128, 22) +
      group(2, 5, G[1][0], G[1][1], G[1][2], G[1][3], 142, 28) + group(252, 5, G[2][0], G[2][1], G[2][2], G[2][3], 142, 28);
    // the ground: beaten earth with dust, shadows of the crowd, a few leaves
    const dust = '<ellipse cx="160" cy="160" rx="120" ry="20" fill="#fff" opacity=".07"/><path d="M0 116 H320 V122 Q160 126 0 122 Z" fill="#1a0e06" opacity=".08"/>';
    const haze = '<rect y="84" width="320" height="26" fill="url(#' + q + 'haze)"/>';
    const defs = '<linearGradient id="' + q + 'haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3DA" stop-opacity="0"/><stop offset=".7" stop-color="#FFF3DA" stop-opacity=".35"/><stop offset="1" stop-color="#FFF3DA" stop-opacity="0"/></linearGradient>';
    return sceneSvg('dur', k.defs(defs), sky(k, 'morn') + sun(266, 30, 10) + birds(90, 30, 3) + ridge(98, 3, '#9BB98A', 2) + forest(92, '#5E8F4E', 2) +
      farTown(98, k, .6, 3) + haze + ground(108, Y ? '#D9B98A' : '#C98A5A', Y ? '#C9A26A' : '#B4643A') + palaceY + flags +
      crowd(0, 44, 113, 9, CLOTH, HATS, 1.4) + crowd(276, 320, 113, 9, CLOTH, HATS, 1.4) + stand(84, 52, Y ? '#F4EBD0' : '#F4F1EA', Y ? '#7A2E5C' : '#B71C1C') + stand(184, 52, Y ? '#F4EBD0' : '#F4F1EA', Y ? '#1F3A78' : '#1F4E2E') +
      dust + groups + tufts(150, 196, 14, '#9A8A5A'));
  }

  /* ---------------- Abubuwa: fishing (Kamun kifi): the lagoon at Ẹ̀pẹ́ / Oguta Lake, the bank on top and the water seen from below ---------------- */
  function fishing() {
    const k = kt('fish'), f = k.folk;
    const bank = sky(k, 'day') + ridge(26, 2, '#7FAF6A', 3) + (Y ? coconut(30, 34, .5, 1) + coconut(290, 34, .55, -1) + coconut(200, 33, .45, 1) : oilPalm(28, 34, .55) + oilPalm(292, 34, .6) + oilPalm(214, 33, .45)) +
      '<rect y="30" width="320" height="8" fill="' + (Y ? '#D9C08A' : '#B4743E') + '"/>' +
      (Y ? shed(56, 36, 30, ['#B5BCC0', '#E8A317', '#C62828'], { pid: k.pid }) + shed(110, 36, 26, ['#B5BCC0', '#9E9E9E'], { pid: k.pid, roof: 'zincg' }) + shed(236, 36, 30, ['#E8A317', '#B5BCC0'], { pid: k.pid })
        : obi(60, 36, 24, 8, { pid: k.pid }) + shed(112, 36, 28, ['#B5BCC0', '#E8A317'], { pid: k.pid }) + house(238, 36, 26, 8, '#C8784A', 'zinc', { pid: k.pid })) +
      crowd(10, 310, 37, 30, CLOTH, HATS, .9) + canoe(150, 40, 22) + canoe(190, 41, 18, '#7A4A26');
    // under the surface: the light comes down in shafts, sand and weed at the bottom (the same layer the Hausa river has)
    let under = '<defs><linearGradient id="' + k.q + 'deep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + (Y ? '#4FA6C8' : '#5E9A8E') + '"/><stop offset="1" stop-color="' + (Y ? '#1E5A7E' : '#24534A') + '"/></linearGradient></defs>' +
      '<rect y="42" width="320" height="158" fill="url(#' + k.q + 'deep)"/><path d="M0 42 Q80 44 160 42 T320 42" stroke="#D4EDF6" stroke-width="1.2" fill="none" opacity=".7"/>';
    for (let i = 0; i < 5; i++) under += '<path d="M' + (30 + i * 64) + ' 42 L' + (10 + i * 64) + ' 200 L' + (46 + i * 64) + ' 200 Z" fill="#fff" opacity=".07" class="x-glow"/>';
    under += '<path d="M0 186 Q60 178 120 184 T240 182 T320 186 V200 H0 Z" fill="' + (Y ? '#C9B07A' : '#8E7A5A') + '"/>';
    for (let i = 0; i < 10; i++) under += '<path d="M' + (12 + i * 33) + ' 190 q-3 -10 1 -20 q3 -6 0 -12" stroke="#3F7A4A" stroke-width="1.2" fill="none" class="x-leaf2"/>';
    return sceneSvg('fish', k.defs(), bank + under);
  }

  /* ---------------- Abubuwa: the talking drum (Kalangu): dùndún in a Yoruba compound / ogene in an Igbo compound ---------------- */
  function drum() {
    const k = kt('drum'), f = k.folk;
    const wall = Y ? compound(0, 112, 320, 34, '#C8784A', { pid: k.pid }) : '<rect y="78" width="320" height="34" fill="url(#' + k.q + 'uli)"/><path d="M0 78 h320" stroke="#7A3A1E" stroke-width="3"/>' + obi(230, 112, 70, 34, { pid: k.pid });
    let sitters = ''; for (let i = 0; i < 8; i++) sitters += f(i + 1, 70 + i * 21, 114, 22, { cls: 'nod', al: i % 2 ? 'clap' : 'down', ar: i % 2 ? 'clap' : 'down', alc: 'x-cl', arc: 'x-cl' });
    return sceneSvg('drum', k.defs(), sky(k, 'morn') + sun(250, 30, 11) + forest(64, '#4F8A45', 4) + (Y ? oilPalm(300, 80, .8) + bigTree(30, 82, 1.1, '#3F7A3A') : bigTree(40, 82, 1.2, '#3F7A3A') + oilPalm(196, 80, .7)) +
      wall + bunting(0, 30, 320, 34, Y ? ['#1F3A78', '#E8A317', '#C2185B'] : ['#B71C1C', '#F4F1EA', '#1F6B4A'], 12) +
      ground(112, Y ? '#D9B98A' : '#C98A5A', Y ? '#C9A26A' : '#B4643A') + sitters + tufts(130, 196, 14, '#8A7A4A'));
  }

  /* ---------------- Abubuwa: the market caller (Dillalin kasuwa): Ọjà Ọ̀jé in Ibadan / Onitsha Main Market ---------------- */
  function caller() {
    const k = kt('call'), f = k.folk;
    let back = Y ? farTown(70, k, 1, 2) + '<g>' + [0, 1, 2, 3, 4].map((i) => '<rect x="' + (24 + i * 56) + '" y="56" width="40" height="22" fill="url(#' + k.q + (i % 2 ? 'aso' : 'aso2') + ')"/><path d="M' + (22 + i * 56) + ' 56 h44" stroke="#5A4028" stroke-width="1"/>').join('') + '</g>'
      : '<rect x="40" y="26" width="240" height="50" fill="#E3DACB"/><rect x="40" y="22" width="240" height="6" fill="#B71C1C"/>' + [0, 1, 2, 3, 4, 5, 6].map((i) => '<rect x="' + (50 + i * 33) + '" y="34" width="22" height="14" fill="#5A6470"/><rect x="' + (50 + i * 33) + '" y="54" width="22" height="14" fill="#5A6470"/>').join('') +
        '<rect x="110" y="23" width="100" height="5" fill="#FFFDF7"/><text x="160" y="27.3" font-size="4.4" text-anchor="middle" font-family="Baloo 2,system-ui" font-weight="800" fill="#B71C1C">ONITSHA MAIN MARKET</text>';
    let sheds = ''; for (let i = 0; i < 6; i++) sheds += shed(4 + i * 54, 92, 44, i % 2 ? ['#C62828', '#E8A317', '#4E8A3A'] : ['#1F3A78', '#7A2E5C', '#E8A317'], { pid: k.pid, roof: i % 3 ? 'zinc' : 'zincg' });
    let ppl = ''; for (let i = 0; i < 7; i++) ppl += f(i, i < 3 ? 20 + i * 26 : 216 + (i - 3) * 26, 118 + (i % 2) * 3, 30, { cls: i % 2 ? 'hop' : 'nod', ar: i % 3 ? 'down' : 'wave', arc: 'x-wv', load: i === 1 ? '<ellipse cx="0" cy="0" rx="9" ry="2.6" fill="#B5BCC0"/>' : '' });
    return sceneSvg('call', k.defs(), sky(k, 'day') + sun(40, 26, 9) + forest(60, '#5E8F4E', 5) + back + ground(92, Y ? '#D9B98A' : '#C98A5A', Y ? '#C9A26A' : '#B4643A') + sheds +
      crowd(0, 320, 96, 34, CLOTH, HATS, 1.2) + umbrella(120, 96, '#C62828', '#FFFDF7') + umbrella(200, 96, '#1F3A78', '#E8A317') + ppl + keke(300, 104, 1) + goat(28, 140, .9) + hen(290, 150, 1) + hen(70, 160, .9, '#E8E0D0'));
  }

  /* ---------------- Nemo hoto: the market rush (Hanzarin kasuwa): Bódìjà market / Eke market day ---------------- */
  function rush() {
    const k = kt('rush'), f = k.folk;
    let rows = ''; for (let i = 0; i < 7; i++) rows += shed(-4 + i * 47, 74, 40, [['#C62828', '#E8A317'], ['#4E8A3A', '#C9A35A'], ['#E8A317', '#7A4A26']][i % 3], { pid: k.pid, roof: i % 2 ? 'zincg' : 'zinc' });
    let umb = ''; [30, 96, 170, 240, 300].forEach((x, i) => { umb += umbrella(x, 92, ['#C62828', '#1F3A78', '#2E7D5A', '#E8A317', '#7A2E5C'][i], '#FFFDF7', 1.2); });
    let ppl = ''; [[14, 0], [40, 1], [266, 2], [292, 3], [240, 4]].forEach(([x, i]) => { ppl += f(i, x, 132 + (i % 2) * 4, 32, { cls: 'hop', ar: i === 1 ? 'load' : 'down', load: i === 1 ? '<ellipse cx="0" cy="0" rx="10" ry="3" fill="#C9A35A"/><circle cx="-3" cy="-2" r="2" fill="#C62828"/><circle cx="2" cy="-2.4" r="2" fill="#E8A317"/>' : '' }); });
    const sign = Y ? '' : '<g transform="translate(160 24)"><rect x="-26" y="-8" width="52" height="14" rx="3" fill="#FFFDF7" stroke="#B23A2E" stroke-width="1.2"/><text y="2.4" font-size="7" text-anchor="middle" font-family="Baloo 2,system-ui" font-weight="800" fill="#B23A2E">EKE</text></g>';
    return sceneSvg('rush', k.defs(), sky(k, 'day') + sun(270, 22, 9) + forest(46, '#4F8A45', 6) + farTown(56, k, .8, 5) + ground(74, Y ? '#D9B98A' : '#C98A5A', Y ? '#C9A26A' : '#B4643A') + rows + crowd(0, 320, 80, 40, CLOTH, HATS, 1.3) + umb + sign +
      ppl + (Y ? keke(70, 124, 1.1) : keke(70, 124, 1.1, '#1F6B4A')) + goat(300, 170, 1) + hen(24, 176, 1) + hen(46, 182, .9, '#E8E0D0'));
  }

  /* ---------------- Nemo hoto: the morning seller (Mai shayi): Ìyá Àkàrà / the okpa seller, a street at first light ---------------- */
  function seller() {
    const k = kt('sell'), f = k.folk;
    let street = ''; for (let i = 0; i < 6; i++) street += house(-8 + i * 56, 106, 46, 22, ['#E9D7B4', '#C9A27A', '#EADFC8', '#B9C7C0'][i % 4], i % 2 ? 'zinc' : 'zincg', { pid: k.pid, sign: i === 2 ? (Y ? 'BUKA' : 'PROVISIONS') : '', signt: '#B23A2E' });
    return sceneSvg('sell', k.defs(), sky(k, 'morn') + sun(60, 52, 12, '#FFD58A') + forest(80, '#4F7A45', 7) + street + (Y ? coconut(290, 108, .8, -1) : oilPalm(296, 106, .8)) +
      road(108, 22, false) + ground(130, Y ? '#C9A26A' : '#B4643A') + '<path d="M0 108 h320" stroke="#7A5A3A" stroke-width=".6"/>' + keke(240, 122, 1) + birds(140, 30, 3) + tufts(150, 196, 10, '#7A6A3A'));
  }

  /* ---------------- Lambobi: the stacks (Dalar gyaɗa): the cocoa store / the garri depot ---------------- */
  function stacks() {
    const k = kt('stack'), f = k.folk;
    const store = '<rect x="6" y="66" width="120" height="44" fill="#E3D3B4"/><path d="M0 66 L66 46 L132 66 Z" fill="url(#' + k.q + 'zinc)"/><rect x="40" y="80" width="40" height="30" fill="#5A4028"/>' +
      '<rect x="18" y="68" width="96" height="9" fill="#FFFDF7"/><text x="66" y="74.8" font-size="5.6" text-anchor="middle" font-family="Baloo 2,system-ui" font-weight="800" fill="' + (Y ? '#7A4A22' : '#1F6B4A') + '">' + (Y ? 'COCOA PRODUCE STORE' : 'NKWO GARRI DEPOT') + '</text>';
    let trees = ''; for (let i = 0; i < 6; i++) trees += Y ? cocoaTree(150 + i * 30, 98, 1.2) : oilPalm(150 + i * 30, 98, .8);
    let ppl = ''; for (let i = 0; i < 4; i++) ppl += f(i, 150 + i * 44, 128, 30, { cls: 'hop', ar: i % 2 ? 'wave' : 'down', arc: 'x-wv', al: i === 0 ? 'load' : 'down', load: i === 0 ? '<path d="M-8 0 Q-9 -6 0 -6 Q9 -6 8 0 Z" fill="#C8A26A"/>' : '' });
    return sceneSvg('stack', k.defs(), sky(k, Y ? 'day' : 'morn') + sun(200, 30, 10) + forest(70, '#3F7A3A', 8) + trees + ground(108, Y ? '#C9A26A' : '#C98A5A', Y ? '#B98A5A' : '#B4643A') + store + ppl + goat(290, 160, 1) + hen(120, 180, 1));
  }

  /* ---------------- Lambobi: the livestock market (Kasuwar dabbobi): Akínyẹ̀lé in Ibadan / Amansea on the Enugu road ---------------- */
  function livestock() {
    const k = kt('stock'), f = k.folk;
    let fence = '<path d="M0 100 H320" stroke="#7A5A3A" stroke-width="1.2"/>'; for (let x = 4; x < 320; x += 12) fence += '<path d="M' + x + ' 100 v-10" stroke="#7A5A3A" stroke-width="1.4"/>';
    let ppl = ''; for (let i = 0; i < 6; i++) ppl += f(i * 2 + 1, 20 + i * 56, 104, 26, { kind: 'man', cls: i % 2 ? 'hop' : 'nod', ar: i % 2 ? 'wave' : 'staff', arc: 'x-wv' });
    return sceneSvg('stock', k.defs(), sky(k, 'day') + sun(60, 28, 9) + forest(66, '#4F8A45', 9) + farTown(78, k, .7, 4) + (Y ? oilPalm(20, 90, .9) + oilPalm(300, 90, .9) : oilPalm(20, 90, 1) + oilPalm(160, 88, .7) + oilPalm(300, 90, 1)) +
      ground(96, Y ? '#C9B07A' : '#B98A5A', Y ? '#B99A6A' : '#A8704A') + shed(130, 96, 50, ['#C9A35A'], { pid: k.pid }) + fence + ppl + lorry(270, 112, 1, Y ? '#2E5E8A' : '#1F6B4A', Y ? 'OLUWA NI O' : 'NO CONDITION IS PERMANENT'));
  }

  /* ---------------- Lambobi: counting into the pen (Ƙirgen shanu): a farm settlement at dusk, the herd brought home ---------------- */
  function herd() {
    const k = kt('herd'), f = k.folk;
    return sceneSvg('herd', k.defs(), rect(k.u('dusk')) + sun(250, 62, 14, '#FFC46B') + ridge(76, 4, '#4A3A52', 2) + forest(72, '#2F4A3A', 3) + birds(60, 30, 5) +
      (Y ? coconut(30, 92, .7, 1) + oilPalm(290, 92, .8) : oilPalm(30, 92, .9) + oilPalm(290, 92, .8)) + farTown(92, k, .6, 7) + ground(90, Y ? '#A8805A' : '#9A6A48', '#8A5A3A') +
      f(1, 40, 120, 26, { kind: 'woman', load: '<path d="M-8 0 Q0 -8 8 0 Z" fill="#C68B4E"/>', al: 'load' }) + f(2, 280, 122, 26, { kind: 'man', ar: 'staff' }) + f(3, 300, 126, 18, { kind: 'boy' }) + tufts(110, 196, 20, '#6A5A3A'));
  }

  /* ---------------- Lambobi: the evening snack seller (Mai suya): boli / roast corn and ube, a street at night ---------------- */
  function night() {
    const k = kt('night'), f = k.folk;
    let street = ''; for (let i = 0; i < 6; i++) street += house(-6 + i * 56, 104, 46, 24, ['#5A4E5E', '#4E4A5A', '#625462'][i % 3], 'zincg', { pid: k.pid, door: i === 3 ? '#E8C35A' : '#2A2230' });
    let bulbs = ''; for (let x = 6; x < 320; x += 14) bulbs += '<circle cx="' + x + '" cy="' + f1(62 + Math.sin(x / 50) * 3) + '" r="1.3" fill="#FFE7A3" class="x-glow"/>';
    return sceneSvg('night', k.defs(), rect(k.u('night')) + '<circle cx="56" cy="30" r="9" fill="#F4EBD0"/><circle cx="60" cy="27" r="8" fill="#1A2244"/>' +
      Array.from({ length: 30 }, (_, i) => '<circle cx="' + ((i * 97) % 320) + '" cy="' + ((i * 41) % 60) + '" r=".5" fill="#fff" opacity=".7"/>').join('') +
      street + '<path d="M0 62 Q160 70 320 62" stroke="#3A3A44" stroke-width=".4" fill="none"/>' + bulbs + road(104, 18, true) + ground(122, '#4A3A30') +
      f(2, 230, 136, 30, { cls: 'nod' }) + f(3, 252, 138, 30, { cls: 'hop', ar: 'clap', al: 'clap', alc: 'x-cl', arc: 'x-cl' }) + f(4, 276, 136, 22, { kind: Y ? 'girl' : 'boy' }) + keke(200, 118, 1));
  }

  /* ---------------- Karatu: the canoes (Kwale-kwale): the Lagos lagoon regatta / canoes on the Niger ---------------- */
  function canoes() {
    const k = kt('can'), f = k.folk;
    const far = Y ? farTown(100, k, .9, 1) + [40, 120, 260].map((x) => '<g><path d="M' + x + ' 104 v-10 M' + (x + 14) + ' 104 v-10" stroke="#5A4028" stroke-width="1"/><path d="M' + (x - 2) + ' 94 h18 v-8 h-18 Z" fill="#8A6A46"/><path d="M' + (x - 4) + ' 86 L' + (x + 7) + ' 80 L' + (x + 18) + ' 86 Z" fill="url(#' + k.q + 'zincg)"/></g>').join('')
      : farTown(100, k, .9, 6);
    let near = '<path d="M0 160 Q40 150 70 170 L60 200 H0 Z" fill="' + (Y ? '#D9C08A' : '#B4743E') + '"/><path d="M320 166 Q280 156 260 176 L270 200 H320 Z" fill="' + (Y ? '#D9C08A' : '#B4743E') + '"/>';
    near += f(1, 22, 166, 28, { kind: 'woman', cls: 'hop', ar: 'wave', arc: 'x-wv' }) + f(2, 296, 172, 26, { kind: 'man', cls: 'hop', al: 'wave', alc: 'x-wv' }) + f(3, 276, 182, 18, { kind: 'boy', cls: 'hop', ar: 'up', arc: 'x-wv' });
    return sceneSvg('can', k.defs(), sky(k, 'day') + sun(60, 34, 10) + forest(84, '#4F8A45', 1) + far + water(106, 94, k.u(Y ? 'lagoon' : 'river')) + bunting(0, 92, 320, 90, ['#C62828', '#E8A317', '#1F3A78', '#2E7D5A'], 4) +
      canoe(230, 124, 26) + near);
  }

  /* ---------------- Karatu: the board (Allo): a village school, the board under the shade / the class on the veranda ---------------- */
  function school() {
    const k = kt('sch'), f = k.folk;
    const build = Y ? compound(130, 104, 170, 32, '#E9D7B4', { pid: k.pid }) : house(140, 104, 160, 30, '#E3D3B4', 'zinc', { pid: k.pid, sign: 'COMMUNITY PRIMARY SCHOOL', signt: '#1F6B4A' });
    let kids = ''; for (let i = 0; i < 8; i++) kids += f(i, 150 + (i % 4) * 34, 136 + Math.floor(i / 4) * 12, 22, { kind: i % 2 ? 'girl' : 'boy', robe: Y ? '#2E5E8A' : '#1F6B4A', wrap: '#2E5E8A', cls: 'hop', ar: i % 3 ? 'down' : 'up', arc: 'x-wv' });
    return sceneSvg('sch', k.defs(), sky(k, 'day') + sun(40, 30, 9) + forest(70, '#4F8A45', 10) + build + (Y ? bigTree(270, 110, 1.4) : bigTree(276, 110, 1.4, '#3A7036')) +
      ground(104, Y ? '#D9B98A' : '#C98A5A', Y ? '#C9A26A' : '#B4643A') + '<path d="M140 104 V60" stroke="#7A5A3A" stroke-width="1"/><path d="M140 60 h12 v8 h-12 Z" fill="#1F7A3A"/><path d="M140 68 h12 v-2 h-12 Z" fill="#fff"/>' +
      kids + f(4, 120, 128, 34, { kind: Y ? 'woman' : 'man', robe: '#F4EBD0', ar: 'staff' }) + goat(60, 170, 1) + hen(90, 180, 1));
  }

  /* ---------------- Karatu: the ferry (Jirgin ruwa): the Lagos ferry jetty / the Niger at Onitsha under the bridge ---------------- */
  function ferry() {
    const k = kt('fer'), f = k.folk;
    const far = Y ? [20, 50, 76, 110, 140].map((x, i) => '<rect x="' + x + '" y="' + (70 - i * 5 % 18) + '" width="' + (14 + i % 3 * 4) + '" height="' + (34 + i * 5 % 18) + '" fill="' + ['#9AA6B2', '#B5BEC6', '#8A96A2'][i % 3] + '"/>').join('') +
        '<path d="M150 92 Q240 80 320 86" stroke="#8A96A2" stroke-width="2.4" fill="none"/>' + Array.from({ length: 10 }, (_, i) => '<path d="M' + (160 + i * 16) + ' ' + f1(90 - i * .7) + ' v8" stroke="#8A96A2" stroke-width="1"/>').join('')
      : farTown(100, k, .9, 8) + '<path d="M120 74 L320 70" stroke="#8A96A2" stroke-width="3"/>' + [0, 1, 2, 3].map((i) => '<path d="M' + (140 + i * 50) + ' 74 Q' + (165 + i * 50) + ' 58 ' + (190 + i * 50) + ' 73" stroke="#8A96A2" stroke-width="1.6" fill="none"/><path d="M' + (140 + i * 50) + ' 74 v30" stroke="#8A96A2" stroke-width="2"/>').join('');
    let wait = ''; for (let i = 0; i < 5; i++) wait += f(i, 236 + i * 17, 150 + (i % 2) * 3, 26, { cls: 'hop', ar: i % 2 ? 'wave' : 'down', arc: 'x-wv', load: i === 1 ? '<ellipse rx="9" ry="2.6" fill="' + (Y ? '#B5BCC0' : '#C62828') + '"/>' : '' });
    return sceneSvg('fer', k.defs(), sky(k, 'day') + sun(270, 26, 9) + birds(80, 40, 4) + far + water(100, 100, k.u(Y ? 'lagoon' : 'river')) +
      '<path d="M210 150 Q260 136 320 140 V200 H200 Z" fill="' + (Y ? '#D9C08A' : '#B4743E') + '"/>' + (Y ? coconut(300, 146, .8, -1) : oilPalm(300, 146, .8)) + wait +
      '<path d="M0 176 H70 V200 H0 Z" fill="#8A6A46"/><path d="M0 176 H70" stroke="#5A4028" stroke-width="1"/>');
  }

  /* ---------------- Karatu: rain on the farm (Ruwan sama): cassava ridges / yam mounds under the first storm ---------------- */
  function rain() {
    const k = kt('rain'), f = k.folk;
    let rows = ''; for (let i = 0; i < 6; i++) { const y = 112 + i * 9; for (let x = (i % 2) * 14; x < 320; x += 28) rows += Y ? cassava(x, y, .7 + i * .06) : yamMound(x, y, .5 + i * .05); }
    const curtain = '<g opacity=".35">' + Array.from({ length: 14 }, (_, i) => '<path d="M' + (230 + i * 6) + ' 40 l-8 60" stroke="#6A7888" stroke-width="1.2"/>').join('') + '</g>';
    return sceneSvg('rain', k.defs(), rect(k.u('rain')) + '<g fill="#4E5A66">' + [40, 110, 190, 270].map((x, i) => '<ellipse cx="' + x + '" cy="' + (22 + i % 2 * 6) + '" rx="44" ry="14"/>').join('') + '</g>' + curtain +
      forest(86, '#3F6A3A', 11) + farTown(96, k, .6, 9) + (Y ? cocoaTree(40, 104, 1.2) + oilPalm(290, 104, .8) : oilPalm(40, 104, .9) + oilPalm(290, 104, .9)) +
      ground(102, '#8E5A34', '#7A4A2A') + rows + f(5, 30, 150, 34, { kind: 'man', ar: 'staff', robe: Y ? '#5B8FC9' : '#C9A35A', hat: Y ? 'fila' : 'okpu' }) + f(1, 54, 152, 30, { kind: 'woman' }) +
      f(2, 270, 154, 20, { kind: 'boy', ar: 'up', cls: 'hop' }) + f(4, 292, 154, 20, { kind: 'girl', al: 'up', cls: 'hop' }));
  }

  /* ---------------- Rubutu: the pots (Tukwane): a potters' yard at Ìlọrin / Inyi ---------------- */
  function pots() {
    const k = kt('pot'), f = k.folk;
    const potr = (x, y, s, c = '#A8552E') => '<g><ellipse cx="' + x + '" cy="' + y + '" rx="' + f1(5 * s) + '" ry="' + f1(1.2 * s) + '" fill="rgba(40,20,6,.3)"/><path d="M' + f1(x - 3 * s) + ' ' + f1(y - 8 * s) + ' Q' + f1(x - 7 * s) + ' ' + f1(y - 4 * s) + ' ' + f1(x - 3 * s) + ' ' + y + ' H' + f1(x + 3 * s) + ' Q' + f1(x + 7 * s) + ' ' + f1(y - 4 * s) + ' ' + f1(x + 3 * s) + ' ' + f1(y - 8 * s) + ' Z" fill="' + c + '"/><ellipse cx="' + x + '" cy="' + f1(y - 8 * s) + '" rx="' + f1(3 * s) + '" ry="' + f1(.9 * s) + '" fill="' + dk(c, .3) + '"/></g>';
    let rowp = ''; for (let i = 0; i < 14; i++) rowp += potr(16 + i * 22, 122 + (i % 2) * 3, 1.3, ['#A8552E', '#8E4A28', '#2A2220', '#B5683A'][i % 4]);
    return sceneSvg('pot', k.defs(), sky(k, 'day') + sun(60, 30, 10) + forest(70, '#4F8A45', 12) + (Y ? compound(10, 106, 140, 26, '#C8784A', { pid: k.pid }) + house(190, 106, 70, 26, '#E9D7B4', 'zinc', { pid: k.pid }) : obi(20, 106, 70, 26, { pid: k.pid }) + obi(200, 106, 60, 24, { pid: k.pid, roof: 'zinc' })) +
      (Y ? coconut(290, 108, .9, -1) : oilPalm(290, 108, 1)) + ground(106, Y ? '#D9B98A' : '#C98A5A', Y ? '#C9A26A' : '#B4643A') + rowp +
      f(1, 290, 150, 30, { kind: 'woman', cls: 'hop', load: '<path d="M-6 0 Q-9 -6 -3 -8 H3 Q9 -6 6 0 Z" fill="#A8552E"/>', al: 'load' }) + f(3, 20, 152, 28, { kind: 'woman', ar: 'hold', al: 'hold' }) + '<g class="x-smoke"><circle cx="250" cy="118" r="5" fill="#BBB" opacity=".5"/></g>' + hen(40, 186, 1) + goat(300, 186, .9));
  }

  /* ---------------- Rubutu: build the house (Ginin bulo): a red-earth house going up in the village ---------------- */
  function build() {
    const k = kt('bul'), f = k.folk;
    let wall = '<g transform="translate(220 128)">'; for (let r = 0; r < 4; r++) for (let c = 0; c < 6 - (r > 2 ? 2 : 0); c++) wall += '<rect x="' + (c * 13 + (r % 2) * 6) + '" y="' + (-r * 7 - 7) + '" width="12" height="6.4" fill="' + (Y ? '#B8B4AC' : '#B5583A') + '" stroke="' + (Y ? '#8E8A84' : '#7A3B22') + '" stroke-width=".4"/>';
    wall += '</g><path d="M218 128 V90 M300 128 V90" stroke="#7A5A3A" stroke-width="1.2"/><path d="M212 90 H306" stroke="#7A5A3A" stroke-width="1"/>';
    return sceneSvg('bul', k.defs(), sky(k, 'day') + sun(80, 30, 10) + forest(72, '#4F8A45', 13) + farTown(98, k, .7, 2) + (Y ? oilPalm(20, 104, .9) + bigTree(150, 104, 1) : bigTree(30, 104, 1.1) + oilPalm(170, 104, .9)) +
      ground(100, Y ? '#C9A26A' : '#C98A5A', Y ? '#B98A5A' : '#B4643A') + wall +
      f(0, 236, 148, 30, { kind: 'man', robe: '#C9A35A', hat: Y ? 'fila' : 'okpu', cls: 'hop', ar: 'up', arc: 'x-wv' }) + f(2, 280, 150, 30, { kind: 'man', robe: '#5B8FC9', hat: 'none', load: '<path d="M-8 0 h16 v-2 h-16 Z" fill="#7A5A3A"/>', al: 'load' }) +
      '<g transform="translate(150 150)"><ellipse rx="16" ry="5" fill="#8E5A34"/><ellipse rx="12" ry="3.4" fill="#A8703E"/></g>' + goat(110, 182, 1) + hen(300, 186, 1));
  }

  /* ---------------- Rubutu: the letter writer (Marubucin wasiƙa): a street with the post office, Ibadan / Enugu ---------------- */
  function post() {
    const k = kt('post'), f = k.folk;
    return sceneSvg('post', k.defs(), sky(k, 'day') + sun(170, 24, 9) + forest(76, '#4F8A45', 14) +
      house(0, 124, 90, 46, '#F4F1EA', 'zincg', { pid: k.pid, sign: 'NIPOST', signc: '#1F7A3A', signt: '#FFFDF7' }) + '<rect x="70" y="116" width="10" height="16" rx="3" fill="#C62828"/>' +
      house(100, 116, 60, 34, '#E9D7B4', 'zinc', { pid: k.pid }) + house(228, 120, 92, 40, Y ? '#C9A27A' : '#C8784A', 'zinc', { pid: k.pid, sign: Y ? 'ỌJA OBA' : 'OGBETE', signt: '#B23A2E' }) +
      (Y ? coconut(178, 120, .9, 1) : oilPalm(184, 120, .9)) + road(132, 26, true) + ground(158, '#B9A07A') + umbrella(250, 160, '#C62828', '#E8A317', 1.6) +
      f(0, 30, 168, 30, { kind: 'woman', cls: 'hop' }) + f(1, 274, 172, 32, { kind: 'man', ar: 'hold', cls: 'nod' }) + f(2, 120, 176, 20, { kind: 'boy', cls: 'hop' }) + goat(190, 186, 1) + hen(220, 190, 1));
  }

  /* ---------------- Rubutu: the dyed cloth (Karofi): the adire dyers of Ìtòkú, Abẹ́òkúta / Akwete's cloth yard ---------------- */
  function dye() {
    const k = kt('dye'), f = k.folk;
    let line = '<path d="M0 60 Q160 70 320 60" stroke="#5A4028" stroke-width=".8" fill="none"/>';
    for (let i = 0; i < 9; i++) { const x = 6 + i * 36; line += '<rect x="' + x + '" y="' + f1(61 + Math.sin(i) * 2) + '" width="26" height="40" fill="url(#' + k.q + (Y ? (i % 3 ? 'adire' : 'aso2') : (i % 2 ? 'george' : 'aso')) + ')"/>'; }
    let potsd = ''; for (let i = 0; i < 4; i++) potsd += '<g transform="translate(' + (40 + i * 74) + ' 136)"><ellipse rx="16" ry="5" fill="#3D2B1F"/><ellipse rx="13" ry="3.4" fill="' + (Y ? '#1E3A7A' : '#7A2E1E') + '"/></g>';
    return sceneSvg('dye', k.defs(), sky(k, 'day') + sun(270, 26, 9) + forest(50, '#4F8A45', 15) + (Y ? compound(0, 104, 320, 30, '#C8784A', { pid: k.pid }) : '<rect y="70" width="320" height="34" fill="url(#' + k.q + 'uli)"/>') + line +
      ground(104, Y ? '#C9A26A' : '#C98A5A', Y ? '#B98A5A' : '#B4643A') + potsd +
      f(1, 24, 156, 32, { kind: 'woman', ar: 'hold', cls: 'hop' }) + f(3, 296, 156, 32, { kind: 'woman', al: 'hold', cls: 'hop' }) + f(5, 270, 162, 22, { kind: 'girl', cls: 'hop' }) + goat(70, 190, .9));
  }

  return {
    'j-durbar': durbar, 'j-abubuwa': fishing, 'j-magana': drum, 'j-dillali': caller, 'j-nemo': rush, 'j-shayi': seller, 'j-gyada': stacks, 'j-shanu': livestock,
    'j-garke': herd, 'j-suya': night, 'j-karatu': canoes, 'j-allo': school, 'j-jirgi': ferry, 'j-ruwa': rain, 'j-rubutu': pots, 'j-rubutu-say': build,
    'j-marubuci': post, 'j-rini': dye,
  };
}
