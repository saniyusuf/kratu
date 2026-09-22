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
