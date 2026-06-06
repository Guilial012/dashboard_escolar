// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
const MONTHS   = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_S = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DAYS_PT  = ['D','S','T','Q','Q','S','S'];
const DSHORT   = ['','Seg','Ter','Qua','Qui','Sex'];
const DLONG    = ['','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira'];
const TLAB = {prova:'Prova',apresentacao:'Apresentação',entrega:'Entrega',filme:'Filme',outro:'Outro'};
const TCOL = {prova:'#B3261E',apresentacao:'#1565C0',entrega:'#7D5260',filme:'#F57F17',outro:'#2E7D32'};
const GCAL_COLORS = {1:'#a78bfa',2:'#6ee7b7',3:'#c084fc',4:'#f9a8d4',5:'#fde68a',6:'#fb923c',7:'#38bdf8',8:'#9ca3af',9:'#60a5fa',10:'#34d399',11:'#f87171',default:'#60a5fa'};

const SUB_STYLES = {
  'Matemática'  :{bg:'var(--sub-mat-bg)',tc:'var(--sub-mat-tc)'},
  'Português'   :{bg:'var(--sub-por-bg)',tc:'var(--sub-por-tc)'},
  'Geografia'   :{bg:'var(--sub-geo-bg)',tc:'var(--sub-geo-tc)'},
  'Biologia'    :{bg:'var(--sub-bio-bg)',tc:'var(--sub-bio-tc)'},
  'Física'      :{bg:'var(--sub-fis-bg)',tc:'var(--sub-fis-tc)'},
  'História'    :{bg:'var(--sub-his-bg)',tc:'var(--sub-his-tc)'},
  'Arte/Música' :{bg:'var(--sub-art-bg)',tc:'var(--sub-art-tc)'},
  'Ed. Física'  :{bg:'var(--sub-edf-bg)',tc:'var(--sub-edf-tc)'},
  'Inglês'      :{bg:'var(--sub-ing-bg)',tc:'var(--sub-ing-tc)'},
  'Química'     :{bg:'var(--sub-qui-bg)',tc:'var(--sub-qui-tc)'},
  'Filosofia'   :{bg:'var(--sub-fil-bg)',tc:'var(--sub-fil-tc)'},
  'S.O.E.'      :{bg:'var(--sub-soe-bg)',tc:'var(--sub-soe-tc)'},
  'Art. Cênicas':{bg:'var(--sub-cen-bg)',tc:'var(--sub-cen-tc)'},
  'Intervalo'   :{bg:'var(--sub-int-bg)',tc:'var(--sub-int-tc)'},
};
const ss = s => SUB_STYLES[s] || {bg:'var(--sub-soe-bg)',tc:'var(--sub-soe-tc)'};

// Schedule — IC 9º Ano A (source: Google Sites)
const SCH = {
  1:[{s:'13:25',e:'14:15',sub:'S.O.E.'},{s:'14:15',e:'15:00',sub:'Matemática'},{s:'15:00',e:'15:45',sub:'Matemática'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'Biologia'},{s:'17:10',e:'17:55',sub:'Português'},{s:'17:55',e:'18:40',sub:'Português'}],
  2:[{s:'13:25',e:'14:15',sub:'Português'},{s:'14:15',e:'15:00',sub:'Geografia'},{s:'15:00',e:'15:45',sub:'Geografia'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'Ed. Física'},{s:'17:10',e:'17:55',sub:'Física'},{s:'17:55',e:'18:40',sub:'Física'}],
  3:[{s:'13:25',e:'14:15',sub:'Arte/Música'},{s:'14:15',e:'15:00',sub:'Arte/Música'},{s:'15:00',e:'15:45',sub:'História'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'História'},{s:'17:10',e:'17:55',sub:'Português'},{s:'17:55',e:'18:40',sub:'Português'}],
  4:[{s:'13:25',e:'14:15',sub:'Ed. Física'},{s:'14:15',e:'15:00',sub:'Inglês'},{s:'15:00',e:'15:45',sub:'Filosofia'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'Matemática'},{s:'17:10',e:'17:55',sub:'Matemática'},{s:'17:55',e:'18:40',sub:'História'}],
  5:[{s:'13:25',e:'14:15',sub:'Art. Cênicas'},{s:'14:15',e:'15:00',sub:'Art. Cênicas'},{s:'15:00',e:'15:45',sub:'Química'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'Química'},{s:'17:10',e:'17:55',sub:'Matemática'},{s:'17:55',e:'18:40',sub:'Matemática'}],
};

