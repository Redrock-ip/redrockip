from pathlib import Path
from urllib.parse import urlsplit
import argparse, html, json, re
from pricing_display import coverage, starting_price
from purchase_display import build_purchase_data

parser=argparse.ArgumentParser(description='Build the matching purchase, billing, orders, referral and usage workspace pages.')
parser.add_argument('--root',type=Path,default=Path(__file__).resolve().parent.parent)
ROOT=parser.parse_args().root.resolve();DIST=ROOT/'dist'
pages={
 'purchase':('购买代理','workspace-purchase'),
 'recharge':('账户充值','workspace-recharge'),
 'orders':('订单记录','workspace-records'),
 'affiliate':('推广奖励','workspace-affiliate'),
 'usage':('用量统计','workspace-records')
}
service_products = {item['route']: item for item in json.loads((ROOT/'catalog-products.json').read_text())}
for route, product in service_products.items():
    pages[route] = (product['name'], 'workspace-service')
purchase_date = build_purchase_data(ROOT, service_products.values())
routes={
 '/dashboard/purchase':'/dashboard/purchase',
 '/dashboard/recharge':'/dashboard/recharge',
 '/dashboard/billing':'/dashboard/recharge',
 '/dashboard/orders':'/dashboard/orders',
 '/dashboard/affiliate':'/dashboard/affiliate',
 '/dashboard/usage':'/dashboard/usage'
}
routes.update({'/dashboard/'+route: '/dashboard/'+route for route in service_products})

pricing_reference = json.loads((ROOT/'data/pricing-reference.json').read_text())
price_labels = {}
price_translations = {}
for product in pricing_reference['products']:
    zh_price, en_price = starting_price(product)
    zh_region, en_region = coverage(product)
    price_labels[product['id']] = {'starting': zh_price, 'region': zh_region}
    price_translations.update({zh_price: en_price, zh_region: en_region})
purchase_script = DIST/'workspace-purchase.js'
purchase_source = purchase_script.read_text()
purchase_source, count = re.subn(
    r'(?m)^ const productPrices = .*?;\n',
    lambda _: ' const productPrices = ' + json.dumps(price_labels, ensure_ascii=False) + ';\n',
    purchase_source,
)
assert count == 1, 'Expected one generated purchase price index'
purchase_script.write_text(purchase_source)
(ROOT/'locales/workspace-pricing.json').write_text(json.dumps(price_translations, ensure_ascii=False, indent=2)+'\n')

def localize_workspace_links(source):
    source=re.sub(r'<a\b[^>]*href="https://(?:www\.)?redrock-ip.com/dashboard/cdk[^\"]*"[^>]*>.*?</a>','',source,flags=re.S)
    def anchor(match):
        tag=match.group();href=re.search(r'href="([^\"]*)"',tag)
        if not href:return tag
        url=href.group(1);parsed=urlsplit(url);text=re.sub('<[^>]*>','',tag)
        if parsed.netloc in ['redrock-ip.com','www.redrock-ip.com'] and parsed.path in routes:
            # Keep explicitly labelled original-site actions as external links.
            if 'workspace-original' in tag or '原站' in text:return tag
            destination=routes[parsed.path]+('?' + parsed.query if parsed.query else '')+('#'+parsed.fragment if parsed.fragment else '')
            tag=tag.replace(href.group(),'href="'+destination+'"',1)
            tag=re.sub(r' target="_blank"| rel="noopener(?: noreferrer)?"','',tag)
            if '<span>' in tag:tag=re.sub(r'<b aria-hidden="true">↗</b>','',tag)
        elif not parsed.scheme and not parsed.netloc and parsed.path:
            path=parsed.path
            if path=='dashboard.html':path='/dashboard'
            elif path=='./':path='/'
            elif not path.startswith('/'):path='/'+path
            destination=path+('?' + parsed.query if parsed.query else '')+('#'+parsed.fragment if parsed.fragment else '')
            tag=tag.replace(href.group(),'href="'+destination+'"',1)
        return tag
    return re.sub(r'<a\b[^>]*>.*?</a>',anchor,source,flags=re.S)

overview=DIST/'dashboard.html';source=localize_workspace_links(overview.read_text())
source=source.replace('原站操作 ↗','更多操作 ↗')
overview.write_text(source)
aside=re.search(r'<aside\b.*?</aside>',source,re.S).group()
header=re.search(r'<header\b.*?</header>',source,re.S).group()
footer=re.search(r'<footer\b.*?</footer>',source,re.S).group()
motion=re.search(r'<button class="motion-control".*?</button>',source,re.S).group()
widget=(ROOT/'contact-widget-template.html').read_text()
widget=widget.replace('src="contact-widget.js"','src="/contact-widget.js"').replace('src="assets/','src="/assets/').replace('href="assets/','href="/assets/')
aside=aside.replace('src="assets/','src="/assets/')

