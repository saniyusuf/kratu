#!/usr/bin/env python3
"""Build apps/family/public/names/spellings.json (Sani 2026-11-25, "Both"): how PlotWeaver's Hausa recogniser is
likely to write the English and Christian names that are in the family bank ("Fet", "Feyit", "Feis" for Faith), each
mapped to its bank name. The app checks this table first, by sound key, before the closest-name match.
A spelling is left out when it already sounds like the bank name itself, when it sounds like a different bank name,
or when two names could have written it. HAND entries are always kept (unless they clash). Run again after the bank
changes: python3 tools/name_spellings.py"""
import json, re, itertools, pathlib, sys
R = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(R / "tools"))
from nigerian_names import ENGLISH_M, ENGLISH_F
NAMES = R / "apps/family/public/names/phrases.json"
OUT = R / "apps/family/public/names/spellings.json"

# heard by ear or expected from Hausa spelling habits; checked against clashes like the rest
HAND = {
    "faith": ["fet", "feyit", "feis", "fais", "faiti", "feti", "fes", "feit", "fayit", "feyis"],
    "grace": ["gires", "giris", "gireis", "gras", "geres", "guris"],
    "blessing": ["bulesin", "blesin", "bilesin", "balasin", "bulessin"],
    "favour": ["feba", "febo", "fabo", "feva", "fefa", "feiba"],
    "precious": ["firashos", "firashas", "parashas", "firesus", "fireshos"],
    "mercy": ["masi", "mesi", "marsi", "mashi"],
    "peace": ["fis", "pis", "fiis"],
    "gift": ["gif", "gifti", "gibti"],
    "joy": ["joi", "jowi"],
    "esther": ["esta", "isita", "esita"],
    "mary": ["meri", "mairi", "meiri"],
    "daniel": ["daniyel", "daniyal", "danyel"],
    "david": ["debid", "deibid", "debit"],
    "john": ["jon", "jonu"],
    "joseph": ["josef", "jozef", "josefu"],
    "emmanuel": ["imanuwel", "imanuel", "emanuwel"],
    "patience": ["feshens", "feshas", "pashens", "fashens"],
    "comfort": ["komfot", "kamfat", "komfat"],
    "victor": ["biktor", "bikta", "fikta"],
    "victoria": ["biktoriya", "biktoria"],
}

def sound_key(t):
    s = t.lower().replace("'", "")
    for a, b in [('ph','f'),('ck','k'),('q','k'),('c','k'),('x','ks'),('z','s'),('ee','i'),('ea','i'),('oo','u'),('ou','u'),('y','i'),('w','u'),('e','i'),('o','u'),('dh','d'),('th','t'),('kh','k'),('gh','g'),('sh','S'),('ch','S'),('j','J'),('ts','S')]:
        s = s.replace(a, b)
    s = re.sub(r'([bdfgklmnprst])h', r'\1', s); s = re.sub(r'[^a-zSJ]', '', s)
    return re.sub(r'(.)\1+', r'\1', s)

V = "aeiou"
RULES = [   # each one optional: a name gets every combination of the rules that change it
    (r'th', 't'), (r'th', 's'), (r'ph', 'f'), (r'p', 'f'), (r'v', 'b'),
    (r'(ai|ay|ei|ey)', 'e'), (r'a([^aeiou])e$', r'e\1'), (r'(our|or|er|ar)$', 'a'),
    (r'tious$|cious$', 'shos'), (r'tion$', 'shan'), (r'(ce|se)$', 's'), (r'([^aeiou])e$', r'\1'),
    (r'ng$', 'n'), (r'([aeiou])r([^aeiou])', r'\1\2'),
    (r'^([bcdfgkpt])([lr])', r'\1i\2'), (r'^([bcdfgkpt])([lr])', r'\1u\2'), (r'^(s)([tmnkp])', r'\1i\2'),
    (r'([^aeiouy])$', r'\1i'), (r'([^aeiouy])$', r'\1u'),
]
def spellings(name):
    out = {name}
    for r, b in RULES:
        out |= {re.sub(r, b, x, count=1) for x in out if re.search(r, x)}
        if len(out) > 400: break
    return out

def main():
    D = json.loads(NAMES.read_text()); BANK = set(D["file"])
    BANK_SOUND = {}
    for k in BANK: BANK_SOUND.setdefault(sound_key(k), set()).add(k)
    english = []
    for n in ENGLISH_M + ENGLISH_F:
        k = n.lower()
        if k in BANK and k not in english: english.append(k)
    by_sound = {}   # sound key of a spelling -> {bank name}
    for k in english:
        own = sound_key(k)
        for s in spellings(k) | set(HAND.get(k, [])):
            sk = sound_key(s)
            if not sk or sk == own or len(sk) < 2: continue
            by_sound.setdefault(sk, set()).add(k)
    table, dropped = {}, 0
    for sk, ks in sorted(by_sound.items()):
        if len(ks) != 1 or sk in BANK_SOUND: dropped += 1; continue   # two names, or another bank name's own sound
        table[sk] = next(iter(ks))
    OUT.write_text(json.dumps({"note": "Sani 2026-11-25: how PlotWeaver may write an English or Christian bank name in Hausa spelling, by sound key (as the app folds letters) -> bank name. Built by tools/name_spellings.py; checked before the closest-name match.", "spellings": table}, indent=0, sort_keys=True) + "\n")
    print(f"{len(english)} English/Christian bank names, {len(table)} spellings kept, {dropped} dropped (clash)")

if __name__ == "__main__": main()
