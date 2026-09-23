import {load,save,advance,transition,recommend,managerSummary,providers,STAGES} from './crm-store.js';
const store=load(localStorage);
const opportunities=store.opportunities;
const $=selector=>document.querySelector(selector);
const node=(tag,text,className)=>{const item=document.createElement(tag);item.textContent=text;if(className)item.className=className;return item;};
const money=value=>'$'+Number(value).toLocaleString();
const labels={dashboard:['Dashboard','OVERVIEW'],pipeline:['Pipeline','WORKFLOW'],opportunity:['Opportunity','RECORDS'],quotation:['Quotation','REVIEW'],contract:['Contract','ACCEPTANCE'],delivery:['Delivery','HANDOFF'],analytics:['Analytics','EVIDENCE'],manager:['Manager View','FORECAST'],assistant:['Rule-based Assistant','HUMAN-IN-THE-LOOP']};
const body=document.body,sidebar=$('[data-sidebar]'),menuButton=$('[data-menu]'),drawer=$('[data-drawer]');
$('.drawer-body section:last-of-type p').textContent='No real customer, financial or contact data appears in this self-built synthetic demo.';
let currentIndex=0;

const drawerDetails=$('.drawer-body dl');
const detail=(label,attribute)=>{const row=node('div','');row.append(node('dt',label));const value=node('dd','');value.dataset[attribute]='';row.append(value);drawerDetails.append(row);return value;};
const amountField=detail('Amount (fictional)','drawerAmount');
const ownerField=$('[data-drawer-owner]');
const activitySection=node('section','');
activitySection.append(node('span','ACTIVITY TIMELINE'));const activityList=node('ol','','activity-timeline');activitySection.append(activityList);$('.drawer-body').append(activitySection);
const advanceButton=node('button','Advance demo stage');advanceButton.type='button';advanceButton.dataset.advanceStage='';
const lossInput=node('input','');lossInput.placeholder='Reason required to mark Lost';lossInput.setAttribute('aria-label','Loss reason');lossInput.dataset.lossReason='';
const lostButton=node('button','Mark Lost');lostButton.type='button';lostButton.dataset.markLost='';
$('.drawer-actions').prepend(lossInput,lostButton,advanceButton);
const auditStatus=node('p','Demo transitions are saved in this browser only.');auditStatus.dataset.auditStatus='';$('.drawer-body').append(auditStatus);

