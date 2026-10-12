#!/usr/bin/env python3
"""The picture prompts for the Hedra redraw (Sani, 12 Oct): content/pictures/<set>.json for set = shared, ha, yo, ig, sw.
  shared  one picture for every language: actions (clean, neat children in plain clothes any culture is fine with, one clear
          action), jobs and places. Replaces the Hausa picture too.
  ha/yo/ig/sw  only what needs culture: family, people, clothing, soup (and, for Swahili, Kenyan vehicles and uniforms).
Run from the repo root: python3 tools/picture_prompts.py"""
import json
STYLE = 'natural candid photo, realistic, true-to-life colours, soft natural daylight, sharp focus, no text, no watermark'
BOY = 'one happy African boy about eight years old in a clean plain T-shirt and shorts'
GIRL = 'one happy African girl about eight years old in a clean simple cotton dress, hair neatly braided'
KID = lambda i: BOY if i % 2 == 0 else GIRL
P = lambda s: s + ', ' + STYLE
ACT = {
 'eat': 'eating rice from a plate with a spoon at a clean table, spoon raised to the mouth', 'drink': 'drinking water from a clear glass, head tipped back slightly',
 'run': 'running fast across a clean open yard, both feet off the ground mid-stride', 'sit': 'sitting upright on a simple wooden chair, hands on the knees',
 'sleep': 'sleeping peacefully on a bed under a light blanket, eyes closed, hands relaxed and natural', 'wash': 'washing hands with soap under a running tap at an outdoor sink',
 'play': 'playing with a colourful ball with two friends in a clean yard, laughing', 'walk': 'WALK',
 'jump': 'jumping high with both feet off the ground, arms up', 'stand': 'standing straight and still, arms by the sides, looking at the camera',
 'cry': 'CRY', 'laugh': 'laughing loudly with the head back and eyes squeezed shut',
 'sing': 'singing happily with the mouth wide open and one hand on the chest', 'dance': 'dancing joyfully with arms out and one knee lifted',
 'read': 'reading a picture book held open with both hands', 'write': 'writing in an exercise book with a pencil at a desk',
 'draw': 'drawing a house with crayons on white paper at a table', 'cook': 'COOK', 'sweep': 'sweeping a clean floor with a long broom',
 'pray': 'praying quietly with eyes closed and hands together, natural relaxed hands', 'climb': 'climbing up a wooden ladder, both hands gripping the rungs',
 'swim': 'SWIM', 'clap': 'clapping hands together in front of the chest, smiling',
 'talk': 'talking, mouth open mid-word, one hand gesturing as if explaining', 'listen': 'listening carefully with one hand cupped behind the ear, both arms visible',
 'look': 'looking through a pair of binoculars', 'open': 'opening a wooden door by its handle', 'close': 'closing a wooden door by its handle, pushing it shut',
 'give': 'holding out an orange with both hands, giving it towards the camera', 'carry': 'carrying a large cardboard box in both arms',
 'push': 'pushing a wheelbarrow forward with both hands', 'pull': 'pulling hard on a thick rope with both hands, leaning back',
 'kick': 'kicking a football, the foot touching the ball', 'throw': 'throwing a ball forward overhand, the ball just leaving the hand',
 'catch': 'CATCH', 'ride': 'riding a bicycle alone, both hands on the handlebars',
 'drive': 'DRIVE', 'wake': 'waking up in bed in the morning, sitting up and stretching both arms, yawning, sunlight from the window',
 'bathe': 'having a bath in a plastic bath tub, pouring water over the head with a small cup, a bucket beside the tub, bathroom tiles',
 'brush_teeth': 'brushing teeth with a toothbrush at a bathroom sink in front of a mirror, a little white foam',
 'dress': 'putting on a T-shirt, pulling it down over the head, already wearing shorts, in a bedroom',
 'farm_work': 'FARMWORK', 'fetch_water': 'carrying a yellow jerrycan of water from an outdoor tap', 'sell': 'SELL', 'buy': 'BUY',
 'help': 'helping a younger child up after a fall, holding out a hand'}
KIDX = {'cry': 'one sad African boy about seven years old in a clean plain T-shirt crying, tears running down his cheeks, rubbing one eye with his hand',
 'swim': 'one African boy about eight years old in swimming shorts and goggles swimming in a clear blue swimming pool, arms mid-stroke, face above the water',
 'catch': 'one African boy about eight years old in a clean plain T-shirt and shorts with both arms stretched out, about to catch a ball flying towards him, the ball in the air just before his hands',
 'walk': 'one African girl about eight years old in a clean simple cotton dress walking along a quiet tree-lined path, one foot stepping forward, seen from the side'}
ADULT = {'cook': 'one African woman in a clean apron cooking, stirring a pot on a gas stove in a clean kitchen',
 'drive': 'one African man driving a car alone, both hands on the steering wheel, seen through the open driver window',
 'farm_work': 'one African farmer working the soil with a hoe between rows of green crops on a farm',
 'sell': 'one African woman trader selling tomatoes at her market stall, handing a bag of tomatoes to a customer',
 'buy': 'one African woman buying fruit at a market stall, handing money to the seller and taking a bag of oranges'}
