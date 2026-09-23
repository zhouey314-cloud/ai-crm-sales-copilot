import {load,save,advance,providers} from './crm-store.js';
const store=load(localStorage);
const opportunities=store.opportunities;

const labels = {
  dashboard: ["Dashboard", "OVERVIEW"], pipeline: ["Pipeline", "WORKFLOW"], opportunity: ["Opportunity", "RECORDS"],
  quotation: ["Quotation", "REVIEW"], contract: ["Contract", "ACCEPTANCE"], delivery: ["Delivery", "HANDOFF"],
  analytics: ["Analytics", "EVIDENCE"], assistant: ["AI Assistant", "HUMAN-IN-THE-LOOP"],
};

const body = document.body;
const sidebar = document.querySelector("[data-sidebar]");
const menuButton = document.querySelector("[data-menu]");
const drawer = document.querySelector("[data-drawer]");
const advanceButton=document.createElement('button');
advanceButton.type='button';advanceButton.textContent='Advance demo stage';advanceButton.dataset.advanceStage='';
drawer.querySelector('.drawer-actions').prepend(advanceButton);
const auditStatus=document.createElement('p');auditStatus.dataset.auditStatus='';
auditStatus.textContent='Demo transitions are saved in this browser only.';
drawer.querySelector('.drawer-body').append(auditStatus);

function switchView(name, updateHash = true) {
  if (!labels[name]) name = "dashboard";
  document.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === name));
  document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("active", item.dataset.view === name));
  document.querySelector("[data-title]").textContent = labels[name][0];
  document.querySelector("[data-crumb]").textContent = labels[name][1];
  if (updateHash) history.replaceState(null, "", `#${name}`);
  sidebar.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  window.scrollTo({ top: 0, behavior: "instant" });
}

function openOpportunity(index) {
  const item = opportunities[index] || opportunities[0];
  document.querySelector("[data-drawer-title]").textContent = item.title;
  document.querySelector("[data-drawer-account]").textContent = item.account;
  document.querySelector("[data-drawer-stage]").textContent = item.stage;
  document.querySelector("[data-drawer-action]").textContent = item.action;
  document.querySelector('[data-advance-stage]').dataset.index = String(index);
  drawer.showModal();
  body.style.overflow = "hidden";
}

function renderRows(){document.querySelector("[data-opportunity-rows]").innerHTML = opportunities.map((item, index) => `
  <tr tabindex="0" data-open-opportunity="${index}"><td><b>${item.title}</b></td><td>${item.account}</td><td><span class="status ${item.stage === "Negotiation" ? "amber" : item.stage === "Proposal" ? "green" : "gray"}">${item.stage.toUpperCase()}</span></td><td>Ethan</td><td>${item.action}</td><td>${item.updated}</td></tr>
`).join("");}
renderRows();

document.addEventListener("click", (event) => {
  const navTarget = event.target.closest("[data-view], [data-view-link]");
  if (navTarget) switchView(navTarget.dataset.view || navTarget.dataset.viewLink);
  const opportunityTarget = event.target.closest("[data-open-opportunity]");
  if (opportunityTarget) openOpportunity(Number(opportunityTarget.dataset.openOpportunity));
  if (event.target.closest("[data-open-first]")) openOpportunity(0);
  if(event.target.closest('[data-advance-stage]')){
    const i=Number(event.target.closest('[data-advance-stage]').dataset.index);
    try{advance(store,opportunities[i].id);save(localStorage,store);renderRows();openOpportunity(i);document.querySelector('[data-audit-status]').textContent=`Audit: ${store.audit.length} reviewed transition(s) saved in this browser.`;}
    catch(error){document.querySelector('[data-audit-status]').textContent=error.message;}
  }
});

document.querySelector('[data-opportunity-rows]').addEventListener('keydown',(event)=>{const row=event.target.closest('[data-open-opportunity]');if(row&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openOpportunity(Number(row.dataset.openOpportunity));}});

menuButton.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll("[data-drawer-close]").forEach((button) => button.addEventListener("click", () => drawer.close()));
drawer.addEventListener("click", (event) => { if (event.target === drawer) drawer.close(); });
drawer.addEventListener("close", () => { body.style.overflow = ""; });

document.querySelector("[data-assistant-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector(".ai-message>p").textContent = providers.mock.suggest(opportunities[0]) + ' [MOCK / HUMAN REVIEW REQUIRED]';
});

document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => {
  document.querySelector("#assistant-input").value = button.textContent.trim();
}));

switchView(location.hash.slice(1), false);
