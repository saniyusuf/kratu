// @ts-nocheck
/*
 * Kamun kifi at Argungu (Sani 2026-10-25): the river on festival day. The far bank is crowded under bunting and
 * canopies, fishermen stand waist-deep with their hand nets and calabash floats, and one fisherman stands close by in
 * the shallows with his homa (the hooped hand net). When the child catches the right fish he scoops it up and flicks it
 * into the woven basket floating beside him; the basket fills, one fish at a time. Drawn, not photographed; every
 * moving part moves by transform and opacity, a few slow loops only, for cheap tablets.
 */
const SK = '#5E3A1C';

/* The far side of the river, 160×100; the waterline (the cut through the surface) is y=31 and kamun.css pins that line
   to 31% of the screen at every aspect. Sun high on the left, so every shadow falls to the right. Back to front:
   a warm hazy sky; Argungu town and the far tree line pale and blue with distance; branched doum palms and neem trees;
   the bank, millet fields at both ends (a man and a woman hoeing), Fulani cattle grazing with their herder; the festival
   (three canopies, bunting, a crowd of men in riga and caps and women in wrappers and head-ties, some with hand nets);
   two men drying a net; a strip of open river with fishermen waist-deep, calabash floats, a canoe throwing a cast net. */
export function argunguScene(): string {
  let seed = 7; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const f = (n) => (+n).toFixed(2).replace(/\.?0+$/, '');
  const lg = (id, ...c) => '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' + c.map((col, i) => '<stop offset="' + (i / (c.length - 1)).toFixed(2) + '" stop-color="' + col + '"/>').join('') + '</linearGradient>';
  const SKN = ['#5E3A1C', '#4A2C15', '#6B4423', '#553319'];
  /* soft cumulus: lit tops, a greyer underside */
  const cloud = (x, y, s) => '<g class="drift4" transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cy="1" rx="13" ry="2.6" fill="#DCE6EC"/>' +
    '<ellipse cx="-5" cy="-.6" rx="6" ry="3" fill="#fff"/><ellipse cx="2" cy="-2" rx="7" ry="4" fill="#fff"/><ellipse cx="8" cy="-.4" rx="5" ry="2.8" fill="#F4F8FA"/><ellipse cx="0" cy="1.4" rx="11" ry="1.4" fill="#C9D6DE" opacity=".6"/></g>';
  /* the branched doum palm of the Sokoto–Kebbi river: a trunk that forks, each fork crowned with stiff fan leaves */
  const fan = (x, y, s, c1, c2) => { let p = ''; for (let a = -160; a <= -20; a += 20) { const r = a * Math.PI / 180; p += 'M0 0 L' + f(Math.cos(r) * 4.6) + ' ' + f(Math.sin(r) * 3.6) + ' '; }
    return '<g transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')"><path d="M-4.4 .6 Q0 -5.4 4.4 .6 Q0 -1 -4.4 .6 Z" fill="' + c1 + '"/><path d="' + p + '" stroke="' + c2 + '" stroke-width=".35" fill="none"/>' +
      '<path d="M-3.4 1.4 Q-2 .2 0 .2 Q2 .2 3.4 1.4" stroke="' + c1 + '" stroke-width=".9" fill="none" opacity=".8"/></g>'; };
  const dum = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="2.4" cy=".2" rx="4" ry=".7" fill="#3A2A12" opacity=".22"/>' +
    '<path d="M-.7 0 L-.5 -9 Q-3 -12 -4.6 -15 L-3.9 -15.3 Q-2.2 -12.6 0 -10.2 Q1.8 -13 3.4 -17 L4.1 -16.8 Q2.6 -12.4 .6 -9 L.8 0 Z" fill="#6E5236"/>' +
    '<path d="M.2 0 L.3 -9 Q1.8 -13 3.6 -16.9 L4.1 -16.8 Q2.6 -12.4 .6 -9 L.8 0 Z" fill="#4E3A24"/>' +
    '<path d="M-.5 -2 H.7 M-.5 -4.4 H.7 M-.5 -6.8 H.7" stroke="#4E3A24" stroke-width=".25"/>' +
    fan(-4.3, -15.2, .9, '#5D8A3E', '#7FAE52') + fan(3.8, -17, 1, '#5D8A3E', '#8DBB5E') + '</g>';
  /* a neem: a short trunk with a shaded side and a crown of leaf masses, dark below, lit on top-left */
  const neem = (x, y, s, hz = 0) => { const dk = hz ? '#6F8F78' : '#335A2A', md = hz ? '#86A58A' : '#4C7A36', lt = hz ? '#A2BCA0' : '#76A04C';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' + (hz ? '' : '<ellipse cx="4" cy=".2" rx="9" ry="1.2" fill="#2E2410" opacity=".25"/>') +
      '<path d="M-1.4 0 Q-1.6 -6 -1 -11 L-4 -15 M1.4 0 Q1.2 -7 1.6 -11 L4.6 -14.6 M0 -10 L.4 -16" stroke="' + (hz ? '#7E8C80' : '#5A3E22') + '" stroke-width="1.4" fill="none" stroke-linecap="round"/>' +
      '<path d="M.5 0 Q.4 -6 1 -11" stroke="' + (hz ? '#6C7A6E' : '#3E2A16') + '" stroke-width=".8" fill="none"/>' +
      '<g fill="' + dk + '"><ellipse cx="0" cy="-16" rx="12" ry="6.4"/><ellipse cx="-7" cy="-14" rx="6" ry="4"/><ellipse cx="7.6" cy="-14.4" rx="5.6" ry="3.8"/></g>' +
      '<g fill="' + md + '"><ellipse cx="-2" cy="-18.4" rx="9" ry="5"/><ellipse cx="-8" cy="-16" rx="4.4" ry="3"/><ellipse cx="5.6" cy="-17.6" rx="5.4" ry="3.6"/></g>' +
      '<g fill="' + lt + '"><ellipse cx="-4" cy="-20.4" rx="5" ry="2.8"/><ellipse cx="2.6" cy="-21" rx="3.6" ry="2.2"/><ellipse cx="-9" cy="-17.6" rx="2.4" ry="1.5"/></g></g>'; };
  /* a canopy (rumfa) on four poles: woven-mat roof with a scalloped cloth valance, a shadow on the ground to the right */
  const rumfa = (x, w, c, c2) => '<g><path d="M' + f(x + 1.6) + ' 27.2 L' + f(x + w + 4.4) + ' 27.2 L' + f(x + w + 2.6) + ' 26 L' + f(x + 1.2) + ' 26 Z" fill="#3A2A12" opacity=".2"/>' +
    '<path d="M' + x + ' 27 V19.6 M' + (x + w) + ' 27 V19.6 M' + f(x + 1.4) + ' 26 V19 M' + f(x + w - 1.4) + ' 26 V19" stroke="#5A3A1E" stroke-width=".45"/>' +
    '<path d="M' + f(x - 1.2) + ' 20 L' + f(x + 1) + ' 16.8 H' + f(x + w - 1) + ' L' + f(x + w + 1.2) + ' 20 Z" fill="' + c + '"/>' +
    '<path d="M' + f(x + w / 2) + ' 16.8 L' + f(x + w + 1.2) + ' 20 H' + f(x + w / 2 + 1) + ' Z" fill="#000" opacity=".14"/>' +
    '<path d="M' + f(x + 1) + ' 16.8 L' + f(x - 1.2) + ' 20" stroke="#fff" stroke-width=".3" opacity=".5"/>' +
    '<path d="M' + f(x - 1.2) + ' 20 ' + Array.from({ length: Math.round((w + 2.4) / 1.6) }, (_, i) => 'q.8 1.1 1.6 0').join(' ') + ' V20 Z" fill="' + c2 + '"/></g>';
  /* the millet: rows of young plants on furrowed red-brown earth */
  const field = (x0, x1, y) => { let s = '<path d="M' + (x0 + 1) + ' ' + y + ' H' + (x1 - 1) + ' L' + x1 + ' ' + (y + 4.6) + ' H' + x0 + ' Z" fill="#A7774A"/>' +
    '<g stroke="#8A5E36" stroke-width=".25">'; for (let r = 0; r < 5; r++) s += '<path d="M' + x0 + ' ' + f(y + .5 + r * 1) + ' H' + x1 + '"/>'; s += '</g><g stroke="#4F8A34" stroke-width=".55" stroke-linecap="round">';
    for (let r = 0; r < 4; r++) for (let x = x0 + 1 + (r % 2); x < x1 - .5; x += 2) { const yy = y + 1 + r * 1.1, hh = .9 + r * .25; s += '<path d="M' + f(x) + ' ' + f(yy) + ' l-.35 -' + f(hh) + ' M' + f(x) + ' ' + f(yy) + ' l.45 -' + f(hh * .9) + '"/>'; }
    return s + '</g>'; };
  /* a farmer bent over a short hoe (fartanya); the arms and hoe rise and fall */
  const farmer = (x, y, robe, head, k) => '<g transform="translate(' + x + ' ' + y + ')"><ellipse cx="1.4" cy=".1" rx="2.4" ry=".4" fill="#3A2412" opacity=".3"/>' +
    '<path d="M-.9 0 L-.6 -2.4 M.9 0 L.6 -2.4" stroke="' + SKN[0] + '" stroke-width=".55"/>' +
    '<path d="M-1.4 -2 L-1 -4.6 Q.6 -6 2 -4.4 L1.6 -2 Z" fill="' + robe + '"/><path d="M.4 -5.2 Q1.6 -4.8 2 -4.4 L1.6 -2 H.4 Z" fill="#000" opacity=".2"/><circle cx="2.4" cy="-5" r=".8" fill="' + SKN[0] + '"/>' + head +
    '<g class="hoe h' + k + '"><path d="M1.6 -4.2 L3.4 -2.6" stroke="' + SKN[0] + '" stroke-width=".55" stroke-linecap="round"/><path d="M2 -5.2 L4 -.4" stroke="#7A5530" stroke-width=".35"/><path d="M3.4 -.6 L4.8 -.2" stroke="#9AA0A6" stroke-width=".6"/></g></g>';
  /* a white Fulani cow with a hump and lyre horns, grazing; its head dips now and then */
  const cow = (x, y, s, k) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="1.6" cy=".1" rx="5" ry=".6" fill="#3A2A12" opacity=".25"/>' +
    '<path d="M-3 0 V-2.6 M-1.8 0 V-2.6 M2.2 0 V-2.6 M3.2 0 V-2.6" stroke="#9A9282" stroke-width=".55"/><path d="M-3 0 H-2.6 M-1.8 0 H-1.4 M2.2 0 H2.6 M3.2 0 H3.6" stroke="#3A3226" stroke-width=".4"/>' +
    '<path d="M-3.8 -3.6 Q-3.6 -5.2 -1.6 -5.2 Q-1 -6.4 .2 -5.4 Q3 -5.4 4 -4.2 Q4.4 -2.6 3.6 -2.2 H-3.2 Q-4 -2.6 -3.8 -3.6 Z" fill="#F2EDE2"/>' +
    '<path d="M-3.4 -2.4 Q0 -1.6 3.6 -2.4 Q4.4 -3 4 -4.2 Q3.4 -3 0 -2.8 Q-2.4 -2.8 -3.4 -2.4 Z" fill="#CFC6B2"/>' +
    '<g class="graze g' + k + '"><path d="M-3.6 -4.2 L-5.4 -2.6 L-6.3 -1.6 L-5.2 -1.1 L-4 -2.2 Z" fill="#E9E2D2"/><path d="M-6.3 -1.6 L-5.2 -1.1" stroke="#3A3226" stroke-width=".35"/>' +
      '<path d="M-4.4 -3.9 Q-6 -6 -4.8 -7 M-4.4 -3.7 Q-3.4 -6 -2.2 -6.2" stroke="#D8C49A" stroke-width=".45" fill="none" stroke-linecap="round"/></g>' +
    '<path d="M4 -3.8 Q5 -2.6 4.6 -1" stroke="#9A9282" stroke-width=".35" fill="none"/></g>';
  /* a person, feet at 0, about 7 tall (the head a seventh of it); lit from the left, the right side in shade.
     kind: 0 man in riga and cap, 1 man in jallabiya and turban, 2 woman in wrapper and head-tie */
  const tpl = {}, ptpl = (kind, arm) => {
    const sk = 'var(--s)', c1 = 'var(--a)', c2 = 'var(--b)';
    let g = '<g id="agp' + kind + arm + '"><ellipse cx="1.1" cy=".05" rx="1.9" ry=".38" fill="#2E2010" opacity=".32"/>' +
      '<path d="M-.75 -.5 L-.9 .05 H-.1 Z M.75 -.5 L.9 .05 H.1 Z" fill="#3A2412"/>';
    if (kind === 2) g += '<path d="M-1.25 -.4 L-1.05 -3.9 H1.05 L1.25 -.4 Z" fill="' + c2 + '"/><path d="M-1.15 -1.6 H1.2 M-1.1 -2.8 H1.12" stroke="#fff" stroke-width=".18" opacity=".55"/>' +
      '<path d="M-1.05 -3.9 L-1.1 -5.5 Q0 -6.1 1.1 -5.5 L1.05 -3.9 Z" fill="' + c1 + '"/>';
    else g += '<path d="M-1.5 -.45 L-1.15 -5.4 Q0 -6 1.15 -5.4 L1.5 -.45 Z" fill="' + c1 + '"/><path d="M-.3 -5.6 L-.5 -.45 M.5 -5 L.7 -.45" stroke="#000" stroke-width=".14" opacity=".2"/>' +
      (kind === 0 ? '<path d="M-.4 -5.6 Q0 -4.4 .4 -5.6 M0 -5 V-3.2" stroke="' + c2 + '" stroke-width=".22" fill="none"/>' : '');
    g += '<path d="M.15 -5.8 Q1.2 -5.6 ' + (kind === 2 ? '1.1 -3.9 L1.25 -.4' : '1.15 -5.4 L1.5 -.45') + ' H.3 Z" fill="#000" opacity=".2"/>';
    /* arms: down at the sides, or one raised to cheer or to hold up a hand net */
    g += '<path d="M-1.1 -5.2 Q-1.6 -3.8 -1.4 -2.8" stroke="' + c1 + '" stroke-width=".7" fill="none" stroke-linecap="round"/><circle cx="-1.35" cy="-2.6" r=".3" fill="' + sk + '"/>';
    if (arm === 1) g += '<path d="M1.05 -5.2 Q2 -6.4 2.1 -7.8" stroke="' + c1 + '" stroke-width=".66" fill="none" stroke-linecap="round"/><circle cx="2.15" cy="-8.05" r=".3" fill="' + sk + '"/>';
    else if (arm === 2) g += '<path d="M1.05 -5.2 Q2 -5.8 2.2 -6.8" stroke="' + c1 + '" stroke-width=".66" fill="none" stroke-linecap="round"/><circle cx="2.25" cy="-7" r=".3" fill="' + sk + '"/>' +
      '<path d="M2.2 -6.4 L4.6 -11" stroke="#6B4A2A" stroke-width=".28"/><ellipse cx="5.2" cy="-11.9" rx="1.7" ry="1.1" fill="#E9DFC4" fill-opacity=".45" stroke="#6B4A2A" stroke-width=".26"/>';
    else g += '<path d="M1.1 -5.2 Q1.6 -3.8 1.4 -2.8" stroke="' + c1 + '" stroke-width=".7" fill="none" stroke-linecap="round"/><path d="M1.2 -5 Q1.6 -3.8 1.4 -2.8" stroke="#000" stroke-width=".7" opacity=".18" fill="none"/><circle cx="1.35" cy="-2.6" r=".3" fill="' + sk + '"/>';
    g += '<path d="M-.22 -6 V-5.6 H.22 V-6 Z" fill="' + sk + '"/><ellipse cy="-6.55" rx=".52" ry=".64" fill="' + sk + '"/><ellipse cx=".2" cy="-6.5" rx=".3" ry=".55" fill="#000" opacity=".18"/>';
    if (kind === 0) g += '<path d="M-.54 -6.8 Q-.54 -7.6 0 -7.62 Q.54 -7.6 .54 -6.8 Z" fill="' + c2 + '"/>';
    else if (kind === 1) g += '<path d="M-.62 -6.7 Q-.7 -7.7 0 -7.7 Q.7 -7.7 .62 -6.7 Q0 -7 -.62 -6.7 Z" fill="#F4EFE4"/><path d="M-.6 -7 Q0 -7.4 .6 -7" stroke="#D9CFB8" stroke-width=".14" fill="none"/>';
    else g += '<path d="M-.66 -6.6 Q-.8 -7.7 0 -7.8 Q.9 -7.8 .8 -6.8 L1.1 -7.4 Q.4 -7 -.66 -6.6 Z" fill="' + c2 + '"/>';
    return g.replace(/(fill|stroke)="(var\(--\w\))"/g, 'style="$1:$2"') + '</g>'; };
  const person = (x, y, s, kind, c1, c2, arm = 0) => { const k = '' + kind + arm; if (!tpl[k]) tpl[k] = ptpl(kind, arm);
    return '<use href="#agp' + k + '" transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + s + ')" style="--a:' + c1 + ';--b:' + c2 + ';--s:' + SKN[Math.floor(rnd() * 4)] + '"/>'; };
  const robes = ['#F4EFE4', '#2F6B9A', '#E9E2CF', '#6A4C93', '#1E4F7A', '#C9B88F', '#2E7D32', '#8E2B2B', '#DAD4C4', '#3E4E5E'];
  const wraps = [['#E65100', '#1565C0'], ['#AD1457', '#FFB300'], ['#2E7D32', '#F9A825'], ['#6A1B9A', '#E91E63'], ['#00838F', '#FF7043'], ['#C62828', '#FDD835']];
  const caps = ['#F4EFE4', '#C62828', '#1E4F7A', '#F4EFE4', '#2E7D32'];
  let back = '', front = '';
  for (let i = 0; i < 22; i++) {   // the back row, a little smaller and paler with distance
    const x = 31 + i * 4 + rnd() * 1.4, w = wraps[i % wraps.length], kind = i % 3 === 2 ? 2 : i % 4 === 1 ? 1 : 0;
    back += person(x, 25.7 + rnd() * .3, .5, kind, kind === 2 ? w[0] : robes[(i * 3) % robes.length], kind === 2 ? w[1] : caps[i % caps.length], i % 5 === 1 ? 1 : i % 6 === 3 ? 2 : 0);
  }
  for (let i = 0; i < 17; i++) {
    const x = 33 + i * 5 + rnd() * 1.6, w = wraps[(i + 2) % wraps.length], kind = i % 3 === 1 ? 2 : i % 4 === 2 ? 1 : 0;
    front += person(x, 27 + rnd() * .35, .62, kind, kind === 2 ? w[0] : robes[(i * 7 + 1) % robes.length], kind === 2 ? w[1] : caps[(i + 2) % caps.length], i % 4 === 0 ? 2 : i % 5 === 2 ? 1 : 0);
  }
  /* two men spread a long net to dry between them; it lifts in the breeze */
  const spread = '<g transform="translate(128 27.2)">' + person(0, 0, .6, 0, '#E9D9A6', '#C62828') + person(15, 0, .6, 1, '#1E5A8A', '#fff') +
    '<g class="drynet"><path d="M1.2 -3.4 Q8 -1.8 14 -3.4 L14 -1.2 Q8 .3 1.2 -1.2 Z" fill="#D9CBA6" opacity=".5"/><path d="M1.2 -3.4 Q8 -1.8 14 -3.4 M2.8 -3 V-1 M5 -2.6 V-.6 M7.4 -2.4 V-.4 M9.8 -2.4 V-.4 M12.2 -2.8 V-.9" stroke="#7A5530" stroke-width=".2" fill="none"/></g></g>';
  /* fishermen waist-deep in the open water with raised hand nets and calabash floats, bobbing slowly; a ring of ripples */
  const far = (x, y, s, k) => { const sk = SKN[k % 4], robe = ['#1E5A8A', '#E9D9A6', '#7A3E1E', '#2E7D32'][k % 4];
    return '<g class="farfish f' + k + '"><g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<path d="M-1.5 0 L-1.2 -3.4 Q0 -4 1.2 -3.4 L1.5 0 Z" fill="' + robe + '"/><path d="M.2 -3.8 Q1.2 -3.6 1.2 -3.4 L1.5 0 H.3 Z" fill="#000" opacity=".2"/>' +
      '<ellipse cy="-4.5" rx=".55" ry=".66" fill="' + sk + '"/><path d="M-.56 -4.8 Q-.56 -5.6 0 -5.6 Q.56 -5.6 .56 -4.8 Z" fill="#F4EFE4"/>' +
      '<path d="M1.1 -3.2 Q2 -4.6 2.4 -5.4" stroke="' + sk + '" stroke-width=".6" fill="none" stroke-linecap="round"/>' +
      '<path d="M2.4 -5.2 L4.6 -9" stroke="#6B4A2A" stroke-width=".3"/><ellipse cx="5.2" cy="-9.9" rx="2" ry="1.2" fill="#E9DFC4" fill-opacity=".45" stroke="#6B4A2A" stroke-width=".3"/>' +
      '<path d="M3.4 -9.6 Q5.2 -7 7 -9.6" fill="#D9CBA6" opacity=".5"/>' +
      '<path d="M-2.4 .1 Q0 .9 2.4 .1" stroke="#E9FBFF" stroke-width=".3" fill="none" opacity=".9"/><path d="M-1.5 0 H1.5 V1.2 H-1.5 Z" fill="#2E7590" opacity=".55"/>' +
      '<ellipse cx="-3.6" cy="-.2" rx="1.4" ry="1.1" fill="#E2B04A"/><ellipse cx="-4" cy="-.7" rx=".55" ry=".3" fill="#F6D98A"/><path d="M-3.6 .5 V1.4" stroke="#2E7590" stroke-width="2.8" opacity=".4"/></g></g>'; };
  /* a dugout canoe on the open water; its man throws a cast net that opens over the water and is drawn in again */
  const canoe = '<g class="canoe4"><g transform="translate(80 29.4)"><path d="M-6.4 .2 Q0 1.4 6.4 .2" stroke="#2E7590" stroke-width=".9" opacity=".5" fill="none"/>' +
    '<path d="M-6.6 -.9 Q0 .9 6.6 -.9 L6 .1 Q0 1.3 -6 .1 Z" fill="#5A3A1E"/><path d="M-6.6 -.9 Q0 -.3 6.6 -.9" stroke="#8A6038" stroke-width=".35" fill="none"/>' +
    person(-1.4, -.6, .6, 0, '#C62828', '#F4EFE4') + '<path d="M-.9 -3.6 L1.4 -4.6" stroke="' + SKN[0] + '" stroke-width=".4" stroke-linecap="round"/>' +
    '<g class="castnet"><ellipse cx="5.6" cy="-3.4" rx="3.6" ry="1.5" fill="#E9E0C8" opacity=".5" stroke="#7A5530" stroke-width=".18" stroke-dasharray=".5 .4"/><path d="M1.4 -4.6 L5.6 -3.4" stroke="#7A5530" stroke-width=".14"/></g></g></g>';
  /* egrets: two crossing the sky, one standing at the water's edge */
  const bird = (x, y, s) => '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 0 Q-1.6 -1.4 -3 -.4 M0 0 Q1.6 -1.4 3 -.4" stroke="#fff" stroke-width=".55" fill="none" stroke-linecap="round"/><ellipse cy=".2" rx="1.1" ry=".45" fill="#fff"/><path d="M1 .2 L2 .1" stroke="#E2B04A" stroke-width=".25"/></g>';
  const egret = '<g class="egrets">' + bird(0, 15.6, .8) + bird(-9, 17.6, .65) + '</g>';
  const stander = '<g transform="translate(118 27.7)"><ellipse cx=".9" cy=".05" rx="1.3" ry=".22" fill="#2E2010" opacity=".3"/><path d="M0 0 V-1.8 M.5 0 V-1.8" stroke="#3A3A3A" stroke-width=".2"/><ellipse cx=".4" cy="-2.4" rx="1.2" ry=".7" fill="#fff"/><path d="M.4 -2 Q1 -2.2 1.6 -2.4" stroke="#D9D4C6" stroke-width=".4" fill="none"/><path d="M-.6 -2.6 Q-1 -4 -.4 -4.4 L-1.4 -4.2" stroke="#fff" stroke-width=".4" fill="none"/></g>';
  /* the far town: flat-roofed mud houses with water spouts, pale with distance */
  let town = '<g opacity=".55">'; for (let i = 0; i < 14; i++) { const x = 40 + i * 5.6 + rnd() * 2, w = 3 + rnd() * 2.6, h = 1.6 + rnd() * 1.4;
    town += '<rect x="' + f(x) + '" y="' + f(19.6 - h) + '" width="' + f(w) + '" height="' + f(h) + '" fill="#C8A98A"/><rect x="' + f(x + w * .6) + '" y="' + f(19.6 - h) + '" width="' + f(w * .4) + '" height="' + f(h) + '" fill="#A88C74"/>'; }
  town += '<path d="M76 19.6 V14.4 L77 13.2 L78 14.4 V19.6 Z" fill="#D2B898"/><circle cx="77" cy="13" r=".35" fill="#D2B898"/></g>';
  /* the bank: sandy grain, a darker wet margin where it meets the open river */
  let grain = '<g stroke="#8E7448" stroke-width=".16" opacity=".5">'; for (let i = 0; i < 70; i++) { const x = rnd() * 160, y = 21.6 + rnd() * 5.6; grain += '<path d="M' + f(x) + ' ' + f(y) + ' h' + f(.4 + rnd() * .8) + '"/>'; } grain += '</g>';
  let tufts = '<g stroke="#5E7E3A" stroke-width=".3" stroke-linecap="round">'; for (let i = 0; i < 26; i++) { const x = rnd() * 160, y = 22 + rnd() * 5.4; tufts += '<path d="M' + f(x) + ' ' + f(y) + ' l-.3 -.9 M' + f(x) + ' ' + f(y) + ' l.1 -1.1 M' + f(x) + ' ' + f(y) + ' l.45 -.8"/>'; } tufts += '</g>';
  let glints = '<g stroke="#F4FBFF" stroke-linecap="round" opacity=".7">'; for (let i = 0; i < 30; i++) { const y = 28.3 + rnd() * 2.6; glints += '<path d="M' + f(rnd() * 160) + ' ' + f(y) + ' h' + f(.6 + (y - 28) * .7 * rnd() + .4) + '" stroke-width="' + f(.1 + (y - 28) * .05) + '"/>'; } glints += '</g>';
  return '<svg class="scene ag4" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice"><defs>' +
    lg('ag-sky', '#5FA8DA', '#9CCDEB', '#D9ECF2', '#F3E7CC') + lg('ag-bank', '#9AAE6C', '#A9A46C', '#C4A671', '#B39260') + lg('ag-river', '#A9CCD6', '#6FAAB8', '#3F8697', '#2E7590') +
    '<radialGradient id="ag-sun" cx="10" cy="2" r="60" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFF6D6" stop-opacity=".95"/><stop offset=".25" stop-color="#FFF1C8" stop-opacity=".45"/><stop offset="1" stop-color="#FFF1C8" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="ag-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3EEF0" stop-opacity="0"/><stop offset="1" stop-color="#E3EEF0" stop-opacity=".55"/></linearGradient></defs>' +
    '<rect width="160" height="100" fill="url(#ag-sky)"/><rect width="160" height="40" fill="url(#ag-sun)"/>' + cloud(34, 9, .8) + cloud(108, 6.4, .6) + cloud(150, 12, .5) + egret +
    /* far tree line and town, blue-grey with distance */
    '<path d="M0 19.4 Q6 16.6 12 18.2 Q18 15.8 26 17.6 Q34 16.4 40 18 Q50 16.8 58 18.4 L100 18.6 Q108 16.2 116 17.8 Q124 15.6 132 17.4 Q142 16.2 150 17.6 Q156 16.6 160 17.4 V21 H0 Z" fill="#9FB7AE"/>' +
    town + neem(14, 20.4, .32, 1) + neem(104, 20.2, .3, 1) + neem(140, 20.4, .34, 1) +
    '<rect y="15" width="160" height="6.4" fill="url(#ag-haze)"/>' +
    '<path d="M0 20.6 Q40 19.4 80 20.4 T160 20 V28 H0 Z" fill="url(#ag-bank)"/>' + grain +
    dum(7, 22.8, .62) + neem(26, 22.6, .5) + dum(60, 22, .5) + neem(94, 22.4, .56) + dum(124, 22.2, .6) + neem(154, 22.8, .48) +
    field(2, 27, 21.8) + farmer(10, 25.8, '#2E7D32', '<path d="M1.6 -5.6 Q2.4 -6.6 3.2 -5.6 Z" fill="#E9D9A6"/>', 0) + farmer(20, 25.6, '#AD1457', '<path d="M1.5 -5.2 Q2.4 -6.8 3.3 -5.2" fill="#6A1B9A"/>', 1) +
    field(136, 159, 21.6) + farmer(147, 25.6, '#1565C0', '<path d="M1.6 -5.6 Q2.4 -6.6 3.2 -5.6 Z" fill="#C62828"/>', 2) +
    cow(104, 24.6, .7, 0) + cow(113, 24.2, .6, 1) + person(120, 24.6, .5, 1, '#7A3E1E', '#fff', 0) + '<path d="M120.7 22.2 L121.3 24.6" stroke="#6B4A2A" stroke-width=".25"/>' + tufts +
    rumfa(33, 13, '#B23A3A', '#E9D9A6') + rumfa(61, 15, '#2E6E3A', '#FFD54A') + rumfa(92, 12, '#1E5A8A', '#F4EFE4') +
    '<g class="bunting"><path d="M30 12.6 Q65 18.6 100 12.6" fill="none" stroke="#5A3A1E" stroke-width=".3"/>' +
    [33, 40, 47, 54, 61, 68, 75, 82, 89, 96].map((x, i) => { const y = 12.6 + Math.sin((x - 30) / 70 * Math.PI) * 5.6; return '<path d="M' + x + ' ' + f(y) + ' l1.5 2.8 l1.5 -2.8 Z" fill="' + ['#C62828', '#2E7D32', '#FFD54A', '#1565C0'][i % 4] + '"/><path d="M' + f(x + 1.5) + ' ' + f(y + 2.8) + ' l1.5 -2.8 h-.8 Z" fill="#000" opacity=".15"/>'; }).join('') + '</g>' +
    back + '<rect x="28" y="22" width="96" height="4.2" fill="#E8EEE6" opacity=".12"/>' + front + spread + stander +
    /* the wet margin and the open river beyond the cut: pale with the sky near the far bank, deeper close to us */
    '<path d="M0 27.6 Q40 27 80 27.5 T160 27.3 V28.4 H0 Z" fill="#7E6A44"/><path d="M0 28 Q40 27.5 80 27.9 T160 27.7 V100 H0 Z" fill="url(#ag-river)"/>' +
    '<path d="M0 28 Q40 27.5 80 27.9 T160 27.7" stroke="#F4FBFF" stroke-width=".25" fill="none" opacity=".8"/>' +
    '<g fill="#000" opacity=".08"><rect x="33" y="28.1" width="14" height="1.2"/><rect x="61" y="28.1" width="16" height="1.3"/><rect x="92" y="28.1" width="13" height="1.2"/></g>' + glints +
    far(20, 29.6, .62, 0) + far(46, 29.2, .55, 1) + canoe + far(100, 29.8, .66, 2) + far(138, 29.3, .58, 3) + '<defs>' + Object.values(tpl).join('') + '</defs></svg>';
}

