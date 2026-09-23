export const STAGES = ['Qualified','Solution fit','Proposal','Negotiation','Won'];
export const KEY='ai-crm-synthetic-v2';
export function initialStore(){return {version:1,opportunities:[
 {id:'o1',title:'Demo Opportunity 01',account:'Sample Account 01',stage:'Qualified',action:'Confirm solution scope',updated:'Today'},
 {id:'o2',title:'Demo Opportunity 02',account:'Sample Account 02',stage:'Qualified',action:'Discovery follow-up',updated:'Today'},
 {id:'o3',title:'Demo Opportunity 03',account:'Sample Account 03',stage:'Solution fit',action:'Confirm user roles',updated:'Yesterday'},
 {id:'o4',title:'Demo Opportunity 04',account:'Sample Account 04',stage:'Solution fit',action:'Verify integration scope',updated:'Sep 13'},
 {id:'o5',title:'Demo Opportunity 05',account:'Sample Account 05',stage:'Proposal',action:'Quotation review',updated:'Sep 12'},
 {id:'o6',title:'Demo Opportunity 06',account:'Sample Account 06',stage:'Negotiation',action:'Contract redline',updated:'Sep 11'}],audit:[]};}
export function load(storage){try{const saved=JSON.parse(storage.getItem(KEY));if(saved?.version===1&&Array.isArray(saved.opportunities)&&Array.isArray(saved.audit))return saved;}catch{}return initialStore();}
export function advance(store,id,actor='Demo reviewer'){
 const item=store.opportunities.find(x=>x.id===id);if(!item)throw Error('NOT_FOUND');const current=STAGES.indexOf(item.stage);if(current<0||current===STAGES.length-1)throw Error('INVALID_TRANSITION');
 const from=item.stage;item.stage=STAGES[current+1];item.updated='Today';store.audit.push({at:new Date().toISOString(),actor,opportunity:id,from,to:item.stage});return item;
}
export function save(storage,store){storage.setItem(KEY,JSON.stringify(store));}
export const providers={mock:{state:'MOCK',suggest(item){return `For ${item.title}, review ${item.action.toLowerCase()} with a human before changing the opportunity.`;}},external:{state:'NOT_CONFIGURED',suggest(){throw Error('NOT_CONFIGURED');}}};