for key,(label,style) in pages.items():
    product = service_products.get(key)
    fragment=ROOT/'workspace-templates'/('service.html' if product else key+'.html')
    assert fragment.exists(),fragment
    page_aside=re.sub(r' aria-current="page"','',aside)
    def active(match):
        tag=match.group();href=re.search(r'href="([^\"]*)"',tag)
        if href and urlsplit(href.group(1)).path=='/dashboard/'+key:tag=tag.replace('<a ','<a aria-current="page" ',1)
        return tag
    page_aside=re.sub(r'<a\b[^>]*>',active,page_aside)
    page_header=header.replace('<strong>概览</strong>','<strong>'+label+'</strong>')
    page_header=page_header.replace('href="https://redrock-ip.com/dashboard"','href="https://redrock-ip.com/dashboard/'+key+('?'+'tab=dynamic'if key=='purchase'else'')+'"')
    # The localization shell is injected once by build-english.py.
    page_header=re.sub(r'<a class="language-switch".*?</a>','',page_header)
    document='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#050505"><meta name="robots" content="noindex"><title>LABEL · REDROCK</title><meta name="description" content="REDROCK LABEL设计预览。"><link rel="icon" href="/assets/logo.jpg"><link rel="stylesheet" href="/style.css"><link rel="stylesheet" href="/dashboard.css"><link rel="stylesheet" href="/workspace-pages.css"><link rel="stylesheet" href="/STYLE.css"><link rel="stylesheet" href="/contact-widget.css"></head><body class="workspace-page workspace-extension"><a class="skip-link" href="#main">跳转到控制台内容</a>ASIDE<button class="workspace-overlay" id="workspace-overlay" type="button" aria-label="关闭导航" tabindex="-1" hidden></button><div class="workspace-shell" id="workspace-shell">HEADER<main class="workspace-main" id="main" data-workspace-page="KEY">FRAGMENT</main>FOOTER</div>MOTION<script src="/workspace-shell.js"></script><script src="/workspace-KEY.js"></script>WIDGET</body></html>'''
    content = fragment.read_text()
    if key == 'purchase':
        content = content.replace('[[PURCHASE_DATE]]', purchase_date)
        document = document.replace('</head>', '<link rel="stylesheet" href="/payment-preview.css"></head>')
    if product:
        mode = {'dynamic': 'generate', 'mobile': 'generate', 'unlimited': 'bandwidth', 'short': 'batch'}.get(product['id'], 'resources')
        is_resource = mode == 'resources'
        placeholders = {
            'SERVICE_ID': product['id'], 'SERVICE_EYEBROW': product['en'],
            'SERVICE_NAME': product['name'], 'SERVICE_DESCRIPTION': product['desc'],
            'SERVICE_ACTION_TITLE': '选择示例资源' if is_resource else '设置示例配置',
            'SERVICE_ACTION': '查看示例资源' if is_resource else '生成示例配置',
            'SERVICE_RESULT_TITLE': '资源预览' if is_resource else '配置预览',
        }
        for placeholder, value in placeholders.items():
            content = content.replace('[['+placeholder+']]',html.escape(value))
        content = re.sub(r' data-service-fields="([^\"]+)"',
                         lambda match: match.group() if mode in match[1].split() else ' hidden'+match.group(), content)
        heading, separator, configuration = content.partition('<!-- SERVICE_CONFIGURATION -->\n')
        assert separator, 'Missing service configuration marker'
        if mode in ('generate', 'bandwidth'):
            unlimited = mode == 'bandwidth'
            view = (ROOT/'workspace-templates/traffic.html').read_text()
            details = (ROOT/'workspace-templates'/('traffic-unlimited.html' if unlimited else 'traffic-daily.html')).read_text()
            if mode == 'generate':
                analytics = (ROOT/'workspace-templates/traffic-analytics.html').read_text()
                details = analytics + '<div id="traffic-daily-fallback" hidden>' + details + '</div>'
                document = document.replace('<script src="/workspace-KEY.js"></script>',
                    '<script src="/workspace-traffic-details.js"></script><script src="/workspace-KEY.js"></script>')
            keys_tab = '<button type="button" role="tab" id="traffic-keys-tab" aria-selected="false" aria-controls="traffic-keys" tabindex="-1">已购买列表</button>' if unlimited else ''
            keys_panel = (ROOT/'workspace-templates/unlimited-keys.html').read_text() if unlimited else ''
            if unlimited:
                view = view.replace('代理配置','代理设置')
            configuration = configuration.replace(
                'href="/dashboard/usage?demo=1">查看演示用量', 'href="#traffic-usage">查看流量明细')
            content = (heading + view.replace('[[SERVICE_CONFIGURATION]]',configuration)
                .replace('[[TRAFFIC_DETAILS]]',details)
                .replace('[[UNLIMITED_KEYS_TAB]]',keys_tab)
                .replace('[[UNLIMITED_KEYS_PANEL]]',keys_panel))
            document = document.replace('<script src="/workspace-KEY.js"></script>',
                '<script src="/workspace-KEY.js"></script><script src="/workspace-usage.js"></script><script src="/workspace-traffic.js"></script>')
        else:
            content = heading + configuration
        document = document.replace('data-workspace-page="KEY"', f'data-workspace-page="service" data-service-mode="{mode}" data-service-product="{product["id"]}"')
    for token,value in [('LABEL',label),('STYLE',style),('KEY','service' if product else key),('ASIDE',page_aside),('HEADER',page_header),('FRAGMENT',content),('FOOTER',footer),('MOTION',motion),('WIDGET',widget)]:document=document.replace(token,value)
    if key in {'purchase', 'recharge', 'orders', 'usage'}:
        document = document.replace('</head>', '<link rel="stylesheet" href="/workspace-demo.css"></head>')
        script = f'<script src="/workspace-{key}.js"></script>'
        document = document.replace(script, '<script src="/workspace-demo.js"></script>' + script)
    (DIST/'dashboard').mkdir(exist_ok=True)
    (DIST/'dashboard'/(key+'.html')).write_text(document)
print('Built five workspace pages and removed the CDK link; overview navigation now opens the matching local preview pages.')