/* Under the surface, lowered to 31%: light rays, sand, reeds, a catfish nosing along the bottom, a crab sidling on the
   sand, a far shoal of small fish, and bubbles rising. Everything moves by transform and opacity only. */
export function argunguWater(): string {
  const s = 19.4;
  const shoal = [0, 1, 2, 3, 4].map(i => '<path transform="translate(' + (i * 2.6) + ' ' + ((i % 2) * 1.4 + (i % 3) * .6).toFixed(1) + ')" d="M0 0 Q1 -.6 2 0 L2.6 -.4 L2.5 0 L2.6 .4 L2 0 Q1 .6 0 0 Z"/>').join('');
  const bub = (x, k) => '<g transform="translate(' + x + ' 56)"><g class="bub4 b' + k + '"><circle r=".5"/><circle cx=".4" cy="-2.4" r=".35"/><circle cx="-.2" cy="-4.6" r=".3"/></g></g>';
  return '<svg class="uw" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect y="' + s + '" width="100" height="' + (62.5 - s) + '" fill="url(#kb-under)"/>' +
    '<g class="rays"><path d="M10 ' + s + ' L4 62.5 H16 Z M34 ' + s + ' L30 62.5 H42 Z M58 ' + s + ' L56 62.5 H66 Z" fill="url(#kb-ray)"/></g>' +
    '<path d="M0 ' + s + ' Q12 ' + (s - 1.2) + ' 25 ' + s + ' T50 ' + s + ' T75 ' + s + ' T100 ' + s + '" stroke="#E9FBFF" stroke-opacity=".75" stroke-width=".6" fill="none"/>' +
    '<g class="shoal4" fill="#0E3E52" opacity=".35"><g transform="translate(0 33)">' + shoal + '</g><g transform="translate(30 41) scale(.8)">' + shoal + '</g></g>' +
    '<linearGradient id="ag-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9C9068"/><stop offset=".3" stop-color="#C2AA74"/><stop offset="1" stop-color="#A48E5E"/></linearGradient>' +
    '<path d="M0 62.5 V57 Q20 54 40 57 T80 56 T100 57 V62.5 Z" fill="url(#ag-sand)"/>' +
    /* ripples in the sand, the stones half sunk with a lit top and a shadow on the down-current side */
    '<g stroke="#8E7B55" stroke-width=".22" fill="none" opacity=".7">' + [[3, 58.6], [14, 60.2], [30, 59], [38, 61.4], [52, 58.8], [64, 61], [76, 59.2], [88, 60.8]].map(p => '<path d="M' + p[0] + ' ' + p[1] + ' q2 -.7 4 0 t4 0"/>').join('') + '</g>' +
    [[8, 59, 1.6], [22, 60.5, 1.2], [47, 59.5, 1.7], [70, 60, 1.3], [91, 59, 1.5]].map(p => '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + p[2] + ')"><ellipse cx=".5" cy=".4" rx="1.3" ry=".4" fill="#5C4E34" opacity=".45"/><ellipse rx="1" ry=".62" fill="#7E7058"/><ellipse cx="-.3" cy="-.25" rx=".55" ry=".25" fill="#B4A88C"/></g>').join('') +
    '<g class="weeds"><g fill="#2F6A2A">' + [[4, 62, 44, -1], [7, 62, 42, 1], [60, 62, 48, -1], [84, 61, 49, 1], [86, 61, 47, -1]].map(p => '<path d="M' + p[0] + ' ' + p[1] + ' Q' + (p[0] - 2.4 * p[3]) + ' ' + ((p[1] + p[2]) / 2) + ' ' + (p[0] + p[3]) + ' ' + p[2] + ' Q' + (p[0] - 1.2 * p[3]) + ' ' + ((p[1] + p[2]) / 2) + ' ' + (p[0] + .9) + ' ' + p[1] + ' Z"/>').join('') + '</g>' +
    '<path d="M4.2 61 Q2.6 53 4.6 46 M7.2 61 Q8.4 51 6.6 44" stroke="#5E9A44" stroke-width=".2" fill="none"/></g>' +
    '<g class="catfish4"><g transform="translate(70 54.4)"><path d="M0 0 Q4 -1.6 9 -.6 L12 -1.8 L11.4 0 L12 1.6 L9 .6 Q4 1.4 0 0 Z" fill="#3B3A36"/><path d="M3 -.9 Q6 -1.6 9 -.6" fill="#55534C"/>' +
      '<path d="M.4 0 Q-1.6 1 -2.6 2.6 M.4 .2 Q-1.4 -.4 -2.8 0 M.6 .4 Q-.6 1.6 -1 3" stroke="#3B3A36" stroke-width=".18" fill="none"/><circle cx="1.4" cy="-.3" r=".25" fill="#E9E2D2"/></g></g>' +
    '<g class="crab4"><g transform="translate(26 57.6)"><ellipse rx="1.8" ry="1" fill="#C8552E"/><path d="M-1.4 .4 L-2.6 1.4 M-1 .7 L-2 1.8 M1.4 .4 L2.6 1.4 M1 .7 L2 1.8" stroke="#A8441F" stroke-width=".3"/>' +
      '<path d="M-1.6 -.4 L-2.6 -1.6 M1.6 -.4 L2.6 -1.6" stroke="#A8441F" stroke-width=".4"/><circle cx="-2.7" cy="-1.8" r=".5" fill="#C8552E"/><circle cx="2.7" cy="-1.8" r=".5" fill="#C8552E"/></g></g>' +
    '<g fill="none" stroke="#E9FBFF" stroke-width=".18" opacity=".8">' + bub(20, 0) + bub(47, 1) + bub(78, 2) + bub(92, 3) + '</g></svg>';
}