const PRESET = [
  {id:'p1',date:'2026-06-08',title:'Prova de Português',sub:'Memórias Póstumas de Brás Cubas',tag:'prova'},
  {id:'p2',date:'2026-06-08',title:'Prova de Matemática',sub:'Cap. 4 — Explorando as Funções',tag:'prova'},
  {id:'p3',date:'2026-06-09',title:'Apresentação — Seminário Tipos de Amor',sub:'Português',tag:'apresentacao'},
  {id:'p4',date:'2026-06-09',title:'Prova de Geografia',sub:'',tag:'prova'},
  {id:'p5',date:'2026-06-10',title:'Prova de Reflexão Linguística',sub:'Orações Subordinadas Adverbiais',tag:'prova'},
  {id:'p6',date:'2026-06-10',title:'Continuação — Prova de História',sub:'Revolução Russa',tag:'prova'},
  {id:'p7',date:'2026-06-12',title:'Prova de Química',sub:'',tag:'prova'},
  {id:'p8',date:'2026-06-12',title:'Entrega de Crônicas',sub:'Português',tag:'entrega'},
  {id:'p9',date:'2026-06-15',title:'Prova de Biologia',sub:'',tag:'prova'},
  {id:'p10',date:'2026-06-15',title:'Apresentação — Seminário Tipos de Amor',sub:'Português (2ª parte)',tag:'apresentacao'},
  {id:'p11',date:'2026-06-16',title:'Filme da Unidade: Filadélfia',sub:'Português — parte 1',tag:'filme'},
  {id:'p12',date:'2026-06-17',title:'Filme da Unidade: Filadélfia',sub:'Português — parte 2',tag:'filme'},
  {id:'p13',date:'2026-06-18',title:'Test 2 — Red Balloon',sub:'Inglês',tag:'prova'},
];

// ═══════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════
let calY=2026,calM=5,selDate=null,gcalEvts=[],filt='all',activeTab='tasks';
let selDay=null,wkOff=0;

// ── Google Calendar CACHE ────────────────────────────────────────
// key: 'YYYY-MM'  →  { events: [...], ts: timestamp }
const gcalCache = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCachedEvts(y, m) {
  const k = `${y}-${String(m+1).padStart(2,'0')}`;
  const hit = gcalCache[k];
  if (hit && Date.now() - hit.ts < CACHE_TTL) return hit;
  return null;
}
function setCachedEvts(y, m, events) {
  const k = `${y}-${String(m+1).padStart(2,'0')}`;
  gcalCache[k] = { events, ts: Date.now() };
}
function fmtAgo(ts) {
  const s = Math.round((Date.now()-ts)/1000);
  if (s < 60)  return `há ${s}s`;
  if (s < 3600) return `há ${Math.round(s/60)}min`;
  return `há ${Math.round(s/3600)}h`;
}
function updateCacheBadge(ts) {
  const badge = document.getElementById('cache-badge');
  if (!ts) { badge.classList.remove('visible'); return; }
  badge.textContent = `⚡ ${fmtAgo(ts)}`;
  badge.classList.add('visible');
}
// ── localStorage helpers ─────────────────────────────────────────
const ls  = (k,d) => { try{return JSON.parse(localStorage.getItem(k)??'null')??d;}catch{return d;} };
const lss = (k,v) => { try{localStorage.setItem(k,JSON.stringify(v));}catch{} };

let cTasks    = ls('sc_ct_v4',[]);
let doneTasks = new Set(ls('sc_dn_v4',[]));
let tDescs    = ls('sc_td_v4',{});

const nKey = (m,d,i) => `cn_${m}_${d}_${i}`;
const gNote = (m,d,i) => ls(nKey(m,d,i),'');
const sNote = (m,d,i,v) => lss(nKey(m,d,i),v);

const allTasks = () => [...PRESET, ...cTasks];

