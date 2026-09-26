"""Static acceptance checks using only the Python standard library."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote
import json
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.links, self.metas, self.canonicals = [], [], {}, []
        self.h1, self.json_text, self.in_json = 0, [], False
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'h1':
            self.h1 += 1
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag == 'meta':
            self.metas[a.get('name', a.get('property'))] = a.get('content')
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonicals.append(a['href'])
        if tag == 'script' and a.get('type') == 'application/ld+json':
            self.in_json = True
        if tag == 'img':
            assert a.get('width') and a.get('height') and 'alt' in a

    def handle_data(self, text):
        if self.in_json:
            self.json_text.append(text)

    def handle_endtag(self, tag):
        if tag == 'script' and self.in_json:
            json.loads(''.join(self.json_text))
            self.in_json, self.json_text = False, []


base = 'https://glauberbarcelos.com.br/'
pages = {p.name: Page(p.read_text()) for p in Path('.').glob('*.html')}
ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap = ET.parse('sitemap.xml')
urls = [x.text for x in sitemap.findall('s:url/s:loc', ns)]
assert len(urls) == len(set(urls)) == len(pages)
descriptions = []
for file, page in pages.items():
    canonical = base + ('' if file == 'index.html' else file)
    assert page.canonicals == [canonical] and canonical in urls, file
    assert page.metas['og:url'] == canonical, file
    assert 'noindex' not in page.metas.get('robots', ''), file
    assert page.h1 == 1 and len(page.ids) == len(set(page.ids)), file
    descriptions.append(page.metas['description'])
    for link in page.links:
        u = urlparse(link)
        if u.scheme or u.netloc:
            continue
        target = unquote(u.path) or file
        assert Path(target).exists(), (file, link)
        if u.fragment:
            assert unquote(u.fragment) in pages[target].ids, (file, link)
assert len(descriptions) == len(set(descriptions))
robots = Path('robots.txt').read_text()
assert 'Sitemap: ' + base + 'sitemap.xml' in robots
assert 'User-agent: *\nAllow: /' in robots
print(f'PASS: {len(pages)} pages, unique H1/metadata, schemas, images, internal links, sitemap, canonicals and robots.')
