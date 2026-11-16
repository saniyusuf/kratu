# Popular given names from across Nigeria, and common English (and Bible) given names, so a child whose name is not a
# northern name can still be matched to the names bank and greeted by name (Sani 2026-11-16).
# northern_names.py keeps the Hausa / Fulani / Kanuri / Nupe list; this file adds Yoruba, Igbo, other southern and
# Middle Belt names, and English names, with common spelling variants. build() returns every name once (lower-cased key).
from northern_names import MALE as NORTH_M, FEMALE as NORTH_F, clean

YORUBA_M = """
Ayodele Ayomide Ayokunle Ayotunde Ayobami Adebayo Adeyemi Adewale Adeola Adekunle Adeniyi Adedayo Adeleke Adegoke Adetokunbo
Akinwale Akinola Akintunde Akinlabi Babatunde Babajide Babafemi Femi Olufemi Funsho Kayode Kehinde Taiwo Idowu Segun Olusegun
Tunde Olatunde Tunji Olatunji Wale Olawale Kunle Olakunle Dapo Oladapo Gbenga Gbolahan Bolaji Lanre Olanrewaju Seun Oluwaseun
Tobi Tobiloba Tolu Toluwalope Damilare Dayo Dotun Ebun Emeka Fela Folarin Gbemi Ibukun Ifeoluwa Jide Kolade Kola Kolawole Korede
Laolu Mayowa Niyi Oladele Oladipo Olaide Olumide Oluwatobi Oluwadamilare Oluwafemi Oluwakayode Oluwole Opeyemi Sola Olusola
Tayo Temitope Tope Timilehin Toyin Yemi Oluyemi Kayode Ademola Afolabi Ajibola Akande Alade Amusan Bamidele Bayo Bode
Dele Deji Demilade Ebunoluwa Fiyinfoluwa Inioluwa Iyanuoluwa Kolapo Morakinyo Ninioluwa Obafemi Ogunleye Olabode Olamide
Oladimeji Olajide Olalekan Olamilekan Olaniyi Olarewaju Olasunkanmi Olatoye Oludare Oludayo Olugbenga Olujimi Olukayode Olumuyiwa
Oluseyi Oluwadamilola Oluwagbemiga Oluwanifemi Oluwaseyi Oluwatimilehin Oluwatosin Pelumi Remi Sanmi Sunkanmi Taye Teniola
Tomiwa Wasiu Yinka Yusuf Abiodun Abiola Akinyemi Adeoye Adesina Adeyinka Ajayi Alani Ayinde Dare Durojaiye Ifeanyi Kunmi Lekan
""".split()

YORUBA_F = """
Ayomide Ayobami Ayodeji Adebola Adeola Adenike Adesuwa Adetola Adunni Aduke Ajoke Alake Ayoola Bisola Bisi Bimbo Bolanle Bukola
Bunmi Busola Damilola Dolapo Doyin Ebunoluwa Eniola Enitan Feyisara Fiyin Folake Folasade Funke Funmi Funmilayo Funmilola
Ibukunoluwa Ifeoluwa Ireoluwa Iyabo Jumoke Kemi Kemisola Kike Kikelomo Lola Lolade Modupe Moji Mojisola Morenike Moyosore Ngozi
Nifemi Omolara Omotola Omowunmi Oyinda Oyindamola Oyinkansola Oluwaseun Oluwakemi Oluwatobiloba Opeyemi Remilekun Ronke
Sade Simisola Simi Sola Taiwo Kehinde Temilade Temitope Tinuke Titilayo Titi Toke Tolani Tolu Toluwani Tomi Tomiwa Tope Toyin
Wuraola Wunmi Yetunde Yewande Yinka Yemisi Abike Abimbola Adeyinka Adesola Aramide Ayoka Bolatito Busayo Desola Demilade
Eyitayo Fadeke Folashade Ireti Iretioluwa Itunu Kanyinsola Mayowa Mojolaoluwa Moradeun Morenikeji Motunrayo Ololade Omolola
Oreoluwa Oyinlola Teniola Tiwalade Tiwatope Tobiloba Toluwalope Adejoke Atinuke Bukunmi Damilare Fisayo Jadesola Labake Kofoworola
""".split()

