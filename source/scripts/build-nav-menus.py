from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
import argparse, html, json, re
from pricing_display import coverage, starting_price

parser = argparse.ArgumentParser(description='Build bilingual-ready pricing and tools navigation from verified public plan references.')
parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parent.parent)
ROOT = parser.parse_args().root.resolve()
DIST = ROOT / 'dist'
products = json.loads((ROOT / 'catalog-products.json').read_text())
evidence = json.loads((ROOT / 'data/pricing-reference.json').read_text())
checked = datetime.fromisoformat(evidence['checked_at_utc']).astimezone(ZoneInfo('Asia/Shanghai'))
short_date = checked.strftime('%Y.%m.%d')
date_zh = f'{checked.year} 年 {checked.month} 月 {checked.day} 日'
date_en = checked.strftime('%B ') + str(checked.day) + checked.strftime(', %Y')
prices = {p['id']: p for p in evidence['products']}
translations = {}
def word(zh, en):
    translations[zh] = en
    return html.escape(zh)

# Keep product descriptions short enough to scan in the header.
copy = {
 'dynamic': ('轮换住宅出口，用于数据采集与市场观察。', 'Rotating residential exits for data collection and market research.'),
 'static': ('固定住宅出口，适合持续会话。', 'Fixed residential exits for persistent sessions.'),
 'mobile': ('移动网络连接，用于应用与页面测试。', 'Mobile network connections for app and page testing.'),
 'datacenter': ('机房网络出口，用于常规自动化任务。', 'Datacenter exits for routine automation tasks.'),
 'static-daily': ('按日安排的固定住宅 IP 套餐。', 'Fixed residential IP packages for daily tasks.'),
 'live': ('面向直播任务的地区连接配置。', 'Regional connection plans for live streaming.'),
 'unlimited': ('按带宽与时长规划代理访问。', 'Plan proxy access by bandwidth and duration.'),
 'short': ('按 IP 额度生成短效住宅代理。', 'Generate short-term residential proxies from an IP allowance.')
}
product_source = (DIST / 'products.html').read_text()
icons = {}
for product in products:
    match = re.search(r'<article[^>]*id="' + re.escape(product['id']) + r'".*?(<svg\b.*?</svg>)', product_source, re.S)
    assert match, product['id']
    icons[product['id']] = match.group(1)

def pricing_menu(active):
    cards = []
    for product in products:
        key = product['id']
        desc, desc_en = copy[key]
        price = prices[key]
        cards.append(f'<a class="mega-product" href="pricing.html#price-{key}" data-mega-product="{key}"><span class="mega-product-top"><span class="mega-icon" aria-hidden="true">{icons[key]}</span><span class="mega-product-name">{html.escape(product["name"])}</span><b aria-hidden="true">↗</b></span><span class="mega-description">{word(desc,desc_en)}</span><span class="mega-price"><strong>{word(*starting_price(price))}</strong></span><span class="mega-condition">{word(*coverage(price))}</span></a>')
    current = ' aria-current="page"' if active else ''
    cls = ' is-active' if active else ''
    return '<!-- REDROCK-PRICING-MENU:START --><details class="nav-dropdown pricing-mega'+cls+'"><summary id="nav-pricing-label" aria-controls="nav-pricing-panel"'+current+'>价格</summary><div class="mega-panel pricing-mega-panel" id="nav-pricing-panel"><div class="mega-heading"><div><span class="mega-eyebrow">08 / PROXY PLANS</span><h2>'+word('按任务，找到合适的套餐。','Find a plan for your task.')+'</h2></div><span class="mega-reference-date">'+word('参考起价 · '+short_date,'Starting prices · '+short_date)+'</span></div><div class="mega-product-grid">'+''.join(cards)+'</div><div class="mega-footer"><p>'+word('实际价格与可用地区以原站为准。','Check the original site for current prices and available locations.')+'</p><a href="pricing.html#all-product-pricing">'+word('查看全部定价','View all pricing')+' <span aria-hidden="true">↗</span></a></div></div></details><!-- REDROCK-PRICING-MENU:END -->'

