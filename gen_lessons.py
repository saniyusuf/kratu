import urllib.request, urllib.parse, base64, json, sys, time

def fetch(text, lang):
    q = urllib.parse.quote(text)
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl={lang}&q={q}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    return urllib.request.urlopen(req, timeout=30).read()

def enc(b): return "data:audio/mpeg;base64," + base64.b64encode(b).decode()

out = {}
def grab(key, text, lang):
    for _ in range(3):
        try:
            out[key] = enc(fetch(text, lang)); print("OK", key, file=sys.stderr); return
        except Exception as e:
            print("retry", key, e, file=sys.stderr); time.sleep(1)

# English letter names A-Z
for i in range(26):
    L = chr(65 + i); grab("en_" + L, L, "en")

# Hausa lesson lines — masculine (ka/-nka) + feminine variants (_f: ki/-nki)
ha = {
    "board_intro":  "Ga dukkan haruffa. Za mu koya su rukuni rukuni.",
    "wannan":       "Wannan shi ne",
    "sake":         "Zan sake faɗa harafin",
    "next":         "To, za mu koma na gaba.",
    "kudos":        "Madalla!",
    "retry":        "A'a, sake gwadawa.",
    "scatter_intro":"Yanzu, za mu gauraya su.",
    "seq_prompt":   "Wanne ne na gaba?",
    "prompt":       "Ka faɗi shi.",
    "remind":       "Ka saurara, wannan shi ne",
    "recite_intro": "Yanzu, ka faɗi haruffan da kanka.",
    "test_order":   "Babbar jarrabawa. Ka faɗi haruffa duka, bi da bi.",
    "seq_intro":    "Jarrabawa ta ƙarshe. Ka ci gaba da haruffan.",
    "stage_done":   "Madalla! Ka gama wannan rukuni.",
    "all_done":     "Madalla ƙwarai! Ka ƙware haruffa!",
    "your_turn":    "Lokacinka ya yi.",
}
ha_f = {  # feminine versions of the gendered lines
    "prompt":       "Ki faɗi shi.",
    "remind":       "Ki saurara, wannan shi ne",
    "recite_intro": "Yanzu, ki faɗi haruffan da kanki.",
    "test_order":   "Babbar jarrabawa. Ki faɗi haruffa duka, bi da bi.",
    "seq_intro":    "Jarrabawa ta ƙarshe. Ki ci gaba da haruffan.",
    "stage_done":   "Madalla! Kin gama wannan rukuni.",
    "all_done":     "Madalla ƙwarai! Kin ƙware haruffa!",
    "your_turn":    "Lokacinki ya yi.",
}
for k, t in ha.items(): grab(k, t, "ha")
for k, t in ha_f.items(): grab(k + "_f", t, "ha")

json.dump(out, open("/Users/sani/Documents/kratu/lessons_audio.json", "w"))
print("clips:", len(out), "KB:", round(sum(len(v) for v in out.values()) / 1024), file=sys.stderr)