/* The fisherman, a grown Arewa man, turned to face us, waist-deep: embroidered hula cap, short beard, a riga, his homa
   held in both hands and his calabash float tied at the waist (Sani 2026-10-25: "make him a real Arewa fisherman"). The water line is y=74 of 130; below it he is seen through the water. .homa turns at the shoulder:
   .scoop dips the hoop into the water, .throw flicks it up and over towards the basket. */
export function fisherman(): string {
  return '<svg class="fisher2" viewBox="0 0 120 130" aria-hidden="true">' +
    '<defs><linearGradient id="fs-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<mask id="fs-m" maskUnits="userSpaceOnUse" x="30" y="60" width="70" height="70"><rect x="30" y="70" width="70" height="34" fill="url(#fs-g)"/></mask></defs>' +
    '<g class="legs" mask="url(#fs-m)"><path d="M56 74 L54 124 L61 124 L63 88 L65 124 L72 124 L70 74 Z" fill="' + SK + '"/><path d="M53 66 L73 66 L74 92 L64 92 L63 84 L62 92 L52 92 Z" fill="#2B3F73"/></g>' +
    '<g class="body2">' +
      /* a short-sleeved riga in faded indigo with white embroidery at the neck, a calabash float tied at the waist */
      '<path d="M50 36 Q62 31 74 36 L78 45 L73.6 47 L74 70 L50 70 L50.4 47 L46 45 Z" fill="#5E8FB4"/>' +
      /* lit from the upper left: the right side of the riga in shade, cloth folds, the hem dark where the river wets it */
      '<path d="M64 33 Q70 33.4 74 36 L78 45 L73.6 47 L74 70 L66 70 Q67.4 52 64 33 Z" fill="#1C3550" opacity=".28"/><path d="M46 45 L50.4 47 L50.4 44 Z" fill="#1C3550" opacity=".25"/>' +
      '<path d="M54 49 Q55.4 59 53.4 69 M70.4 50 Q69 60 71 69 M57 60 Q58 65 56.6 69" stroke="#3F6E92" stroke-width=".8" fill="none" opacity=".8"/><path d="M52 48 Q53 56 52.4 64" stroke="#A9CBE2" stroke-width=".7" fill="none" opacity=".6"/>' +
      '<path d="M50 63.6 Q62 65 74 63.4 L74 70 L50 70 Z" fill="#20405E" opacity=".45"/>' +
      '<path d="M57 33.4 Q62 41 67 33.4" stroke="#F4EFE4" stroke-width="1.2" fill="none"/><path d="M62 39 V58" stroke="#F4EFE4" stroke-width=".9" stroke-dasharray="1.4 1"/>' +
      '<path d="M59 42 l3 2 l3 -2 M59 47 l3 2 l3 -2" stroke="#F4EFE4" stroke-width=".6" fill="none"/><path d="M50 70 H74" stroke="#3F6E92" stroke-width="1.4"/>' +
      '<path d="M74 66 Q82 67 85 71" stroke="#8A6A3A" stroke-width=".8" fill="none"/>' +
      /* his face, turned to us: two eyes, brows, a short beard and moustache, a smile; an embroidered hula cap */
      '<g class="head2"><rect x="58.8" y="25" width="6.4" height="8" fill="' + SK + '"/>' +
        '<path d="M58.8 27 Q62 30.6 65.2 27 V30 Q62 32 58.8 30 Z" fill="#2A170A" opacity=".55"/>' +
        '<ellipse cx="54.4" cy="19.6" rx="1.4" ry="2.2" fill="' + SK + '"/><ellipse cx="69.6" cy="19.6" rx="1.4" ry="2.2" fill="' + SK + '"/>' +
        '<ellipse cx="62" cy="19.4" rx="7.6" ry="9" fill="' + SK + '"/>' +
        '<path d="M64 10.6 Q69.6 12 69.6 19.4 Q69.4 26 65 28 Q67.4 20 64 10.6 Z" fill="#2A170A" opacity=".35"/><ellipse cx="57.6" cy="15.6" rx="2.2" ry="1.4" fill="#8A5A34" opacity=".35"/>' +
        '<path d="M54.8 20.6 Q55.2 29.4 62 29.6 Q68.8 29.4 69.2 20.6 Q68 26.2 62 26.6 Q56 26.2 54.8 20.6 Z" fill="#24160B"/>' +
        '<path d="M58.8 23.4 Q62 22 65.2 23.4 Q62 24.2 58.8 23.4 Z" fill="#24160B"/><path d="M59.8 24.8 Q62 26.4 64.2 24.8" stroke="#F4EFE4" stroke-width=".7" fill="none"/>' +
        '<ellipse cx="58.9" cy="18.4" rx="1.7" ry="1.15" fill="#F6F1E4"/><ellipse cx="65.1" cy="18.4" rx="1.7" ry="1.15" fill="#F6F1E4"/>' +
        '<circle cx="59.1" cy="18.5" r=".85" fill="#120A04"/><circle cx="64.9" cy="18.5" r=".85" fill="#120A04"/><circle cx="59.4" cy="18.2" r=".25" fill="#fff"/><circle cx="65.2" cy="18.2" r=".25" fill="#fff"/>' +
        '<path d="M57 16.2 Q58.9 15.2 60.6 16 M63.4 16 Q65.1 15.2 67 16.2" stroke="#120A04" stroke-width=".55" fill="none" stroke-linecap="round"/>' +
        '<path d="M62 19 Q61 21.6 61.2 22 Q62 22.4 62.9 22" stroke="#3E2410" stroke-width=".5" fill="none"/>' +
        '<path d="M54.2 13.6 Q54.2 4.4 62 4.2 Q69.8 4.4 69.8 13.6 Z" fill="#F4EFE4"/><path d="M54.2 13.4 H69.8" stroke="#D9CFB8" stroke-width="1.2"/>' +
        '<path d="M55 11 H69 M55.8 8.2 H68.2" stroke="#2E7D32" stroke-width=".7" stroke-dasharray="1.2 .8"/><path d="M57.4 6 H66.6" stroke="#C62828" stroke-width=".6" stroke-dasharray="1 .8"/></g>' +
    '</g>' +
    '<g class="homa">' +
      '<path d="M54 38 Q46 46 42 52 M70 38 Q60 50 48 56" stroke="' + SK + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<path d="M50 62 L14 24" stroke="#7A5530" stroke-width="2.2" stroke-linecap="round"/>' +
      '<g class="hoop"><path d="M14 22 Q-8 26 -5 46 Q10 60 26 40 Z" fill="#FFFDF4" opacity=".45"/>' +
        '<path d="M4 28 L18 50 M-3 38 L10 56 M10 24 L24 42 M-4 48 L14 26 M4 56 L22 34" stroke="#5A3A1E" stroke-width=".7" opacity=".6"/>' +
        '<path d="M14 22 Q-8 26 -5 46 Q10 60 26 40" fill="none" stroke="#5E3A1C" stroke-width="2.6" stroke-linecap="round"/></g>' +
      '<circle cx="42" cy="52" r="2.8" fill="' + SK + '"/><circle cx="48" cy="56" r="2.8" fill="' + SK + '"/>' +
    '</g>' +
    '<g class="gourd"><ellipse cx="88" cy="72.6" rx="6.4" ry="5" fill="#E2B04A"/><ellipse cx="86.4" cy="70.4" rx="2.6" ry="1.4" fill="#F6D98A" opacity=".8"/><path d="M81.6 74 Q88 78.6 94.4 74 Z" fill="#1D7EA6" opacity=".35"/></g>' +
    '<ellipse cx="72" cy="75.4" rx="20" ry="2.2" fill="#0E3E52" opacity=".25"/>' +
    '<path class="ripple" d="M38 74 Q63 70 96 74" stroke="#E9FBFF" stroke-width="1.2" fill="none" opacity=".8"/><path d="M47 74.6 Q62 77.6 77 74.6" stroke="#E9FBFF" stroke-width=".8" fill="none" opacity=".6"/></svg>';
}