// ═══════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════
function showTab(t) {
  activeTab = t;
  document.getElementById('tab-tasks').style.display    = t==='tasks'?'':'none';
  document.getElementById('tab-schedule').style.display = t==='schedule'?'':'none';
  document.getElementById('fab').style.display          = t==='tasks'?'flex':'none';
  document.querySelectorAll('.nav-item').forEach((b,i) =>
    b.classList.toggle('active',(i===0&&t==='tasks')||(i===1&&t==='schedule')));
  if (t==='schedule') renderSch();
}

// ═══════════════════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════════════════
function chMonth(d) {
  calM+=d; if(calM>11){calM=0;calY++;} if(calM<0){calM=11;calY--;}
  renderCal(); loadGCal();
}
function ds(y,m,d) {
  const mm=((m%12)+12)%12,yy=m<0?y-1:m>11?y+1:y;
  return `${yy}-${String(mm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function renderCal() {
  document.getElementById('cal-title').textContent = `${MONTHS[calM]} ${calY}`;
  const g=document.getElementById('cal-grid'); g.innerHTML='';
  DAYS_PT.forEach(d=>{const e=document.createElement('div');e.className='cal-dn';e.textContent=d;g.appendChild(e);});
  const today=new Date();today.setHours(0,0,0,0);
  const fw=new Date(calY,calM,1).getDay();
  const dim=new Date(calY,calM+1,0).getDate();
  const pd=new Date(calY,calM,0).getDate();
  const tasks=allTasks();
  for(let i=fw-1;i>=0;i--) g.appendChild(mkDay(calY,calM-1,pd-i,true,tasks,today));
  for(let d=1;d<=dim;d++)  g.appendChild(mkDay(calY,calM,d,false,tasks,today));
  const pad=(fw+dim)%7;
  for(let d=1;d<=(pad?7-pad:0);d++) g.appendChild(mkDay(calY,calM+1,d,true,tasks,today));
  renderDayDetail();
}
function mkDay(y,m,d,other,tasks,today) {
  const s=ds(y,m,d);
  const el=document.createElement('div'); el.className='cal-d'+(other?' om':'');
  const dt=new Date(y,((m%12)+12)%12,d);dt.setHours(0,0,0,0);
  if(dt.getTime()===today.getTime()) el.classList.add('today');
  if(s===selDate) el.classList.add('sel');
  const dn=document.createElement('div');dn.className='cal-dnum';dn.textContent=d;el.appendChild(dn);
  const tc=tasks.filter(t=>t.date===s&&!doneTasks.has(t.id)).length;
  const gc=gcalEvts.filter(e=>e.date===s).length;
  if(tc||gc){
    const dots=document.createElement('div');dots.className='cal-dots';
    for(let i=0;i<Math.min(tc,3);i++){const x=document.createElement('div');x.className='dot dot-t';dots.appendChild(x);}
    for(let i=0;i<Math.min(gc,2);i++){const x=document.createElement('div');x.className='dot dot-g';dots.appendChild(x);}
    el.appendChild(dots);
  }
  el.addEventListener('click',()=>{selDate=selDate===s?null:s;renderCal();});
  return el;
}
function renderDayDetail() {
  const p=document.getElementById('day-detail');
  if(!selDate){p.innerHTML='';return;}
  const tasks=allTasks().filter(t=>t.date===selDate);
  const evts=gcalEvts.filter(e=>e.date===selDate);
  if(!tasks.length&&!evts.length){p.innerHTML='';return;}
  const [y,m,d]=selDate.split('-');
  let h=`<div class="day-detail"><div class="day-detail-title">📅 ${parseInt(d)} de ${MONTHS[parseInt(m)-1]}</div>`;
  if(tasks.length){
    h+=`<div class="dd-section">Tarefas</div>`;
    tasks.forEach(t=>{const dc=tDescs[t.id]||t.sub;h+=`<div class="dd-event"><div class="dd-dot" style="background:${TCOL[t.tag]||'#49454F'}"></div><div><div class="dd-name">${t.title}</div>${dc?`<div class="dd-sub">${dc}</div>`:''}</div></div>`;});
  }
  if(evts.length){
    h+=`<div class="dd-section">Google Calendar</div>`;
    evts.forEach(e=>{h+=`<div class="dd-event"><div class="dd-dot" style="background:${e.color}"></div><div><div class="dd-name">${e.title}</div>${e.time?`<div class="dd-sub">${e.time}</div>`:''}</div></div>`;});
  }
  h+='</div>'; p.innerHTML=h;
}

// ═══════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════
function setFilt(f) {
  filt=f;
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
  const idx={all:0,prova:1,apresentacao:2,entrega:3,outro:4}[f];
  document.querySelectorAll('.chip')[idx]?.classList.add('active');
  renderTasks();
}
function togDone(id) {
  doneTasks.has(id)?doneTasks.delete(id):doneTasks.add(id);
  lss('sc_dn_v4',[...doneTasks]);
  renderTasks();renderCal();updStats();
}
function togDesc(id) {
  const b=document.getElementById('d-'+id),btn=document.getElementById('db-'+id);
  if(!b)return;const o=b.classList.toggle('open');if(btn)btn.classList.toggle('open',o);
}
function fmtD(s) {
  const [y,m,d]=s.split('-');
  const today=new Date();today.setHours(0,0,0,0);
  const dt=new Date(parseInt(y),parseInt(m)-1,parseInt(d));
  const diff=Math.round((dt-today)/86400000);
  const lbl=`${parseInt(d)} ${MONTHS_S[parseInt(m)-1]}`;
  if(diff===0)return`Hoje · ${lbl}`;
  if(diff===1)return`Amanhã · ${lbl}`;
  if(diff>0&&diff<=7)return`Em ${diff} dias · ${lbl}`;
  return lbl;
}
function tagCls(tag){return{prova:'tag-p',apresentacao:'tag-a',entrega:'tag-e',filme:'tag-f',outro:'tag-o'}[tag]||'tag-o';}
function renderTasks() {
  const c=document.getElementById('task-list');
  let tasks=allTasks().filter(t=>filt==='all'||t.tag===filt);
  if(!tasks.length){c.innerHTML='<div class="empty-state">Nenhuma tarefa nesta categoria.</div>';return;}
  tasks.sort((a,b)=>{const da=doneTasks.has(a.id),db=doneTasks.has(b.id);if(da!==db)return da?1:-1;return a.date.localeCompare(b.date);});
  c.innerHTML='';
  tasks.forEach(t=>{
    const done=doneTasks.has(t.id);
    const desc=tDescs[t.id]||t.sub||'';
    const hd=desc.length>0;
    const item=document.createElement('div');item.className='task-item'+(done?' done':'');
    item.innerHTML=`
      <div class="task-row">
        <div class="task-chk" onclick="togDone('${t.id}')"></div>
        <div class="task-body">
          <div class="task-name">${t.title}</div>
          <div class="task-date">${fmtD(t.date)}</div>
        </div>
        <span class="task-tag ${tagCls(t.tag)}">${TLAB[t.tag]||t.tag}</span>
        ${hd?`<button class="task-expand" id="db-${t.id}" onclick="togDesc('${t.id}')">▾</button>`:''}
      </div>
      ${hd?`<div class="task-desc" id="d-${t.id}">${desc}</div>`:''}`;
    c.appendChild(item);
  });
}
function updStats() {
  const tasks=allTasks().filter(t=>!doneTasks.has(t.id));
  document.getElementById('st-pr').textContent=tasks.filter(t=>t.tag==='prova').length;
  document.getElementById('st-ap').textContent=tasks.filter(t=>t.tag==='apresentacao').length;
  document.getElementById('st-en').textContent=tasks.filter(t=>t.tag==='entrega'||t.tag==='filme').length;
  document.getElementById('st-ou').textContent=tasks.filter(t=>t.tag==='outro').length;
  const total=allTasks().length,done=doneTasks.size;
  document.getElementById('subtitle').textContent=
    done===total&&total>0?'🎉 Tudo concluído! Arrasou!':`${done} de ${total} atividades concluídas`;
}

// ═══════════════════════════════════════════════════════════
// BOTTOM SHEET
// ═══════════════════════════════════════════════════════════
function openSheet(){document.getElementById('sheet-overlay').classList.add('open');}
function closeSheet(e){if(!e||e.target===document.getElementById('sheet-overlay'))document.getElementById('sheet-overlay').classList.remove('open');}
async function submitTask(){
  const title=document.getElementById('f-title').value.trim();
  const date=document.getElementById('f-date').value;
  const type=document.getElementById('f-type').value;
  const desc=document.getElementById('f-desc').value.trim();
  const sync=document.getElementById('f-gcal').checked;
  const msg=document.getElementById('f-msg'),btn=document.getElementById('f-sub');
  msg.className='form-msg';
  if(!title||!date){msg.textContent='Preencha o título e a data.';msg.className='form-msg err';return;}
  const id='c'+Date.now();
  cTasks.push({id,date,title,sub:'',tag:type});
  if(desc)tDescs[id]=desc;
  lss('sc_ct_v4',cTasks);lss('sc_td_v4',tDescs);
  if(sync){
    btn.disabled=true;btn.textContent='Salvando...';
    try{
      const r=await window.cowork.callMcpTool('mcp__649a3805-7245-4766-8382-01cd79dd468a__create_event',
        {summary:`📚 ${title}`,startTime:date+'T09:00:00',endTime:date+'T10:00:00',
         description:desc||TLAB[type]+' escolar',timeZone:'America/Recife'});
      if(r.isError)throw new Error();
      msg.textContent='✓ Adicionada e salva no Google Calendar!';msg.className='form-msg ok';
    }catch{msg.textContent='⚠ Salva localmente, mas falhou ao sincronizar.';msg.className='form-msg err';}
    btn.disabled=false;btn.textContent='Adicionar';
  }else{msg.textContent='✓ Tarefa adicionada!';msg.className='form-msg ok';setTimeout(()=>msg.className='form-msg',2500);}
  document.getElementById('f-title').value='';
  document.getElementById('f-desc').value='';
  renderTasks();renderCal();updStats();
}

// ═══════════════════════════════════════════════════════════
// SCHEDULE
// ═══════════════════════════════════════════════════════════
function getMon(off){
  const now=new Date();const dow=now.getDay();
  const mon=new Date(now);mon.setDate(now.getDate()-(dow===0?6:dow-1)+off*7);mon.setHours(0,0,0,0);return mon;
}
function d2s(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}

function renderSch(){
  renderBanner();
  const now=new Date(),dow=now.getDay();
  if(!selDay) selDay=(dow>=1&&dow<=5)?dow:1;
  document.querySelectorAll('.day-tab').forEach(b=>{
    const d=parseInt(b.dataset.d);
    b.classList.toggle('is-today',d===dow);
    b.classList.toggle('active',d===selDay);
  });
  renderSlots();renderWeekTable();
}
function renderBanner(){
  const now=new Date(),dow=now.getDay();
  const DLONG2=['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const fd=`${now.getDate()} de ${MONTHS[now.getMonth()]} de ${now.getFullYear()}`;
  const banner=document.getElementById('today-banner');
  if(dow>=1&&dow<=5){
    const slots=SCH[dow]||[],nm=now.getHours()*60+now.getMinutes();
    const cur=slots.find(sl=>{if(sl.brk)return false;const[sh,sm]=sl.s.split(':').map(Number);const[eh,em]=sl.e.split(':').map(Number);return nm>=sh*60+sm&&nm<eh*60+em;});
    const nxt=!cur&&slots.find(sl=>{if(sl.brk)return false;const[sh,sm]=sl.s.split(':').map(Number);return nm<sh*60+sm;});
    banner.innerHTML=`<div class="today-banner"><div class="tb-label">Hoje · ${DLONG2[dow]}</div><div class="tb-date">${fd}</div>${cur?`<div class="tb-now">▶ Agora: ${cur.sub} · ${cur.s}–${cur.e}</div>`:nxt?`<div class="tb-now">⏭ Próxima: ${nxt.sub} às ${nxt.s}</div>`:`<div class="tb-now">✔ Aulas encerradas</div>`}</div>`;
  }else{
    banner.innerHTML=`<div class="today-banner"><div class="tb-label">${DLONG2[dow]} · Sem aulas</div><div class="tb-date">${fd}</div><div class="tb-now">📅 Próxima aula: Segunda-feira</div></div>`;
  }
}
function selDay(d){
  selDay=d;
  document.querySelectorAll('.day-tab').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.d)===d));
  renderSlots();
}
let nTimers={};
function renderSlots(){
  const c=document.getElementById('slot-list');c.innerHTML='';
  const slots=SCH[selDay]||[];
  const now=new Date(),todDow=now.getDay(),isToday=selDay===todDow,nm=now.getHours()*60+now.getMinutes();
  const mon=getMon(wkOff),monStr=d2s(mon);
  slots.forEach((sl,i)=>{
    const item=document.createElement('div');item.className='slot-item'+(sl.brk?' brk':'');
    if(isToday&&!sl.brk){
      const[sh,sm]=sl.s.split(':').map(Number);const[eh,em]=sl.e.split(':').map(Number);
      if(nm>=sh*60+sm&&nm<eh*60+em)item.classList.add('cur');
    }
    const st=ss(sl.sub);const nv=sl.brk?'':gNote(monStr,selDay,i);const hn=nv.trim().length>0;
    if(sl.brk){
      item.innerHTML=`<div class="slot-row"><span class="slot-time">${sl.s} – ${sl.e}</span><span class="slot-pill" style="background:${st.bg};color:${st.tc}">☕ ${sl.sub}</span></div>`;
    }else{
      item.innerHTML=`
        <div class="slot-row" onclick="togNote(this,'${monStr}',${selDay},${i})">
          <span class="slot-time">${sl.s} – ${sl.e}</span>
          <span class="slot-pill" style="background:${st.bg};color:${st.tc}">${sl.sub}</span>
          ${hn?`<span class="note-badge">📝 nota</span>`:''}
          <span class="slot-exp">▾</span>
        </div>
        <div class="notes-panel">
          <div class="np-label">${DSHORT[selDay]} · ${sl.s} · Semana ${mon.getDate()}/${mon.getMonth()+1}</div>
          <textarea class="note-ta" id="nt-${monStr}-${selDay}-${i}" placeholder="O que foi visto? Dúvidas, resumo, tarefa de casa...">${nv}</textarea>
          <div class="note-saved" id="ns-${monStr}-${selDay}-${i}">✓ Salvo automaticamente</div>
        </div>`;
    }
    c.appendChild(item);
  });
  slots.forEach((sl,i)=>{
    if(sl.brk)return;
    const ta=document.getElementById(`nt-${monStr}-${selDay}-${i}`);
    if(!ta)return;
    ta.addEventListener('input',()=>{
      const k=`${monStr}_${selDay}_${i}`;
      clearTimeout(nTimers[k]);
      nTimers[k]=setTimeout(()=>{
        sNote(monStr,selDay,i,ta.value);
        const sv=document.getElementById(`ns-${monStr}-${selDay}-${i}`);
        if(sv){sv.style.display='block';setTimeout(()=>sv.style.display='none',1800);}
      },600);
    });
  });
}
function togNote(row,mon,d,i){
  const item=row.parentElement,was=item.classList.contains('nopen');
  document.querySelectorAll('.slot-item.nopen').forEach(el=>el.classList.remove('nopen'));
  if(!was){item.classList.add('nopen');setTimeout(()=>{const ta=document.getElementById(`nt-${mon}-${d}-${i}`);if(ta)ta.focus();},40);}
}
function chWeek(d){wkOff+=d;renderWeekTable();renderSlots();}
function renderWeekTable(){
  const mon=getMon(wkOff),monStr=d2s(mon);
  const fri=new Date(mon);fri.setDate(mon.getDate()+4);
  document.getElementById('wlabel').textContent=`${mon.getDate()} ${MONTHS_S[mon.getMonth()]} – ${fri.getDate()} ${MONTHS_S[fri.getMonth()]}`;
  const today=new Date();today.setHours(0,0,0,0);const todStr=d2s(today);
  const dDates=[1,2,3,4,5].map(d=>{const dt=new Date(mon);dt.setDate(mon.getDate()+d-1);return dt;});
  let h='<thead><tr><th></th>';
  dDates.forEach((dt,i)=>{const s=d2s(dt),isT=s===todStr;h+=`<th${isT?' class="tc"':''}>${DSHORT[i+1]}<br><span style="font-size:.6rem;font-weight:400">${dt.getDate()}/${dt.getMonth()+1}</span></th>`;});
  h+='</tr></thead><tbody>';
  [0,1,2,'brk',3,4,5].forEach(si=>{
    if(si==='brk'){h+='<tr class="brow"><td class="time-c">15:45</td>';for(let d=0;d<5;d++)h+='<td><span class="brlbl">Intervalo</span></td>';h+='</tr>';return;}
    const ref=SCH[1][si]||{};
    h+=`<tr><td class="time-c">${ref.s||''}</td>`;
    [1,2,3,4,5].forEach((dow,di)=>{
      const sl=SCH[dow][si],dt=dDates[di],s=d2s(dt),isT=s===todStr;
      if(sl){const st2=ss(sl.sub);const hn=gNote(monStr,dow,si).trim().length>0;h+=`<td${isT?' style="background:var(--md-primary-container)"':''}><span class="wpill" style="background:${st2.bg};color:${st2.tc}">${sl.sub}${hn?' 📝':''}</span></td>`;}
      else h+='<td>—</td>';
    });
    h+='</tr>';
  });
  h+='</tbody>';document.getElementById('wtbl').innerHTML=h;
}

// ═══════════════════════════════════════════════════════════
// GOOGLE CALENDAR — with cache
// ═══════════════════════════════════════════════════════════
async function loadGCal(forceRefresh = false) {
  const barEl = document.getElementById('gcal-bar');
  const spEl  = document.getElementById('gcal-sp');
  const syncBtn = document.getElementById('sync-btn');

  // ── Check cache first ──────────────────────────────────
  if (!forceRefresh) {
    const hit = getCachedEvts(calY, calM);
    if (hit) {
      gcalEvts = hit.events;
      barEl.textContent = `✓ ${gcalEvts.length} eventos do Google Calendar`;
      barEl.className = 'gcal-bar ok';
      updateCacheBadge(hit.ts);
      renderCal();
      return; // skip API call entirely
    }
  }

  // ── No cache hit — fetch from API ─────────────────────
  if (spEl) spEl.style.display = 'inline-block';
  syncBtn.classList.add('loading');
  barEl.innerHTML = '<span class="sp"></span> Buscando eventos...';
  barEl.className = 'gcal-bar';
  updateCacheBadge(null);

  const start = `${calY}-${String(calM+1).padStart(2,'0')}-01T00:00:00`;
  const nm = calM+1>11?0:calM+1, ny = calM+1>11?calY+1:calY;
  const end   = `${ny}-${String(nm+1).padStart(2,'0')}-01T00:00:00`;

  try {
    const r = await window.cowork.callMcpTool(
      'mcp__649a3805-7245-4766-8382-01cd79dd468a__list_events',
      { startTime: start, endTime: end, pageSize: 100, orderBy: 'startTime' }
    );
    if (r.isError) throw new Error();
    const data   = r.structuredContent ?? JSON.parse(r.content[0].text);
    const events = data.events || [];

    gcalEvts = events.map(e => {
      const dt = e.start?.dateTime || e.start?.date || '';
      const dstr = dt.substring(0, 10);
      let time = '';
      if (e.start?.dateTime) {
        const d = new Date(e.start.dateTime);
        time = d.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });
      }
      return { date: dstr, title: e.summary || '(sem título)', time, color: GCAL_COLORS[e.colorId] || GCAL_COLORS.default };
    });

    // Store in cache
    setCachedEvts(calY, calM, gcalEvts);
    const ts = gcalCache[`${calY}-${String(calM+1).padStart(2,'0')}`].ts;

    barEl.textContent = `✓ ${events.length} eventos do Google Calendar`;
    barEl.className = 'gcal-bar ok';
    updateCacheBadge(ts);

  } catch {
    barEl.innerHTML = '⚠ Não foi possível carregar o Google Calendar';
    barEl.className = 'gcal-bar err';
    updateCacheBadge(null);
  }

  if (spEl) spEl.style.display = 'none';
  syncBtn.classList.remove('loading');
  renderCal();
}

// ═══════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════
document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
renderCal();
renderTasks();
updStats();
loadGCal(); // uses cache on re-open
