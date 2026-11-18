(() => {
 'use strict';
 // Generated from the same pricing reference as the public product menu.
 const productPrices = {"dynamic": {"starting": "$0.50/GB 起", "region": "可用地区以套餐为准"}, "static": {"starting": "$6.00/IP 起", "region": "多个国家和地区"}, "mobile": {"starting": "$1.00/GB 起", "region": "可用地区以套餐为准"}, "datacenter": {"starting": "$0.55/IP 起", "region": "多个国家和地区"}, "static-daily": {"starting": "$0.18/IP 起", "region": "可用地区以套餐为准"}, "live": {"starting": "$36.00/IP 起", "region": "多个国家和地区"}, "unlimited": {"starting": "$15.00/小时 起", "region": "可用地区以套餐为准"}, "short": {"starting": "$0.02/IP 起", "region": "可用地区以套餐为准"}};
 const products = [
  {
    "id": "dynamic",
    "name": "动态住宅代理",
    "eyebrow": "ROTATING RESIDENTIAL",
    "description": "按配置轮换住宅网络出口，适用于需要切换连接出口的数据访问任务。",
    "plans": [
      {
        "id": "5g-resi",
        "label": "",
        "quantity": "5 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 8.0,
        "unit": "$1.60/GB",
        "soldOut": false
      },
      {
        "id": "20g-resi",
        "label": "",
        "quantity": "20 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 26.0,
        "unit": "$1.30/GB",
        "soldOut": false
      },
      {
        "id": "80g-resi",
        "label": "",
        "quantity": "80 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 80.0,
        "unit": "$1.00/GB",
        "soldOut": false
      },
      {
        "id": "300g-resi",
        "label": "",
        "quantity": "300 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 240.0,
        "unit": "$0.80/GB",
        "soldOut": false
      },
      {
        "id": "1000g-resi",
        "label": "",
        "quantity": "1000 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 650.0,
        "unit": "$0.65/GB",
        "soldOut": false
      },
      {
        "id": "3000g-resi",
        "label": "",
        "quantity": "3000 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 1650.0,
        "unit": "$0.55/GB",
        "soldOut": false
      },
      {
        "id": "10000g-resi",
        "label": "",
        "quantity": "10000 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 5000.0,
        "unit": "$0.50/GB",
        "soldOut": false
      }
    ]
  },
  {
    "id": "static",
    "name": "静态住宅代理",
    "eyebrow": "STATIC RESIDENTIAL",
    "description": "采用相对固定的住宅网络出口，适用于需要保持会话连续性的业务。",
    "plans": [
      {
        "id": "auqu3060",
        "label": "澳大利亚-昆士兰",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Australia",
        "area": "大洋洲",
        "durationOrder": 720,
        "total": 6.0,
        "unit": "$6.00/IP",
        "soldOut": false
      },
      {
        "id": "usml3070",
        "label": "美国-马里兰州",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 6.0,
        "unit": "$6.00/IP",
        "soldOut": false
      },
      {
        "id": "usva3060",
        "label": "美国-弗吉尼亚州",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 6.0,
        "unit": "$6.00/IP",
        "soldOut": false
      },
      {
        "id": "ashanoi3060",
        "label": "越南-河内",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "ashk3060",
        "label": "中国-香港",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "cano3070",
        "label": "加拿大-安大略省",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "euhesse3060",
        "label": "德国-黑森州",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "eulodon3060",
        "label": "英国-伦敦",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "eumadrid3060",
        "label": "西班牙-马德里",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "eupr3060",
        "label": "法国-巴黎",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "itlom3060",
        "label": "意大利-伦巴帝",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "jpnew3070",
        "label": "日本-东京",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "usca3060",
        "label": "美国-加利福尼亚州",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "usin3060",
        "label": "美国-华盛顿",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "usnew3070",
        "label": "美国-新上架IP",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "usnewny3070",
        "label": "美国-纽约",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "uste3060",
        "label": "美国-德克萨斯州",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": false
      },
      {
        "id": "asidja3070",
        "label": "印尼-雅加达",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 8.0,
        "unit": "$8.00/IP",
        "soldOut": false
      },
      {
        "id": "asph30800",
        "label": "菲律宾-马尼拉",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 8.0,
        "unit": "$8.00/IP",
        "soldOut": false
      },
      {
        "id": "ruspb30800",
        "label": "俄罗斯-圣彼得堡",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 8.0,
        "unit": "$8.00/IP",
        "soldOut": false
      },
      {
        "id": "assg3060",
        "label": "新加坡",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 9.0,
        "unit": "$9.00/IP",
        "soldOut": false
      },
      {
        "id": "astw3060",
        "label": "中国-台湾",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 9.0,
        "unit": "$9.00/IP",
        "soldOut": false
      },
      {
        "id": "krsejong3070",
        "label": "韩国-世宗运营商",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 9.0,
        "unit": "$9.00/IP",
        "soldOut": false
      },
      {
        "id": "krsl3070",
        "label": "韩国-首尔",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 9.0,
        "unit": "$9.00/IP",
        "soldOut": false
      },
      {
        "id": "mx3090",
        "label": "墨西哥-墨西哥",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 9.0,
        "unit": "$9.00/IP",
        "soldOut": false
      },
      {
        "id": "ngab30",
        "label": "尼日利亚-阿布贾",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Africa",
        "area": "非洲",
        "durationOrder": 720,
        "total": 9.0,
        "unit": "$9.00/IP",
        "soldOut": false
      },
      {
        "id": "sari3070",
        "label": "沙特阿拉伯-利雅得",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 9.0,
        "unit": "$9.00/IP",
        "soldOut": false
      },
      {
        "id": "usgemini30900",
        "label": "美国-AI优化线路",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 9.0,
        "unit": "$9.00/IP",
        "soldOut": false
      },
      {
        "id": "asmykl30110",
        "label": "马来西亚-吉隆坡",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 11.0,
        "unit": "$11.00/IP",
        "soldOut": false
      },
      {
        "id": "asthmg30110",
        "label": "泰国-曼谷",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 11.0,
        "unit": "$11.00/IP",
        "soldOut": false
      },
      {
        "id": "auqu601140",
        "label": "澳大利亚-昆士兰",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Australia",
        "area": "大洋洲",
        "durationOrder": 1440,
        "total": 11.4,
        "unit": "$11.40/IP",
        "soldOut": false
      },
      {
        "id": "usml601330",
        "label": "美国-马里兰州",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 11.4,
        "unit": "$11.40/IP",
        "soldOut": false
      },
      {
        "id": "usva601140",
        "label": "美国-弗吉尼亚州",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 11.4,
        "unit": "$11.40/IP",
        "soldOut": false
      },
      {
        "id": "ashanoi601140",
        "label": "越南-河内",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "ashk601140",
        "label": "中国-香港",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "cano601330",
        "label": "加拿大-安大略省",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "euhesse601140",
        "label": "德国-黑森州",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "eulodon601140",
        "label": "英国-伦敦",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "eumadrid601140",
        "label": "西班牙-马德里",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "eupr601140",
        "label": "法国-巴黎",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "itlom601140",
        "label": "意大利-伦巴帝",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "jpnew601330",
        "label": "日本-东京",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "usca601140",
        "label": "美国-加利福尼亚州",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "usin601140",
        "label": "美国-华盛顿",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "usnew601330",
        "label": "美国-新上架IP",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "usnewny601330",
        "label": "美国-纽约",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "uste601140",
        "label": "美国-德克萨斯州",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": false
      },
      {
        "id": "asidja601330",
        "label": "印尼-雅加达",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 15.2,
        "unit": "$15.20/IP",
        "soldOut": false
      },
      {
        "id": "asph601520",
        "label": "菲律宾-马尼拉",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 15.2,
        "unit": "$15.20/IP",
        "soldOut": false
      },
      {
        "id": "ruspb60152",
        "label": "俄罗斯-圣彼得堡",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 1440,
        "total": 15.2,
        "unit": "$15.20/IP",
        "soldOut": false
      },
      {
        "id": "assg601140",
        "label": "新加坡",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 17.1,
        "unit": "$17.10/IP",
        "soldOut": false
      },
      {
        "id": "astw601140",
        "label": "中国-台湾",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 17.1,
        "unit": "$17.10/IP",
        "soldOut": false
      },
      {
        "id": "krsejong601330",
        "label": "韩国-世宗运营商",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 17.1,
        "unit": "$17.10/IP",
        "soldOut": false
      },
      {
        "id": "krsl601330",
        "label": "韩国-首尔",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 17.1,
        "unit": "$17.10/IP",
        "soldOut": false
      },
      {
        "id": "mx60171",
        "label": "墨西哥-墨西哥",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 17.1,
        "unit": "$17.10/IP",
        "soldOut": false
      },
      {
        "id": "ngab60",
        "label": "尼日利亚-阿布贾",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Africa",
        "area": "非洲",
        "durationOrder": 1440,
        "total": 17.1,
        "unit": "$17.10/IP",
        "soldOut": false
      },
      {
        "id": "sari601330",
        "label": "沙特阿拉伯-利雅得",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 17.1,
        "unit": "$17.10/IP",
        "soldOut": false
      },
      {
        "id": "usgemini601710",
        "label": "美国-AI优化线路",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 17.1,
        "unit": "$17.10/IP",
        "soldOut": false
      },
      {
        "id": "astwchunghwa3060",
        "label": "台湾-中华电信运营商",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 19.0,
        "unit": "$19.00/IP",
        "soldOut": false
      },
      {
        "id": "asmykl60209",
        "label": "马来西亚-吉隆坡",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 20.9,
        "unit": "$20.90/IP",
        "soldOut": false
      },
      {
        "id": "asthmg60209",
        "label": "泰国-曼谷",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 20.9,
        "unit": "$20.90/IP",
        "soldOut": false
      },
      {
        "id": "auqu12022320",
        "label": "澳大利亚-昆士兰",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Australia",
        "area": "大洋洲",
        "durationOrder": 2880,
        "total": 22.32,
        "unit": "$22.32/IP",
        "soldOut": false
      },
      {
        "id": "usml1202604",
        "label": "美国-马里兰州",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 22.32,
        "unit": "$22.32/IP",
        "soldOut": false
      },
      {
        "id": "usva12022320",
        "label": "美国-弗吉尼亚州",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 22.32,
        "unit": "$22.32/IP",
        "soldOut": false
      },
      {
        "id": "ashanoi12022320",
        "label": "越南-河内",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "ashk12022320",
        "label": "中国-香港",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "cano1202604",
        "label": "加拿大-安大略省",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "euhesse12022320",
        "label": "德国-黑森州",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "eulodon12022320",
        "label": "英国-伦敦",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "eumadrid12022320",
        "label": "西班牙-马德里",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "eupr12022320",
        "label": "法国-巴黎",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "itlom12022320",
        "label": "意大利-伦巴帝",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "jpnew1202604",
        "label": "日本-东京",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "usca12022320",
        "label": "美国-加利福尼亚州",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "usin12022320",
        "label": "美国-华盛顿",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "usnew1202604",
        "label": "美国-新上架IP",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "usnewny1202604",
        "label": "美国-纽约",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "uste12022320",
        "label": "美国-德克萨斯州",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": false
      },
      {
        "id": "asidja1202604",
        "label": "印尼-雅加达",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 29.76,
        "unit": "$29.76/IP",
        "soldOut": false
      },
      {
        "id": "asph1202976",
        "label": "菲律宾-马尼拉",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 29.76,
        "unit": "$29.76/IP",
        "soldOut": false
      },
      {
        "id": "ruspb1202976",
        "label": "俄罗斯-圣彼得堡",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2880,
        "total": 29.76,
        "unit": "$29.76/IP",
        "soldOut": false
      },
      {
        "id": "assg12022320",
        "label": "新加坡",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 33.48,
        "unit": "$33.48/IP",
        "soldOut": false
      },
      {
        "id": "astw12022320",
        "label": "中国-台湾",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 33.48,
        "unit": "$33.48/IP",
        "soldOut": false
      },
      {
        "id": "krsejong1202604",
        "label": "韩国-世宗运营商",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 33.48,
        "unit": "$33.48/IP",
        "soldOut": false
      },
      {
        "id": "krsl1202604",
        "label": "韩国-首尔",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 33.48,
        "unit": "$33.48/IP",
        "soldOut": false
      },
      {
        "id": "mx1203348",
        "label": "墨西哥-墨西哥",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 33.48,
        "unit": "$33.48/IP",
        "soldOut": false
      },
      {
        "id": "ngab120",
        "label": "尼日利亚-阿布贾",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Africa",
        "area": "非洲",
        "durationOrder": 2880,
        "total": 33.48,
        "unit": "$33.48/IP",
        "soldOut": false
      },
      {
        "id": "sari1202604",
        "label": "沙特阿拉伯-利雅得",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 33.48,
        "unit": "$33.48/IP",
        "soldOut": false
      },
      {
        "id": "usgemini1203348",
        "label": "美国-AI优化线路",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 33.48,
        "unit": "$33.48/IP",
        "soldOut": false
      },
      {
        "id": "astwchunghwa601140",
        "label": "台湾-中华电信运营商",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 36.1,
        "unit": "$36.10/IP",
        "soldOut": false
      },
      {
        "id": "asmykl120409",
        "label": "马来西亚-吉隆坡",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 40.9,
        "unit": "$40.90/IP",
        "soldOut": false
      },
      {
        "id": "asthmg120409",
        "label": "泰国-曼谷",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 40.9,
        "unit": "$40.90/IP",
        "soldOut": false
      },
      {
        "id": "auqu3606480",
        "label": "澳大利亚-昆士兰",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Australia",
        "area": "大洋洲",
        "durationOrder": 8640,
        "total": 64.8,
        "unit": "$64.80/IP",
        "soldOut": false
      },
      {
        "id": "usml3607560",
        "label": "美国-马里兰州",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 64.8,
        "unit": "$64.80/IP",
        "soldOut": false
      },
      {
        "id": "usva3606480",
        "label": "美国-弗吉尼亚州",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 64.8,
        "unit": "$64.80/IP",
        "soldOut": false
      },
      {
        "id": "astwchunghwa12022320",
        "label": "台湾-中华电信运营商",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 70.68,
        "unit": "$70.68/IP",
        "soldOut": false
      },
      {
        "id": "ashanoi3606480",
        "label": "越南-河内",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "ashk3606480",
        "label": "中国-香港",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "cano3607560",
        "label": "加拿大-安大略省",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "euhesse3606480",
        "label": "德国-黑森州",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "eulodon3606480",
        "label": "英国-伦敦",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "eumadrid3606480",
        "label": "西班牙-马德里",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "eupr3606480",
        "label": "法国-巴黎",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "itlom3606480",
        "label": "意大利-伦巴帝",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "jpnew3607560",
        "label": "日本-东京",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "usca3606480",
        "label": "美国-加利福尼亚州",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "usin3606480",
        "label": "美国-华盛顿",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "usnew3607560",
        "label": "美国-新上架IP",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "usnewny3607560",
        "label": "美国-纽约",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "uste3606480",
        "label": "美国-德克萨斯州",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": false
      },
      {
        "id": "asidja3607560",
        "label": "印尼-雅加达",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 86.4,
        "unit": "$86.40/IP",
        "soldOut": false
      },
      {
        "id": "asph3608640",
        "label": "菲律宾-马尼拉",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 86.4,
        "unit": "$86.40/IP",
        "soldOut": false
      },
      {
        "id": "ruspb3608640",
        "label": "俄罗斯-圣彼得堡",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 8640,
        "total": 86.4,
        "unit": "$86.40/IP",
        "soldOut": false
      },
      {
        "id": "assg3606480",
        "label": "新加坡",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 97.2,
        "unit": "$97.20/IP",
        "soldOut": false
      },
      {
        "id": "astw3606480",
        "label": "中国-台湾",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 97.2,
        "unit": "$97.20/IP",
        "soldOut": false
      },
      {
        "id": "krsejong3607560",
        "label": "韩国-世宗运营商",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 97.2,
        "unit": "$97.20/IP",
        "soldOut": false
      },
      {
        "id": "krsl3607560",
        "label": "韩国-首尔",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 97.2,
        "unit": "$97.20/IP",
        "soldOut": false
      },
      {
        "id": "mx360972",
        "label": "墨西哥-墨西哥",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 97.2,
        "unit": "$97.20/IP",
        "soldOut": false
      },
      {
        "id": "ngab360",
        "label": "尼日利亚-阿布贾",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Africa",
        "area": "非洲",
        "durationOrder": 8640,
        "total": 97.2,
        "unit": "$97.20/IP",
        "soldOut": false
      },
      {
        "id": "sari3607560",
        "label": "沙特阿拉伯-利雅得",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 97.2,
        "unit": "$97.20/IP",
        "soldOut": false
      },
      {
        "id": "usgemin3609720",
        "label": "美国-AI优化线路",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 97.2,
        "unit": "$97.20/IP",
        "soldOut": false
      },
      {
        "id": "asmykl3601188",
        "label": "马来西亚-吉隆坡",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 118.8,
        "unit": "$118.80/IP",
        "soldOut": false
      },
      {
        "id": "asthmg3601188",
        "label": "泰国-曼谷",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 118.8,
        "unit": "$118.80/IP",
        "soldOut": false
      },
      {
        "id": "astwchunghwa3606480",
        "label": "台湾-中华电信运营商",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 205.2,
        "unit": "$205.20/IP",
        "soldOut": false
      },
      {
        "id": "brrj3060",
        "label": "巴西-里约热内卢",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 7.0,
        "unit": "$7.00/IP",
        "soldOut": true
      },
      {
        "id": "usverzion3090",
        "label": "美国-Verizon运营商",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 10.0,
        "unit": "$10.00/IP",
        "soldOut": true
      },
      {
        "id": "brrj601140",
        "label": "巴西-里约热内卢",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 13.3,
        "unit": "$13.30/IP",
        "soldOut": true
      },
      {
        "id": "usverzion601710",
        "label": "美国-Verizon运营商",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 19.0,
        "unit": "$19.00/IP",
        "soldOut": true
      },
      {
        "id": "brrj12022320",
        "label": "巴西-里约热内卢",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 26.04,
        "unit": "$26.04/IP",
        "soldOut": true
      },
      {
        "id": "usverzion1203348",
        "label": "美国-Verizon运营商",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 37.2,
        "unit": "$37.20/IP",
        "soldOut": true
      },
      {
        "id": "brrj3606480",
        "label": "巴西-里约热内卢",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 75.6,
        "unit": "$75.60/IP",
        "soldOut": true
      },
      {
        "id": "usverzion3609720",
        "label": "美国-Verizon运营商",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 108.0,
        "unit": "$108.00/IP",
        "soldOut": true
      }
    ]
  },
  {
    "id": "mobile",
    "name": "移动代理",
    "eyebrow": "MOBILE PROXIES",
    "description": "通过移动网络建立连接，用于移动端体验检查与应用测试。",
    "plans": [
      {
        "id": "3g-mobile",
        "label": "",
        "quantity": "3 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 9.6,
        "unit": "$3.20/GB",
        "soldOut": false
      },
      {
        "id": "10g-mobile",
        "label": "",
        "quantity": "10 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 26.0,
        "unit": "$2.60/GB",
        "soldOut": false
      },
      {
        "id": "30g-mobile",
        "label": "",
        "quantity": "30 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 60.0,
        "unit": "$2.00/GB",
        "soldOut": false
      },
      {
        "id": "100g-mobile",
        "label": "",
        "quantity": "100 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 160.0,
        "unit": "$1.60/GB",
        "soldOut": false
      },
      {
        "id": "300g-mobile",
        "label": "",
        "quantity": "300 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 390.0,
        "unit": "$1.30/GB",
        "soldOut": false
      },
      {
        "id": "1000g-mobile",
        "label": "",
        "quantity": "1000 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 1100.0,
        "unit": "$1.10/GB",
        "soldOut": false
      },
      {
        "id": "3000g-mobile",
        "label": "",
        "quantity": "3000 GB",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 3000.0,
        "unit": "$1.00/GB",
        "soldOut": false
      }
    ]
  },
  {
    "id": "datacenter",
    "name": "数据中心代理",
    "eyebrow": "DATACENTER PROXIES",
    "description": "通过数据中心网络建立连接，适用于授权自动化任务和常规数据访问。",
    "plans": [
      {
        "id": "br1",
        "label": "巴西",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "South America",
        "area": "南美洲",
        "durationOrder": 720,
        "total": 0.55,
        "unit": "$0.55/IP",
        "soldOut": false
      },
      {
        "id": "ca1",
        "label": "加拿大",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "North America",
        "area": "北美洲",
        "durationOrder": 720,
        "total": 0.55,
        "unit": "$0.55/IP",
        "soldOut": false
      },
      {
        "id": "fr1",
        "label": "法国",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 0.55,
        "unit": "$0.55/IP",
        "soldOut": false
      },
      {
        "id": "ge1",
        "label": "德国",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 0.55,
        "unit": "$0.55/IP",
        "soldOut": false
      },
      {
        "id": "it1",
        "label": "意大利",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 0.55,
        "unit": "$0.55/IP",
        "soldOut": false
      },
      {
        "id": "sp1",
        "label": "西班牙",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 0.55,
        "unit": "$0.55/IP",
        "soldOut": false
      },
      {
        "id": "th1",
        "label": "泰国",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 0.55,
        "unit": "$0.55/IP",
        "soldOut": false
      },
      {
        "id": "uk1",
        "label": "英国",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 0.55,
        "unit": "$0.55/IP",
        "soldOut": false
      },
      {
        "id": "us1",
        "label": "美国",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 0.55,
        "unit": "$0.55/IP",
        "soldOut": false
      },
      {
        "id": "br2",
        "label": "巴西",
        "quantity": "1 IP",
        "duration": "90 天",
        "areaKey": "South America",
        "area": "南美洲",
        "durationOrder": 2160,
        "total": 1.5,
        "unit": "$1.50/IP",
        "soldOut": false
      },
      {
        "id": "ca2",
        "label": "加拿大",
        "quantity": "1 IP",
        "duration": "90 天",
        "areaKey": "North America",
        "area": "北美洲",
        "durationOrder": 2160,
        "total": 1.5,
        "unit": "$1.50/IP",
        "soldOut": false
      },
      {
        "id": "fr2",
        "label": "法国",
        "quantity": "1 IP",
        "duration": "90 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2160,
        "total": 1.5,
        "unit": "$1.50/IP",
        "soldOut": false
      },
      {
        "id": "ge2",
        "label": "德国",
        "quantity": "1 IP",
        "duration": "90 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2160,
        "total": 1.5,
        "unit": "$1.50/IP",
        "soldOut": false
      },
      {
        "id": "it2",
        "label": "意大利",
        "quantity": "1 IP",
        "duration": "90 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2160,
        "total": 1.5,
        "unit": "$1.50/IP",
        "soldOut": false
      },
      {
        "id": "sp2",
        "label": "西班牙",
        "quantity": "1 IP",
        "duration": "90 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2160,
        "total": 1.5,
        "unit": "$1.50/IP",
        "soldOut": false
      },
      {
        "id": "th2",
        "label": "泰国",
        "quantity": "1 IP",
        "duration": "90 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2160,
        "total": 1.5,
        "unit": "$1.50/IP",
        "soldOut": false
      },
      {
        "id": "uk2",
        "label": "英国",
        "quantity": "1 IP",
        "duration": "90 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2160,
        "total": 1.5,
        "unit": "$1.50/IP",
        "soldOut": false
      },
      {
        "id": "us2",
        "label": "美国",
        "quantity": "1 IP",
        "duration": "90 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2160,
        "total": 1.5,
        "unit": "$1.50/IP",
        "soldOut": false
      }
    ]
  },
  {
    "id": "static-daily",
    "name": "静态住宅日租",
    "eyebrow": "DAILY RESIDENTIAL",
    "description": "按地区与有效期选择日租静态住宅套餐，查看连接信息和到期时间。",
    "plans": [
      {
        "id": "usindianaoneday-10",
        "label": "美国-一天",
        "quantity": "10 IP",
        "duration": "1 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 24,
        "total": 5.0,
        "unit": "$0.50/IP",
        "soldOut": false
      },
      {
        "id": "usindianaoneday-25",
        "label": "美国-一天",
        "quantity": "25 IP",
        "duration": "1 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 24,
        "total": 11.0,
        "unit": "$0.44/IP",
        "soldOut": false
      },
      {
        "id": "usindianaoneday-65",
        "label": "美国-一天",
        "quantity": "65 IP",
        "duration": "1 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 24,
        "total": 24.7,
        "unit": "$0.38/IP",
        "soldOut": false
      },
      {
        "id": "usindianaoneday-180",
        "label": "美国-一天",
        "quantity": "180 IP",
        "duration": "1 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 24,
        "total": 57.6,
        "unit": "$0.32/IP",
        "soldOut": false
      },
      {
        "id": "usindianaoneday-450",
        "label": "美国-一天",
        "quantity": "450 IP",
        "duration": "1 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 24,
        "total": 121.5,
        "unit": "$0.27/IP",
        "soldOut": false
      },
      {
        "id": "usindianaoneday-1000",
        "label": "美国-一天",
        "quantity": "1000 IP",
        "duration": "1 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 24,
        "total": 180.0,
        "unit": "$0.18/IP",
        "soldOut": false
      }
    ]
  },
  {
    "id": "live",
    "name": "直播专线",
    "eyebrow": "LIVE CONNECTION",
    "description": "面向直播场景的 IP 方案，按地区与使用期限选择配置。",
    "plans": [
      {
        "id": "jplive30",
        "label": "日本-直播线路",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 36.0,
        "unit": "$36.00/IP",
        "soldOut": false
      },
      {
        "id": "mylive30",
        "label": "马来西亚-直播线路",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 36.0,
        "unit": "$36.00/IP",
        "soldOut": false
      },
      {
        "id": "sglive30",
        "label": "新加坡-直播线路",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 36.0,
        "unit": "$36.00/IP",
        "soldOut": false
      },
      {
        "id": "twlivechunghwa30",
        "label": "台湾-中华电信直播线路",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 720,
        "total": 36.0,
        "unit": "$36.00/IP",
        "soldOut": false
      },
      {
        "id": "uklive30",
        "label": "英国-直播线路",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 720,
        "total": 36.0,
        "unit": "$36.00/IP",
        "soldOut": false
      },
      {
        "id": "uslive30",
        "label": "美国-直播线路",
        "quantity": "1 IP",
        "duration": "30 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 720,
        "total": 36.0,
        "unit": "$36.00/IP",
        "soldOut": false
      },
      {
        "id": "jplive60",
        "label": "日本-直播线路",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 68.0,
        "unit": "$68.00/IP",
        "soldOut": false
      },
      {
        "id": "mylive60",
        "label": "马来西亚-直播线路",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 68.0,
        "unit": "$68.00/IP",
        "soldOut": false
      },
      {
        "id": "sglive60",
        "label": "新加坡-直播线路",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 68.0,
        "unit": "$68.00/IP",
        "soldOut": false
      },
      {
        "id": "twlivechunghwa60",
        "label": "台湾-中华电信直播线路",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 1440,
        "total": 68.0,
        "unit": "$68.00/IP",
        "soldOut": false
      },
      {
        "id": "uklive60",
        "label": "英国-直播线路",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 1440,
        "total": 68.0,
        "unit": "$68.00/IP",
        "soldOut": false
      },
      {
        "id": "uslive60",
        "label": "美国-直播线路",
        "quantity": "1 IP",
        "duration": "60 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 1440,
        "total": 68.0,
        "unit": "$68.00/IP",
        "soldOut": false
      },
      {
        "id": "jplive120",
        "label": "日本-直播线路",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 134.0,
        "unit": "$134.00/IP",
        "soldOut": false
      },
      {
        "id": "mylive120",
        "label": "马来西亚-直播线路",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 134.0,
        "unit": "$134.00/IP",
        "soldOut": false
      },
      {
        "id": "sglive120",
        "label": "新加坡-直播线路",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 134.0,
        "unit": "$134.00/IP",
        "soldOut": false
      },
      {
        "id": "twlivechunghwa120",
        "label": "台湾-中华电信直播线路",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 2880,
        "total": 134.0,
        "unit": "$134.00/IP",
        "soldOut": false
      },
      {
        "id": "uklive120",
        "label": "英国-直播线路",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 2880,
        "total": 134.0,
        "unit": "$134.00/IP",
        "soldOut": false
      },
      {
        "id": "uslive120",
        "label": "美国-直播线路",
        "quantity": "1 IP",
        "duration": "120 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 2880,
        "total": 134.0,
        "unit": "$134.00/IP",
        "soldOut": false
      },
      {
        "id": "jplive360",
        "label": "日本-直播线路",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 389.0,
        "unit": "$389.00/IP",
        "soldOut": false
      },
      {
        "id": "mylive360",
        "label": "马来西亚-直播线路",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 389.0,
        "unit": "$389.00/IP",
        "soldOut": false
      },
      {
        "id": "sglive360",
        "label": "新加坡-直播线路",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 389.0,
        "unit": "$389.00/IP",
        "soldOut": false
      },
      {
        "id": "twlivechunghwa360",
        "label": "台湾-中华电信直播线路",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Asia",
        "area": "亚洲",
        "durationOrder": 8640,
        "total": 389.0,
        "unit": "$389.00/IP",
        "soldOut": false
      },
      {
        "id": "uklive360",
        "label": "英国-直播线路",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "Europe",
        "area": "欧洲",
        "durationOrder": 8640,
        "total": 389.0,
        "unit": "$389.00/IP",
        "soldOut": false
      },
      {
        "id": "uslive360",
        "label": "美国-直播线路",
        "quantity": "1 IP",
        "duration": "360 天",
        "areaKey": "America",
        "area": "美洲",
        "durationOrder": 8640,
        "total": 389.0,
        "unit": "$389.00/IP",
        "soldOut": false
      }
    ]
  },
  {
    "id": "unlimited",
    "name": "动态不限量",
    "eyebrow": "BANDWIDTH PLANS",
    "description": "按带宽档位与使用时长选择套餐，通过 Unlimited KEY 管理代理配置。",
    "plans": [
      {
        "id": "unlimited-trial",
        "label": "",
        "quantity": "200M 带宽",
        "duration": "1 小时",
        "areaKey": "",
        "area": "",
        "durationOrder": 1,
        "total": 15.0,
        "unit": "$15.00/小时",
        "soldOut": false
      },
      {
        "id": "unlimited-oneday-300",
        "label": "",
        "quantity": "300M 带宽",
        "duration": "1 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 24,
        "total": 288.0,
        "unit": "$288.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-oneday-400",
        "label": "",
        "quantity": "400M 带宽",
        "duration": "1 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 24,
        "total": 304.0,
        "unit": "$304.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-oneday-500",
        "label": "",
        "quantity": "500M 带宽",
        "duration": "1 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 24,
        "total": 322.0,
        "unit": "$322.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-oneday-600",
        "label": "",
        "quantity": "600M 带宽",
        "duration": "1 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 24,
        "total": 334.0,
        "unit": "$334.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-oneday-700",
        "label": "",
        "quantity": "700M 带宽",
        "duration": "1 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 24,
        "total": 347.0,
        "unit": "$347.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-oneday-800",
        "label": "",
        "quantity": "800M 带宽",
        "duration": "1 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 24,
        "total": 358.0,
        "unit": "$358.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-oneday-900",
        "label": "",
        "quantity": "900M 带宽",
        "duration": "1 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 24,
        "total": 362.0,
        "unit": "$362.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-oneday-200",
        "label": "",
        "quantity": "200M 带宽",
        "duration": "1 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 24,
        "total": 365.0,
        "unit": "$365.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-oneday-1000",
        "label": "",
        "quantity": "1000M 带宽",
        "duration": "1 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 24,
        "total": 368.0,
        "unit": "$368.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-week-200",
        "label": "",
        "quantity": "200M 带宽",
        "duration": "7 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 168,
        "total": 854.0,
        "unit": "$122.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-week-300",
        "label": "",
        "quantity": "300M 带宽",
        "duration": "7 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 168,
        "total": 910.0,
        "unit": "$130.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-week-400",
        "label": "",
        "quantity": "400M 带宽",
        "duration": "7 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 168,
        "total": 1008.0,
        "unit": "$144.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-week-500",
        "label": "",
        "quantity": "500M 带宽",
        "duration": "7 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 168,
        "total": 1120.0,
        "unit": "$160.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-week-600",
        "label": "",
        "quantity": "600M 带宽",
        "duration": "7 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 168,
        "total": 1204.0,
        "unit": "$172.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-week-700",
        "label": "",
        "quantity": "700M 带宽",
        "duration": "7 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 168,
        "total": 1260.0,
        "unit": "$180.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-week-800",
        "label": "",
        "quantity": "800M 带宽",
        "duration": "7 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 168,
        "total": 1309.0,
        "unit": "$187.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-week-900",
        "label": "",
        "quantity": "900M 带宽",
        "duration": "7 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 168,
        "total": 1372.0,
        "unit": "$196.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-week-1000",
        "label": "",
        "quantity": "1000M 带宽",
        "duration": "7 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 168,
        "total": 1414.0,
        "unit": "$202.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-15-200",
        "label": "",
        "quantity": "200M 带宽",
        "duration": "15 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 360,
        "total": 1470.0,
        "unit": "$98.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-15-300",
        "label": "",
        "quantity": "300M 带宽",
        "duration": "15 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 360,
        "total": 1740.0,
        "unit": "$116.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-15-400",
        "label": "",
        "quantity": "400M 带宽",
        "duration": "15 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 360,
        "total": 2010.0,
        "unit": "$134.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-15-500",
        "label": "",
        "quantity": "500M 带宽",
        "duration": "15 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 360,
        "total": 2190.0,
        "unit": "$146.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-30-200",
        "label": "",
        "quantity": "200M 带宽",
        "duration": "30 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 720,
        "total": 2190.0,
        "unit": "$73.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-15-600",
        "label": "",
        "quantity": "600M 带宽",
        "duration": "15 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 360,
        "total": 2370.0,
        "unit": "$158.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-15-700",
        "label": "",
        "quantity": "700M 带宽",
        "duration": "15 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 360,
        "total": 2505.0,
        "unit": "$167.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-30-300",
        "label": "",
        "quantity": "300M 带宽",
        "duration": "30 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 720,
        "total": 2580.0,
        "unit": "$86.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-15-800",
        "label": "",
        "quantity": "800M 带宽",
        "duration": "15 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 360,
        "total": 2595.0,
        "unit": "$173.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-15-900",
        "label": "",
        "quantity": "900M 带宽",
        "duration": "15 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 360,
        "total": 2700.0,
        "unit": "$180.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-15-1000",
        "label": "",
        "quantity": "1000M 带宽",
        "duration": "15 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 360,
        "total": 2805.0,
        "unit": "$187.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-30-400",
        "label": "",
        "quantity": "400M 带宽",
        "duration": "30 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 720,
        "total": 3180.0,
        "unit": "$106.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-30-500",
        "label": "",
        "quantity": "500M 带宽",
        "duration": "30 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 720,
        "total": 3600.0,
        "unit": "$120.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-30-600",
        "label": "",
        "quantity": "600M 带宽",
        "duration": "30 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 720,
        "total": 3960.0,
        "unit": "$132.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-30-700",
        "label": "",
        "quantity": "700M 带宽",
        "duration": "30 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 720,
        "total": 4260.0,
        "unit": "$142.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-30-800",
        "label": "",
        "quantity": "800M 带宽",
        "duration": "30 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 720,
        "total": 4470.0,
        "unit": "$149.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-30-900",
        "label": "",
        "quantity": "900M 带宽",
        "duration": "30 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 720,
        "total": 4740.0,
        "unit": "$158.00/天",
        "soldOut": false
      },
      {
        "id": "unlimited-30-1000",
        "label": "",
        "quantity": "1000M 带宽",
        "duration": "30 天",
        "areaKey": "",
        "area": "",
        "durationOrder": 720,
        "total": 4920.0,
        "unit": "$164.00/天",
        "soldOut": false
      }
    ]
  },
  {
    "id": "short",
    "name": "短效住宅",
    "eyebrow": "SHORT-TERM RESIDENTIAL",
    "description": "按 IP 数量额度选购并生成短效住宅代理，查看生成记录及到期时间。",
    "plans": [
      {
        "id": "short1",
        "label": "",
        "quantity": "60 IP 额度",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 6.0,
        "unit": "$0.10/IP",
        "soldOut": false
      },
      {
        "id": "short2",
        "label": "",
        "quantity": "300 IP 额度",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 24.0,
        "unit": "$0.08/IP",
        "soldOut": false
      },
      {
        "id": "short3",
        "label": "",
        "quantity": "800 IP 额度",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 48.0,
        "unit": "$0.06/IP",
        "soldOut": false
      },
      {
        "id": "short4",
        "label": "",
        "quantity": "2000 IP 额度",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 100.0,
        "unit": "$0.05/IP",
        "soldOut": false
      },
      {
        "id": "short5",
        "label": "",
        "quantity": "8000 IP 额度",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 320.0,
        "unit": "$0.04/IP",
        "soldOut": false
      },
      {
        "id": "short6",
        "label": "",
        "quantity": "40000 IP 额度",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 1200.0,
        "unit": "$0.03/IP",
        "soldOut": false
      },
      {
        "id": "short7",
        "label": "",
        "quantity": "200000 IP 额度",
        "duration": "以实际套餐有效期为准",
        "areaKey": "",
        "area": "",
        "durationOrder": 0,
        "total": 4000.0,
        "unit": "$0.02/IP",
        "soldOut": false
      }
    ]
  }
];
 const originalTabs = { 'static-daily': 'staticDaily', mobile: 'mobileDynamic', unlimited: 'dynamicUnlimited' };
 const aliases = { staticDaily: 'static-daily', mobileDynamic: 'mobile', dynamicUnlimited: 'unlimited' };
 const quantityLimit = (product,plan) => ['static','datacenter','live'].includes(product.id) ||
  (product.id === 'unlimited' && plan.durationOrder === 1) ? 100 : 1;
 const clampQuantity = (quantity, product, plan) => Math.max(1,Math.min(quantityLimit(product,plan),Math.trunc(Number(quantity)) || 1));
 function readSelection(search) {
  const params = new URLSearchParams(search);
  const requested = aliases[params.get('tab')] || params.get('tab');
  const product = products.find(item => item.id === requested) || products[0];
  const plan = product.plans.find(item => !item.soldOut && item.id === params.get('plan')) || product.plans.find(item => !item.soldOut);
  return { product, plan, quantity:clampQuantity(params.get('quantity'),product,plan) };
 }
 const money = value => '$' + Number(value).toFixed(2);
 if (typeof module === 'object' && module.exports) module.exports = { products, readSelection, money, originalTabs };
 if (typeof document === 'undefined') return;
 const main = document.querySelector('main[data-workspace-page="purchase"]');
 if (!main) return;
 const $ = selector => main.querySelector(selector);
 const tabs = [...main.querySelectorAll('[data-purchase-tab]')];
 const options = $('#purchase-plan-options');
 const layout = $('.ws-purchase-layout');
 const areaField = $('#purchase-area');
 const durationField = $('#purchase-duration');
 const quantityField = $('#purchase-quantity');
 const dialog = $('#purchase-order-dialog');
 const preview = $('#purchase-preview');
 const status = $('#purchase-status');
 const promoForm = $('#purchase-promo');
 const promoInput = $('#purchase-promo-code');
 const promoStatus = $('#purchase-promo-status');
 const demoCode = 'REDROCK10';
 const demo = window.RedRockDemo;
 const demoConfirm = demo && $('#purchase-demo-confirm');
 const demoRecharge = demo && $('#purchase-demo-recharge');
 const demoStatus = demo && $('#purchase-demo-status');
 let selected = readSelection(window.location.search), backdrop = false;
 let promoApplied = false;
 let animation = null, pending = null;
 const originalUrl = product => 'https://redrock-ip.com/dashboard/purchase?tab=' + encodeURIComponent(originalTabs[product.id] || product.id);
 function updateUrl(push) {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', selected.product.id);
  url.searchParams.set('plan', selected.plan.id);
  if (selected.quantity > 1) url.searchParams.set('quantity', selected.quantity);
  else url.searchParams.delete('quantity');
  if (promoApplied) url.searchParams.set('promo',demoCode);
  else url.searchParams.delete('promo');
  if (url.href !== window.location.href) window.history[push ? 'pushState' : 'replaceState'](null, '', url.pathname + url.search + url.hash);
 }
 function quote() {
  const subtotalCents = Math.round(selected.plan.total * 100) * selected.quantity;
  const discountCents = promoApplied ? Math.round(subtotalCents * .10) : 0;
  return { subtotal: subtotalCents / 100, discount: discountCents / 100, total: (subtotalCents - discountCents) / 100 };
 }
 function chosenQuantity() {
  return ['static','datacenter','live'].includes(selected.product.id) ? selected.quantity + ' IP' : selected.plan.quantity;
 }
 function chosenDuration() {
  return selected.product.id === 'unlimited' && selected.plan.durationOrder === 1 && selected.quantity > 1
   ? selected.quantity + ' 小时' : selected.plan.duration;
 }
 function renderTotals() {
  const amounts = quote();
  $('#purchase-summary-total').textContent = money(amounts.total);
  $('#purchase-promo-breakdown').hidden = !promoApplied;
  $('#purchase-promo-subtotal').textContent = money(amounts.subtotal);
  $('#purchase-promo-discount').textContent = '−' + money(amounts.discount);
  if (demo) {
   const params = {tab:selected.product.id,plan:selected.plan.id};
   if (selected.quantity > 1) params.quantity = selected.quantity;
   if (promoApplied) params.promo = demoCode;
   demoRecharge.href = demo.url('/dashboard/recharge',params);
  }
 }
 function restorePromo() {
  promoApplied = new URLSearchParams(window.location.search).get('promo') === demoCode;
  promoInput.value = promoApplied ? demoCode : '';
  promoInput.removeAttribute('aria-invalid');
  promoStatus.textContent = promoApplied ? '已应用演示优惠码，享受 9 折。' : '';
 }
 promoForm.addEventListener('submit', event => {
  event.preventDefault();
  promoApplied = promoInput.value.trim().toUpperCase() === demoCode;
  if (promoApplied) {
   promoInput.value = demoCode;
   promoInput.removeAttribute('aria-invalid');
   promoStatus.textContent = '已应用演示优惠码，享受 9 折。';
  } else {
   promoInput.setAttribute('aria-invalid','true');
   promoStatus.textContent = '演示码无效，请使用 REDROCK10。';
   promoInput.focus();
  }
  renderTotals();
  updateUrl(false);
 });
 promoInput.addEventListener('input', () => {
  promoInput.removeAttribute('aria-invalid');
  promoStatus.textContent = '';
  if (!promoApplied) return;
  promoApplied = false;
  renderTotals();
  updateUrl(false);
 });
 function row(parent, label, value) {
  const wrapper = document.createElement('div'), term = document.createElement('dt'), definition = document.createElement('dd');
  term.textContent = label; definition.textContent = value; wrapper.append(term, definition); parent.append(wrapper);
 }
 function setOptions(field, entries, value) {
  field.replaceChildren(...[...entries].map(([id, label]) => {
   const option = document.createElement('option');
   option.value = id; option.textContent = label;
   return option;
  }));
  field.value = String(value);
 }
 function renderSelectionDetails() {
  for (const id of ['purchase-config-quantity','purchase-summary-package']) $('#'+id).textContent = chosenQuantity();
  for (const id of ['purchase-config-duration','purchase-summary-duration']) $('#'+id).textContent = chosenDuration();
  renderTotals();
 }
 function render() {
  const { product, plan } = selected;
  tabs.forEach(tab => {
   const active = tab.dataset.purchaseTab === product.id;
   tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
  });
  $('#purchase-product-panel').setAttribute('aria-labelledby', 'purchase-tab-' + product.id);
  $('#purchase-product-eyebrow').textContent = product.eyebrow;
  $('#purchase-product-name').textContent = product.name;
  $('#purchase-product-description').textContent = product.description;
  $('#purchase-starting-price').textContent = productPrices[product.id].starting;
  const areas = new Map(product.plans.filter(item => !item.soldOut && item.areaKey).map(item => [item.areaKey,item.area]));
  const areaPlans = product.plans.filter(item => item.areaKey === plan.areaKey);
  const durations = new Map(areaPlans.filter(item => !item.soldOut && item.durationOrder).sort((a,b) => a.durationOrder-b.durationOrder).map(item => [item.durationOrder,item.duration]));
  $('#purchase-area-field').hidden = !areas.size;
  $('#purchase-duration-field').hidden = durations.size < 2;
  setOptions(areaField,areas,plan.areaKey);
  setOptions(durationField,durations,plan.durationOrder);
  const visiblePlans = areaPlans.filter(item => item.durationOrder === plan.durationOrder);
  $('#purchase-plan-count').textContent = '当前显示 ' + visiblePlans.length + ' 项 · 全部 ' + product.plans.length + ' 项';
  quantityField.value = String(selected.quantity);
  $('#purchase-quantity-field').hidden = quantityLimit(product,plan) === 1;
  $('#purchase-quantity-label').textContent = product.id === 'unlimited' ? '试用小时数' : '购买数量';
  options.replaceChildren();
  visiblePlans.forEach(item => {
   const label = document.createElement('label'), input = document.createElement('input'), body = document.createElement('span'), title = document.createElement('strong'), quantity = document.createElement('span'), price = document.createElement('b'), condition = document.createElement('small');
   label.className = 'ws-purchase-plan-option'; label.dataset.selected = String(item.id === plan.id);
   input.type = 'radio'; input.name = 'purchase-plan'; input.id = 'purchase-plan-' + item.id; input.value = item.id; input.checked = item.id === plan.id;
   input.disabled = item.soldOut;
   title.textContent = item.label || '套餐'; quantity.textContent = item.quantity; price.textContent = item.soldOut ? '已售罄' : money(item.total); condition.textContent = item.unit + ' · ' + item.duration;
   body.className = 'ws-purchase-plan-option-body'; body.append(title, quantity, condition); label.append(input, body, price); options.append(label);
   input.addEventListener('change', () => { if (input.checked && !item.soldOut) { selected = { product, plan: item, quantity:1 }; render(); $('#purchase-plan-' + item.id)?.focus(); updateUrl(false); status.textContent = '已更新所选套餐。'; } });
  });
  const values = {
   'purchase-config-network': product.name, 'purchase-config-region': plan.label || productPrices[product.id].region,
   'purchase-summary-product': product.name, 'purchase-summary-unit': plan.unit, 'purchase-summary-region': plan.label || productPrices[product.id].region,
  };
  Object.entries(values).forEach(([id,value]) => $('#'+id).textContent = value);
  $('#purchase-original').href = originalUrl(product); $('#purchase-order-original').href = originalUrl(product);
  if (demo) {
   $('#purchase-original').hidden = true;
   $('#purchase-order-original').hidden = true;
   $('.ws-purchase-account').hidden = true;
  }
  renderSelectionDetails();
  preview.disabled = false;
 }
 function chooseGroup(area,duration) {
  const { product } = selected;
  const available = product.plans.filter(item => item.areaKey === area && !item.soldOut);
  const plan = available.find(item => item.durationOrder === duration) || available[0];
  if (!plan) return;
  selected = { product, plan, quantity:1 }; render(); updateUrl(false);
 }
 areaField.addEventListener('change', () => chooseGroup(areaField.value,selected.plan.durationOrder));
 durationField.addEventListener('change', () => chooseGroup(selected.plan.areaKey,Number(durationField.value)));
 quantityField.addEventListener('input', () => {
  selected.quantity = clampQuantity(quantityField.value,selected.product,selected.plan);
  renderSelectionDetails(); updateUrl(false);
 });
 quantityField.addEventListener('blur', () => { quantityField.value = String(selected.quantity); });

 const motionAllowed = () => typeof layout?.animate === 'function' && document.documentElement?.dataset.motion !== 'off' &&
  (document.documentElement?.dataset.motion === 'on' || !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
 function commitSelection(change) {
  selected = change.selection;
  if (change.restore) restorePromo();
  render();
  if (change.push) updateUrl(true);
  status.textContent = change.push ? '已更新产品与套餐参考。' : '';
 }
 function setSwitching(active) {
  if (!layout) return;
  layout.inert = active;
  layout.setAttribute('aria-busy',String(active));
 }
 function switchSelection(selection,{push=false,restore=false}={}) {
  const change = {selection,push,restore};
  if (!motionAllowed() || (selection.product === selected.product && !pending)) {
   animation?.cancel(); animation = null; pending = null;
   setSwitching(false); commitSelection(change);
   return;
  }
  // Keep one fade-out running. The latest selected tab supplies the next panel.
  if (pending) { pending = change; return; }
  pending = change;
  const opacity = animation ? Number(window.getComputedStyle(layout).opacity) : 1;
  animation?.cancel();
  setSwitching(true);
  const fadeOut = layout.animate([{opacity},{opacity:0}],{duration:125,easing:'ease-in',fill:'forwards'});
  animation = fadeOut;
  fadeOut.finished.then(() => {
   if (animation !== fadeOut) return;
   const latest = pending;
   pending = null;
   commitSelection(latest);
   if (motionAllowed()) {
    const fadeIn = layout.animate([{opacity:0},{opacity:1}],{duration:195,easing:'ease-out'});
    animation = fadeIn;
    fadeOut.cancel();
    fadeIn.finished.then(() => {
     if (animation !== fadeIn) return;
     animation = null;
     setSwitching(false);
    },() => {});
   } else {
    fadeOut.cancel(); animation = null; setSwitching(false);
   }
  },() => {});
 }
 function chooseTab(id) {
  const product = products.find(item => item.id === id) || products[0];
  if (product === selected.product && !pending) return;
  switchSelection({ product, plan:product.plans.find(plan => !plan.soldOut), quantity:1 },{push:true});
 }
 tabs.forEach((tab,index) => {
  tab.addEventListener('click', () => chooseTab(tab.dataset.purchaseTab));
  tab.addEventListener('keydown', event => {
   const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
   if (next === null) return;
   event.preventDefault(); tabs[next].focus(); chooseTab(tabs[next].dataset.purchaseTab);
  });
 });
 window.addEventListener('popstate', () => { closeDialog(); switchSelection(readSelection(window.location.search),{restore:true}); });
 preview.addEventListener('click', () => {
  const { product, plan } = selected;
  const details = $('#purchase-order-details'); details.replaceChildren();
  row(details, '产品', product.name); row(details, '套餐数量', chosenQuantity()); row(details, '地区', plan.label || productPrices[product.id].region); row(details, '使用期限', chosenDuration());
  if (promoApplied) row(details, '优惠金额', '−' + money(quote().discount));
  $('#purchase-order-total').textContent = money(quote().total);
  if (demo) {
   demoConfirm.disabled = false;
   demoRecharge.hidden = true;
   demoStatus.textContent = '';
  }
  if (typeof dialog.showModal === 'function') { dialog.showModal(); $('#purchase-order-title').focus(); }
  else status.textContent = '当前浏览器不支持预览弹窗，请在右侧摘要检查配置后前往原站。';
 });
 if (demo) {
  demoConfirm.hidden = false;
  demoConfirm.addEventListener('click', () => {
   const { product, plan } = selected;
   const result = demo.purchase(product.id,{...plan,total:quote().total});
   if (result.ok) {
    demoConfirm.disabled = true;
    window.location.assign(demo.url('/dashboard/orders'));
   } else {
    demoRecharge.hidden = result.reason !== 'balance';
    demoStatus.textContent = result.reason === 'balance' ? '演示余额不足，请先模拟充值。' : demo.message(result);
   }
  });
 }
 function closeDialog() { if (dialog.open) dialog.close(); }
 $('#purchase-order-close').addEventListener('click', closeDialog);
 $('#purchase-order-edit').addEventListener('click', closeDialog);
 dialog.addEventListener('close', () => preview.focus());
 const outside = event => { const rect = dialog.getBoundingClientRect(); return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom; };
 dialog.addEventListener('pointerdown', event => { backdrop = event.target === dialog && outside(event); });
 dialog.addEventListener('pointercancel', () => { backdrop = false; });
 dialog.addEventListener('click', event => { const close = backdrop && event.target === dialog && outside(event); backdrop = false; if (close) closeDialog(); });
 restorePromo();
 render();
})();