IGBO_M = """
Chukwuemeka Emeka Chukwudi Chidi Chinedu Nedu Chibuike Chibuzo Chibuzor Chidiebere Chidiebube Chiemeka Chigozie Gozie Chijioke
Chikezie Chimezie Chinonso Nonso Chukwuma Chukwunonso Chukwuebuka Ebuka Chukwudalu Dalu Ifeanyi Ikenna Ikechukwu Ike Kelechi Kene
Kenechukwu Nnamdi Obinna Obiora Obi Okechukwu Okey Onyekachi Onyeka Onyekachukwu Somto Somtochukwu Tochukwu Tochi Uche Uchenna
Uchechukwu Ugochukwu Ugo Arinze Azubuike Chukwudubem Dubem Ebube Ekene Ekenedilichukwu Emeka Izuchukwu
Jideofor Kamsiyochukwu Kamsi Kosisochukwu Kosi Munachimso Munachi Nnaemeka Nwachukwu Obioma Odinaka Ogechukwu Olisa Olisaemeka
Onyedika Onyebuchi Ozioma Somadina Ugonna Amaechi Anayo Anozie Chiazor Chibueze Chidozie Chijindu Chinemerem
Chinwendu Chisom Chukwuka Chukwunwike Ebere Echezona Ejike Ekene Emeka Ezenwa Ifechukwu Ikemefuna Ndubuisi Nkem Nnanna Nnaji
Obiajulu Obumneme Okafor Okwudili Onuoha Osita Ositadimma Uzoma Uzochukwu Zikora
""".split()

IGBO_F = """
Adaeze Adaobi Adaora Adanna Ada Amaka Chiamaka Nwamaka Amarachi Ijeoma Ifeoma Ifeyinwa Chioma Chinwe Chinyere Chinenye Chidinma
Chidimma Chinonye Chinazom Chika Chisom Chizoba Ebere Ezinne Ezinwanne Ginika Ginikachukwu Ifunanya Ijeamaka Kosisochukwu Munachi
Ngozi Nkechi Nkiru Nneka Nnenna Nkemdilim Obiageli Oge Ogechi Oluchi Onyinye Onyinyechi Uchechi Uju Ujunwa Ugochi Ugonma Urenna
Adaku Adaugo Akunna Amaechi Amara Anulika Anwuli Asika Chiadikobi Chidera Chiebuka Chinasa Chinelo Chinemerem Chinwendu Chiomachukwu
Ebube Ebubechukwu Echezona Ekwutosi Enyinnaya Eziamaka Ifechi Ifenna Ihuoma Kamsi Kasarachi Kelechi Mmesoma Mmachi Munachimso
Nkemjika Nnedi Nwakaego Obioma Odinaka Ogechukwu Olachi Onyedikachi Oluomachi Somkenechukwu Tochi Ugonna Uloma Zikora Zina
""".split()

OTHER_M = """
Osaze Osagie Osaro Efosa Eghosa Ehis Ehimen Ehigie Iyobosa Nosa Osas Oghenekaro Oghenero Oghenetega Ogheneovo Onome Ovie
Tega Ejiro Erhuvwu Akpan Bassey Effiong Ekpo Etim Edet Okon Ubong Uduak Ime Imoh Aniekan Emem Kufre Mfon Nsikak Ita Asuquo
Ebiye Ebi Preye Tari Tamuno Tamunotonye Boma Ibim Dappa Ayebatari Doubra Tonye Sotonye Ibiye Terver Terdoo Tersoo Aondona
Aondohemba Msughter Orduen Iorwuese Torkuma Agbo Ochai Ojo Ali Idoko Ameh Oche Ojonugwa Ejembi Ogbole Onah Igwe Ugwu Ene
Danjuma Gyang Pam Dachung Chollom Davou Dung Bitrus Kefas Ishaku Yakubu Garba Bulus
""".split()

