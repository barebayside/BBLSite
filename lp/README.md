# BBL Landing Pages

Paid-traffic landing pages. Each LP is a folder here with its own `index.html`.

## URL pattern

Folder `site/lp/awr-comp-1-0a/` serves at `barebaysidelabs.com/lp/awr-comp-1-0a/`.

The slug = the asset registry code, lowercased, with dots and underscores replaced by hyphens. The `_WEB_LP` suffix is dropped from the URL (implicit at `/lp/`).

## Discipline

- Every LP MUST include `<meta name="bbl-asset-code" content="...">` in the head
- Every LP MUST include the variant-stamping JS from `_template/index.html`
- LPs are blocked from Google indexing via `site/robots.txt` (`Disallow: /lp/`) and `<meta name="robots" content="noindex, nofollow">` — they only get traffic from ad clicks
- Don't add LPs to the main site nav
- Don't include LPs in the sitemap

## Creating a new LP

1. Get the asset code from Claude (use the `bbl-asset-code` skill)
2. Copy `_template/index.html` to a new folder named after the URL slug
3. Replace every `REPLACE_WITH_*` placeholder
4. Set the `bbl-asset-code` meta tag to the full code (e.g. `AWR-COMP-1.0A_WEB_LP`)
5. Set the form `action` to your Zoho Forms / CRM webform endpoint
6. Test the form — submit it and verify `LP_Variant` and `LP_Asset_Code` land on the CRM Lead

## Files

- `_template/` — boilerplate LP template, never served (path excluded via lack of links)
- `README.md` — this file
