# Writes the 9 Nov drafts into content/langs/: the new Yoruba and Igbo lines, and the whole Pidgin (pcm) pack.
#   python3 tools/drafts/apply.py      (run from the repo root; safe to run again)
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from pcm_lines import L as PCM, B
from pcm_ui import U as PCM_UI

HA = {r['key']: r for r in json.load(open('content/lines.json')) if r['status'] == 'live' and r['lang'] == 'ha'}
pair = lambda k: isinstance(HA[k]['text'], dict)

def row(lang, k, t):
    """The same forms Hausa has for this key (m/f, any/f, or any/m/f): `t` is one text for all, a (boy, girl) pair, or a dict."""
    hf = list(HA[k]['text'].keys()) if pair(k) else None
    if isinstance(t, dict): text = t
    elif not hf: text = t
    else:
        b, g = t if isinstance(t, tuple) else (t, t)
        text = {f: (g if f == 'f' else b) for f in hf}
    return {'key': k, 'lang': lang, 'voice': 'laila', 'gender': 'pair' if isinstance(text, dict) else 'any', 'text': text, 'en': HA[k].get('en', ''), 'status': 'draft'}

YO = {
 'app_locked': "Ẹ̀kọ́ yìí kò tíì ṣí. Yóò ṣí fún ọ nígbà tí o bá dé ibẹ̀ nínú ìwé.",
 's_wb_home': "Bí o bá fẹ́ padà sílé, tẹ ìwé náà.",
 'gd_hawan': "Agbẹ́gbá ń gbẹ́ lẹ́tà kan sára igbá kọ̀ọ̀kan. Sọ lẹ́tà náà, kí a gbé e sórí àgbékọ́.",
 'gd_fashe': "Àwọn lẹ́tà ń fò sókè nínú bàlúù. Fọ́ lẹ́tà tí mo bá sọ.",
 'gd_hanzarin': "Bojúbojú! Wá ọ̀rẹ́ tó mú ohun tí mo bá sọ.",
 'gd_kifi': "Àwọn ẹyẹlé ń bọ́ sílẹ̀ ní àgbàlá ààfin. Tẹ èyí tó gbé àwòrán tó tọ́.",
 'gd_kalangu': "Ìyá àgbà ń pa àlọ́ Ìjàpá lẹ́gbẹ̀ẹ́ iná. Sọ orúkọ ohun kọ̀ọ̀kan nínú ìtàn náà.",
 'gd_shayi': "Ran Ìyá Àkàrà lọ́wọ́: fún oníbàárà kọ̀ọ̀kan ní ohun tí ó béèrè.",
 'gd_dillali': "Ẹrù ìyàwó ń dé lórí àwo. Sọ orúkọ ọ̀kọ̀ọ̀kan fún tábìlì ẹ̀bùn.",
 'gd_dalar': "Ká iye èso kòkó tí mo bá sọ, lẹ́yìn náà tẹ apẹ̀rẹ̀.",
 'gd_suya': "Ní ìpàdé èsúsú, sọ iye owó tí obìnrin kọ̀ọ̀kan mú wá.",
 'gd_allo': "Ka ọ̀rọ̀ kọ̀ọ̀kan lórí ìlẹ̀kùn ààfin, gbẹ́nàgbẹ́nà yóò sì gbẹ́ ẹ.",
 'gd_jirgi': "Gun ọ̀kadà, kí o sì ka gbogbo àmì ọ̀nà sókè.",
 'gd_kwale': "Yan ọkọ̀ regatta tí ọ̀rọ̀ rẹ̀ bá àwòrán mu.",
 'gd_ruwa': "Ka àkọlé ìwé ìròyìn sókè níbi ìtajà ìwé ìròyìn.",
 'gd_tukwane': "Fi kóró sínú ihò ọpọ́n ayò láti kọ ọ̀rọ̀ náà.",
 'gd_bulo': "Kọ ọ̀rọ̀ náà ní lẹ́tà kọ̀ọ̀kan, iná yóò sì tàn: Iná dé!",
 'gd_marubuci': "Ran ayàwòrán pátákó lọ́wọ́ láti kọ ọ̀rọ̀ náà sórí pátákó ṣọ́ọ̀bù.",
 'gd_karofi': "So lẹ́tà kọ̀ọ̀kan mọ́ aṣọ, lẹ́yìn náà rẹ ẹ́ ní aró.",
 'gd_shanu': "Mú aṣọ òkè tí iye owó rẹ̀ tọ́ bí ó ṣe ń kọjá.",
 'gd_garke': "Ka àwọn àlejò tó jókòó síbi tábìlì owámbẹ̀, kí o sì sọ iye wọn.",
 's_g_stars_how': "Àwọn ìràwọ̀ ń dúró! Tẹ̀ wọ́n ní tẹ̀léntẹ̀lé, láti ọ̀kan.",
}
IG = {
 'app_locked': "Ihe ọmụmụ a emepebeghị ugbu a. Ọ ga-emepe mgbe ị ruru ya n'akwụkwọ ahụ.",
 's_wb_home': "Ọ bụrụ na ịchọrọ ịlaghachi n'ụlọ, pịa akwụkwọ ahụ.",
 'gd_hawan': "Egwu ọnwa: kwuo mkpụrụedemede nwata ọ bụla na-ebuli elu.",
 'gd_fashe': "Mkpụrụedemede na-efe elu n'ime balloon. Gbawaa mkpụrụedemede m kwuru.",
 'gd_hanzarin': "Kwụsị wilbarọ Onitsha na-ebu ihe m kwuru.",
 'gd_kifi': "Jide mkpụrụ ụdara nwere foto ziri ezi tupu ọ daa n'ala.",
 'gd_kalangu': "N'ebe a na-ese ihe nkiri Nollywood: kpọọ aha ihe ọ bụla a chọrọ maka ihe nkiri ahụ.",
 'gd_shayi': "Nyere onye na-ere okpa aka: nye onye ọ bụla na-azụ ahịa ihe ọ chọrọ.",
 'gd_dillali': "Ọbịbịa Krismas: kpọọ aha ihe ọ bụla si n'akpa ahụ pụta.",
 'gd_dalar': "Tinye mmanụ nkwụ n'ime galọn ruo ọnụọgụ m kwuru.",
 'gd_suya': "Mgbe a na-emechi ụlọ ahịa: kwuo ego ole akwụkwọ ego ọ bụla bụ.",
 'gd_allo': "Gụọ okwu dị na mgbidi ahụ, onye na-ese ihe ga-eme ya uli.",
 'gd_jirgi': "Gụọ bọọdụ ọdụ ụgbọ oloko ka ụgbọ oloko Enugu kwụsị.",
 'gd_kwale': "Họrọ ụgbọala dị n'Upper Iweka nwere okwu kwekọrọ na foto ahụ.",
 'gd_ruwa': "Gụpụta okwu dị na bọọdụ ahụ, onye mgba gị ga-emeri.",
 'gd_tukwane': "Dee okwu ahụ site n'itinye aka n'eriri.",
 'gd_bulo': "Dee okwu ahụ, otu mkpụrụ ọjị maka mkpụrụedemede ọ bụla.",
 'gd_marubuci': "Nyere onye na-ebi akwụkwọ Onitsha aka ịhazi okwu ahụ.",
 'gd_karofi': "Kpaa mkpụrụedemede ọ bụla n'ime akwa Akwete.",
 'gd_shanu': "Chọta igbe akpụkpọ ụkwụ Aba nwere ọnụahịa ziri ezi.",
 'gd_garke': "Gụọ ji ọhụrụ dị n'ute, ma kwuo ole ha dị.",
 's_g_stars_how': "Kpakpando na-eche! Pịa ha n'usoro, site n'otu.",
}

