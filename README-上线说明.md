# RED ROCK 正式站前端更新包

此包以已审阅的中英文视觉稿为基础，包含 48 个页面。已打包首页、产品、价格、常见问题、关于、联系、代理检测、设备检测、登录、控制台、购买、充值、订单、推广、用量，以及八类产品的连接配置页。控制台导航已移除 CDK。

## 部署

1. 将现有站点与路由配置备份后，在测试域名或现有服务的测试环境中验证。将 `dist/` 的内容部署到站点根目录，确保 `/en/` 和静态资源路径可访问。
2. 按 [接口接入说明](CONNECT-API.md) 填写 `dist/redrock-backend.js`。正式仓库的对应配置文件是 `release-tools/redrock-backend.js`，重建时会复制该文件。
3. 将无扩展名路径指向同名 HTML 文件。以 [Nginx 路由片段](deploy/nginx-routes.conf) 为例保留原来的 API、支付回调、登录回调、账户授权、注册、密码找回和账户设置路由。控制台路径的登录校验继续由现有服务或网关处理。
4. 接上真实接口后，在测试环境依次验收登录、八类产品的套餐与库存、优惠码、报价、购买、订单、充值、用量和推广数据。确认资费与套餐同步后再切换正式流量。

`dist/` 是部署目录。`source/` 保留全部可编辑的视觉稿与原有双语构建资源。`release-tools/` 生成正式前端产物，过滤演示数据和演示流程。仅发布 `dist/`。

公开价格默认展示 2026-11-18 整理的最低单位起价和地区概括。接入 `loadStartingPrices` 后可同步公开起价。购买页在实时目录未加载时可切换浏览八类产品及历史套餐参考。创建订单需要实时目录和服务端报价。登录、充值和连接配置操作在各自接口启用后可用。订单、用量、推广、余额和账户统计使用正式账户接口填充。住宅动态代理和移动代理生成页可按 UTC+8 查询最多 30 天，查看请求指标、使用趋势、国家分布和热门目标域名。动态不限量页包含已购买密钥列表、带宽和连接趋势，接口字段详见接入说明。

## 本地查看

```sh
python -m http.server 8000 --directory dist
```

直接打开 `http://localhost:8000/index.html`、`/en/index.html` 或 `/dashboard/purchase.html`。Python 的简易服务器只适合快速查看带文件扩展名的页面。完整的无扩展名路由和语言切换使用部署配置验证。

## 重建

在更新包根目录执行以下命令。修改中文视觉稿时，可调整 `source/dist/`、`source/workspace-templates/` 及 `source/scripts/`，再按具体改动重新生成页面。修改双语文案时可编辑 `source/locales/`。正式构建使用已有的两种语言页面。

```sh
python -m pip install -r release-tools/requirements-build.txt
python release-tools/build-release.py
```

需重新生成英文页面时，在正式构建前运行 `python source/locales/build-english.py`。构建会替换根目录的 `dist/`，请把持久的接口改动保存在 `release-tools/redrock-backend.js`。

`REVISION.txt` 记录视觉稿原始提交。发布入口与视觉稿源码的校验值见 `SHA256SUMS.txt`。
