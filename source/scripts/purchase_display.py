import json
import re
from datetime import datetime
from zoneinfo import ZoneInfo


def build_purchase_data(root, products):
    snapshot = json.loads((root/'data/purchase-plans.json').read_text())
    stamp = datetime.fromisoformat(snapshot['checked_at_utc']).astimezone(ZoneInfo('Asia/Shanghai'))
    translations = {}
    areas = {
        'America': ('美洲', 'Americas'), 'North America': ('北美洲', 'North America'),
        'South America': ('南美洲', 'South America'), 'Asia': ('亚洲', 'Asia'),
        'Europe': ('欧洲', 'Europe'), 'Australia': ('大洋洲', 'Oceania'), 'Africa': ('非洲', 'Africa')
    }

    def localized(zh, en):
        if zh != en:
            translations[zh] = en
        return zh

    def plan_view(row):
        amount, unit = row['quantity'], row['unit']
        if unit == 'GB':
            quantity = f'{amount} GB'
            denominator = '/GB'
        elif unit == 'allowance':
            quantity = localized(f'{amount} IP 额度', f'{amount} IP allowance')
            denominator = '/IP'
        elif unit == 'bandwidth':
            quantity = localized(f'{amount}M 带宽', f'{amount}M bandwidth')
            denominator = localized('/小时', '/hour') if row['hours']<24 else localized('/天', '/day')
        else:
            quantity = f'{amount} IP'
            denominator = '/IP'

        if row['hours'] and row['hours'] < 24:
            hours = row['hours']
            duration = localized(f'{hours} 小时', f'{hours} hour' + ('s' if hours != 1 else ''))
            duration_order = hours
        elif row['days'] or row['hours']:
            days = row['days'] or row['hours']//24
            duration = localized(f'{days} 天', f'{days} day' + ('s' if days != 1 else ''))
            duration_order = days * 24
        else:
            duration = localized('以实际套餐有效期为准', 'Confirm plan expiry before buying')
            duration_order = 0

        region = row['location']
        area_key = region.split('-')[0] if region else ''
        area = localized(*areas.get(area_key, ('其他地区', 'Other regions'))) if region else ''
        location = localized(row['locationZh'] or region, region) if region else ''
        if area_key:
            location = location.split('-',1)[1] if '-' in location else location
            english = region.split('-',1)[1] if '-' in region else region
            location = localized(location, english)
        return {
            'id': row['id'], 'label': location, 'quantity': quantity, 'duration': duration,
            'areaKey': area_key, 'area': area, 'durationOrder': duration_order,
            'total': row['total'], 'unit': f'${row["unitPrice"]:.2f}'+denominator, 'soldOut': row['soldOut'],
        }

    result = [
        {'id':p['id'], 'name':p['name'], 'eyebrow':p['en'], 'description':p['desc'],
         'plans':[plan_view(row) for row in snapshot['products'][p['id']]]}
        for p in products
    ]
    controller = root/'dist/workspace-purchase.js'
    source, count = re.subn(r'(?s) const products = \[.*?\n\];',
                           lambda _: ' const products = '+json.dumps(result,ensure_ascii=False,indent=2)+';',
                           controller.read_text(), count=1)
    assert count == 1
    controller.write_text(source)
    date_label = stamp.strftime('%Y.%m.%d')
    localized('原站公开套餐 · '+date_label, 'Published plan snapshot · '+date_label)
    (root/'locales/workspace-plan-data.json').write_text(json.dumps(translations,ensure_ascii=False,indent=2)+'\n')
    return date_label
