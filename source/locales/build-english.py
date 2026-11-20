from pathlib import Path
import posixpath
import argparse, json, re, shutil, subprocess
from urllib.parse import urlsplit

HERE = Path(__file__).resolve().parent
parser = argparse.ArgumentParser(description='Regenerate the English site from Chinese source pages and locale maps.')
parser.add_argument('--root', type=Path, default=HERE.parent if HERE.name == 'locales' else Path('/workspace/sites/redrock'))
ROOT = parser.parse_args().root.resolve()
DIST = ROOT / 'dist'
WORK = HERE
EN = DIST / 'en'
EN.mkdir(exist_ok=True)
account_builder = ROOT / 'scripts/build-account-pages.py'
if account_builder.exists():
    subprocess.run(['python', str(account_builder), '--root', str(ROOT)], check=True)
workspace_builder = ROOT / 'scripts/build-workspace-pages.py'
if workspace_builder.exists():
    subprocess.run(['python', str(workspace_builder), '--root', str(ROOT)], check=True)
nav_builder = ROOT / 'scripts/build-nav-menus.py'
if nav_builder.exists():
    subprocess.run(['python', str(nav_builder), '--root', str(ROOT)], check=True)

# Keep translations as tracked source data so subsequent edits can be regenerated.
locale_source = ROOT / 'locales'
locale_source.mkdir(exist_ok=True)
translations = {}
groups = ['marketing', 'company', 'account', 'account-recovery', 'tools', 'navigation']
groups += sorted(p.stem for p in WORK.glob('workspace*.json'))
groups += ['common', 'corrections']
for group in groups:
    path = WORK / (group + '.json')
    if path.exists():
        data = json.loads(path.read_text())
        assert isinstance(data, dict), path
        translations.update(data)
        target = locale_source / path.name
        if path.resolve() != target.resolve():
            shutil.copyfile(path, target)
keys = sorted(translations, key=len, reverse=True)
# One pass avoids replacing a short source string inside an already translated value.
pattern = re.compile('|'.join(re.escape(k) for k in keys))
def translate(text):
    return pattern.sub(lambda m: translations[m.group()], text)

tools_old = '<div class="footer-group"><span>检测工具</span><a href="proxy-checker.html">代理检测</a><a href="device-checker.html">设备检测</a><a href="faq.html">常见问题</a></div>'
tools_new = '<div class="footer-group"><span>检测工具</span><a href="proxy-checker.html">代理检测</a><a href="device-checker.html">设备检测</a></div><div class="footer-group footer-support"><span>帮助与支持</span><a href="faq.html">常见问题</a><a href="contact.html">联系咨询</a></div>'
company_old = '<div class="footer-group"><span>REDROCK</span><a href="about.html">关于我们</a><a href="contact.html">联系咨询</a><a href="brand-assets.html">品牌资源</a></div>'
company_new = '<div class="footer-group"><span>REDROCK</span><a href="about.html">关于我们</a><a href="brand-assets.html">品牌资源</a></div>'

def locale_link(page, english):
    route = '' if page == 'index' else page
    target = '/' + route if english else '/en/' + route
    label, lang, aria = ('中文', 'zh-CN', 'Switch to Chinese') if english else ('EN', 'en', '切换为英文')
    return f'<a class="language-switch" data-language-switch href="{target}" hreflang="{lang}" lang="{lang}" aria-label="{aria}">{label}</a>'

def add_language(html_text, page, english):
    link = locale_link(page, english)
    # A single visible switch also works on the login, dashboard and asset pages.
    for hook in ['<div class="header-actions">', '<div class="auth-header-actions">', '<div class="workspace-header-right">']:
        if hook in html_text:
            return html_text.replace(hook, hook + link, 1)
    return re.sub(r'(</header>)', link + r'\1', html_text, count=1)

