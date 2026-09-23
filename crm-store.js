export const STAGES=['Lead','Qualified','Proposal','Negotiation','Won','Lost'];
export const KEY='ai-crm-synthetic-v2';
const ACTIVE=STAGES.slice(0,4);
const WEIGHTS={Lead:0.1,Qualified:0.25,Proposal:0.5,Negotiation:0.75,Won:1,Lost:0};
const day=(now,ago)=>new Date(new Date(now).getTime()-ago*86400000).toISOString();
export function initialStore(now=new Date().toISOString()){
  const records=[
    ['o1','Sample Account 01','Lead',12000,'Confirm initial interest',1,false],
    ['o2','Sample Account 02','Qualified',38000,'Schedule discovery follow-up',17,true],
    ['o3','Sample Account 03','Qualified',64000,'Identify decision maker',4,false],
    ['o4','Sample Account 04','Proposal',45000,'Request proposal feedback',10,true],
    ['o5','Sample Account 05','Negotiation',82000,'Review contract terms',3,true],
    ['o6','Sample Account 06','Proposal',28000,'Send revised scope',2,true],
    ['o7','Sample Account 07','Won',22000,'Plan handoff',1,true],
    ['o8','Sample Account 08','Lost',15000,'Document loss reason',8,true],
  ];
  return {version:2,opportunities:records.map(([id,account,stage,amount,action,daysAgo,decisionMaker],i)=>({
    id,title:`Demo Opportunity ${String(i+1).padStart(2,'0')}`,account,stage,amount,owner:i%2?'Demo Owner B':'Demo Owner A',action,
    updatedAt:day(now,daysAgo),lastProposalAt:stage==='Proposal'?day(now,daysAgo):null,decisionMaker,
    activities:[{at:day(now,daysAgo),type:'NOTE',detail:'Fictional scenario created'}]
  })),audit:[]};
}
export function load(storage,now=new Date().toISOString()){
  try{
    const saved=JSON.parse(storage.getItem(KEY));
    if(saved?.version===2&&Array.isArray(saved.opportunities)&&Array.isArray(saved.audit))return saved;
    if(saved?.version===1&&Array.isArray(saved.opportunities)&&Array.isArray(saved.audit)){
      const seed=initialStore(now);
      const migrated=saved.opportunities.map((old,i)=>({
        ...seed.opportunities[i],...old,
        stage:old.stage==='Solution fit'?'Qualified':old.stage,
        amount:seed.opportunities[i]?.amount??10000,
        owner:seed.opportunities[i]?.owner??'Demo Owner A',
        updatedAt:seed.opportunities[i]?.updatedAt??now,
        activities:[{at:now,type:'MIGRATION',detail:'Synthetic v1 record preserved'}]
      }));
      return {version:2,opportunities:migrated,audit:saved.audit};
    }
  }catch{}
  return initialStore(now);
}
export function transition(store,id,to,actor='Demo reviewer',reason='Demo stage transition',now=new Date().toISOString()){
  const item=store.opportunities.find(x=>x.id===id);
  if(!item)throw Error('NOT_FOUND');
  if(!actor.trim()||!reason.trim())throw Error('HUMAN_REASON_REQUIRED');
  const current=ACTIVE.indexOf(item.stage);
  const valid=current>=0&&(to===ACTIVE[current+1]||to==='Lost'||(item.stage==='Negotiation'&&to==='Won'));
  if(!valid)throw Error('INVALID_TRANSITION');
  const from=item.stage;item.stage=to;item.updatedAt=now;
  if(to==='Proposal')item.lastProposalAt=now;
  item.activities.push({at:now,type:'STAGE',detail:`${from} → ${to}: ${reason}`});
  store.audit.push({at:now,actor,opportunity:id,from,to,reason});
  return item;
}
export function advance(store,id,actor='Demo reviewer',now=new Date().toISOString()){
  const item=store.opportunities.find(x=>x.id===id);
  if(!item)throw Error('NOT_FOUND');
  const current=ACTIVE.indexOf(item.stage);
  if(current<0)throw Error('INVALID_TRANSITION');
  return transition(store,id,current===ACTIVE.length-1?'Won':ACTIVE[current+1],actor,'Human-clicked demo advance',now);
}
export function save(storage,store){storage.setItem(KEY,JSON.stringify(store));}
const age=(date,now)=>Math.max(0,Math.floor((new Date(now)-new Date(date))/86400000));
export function recommend(item,now=new Date().toISOString()){
  if(item.stage==='Won'||item.stage==='Lost')return {code:'CLOSED',priority:'LOW',text:`This fictional opportunity is ${item.stage}; review the activity timeline before follow-up.`};
  if(age(item.updatedAt,now)>=14)return {code:'STALE',priority:'HIGH',text:`No activity for ${age(item.updatedAt,now)} days. Ask ${item.owner} to confirm the next action: ${item.action}.`};
  if(item.stage==='Proposal'&&item.lastProposalAt&&age(item.lastProposalAt,now)>=7)return {code:'PROPOSAL_WAIT',priority:'HIGH',text:`Proposal has waited ${age(item.lastProposalAt,now)} days. Request feedback before changing stage.`};
  if(!item.decisionMaker)return {code:'MISSING_DECISION_MAKER',priority:'MEDIUM',text:'Decision maker is not recorded. Confirm who can approve the fictional scope.'};
  if(item.amount>=50000)return {code:'HIGH_VALUE',priority:'MEDIUM',text:`High sample value ($${item.amount.toLocaleString()}). Confirm scope, acceptance and owner before the next stage.`};
  return {code:'NEXT_ACTION',priority:'NORMAL',text:`Review ${item.action.toLowerCase()} with ${item.owner} before changing stage.`};
}
export function managerSummary(store,now=new Date().toISOString()){
  const counts=Object.fromEntries(STAGES.map(stage=>[stage,store.opportunities.filter(x=>x.stage===stage).length]));
  const pipeline=store.opportunities.filter(x=>ACTIVE.includes(x.stage)).reduce((sum,x)=>sum+x.amount,0);
  const forecast=store.opportunities.reduce((sum,x)=>sum+x.amount*WEIGHTS[x.stage],0);
  const risks=store.opportunities.map(item=>({id:item.id,title:item.title,...recommend(item,now)})).filter(x=>x.priority==='HIGH');
  return {counts,pipeline,forecast:Math.round(forecast),risks,stale:risks.filter(x=>x.code==='STALE').length,method:'Synthetic weighted forecast: Lead 10%, Qualified 25%, Proposal 50%, Negotiation 75%, Won 100%, Lost 0%'};
}
export const providers={mock:{state:'MOCK',suggest(item,now){return recommend(item,now).text;}},external:{state:'NOT_CONFIGURED',suggest(){throw Error('NOT_CONFIGURED');}}};
