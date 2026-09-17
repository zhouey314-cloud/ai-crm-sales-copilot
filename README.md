# AI CRM Sales Copilot

> Self-built product demo / synthetic data

This repository is a browser-based demonstration of a connected sales
workflow: customer context → opportunity → quotation → contract → delivery →
forecast → human-reviewed assistant guidance.

It is not a production CRM and it does not contain customer records.

## What exists

- Dashboard, pipeline, customer records, quotation, contract, delivery,
  analytics and assistant views.
- A responsive static UI with sample records and review boundaries.
- A deterministic assistant panel showing how structured CRM context can be
  turned into a next-step suggestion.

## What is mock

- All records are synthetic.
- AI responses are `MOCK / DEMO / NOT_CONNECTED` deterministic copy.
- There is no database, authentication, model provider, email, WhatsApp or
  automatic follow-up.
- Buttons that look like create/export actions are presentation-only unless
  the page explicitly says otherwise.

## Quick start

Requirements: Node.js 18+ or Python 3.10+.

```bash
npm test
npm run serve
```

Then open <http://localhost:8787>.

## Architecture

The demo is intentionally small:

```text
index.html       views and synthetic records
app.js           navigation, drawers and deterministic demo interactions
style.css        layout and responsive presentation styles
system-font.css  local/system font stack
tests/           offline smoke checks
```

## Privacy and data boundary

The repository contains no real customer names, contact details, credentials,
contracts or financial records. Replace the sample data only after adding a
separate privacy review and a real storage/authentication design.

## Status and limitations

Status: public demonstration project. The UI and offline smoke checks are
verified locally. Production integrations, model quality, CRM persistence,
permissions, audit retention and deployment are not implemented.

## License

MIT. See [LICENSE](LICENSE).