source_pages = sorted(p for p in DIST.rglob('*.html') if EN not in p.parents)
loading_css = '<link data-navigation-loading rel="stylesheet" href="/loading-spinner.css">'
loading_script = '<script data-navigation-loading src="/navigation-loading.js"></script>'
loading_excluded = {'dashboard/purchase', 'payment-preview', 'payment-options', 'loading-options'}
for page in source_pages:
    relative = page.relative_to(DIST)
    route = '' if relative.as_posix() == 'index.html' else relative.with_suffix('').as_posix()
    if route == 'blog' or route.startswith('blog/'):
        continue
    english_path = EN / relative
    english_path.parent.mkdir(parents=True, exist_ok=True)
    source = page.read_text()
    source = source.replace(tools_old, tools_new).replace(company_old, company_new)
    # Strip only our own injected locale shell to allow repeatable regeneration.
    source = re.sub(r'<a class="language-switch".*?</a>', '', source)
    source = re.sub(r'<link[^>]+data-locale-alternate[^>]*>', '', source)
    source = re.sub(r'<link rel="stylesheet" href="(?:\.?\.?/)*locale.css">', '', source)
    source = source.replace('<link rel="stylesheet" href="/locale.css">', '')
    source = re.sub(r'<script src="(?:\.?\.?/)*language-switch.js"></script>', '', source)
    source = source.replace('<script src="/language-switch.js"></script>', '')
    source = source.replace(loading_css, '').replace(loading_script, '')
    if route not in loading_excluded:
        source = source.replace('</head>', loading_css + '</head>')
        source = source.replace('</body>', loading_script + '</body>')
    alternates = f'<link data-locale-alternate rel="alternate" hreflang="zh-CN" href="/{route}"><link data-locale-alternate rel="alternate" hreflang="en" href="/en/{route}">'
    asset_prefix = '' if page.parent == DIST else '/'
    source = source.replace('</head>', alternates + f'<link rel="stylesheet" href="{asset_prefix}locale.css"></head>')
    source = source.replace('</body>', f'<script src="{asset_prefix}language-switch.js"></script></body>')
    page.write_text(add_language(source, route or 'index', False))

    english = translate(source).replace('lang="zh-CN"', 'lang="en"', 1)
    # Resolve assets from the source page, including nested dashboard routes.
    # Page links retain the same tree under /en/; CSS/images/downloads are shared.
    def localize_tag(match):
        tag = match.group()
        tag_name = re.match(r'<([\w:-]+)', tag).group(1).lower()
        if 'data-locale-alternate' in tag:return tag
        def localize_url(url_match):
            attr, url = url_match.group(1), url_match.group(2)
            parsed = urlsplit(url)
            if parsed.scheme or parsed.netloc or not parsed.path:return url_match.group()
            target = (DIST / parsed.path.lstrip('/')) if parsed.path.startswith('/') else (page.parent / parsed.path)
            target = target.resolve()
            if not target.is_relative_to(DIST):return url_match.group()
            if target.is_dir():
                target = (target / 'index.html') if (target / 'index.html').exists() else target.with_suffix('.html')
            elif not target.exists() and not target.suffix:target = target.with_suffix('.html')
            suffix = ('?' + parsed.query if parsed.query else '') + ('#' + parsed.fragment if parsed.fragment else '')
            if tag_name == 'a' and target.suffix == '.html' and target.exists():
                value = '/en' + url if parsed.path.startswith('/') else url
                return attr + '="' + value + '"'
            if not target.exists():return url_match.group()
            asset_relative = target.relative_to(DIST).as_posix()
            if target.suffix == '.js' and target.name != 'language-switch.js':
                asset = '/en/' + asset_relative
            elif target.suffix != '.html':
                asset = '/' + asset_relative
            else:return url_match.group()
            if parsed.path.startswith('/'):
                value = asset + suffix
            else:
                english_directory = '/' + english_path.parent.relative_to(DIST).as_posix()
                value = posixpath.relpath(asset, english_directory) + suffix
            return attr + '="' + value + '"'
        return re.sub(r'\b(href|src)="([^\"]+)"', localize_url, tag)
    english = re.sub(r'<(?:a|link|img|script|source|iframe|use)\b[^>]*>', localize_tag, english)
    english = add_language(english, route or 'index', True)
    english_path.write_text(english)

for script in sorted(p for p in DIST.rglob('*.js') if EN not in p.parents):
    if script.name in {'language-switch.js', 'blog.js'}:
        continue
    english = translate(script.read_text()).replace("'zh-CN'", "'en-US'").replace('"zh-CN"', '"en-US"')
    output = EN / script.relative_to(DIST)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(english)
data = ROOT / 'catalog-products.json'
if data.exists():
    (locale_source / 'catalog-products.en.json').write_text(translate(data.read_text()))
if Path(__file__).resolve() != (locale_source / 'build-english.py').resolve():
    shutil.copyfile(__file__, locale_source / 'build-english.py')
blog_builder = ROOT / 'scripts/build-blog.py'
if blog_builder.exists():
    subprocess.run(['python', str(blog_builder), '--root', str(ROOT)], check=True)
print(f'Generated {len(list(EN.rglob("*.html")))} English pages and {len(list(EN.rglob("*.js")))} localized scripts from {len(translations)} translations.')