OTHER_F = """
Osarugue Osaretin Efe Eseosa Esohe Ivie Iveoma Nosakhare Osayuki Uyi Uwa Oghenekaro Oghenerukevwe Onome Ejiro Ese Eseoghene
Mercy Ufuoma Edikan Emem Ekaette Idara Imaobong Inemesit Itoro Mfon Nkoyo Ndifreke Uduak Unwana Ebiere Ebiye Ere Ibiere
Ibinabo Opuene Pere Tamunoibi Boma Doye Ngodoo Mwuese Doosuur Doofan Seember Hembadoon Ene Ojonoka Ojoma Ladi Kaneng Lami
Rifkatu Saratu Hannatu Kande Asabe
""".split()

ENGLISH_M = """
David Daniel Samuel Joseph John James Peter Paul Michael Emmanuel Gabriel Raphael Benjamin Jonathan Joshua Isaac Jacob Abraham
Moses Aaron Elijah Elisha Solomon Stephen Andrew Philip Thomas Matthew Mark Luke Timothy Titus Simon Nathaniel Nathan Caleb
Gideon Ezekiel Ezra Nehemiah Jeremiah Isaiah Hezekiah Josiah Jesse Joel Micah Noah Seth Adam Victor Vincent Charles George
William Henry Edward Richard Robert Christopher Christian Kenneth Patrick Anthony Augustine Francis Frank Fred Frederick Felix
Godwin Godfrey Goodluck Gift Precious Prince Promise Praise Favour Blessing Wisdom Kingsley King Lucky Sunday Monday Friday
Clement Collins Desmond Dennis Edwin Elvis Eric Ernest Eugene Evans Harrison Henry Hillary Innocent Jerry Justin Kelvin Kevin
Lawrence Leonard Martin Maxwell Michael Nelson Oliver Oscar Patrick Paul Raymond Reginald Ronald Rufus Silas Sylvester Tony
Valentine Wilson Alexander Albert Alfred Ben Brian Bright Cyril Derek Dominic Douglas Edmund Felix Hope Ifeanyi Ivan Jerome
Joel Joe Jude Julius Kenny Leo Marcus Mike Nicholas Obed Owen Ryan Sam Scott Smart Ted Tim Tom Walter Zachary Zion
""".split()

ENGLISH_F = """
Mary Elizabeth Esther Ruth Deborah Rebecca Sarah Rachel Leah Hannah Miriam Naomi Abigail Dorcas Martha Lydia Priscilla Eunice
Grace Mercy Faith Hope Joy Peace Patience Blessing Favour Precious Gift Comfort Charity Glory Goodness Victoria Gloria Joyce
Janet Jennifer Jessica Jane Joan Josephine Judith Juliet Julia Christiana Christine Cynthia Diana Dorothy Florence Gladys Helen
Irene Isabella Lilian Linda Lucy Margaret Monica Nancy Patricia Pauline Phoebe Rose Rosemary Ruth Sandra Sharon Stella Susan
Theresa Vanessa Veronica Vivian Angela Anna Annabel Beatrice Bridget Caroline Catherine Cecilia Chloe Clara Dora Edith Ella
Emily Emma Evelyn Felicia Frances Grace Harriet Ivy Jacinta Kate Laura Lilian Lois Lovely Mabel Mariam Matilda Maureen Mildred
Mirabel Miracle Nora Olivia Pamela Pearl Princess Queen Regina Rita Roseline Sophia Success Tabitha Tracy Ursula Vera Winifred
""".split()

GROUPS = (("m", NORTH_M), ("f", NORTH_F), ("m", YORUBA_M), ("f", YORUBA_F), ("m", IGBO_M), ("f", IGBO_F),
          ("m", OTHER_M), ("f", OTHER_F), ("m", ENGLISH_M), ("f", ENGLISH_F))

def build():
    """Every name once, as (key, spoken name, gender). A name used for both boys and girls keeps the gender of the
    list it first appears in; the gender only picks a default, the child's own choice always wins."""
    seen, out = set(), []
    for g, lst in GROUPS:
        for n in lst:
            n = clean(n)
            if len(n) < 2: continue
            k = n.lower()
            if k in seen: continue
            seen.add(k); out.append((k, n, g))
    return out

if __name__ == "__main__":
    names = build()
    print(len(names), "unique;", sum(1 for _, _, g in names if g == 'm'), "male,", sum(1 for _, _, g in names if g == 'f'), "female")