/* the woven basket (kwando) on its calabash float: six fish can lie in it, shown one by one as they land */
export function basket(): string {
  let weave = '';
  for (let i = 0; i < 9; i++) weave += '<path d="M' + (14 + i * 9) + ' 30 Q' + (12 + i * 9) + ' 46 ' + (20 + i * 7) + ' 62" stroke="#8A5A26" stroke-width="1.4" fill="none" opacity=".7"/>';
  for (let j = 0; j < 4; j++) weave += '<path d="M' + (12 + j * 2) + ' ' + (36 + j * 7) + ' Q50 ' + (40 + j * 7) + ' ' + (88 - j * 2) + ' ' + (36 + j * 7) + '" stroke="#F0D29A" stroke-width="1.2" fill="none" opacity=".55"/>';
  const fish = [[28, 20, -30], [48, 15, -8], [68, 19, 18], [36, 24, -50], [58, 23, 40], [74, 24, 60]].map((p, i) =>
    '<g class="bf b' + (i + 1) + '" transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')"><g transform="scale(1.6)"><path d="M-7 0 Q-2 -4 5 -1 L10 -4 L9 0 L10 4 L5 1 Q-2 4 -7 0 Z" fill="#E4EEDD" stroke="#2E4229" stroke-width=".7"/><path d="M-3 -2 Q0 -3 3 -1.6" stroke="#fff" stroke-width=".5" fill="none" opacity=".7"/><circle cx="-4.4" cy="-.6" r=".9" fill="#121212"/></g></g>').join('');
  return '<svg class="kwando" viewBox="0 0 100 80" aria-hidden="true">' +
    '<ellipse cx="58" cy="69" rx="46" ry="4" fill="#0E3E52" opacity=".28"/>' +
    '<ellipse cx="50" cy="66" rx="44" ry="7" fill="#E2B04A"/><path d="M6 66 Q50 76 94 66 Q92 72 50 73 Q8 72 6 66 Z" fill="#9A6A22" opacity=".6"/><ellipse cx="50" cy="63" rx="40" ry="4.4" fill="#F6D98A" opacity=".6"/>' +
    fish +
    '<path d="M8 30 Q10 64 50 66 Q90 64 92 30 Z" fill="#C88A44"/>' + weave +
    '<path d="M60 31 Q90 34 92 30 Q90 64 50 66 Q78 58 60 31 Z" fill="#5A3412" opacity=".3"/><path d="M14 34 Q16 54 30 62" stroke="#F6D9A2" stroke-width="2" fill="none" opacity=".35"/>' +
    '<ellipse cx="50" cy="30" rx="42" ry="5.6" fill="none" stroke="#9A6430" stroke-width="3"/>' +
    '<defs><linearGradient id="kw-sub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D6F86" stop-opacity=".6"/><stop offset="1" stop-color="#1D6F86" stop-opacity="0"/></linearGradient></defs>' +
    '<path d="M4 67 Q50 75 96 67 Q90 80 50 80 Q10 80 4 67 Z" fill="url(#kw-sub)"/>' +
    '<g class="rip"><ellipse cx="50" cy="68" rx="48" ry="3" fill="none" stroke="#E9FBFF" stroke-width="1" opacity=".8"/></g></svg>';
}

