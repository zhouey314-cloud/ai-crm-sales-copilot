# CRM rule-based demo verification

This project has no probabilistic model execution. The "assistant" is deterministic business logic over fictional browser records, not an LLM. Its success condition is to vary next-step guidance based on observable fields and leave decisions to a human.

Baseline before V3: smoke and structured-store tests passed; six sample opportunities, Qualified → Solution fit → Proposal → Negotiation → Won progression, a single generic mock suggestion, localStorage audit.

Current deterministic gates:

1. Lead → Qualified → Proposal → Negotiation → Won, plus reason-required Lost; no invalid skip or post-closure advancement.
2. Existing v1 local demo records migrate without losing their title, account, action or audit.
3. Recommendations cover stale activity, proposal wait, missing decision maker, high sample value, closed stage and default next action. Tests use a fixed clock.
4. Manager counts, active pipeline, weighted fictional forecast, stale and risk queue derive from the same records.
5. Browser check: drawer detail, activity timeline, persistence after reload, distinct assistant advice, Manager View.

All records and monetary amounts are synthetic and unverified. No revenue, conversion, model-quality, customer outcome or production readiness claim is supported. There is no LLM provider, authentication, server persistence, or secure audit. The rule output is a suggestion; stage changes require a human click.
