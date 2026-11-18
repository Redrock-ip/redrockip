def money(value):
    return f'${value:,.2f}'


def lowest_plan(product):
    # Bandwidth pricing starts with the lowest payable hourly option.
    return product['lowest_unit_price_plan'] or product['entry_plan']


def coverage(product):
    if (product.get('listed_location_count') or 0) > 1:
        return '多个国家和地区', 'Multiple countries and regions'
    return '可用地区以套餐为准', 'Locations depend on the plan'


def rate(plan):
    zh, en = {
        'per GB': ('GB', 'GB'),
        'per IP for the stated duration': ('IP', 'IP'),
        'per IP allowance': ('IP', 'IP'),
        'per hour': ('小时', 'hour'),
        'per day': ('天', 'day'),
    }[plan['price_unit']]
    price = money(plan['unit_price'])
    return f'{price}/{zh}', f'{price}/{en}'


def starting_price(product):
    zh, en = rate(lowest_plan(product))
    return f'{zh} 起', f'From {en}'
