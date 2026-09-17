# Verification

The repository is a static browser demo. The smoke test checks that the public
copy keeps its truth labels and does not contain obvious contact-data markers.

Run:

```bash
npm test
npm run serve
```

Open `http://localhost:8787` and exercise Dashboard → Pipeline → Customer →
Quotation → Contract → Delivery → Forecast → AI Assistant.

The assistant text is a deterministic demo response. It is not connected to a
model, CRM, database, email provider, or messaging channel.
