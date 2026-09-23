import assert from 'node:assert/strict';
import {initialStore,load,save,advance,providers,KEY} from '../crm-store.js';
let stored=new Map();const storage={getItem:k=>stored.get(k),setItem:(k,v)=>stored.set(k,v)};
let state=load(storage);assert.equal(state.opportunities.length,6);
let item=advance(state,'o1');assert.equal(item.stage,'Solution fit');assert.equal(state.audit.length,1);
save(storage,state);assert.equal(load(storage).opportunities[0].stage,'Solution fit');assert.ok(stored.has(KEY));
assert.equal(providers.mock.state,'MOCK');assert.equal(providers.external.state,'NOT_CONFIGURED');assert.throws(()=>providers.external.suggest());
assert.throws(()=>advance(state,'unknown'));assert.equal(initialStore().audit.length,0);
console.log('CRM structured store and state transition checks passed.');
