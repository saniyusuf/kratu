# content/ — the catalogue

The truth about what Kratu says and shows. Hand-edited; everything under `public/assets` is generated from here.

- `lines.json` — every Laila line. `key` (the base, without `_m`/`_f`), `lang` (`ha`/`en`), `voice` (`laila`/`child`),
  `gender` (`pair` = a boy and a girl text, `any` = one text for all, `m`/`f` = only that voice exists), `text` (a string,
  or `{m, f}` and optionally `any`), `en` (the English subtitle), `screens` (where the app says it, from the code scan),
  `said_when` (when, in words), `status` (`live` / `unused` / `pruned`), `recorded` (hash of the text the clip was made from).
- `words.json` — `groups` in display order and `words`: `key`, `groups`, `ha`, `en`, `picture` (`pictures/<key>.webp` or
  `{of: otherKey}` to share one), `ha_clip` / `en_clip` (`true` = own clip `audio/<lang>/word_<key>.ogg`, or `{of: otherKey}`).
- `names.json` — the greeting bank: every name with its gender.
- `pruned.json` — keys removed on the review page; never recorded again.

Commands (from the project root): `npm run content` (generate), `npm run lint:content` (check the chain), `npm run voice`
(record missing or changed lines), `npm run words` (pictures and word clips). `npm run build` runs the first two first.

## Voice tone (Hausa TTS)
What Sani picked by ear on 24 Oct 2026 (Hawan Sallah lines). The recorder is Google's Hausa voice, and it takes its
tone from spelling and punctuation, so these choices change how a line sounds, not just how it reads:
- **A full stop resets the pitch.** A comma can carry the wrong tone into the next clause: "ƙofa za ta zauna a rufe."
  with a full stop (and "kuma" after it, lowercase) fixed a wrong-sounding "a rufe". Try a full stop first when the end
  of a clause sounds off.
- **"baka" / "baki" as one word** reads better than "ba ka" / "ba ki": "Idan baka faɗi daidai ba, …".
- **Don't say "kuskure"** to the child: "Idan ka yi kuskure" sounds like an accusation. "Idan baka faɗi daidai ba" is
  easier to understand.
- **"Sarki zai ɓata rai"** sounded right where "Sarki ba zai ji daɗi ba" did not.
- **Start lines:** "Yanzu, ka/ki danna Laila mu fara." sounded better than "Idan ka shirya, ka danna Laila mu fara."
- **When a line sounds off:** record numbered versions of just that clause (some with other words, some with the same
  words and different punctuation, pauses or speed), each played inside the whole line, on a listening page. Sani picks
  one; use the exact boy clip he heard and record the girl's version with the same text and punctuation.
## Demo languages (`content/langs/<code>/`, branch demo-languages)
The same curriculum with Laila speaking Swahili (`sw`), Yoruba (`yo`, the bird is Fúnkẹ́) or Igbo (`ig`, the bird is
Chioma). Each folder has `lines.json` (the Hausa keys, in that language, status `draft`), `words.json` (key → name),
`lang.json` (bird, voices, recogniser locale, the "my name is" carrier, the screen texts keyed by today's Hausa) and
`recorded.json`. `ui-keys.json` lists screen texts the code passes to `t()` from data; the lint finds the fixed ones.
- `npm run start:sw` / `start:yo` / `start:ig` (ports 4201–4203), `npm run build:sw` … → `dist/kratu-<code>`.
- `npm run voice:<code>` records missing or changed clips; `npm run lint:<code>` checks the chain.
- Outputs go to `langs/<code>/public` only: Hausa's files are never read or written by these commands.
- `tools/asr_check.py` scores a voice by speech recognition (character error rate; Google's Hausa is 2.5%).