function switchView(name,updateHash=true){
  if(!labels[name])name='dashboard';
  document.querySelectorAll('[data-panel]').forEach(panel=>panel.classList.toggle('active',panel.dataset.panel===name));
  document.querySelectorAll('[data-view]').forEach(item=>item.classList.toggle('active',item.dataset.view===name));
  $('[data-title]').textContent=labels[name][0];$('[data-crumb]').textContent=labels[name][1];
  if(updateHash)history.replaceState(null,'',`#${name}`);
  sidebar.classList.remove('open');menuButton.setAttribute('aria-expanded','false');
  window.scrollTo({top:0,behavior:'instant'});
}
function openOpportunity(index){
  currentIndex=index;const item=opportunities[index];if(!item)return;
  $('[data-drawer-title]').textContent=item.title;$('[data-drawer-account]').textContent=item.account;
  $('[data-drawer-stage]').textContent=item.stage;$('[data-drawer-action]').textContent=item.action;
  amountField.textContent=money(item.amount);ownerField.textContent=item.owner;
  activityList.replaceChildren();
  for(const activity of [...item.activities].reverse())activityList.append(node('li',`${new Date(activity.at).toLocaleDateString()} · ${activity.type}: ${activity.detail}`));
  advanceButton.disabled=['Won','Lost'].includes(item.stage);lostButton.disabled=['Won','Lost'].includes(item.stage);
  advanceButton.textContent=item.stage==='Negotiation'?'Mark Won (human action)':`Advance to ${STAGES[STAGES.indexOf(item.stage)+1]}`;
  if(!drawer.open)drawer.showModal();body.style.overflow='hidden';
}
function renderRows(){
  const tbody=$('[data-opportunity-rows]');tbody.replaceChildren();
  opportunities.forEach((item,index)=>{const row=node('tr','');row.tabIndex=0;row.dataset.openOpportunity=String(index);
    for(const value of [item.title,item.account,item.stage,item.owner,item.action,new Date(item.updatedAt).toLocaleDateString()]){
      const cell=node('td','');cell.append(node('span',value));row.append(cell);
    }tbody.append(row);});
}
function renderBoard(){
  const board=$('.board');board.replaceChildren();
  for(const stage of STAGES){const column=node('section','','board-column'),items=opportunities.filter(item=>item.stage===stage);
    const header=node('header','');header.append(node('span',stage.toUpperCase()),node('b',String(items.length)));column.append(header);
    for(const item of items){const index=opportunities.indexOf(item),card=node('button','','deal-card');card.type='button';card.dataset.openOpportunity=String(index);
      card.append(node('span',item.account),node('h3',item.title),node('p',`${money(item.amount)} · Next: ${item.action}`),node('small',item.owner));column.append(card);}
    board.append(column);
  }
}
function renderDashboard(){
  const summary=managerSummary(store);
  const metrics=$$('.metric-grid strong');[summary.counts.Lead+summary.counts.Qualified+summary.counts.Proposal+summary.counts.Negotiation,summary.counts.Proposal,summary.counts.Won,summary.risks.length].forEach((value,i)=>metrics[i].textContent=String(value).padStart(2,'0'));
  const bars=$('.stage-bars');bars.replaceChildren();
  for(const stage of STAGES.slice(0,4)){const row=node('div',''),count=summary.counts[stage];row.append(node('span',stage.toUpperCase()));const bar=node('i','');bar.style.setProperty('--w',`${Math.max(5,count/opportunities.length*100)}%`);row.append(bar,node('b',String(count)));bars.append(row);}
  const queue=$('.action-list');queue.replaceChildren();
  opportunities.filter(item=>!['Won','Lost'].includes(item.stage)).slice(0,4).forEach(item=>{const index=opportunities.indexOf(item),li=node('li',''),priority=node('span',recommend(item).priority,'priority'),detail=node('div','');detail.append(node('strong',item.action),node('small',item.title));const button=node('button','Review');button.type='button';button.dataset.openOpportunity=String(index);li.append(priority,detail,button);queue.append(li);});
  $('.activity-panel .mono').textContent=`${summary.counts.Lead+summary.counts.Qualified+summary.counts.Proposal+summary.counts.Negotiation} OPEN`;
  $('.assistant-line p').textContent=recommend(opportunities[0]).text;
}
function renderAnalytics(){
  const summary=managerSummary(store),chart=$('.horizontal-chart');chart.replaceChildren();
  for(const stage of STAGES){const row=node('div','');row.append(node('b',stage));const bar=node('i','');bar.style.setProperty('--w',`${Math.max(5,summary.counts[stage]/opportunities.length*100)}%`);row.append(bar,node('em',String(summary.counts[stage])));chart.append(row);}
  const list=$('.bottleneck-list');list.replaceChildren();
  for(const risk of summary.risks){const item=node('li','');item.append(node('b',risk.title),node('span',`${risk.code} · ${risk.text}`));list.append(item);}
  if(!summary.risks.length)list.append(node('li','No high-priority flags in this synthetic workspace.'));
}
function renderManager(){
  const summary=managerSummary(store),container=$('[data-manager]');container.replaceChildren();
  for(const [label,value] of [['Active pipeline',money(summary.pipeline)],['Weighted forecast',money(summary.forecast)],['Stale opportunities',String(summary.stale)],['High-priority risks',String(summary.risks.length)]]){
    const card=node('article','','panel manager-metric');card.append(node('span',label.toUpperCase()),node('strong',value));container.append(card);}
  const explanation=node('article','','panel manager-wide');explanation.append(node('h3','Forecast method'),node('p',summary.method),node('p','Numbers are calculated from fictional local records; they are not bookings or revenue.'));
  const stages=node('p',STAGES.map(stage=>`${stage}: ${summary.counts[stage]}`).join(' · '));explanation.append(stages);container.append(explanation);
  const riskCard=node('article','','panel manager-wide');riskCard.append(node('h3','Risk queue'));
  for(const risk of summary.risks)riskCard.append(node('p',`${risk.title} — ${risk.code}: ${risk.text}`));
  if(!summary.risks.length)riskCard.append(node('p','No high-priority flags.'));
  container.append(riskCard);
}
const assistantSelect=node('select','');assistantSelect.id='assistant-opportunity';assistantSelect.setAttribute('aria-label','Select fictional opportunity');
opportunities.forEach((item,index)=>assistantSelect.add(new Option(`${item.title} · ${item.stage}`,String(index))));
const assistantAside=$('.assistant-workspace aside');assistantAside.insertBefore(assistantSelect,assistantAside.querySelector('h3'));
$('.ai-message>span').textContent='RULE-BASED DEMO RESPONSE';
function renderAssistantContext(){const item=opportunities[Number(assistantSelect.value)];const dd=assistantAside.querySelectorAll('dd');assistantAside.querySelector('h3').textContent=item.title;dd[0].textContent=item.account;dd[1].textContent=item.stage;dd[2].textContent=item.action;$('.ai-message>p').textContent=providers.mock.suggest(item)+' [MOCK / HUMAN REVIEW REQUIRED]';const bullets=$$('.ai-message li');[item.owner,money(item.amount),recommend(item).code].forEach((value,i)=>bullets[i].textContent=value);}
assistantSelect.addEventListener('change',renderAssistantContext);
const $$=selector=>document.querySelectorAll(selector);
function renderAll(){renderRows();renderBoard();renderDashboard();renderAnalytics();renderManager();renderAssistantContext();}
renderAll();
document.addEventListener('click',event=>{
  const nav=event.target.closest('[data-view],[data-view-link]');if(nav)switchView(nav.dataset.view||nav.dataset.viewLink);
  const open=event.target.closest('[data-open-opportunity]');if(open)openOpportunity(Number(open.dataset.openOpportunity));
  if(event.target.closest('[data-open-first]'))openOpportunity(0);
  if(event.target.closest('[data-advance-stage]')){
    try{advance(store,opportunities[currentIndex].id);save(localStorage,store);renderAll();openOpportunity(currentIndex);auditStatus.textContent=`Audit: ${store.audit.length} human-clicked demo transition(s) saved locally.`;}
    catch(error){auditStatus.textContent=error.message;}
  }
  if(event.target.closest('[data-mark-lost]')){
    try{transition(store,opportunities[currentIndex].id,'Lost','Demo reviewer',lossInput.value.trim());save(localStorage,store);lossInput.value='';renderAll();openOpportunity(currentIndex);auditStatus.textContent='Lost transition saved with reason in local audit.';}
    catch(error){auditStatus.textContent=error.message==='HUMAN_REASON_REQUIRED'?'Enter a reason before marking Lost.':error.message;}
  }
});
$('[data-opportunity-rows]').addEventListener('keydown',event=>{const row=event.target.closest('[data-open-opportunity]');if(row&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openOpportunity(Number(row.dataset.openOpportunity));}});
menuButton.addEventListener('click',()=>{const open=sidebar.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
$$('[data-drawer-close]').forEach(button=>button.addEventListener('click',()=>drawer.close()));
drawer.addEventListener('click',event=>{if(event.target===drawer)drawer.close();});drawer.addEventListener('close',()=>{body.style.overflow='';});
$('[data-assistant-form]').addEventListener('submit',event=>{event.preventDefault();renderAssistantContext();});
$$('[data-prompt]').forEach(button=>button.addEventListener('click',()=>{$('#assistant-input').value=button.textContent.trim();}));
switchView(location.hash.slice(1),false);
