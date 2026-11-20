# REDROCK 接口接入

在 `release-tools/redrock-backend.js` 或部署目录中的 `dist/redrock-backend.js` 注册 `window.RedRockBackend`。配置脚本以普通 JS 文件加载。下表中的方法均为可选，按对应功能接入。可直接调用站点自己的客户端或封装 `fetch`。把密钥、支付签名和请求鉴权留在服务端。

所有方法接收第二个参数 `{language, path}`。语言为 `zh-CN` 或 `en`，路径来自当前页面。错误时抛出异常或返回被拒绝的 Promise。重定向可返回同源的相对路径，第三方登录和支付只接受已填入 `allowedRedirectOrigins` 的 HTTPS 源。

| 方法 | 请求 | 成功返回 |
| --- | --- | --- |
| `login` | `{email, password, remember}` | `{redirect}` 会话由服务端建立，可省略跳转字段以进入当前语言的控制台 |
| `getRegistrationCaptcha` | `{}` | `{challengeId, imageUrl}`，服务端的一次性图形验证码 |
| `sendRegistrationCode` | `{email, challengeId, captcha}` | `{ok: true, retryAfterSeconds?}`，注册邮件验证码请求已受理 |
| `registerAccount` | `{email, code, password, inviteCode?, termsAccepted}` | `{ok: true, redirect?}`，账户已创建，服务端可建立会话并返回安全跳转 |
| `getRecoveryCaptcha` | `{}` | `{challengeId, imageUrl}`，服务端的一次性图形验证码 |
| `sendRecoveryCode` | `{email, challengeId, captcha}` | `{ok: true, retryAfterSeconds?}`，邮箱验证码请求已受理 |
| `resetPassword` | `{email, code, newPassword}` | `{ok: true}`，密码已重置 |
| `startGoogleLogin` | `{}` | `{redirect}` 服务端生成的登录地址 |
| `loadStartingPrices` | `{}` | `{prices}`，产品 ID 对应当地语言的最低单位起价文本 |
| `loadPurchaseCatalog` | `{}` | `{products}`，结构见下文 |
| `quotePurchase` | `{productId, planId, quantity, promoCode}` | `{quoteId, totalCents, discountCents}`，服务端校验库存与优惠码，金额以分为单位 |
| `createOrder` | `{quoteId}` | `{orderId, redirect?}`，按服务端报价生成订单，然后进入订单页或真实支付页 |
| `createRecharge` | `{amountCents, paymentMethod}`，通道为 `online` 或 `crypto` | `{redirect}`，真实充值订单的支付地址 |
| `loadPaymentStatus` | `{paymentRef}`，支付返回页传来的查询标识 | `{status, orderId?, totalCents?}`，`status` 为 `pending`、`paid` 或 `failed` |
| `loadTrafficDetails` | `{productId, from, to, interval}` | 住宅动态代理和移动代理的汇总、趋势、国家分布和目标域名 |
| `loadUsage` | `{productId, days}` | `{rows: [{date, gb}]}`，代理生成页的每日流量 |
| `loadUnlimitedKeys` | `{}` | `{keys: [{id, label, status?, purchasedAt?}]}`，不限量已购买列表与密钥筛选 |
| `loadUnlimitedUsage` | `{keyId, range}` | 总流量、上传与下载、带宽、连接数和趋势序列 |
| `requestService` | `{productId, mode, fields}` | `{connection, details}`，`details` 为 `[{label,value}]` |
| `mountPage` | 单个参数 `{path, language, main, tools}` | 完成相应页面的加载与渲染 |

## 登录、注册与找回密码

正式站提供 `/login`、`/register`、`/forgot-password` 及对应 `/en/` 页面。登录成功后由服务端建立会话。勾选「记住邮箱」时浏览器只保存邮箱地址。

注册使用 `getRegistrationCaptcha`、`sendRegistrationCode` 和 `registerAccount`。注册与密码找回应各自绑定验证码用途。注册网址的 `invitecode` 参数可预填邀请码，服务端需要验证邀请码与条款同意状态。成功响应可以提供 `redirect`；省略时页面会显示创建成功与返回登录入口。注册页的条款和隐私链接使用正式站的 `/terms` 和 `/privacy`。

