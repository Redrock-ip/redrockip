"""Build the deployable site from the editable Chinese and English source."""
import re
import shutil
import tempfile
from pathlib import Path, PurePosixPath
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from lxml import html

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / 'release-tools'
SOURCE = ROOT / 'source' / 'dist'
REMOVED = {'dashboard.js', 'workspace-demo.js', 'workspace-demo.css',
           'workspace-orders.js', 'workspace-usage.js', 'workspace-affiliate.js',
           'workspace-recharge.js', 'workspace-service.js'}
SVG = re.compile(r'<svg\b[^>]*>.*?</svg>', re.DOTALL | re.IGNORECASE)
CLASS = lambda name: f'contains(concat(" ",normalize-space(@class)," ")," {name} ")'


def set_text(node, value):
    for child in list(node):
        node.remove(child)
    node.text = value


def between(content, start, end, replacement):
    left = content.index(start)
    return content[:left] + replacement + content[content.index(end, left):]


def purchase_script(content):
    content = content.replace(' const products = [', ' let products = [', 1)
    content = between(content, ' const demoCode', ' let selected', '')
    content = content.replace(' let promoApplied = false;\n', '')
    content = between(content, ' const originalUrl', ' function updateUrl', '')
    content = between(content, '  if (promoApplied)', '  if (url.href', "  url.searchParams.delete('promo');\n")
    content = between(content, ' function quote()', ' function chosenQuantity()', '')
    content = content.replace("quantity:clampQuantity(params.get('quantity'),product,plan)",
                              "quantity:plan ? clampQuantity(params.get('quantity'),product,plan) : 1")
    content = content.replace("  url.searchParams.set('plan', selected.plan.id);",
                              "  if (selected.plan) url.searchParams.set('plan', selected.plan.id);\n  else url.searchParams.delete('plan');")
    content = content.replace(' function chosenQuantity() {', " function chosenQuantity() {\n  if (!selected.plan) return '—';")
    content = content.replace(' function chosenDuration() {', " function chosenDuration() {\n  if (!selected.plan) return '—';")
    content = content.replace('  const areas = new Map', """  if (!plan) {
   for (const id of ['purchase-area-field','purchase-duration-field','purchase-quantity-field']) $('#'+id).hidden = true;
   options.replaceChildren();
   $('#purchase-plan-count').textContent = release.t('当前暂无可购买套餐。','No plans are currently available.');
   for (const id of ['purchase-config-network','purchase-summary-product']) $('#'+id).textContent = product.name;
   for (const id of ['purchase-config-region','purchase-summary-unit','purchase-summary-region']) $('#'+id).textContent = '—';
   release.status(promoStatus,'');
   renderSelectionDetails();
   refreshActions();
   return;
  }
  const areas = new Map""")
    content = between(content, ' function renderTotals()', ' function row(', (TOOLS / 'purchase-connection.js').read_text())
    content = between(content, "  $('#purchase-original').href", ' }\n function chooseGroup',
                      '  release.status(promoStatus,\'\');\n  renderSelectionDetails();\n  refreshActions();\n')
    content = content.replace("productPrices[product.id].starting;", "catalogLoaded ? product.starting || '' : productPrices[product.id].starting;")
    content = content.replace("plan.label || productPrices[product.id].region", "productPrices[product.id].region")
    content = between(content, " preview.addEventListener('click'", ' function closeDialog()', (TOOLS / 'purchase-review.js').read_text())
    content = content.replace("  layout.setAttribute('aria-busy',String(active));",
                              "  layout.setAttribute('aria-busy',String(active));\n  refreshActions();")
    return content.replace(' restorePromo();\n render();\n})();', ' restorePromo();\n render();\n loadCurrentCatalog();\n})();')


