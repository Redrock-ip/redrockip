# English edition

The Chinese HTML files in `dist/` remain the source pages. English pages and localized scripts are generated into `dist/en/`, with the same page names, IDs, anchors, product routes and interactions.

Run from the repository root after editing source content or translation maps:

```sh
python locales/build-english.py
```

Maps are merged in this order: marketing, company, account, tools, navigation, common, corrections. Longer source strings match first, in one pass. Keep template expressions and markup intact when adding translations. English scripts must pass `node --check`; review translated attributes and runtime messages as well as visible copy.

Images, downloads and CSS are shared. Navigation stays within the selected language; the header switch links to the matching page and preserves its query and fragment. `locale.css` contains English layout adjustments, the translated FAQ CSS hint and the shared footer columns.

Both editions remain visual previews with the same backend limitations. The contact component uses Telegram `@RedrockIP` and the existing support email. The enterprise WeChat QR code is pending the correct source asset; no substitute code or account has been added.

The generator first runs `scripts/build-nav-menus.py`. It builds the eight-product pricing menu, two-tool menu and pricing overview from `catalog-products.json` and the checked public package references in `data/pricing-reference.json`. Starting prices use the lowest listed unit rates and summarize coverage. Exact package amounts are shown when customers choose a package. Display amounts use the original site’s `$` symbol. Refresh and verify the reference data before regenerating updated prices. Hover is an enhancement; native details/summary keeps both menus usable with click, keyboard and touch.

Workspace pages live at `/dashboard/purchase`, `/dashboard/recharge`, `/dashboard/orders`, `/dashboard/affiliate` and `/dashboard/usage`, with matching `/en/dashboard/…` routes. Their source bodies are in `workspace-templates/`; `scripts/build-workspace-pages.py` assembles the shared sidebar/header/footer before translation. Workspace translation maps are loaded before common overrides. The generator resolves nested page assets and preserves language within navigation. CDK has no page or navigation entry in this preview. Real payment, purchase, account and referral operations remain on the original site; all new local interactions clearly identify their preview or sample states.