密码找回使用 `getRecoveryCaptcha`、`sendRecoveryCode` 和 `resetPassword`。两种流程的图形挑战 `imageUrl` 可以是同源 URL，或 PNG、JPEG、GIF、WebP 的 Base64 图片，数据 URL 总长度上限为 1.4 MB。请在服务端生成验证码，配置有效期、单次使用与速率限制，并将挑战 ID 与请求绑定。前端按原站的六位邮件验证码与至少六字符密码规则校验，服务端仍需验证。成功受理邮件请求后，前端至少等待 60 秒才开放重发。响应应避免暴露邮箱是否注册。密码重置成功后，用户通过「返回登录」用新密码登录。邮箱验证码和密码只传给你配置的接口。

## 产品目录和订单

八类产品的 ID 为 `dynamic`、`static`、`mobile`、`datacenter`、`static-daily`、`live`、`unlimited`、`short`。接口按这些产品 ID 提供各自的套餐和可选的 `starting` 文案。价格展示采用 `$` 符号。地区展示使用概括名称。

```text
products[] → { id, starting?, plans[] }
plans[]    → { id, label, quantity, duration, areaKey, area,
                durationOrder, total, unit, soldOut }
```

- `id` 是接口识别的套餐 ID，可用字母、数字、下划线、短横线。每个产品的套餐 ID 在该产品下唯一。
- `label`、`quantity`、`duration`、`areaKey`、`area`、`unit` 均为字符串。`areaKey` 相同的套餐归为一组，`area` 用于分组的地区概括。产品无地区选择时这两个字段为空串。
- `durationOrder` 是非负整数，供期限排序与分组。无期限分组时用 `0`。`total` 是非负数，按界面显示的 `$` 单位返回。`soldOut` 是布尔值。
- 返回全部八类产品。暂时无库存时可返回空的套餐数组或全部售罄的套餐，该产品仍可切换查看，购买操作停用。
- 普通套餐内的资源数量已计入套餐。静态住宅、数据中心和直播专线按 IP 数量下单，动态不限量的一小时套餐可调小时数。服务端重新校验数量、库存、地区、期限、优惠和结算币种。
- 报价需要由服务端绑定当前账号、套餐与有效期。优惠码和最终成交价以此报价为准。确认下单时仅提交 `quoteId`。服务端对订单创建与充值做幂等校验，并根据支付回调确认到账。
- 账户充值当前界面允许 $10–$2,000。若正式业务规则变更，请同步更新 `dist/dashboard/recharge.html`、`dist/en/dashboard/recharge.html` 和 `release-tools/release-runtime.js` 的范围与文字。

### 外部支付返回

支付回调由现有服务验证并记录。让浏览器返回同语言的 `/dashboard/orders?paymentRef=<查询标识>` 或 `/en/dashboard/orders?paymentRef=<查询标识>`，即可打开付款状态小窗。标识使用 1–200 个 URL 安全字符（字母、数字、点、下划线、短横线或波浪号），由服务端生成并绑定当前登录账号可查看的付款。

接口应根据已验证的支付记录返回状态。待确认时返回 `pending`，付款确认后返回 `paid` 及订单编号 `orderId`、订单金额 `totalCents`（单位为分）。确定未完成可返回 `failed`。小窗每隔 2.5 秒查询一次等待中的付款，最多查询 20 次，之后可手动重新查询。

## 代理生成页的流量使用明细

- 住宅动态代理和移动代理在仅配置 `loadUsage` 时仍可展示每日明细表。`productId` 是 `dynamic` 或 `mobile`，`days` 是 7、14 或 30。`date` 为业务时区的 `YYYY-MM-DD`，每天一行，`gb` 为非负数字，单位 GB。该区间无记录时返回 `{rows: []}`。
- 动态不限量的下拉筛选和「已购买列表」使用 `loadUnlimitedKeys`。请返回当前账号可以查看的生效及历史记录。`id` 使用不透明的记录 ID，`label` 返回脱敏后的名称或密钥尾号，不能使用完整密钥。`status` 为可选的本地化状态文本，`purchasedAt` 为带时区的 ISO 时间。
- `loadUnlimitedUsage` 的 `keyId` 为上述记录 ID 或 `null`。`null` 查询当前账号全部可查密钥，含历史记录。`range` 为 `1h`、`2h`、`24h` 或 `3d`。服务端需要检查当前账号可见范围。
- 不限量汇总字段为 `totalBytes`、`uploadBytes`、`downloadBytes`、`averageMbps`、`peakMbps`、`maxConnections`。趋势字段 `points` 为数组，每项含 `at`、`bandwidthMbps`、`downloadMbps`、`uploadMbps`、`maxConnections`、`activeConnections`。数值为非负数字。`at` 使用带时区的 ISO 时间，前端按 UTC+8 显示。无记录的区间可返回零值汇总及空的 `points`。
- 上述接口均可单独启用。密钥清单未接入时，「全部密钥」仍可用，前提是已配置 `loadUnlimitedUsage`。正式包在未收到数据时显示空状态，加载失败可用「刷新」或「重试」。