def rewrite_page(path, target):
    relative = path.relative_to(target)
    en = relative.parts[0] == 'en'
    stem = path.stem
    prefix = '/en' if en else ''
    t = lambda zh, english: english if en else zh
    pending = t('服务暂不可用，请稍后再试。','This service is temporarily unavailable.')
    loading = t('账户数据暂不可用。','Account data is currently unavailable.')
    js_required = t('请启用 JavaScript 后继续。','Enable JavaScript to continue.')
    svgs = []
    def save_svg(match):
        svgs.append(match[0])
        return f'<span data-rr-svg="{len(svgs)-1}"></span>'
    document = html.document_fromstring(SVG.sub(save_svg,path.read_text(encoding='utf-8')))
    main = next(iter(document.xpath('//main')), None)

    def remove(nodes):
        for node in nodes:
            if node.getparent() is not None:
                node.getparent().remove(node)

    def ids(*names):
        return document.xpath(' | '.join(f'//*[@id="{name}"]' for name in names))

    def hide(*names):
        for node in ids(*names):
            node.set('hidden','')

    def show(*names):
        for node in ids(*names):
            node.attrib.pop('hidden',None)

    def write(name,text):
        for node in ids(name):
            set_text(node,text)

    def class_nodes(name):
        return document.xpath(f'//*[{CLASS(name)}]')

    def write_class(name,text):
        for node in class_nodes(name):
            set_text(node,text)

    def set_disabled(nodes):
        for node in nodes:
            node.set('disabled','disabled')

    def append_status(fallback, position=None):
        if position is None:
            position = main
        if stem == 'purchase':
            position = ids('purchase-availability')[0].getparent().getparent()
        element = html.Element('p',id='release-status',role='status',**{'class':'release-status'})
        element.text = fallback
        position.insert(1,element)

    def rename(name,value):
        ids(name)[0].set('id',value)

    remove([script for script in document.xpath('//script[@src] | //link[@href]')
            if PurePosixPath(script.get('src') or script.get('href')).name in REMOVED])

    for link in document.xpath('//a[@href]'):
        href = link.get('href')
        parts = urlsplit(href)
        query = [(key,value) for key,value in parse_qsl(parts.query,keep_blank_values=True)
                 if key not in {'demo','promo'}]
        if not parts.netloc and len(query) != len(parse_qsl(parts.query,keep_blank_values=True)):
            link.set('href',urlunsplit(parts._replace(query=urlencode(query))))
        if parts.netloc in {'redrock-ip.com','www.redrock-ip.com'}:
            route = parts.path.rstrip('/')
            file = target / (prefix.lstrip('/') + route).lstrip('/')
            if route and file.with_suffix('.html').is_file():
                local = prefix + route + (('?' + urlencode(query)) if query else '')
                link.set('href',local + (('#' + parts.fragment) if parts.fragment else ''))
            if route in ('/tools/proxy-checker','/tools/device-checker'):
                link.set('href',prefix + '/' + route.split('/')[-1])
        copy = ' '.join(link.text_content().split())
        replacements = {
            '模拟选购 ↗': '选购套餐 ↗', 'Simulate purchase ↗': 'Choose a plan ↗',
            '查看配置预览 ↗': '查看配置 ↗', 'View configuration preview ↗': 'View configuration ↗',
            '登录页面预览 ↗': '登录账户 ↗', 'Login page preview ↗': 'Sign in ↗',
            '查看控制台预览 ↗': '打开控制台 ↗', 'Dashboard preview ↗': 'Open dashboard ↗',
        }
        if copy in replacements:
            set_text(link,replacements[copy])

    for n in class_nodes('mega-reference-date'):
        n.set('data-release-rate-note','')
    for n in class_nodes('mega-price'):
        product = n.getparent().get('data-mega-product')
        if product:
            n.set('data-release-rate', product)
    for n in class_nodes('reference-price'):
        product = n.getparent().get('id', '')
        if product.startswith('price-'):
            n.set('data-release-rate', product.removeprefix('price-'))

    if stem == 'index':
        remove(class_nodes('hero-demo-link'))
        for n in main.xpath(".//a[@href=$url]",url=prefix+'/login'):
            set_text(n,t('登录控制台 ↗','Sign in to the dashboard ↗'))
    if stem == 'pricing':
        for n in ids('all-product-pricing')[0].xpath('.//p[1]'):
            if '2026' in n.text_content():
                n.set('data-release-rate-note','')
        for n in main.xpath(".//a[@href=$url]",url=prefix+'/pricing'):
            n.set('href',prefix+'/dashboard/purchase')
            set_text(n,t('查看可选套餐 ↗','View available plans ↗'))
        write_class('pricing-reference-note', t('起价根据已公布的最低单位价格整理，实际价格以订单报价为准。','Starting rates reflect the lowest published unit price. Your order quote confirms the current price.'))

    if stem == 'login':
        remove(class_nodes('dashboard-preview-link') + class_nodes('auth-dashboard-preview'))
        remove(main.xpath(".//a[@href=$url]",url=prefix+'/login'))
        write('preview-notice',pending)
        for n in ids('auth-email','auth-password'):
            n.attrib.pop('name',None)
        ids('auth-password')[0].set('placeholder',t('请输入密码','Enter password'))
        set_disabled(ids('auth-email','auth-password','password-toggle','remember-email','login-submit','google-signin'))
        for n in main.xpath('.//noscript'):
            set_text(n,js_required)

    is_workspace = stem == 'dashboard' or 'dashboard' in relative.parts
    if is_workspace:
        remove(class_nodes('workspace-original'))
        for n in document.xpath('//header//*[normalize-space(text())="预览工作区" or normalize-space(text())="Preview workspace"]'):
            n.text = t('账户','Account')
        for n in document.xpath('//header//a[normalize-space(text())="Sign-in preview ↗"]'):
            set_text(n,'Sign in ↗')
        for n in main.xpath('.//noscript'):
            set_text(n,js_required)
        for n in main.xpath('.//a[@href]'):
            if urlsplit(n.get('href')).path == (prefix+'/dashboard' + ('' if stem == 'dashboard' else '/'+stem)):
                remove([n])
        for n in document.xpath('//a[@href and contains(@href,"/dashboard/cdk")]'):
            remove([n])
    if stem == 'dashboard':
        hide('data-mode','notice-open','notice-dialog','orders-table-wrap')
        show('orders-empty','notice-empty')
        for name in ('balance-value','dynamic-remaining','dynamic-total','mobile-remaining','mobile-total','static-count','datacenter-count','dynamic-caption','mobile-caption','order-count','notice-state'):
            write(name,'—')
        for meter in ids('dynamic-meter','mobile-meter'):
            meter.set('aria-valuenow','0')
        for meter in ids('dynamic-meter-fill','mobile-meter-fill'):
            meter.set('style','width:0%')
        for name in ('balance-caption','ip-caption','notice-empty','empty-description','preview-description'):
            write(name,loading)
        write('empty-title',t('暂无订单记录','No orders to display'))
        write('order-sample-label',t('订单记录','Orders'))
        set_disabled(ids('order-search','order-status','order-reset'))
        for n in ids('order-search'):
            n.set('placeholder',t('搜索产品或订单号','Search by product or order ID'))
        orders_link = main.xpath('.//h2[@id="orders-title"]/../..//a')[0]
        orders_link.set('href',prefix+'/dashboard/orders')
        orders_link.attrib.pop('target',None)
        set_text(orders_link,t('全部订单 ↗','All orders ↗'))

    if stem in ('orders','usage','affiliate'):
        set_disabled(main.xpath('.//form//input | .//form//select | .//form//button'))
        append_status(loading)
    if stem == 'orders':
        hide('records-mode','records-table-wrap','records-dialog')
        show('records-empty')
        for name in ('records-total-count','records-paid-count','records-unpaid-count','records-total-amount','records-count','records-page'):
            write(name,'—')
        write('records-mode-note',loading)
        write('records-source-label',t('订单','Orders'))
        write('records-empty-title',t('暂无可显示的订单','No orders to display'))
        write('records-empty-description',loading)
        write('records-copy-id',t('复制订单号','Copy order ID'))
        write_class('ws-record-dialog-note',t('查看订单的配置及付款状态。','Review the plan and payment status for this order.'))
        set_disabled(ids('records-prev','records-next'))
    if stem == 'usage':
        hide('usage-mode','usage-chart-wrap','usage-series-label','usage-table-wrap')
        show('usage-empty','usage-table-empty')
        write('usage-period','—')
        write('usage-preview-note',loading)
        write('usage-export',t('导出 CSV ↓','Export CSV ↓'))
        write('usage-row-count','—')
        set_disabled(ids('usage-type','usage-export'))
        set_disabled([n for n in main.xpath('.//button') if n.get('id') != 'usage-mode'])
        for n in ids('usage-empty')[0].xpath('.//p'):
            set_text(n,loading)
    if stem == 'affiliate':
        hide('affiliate-mode','affiliate-invites-panel','affiliate-commissions-panel')
        show('affiliate-empty')
        set_disabled(ids('affiliate-link','affiliate-copy','affiliate-invites-tab','affiliate-commissions-tab','affiliate-search','affiliate-filter','affiliate-reset'))
        write('affiliate-empty-description',loading)
        write('affiliate-state',t('暂不可用','Unavailable'))
        for n in ids('affiliate-notice')[0].xpath('.//p'):
            set_text(n,loading)
        write_class('ws-affiliate-subtitle', t('通过专属邀请链接查看关联的推广记录。','Use your unique referral link to track referrals.'))

    if stem == 'purchase':
        remove(ids('purchase-original','purchase-order-original','purchase-demo-recharge'))
        write_class('ws-purchase-field-note',t('选择需要的地区分组、使用期限及套餐。','Select the region group, term, and plan you need.'))
        rename('purchase-demo-confirm','purchase-live-confirm')
        rename('purchase-demo-status','purchase-live-status')
        show('purchase-live-confirm')
        write('purchase-live-confirm',t('确认下单','Place order'))
        write('purchase-preview',t('确认报价 ↗','Review quote ↗'))
        write('purchase-promo-hint',t('如有优惠码，请输入后应用。','Enter your promo code and apply it to the quote.'))
        descriptions = main.xpath(f'.//*[{CLASS("ws-purchase-notice")}]//p')
        if not descriptions:
            descriptions = [n for n in main.xpath('.//p') if '2026.11.18' in n.text_content()]
        badge = descriptions[0]
        title = html.Element('strong',id='purchase-catalog-title')
        title.text = t('套餐参考 · 2026.11.18','Plan reference · 2026.11.18')
        set_text(badge,'')
        badge.append(title)
        availability = html.Element('span',id='purchase-availability')
        availability.text = t('目录仅供比对，价格与库存以订单报价为准。','Compare reference plans here. The order quote confirms the price and availability.')
        badge.append(availability)
        write_class('ws-purchase-summary-note',t('请核对套餐、期限及报价后下单。','Check the plan, term, and quote before placing the order.'))
        write_class('ws-purchase-order-note',t('请核对报价和使用期限后提交。','Check the quoted price and service term before submitting.'))
        order = ids('purchase-order-dialog')[0]
        for n in order.xpath(f'.//*[{CLASS("ws-purchase-kicker")}]'):
            set_text(n,'ORDER REVIEW')
        for n in order.xpath('./p[1]'):
            set_text(n,t('确认后将提交订单。','Confirm to place your order.'))
        for n in order.xpath('.//span[normalize-space()="参考总额" or normalize-space()="Reference total"]'):
            set_text(n,t('应付金额','Total due'))
        set_disabled(ids('purchase-preview','purchase-promo-code','purchase-live-confirm') + ids('purchase-promo')[0].xpath('.//button'))
        append_status(pending)
    if stem == 'recharge':
        rename('recharge-demo-confirm','recharge-live-confirm')
        show('recharge-live-confirm')
        set_disabled(ids('recharge-preview'))
        write('recharge-live-confirm',t('创建充值订单','Create top-up order'))
        write('recharge-preview',t('确认充值信息 →','Review top-up →'))
        write('recharge-review-note',t('创建充值订单前，请核对金额与支付方式。','Check the amount and payment method before creating a top-up order.'))
        write('recharge-form-note',t('提交后进入支付页面。','Continue to payment after confirming.'))
        write('recharge-method-note',t('可用通道与应付金额以支付页面为准。','The payment page confirms available methods and the amount due.'))
        write_class('ws-recharge-dialog-note',t('请在支付页核对金额与支付方式。','Check your amount and payment method on the payment page.'))
        for n in ids('recharge-review-dialog')[0].xpath('.//span[contains(text(),"PREVIEW /")]'):
            set_text(n,'CONFIRM / ADD FUNDS')
        append_status(pending)
    if main is not None and main.get('data-workspace-page') == 'service':
        heading = main.xpath(f'.//*[{CLASS("service-heading")}]')[0]
        for n in heading.xpath('.//a'):
            set_text(n,t('选购套餐 ↗','Choose a plan ↗'))
        for n in heading.xpath('.//*[contains(text(),"SERVICE PREVIEW")]'):
            n.text = n.text.replace('SERVICE PREVIEW','PROXY CONFIGURATION')
        config = ids('traffic-config')
        if config:
            remove(class_nodes('workspace-preview-banner'))
        else:
            write_class('workspace-preview-banner',loading)
        remove(class_nodes('service-next'))
        form = ids('service-form')[0]
        set_disabled(form.xpath('.//button'))
        for n in form.xpath('.//option[contains(text(),"示例线路") or contains(text(),"Sample route") or contains(text(),"Example route")]'):
            prefix_option = n.getparent()
            if not prefix_option.get('disabled'):
                placeholder = html.Element('option',value='',selected='selected')
                placeholder.text = t('选择可用资源','Select an available resource')
                prefix_option.insert(0,placeholder)
                prefix_option.set('disabled','disabled')
            remove([n])
        for n in form.xpath('.//button'):
            set_text(n,t('获取连接配置 ↗','Get connection details ↗'))
        append_status(pending, config[0] if config else None)

    production_text = {
        '示例': '记录', '示例订单': '订单', '示例订单号': '订单号', '示例金额 · 原站 $ 标示': '订单金额',
        '示例邀请记录':'邀请记录', '示例佣金明细':'佣金明细', '未接入':'暂不可用',
        '未接入账户余额':'余额暂不可用', '尚未接入真实账户':'余额暂不可用',
        'Sample':'Unavailable', 'Sample orders':'Orders', 'Sample order':'Order',
        'Sample invitations':'Invitations', 'Sample commissions':'Commissions',
        'SAMPLE ORDER / DETAILS':'ORDER / DETAILS', 'Preview only':'Unavailable',
        'Not connected':'Unavailable', '原站范围 $10–$2,000':'$10–$2,000'
    }
    service_text = {
        '设置示例配置':'配置连接','配置预览':'连接信息','示例地区':'地区','示例带宽':'带宽',
        '示例数量':'数量','示例资源':'资源','Configure a sample':'Configure your connection',
        'Set up a sample configuration':'Configure your connection','Example region':'Region','Example bandwidth':'Bandwidth',
        'Example quantity':'Quantity','Example resource':'Resource','连接格式示例':'代理地址','Example connection format':'Proxy address',
        '复制示例':'复制地址','Copy example':'Copy address',
        'Configuration preview':'Connection details','Sample region':'Region','Sample bandwidth':'Bandwidth','Sample quantity':'Quantity','Sample resource':'Resource'
    }
    if is_workspace:
        for n in main.iter():
            if isinstance(n.tag,str) and n.text and n.text.strip() in production_text:
                n.text = production_text[n.text.strip()]
            if main.get('data-workspace-page') == 'service' and isinstance(n.tag,str) and n.text and n.text.strip() in service_text:
                n.text = service_text[n.text.strip()]
        # Integration hooks can write account labels without changing navigation.
        for n in document.xpath('//script[@src and contains(@src,"workspace-purchase.js")]'):
            n.addprevious(html.Element('script',src='/redrock-backend.js'))
            n.addprevious(html.Element('script',src='/release-runtime.js'))
    copy_updates = {
        '请前往原站控制台查看当前产品信息，或通过下方邮箱咨询。不同代理类型的计费与可用地区可能不同。':'在控制台查看可选配置，或通过邮箱咨询。不同代理类型的计费与可用地区可能不同。',
        '以上用于选择方向，不构成固定价格或服务表现承诺。请在原站查看当前可用配置。':'在购买页查看当前可选配置。',
        '了解不同代理的计费口径，整理适合业务的配置。实时套餐价格与可用资源，请在原站查看或向团队咨询。':'了解各类代理的计费方式，在购买页查看可选套餐。',
        '实时价格与资源会随套餐配置变化，请以原站实际显示或团队确认的报价为准。':'价格与可用资源随套餐配置变化，实际金额以订单报价为准。',
        '实际价格与可用地区以原站为准。':'价格与地区以可用套餐为准。',
        '选择金额与支付方式，再前往原站确认支付。':'选择金额与支付方式，确认后进入支付页面。',
        '在原站确认可用通道':'在支付页选择通道', '在原站查看记录 ↗':'查看订单 ↗',
        '登录原站后创建充值订单，再核对支付地址、网络与金额。到账状态以系统确认为准。':'请在支付页面核对金额、网络与地址。到账状态以订单记录为准。',
        '登录原站后查看真实订单与支付状态。':'充值记录暂不可用。', '尚未接入充值记录':'暂无充值记录',
        '订单详情仅用于查看示例，不会提交付款或修改订单。':'在订单列表查看套餐与支付状态。',
        'Choose an amount and payment method, then confirm payment on the original site.':'Choose an amount and payment method, then continue to payment.',
        'Original site range: $10–$2,000':'$10–$2,000',
        'Continue on the original site':'Confirm your payment',
        'Sign in on the original site to create a recharge order, then review the address, network and amount. The system confirms the final payment status.':'Check the amount, address and network at checkout. View your payment status in the order history.',
        'Check the original site for current prices and available locations.':'Prices and regions vary by plan.',
        'Local syntax checks; test live connections on the original site.':'Validate proxy host, port, protocol and authentication.',
        'Live device counts and refresh results are available on the original site.':'Check the format of static proxy credentials.',
        '本页核对格式；真实连通性在原站检测。':'核对代理地址与认证格式。',
        'Use the original site to test live connectivity, latency and exit IP.':'Check host, port and authentication format in batches.',
        'This preview is not connected to the original checking service. Valid syntax does not mean a proxy is reachable.':'This tool validates syntax. Use a connection test to confirm reachability.',
        'Connectivity, latency and anonymity require the checking service on the original site.':'Connection status, latency and anonymity require a network test.',
        'Live device counts and source IPs require the original checking service. This preview does not submit this proxy configuration.':'Validate static proxy credentials. Device counts and source IPs require a query service.',
        'This preview does not display simulated device counts or IPs.':'Device counts and source IPs are available through the query service.',
        'Query on the original site':'Device information',
        'Choose an amount and payment method, then confirm your payment on the original site.':'Choose an amount and payment method, then continue to payment.',
        'Confirm available options on the original site':'Choose from the available payment options',
        'Recharge history is not connected':'No top-ups to display',
        'Sign in on the original site to view real orders and payment status.':'Top-up records are currently unavailable.',
        'Details are for sample orders only and do not submit payments or modify orders.':'Review the plan and payment status in the order list.',
        'Actual prices and regions are subject to the original site.':'Prices and regions vary by plan.',
        'Open original dashboard ↗':'Open dashboard ↗',
        '配置预览':'连接信息', 'Configuration preview':'Connection details',
    }
    for n in document.iter():
        if isinstance(n.tag,str) and n.tag not in {'script','style'} and n.text and n.text.strip() in copy_updates:
            n.text = copy_updates[n.text.strip()]
    for n in document.xpath('//footer//a[@href="https://redrock-ip.com/"]'):
        remove([n])
    if stem in ('proxy-checker','device-checker'):
        for n in main.xpath('.//a[@href=$url]',url=prefix+'/'+stem):
            remove([n])
        tool_copy = {
            '前往原站检测实际连通状态、延迟及出口 IP。':'可批量检查主机、端口和认证格式。',
            '当前独立预览不连接原站检测服务。格式正确不代表代理可用。':'此工具仅检查格式。可用性需通过连接检测确认。',
            '连接状态、延迟与匿名性需由原站服务检测。':'连接状态、延迟与出口 IP 需要实际连接检测。',
            '实时设备数量和来源 IP 需要原站检测服务。当前预览不会提交此代理配置。':'此工具检查静态代理格式。实时设备数量与来源 IP 需要查询服务。',
            '原站接口返回当前连接情况，不返回套餐允许的设备上限。请结合账户套餐信息判断。':'设备上限请在账户套餐中查看。',
            '待接入原站检测服务后，由实际查询结果填充。':'当前暂无设备查询结果。',
            '当前预览不展示模拟设备数量或 IP。':'设备数量与来源 IP 以查询结果为准。',
            'Visit the original site to check uptime, latency and exit IP.':'Check host, port and authentication format in batches.',
        }
        for n in main.iter():
            if isinstance(n.tag,str) and n.text and n.text.strip() in tool_copy:
                n.text = tool_copy[n.text.strip()]
    for n in document.xpath('//meta[@name="description"]'):
        n.set('content',n.get('content','').replace('设计预览','').replace('视觉预览','').replace(' design preview','').replace(' visual preview','').replace('预览',''))
    body = document.xpath('//body')[0]
    if stem == 'dashboard':
        body.append(html.Element('script',src=prefix+'/workspace-shell.js'))
    if stem != 'purchase':
        body.append(html.Element('script',src='/redrock-backend.js'))
        body.append(html.Element('script',src='/release-runtime.js'))
    head = document.xpath('//head')[0]
    head.append(html.Element('link',rel='stylesheet',href='/release.css'))
    rendered = html.tostring(document,encoding='unicode',method='html',doctype='<!doctype html>')
    rendered = re.sub(r'<span data-rr-svg="(\d+)"></span>',lambda m:svgs[int(m[1])],rendered)
    path.write_text(rendered,encoding='utf-8')


