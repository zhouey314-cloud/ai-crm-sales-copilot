# AI CRM Sales Copilot

![Synthetic CRM dashboard](screenshots/crm-dashboard.webp)

> Self-built product demo / synthetic data

This repository is a browser-based demonstration of a connected sales
workflow: customer context → opportunity → quotation → contract → delivery →
forecast → human-reviewed assistant guidance.

It is not a production CRM and it does not contain customer records.

## What exists

- Dashboard, pipeline, customer records, quotation, contract, delivery,
  analytics and assistant views.
- A responsive UI with sample records, local structured persistence, stage transitions and an audit trail.
- A deterministic assistant panel showing how structured CRM context can be
  turned into a next-step suggestion.

## What is mock

- All records are synthetic.
- AI responses are `MOCK / DEMO / NOT_CONNECTED` deterministic copy.
- There is no server database, authentication, real model provider, email, WhatsApp or
  automatic follow-up.
- Advancing a stage in an opportunity drawer writes a structured JSON store to this browser's localStorage. Other create/export actions remain presentation-only unless the page explicitly says otherwise.

## Quick start

Live static preview: <https://zhouey314-cloud.github.io/ai-crm-sales-copilot/>.
The preview stores changes only in the visitor's own browser; it is not a
shared CRM service.

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
crm-store.js     local structured store, audit and mock/external provider states
style.css        layout and responsive presentation styles
system-font.css  local/system font stack
tests/           offline smoke checks
```

## Privacy and data boundary

The repository contains no real customer names, contact details, credentials,
contracts or financial records. Replace the sample data only after adding a
separate privacy review and a real storage/authentication design.

## Status and limitations

Status: public demonstration project. The UI, local persistence and offline checks are
verified locally. Production integrations, model quality, server CRM persistence,
permissions, audit retention and deployment are not implemented.

## License

MIT. See [LICENSE](LICENSE).