### 住宅动态代理和移动代理的完整明细

`loadTrafficDetails` 查询当前登录账号的住宅动态代理或移动代理。`productId` 为 `dynamic` 或 `mobile`。`from` 和 `to` 由界面的 UTC+8 时间转换成 ISO UTC 字符串。时间区间须为正数且不超过 30 天。`interval` 为 `hour` 或 `day`。按 UTC+8 划分统计桶并为趋势时间戳提供时区。

| 返回字段 | 格式 |
| --- | --- |
| `summary` | `{totalBytes, uploadBytes, downloadBytes, requests, successfulRequests, rateLimitedRequests}` |
| `points` | `[{at, totalBytes, uploadBytes, downloadBytes, requests}]`，`at` 为带时区的 ISO 时间 |
| `countries` | `[{code, bytes}]`，`code` 为两字母国家代码，未知地区可用 `ZZ` |
| `domains` | `[{host, successfulRequests, totalBytes, requests}]`，每次最多返回 500 个主机，界面会对该结果集排序和分页 |
| `notice` | 可选的本地化提示 |

流量字段使用字节，请求字段使用次数，均返回非负整数。前端根据成功次数和请求数计算成功率。无数据的已授权区间可返回零值汇总和空数组。鉴权失败或查询失败应抛出异常。请在服务端验证日期、产品与账号权限，目标主机只返回当前账号可查看的记录。

## 账户数据挂载

用 `mountPage` 读取当前登录用户的数据。通过 `main.querySelector()` 获取下列节点，并在返回真实结果后更新内容。静态账务页面的滤镜、分页和导出控件默认停用，按实际接口为控件绑定事件再启用。数据不可用时可保留页面的状态文字。用 `tools.status(main.querySelector('#release-status'), '')` 可清除已经恢复的状态提示。

| 页面 | 可挂载的主要节点 |
| --- | --- |
| 控制台 | `#preview-description`、`#balance-value`、`#dynamic-remaining`、`#dynamic-total`、`#dynamic-meter-fill`、`#mobile-remaining`、`#mobile-total`、`#mobile-meter-fill`、`#static-count`、`#datacenter-count`、`#order-rows`、`#orders-table-wrap`、`#orders-empty` |
| 订单 | `#records-total-count`、`#records-paid-count`、`#records-unpaid-count`、`#records-rows`、`#records-table-wrap`、`#records-empty`、`#records-filters`、`#records-dialog` 和 `#records-detail-list` |
| 用量 | `#usage-type`、`#usage-period`、`#usage-total`、`#usage-table-body`、`#usage-table-wrap`、`#usage-chart-wrap`、`#usage-chart`、`#usage-export` |
| 推广 | `#affiliate-link`、`#affiliate-code-label`、`#affiliate-invites-rows`、`#affiliate-commissions-rows`、`#affiliate-invite-count`、`#affiliate-total-commission`、`#affiliate-available` |
| 充值 | `.ws-recharge-history` |
| 产品连接配置 | `#service-form`、`#service-resource`、`#service-result`。内嵌流量明细使用上节接口自行渲染 |
| 代理和设备检测 | `#proxy-format-form`、`#device-format-form` |

产品连接配置页的可用资源由账户接口加载到 `#service-resource`。按产品和权限选择后启用字段。现有代理与设备检测是浏览器端格式检查。正式网络检测或设备查询可在 `mountPage` 中绑定单独的操作和结果区域。

将 API 返回的数据通过 `textContent` 或 DOM 节点写入页面。会话、充值、优惠和订单等操作应由原有服务校验授权和请求来源。