def build():
    with tempfile.TemporaryDirectory(prefix='release-',dir=ROOT) as workspace:
        target = Path(workspace) / 'dist'
        shutil.copytree(SOURCE,target)
        for path in sorted(target.rglob('*.html')):
            rewrite_page(path,target)
        for script in ('redrock-backend.js','release-runtime.js','release.css'):
            shutil.copyfile(TOOLS/script,target/script)
        for new in (target,target/'en'):
            for name in REMOVED:
                (new/name).unlink(missing_ok=True)
            home = new/'app.js'
            home.write_text(home.read_text(encoding='utf-8').replace("  document.querySelector('#year').textContent = new Date().getFullYear();", "  const year = document.querySelector('#year');\n  if (year) year.textContent = new Date().getFullYear();"),encoding='utf-8')
            login = new/'login.js'
            login.write_text(login.read_text(encoding='utf-8').split('  const form = ',1)[0]+'})();\n',encoding='utf-8')
            purchase = new/'workspace-purchase.js'
            purchase.write_text(purchase_script(purchase.read_text(encoding='utf-8')),encoding='utf-8')
        if (ROOT/'dist').exists():
            shutil.rmtree(ROOT/'dist')
        target.rename(ROOT/'dist')
    print(f'Built {len(list((ROOT/"dist").rglob("*.html")))} pages in dist/')


if __name__ == '__main__':
    build()