/* A smaller tilapia carrying a bigger tag (Sani 2026-10-25: "the fish can be smaller, the images bigger"): the photo
   fills the tag edge to edge, the body is the old tilapia at .6 size, and two bubbles rise from its mouth. Same classes
   as fish3 (tagg, ftail, pfin) so the tail beat and the tag sway carry over. viewBox -124..138 × 0..110; the body is
   x 14..136, y 26..86. */
export function fish4(photo: string, bodyOnly = false): string {
  let bars = ''; for (let i = 0; i < 6; i++) bars += '<rect x="' + (78 + i * 18) + '" y="0" width="8" height="110" fill="#22341E" opacity=".13"/>';
  const body = '<g transform="translate(14 56) scale(.6) translate(-14 -56)">' +
    '<g class="ftail"><path d="M60 55 L14 22 Q24 55 14 88 Z" fill="url(#kb-tail)"/><path d="M58 55 L20 28 M58 55 L18 42 M58 55 L17 55 M58 55 L18 68 M58 55 L20 82" stroke="#4F6646" stroke-width=".8" opacity=".6"/></g>' +
    '<path d="M92 24 C110 6 150 4 176 26 L160 30 C140 22 112 22 96 30 Z" fill="url(#kb-fin)"/>' +
    '<path d="M98 26 L104 10 M110 24 L116 7 M122 22 L128 6 M134 22 L140 7 M146 23 L152 9 M158 25 L164 14" stroke="#3F5A3A" stroke-width="1" opacity=".55"/>' +
    '<path d="M110 84 C122 102 146 102 158 86 Z" fill="url(#kb-fin)"/>' +
    '<path d="M58 55 C72 18 150 10 198 44 C210 52 210 60 198 67 C150 100 72 92 58 55 Z" fill="url(#kb-fish)"/>' +
    '<g clip-path="url(#kb-body)">' + bars + '<rect x="50" y="0" width="160" height="110" fill="url(#kb-scales)"/>' +
      '<path d="M64 62 C100 70 160 70 204 58" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/><ellipse cx="128" cy="34" rx="46" ry="8" fill="#fff" opacity=".22"/></g>' +
    '<path d="M170 32 C160 48 160 66 172 80" fill="none" stroke="#2E4229" stroke-width="2" opacity=".55"/>' +
    '<g class="pfin"><path d="M160 64 C150 70 140 80 136 90 C150 86 160 78 166 70 Z" fill="url(#kb-fin)" opacity=".9"/></g>' +
    '<path d="M200 60 Q206 62 202 64" stroke="#2E2A1E" stroke-width="1.6" fill="none"/>' +
    '<circle cx="186" cy="47" r="7.5" fill="#F6F4E8"/><circle cx="186" cy="47" r="5.6" fill="url(#kb-eye)"/><circle cx="187" cy="47" r="2.8" fill="#121212"/><circle cx="184.5" cy="44.6" r="1.4" fill="#fff"/></g>';
  if (bodyOnly) return '<svg viewBox="12 26 126 60" class="art">' + body + '</svg>';
  return '<svg viewBox="-124 0 262 110" class="art fish3svg">' +
    '<g class="tagg"><path d="M14 56 C2 60 -10 50 -24 52" fill="none" stroke="#F4EBD0" stroke-width="1.6"/>' +
      '<g transform="rotate(-5 -73 55)"><rect x="-122" y="4" width="98" height="102" rx="10" fill="url(#kb-tag)"/>' +
      '<image href="' + photo + '" x="-122" y="4" width="98" height="102" preserveAspectRatio="xMidYMid slice" clip-path="inset(0 round 10px)"/>' +
      '<rect x="-122" y="4" width="98" height="102" rx="10" fill="none" stroke="#C9B88F" stroke-width="1.4"/>' +
      '<circle cx="-30" cy="52" r="3" fill="#fff" stroke="#C9B88F"/></g></g>' +
    body + '<g class="fbub"><circle cx="134" cy="52" r="2.4"/><circle cx="137" cy="48" r="1.5"/></g></svg>';
}