for code, new in (('yo', YO), ('ig', IG)):
    p = f'content/langs/{code}/lines.json'; rows = json.load(open(p)); have = {r['key'] for r in rows}
    for r in rows:
        if r['key'] in ('s_eg_watch', 's_eg_ok', 's_pop_timeup') and r['status'] == 'planned': r['status'] = 'draft'
    rows += [row(code, k, t) for k, t in new.items() if k not in have]
    json.dump(rows, open(p, 'w'), ensure_ascii=False, indent=1); open(p, 'a').write('\n')

# ---- Pidgin ----
d = 'content/langs/pcm'; os.makedirs(d, exist_ok=True)
missing = [k for k in HA if k not in PCM]
if missing: sys.exit('pcm has no line for: ' + ', '.join(missing))
json.dump([row('pcm', k, PCM[k]) for k in HA], open(d + '/lines.json', 'w'), ensure_ascii=False, indent=1)

W = json.load(open('content/words.json'))['words']
OWN = {  # Pidgin names that are not the plain English word
 'mama': 'mama', 'baba': 'papa', 'baby': 'small pikin', 'grandmother': 'grandma', 'grandfather': 'grandpa', 'brother': 'brother',
 'policeman': 'police', 'soldier': 'soja', 'trader': 'market woman', 'old_man': 'old man', 'emir': 'emir',
 'eat': 'chop', 'bathe': 'baff', 'talk': 'talk', 'look': 'look', 'wake': 'wake up', 'dress': 'dress up', 'farm_work': 'farm work',
 'brush_teeth': 'brush teeth', 'fetch_water': 'fetch water', 'ride': 'ride bicycle', 'sit': 'sidon',
 'motorcycle': 'okada', 'tricycle': 'keke', 'truck': 'lorry', 'airplane': 'aeroplane', 'police_car': 'police motor', 'car': 'motor',
 'stomach': 'belle', 'miya': 'soup', 'sweet': 'sweet', 'garden_egg': 'garden egg', 'sorghum': 'guinea corn', 'guineafowl': 'guinea fowl',
 'groundnut': 'groundnut', 'corn': 'corn', 'torch': 'torchlight', 'matches': 'match', 'box': 'box', 'lizard': 'agama', 'tortoise': 'tortoise',
 'prayer_mat': 'prayer mat', 'lunch_box': 'lunch box', 'water_bottle': 'water bottle', 'uniform': 'uniform', 'gown': 'gown', 'scarf': 'headtie',
 'sweater': 'sweater', 'television': 'television', 'fridge': 'fridge', 'phone': 'phone',
}
names = {w['key']: OWN.get(w['key'], w['en'].lower() if not w['key'].startswith(('n', 'p')) or not w['key'][1:].isdigit() else w['en'].lower()) for w in W}
json.dump(names, open(d + '/words.json', 'w'), ensure_ascii=False, indent=1)