def tools_menu(active_page):
    active = active_page in ['proxy-checker','device-checker']
    cls = ' is-active' if active else ''
    markup = '<!-- REDROCK-TOOLS-MENU:START --><details class="nav-dropdown tools-mega'+cls+'"><summary id="nav-tools-label" aria-controls="nav-tools-panel">检测工具</summary><div class="mega-panel tools-mega-panel" id="nav-tools-panel"><div class="mega-heading"><div><span class="mega-eyebrow">02 / CONNECTION TOOLS</span><h2>'+word('先检查，再开始。','Check before you connect.')+'</h2></div></div><div class="mega-tools-grid"><a class="mega-tool" href="proxy-checker.html"><span class="mega-tool-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 17h16M8 3 4 7l4 4-4 4"/><path d="M12 7v10"/></svg></span><strong>代理检测 <span aria-hidden="true">↗</span></strong><p>'+word('批量检查代理地址、端口、协议与认证格式。','Check proxy addresses, ports, protocols and authentication syntax.')+'</p><span class="mega-tool-note">'+word('本页核对格式；真实连通性在原站检测。','Local syntax checks; test live connections on the original site.')+'</span></a><a class="mega-tool" href="device-checker.html"><span class="mega-tool-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="12" rx="2"/><path d="M8 21h8M12 15v6M6 7h5M15 7h3M6 11h12"/></svg></span><strong>设备检测 <span aria-hidden="true">↗</span></strong><p>'+word('核对静态住宅代理的在线设备查询配置。','Check the settings needed to query connected proxy devices.')+'</p><span class="mega-tool-note">'+word('在线设备数量与刷新结果由原站提供。','Live device counts and refresh results are available on the original site.')+'</span></a></div><div class="mega-footer"><p>'+word('用于接入前检查与连接问题排查。','Tools for setup checks and connection troubleshooting.')+'</p><a href="faq.html">'+word('查看接入常见问题','Read setup FAQs')+' <span aria-hidden="true">↗</span></a></div></div></details><!-- REDROCK-TOOLS-MENU:END -->'
    if active:markup = markup.replace('href="'+active_page+'.html"', 'href="'+active_page+'.html" aria-current="page"', 1)
    return markup

for page in DIST.glob('*.html'):
    source = page.read_text()
    if '<nav id="nav"' not in source:continue
    start = source.index('<header'); end = source.index('</header>',start)+len('</header>')
    header = source[start:end]
    pricing = pricing_menu(page.stem=='pricing')
    tools = tools_menu(page.stem)
    if '<!-- REDROCK-PRICING-MENU:START -->' in header:
        header = re.sub(r'<!-- REDROCK-PRICING-MENU:START -->.*?<!-- REDROCK-PRICING-MENU:END -->',lambda _:pricing,header,flags=re.S)
    else:
        header,n = re.subn(r'<a href="pricing.html"[^>]*>价格</a>',lambda _:pricing,header,count=1)
        assert n==1,page
    if '<!-- REDROCK-TOOLS-MENU:START -->' in header:
        header = re.sub(r'<!-- REDROCK-TOOLS-MENU:START -->.*?<!-- REDROCK-TOOLS-MENU:END -->',lambda _:tools,header,flags=re.S)
    else:
        header,n = re.subn(r'<details class="nav-dropdown[^\"]*"><summary>检测工具</summary>.*?</details>',lambda _:tools,header,count=1,flags=re.S)
        assert n==1,page
    source=source[:start]+header+source[end:]
    if 'href="nav-menus.css"' not in source:source=source.replace('</head>','<link rel="stylesheet" href="nav-menus.css"></head>')
    if 'src="nav-menus.js"' not in source:source=source.replace('</body>','<script src="nav-menus.js"></script></body>')
    page.write_text(source)

# Give every menu card a corresponding, readable price destination.
rows=[]
for product in products:
    key = product['id']
    price = prices[key]
    rows.append('<tr id="price-'+key+'"><th scope="row"><a href="products.html#'+key+'">'+html.escape(product['name'])+' <span aria-hidden="true">↗</span></a></th><td class="reference-price">'+word(*starting_price(price))+'</td><td>'+word(*coverage(price))+'</td></tr>')
overview='<!-- REDROCK-PRICE-OVERVIEW:START --><section class="page-shell content-section pricing-reference-section" id="all-product-pricing"><div class="section-heading"><div><div class="eyebrow">ALL 08 / STARTING PRICES</div><h2>'+word('八类产品起价','Starting prices for all eight products')+'</h2></div><p>'+word('起价已于 '+date_zh+' 核对。','Starting prices checked on '+date_en+'.')+'</p></div><div class="table-wrap"><table class="data-table pricing-reference-table"><caption class="sr-only">'+word('八类代理产品的起价与地区覆盖','Starting prices and coverage for eight proxy products')+'</caption><thead><tr><th scope="col">产品</th><th scope="col">'+word('起价','Starting price')+'</th><th scope="col">'+word('地区覆盖','Coverage')+'</th></tr></thead><tbody>'+''.join(rows)+'</tbody></table></div><p class="pricing-reference-note">'+word('价格会随地区、数量和使用期限变化，实际报价以原站为准。','Prices vary by location, quantity and duration. Check the original site for the current price.')+'</p></section><!-- REDROCK-PRICE-OVERVIEW:END -->'
page=DIST/'pricing.html';source=page.read_text()
if '<!-- REDROCK-PRICE-OVERVIEW:START -->' in source:
    source=re.sub(r'<!-- REDROCK-PRICE-OVERVIEW:START -->.*?<!-- REDROCK-PRICE-OVERVIEW:END -->',lambda _:overview,source,flags=re.S)
else:
    position=source.index('</section>',source.index('<main'))+len('</section>')
    source=source[:position]+overview+source[position:]
page.write_text(source)
(ROOT/'locales/navigation.json').write_text(json.dumps(translations,ensure_ascii=False,indent=2)+'\n')
print('Built eight-product pricing and two-tool menus on eight site headers, plus a shared pricing overview.')
