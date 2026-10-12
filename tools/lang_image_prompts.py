# Writes content/langs/<code>/image_prompts.json from tools/image_prompts.json, rewritten for each demo language's region
# (traditional Yoruba / Igbo dress, a Kenyan setting, the region's soup). Run from the repo root: python3 tools/lang_image_prompts.py
import json, re
P = json.load(open('tools/image_prompts.json')); W = json.load(open('content/words.json'))['words']
grp = {w['key']: w['groups'][0] for w in W}
SHARED = {'imam', 'emir'}                       # the picture IS the word
R = {
 'yo': dict(people='Yoruba', adj='south-western Nigerian (Yoruba)', region='south-western Nigeria',
            compound='Yoruba family compound with painted concrete houses, zinc roofs and green plants',
            land='green south-western Nigerian landscape with palm trees',
            dress='traditional Yoruba clothes (a woman in iro and buba with a gele head-tie, a man in buba and sokoto with a fila cap, an elder in an agbada)',
            father='a traditional Yoruba buba and sokoto with a matching fila cap', mother='a traditional Yoruba iro and buba with a tall gele head-tie',
            boy='a traditional Yoruba buba and sokoto with a small fila cap', girl='a traditional Yoruba iro and buba, hair in a neat shuku braided style', tunic='buba',
            kid='traditional Yoruba clothes (a boy in buba and sokoto with a fila cap, a girl in iro and buba with shuku braids)'),
 'ig': dict(people='Igbo', adj='south-eastern Nigerian (Igbo)', region='south-eastern Nigeria',
            compound='Igbo family compound with a zinc-roofed bungalow, a red-earth yard and palm trees',
            land='green south-eastern Nigerian landscape with oil palms',
            dress='traditional Igbo clothes (a woman in a george wrapper and blouse with a head-tie and coral beads, a man in an isiagu top with a red cap)',
            father='a traditional Igbo isiagu top with a red okpu cap', mother='a traditional Igbo george wrapper and blouse with a head-tie and coral bead necklace',
            boy='a small Igbo isiagu top', girl='a bright wrapper dress, hair in traditional Igbo threaded style (isi owu)', tunic='isiagu top',
            kid='traditional Igbo clothes (a boy in a small isiagu top, a girl in a wrapper dress with threaded isi owu hair or neat cornrows)'),
 'sw': dict(people='Kenyan', adj='Kenyan', region='Kenya, East Africa',
            compound='rural Kenyan homestead with a corrugated-iron roofed house and green hills',
            land='green rural Kenyan landscape',
            dress='everyday Kenyan dress (a kitenge or kanga for women, shirt and trousers for men)',
            father='a smart shirt and trousers', mother='a bright kitenge dress and a matching head wrap',
            boy='a bright T-shirt', girl='a bright kitenge dress with her hair neatly braided', tunic='shirt', kid='everyday Kenyan clothes (a T-shirt and shorts or a kitenge dress)'),
}
def adapt(code, k, p):
    r = R[code]; s = p
    if k == 'mama': return f"photo portrait of a warm smiling {r['people']} mother wearing {r['mother']}, head and shoulders, plain soft background, photorealistic, natural daylight, single subject, no text"
    if k == 'baba': return f"photo portrait of a warm smiling {r['people']} father wearing {r['father']}, head and shoulders, plain soft background, photorealistic, natural daylight, single subject, no text"
    if k == 'boy':  return f"photo portrait of a happy {r['people']} boy about eight years old in {r['boy']}, head and shoulders, plain soft background, photorealistic, natural daylight, single subject, no text"
    if k == 'girl': return f"photo portrait of a happy {r['people']} girl about eight years old in {r['girl']}, head and shoulders, plain soft background, photorealistic, natural daylight, single subject, no text"
    if k == 'slate': return "photo of a child's small blank black writing slate in a plain wooden frame with a stick of white chalk beside it, clean empty black surface with nothing written on it, lying on a wooden desk, photorealistic, natural daylight, single subject"
    TOD = {'yo': 'a small ankara buba', 'ig': 'a small isiagu top', 'sw': 'a small T-shirt and shorts'}
    MUM = {'yo': 'in an iro and buba with a gele head-tie', 'ig': 'in a george wrapper and blouse with a head-tie', 'sw': 'in a kitenge dress and head wrap'}
    TOP = {'yo': 'buba', 'ig': 'isiagu top', 'sw': 'T-shirt'}
    if k == 'baby': return f"photo of one smiling {r['people']} toddler, about two years old, in {TOD[code]}, standing alone in a {r['compound']}, photorealistic, natural bright daylight, single subject, centered, no text, {r['region']}"
    if k == 'well': return f"photo of a round concrete water well with a metal cover and a rope and bucket, in a {r['compound']}, photorealistic, natural bright daylight, single subject, centered, no people, no text, {r['region']}"
    if k == 'dress': return f"photo of a {r['people']} boy pulling his {TOP[code]} on over his head, clearly the action of getting dressed, already wearing trousers, standing in a {r['compound']}, photorealistic, natural bright daylight, centered, no text, {r['region']}"
    if k == 'wash': return f"photo of a {r['people']} mother {MUM[code]} bathing her small child, the child sitting in a large basin while she pours water from a bowl over the shoulders, {r['compound']}, photorealistic, natural bright daylight, centered, no text, {r['region']}"
    if k == 'barber': return f"photo of a {r['people']} barber in a small barbing salon cutting a seated boy's hair with electric clippers, both facing the camera, photorealistic, natural bright daylight, centered, no text, {r['region']}"
    if k == 'herder' and code == 'sw': return "photo of a Maasai herder in a red shuka with his staff walking with his herd of cattle across the savanna, photorealistic, natural bright daylight, centered, no text, Kenya"
    if k == 'scarf': return f"photo of a {r['people']} woman wearing a bright patterned head wrap tied on her head, shoulders-up portrait, photorealistic, natural bright daylight, centered, no text, {r['region']}"
    if k == 'gown': return f"photo of a {r['people']} girl in a bright patterned dress standing in a {r['compound']}, photorealistic, natural bright daylight, centered, no text, {r['region']}"
    if code == 'sw':
        sw = {'tricycle': 'photo of one tuk-tuk three-wheeler taxi parked on a Kenyan street', 'motorcycle': 'photo of one red boda boda motorcycle taxi parked on a Kenyan street',
              'bus': 'photo of one brightly painted Kenyan matatu minibus parked on a street', 'taxi': 'photo of one white taxi car with a yellow stripe parked on a Kenyan street',
              'police_car': 'photo of a white Kenya Police Land Cruiser pickup with a blue light bar, seen from the side on a road',
              'flag': 'photo of a single small Kenyan flag on a wooden school desk in a Kenyan classroom',
              'wrapper': 'photo of a folded colourful kanga cloth, the East African women\'s wrapper, on a plain surface'}
        if k in sw: return sw[k] + ', photorealistic, natural bright daylight, single subject, centered, no people, no text'
        if k == 'soldier': return 'photo of a Kenya Defence Forces soldier in camouflage uniform and beret standing at ease, outdoors, photorealistic, natural bright daylight, centered, no text, Kenya'
        if k == 'policeman': return 'photo of a Kenyan policeman in a dark blue uniform and cap standing beside the road, photorealistic, natural bright daylight, centered, no text, Kenya'
    FEM = {'grandmother', 'aunt', 'nurse', 'woman'}
    DF = {'yo': 'a traditional Yoruba iro and buba with a gele head-tie', 'ig': 'a traditional Igbo george wrapper and blouse with a head-tie and coral beads', 'sw': 'a bright kitenge dress and head wrap'}
    DM = {'yo': 'a traditional Yoruba buba and sokoto with a fila cap' + (', an agbada over it' if k in ('grandfather', 'old_man') else ''), 'ig': 'a traditional Igbo isiagu top with a red okpu cap' + (' and coral beads' if k in ('grandfather', 'old_man') else ''), 'sw': 'a shirt and trousers'}
    s = s.replace('everyday northern Nigerian dress', (DF if k in FEM else DM)[code]).replace('mud-brick houses', 'houses').replace('mud-brick house wall', 'painted house wall')
    s = s.replace('village compound', r['compound']).replace('the northern Nigerian landscape', 'the ' + r['land']).replace('dry savanna', r['land'])
    s = s.replace('in a kaftan', 'in a ' + r['tunic']).replace('in a small kaftan', 'in a small ' + r['tunic']).replace('his tunic', 'his ' + r['tunic'])
    s = re.sub(r'\bnorthern Nigerian\b', r['adj'], s); s = re.sub(r'\bHausa\b', r['people'], s)
    s = s.replace('northern Nigeria', r['region']).replace('Nigerian army', 'Nigerian army' if code != 'sw' else 'Kenyan army')
    s = re.sub(r'\b(child|schoolboy|toddler)\b', lambda m: m.group(1) + ' wearing ' + r['kid'], s, count=1)
    return s
