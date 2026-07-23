#!/usr/bin/env node
// Merge all stacked `Object.assign(AUDIO, {...});` layers in kratu-lessons.html
// into a single assign (last-wins, identical to runtime), then sync index.html.
const fs = require("fs");
const path = require("path");
const ROOT = path.dirname(__dirname);
const APP = path.join(ROOT, "kratu-lessons.html");
let h = fs.readFileSync(APP, "utf8");

const re = /^  Object\.assign\(AUDIO, (\{.*\})\);$/gm;
let m, merged = {}, spans = [];
while ((m = re.exec(h)) !== null) {
  Object.assign(merged, JSON.parse(m[1]));
  spans.push([m.index, m.index + m[0].length]);
}
if (spans.length <= 1) { console.log("nothing to compact (" + spans.length + " layer)"); process.exit(0); }
const before = h.length;
for (let i = spans.length - 1; i >= 0; i--) {
  const [s, e] = spans[i];
  h = h.slice(0, s) + h.slice(e + (h[e] === "\n" ? 1 : 0));
}
h = h.slice(0, spans[0][0]) + "  Object.assign(AUDIO, " + JSON.stringify(merged) + ");\n" + h.slice(spans[0][0]);
fs.writeFileSync(APP, h);
fs.writeFileSync(path.join(ROOT, "index.html"), h);
// sanity: last script still parses
const scripts = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)];
new Function(scripts[scripts.length - 1][1]);
console.log("compacted " + spans.length + " layers -> 1 (" + Object.keys(merged).length + " keys); " +
  (before / 1048576).toFixed(2) + "MB -> " + (h.length / 1048576).toFixed(2) + "MB; JS OK");