yo = json.load(open('content/langs/yo/lang.json'))
keys = list(yo['ui'].keys())
gap = [k for k in keys if k not in PCM_UI]
ui = {k: PCM_UI.get(k, k) for k in keys}
for k, v in yo['ui'].items():   # the English board texts: the Hausa build's games, so their English stays as it is
    if k not in PCM_UI and all(ord(c) < 128 or c in '–·’' for c in k): ui[k] = k
pack = {
 'code': 'pcm', 'name': 'Naijá (Nigerian Pidgin)', 'bird': B, 'sr': 'en-NG',
 'carrier': [' my name na ', ' my name be ', ' my name is ', ' na me be '], 'carrierStop': ['o', 'oh'], 'carrierEnd': [],
 'fold': True, 'namesBank': False, 'muteFilms': True, 'kids': {'m': 'Tobi', 'f': 'Amaka'},
 'tts': {'provider': 'plotweaver', 'lang': 'pcm', 'voice': 'adaeze', 'lufs': -17.7},
 'status': 'draft', 'ui': ui,
}
json.dump(pack, open(d + '/lang.json', 'w'), ensure_ascii=False, indent=1)
if not os.path.exists(d + '/recorded.json'): open(d + '/recorded.json', 'w').write('{}\n')
left = [k for k in gap if any(ord(c) > 127 and c not in '–·’“”…' for c in k) or k[:1].islower()]
print('pcm:', len(HA), 'lines,', len(names), 'words,', len(ui), 'screen texts; untranslated non-English keys:', [k for k in gap if ui[k] == k and not all(ord(c) < 128 or c in '–·’' for c in k)])