ENV = ['school', 'classroom', 'farm', 'road', 'well', 'door', 'window']
out = {}
for code in R:
    keys = [w['key'] for w in W if grp[w['key']] in ('people', 'actions') and w['key'] not in SHARED] + ['gown', 'scarf', 'miya', 'slate'] + ENV
    if code == 'sw': keys += ['tricycle', 'motorcycle', 'bus', 'taxi', 'police_car', 'flag', 'wrapper']
    old = json.load(open(f'content/langs/{code}/image_prompts.json'))
    SOUP = {'yo': 'close-up photo of one bowl of thick Nigerian egusi soup, yellow-orange and grainy like crumbled egg, with dark green leaves and chunks of beef, only the bowl on a plain wooden table, photorealistic, natural bright daylight, centered, no text', 'ig': 'close-up photo of one bowl of thick Igbo egusi soup, yellow-orange and grainy like crumbled egg, with green ugu leaves, chunks of beef and dried fish, only the bowl on a plain wooden table, photorealistic, natural bright daylight, centered, no text', 'sw': 'close-up photo of one bowl of East African beef stew with tomatoes and carrots, only the bowl on a plain wooden table, photorealistic, natural bright daylight, centered, no text'}
    d = {k: (SOUP.get(code, old.get('miya')) if k == 'miya' else adapt(code, k, P[k])) for k in keys if k in P}
    json.dump(d, open(f'content/langs/{code}/image_prompts.json', 'w'), ensure_ascii=False, indent=1)
    left = [k for k, v in d.items() if re.search(r'northern|Hausa|mud-brick|kaftan|hijab', v)]
    print(code, len(d), 'prompts; still northern:', left)
print(json.load(open('content/langs/sw/image_prompts.json'))['walk']); print(json.load(open('content/langs/ig/image_prompts.json'))['teacher'])