JOBS = {
 'doctor': 'one friendly Nigerian doctor in a white coat with a stethoscope, a surgical face mask pulled down under the chin, standing in a clean hospital ward',
 'nurse': 'one friendly Nigerian nurse in a white nurse uniform and cap, holding a clipboard, standing in a clean hospital ward with beds',
 'farmer': 'one Nigerian farmer standing in his green maize farm holding a hoe on his shoulder, rows of crops around him',
 'trader': 'one Nigerian trader at a tidy market stall selling grains in big open sacks and bowls, detailed, looking at the camera',
 'driver': 'one Nigerian driver sitting behind the steering wheel of his car, seen through the open driver window, smiling',
 'tailor': 'one Nigerian tailor sewing colourful fabric at his sewing machine in a small tidy shop',
 'butcher': 'one Nigerian butcher in a clean apron cutting a piece of meat on a wooden block at his market stall, hands and knife clearly visible, natural hands',
 'carpenter': 'one Nigerian carpenter planing a plank of wood on his workbench in a workshop, wood shavings',
 'mechanic': 'one Nigerian mechanic in overalls loosening a car wheel nut with a wheel spanner, kneeling by the tyre',
 'blacksmith': 'one Nigerian blacksmith hammering a red-hot piece of iron on an anvil in his workshop, sparks',
 'barber': 'one Nigerian barber cutting a seated boy\'s hair with electric clippers in a small clean barbershop, both facing the camera',
 'fisherman': 'one Nigerian fisherman in a wooden canoe casting a round fishing net over a calm river',
 'herder': 'one Fulani herder with a staff walking behind his herd of white cattle on green grassland',
 'student': 'an African schoolboy and schoolgirl in clean school uniforms, each wearing a school bag on the back, walking to school together',
 'neighbour': 'two African neighbours, a man and a woman, smiling and shaking hands over a low garden gate between their two houses',
 'soldier': 'one Nigerian Army soldier in green camouflage uniform with a detailed Nigerian flag patch and beret, standing at ease, detailed uniform',
 'policeman': 'one Nigerian Police officer in a black uniform with a detailed badge, beret and belt, standing beside a road, detailed uniform',
}
PLACES = {
 'school': 'a Nigerian primary school building, a long block of classrooms with a corrugated roof, children in clean uniforms in the schoolyard',
 'classroom': 'a Nigerian primary school classroom seen from the back, rows of wooden desks with children in clean uniforms facing a blackboard and a teacher',
 'farm': 'a green farm with neat rows of maize and vegetables under a blue sky, no people',
 'road': 'a straight empty tarmac road through green countryside, no people',
 'well': 'a round concrete water well with a metal cover, a rope and a bucket, in a clean yard, no people',
 'door': 'one closed wooden house door with a single round handle on the right side, set in a painted wall, no people',
 'slate': 'a child\'s small blank black chalk slate in a plain wooden frame lying on a wooden desk with a stick of white chalk beside it, nothing written on it',
}
shared = {}
for i, (k, v) in enumerate(ACT.items()):
    shared[k] = P(ADULT[k] if k in ADULT else KIDX[k] if k in KIDX else f'{KID(i)} {v}')
