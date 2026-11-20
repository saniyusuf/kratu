#!/usr/bin/env python3
"""Turn the redesign page into the live www.kratu.ng document: real head, no review bar."""
import os,re,shutil,sys,datetime
SRC=sys.argv[1]; OUT=sys.argv[2]
s=open(os.path.join(SRC,'index.html'),encoding='utf-8').read()
# drop the review bar (sample only) and its CSS
i=s.index('<div class="rv" role="note">'); j=s.index('</div></div>',i)+len('</div></div>')
s=s[:i]+s[j:]
s=re.sub(r'/\* review bar: sample only \*/\n(\.rv[^\n]*\n)+','',s)
s=s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n','')
title='Kratu: learn to read English from the language you already speak'
s=s.replace('<title>Kratu website redesign</title>','',1)
cut=s.index('<svg width="0" height="0"')
head,body=s[:cut],s[cut:]
HEAD=f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<link rel="canonical" href="https://www.kratu.ng/">
<meta property="og:site_name" content="Kratu">
<meta property="og:type" content="website">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Children laughing around a Kratu tablet">
<meta name="twitter:image" content="https://www.kratu.ng/assets/og-main.jpg">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
'''
doc=HEAD+head.strip()+'\n</head>\n<body>\n'+body.strip()+'\n</body>\n</html>\n'
assert 'Redesign sample' not in doc and 'class="rv"' not in doc
if os.path.isdir(os.path.join(OUT,'a')): shutil.rmtree(os.path.join(OUT,'a'))
os.makedirs(OUT,exist_ok=True)
open(os.path.join(OUT,'index.html'),'w',encoding='utf-8').write(doc)
shutil.copytree(os.path.join(SRC,'a'),os.path.join(OUT,'a'))
os.makedirs(os.path.join(OUT,'assets'),exist_ok=True)
shutil.copy(os.path.join(SRC,'a','og-main.jpg'),os.path.join(OUT,'assets','og-main.jpg'))
open(os.path.join(OUT,'manifest.webmanifest'),'w').write('''{
  "name": "Kratu",
  "short_name": "Kratu",
  "description": "Learn to read English from the language you already speak.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F7EDD6",
  "theme_color": "#F7EDD6",
  "icons": [
    { "src": "/assets/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/assets/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
''')
open(os.path.join(OUT,'robots.txt'),'w').write('User-agent: *\nAllow: /\n\nSitemap: https://www.kratu.ng/sitemap.xml\n')
open(os.path.join(OUT,'sitemap.xml'),'w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://www.kratu.ng/</loc><lastmod>%s</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n'%datetime.date.today().isoformat())
print('ok',len(doc))
