# Case Study — AI CRM Sales Copilot

## Problem
A sales demo needs to show the path from an opportunity to a manager forecast without implying that a mock assistant has contacted customers.

## Context
This is a self-built browser demo with eight fictional opportunities and sample amounts. No customer data or revenue is represented.

## Constraints
Static hosting, no server or authentication, and no connected model or messaging provider.

## My Role
Implemented the public demo workflow, local state, rule-based guidance, tests and documentation.

## Architecture
The UI reads and updates a structured local store. Stage transitions and activity feed feed the manager summary and deterministic assistant. Browser localStorage persists this device's demo state.

## Key Decisions
The assistant is labelled `MOCK / RULE-BASED / NOT_CONNECTED`. A user must explicitly advance a stage; Lost requires a reason. Forecast is derived from the same fictional records, not a separate hard-coded table.

## Hardest Problem
Keeping opportunity, activity, audit and forecast views consistent while allowing reload and migration from an older demo store.

## Failure/Tradeoff
LocalStorage makes the demo easy to inspect but cannot support shared access, durable records or real permissions. Input text does not drive model inference.

## Testing
Run `npm test`; inspect the dashboard, stage transition, Lost reason, manager view and reload in a browser. See [verification](verification.md).

## Eval
Deterministic rule branches are tested as software behavior. There is no provider-backed model-quality evaluation.

## Current Evidence
A public static preview and local browser interaction exist. All amounts, people and recommendations are synthetic.

## Limitations
No real CRM integration, email, messaging, multi-user database, authentication or LLM. The local audit can be cleared with browser storage.

## What I Would Do in Production
Define tenant/role permissions and data retention first; add server-side persistence, integration contracts and human-reviewed assistant evaluations before any automated action.

## What I Learned
A useful sales copilot demo can expose decision support and its limits without disguising deterministic rules as AI performance.
