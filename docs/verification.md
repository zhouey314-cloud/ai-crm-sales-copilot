# Verification

The repository is a static browser demo. The smoke test checks that the public
copy keeps its truth labels and does not contain obvious contact-data markers.

Run:

```bash
npm test
npm run serve
```

Open `http://localhost:8787` and exercise Dashboard → Pipeline → Opportunity drawer → Manager View → Rule-based Assistant. Check Lead → Qualified, the required Lost reason, activity timeline and persistence after reload. Switch the assistant between a stale item, an old proposal and a high-value item; advice must differ. Other quotation/contract/delivery screens remain illustrative.

The assistant text is a deterministic rule-based demo response from structured fictional records. It is not connected to a
model, CRM, database, email provider, or messaging channel.