for k, v in {**JOBS, **PLACES}.items(): shared[k] = P(v)
C = {
 'ha': dict(people='Hausa', region='northern Nigeria (Arewa)', mum='a colourful atamfa wrapper and blouse with a matching mayafi veil over the head',
            dad='a clean flowing babban riga and an embroidered hula cap', boy='a clean jallabiya and a small hula cap', girl='a bright clean dress and a light hijab',
            elder_m='a white babban riga and a red-and-white turban', elder_f='an atamfa wrapper and a large mayafi veil',
            soup='a bowl of Hausa taushe soup, thick orange pumpkin and groundnut soup with spinach and pieces of meat'),
 'yo': dict(people='Yoruba', region='south-western Nigeria', mum='a traditional Yoruba iro and buba in aso-oke fabric with a tall matching gele head-tie',
            dad='a traditional Yoruba buba and sokoto with a matching fila cap', boy='a small Yoruba buba and sokoto with a fila cap', girl='a small iro and buba with a gele, hair in shuku braids',
            elder_m='a flowing agbada over buba and sokoto with a fila cap', elder_f='an iro and buba with a gele and coral beads',
            soup='a bowl of Yoruba efo riro, rich green spinach stew with peppers, pieces of meat and fish'),
 'ig': dict(people='Igbo', region='south-eastern Nigeria', mum='a george wrapper with a lace blouse, a tall head-tie and coral beads',
            dad='a patterned isiagu top with black trousers and a red okpu cap', boy='a small isiagu top and shorts', girl='a bright wrapper dress, hair in threaded isi owu style',
            elder_m='an isiagu top, a red okpu cap, coral beads and a walking stick', elder_f='a george wrapper, a blouse, a head-tie and coral beads',
            soup='a bowl of Igbo egusi soup, thick yellow melon-seed soup with green ugu leaves, beef and dried fish'),
 'sw': dict(people='Kenyan', region='Kenya, East Africa', mum='a bright kitenge dress and a matching head wrap',
            dad='a smart shirt and trousers', boy='a clean T-shirt and shorts', girl='a bright kitenge dress, hair neatly braided',
            elder_m='a shirt, a jacket and a cap, holding a walking stick', elder_f='a kanga wrapped over a dress and a head wrap',
            soup='a bowl of Kenyan beef stew, mchuzi wa nyama, with tomatoes and carrots'),
}
def lang(code):
    c = C[code]; pp, rg = c['people'], c['region']
    d = {
     'mama': f'portrait of a warm smiling {pp} mother in her thirties wearing {c["mum"]}, head and shoulders, plain warm background',
     'baba': f'portrait of a warm smiling {pp} father in his forties wearing {c["dad"]}, head and shoulders, plain warm background',
     'boy': f'portrait of a happy {pp} boy about eight years old wearing {c["boy"]}, head and shoulders, plain warm background',
     'girl': f'portrait of a happy {pp} girl about eight years old wearing {c["girl"]}, head and shoulders, plain warm background',
     'baby': f'one smiling {pp} toddler about two years old in clean clothes sitting on a woven mat at home',
     'grandmother': f'one smiling {pp} grandmother wearing {c["elder_f"]}, standing in front of her home in {rg}',
     'grandfather': f'one smiling {pp} grandfather wearing {c["elder_m"]}, standing in front of his home in {rg}',
     'uncle': f'one smiling {pp} man in his thirties wearing {c["dad"]}, standing in front of a house in {rg}',
     'aunt': f'one smiling {pp} woman in her thirties wearing {c["mum"]}, standing in front of a house in {rg}',
     'man': f'one {pp} man wearing {c["dad"]}, standing in front of a house in {rg}, full body',
     'woman': f'one {pp} woman wearing {c["mum"]}, standing in front of a house in {rg}, full body',
     'old_man': f'one {pp} old man with grey hair wearing {c["elder_m"]}, standing in front of his home in {rg}',
     'brother': f'a smiling {pp} boy about ten wearing {c["boy"]} giving his little sister a piggyback ride, the focus on the boy, at home in {rg}',
     'sister': f'a smiling {pp} girl about ten wearing {c["girl"]} holding her little brother\'s hand and helping him walk, the focus on the girl, at home in {rg}',
     'friend': f'two happy {pp} children, best friends, a boy wearing {c["boy"]} and a girl wearing {c["girl"]}, standing side by side with arms around each other',
     'teacher': f'one friendly {pp} teacher wearing {c["dad"]} standing beside a blackboard holding a piece of chalk in a classroom',
     'gown': f'one {pp} girl about eight wearing a long bright patterned gown, standing in front of a house in {rg}, full body',
     'scarf': f'one {pp} woman wearing a bright patterned headscarf tied on her head, shoulders-up portrait' if code != 'yo' else 'one Yoruba woman wearing a bright patterned headscarf (gele) tied on her head, shoulders-up portrait',
     'wrapper': f'a folded colourful wrapper cloth of the kind {pp} women wear, laid neatly on a plain surface' if code != 'sw' else 'a folded colourful kanga cloth, the East African women\'s wrapper, laid neatly on a plain surface',
     'miya': f'close-up of {c["soup"]}, only the bowl on a plain wooden table',
    }
    if code == 'sw':
        d.update({'soldier': 'one Kenya Defence Forces soldier in camouflage uniform with a Kenyan flag patch and beret, standing at ease, detailed uniform',
                  'policeman': 'one Kenya Police officer in a dark blue uniform, cap and badge, standing beside a road, detailed uniform',
                  'police_car': 'a white Kenya Police Land Cruiser pickup with a blue light bar, seen from the side on a road, no people',
                  'flag': 'one small Kenyan flag on a wooden school desk in a classroom, no people',
                  'tricycle': 'one tuk-tuk three-wheeler taxi parked on a Kenyan street, no people', 'motorcycle': 'one red boda boda motorcycle taxi parked on a Kenyan street, no people',
                  'bus': 'one brightly painted Kenyan matatu minibus parked on a street, no people', 'taxi': 'one white taxi car with a yellow stripe parked on a Kenyan street, no people'})
    return {k: P(v) for k, v in d.items()}
json.dump(shared, open('content/pictures/shared.json', 'w'), indent=1, ensure_ascii=False)
for code in C: json.dump(lang(code), open(f'content/pictures/{code}.json', 'w'), indent=1, ensure_ascii=False)
print('shared', len(shared), {c: len(lang(c)) for c in C})
