import urllib.request, urllib.parse, base64, json, sys, time

# Expanded bank of common northern-Nigerian / Hausa names, spoken in the Hausa voice.
NAMES = [
    # male
    "Musa","Ibrahim","Aliyu","Yusuf","Sani","Abubakar","Bello","Umar","Usman","Bala",
    "Sule","Garba","Aminu","Nasiru","Auwal","Kabir","Idris","Lawal","Haruna","Shehu",
    "Ahmad","Sadiq","Danladi","Murtala","Abdullahi","Isa","Salisu","Mustapha","Nuhu","Adamu",
    "Suleiman","Aliyu","Kamal","Faruk","Tijjani","Yakubu","Zubairu","Habibu","Aminu","Rabiu",
    "Sanusi","Bashir","Hamza","Jibril","Kabiru","Lawan","Maikudi","Nazifi"," Shafi'i".strip(),"Tanko",
    "Uba","Wada","Yahaya","Zakari","Ashiru","Buhari","Danjuma","Gambo","Hassan","Husaini",
    # female
    "Aisha","Fatima","Zainab","Hauwa","Amina","Halima","Maryam","Ladi","Sadiya","Nafisa",
    "Khadija","Hafsat","Rukayya","Bilkisu","Maimuna","Hadiza","Jamila","Saratu","Asmau","Zulai",
    "Balkisu","Fadima","Gambo","Habiba","Jummai","Karima","Lubabatu","Maryamu","Naja'atu","Rahama",
    "Safiya","Talatu","Umma","Yalwa","Zahra'u","Adama","Binta","Delu","Fauziya","Gimbiya",
    "Hasana","Husaina","Innah","Jamilatu","Kubra","Larai","Mairo","Nana","Rakiya","Sakina",
    "Tasallah","Uwani","Wasila","Yagana","Zubaida","Amsatou","Hussaina","Salamatu","Zaharau","Rashida",
]

def fetch(text):
    q = urllib.parse.quote(text)
    url = f"https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ha&q={q}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    return urllib.request.urlopen(req, timeout=30).read()

out = {}
seen = set()
for n in NAMES:
    key = n.lower().strip()
    if not key or key in seen: continue
    seen.add(key)
    for _ in range(3):
        try:
            out[key] = "data:audio/mpeg;base64," + base64.b64encode(fetch(n)).decode(); break
        except Exception as e:
            print("retry", n, e, file=sys.stderr); time.sleep(1)

json.dump(out, open("/Users/sani/Documents/kratu/names_audio.json", "w"))
print("names:", len(out), "KB:", round(sum(len(v) for v in out.values()) / 1024), file=sys.stderr)
