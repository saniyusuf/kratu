// @ts-nocheck
/* The judging games' art: shaded SVG pieces and painted scenes, gradients only, so a cheap tablet draws them fast.
   Moved from the proposal page (art.js, art2.js, art3.js) unchanged; bootArt() runs them once and hands back KART. */
let KART: any = null;
export function bootArt(): any {
  if (KART) return KART;
/* Kratu game art: shaded SVG pieces. Gradients only (no filters), shared through one <defs>, so a cheap tablet draws them fast. */
(function () {
  var D = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<radialGradient id="ka-hl" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="ka-shade" cx=".38" cy=".3" r=".8"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>' +
    '<linearGradient id="ka-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5B4630"/><stop offset=".45" stop-color="#C9A86A"/><stop offset="1" stop-color="#4A3622"/></linearGradient>' +
    '<radialGradient id="ka-glass" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#FFF8D2"/><stop offset=".55" stop-color="#FFD54A"/><stop offset="1" stop-color="#E08A1E"/></radialGradient>' +
    '<linearGradient id="ka-glassoff" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5A4B39"/><stop offset="1" stop-color="#2E241A"/></linearGradient>' +
    '<linearGradient id="ka-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A55"/><stop offset=".5" stop-color="#9C5F2E"/><stop offset="1" stop-color="#6B3E1C"/></linearGradient>' +
    '<linearGradient id="ka-woodside" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6B3E1C"/><stop offset=".35" stop-color="#C98A55"/><stop offset=".65" stop-color="#B5763C"/><stop offset="1" stop-color="#5B3416"/></linearGradient>' +
    '<radialGradient id="ka-clay" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#F0A774"/><stop offset=".55" stop-color="#C46A35"/><stop offset="1" stop-color="#7E3A16"/></radialGradient>' +
    '<radialGradient id="ka-leather" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFF6E0"/><stop offset=".7" stop-color="#E9CF9C"/><stop offset="1" stop-color="#B9945A"/></radialGradient>' +
    '<linearGradient id="ka-fish" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9F43"/><stop offset=".6" stop-color="#FFC069"/><stop offset="1" stop-color="#FFE7B8"/></linearGradient>' +
    '<radialGradient id="ka-star" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".5" stop-color="#FFD54A"/><stop offset="1" stop-color="#E8A317"/></radialGradient>' +
    '<radialGradient id="ka-staroff" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#E8E4FA"/><stop offset="1" stop-color="#9C95C8"/></radialGradient>' +
    '<radialGradient id="ka-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFE58A" stop-opacity=".9"/><stop offset="1" stop-color="#FFE58A" stop-opacity="0"/></radialGradient>' +
    '<linearGradient id="ka-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CCDF2"/><stop offset="1" stop-color="#1B86C4"/></linearGradient>' +
    '<linearGradient id="ka-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141838"/><stop offset="1" stop-color="#3E2E62"/></linearGradient>' +
    '<linearGradient id="ka-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3F4"/><stop offset=".75" stop-color="#E4F5FC"/><stop offset="1" stop-color="#F7E6BE"/></linearGradient>' +
    '<radialGradient id="ka-moon" cx=".4" cy=".4" r=".6"><stop offset="0" stop-color="#FFFDF0"/><stop offset="1" stop-color="#F2DFA0"/></radialGradient>' +
    '<radialGradient id="ka-mud" cx=".35" cy=".25" r=".9"><stop offset="0" stop-color="#E9B97E"/><stop offset=".6" stop-color="#B9773E"/><stop offset="1" stop-color="#7A4A22"/></radialGradient>' +
    '</defs></svg>';
  document.body.insertAdjacentHTML('afterbegin', D);

  var A = {};
  A.balloon = function (L) {
    return '<svg viewBox="0 0 60 84" class="art"><path d="M30 58 C26 64 34 68 29 76 C26 80 31 82 30 84" fill="none" stroke="rgba(59,46,30,.45)" stroke-width="1.4"/>' +
      '<path d="M27 56 L33 56 L30 61 Z" style="fill:var(--c)"/><ellipse cx="30" cy="29" rx="25" ry="28" style="fill:var(--c)"/>' +
      '<ellipse cx="30" cy="29" rx="25" ry="28" fill="url(#ka-shade)"/><ellipse cx="21" cy="17" rx="8" ry="11" fill="url(#ka-hl)" transform="rotate(-25 21 17)"/>' +
      '<text x="30" y="38" text-anchor="middle" class="t">' + L + '</text></svg>';
  };
  A.lantern = function (L) {
    return '<svg viewBox="0 0 50 92" class="art"><path d="M25 0 V8" stroke="#3A2A1A" stroke-width="2"/><circle cx="25" cy="10" r="3" fill="none" stroke="url(#ka-metal)" stroke-width="2"/>' +
      '<path d="M12 14 H38 L42 22 H8 Z" fill="url(#ka-metal)"/>' +
      '<g class="lglow"><circle cx="25" cy="44" r="30" fill="url(#ka-glow)"/></g>' +
      '<rect x="10" y="22" width="30" height="42" rx="6" class="glass"/>' +
      '<path d="M10 34 H40 M10 52 H40 M25 22 V64" stroke="#3A2A1A" stroke-width="1.6" opacity=".55"/>' +
      '<rect x="10" y="22" width="30" height="42" rx="6" fill="none" stroke="url(#ka-metal)" stroke-width="3"/>' +
      '<path d="M8 64 H42 L37 72 H13 Z" fill="url(#ka-metal)"/><rect x="23" y="72" width="4" height="20" fill="#3A2A1A"/>' +
      '<text x="25" y="50" text-anchor="middle" class="t">' + L + '</text></svg>';
  };
  A.fish = function () {
    return '<svg viewBox="0 0 130 74" class="art"><path d="M100 37 L128 14 Q122 37 128 60 Z" fill="#F07B22"/><path d="M58 8 Q72 0 84 10 L70 16 Z" fill="#F07B22"/>' +
      '<ellipse cx="62" cy="37" rx="48" ry="28" fill="url(#ka-fish)"/><ellipse cx="62" cy="37" rx="48" ry="28" fill="url(#ka-shade)"/>' +
      '<path d="M78 24 q6 13 0 26 M88 26 q5 11 0 22" fill="none" stroke="#E0751E" stroke-width="2" opacity=".6"/>' +
      '<ellipse cx="44" cy="22" rx="14" ry="5" fill="url(#ka-hl)"/><circle cx="24" cy="31" r="6" fill="#fff"/><circle cx="22.5" cy="31" r="3.2" fill="#1B1B2B"/>' +
      '<path d="M50 56 Q60 70 70 60" fill="#F07B22"/></svg>';
  };
  A.drum = function () {
    var cords = ''; for (var i = 0; i < 9; i++) { var x = 24 + i * 9; cords += '<path d="M' + x + ' 24 L' + (x < 60 ? x + 14 : x - 14) + ' 75 L' + x + ' 126" fill="none" stroke="#F3E2C0" stroke-width="1.4" opacity=".8"/>'; }
    return '<svg viewBox="0 0 120 150" class="art"><ellipse cx="60" cy="146" rx="44" ry="4" fill="rgba(59,46,30,.25)"/>' +
      '<path d="M18 24 Q60 30 102 24 L74 75 L102 126 Q60 132 18 126 L46 75 Z" fill="url(#ka-woodside)"/>' + cords +
      '<ellipse cx="60" cy="126" rx="42" ry="9" fill="url(#ka-wood)"/><ellipse cx="60" cy="24" rx="42" ry="10" fill="#7A4A22"/>' +
      '<ellipse cx="60" cy="23" rx="38" ry="8" fill="url(#ka-leather)"/><path d="M40 75 H80" stroke="#5B3416" stroke-width="4"/></svg>';
  };
  A.star = function () {
    return '<svg viewBox="0 0 100 100" class="art"><circle cx="50" cy="52" r="48" class="sglow" fill="url(#ka-glow)"/>' +
      '<path class="sbody" d="M50 6 L62 38 L96 38 L68 58 L79 92 L50 71 L21 92 L32 58 L4 38 L38 38 Z" stroke="#fff" stroke-width="2" stroke-opacity=".5"/>' +
      '<path d="M50 14 L57 36 L42 36 Z" fill="#fff" opacity=".45"/></svg>';
  };
  A.canoe = function (w) {
    return '<svg viewBox="0 0 200 64" class="art"><ellipse cx="100" cy="58" rx="90" ry="5" fill="rgba(0,40,80,.25)"/>' +
      '<path d="M4 18 Q100 30 196 18 Q186 54 100 56 Q14 54 4 18 Z" fill="url(#ka-wood)"/>' +
      '<path d="M10 20 Q100 31 190 20 Q100 25 10 20 Z" fill="#4A2A12"/><path d="M8 18 Q100 30 192 18" fill="none" stroke="#E2AA6A" stroke-width="2.4"/>' +
      '<text x="100" y="46" text-anchor="middle" class="t">' + w + '</text></svg>';
  };
  A.pot = function (L) {
    return '<svg viewBox="0 0 80 90" class="art"><ellipse cx="40" cy="86" rx="26" ry="4" fill="rgba(59,46,30,.25)"/>' +
      '<path d="M26 10 H54 Q52 20 60 26 Q76 40 70 62 Q64 84 40 84 Q16 84 10 62 Q4 40 20 26 Q28 20 26 10 Z" fill="url(#ka-clay)"/>' +
      '<ellipse cx="40" cy="10" rx="15" ry="4" fill="#7E3A16"/><ellipse cx="40" cy="9" rx="12" ry="2.6" fill="#3E1A08"/>' +
      '<path d="M14 40 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5" fill="none" stroke="#FFE3C4" stroke-width="2" opacity=".8"/>' +
      '<ellipse cx="27" cy="38" rx="6" ry="13" fill="url(#ka-hl)" opacity=".7"/>' +
      '<text x="40" y="66" text-anchor="middle" class="t">' + L + '</text></svg>';
  };
  A.awning = function () {
    var s = ''; for (var i = 0; i < 10; i++) s += '<path d="M' + (i * 40) + ' 0 H' + (i * 40 + 40) + ' V34 Q' + (i * 40 + 20) + ' 48 ' + (i * 40) + ' 34 Z" fill="' + (i % 2 ? '#FFF3D6' : '#E63946') + '"/>';
    return '<svg viewBox="0 0 400 48" preserveAspectRatio="none" class="awn">' + s + '<rect width="400" height="6" fill="#8B5A2B"/></svg>';
  };
  /* the scenes behind each game: drawn once, never redrawn */
  var huts = function (fill, y) { var s = ''; [[8, 20], [20, 15], [64, 17], [79, 22], [93, 14]].forEach(function (p) { s += '<path d="M' + (p[0] - p[1] / 4) + ' ' + y + ' A' + (p[1] / 4) + ' ' + (p[1] / 3) + ' 0 0 1 ' + (p[0] + p[1] / 4) + ' ' + y + ' Z" fill="' + fill + '"/>'; }); return s; };
  A.scene = {
    sky: '<svg class="scene" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect width="100" height="62.5" fill="url(#ka-day)"/><g opacity=".22" fill="#FFF6C2"><path d="M84 12 L40 62.5 H52 Z"/><path d="M84 12 L64 62.5 H72 Z"/><path d="M84 12 L2 40 V48 Z"/></g><circle cx="84" cy="12" r="6" fill="#FFE58A"/><circle cx="84" cy="12" r="10" fill="url(#ka-glow)"/>' +
      '<g fill="#fff" opacity=".9"><ellipse cx="18" cy="14" rx="9" ry="3"/><ellipse cx="24" cy="12" rx="6" ry="3.4"/><ellipse cx="56" cy="22" rx="10" ry="2.6"/><ellipse cx="62" cy="20.5" rx="5" ry="3"/></g>' +
      '<path d="M0 56 Q20 50 40 55 T80 54 T100 55 V62.5 H0 Z" fill="#E7C98E"/>' + huts('#C9955A', 57) + '</svg>',
    night: '<svg class="scene" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect width="100" height="62.5" fill="url(#ka-night)"/><circle cx="86" cy="11" r="5" fill="url(#ka-moon)"/>' +
      '<g fill="#fff">' + [[8, 6], [20, 14], [33, 5], [47, 12], [60, 6], [71, 16], [14, 24], [93, 22], [40, 22]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r=".35"/>'; }).join('') + '</g>' +
      '<path d="M0 58 Q30 54 60 57 T100 56 V62.5 H0 Z" fill="#1E1630"/>' + huts('#241A38', 58) + '</svg>',
    river: '<svg class="scene" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect width="100" height="62.5" fill="url(#ka-day)"/><path d="M0 14 Q50 10 100 14 V62.5 H0 Z" fill="url(#ka-water)"/>' +
      '<g class="ripples" stroke="#fff" stroke-opacity=".35" stroke-width=".5" fill="none"><path d="M-20 26 q5 -2 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/><path d="M-25 40 q5 -2 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/><path d="M-18 52 q5 -2 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/></g>' +
      '<g class="glints" fill="#fff">' + [[20, 20], [44, 30], [70, 24], [86, 44], [30, 48], [60, 54]].map(function (p, i) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="1.4" ry=".35" style="animation-delay:-' + i * .7 + 's"/>'; }).join('') + '</g>' +
      '<g stroke="#3E7E2C" stroke-width=".8"><path d="M3 62 V48 M5 62 V44 M7 62 V50 M95 62 V46 M97 62 V42 M99 62 V49"/></g><path d="M0 62.5 V58 Q10 55 20 58 T40 58 V62.5 Z" fill="#5E9E3C" opacity=".85"/></svg>',
    market: '<svg class="scene" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect width="100" height="62.5" fill="#F8E2B4"/><rect y="46" width="100" height="16.5" fill="#E2C48C"/>' + huts('#E7C68F', 46) + '</svg>',
    drum: '<svg class="scene" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect width="100" height="62.5" fill="#F3D6A4"/><rect y="40" width="100" height="22.5" fill="#E2B87A"/><path d="M0 40 H100" stroke="#C9955A" stroke-width=".6"/>' +
      '<path d="M8 40 V22 l3 -4 l3 4 V40 M86 40 V20 l3 -4 l3 4 V40" fill="#E9C48A" stroke="#C9955A" stroke-width=".4"/></svg>',
    mud: '<svg class="scene" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect width="100" height="62.5" fill="url(#ka-day)"/><path d="M0 50 Q50 46 100 50 V62.5 H0 Z" fill="#E2B87A"/><circle cx="12" cy="10" r="4" fill="#FFE58A"/></svg>',
    potter: '<svg class="scene" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect width="100" height="62.5" fill="#F7D9B8"/><ellipse cx="50" cy="56" rx="46" ry="6" fill="#D9A066" opacity=".6"/></svg>'
  };
  A.dome = function () { return '<svg viewBox="0 0 100 70" class="art"><ellipse cx="50" cy="66" rx="46" ry="4" fill="rgba(59,46,30,.25)"/><path d="M8 64 A42 52 0 0 1 92 64 Z" fill="url(#ka-mud)"/><path d="M14 46 H86 M10 56 H90 M22 34 H78" stroke="#7A4A22" stroke-width="1" opacity=".5"/><path d="M42 64 V52 a8 8 0 0 1 16 0 V64 Z" fill="#2B1A0C"/><rect x="47" y="6" width="6" height="8" rx="2" fill="#8B5A2B"/></svg>'; };
  window.KART = A;
  [].forEach.call(document.querySelectorAll('[data-art]'), function (el) { var p = el.dataset.art.split(':'); if (A[p[0]]) el.innerHTML = A[p[0]](p[1]); });
})();
/* Kratu game art, round two: a detailed swimming fish with a tagged thread, a kalangu that faces you, photo scenes. */
(function () {
  var D = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="kb-fish" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3F5A3A"/><stop offset=".35" stop-color="#7E9472"/><stop offset=".62" stop-color="#C9D2B6"/><stop offset="1" stop-color="#F1F2E4"/></linearGradient>' +
    '<linearGradient id="kb-fin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E7752" stop-opacity=".95"/><stop offset="1" stop-color="#A3B38E" stop-opacity=".7"/></linearGradient>' +
    '<linearGradient id="kb-tail" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#6E8662"/><stop offset="1" stop-color="#B9C5A4" stop-opacity=".75"/></linearGradient>' +
    '<pattern id="kb-scales" width="10" height="12" patternUnits="userSpaceOnUse"><path d="M0 6 Q5 0 10 6 M-5 12 Q0 6 5 12 M5 12 Q10 6 15 12" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width=".8"/><path d="M0 6.8 Q5 1.2 10 6.8" fill="none" stroke="#1E2E1A" stroke-opacity=".1" stroke-width=".6"/></pattern>' +
    '<clipPath id="kb-body"><path d="M58 55 C72 18 150 10 198 44 C210 52 210 60 198 67 C150 100 72 92 58 55 Z"/></clipPath>' +
    '<radialGradient id="kb-eye" cx=".4" cy=".4" r=".6"><stop offset="0" stop-color="#F7D36B"/><stop offset=".7" stop-color="#C8891E"/><stop offset="1" stop-color="#6B4410"/></radialGradient>' +
    '<linearGradient id="kb-tag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF4"/><stop offset="1" stop-color="#EDE2C4"/></linearGradient>' +
    '<linearGradient id="kb-under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3FA7B8" stop-opacity=".55"/><stop offset=".5" stop-color="#1D6F86" stop-opacity=".82"/><stop offset="1" stop-color="#0E3E52" stop-opacity=".95"/></linearGradient>' +
    '<linearGradient id="kb-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9FBFF" stop-opacity=".45"/><stop offset="1" stop-color="#E9FBFF" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="kb-skin" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#FFF8E6"/><stop offset=".7" stop-color="#EBD3A2"/><stop offset="1" stop-color="#B98F55"/></radialGradient>' +
    '<linearGradient id="kb-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D59A5E"/><stop offset=".4" stop-color="#A3612C"/><stop offset="1" stop-color="#5E3414"/></linearGradient>' +
    '<clipPath id="kb-head"><ellipse cx="62" cy="80" rx="40" ry="52"/></clipPath>' +
    '</defs></svg>';
  document.body.insertAdjacentHTML('afterbegin', D);
  var A = window.KART;

  /* a tilapia, head to the right: body, scales, bars, fins, gill, eye; the tail beats; a thread runs from the tail to a tag with the photo */
  A.fish3 = function (photo) {
    var bars = ''; for (var i = 0; i < 6; i++) bars += '<rect x="' + (78 + i * 18) + '" y="0" width="8" height="110" fill="#22341E" opacity=".13"/>';
    return '<svg viewBox="-122 0 334 110" class="art fish3svg">' +
      '<g class="tagg"><path d="M14 56 C-6 60 -20 50 -36 52" fill="none" stroke="#F4EBD0" stroke-width="1.6"/>' +
        '<g transform="rotate(-6 -40 52)"><rect x="-120" y="6" width="94" height="98" rx="10" fill="url(#kb-tag)"/>' +
        // the photo fills the tag edge to edge (Sani 2026-10-25: no white space); the rim and the thread's hole sit on top
        '<image href="' + photo + '" x="-120" y="6" width="94" height="98" preserveAspectRatio="xMidYMid slice" clip-path="inset(0 round 10px)"/>' +
        '<rect x="-120" y="6" width="94" height="98" rx="10" fill="none" stroke="#C9B88F" stroke-width="1.4"/>' +
        '<circle cx="-32" cy="52" r="3" fill="#fff" stroke="#C9B88F"/></g></g>' +
      '<g class="ftail"><path d="M60 55 L14 22 Q24 55 14 88 Z" fill="url(#kb-tail)"/><path d="M58 55 L20 28 M58 55 L18 42 M58 55 L17 55 M58 55 L18 68 M58 55 L20 82" stroke="#4F6646" stroke-width=".8" opacity=".6"/></g>' +
      '<path class="dfin" d="M92 24 C110 6 150 4 176 26 L160 30 C140 22 112 22 96 30 Z" fill="url(#kb-fin)"/>' +
      '<path d="M98 26 L104 10 M110 24 L116 7 M122 22 L128 6 M134 22 L140 7 M146 23 L152 9 M158 25 L164 14" stroke="#3F5A3A" stroke-width="1" opacity=".55"/>' +
      '<path d="M110 84 C122 102 146 102 158 86 Z" fill="url(#kb-fin)"/>' +
      '<path d="M58 55 C72 18 150 10 198 44 C210 52 210 60 198 67 C150 100 72 92 58 55 Z" fill="url(#kb-fish)"/>' +
      '<g clip-path="url(#kb-body)">' + bars + '<rect x="50" y="0" width="160" height="110" fill="url(#kb-scales)"/>' +
        '<path d="M64 62 C100 70 160 70 204 58" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>' +
        '<ellipse cx="128" cy="34" rx="46" ry="8" fill="#fff" opacity=".22"/></g>' +
      '<path d="M170 32 C160 48 160 66 172 80" fill="none" stroke="#2E4229" stroke-width="2" opacity=".55"/>' +
      '<g class="pfin"><path d="M160 64 C150 70 140 80 136 90 C150 86 160 78 166 70 Z" fill="url(#kb-fin)" opacity=".9"/></g>' +
      '<path d="M200 60 Q206 62 202 64" stroke="#2E2A1E" stroke-width="1.6" fill="none"/>' +
      '<circle cx="186" cy="47" r="7.5" fill="#F6F4E8"/><circle cx="186" cy="47" r="5.6" fill="url(#kb-eye)"/><circle cx="187" cy="47" r="2.8" fill="#121212"/><circle cx="184.5" cy="44.6" r="1.4" fill="#fff"/>' +
      '</svg>';
  };
  /* the kalangu turned to face you: the near skin carries the picture, the body narrows to the far head, the cords run between */
  A.drum2 = function () {
    var cords = ''; for (var i = 0; i < 9; i++) { var t = -0.8 + i * 0.2;
      cords += '<path d="M' + (70 + Math.abs(t) * 8) + ' ' + (80 + t * 60) + ' L112 ' + (80 + t * 9) + ' L' + (150 - Math.abs(t) * 4) + ' ' + (80 + t * 34) + '" fill="none" stroke="#F2E2BE" stroke-width="1" opacity=".45"/>'; }
    return '<svg viewBox="0 0 180 160" class="art drum2svg"><ellipse cx="96" cy="150" rx="70" ry="7" fill="rgba(30,18,6,.35)"/>' +
      '<path d="M62 28 C92 40 104 64 112 72 L112 88 C104 96 92 120 62 132 Z" fill="url(#kb-body)"/>' +
      '<path d="M112 72 C124 62 138 50 152 48 L152 112 C138 110 124 98 112 88 Z" fill="url(#kb-body)"/>' +
      '<ellipse cx="152" cy="80" rx="12" ry="32" fill="#7A4A22"/><ellipse cx="153" cy="80" rx="9" ry="28" fill="url(#kb-skin)" opacity=".8"/>' +
      cords + '<rect x="106" y="70" width="12" height="20" rx="3" fill="#5B3416"/>' +
      '<ellipse cx="62" cy="80" rx="44" ry="56" fill="#6B3E1C"/><ellipse class="dskin" cx="62" cy="80" rx="40" ry="52" fill="url(#kb-skin)"/>' +
      '<ellipse cx="62" cy="80" rx="40" ry="52" fill="none" stroke="#3E2410" stroke-width="2.5" stroke-dasharray="2 5"/>' +
      '<g class="ring"><ellipse cx="62" cy="80" rx="40" ry="52" fill="none" stroke="#FFD54A" stroke-width="3"/></g>' +
      
      '</svg>';
  };
  /* photo scenes, softly out of focus, so the game sits in front of a real place */
  A.photo = function (src, extra) { return '<div class="scene photo" style="background-image:url(' + src + ')">' + (extra || '') + '</div>'; };
  A.underwater = '<svg class="uw" viewBox="0 0 100 62.5" preserveAspectRatio="none"><rect y="16" width="100" height="46.5" fill="url(#kb-under)"/>' +
    '<g class="rays"><path d="M10 16 L4 62.5 H16 Z M34 16 L30 62.5 H42 Z M58 16 L56 62.5 H66 Z M82 16 L80 62.5 H90 Z" fill="url(#kb-ray)"/></g>' +
    '<path d="M0 16 Q12 14.6 25 16 T50 16 T75 16 T100 16" stroke="#E9FBFF" stroke-opacity=".7" stroke-width=".6" fill="none"/>' +
    '<path d="M0 62.5 V57 Q20 54 40 57 T80 56 T100 57 V62.5 Z" fill="#C8B07A"/><g fill="#8E7B55">' + [[8, 59], [22, 60.5], [47, 59.5], [70, 60], [91, 59]].map(function (p) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="1.6" ry=".9"/>'; }).join('') + '</g>' +
    '<g stroke="#3E7E2C" stroke-width=".7" fill="none" class="weeds"><path d="M4 62 Q2 52 5 44 M7 62 Q9 50 6 42 M94 62 Q92 50 95 40 M97 62 Q99 52 96 46"/></g>' +
    '<g fill="#E9FBFF" opacity=".7" class="bub"><circle cx="20" cy="50" r=".6"/><circle cx="21" cy="46" r=".4"/><circle cx="76" cy="52" r=".5"/><circle cx="77" cy="48" r=".35"/></g></svg>';
  [].forEach.call(document.querySelectorAll('[data-art]'), function (el) { var p = el.dataset.art.split(':'); if (p[0] === 'fish' && A.fish3) el.innerHTML = A.fish3(''); if (p[0] === 'drum' && A.drum2) el.innerHTML = A.drum2(); });
})();
/* Kratu game art, round three: more detail where the eye lands. Still gradients and shapes only, no filters. */
(function () {
  var D = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<pattern id="kc-grain" width="40" height="6" patternUnits="userSpaceOnUse"><path d="M0 2 Q10 0 20 2 T40 2" fill="none" stroke="#3E2410" stroke-opacity=".28" stroke-width=".7"/><path d="M0 5 Q12 3.6 24 5 T40 5" fill="none" stroke="#F0C48A" stroke-opacity=".2" stroke-width=".6"/></pattern>' +
    '<linearGradient id="kc-hull" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9773E"/><stop offset=".45" stop-color="#8A4E22"/><stop offset="1" stop-color="#4E2A0E"/></linearGradient>' +
    '<linearGradient id="kc-side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE2B8" stop-opacity=".2"/><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".36"/></linearGradient>' +
    '<linearGradient id="kc-sub" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E6E92" stop-opacity=".55"/><stop offset="1" stop-color="#1C5A82" stop-opacity=".95"/></linearGradient>' +
    '<linearGradient id="kc-inner" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A1E08"/><stop offset="1" stop-color="#6B3E1C"/></linearGradient>' +
    '<linearGradient id="kc-refl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4E2A0E" stop-opacity=".45"/><stop offset="1" stop-color="#4E2A0E" stop-opacity="0"/></linearGradient>' +
    '<pattern id="kc-speck" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="2" r=".55" fill="#5E2A0C" opacity=".35"/><circle cx="5" cy="5.4" r=".45" fill="#FFD9B8" opacity=".35"/></pattern>' +
    '<radialGradient id="kc-flame" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#FFFDF0"/><stop offset=".45" stop-color="#FFD54A"/><stop offset="1" stop-color="#F07B22"/></radialGradient>' +
    '<linearGradient id="kc-brass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6E4A12"/><stop offset=".3" stop-color="#E9C46A"/><stop offset=".55" stop-color="#FFF0B8"/><stop offset=".75" stop-color="#C9962E"/><stop offset="1" stop-color="#5E3E0E"/></linearGradient>' +
    '<radialGradient id="kc-gourd" cx=".4" cy=".25" r=".9"><stop offset="0" stop-color="#F6D58E"/><stop offset=".55" stop-color="#D9A04E"/><stop offset="1" stop-color="#8A5A1E"/></radialGradient>' +
    '<pattern id="kc-crack" width="22" height="14" patternUnits="userSpaceOnUse"><path d="M2 3 l5 2 l3 -1 M12 9 l4 2 l4 -2 M6 11 l2 2" fill="none" stroke="#5E3416" stroke-opacity=".35" stroke-width=".6"/><circle cx="17" cy="4" r=".7" fill="#F2D3A0" opacity=".5"/></pattern>' +
    '</defs></svg>';
  document.body.insertAdjacentHTML('afterbegin', D);
  var A = window.KART;
  /* a dugout canoe seen a little from above (r5 realism): the far gunwale and the dark hollow inside show, the near side
     carries the grain and the light from the upper left, the hull sits IN the water (darker below the waterline, a soft
     contact shadow, a broken reflection). The word is on a weathered plank lashed across it. Gradients live in the
     shared defs above, so five canoes do not repeat them; nothing in it is animated. */
  A.canoe = function (w) {
    const n = w.length, P = n <= 7 ? 132 : Math.min(184, 132 + (n - 7) * 8), sx = +(P / 132).toFixed(3), fs = Math.min(22, Math.floor(P / (n * 0.62)));
    return '<svg viewBox="0 0 220 90" class="art canoe3">' +
      '<path d="M14 50 Q110 62 206 50 Q196 66 110 72 Q24 66 14 50 Z M30 63 h40 v1.2 h-40 Z M128 66 h44 v1.2 h-44 Z" fill="url(#kc-refl)" fill-rule="evenodd"/>' +
      '<path d="M4 47 Q110 60 216 47 Q204 54 110 57 Q16 54 4 47 Z" fill="#163E5A" opacity=".35"/>' +
      '<path d="M3 25 Q12 17 24 24 Q110 15 196 24 Q208 17 217 25 Q213 39 201 47 Q110 59 19 47 Q7 39 3 25 Z" fill="url(#kc-hull)"/>' +
      '<path d="M3 25 Q12 17 24 24 Q110 15 196 24 Q208 17 217 25 Q213 39 201 47 Q110 59 19 47 Q7 39 3 25 Z" fill="url(#kc-grain)"/>' +
      '<path d="M3 25 Q12 17 24 24 Q110 15 196 24 Q208 17 217 25 Q213 39 201 47 Q110 59 19 47 Q7 39 3 25 Z" fill="url(#kc-side)"/>' +
      '<path d="M22 25.5 Q110 16.5 198 25.5 Q110 33 22 25.5 Z" fill="url(#kc-inner)"/><path d="M24 24.6 Q110 16.4 196 24.6 Q110 19.6 24 24.6 Z" fill="#B47A44" opacity=".75"/>' +
      '<path d="M30 23.2 v4.6 M37 22.4 v5.6 M183 22.4 v5.6 M190 23.2 v4.6" stroke="#5A3214" stroke-width="1.6" opacity=".8"/>' +
      '<path d="M3 25 Q12 17 24 24 Q110 15 196 24 Q208 17 217 25 M22 25.5 Q110 33 198 25.5" fill="none" stroke="#E6B47A" stroke-width="1.5" stroke-linecap="round"/>' +
      '<path d="M10 36 Q60 44 120 44.6" stroke="#F2C890" stroke-width="1.4" opacity=".4" fill="none"/>' +
      '<path d="M150 12 L182 44" stroke="#8A5428" stroke-width="2.8" stroke-linecap="round"/><path d="M178 40 Q190 46 192 56 Q182 54 176 46 Z" fill="#9C5F2E"/>' +
      '<path d="M8 43 Q110 56 212 43 Q207 46 200 48 Q110 61 20 48 Q13 46 8 43 Z" fill="url(#kc-sub)"/><path d="M6 43.4 Q110 56.6 214 43.4" stroke="#E9FBFF" stroke-width="1.2" fill="none" opacity=".7"/>' +
      '<path d="M-20 58 Q-8 54 4 57 M-34 62 Q-20 58 -6 61 M212 55 Q222 52 232 55" fill="none" stroke="#E9FBFF" stroke-opacity=".45" stroke-width="1"/>' +
      '<g' + (sx > 1 ? ' transform="translate(110 0) scale(' + sx + ' 1) translate(-110 0)"' : '') + '>' +
      '<rect x="44" y="18" width="132" height="34" rx="3" fill="#F4E3BE" stroke="#6E4220" stroke-width="1.6"/>' +
      '<path d="M53 15.6 q-1.6 20 -.4 40 M167 15.6 q1.6 20 .4 40" stroke="#B8955C" stroke-width="2.4" fill="none" stroke-dasharray="1.8 1"/>' +
      '<path d="M46 23 Q90 21 174 24 M46 40 Q100 42 174 39 M60 30 q14 -2 26 1 M136 47 q12 1 22 -1" fill="none" stroke="#B89466" stroke-width=".7" opacity=".55"/>' +
      '<path d="M45 49 H175 V50.4 Q174 51 172 51 H48 Q45.6 51 45 50 Z M48 33.6 h3 v3 h-3 Z M169 33.6 h3 v3 h-3 Z" fill="#5A3416" opacity=".55"/>' + '</g>' +
      // a long word or a two-word name (a lesson's own, Sani 2026-11-02) gets a longer plank first (up to most of the
      // canoe), then smaller letters held inside it by textLength: it never runs off, and stays readable on a 7-inch screen
      '<text x="110" y="46.5" text-anchor="middle" class="tw"' + (n > 6 ? ' style="font-size:' + fs + 'px!important;letter-spacing:1px!important"' + (n > 9 ? ' textLength="' + Math.round(P - 10) + '" lengthAdjust="spacingAndGlyphs"' : '') : '') + '>' + w + '</text></svg>';
  };
  /* a clay pot: thick rim, incised band, speckled fired clay, a soft shine, the letter in white chalk */
  A.pot = function (L) {
    return '<svg viewBox="0 0 80 92" class="art">' +
      '<ellipse cx="40" cy="88" rx="28" ry="4" fill="rgba(40,20,6,.35)"/>' +
      '<path d="M26 12 H54 Q52 22 60 28 Q77 42 71 64 Q65 86 40 86 Q15 86 9 64 Q3 42 20 28 Q28 22 26 12 Z" fill="url(#ka-clay)"/>' +
      '<path d="M26 12 H54 Q52 22 60 28 Q77 42 71 64 Q65 86 40 86 Q15 86 9 64 Q3 42 20 28 Q28 22 26 12 Z" fill="url(#kc-speck)"/>' +
      '<ellipse cx="40" cy="12" rx="17" ry="5" fill="#8E451C"/><ellipse cx="40" cy="11" rx="14" ry="3.4" fill="#3E1A08"/><path d="M23 12 Q40 18 57 12" fill="none" stroke="#F0A774" stroke-width="1.2" opacity=".7"/>' +
      '<path d="M12 36 Q40 44 68 36" fill="none" stroke="#6E2E0E" stroke-width="1.4" opacity=".6"/><path d="M12 42 Q40 50 68 42" fill="none" stroke="#6E2E0E" stroke-width="1.4" opacity=".6"/>' +
      '<path d="M16 39 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3 l4 -3" fill="none" stroke="#FFE3C4" stroke-width="1.2" opacity=".75"/>' +
      '<ellipse cx="26" cy="54" rx="5" ry="14" fill="url(#ka-hl)" opacity=".55"/><path d="M60 50 Q66 64 58 78" fill="none" stroke="#3E1A08" stroke-width="3" opacity=".25"/>' +
      '<text x="40" y="72" text-anchor="middle" class="tc">' + L + '</text></svg>';
  };
  /* a brass lantern: rivets, cage bars, a flame inside that flickers once it is lit */
  A.lantern = function (L) {
    return '<svg viewBox="0 0 54 100" class="art">' +
      '<path d="M27 0 V9" stroke="#2A1E12" stroke-width="2"/><circle cx="27" cy="11" r="3.4" fill="none" stroke="url(#kc-brass)" stroke-width="2.2"/>' +
      '<path d="M14 15 H40 L46 25 H8 Z" fill="url(#kc-brass)"/><path d="M18 15 L27 7 L36 15 Z" fill="url(#kc-brass)"/>' +
      '<g class="lglow"><circle cx="27" cy="50" r="34" fill="url(#ka-glow)"/></g>' +
      '<rect x="11" y="25" width="32" height="48" rx="6" class="glass"/>' +
      '<g class="flame"><path d="M27 46 C21 54 23 62 27 64 C31 62 33 54 27 46 Z" fill="url(#kc-flame)"/><rect x="25.5" y="63" width="3" height="5" fill="#3A2A1A"/></g>' +
      '<path d="M11 41 H43 M11 57 H43 M19 25 V73 M35 25 V73" stroke="#2A1E12" stroke-width="1.4" opacity=".5"/>' +
      '<rect x="11" y="25" width="32" height="48" rx="6" fill="none" stroke="url(#kc-brass)" stroke-width="3"/>' +
      '<g fill="#FFF0B8">' + [[14, 28], [40, 28], [14, 70], [40, 70]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.2"/>'; }).join('') + '</g>' +
      '<path d="M8 73 H46 L40 82 H14 Z" fill="url(#kc-brass)"/><rect x="25" y="82" width="4" height="18" fill="#2A1E12"/>' +
      '<text x="27" y="40" text-anchor="middle" class="t">' + L + '</text></svg>';
  };
  /* a star with four light spikes once it is lit */
  A.star = function () {
    return '<svg viewBox="0 0 100 100" class="art"><circle cx="50" cy="52" r="48" class="sglow" fill="url(#ka-glow)"/>' +
      '<g class="flare" stroke="#FFF8D2" stroke-linecap="round"><path d="M50 -6 V20 M50 84 V106 M-6 52 H18 M82 52 H106" stroke-width="2.4"/></g>' +
      '<path class="sbody" d="M50 6 L62 38 L96 38 L68 58 L79 92 L50 71 L21 92 L32 58 L4 38 L38 38 Z" stroke="#fff" stroke-width="2" stroke-opacity=".6"/>' +
      '<path d="M50 14 L57 36 L42 36 Z M30 42 L40 42 L36 50 Z" fill="#fff" opacity=".45"/></svg>';
  };
  /* a calabash bowl to sell the goods from */
  A.bowl = function (img) {
    return '<svg viewBox="0 -34 100 104" class="art"><ellipse cx="50" cy="64" rx="44" ry="5" fill="rgba(40,20,6,.35)"/>' +
      '<path d="M6 30 Q10 64 50 64 Q90 64 94 30 Z" fill="url(#kc-gourd)"/><path d="M14 44 Q50 54 86 44" fill="none" stroke="#7A4A12" stroke-width="1.4" opacity=".6"/>' +
      '<path d="M18 50 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4 l5 4 l5 -4" fill="none" stroke="#5E3A0E" stroke-width="1" opacity=".5"/>' +
      '<ellipse cx="50" cy="30" rx="44" ry="11" fill="#8A5A1E"/><ellipse cx="50" cy="30" rx="40" ry="9" fill="#3E2408"/>' +
      '<rect x="9" y="-33" width="82" height="66" rx="12" fill="#fff" stroke="#E6D6AE" stroke-width="1.5"/>' +
      '<image href="' + img + '" x="12" y="-30" width="76" height="60" preserveAspectRatio="xMidYMid meet"/></svg>';   // the picture big, on a white card standing in the bowl (Sani 2026-10-15)
  };
})();
/* the river for Kwale-kwale, painted to match the canoes: sky, far bank with acacias and huts, a wide river with reflections, reeds in front */
(function () {
  var A = window.KART;
  var acacia = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 0 L-.6 -9 M0 -5 L3 -8 M0 -4 L-3 -7" stroke="#4A3A22" stroke-width="1" fill="none"/><ellipse cx="0" cy="-10" rx="9" ry="2.6" fill="#4F6B35"/><ellipse cx="-2" cy="-11" rx="6" ry="2" fill="#5E7E40"/></g>'; };
  var hut = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-3" y="-4" width="6" height="4" fill="#C9955A"/><path d="M-4.4 -4 L0 -8.4 L4.4 -4 Z" fill="#B88A3E"/><rect x="-.7" y="-2.4" width="1.4" height="2.4" fill="#5B3416"/></g>'; };
  var ripples = ''; for (var i = 0; i < 9; i++) { var y = 58 + i * 4.6; ripples += '<path d="M' + (-20 + (i % 3) * 7) + ' ' + y + ' q4 -1.2 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0" stroke="#fff" stroke-opacity="' + (.18 + i * .03) + '" stroke-width=".45" fill="none"/>'; }
  A.scene.riverart = '<svg class="scene" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">' +
    '<defs><linearGradient id="kr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ACFF0"/><stop offset=".8" stop-color="#E9F6F8"/><stop offset="1" stop-color="#FBEFD6"/></linearGradient>' +
    '<linearGradient id="kr-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD6EE"/><stop offset=".35" stop-color="#3E9FCB"/><stop offset="1" stop-color="#17608E"/></linearGradient>' +
    '<linearGradient id="kr-bank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9CF96"/><stop offset="1" stop-color="#C79F5E"/></linearGradient></defs>' +
    '<rect width="160" height="100" fill="url(#kr-sky)"/><circle cx="132" cy="14" r="7" fill="#FFF4C2"/><circle cx="132" cy="14" r="14" fill="url(#ka-glow)"/>' +
    '<g fill="#fff" opacity=".85"><ellipse cx="30" cy="14" rx="12" ry="3"/><ellipse cx="38" cy="12" rx="7" ry="3.4"/><ellipse cx="86" cy="20" rx="13" ry="2.6"/><ellipse cx="94" cy="18.5" rx="6" ry="2.8"/></g>' +
    '<path d="M0 40 Q30 33 60 38 T120 36 T160 38 V48 H0 Z" fill="#A9BC86" opacity=".8"/>' +
    '<path d="M0 44 Q40 40 80 43 T160 42 V52 H0 Z" fill="#7FA35A"/>' +
    acacia(14, 45, 1.1) + acacia(46, 43, .8) + acacia(104, 42, 1) + acacia(146, 44, .9) + hut(70, 45, 1) + hut(78, 46, .8) + hut(122, 45, .9) +
    '<path d="M0 50 Q40 47 80 50 T160 49 V100 H0 Z" fill="url(#kr-water)"/>' +
    '<path d="M0 50 Q40 47 80 50 T160 49 V55 Q80 57 0 55 Z" fill="#4E7A3A" opacity=".35"/>' +
    '<g class="ripples">' + ripples + '</g>' +
    '<g class="glints" fill="#fff">' + [[30, 62], [70, 70], [112, 60], [140, 78], [52, 84], [96, 90]].map(function (p, i) { return '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="2.2" ry=".45" style="animation-delay:-' + i * .6 + 's"/>'; }).join('') + '</g>' +
    '<path d="M0 100 V86 Q14 80 26 88 Q32 92 36 100 Z" fill="url(#kr-bank)"/><path d="M160 100 V84 Q146 80 134 88 Q128 93 126 100 Z" fill="url(#kr-bank)"/>' +
    '<g stroke="#3E6E2C" stroke-width=".9" fill="none" class="weeds"><path d="M4 92 Q2 80 6 70 M8 94 Q10 82 7 72 M12 95 Q12 84 15 76 M150 92 Q152 80 148 70 M154 94 Q152 84 156 74 M146 95 Q145 86 142 78"/></g>' +
    '<g fill="#2E5A22"><ellipse cx="6" cy="70" rx=".9" ry="2.6"/><ellipse cx="148" cy="70" rx=".9" ry="2.6"/></g></svg>';
})();
/* painted scenes for every game, in one style with the river */
(function () {
  var A = window.KART;
  var acacia = function (x, y, s, c) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 0 L-.6 -9 M0 -5 L3 -8 M0 -4 L-3 -7" stroke="' + (c ? '#1E1630' : '#4A3A22') + '" stroke-width="1" fill="none"/><ellipse cx="0" cy="-10" rx="9" ry="2.6" fill="' + (c || '#4F6B35') + '"/><ellipse cx="-2" cy="-11" rx="6" ry="2" fill="' + (c || '#5E7E40') + '"/></g>'; };
  var hut = function (x, y, s, night) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><rect x="-3" y="-4" width="6" height="4" fill="' + (night ? '#2A2040' : '#C9955A') + '"/><path d="M-4.4 -4 L0 -8.4 L4.4 -4 Z" fill="' + (night ? '#231A36' : '#B88A3E') + '"/><rect x="-.7" y="-2.4" width="1.4" height="2.4" fill="' + (night ? '#FFC94A' : '#5B3416') + '"/></g>'; };
  var cloud = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#fff" opacity=".9"><ellipse cx="0" cy="0" rx="12" ry="3"/><ellipse cx="7" cy="-1.6" rx="7" ry="3.4"/><ellipse cx="-5" cy="-1" rx="5" ry="2.6"/></g>'; };
  var dome = function (x, y, s, c) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M-8 0 A8 9 0 0 1 8 0 Z" fill="' + (c || '#C9955A') + '"/><path d="M-1.6 0 V-3.4 a1.6 1.6 0 0 1 3.2 0 V0 Z" fill="#4A2A12"/></g>'; };
  var head = '<svg class="scene" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice">';
  var grads = function (id, a, b, c) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/>' + (c ? '<stop offset=".75" stop-color="' + b + '"/><stop offset="1" stop-color="' + c + '"/>' : '<stop offset="1" stop-color="' + b + '"/>') + '</linearGradient>'; };
  var stars = function () { var s = ''; for (var i = 0; i < 40; i++) { var x = (i * 37.3) % 160, y = (i * 23.7) % 46; s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (i % 5 ? .3 : .55) + '" style="animation-delay:-' + (i % 7) * .4 + 's"/>'; } return '<g class="twinkle" fill="#fff">' + s + '</g>'; };

  A.scene.savanna = head + '<defs>' + grads('ks-sky', '#7EC8EE', '#E4F4F8', '#FBEBC8') + grads('ks-ground', '#E2C48A', '#C99A5B') + '</defs>' +
    '<rect width="160" height="100" fill="url(#ks-sky)"/><circle cx="132" cy="16" r="7" fill="#FFF2B8"/><circle cx="132" cy="16" r="15" fill="url(#ka-glow)"/>' +
    cloud(28, 16, 1) + cloud(76, 24, .8) + cloud(104, 12, .7) +
    '<path d="M0 66 Q30 58 64 64 T130 60 T160 62 V76 H0 Z" fill="#B7C78E" opacity=".7"/>' +
    '<path d="M0 72 Q40 68 80 72 T160 70 V100 H0 Z" fill="url(#ks-ground)"/>' +
    acacia(18, 72, 1.3) + acacia(58, 69, .8) + acacia(118, 70, 1.1) + acacia(148, 72, .9) + hut(86, 71, 1.1) + hut(96, 72, .8) +
    '<g fill="#B9894C" opacity=".6"><ellipse cx="30" cy="90" rx="10" ry="1.2"/><ellipse cx="120" cy="86" rx="14" ry="1.4"/></g>' +
    '<g stroke="#8B7A3A" stroke-width=".6" fill="none"><path d="M6 100 q-1 -6 1 -10 M9 100 q1 -7 -1 -11 M150 100 q1 -6 -1 -10 M154 100 q-1 -7 1 -11"/></g></svg>';

  A.scene.nightvillage = head + '<defs>' + grads('kn-sky', '#0E1230', '#2E2456', '#4A3262') + '</defs>' +
    '<rect width="160" height="100" fill="url(#kn-sky)"/>' + stars() +
    '<g transform="translate(132 16)"><circle r="8" fill="#FFF6D6"/><circle cx="3.6" cy="-2.4" r="7.4" fill="#141838"/></g><circle cx="132" cy="16" r="16" fill="url(#ka-glow)" opacity=".35"/>' +
    '<path d="M0 74 Q40 68 80 72 T160 70 V100 H0 Z" fill="#1A1430"/>' +
    acacia(14, 74, 1.3, '#120E22') + acacia(140, 73, 1.1, '#120E22') + hut(40, 74, 1.3, 1) + hut(62, 73, 1, 1) + hut(104, 74, 1.2, 1) + hut(120, 73, .9, 1) +
    '<path d="M0 86 Q80 82 160 86 V100 H0 Z" fill="#120E22"/></svg>';

  A.scene.courtyard = head + '<defs>' + grads('kc-sky', '#F4A259', '#F9D9A0', '#FBEBC8') + grads('kc-wall', '#E3B47A', '#C98E52') + grads('kc-floor', '#E6C690', '#C9A06A') + '</defs>' +
    '<rect width="160" height="100" fill="url(#kc-sky)"/><circle cx="34" cy="26" r="10" fill="#FFE29A"/><circle cx="34" cy="26" r="20" fill="url(#ka-glow)" opacity=".7"/>' +
    acacia(130, 52, 1.6) +
    '<path d="M0 50 H160 V74 H0 Z" fill="url(#kc-wall)"/>' +
    '<g fill="#E3B47A">' + [6, 30, 54, 78, 102, 126, 150].map(function (x) { return '<path d="M' + x + ' 50 l2 -6 l2 6 Z"/>'; }).join('') + '</g>' +
    '<path d="M66 74 V58 a8 8 0 0 1 16 0 V74 Z" fill="#4A2A12"/><path d="M62 74 V57 a12 12 0 0 1 24 0 V74" fill="none" stroke="#B5763C" stroke-width="1.6"/>' +
    '<g fill="none" stroke="#FFF1D6" stroke-width=".9" opacity=".75"><path d="M10 60 l4 -4 l4 4 l4 -4 l4 4 M118 60 l4 -4 l4 4 l4 -4 l4 4"/><circle cx="40" cy="60" r="3"/><circle cx="104" cy="60" r="3"/></g>' +
    '<path d="M0 74 H160 V100 H0 Z" fill="url(#kc-floor)"/><g fill="#B9894C" opacity=".5"><ellipse cx="40" cy="90" rx="16" ry="1.6"/><ellipse cx="120" cy="84" rx="12" ry="1.2"/></g></svg>';

  A.scene.market = head + '<defs>' + grads('km-sky', '#9DD6F2', '#F2EBD6') + grads('km-ground', '#D9B57E', '#B98A50') + '</defs>' +
    '<rect width="160" height="100" fill="url(#km-sky)"/>' + cloud(40, 12, .8) + cloud(120, 18, .7) +
    (function () { var s = ''; [[10, '#2FAE9E'], [50, '#E63946'], [92, '#EE7043'], [132, '#8A5FBF']].forEach(function (p) { var x = p[0];
      s += '<rect x="' + (x + 2) + '" y="40" width="1.6" height="34" fill="#6B4422"/><rect x="' + (x + 30) + '" y="40" width="1.6" height="34" fill="#6B4422"/>' +
        '<path d="M' + (x - 2) + ' 40 H' + (x + 36) + ' L' + (x + 33) + ' 32 H' + (x + 1) + ' Z" fill="' + p[1] + '"/><path d="M' + (x - 2) + ' 40 H' + (x + 36) + '" stroke="#fff" stroke-opacity=".5"/>' +
        '<rect x="' + x + '" y="60" width="34" height="5" fill="#9C6B3A"/>' +
        '<g><ellipse cx="' + (x + 7) + '" cy="58" rx="5" ry="3" fill="#F1E2B8"/><ellipse cx="' + (x + 17) + '" cy="58" rx="5" ry="3" fill="#E9A23B"/><ellipse cx="' + (x + 27) + '" cy="58" rx="5" ry="3" fill="#B94A2A"/></g>'; }); return s; })() +
    '<path d="M0 74 H160 V100 H0 Z" fill="url(#km-ground)"/>' +
    '<g><ellipse cx="18" cy="84" rx="9" ry="6" fill="#F1E2B8"/><ellipse cx="18" cy="80" rx="8" ry="2.4" fill="#E2CC94"/><ellipse cx="142" cy="86" rx="10" ry="6" fill="#D9A04E"/><ellipse cx="142" cy="82" rx="9" ry="2.6" fill="#B94A2A"/></g></svg>';

  A.scene.potteryard = head + '<defs>' + grads('kp-sky', '#8FD0EE', '#F6EAD0') + grads('kp-ground', '#D9AE73', '#B9884C') + '</defs>' +
    '<rect width="160" height="100" fill="url(#kp-sky)"/>' + cloud(30, 14, .9) + cloud(110, 20, .7) +
    '<path d="M0 54 H160 V72 H0 Z" fill="#D9A574"/><path d="M0 54 H160" stroke="#B5763C" stroke-width=".8"/>' +
    '<g transform="translate(132 72)"><path d="M-14 0 A14 16 0 0 1 14 0 Z" fill="#A9572A"/><path d="M-4 0 V-6 a4 4 0 0 1 8 0 V0 Z" fill="#2B1A0C"/><path d="M-2 -16 q-3 -6 1 -10 q3 -3 0 -8" stroke="#9AA0A6" stroke-width="1.6" fill="none" opacity=".6" class="smoke"/></g>' +
    '<g fill="#C46A35">' + [[18, 70, 1], [28, 71, .8], [38, 70, 1.1]].map(function (p) { return '<g transform="translate(' + p[0] + ' ' + p[1] + ') scale(' + p[2] + ')"><path d="M-3 -9 H3 Q2.6 -7 4.6 -5.6 Q7 -3 6 0 H-6 Q-7 -3 -4.6 -5.6 Q-2.6 -7 -3 -9 Z"/></g>'; }).join('') + '</g>' +
    '<path d="M0 72 H160 V100 H0 Z" fill="url(#kp-ground)"/><ellipse cx="80" cy="92" rx="60" ry="5" fill="#C99A5B" opacity=".55"/></svg>';

  A.scene.underriver = head + '<defs>' + grads('ku-sky', '#8ACFF0', '#E9F6F8') + '</defs>' +
    '<rect width="160" height="30" fill="url(#ku-sky)"/>' + cloud(40, 8, .8) +
    '<path d="M0 20 Q40 14 80 18 T160 17 V28 H0 Z" fill="#7FA35A"/>' + acacia(24, 22, 1) + acacia(120, 21, .9) + hut(70, 22, .9) + '</svg>';
})();

  /* Kalangu, side on: the hourglass drum Laila holds under her arm, its cords, and the bent stick that strikes the right head */
  (function (A) {
    var cords = ''; for (var y = 20; y <= 70; y += 7) cords += '<path d="M14 ' + y + ' Q60 ' + (45 + (y - 45) * .28).toFixed(1) + ' 106 ' + y + '"/>';
    A.talkdrum = function () {
      return '<svg class="tdrum" viewBox="0 0 130 100" aria-hidden="true"><defs>' +
        '<linearGradient id="td-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A4E"/><stop offset=".5" stop-color="#8B5A2B"/><stop offset="1" stop-color="#5A3518"/></linearGradient>' +
        '<radialGradient id="td-skin" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFF6E0"/><stop offset="1" stop-color="#D9BE8A"/></radialGradient></defs>' +
        '<ellipse cx="62" cy="94" rx="50" ry="5" fill="rgba(40,24,10,.25)"/>' +
        '<path d="M12 14 Q60 42 108 14 L108 78 Q60 50 12 78 Z" fill="url(#td-wood)" stroke="#4A2A10" stroke-width="1.5"/>' +
        '<g fill="none" stroke="#F1E2C0" stroke-width="1.6" opacity=".95">' + cords + '</g>' +
        '<path d="M40 38 Q60 50 80 38 L80 54 Q60 42 40 54 Z" fill="#B8322C" opacity=".85"/>' +
        '<ellipse cx="12" cy="46" rx="8" ry="33" fill="url(#td-skin)" stroke="#6B4422" stroke-width="2"/>' +
        '<ellipse class="dskin" cx="108" cy="46" rx="8" ry="33" fill="url(#td-skin)" stroke="#6B4422" stroke-width="2"/>' +
        '<g class="stick"><path d="M126 6 Q118 24 114 40" fill="none" stroke="#5A3518" stroke-width="4" stroke-linecap="round"/><circle cx="114" cy="41" r="3" fill="#5A3518"/></g>' +
        '<path class="strap" d="M14 14 Q30 -6 70 4" fill="none" stroke="#2F6B5E" stroke-width="3" stroke-linecap="round"/>' +
        '</svg>';
    };
    A.minidrum = function () {
      return '<svg viewBox="0 0 40 48" aria-hidden="true"><path class="mb" d="M7 6 Q20 24 33 6 L33 42 Q20 24 7 42 Z"/><ellipse class="mh" cx="20" cy="6" rx="13" ry="4"/><ellipse class="mh" cx="20" cy="42" rx="13" ry="4"/>' +
        '<g class="mc"><path d="M9 9 L20 38 M31 9 L20 38 M14 8 L26 40 M26 8 L14 40"/></g></svg>';
    };
  })(window.KART);
  KART = (window as any).KART; return KART;
}
