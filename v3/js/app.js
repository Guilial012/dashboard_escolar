// ═══════════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ═══════════════════════════════════════════════════════════════
const MONTHS   = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_S = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DAYS_PT  = ['D','S','T','Q','Q','S','S'];
const DNAMES   = ['','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira'];
const DSHORT   = ['','Seg','Ter','Qua','Qui','Sex'];
const TLAB = {prova:'Prova',apresentacao:'Apresentação',entrega:'Entrega',filme:'Filme',outro:'Outro'};
const TCOL = {prova:'#e53e3e',apresentacao:'#3182ce',entrega:'#805ad5',filme:'#d69e2e',outro:'#38a169'};
const GCOL = {1:'#a78bfa',2:'#6ee7b7',3:'#c084fc',4:'#f9a8d4',5:'#fde68a',6:'#fb923c',7:'#38bdf8',8:'#9ca3af',9:'#60a5fa',10:'#34d399',11:'#f87171',default:'#60a5fa'};

// Subject styles
const SS = {
  'Matemática'  :{bg:'#dbeafe',tc:'#1d4ed8'},
  'Português'   :{bg:'#fee2e2',tc:'#b91c1c'},
  'Geografia'   :{bg:'#dcfce7',tc:'#15803d'},
  'Biologia'    :{bg:'#f3e8ff',tc:'#7e22ce'},
  'Física'      :{bg:'#cffafe',tc:'#0e7490'},
  'História'    :{bg:'#fef3c7',tc:'#92400e'},
  'Arte/Música' :{bg:'#fce7f3',tc:'#9d174d'},
  'Ed. Física'  :{bg:'#d1fae5',tc:'#065f46'},
  'Inglês'      :{bg:'#ede9fe',tc:'#5b21b6'},
  'Química'     :{bg:'#ffedd5',tc:'#9a3412'},
  'Filosofia'   :{bg:'#fdf6ec',tc:'#78350f'},
  'S.O.E.'      :{bg:'#f1f5f9',tc:'#475569'},
  'Art. Cênicas':{bg:'#fdf4ff',tc:'#7e22ce'},
  'Intervalo'   :{bg:'#f1f5f9',tc:'#94a3b8'},
};
const ss = s => SS[s] || {bg:'#f1f5f9',tc:'#475569'};

// Schedule — parsed from IC Google Sites (9º Ano A)
// Source: https://sites.google.com/institutocapibaribe.com.br/fundamental2/turmas-horários-agenda/9º-ano-a
const SCH = {
  1:[{s:'13:25',e:'14:15',sub:'S.O.E.'},{s:'14:15',e:'15:00',sub:'Matemática'},{s:'15:00',e:'15:45',sub:'Matemática'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'Biologia'},{s:'17:10',e:'17:55',sub:'Português'},{s:'17:55',e:'18:40',sub:'Português'}],
  2:[{s:'13:25',e:'14:15',sub:'Português'},{s:'14:15',e:'15:00',sub:'Geografia'},{s:'15:00',e:'15:45',sub:'Geografia'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'Ed. Física'},{s:'17:10',e:'17:55',sub:'Física'},{s:'17:55',e:'18:40',sub:'Física'}],
  3:[{s:'13:25',e:'14:15',sub:'Arte/Música'},{s:'14:15',e:'15:00',sub:'Arte/Música'},{s:'15:00',e:'15:45',sub:'História'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'História'},{s:'17:10',e:'17:55',sub:'Português'},{s:'17:55',e:'18:40',sub:'Português'}],
  4:[{s:'13:25',e:'14:15',sub:'Ed. Física'},{s:'14:15',e:'15:00',sub:'Inglês'},{s:'15:00',e:'15:45',sub:'Filosofia'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'Matemática'},{s:'17:10',e:'17:55',sub:'Matemática'},{s:'17:55',e:'18:40',sub:'História'}],
  5:[{s:'13:25',e:'14:15',sub:'Art. Cênicas'},{s:'14:15',e:'15:00',sub:'Art. Cênicas'},{s:'15:00',e:'15:45',sub:'Química'},{s:'15:45',e:'16:25',sub:'Intervalo',brk:1},{s:'16:25',e:'17:10',sub:'Química'},{s:'17:10',e:'17:55',sub:'Matemática'},{s:'17:55',e:'18:40',sub:'Matemática'}],
};

// Pre-loaded tasks
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

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
let calY=2026,calM=5,selDate=null,gcalEvts=[],filt='all',activeTab='tasks';
let selDay=null,wkOffset=0;

const ls  = (k,d)  => { try{return JSON.parse(localStorage.getItem(k)??'null')??d;}catch{return d;} };
const lss = (k,v)  => { try{localStorage.setItem(k,JSON.stringify(v));}catch{} };

let cTasks = ls('sc_ct_v3',[]);
let doneTasks = new Set(ls('sc_dn_v3',[]));
let tDescs = ls('sc_td_v3',{});

const allTasks = () => [...PRESET,...cTasks];

const nKey  = (mon,d,i) => `cn_${mon}_${d}_${i}`;
const gNote = (mon,d,i) => ls(nKey(mon,d,i),'');
const sNote = (mon,d,i,v) => lss(nKey(mon,d,i),v);

// ═══════════════════════════════════════════════════════════════
// TABS
// ═══════════════════════════════════════════════════════════════
function showTab(t) {
  activeTab=t;
  document.getElementById('tab-tasks').style.display    = t==='tasks'    ?'':'none';
  document.getElementById('tab-schedule').style.display = t==='schedule' ?'':'none';
  document.getElementById('add-btn').style.display      = t==='tasks'    ?'':'none';
  document.querySelectorAll('.tab-btn').forEach((b,i)=>b.classList.toggle('active',(i===0&&t==='tasks')||(i===1&&t==='schedule')));
  if(t==='schedule') renderSch();
}

// ═══════════════════════════════════════════════════════════════
// CALENDAR
// ═══════════════════════════════════════════════════════════════
function changeMonth(d){
  calM+=d;
  if(calM>11){calM=0;calY++;}
  if(calM<0){calM=11;calY--;}
  renderCal();loadGCal();
}
function renderCal(){
  document.getElementById('cal-title').textContent=`${MONTHS[calM]} ${calY}`;
  const g=document.getElementById('cal-grid'); g.innerHTML='';
  DAYS_PT.forEach(d=>{const e=document.createElement('div');e.className='cal-dn';e.textContent=d;g.appendChild(e);});
  const today=new Date();today.setHours(0,0,0,0);
  const fw=new Date(calY,calM,1).getDay();
  const dim=new Date(calY,calM+1,0).getDate();
  const pd=new Date(calY,calM,0).getDate();
  const tasks=allTasks();
  for(let i=fw-1;i>=0;i--) g.appendChild(mkDay(calY,calM-1,pd-i,true,tasks,today));
  for(let d=1;d<=dim;d++) g.appendChild(mkDay(calY,calM,d,false,tasks,today));
  const pad=(fw+dim)%7;
  for(let d=1;d<=(pad?7-pad:0);d++) g.appendChild(mkDay(calY,calM+1,d,true,tasks,today));
  renderDayPanel();
}
function ds(y,m,d){
  const mm=((m%12)+12)%12,yy=m<0?y-1:m>11?y+1:y;
  return `${yy}-${String(mm+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
function mkDay(y,m,d,other,tasks,today){
  const s=ds(y,m,d);
  const el=document.createElement('div');
  el.className='cal-d'+(other?' om':'');
  const dt=new Date(y,((m%12)+12)%12,d);dt.setHours(0,0,0,0);
  if(dt.getTime()===today.getTime()) el.classList.add('today');
  if(s===selDate) el.classList.add('sel');
  const nn=document.createElement('div');nn.className='dn';nn.textContent=d;el.appendChild(nn);
  const tc=tasks.filter(t=>t.date===s&&!doneTasks.has(t.id)).length;
  const gc=gcalEvts.filter(e=>e.date===s).length;
  if(tc||gc){
    const dots=document.createElement('div');dots.className='day-dots';
    for(let i=0;i<Math.min(tc,3);i++){const x=document.createElement('div');x.className='dot task';dots.appendChild(x);}
    for(let i=0;i<Math.min(gc,2);i++){const x=document.createElement('div');x.className='dot gcal';dots.appendChild(x);}
    el.appendChild(dots);
  }
  el.addEventListener('click',()=>{selDate=selDate===s?null:s;renderCal();});
  return el;
}
function renderDayPanel(){
  const p=document.getElementById('day-panel');
  if(!selDate){p.innerHTML='';return;}
  const tasks=allTasks().filter(t=>t.date===selDate);
  const evts=gcalEvts.filter(e=>e.date===selDate);
  if(!tasks.length&&!evts.length){p.innerHTML='';return;}
  const [y,m,d]=selDate.split('-');
  let h=`<div class="day-panel"><h3>📅 ${parseInt(d)}/${parseInt(m)}/${y}</h3>`;
  if(tasks.length){
    h+=`<div class="dsl">Tarefas</div>`;
    tasks.forEach(t=>{const dc=tDescs[t.id]||t.sub;h+=`<div class="dev"><div class="edot" style="background:${TCOL[t.tag]||'#718096'}"></div><div><div class="etitle">${t.title}</div>${dc?`<div class="esub">${dc}</div>`:''}</div></div>`;});
  }
  if(evts.length){
    h+=`<div class="dsl">Google Calendar</div>`;
    evts.forEach(e=>{h+=`<div class="dev"><div class="edot" style="background:${e.color}"></div><div><div class="etitle">${e.title}</div>${e.time?`<div class="esub">${e.time}</div>`:''}</div></div>`;});
  }
  h+='</div>';p.innerHTML=h;
}

// ═══════════════════════════════════════════════════════════════
// TASKS
// ═══════════════════════════════════════════════════════════════
function setFilter(f){
  filt=f;
  document.querySelectorAll('.fb').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.fb.f-${f}`)?.classList.add('active');
  renderTasks();
}
function togDone(id){
  doneTasks.has(id)?doneTasks.delete(id):doneTasks.add(id);
  lss('sc_dn_v3',[...doneTasks]);
  renderTasks();renderCal();updStats();
}
function togDesc(id){
  const b=document.getElementById('d-'+id),btn=document.getElementById('db-'+id);
  if(!b)return;const o=b.classList.toggle('open');if(btn)btn.classList.toggle('open',o);
}
function fmtD(s){
  const [y,m,d]=s.split('-');
  const today=new Date();today.setHours(0,0,0,0);
  const dt=new Date(parseInt(y),parseInt(m)-1,parseInt(d));
  const diff=Math.round((dt-today)/86400000);
  const lbl=`${parseInt(d)} ${MONTHS_S[parseInt(m)-1]}`;
  if(diff===0) return `Hoje · ${lbl}`;
  if(diff===1) return `Amanhã · ${lbl}`;
  if(diff>0&&diff<=7) return `Em ${diff} dias · ${lbl}`;
  return lbl;
}
function renderTasks(){
  const c=document.getElementById('tlist');
  let tasks=allTasks().filter(t=>filt==='all'||t.tag===filt);
  if(!tasks.length){c.innerHTML='<div class="empty">Nenhuma tarefa nesta categoria.</div>';return;}
  tasks.sort((a,b)=>{const da=doneTasks.has(a.id),db=doneTasks.has(b.id);if(da!==db)return da?1:-1;return a.date.localeCompare(b.date);});
  c.innerHTML='';
  tasks.forEach(t=>{
    const done=doneTasks.has(t.id);
    const desc=tDescs[t.id]||t.sub||'';
    const hd=desc.length>0;
    const item=document.createElement('div');item.className='ti'+(done?' done':'');
    item.innerHTML=`
      <div class="ti-row">
        <div class="tck" onclick="togDone('${t.id}')"></div>
        <div class="tb"><div class="tt">${t.title}</div><div class="td">${fmtD(t.date)}</div></div>
        <span class="ttag tag-${t.tag}">${TLAB[t.tag]||t.tag}</span>
        ${hd?`<button class="tex" id="db-${t.id}" onclick="togDesc('${t.id}')">▾</button>`:''}
      </div>
      ${hd?`<div class="tdb" id="d-${t.id}">${desc}</div>`:''}`;
    c.appendChild(item);
  });
}
function updStats(){
  const tasks=allTasks().filter(t=>!doneTasks.has(t.id));
  document.getElementById('st-provas').textContent   =tasks.filter(t=>t.tag==='prova').length;
  document.getElementById('st-apres').textContent    =tasks.filter(t=>t.tag==='apresentacao').length;
  document.getElementById('st-entregas').textContent =tasks.filter(t=>t.tag==='entrega'||t.tag==='filme').length;
  document.getElementById('st-outros').textContent   =tasks.filter(t=>t.tag==='outro').length;
  const total=allTasks().length,done=doneTasks.size;
  document.getElementById('subtitle').textContent=done===total&&total>0?'🎉 Tudo concluído! Arrasou!':`${done} de ${total} atividades concluídas`;
}

// ═══════════════════════════════════════════════════════════════
// ADD FORM
// ═══════════════════════════════════════════════════════════════
function openAddForm(){
  document.getElementById('atog').classList.add('open');
  document.getElementById('abody').classList.add('open');
  document.getElementById('add-card').scrollIntoView({behavior:'smooth',block:'start'});
}
function toggleAdd(){
  document.getElementById('atog').classList.toggle('open');
  document.getElementById('abody').classList.toggle('open');
}
async function submitTask(){
  const title=document.getElementById('f-title').value.trim();
  const date=document.getElementById('f-date').value;
  const type=document.getElementById('f-type').value;
  const desc=document.getElementById('f-desc').value.trim();
  const sync=document.getElementById('f-gcal').checked;
  const msg=document.getElementById('f-msg'),btn=document.getElementById('f-sub');
  msg.className='fmsg';
  if(!title||!date){msg.textContent='Preencha o título e a data.';msg.className='fmsg err';return;}
  const id='c'+Date.now();
  cTasks.push({id,date,title,sub:'',tag:type});
  if(desc)tDescs[id]=desc;
  lss('sc_ct_v3',cTasks);lss('sc_td_v3',tDescs);
  if(sync){
    btn.disabled=true;btn.textContent='Sincronizando...';
    try{
      const r=await window.cowork.callMcpTool('mcp__649a3805-7245-4766-8382-01cd79dd468a__create_event',
        {summary:`📚 ${title}`,startTime:date+'T09:00:00',endTime:date+'T10:00:00',
         description:desc||TLAB[type]+' escolar',timeZone:'America/Recife'});
      if(r.isError)throw new Error();
      msg.textContent='✓ Adicionada e sincronizada com o Google Calendar!';msg.className='fmsg ok';
    }catch{msg.textContent='⚠ Salva localmente, mas falhou ao sincronizar com o Google Calendar.';msg.className='fmsg err';}
    btn.disabled=false;btn.textContent='Adicionar Tarefa';
  }else{msg.textContent='✓ Tarefa adicionada!';msg.className='fmsg ok';setTimeout(()=>msg.className='fmsg',3000);}
  document.getElementById('f-title').value='';
  document.getElementById('f-date').value=new Date().toISOString().split('T')[0];
  document.getElementById('f-desc').value='';
  renderTasks();renderCal();updStats();
}

// ═══════════════════════════════════════════════════════════════
// SCHEDULE TAB
// ═══════════════════════════════════════════════════════════════
function getMon(off){
  const now=new Date();const dow=now.getDay();
  const mon=new Date(now);mon.setDate(now.getDate()-(dow===0?6:dow-1)+off*7);
  mon.setHours(0,0,0,0);return mon;
}
function d2s(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}

function renderSch(){
  renderBanner();
  const now=new Date();const dow=now.getDay();
  if(!selDay) selDay=(dow>=1&&dow<=5)?dow:1;
  selDay=selDay;
  // Mark today tabs
  document.querySelectorAll('.dtab').forEach(b=>{
    const d=parseInt(b.dataset.d);
    b.classList.toggle('is-today',d===dow);
    b.classList.toggle('active',d===selDay);
  });
  renderSlots();
  renderWeek();
}

function renderBanner(){
  const now=new Date();const dow=now.getDay();
  const DNAMES2=['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  const fd=`${now.getDate()} de ${MONTHS[now.getMonth()]} de ${now.getFullYear()}`;
  const isSchool=dow>=1&&dow<=5;
  const banner=document.getElementById('today-banner');
  if(isSchool){
    const slots=SCH[dow]||[];
    const nm=now.getHours()*60+now.getMinutes();
    const cur=slots.find(sl=>{if(sl.brk)return false;const[sh,sm]=sl.s.split(':').map(Number);const[eh,em]=sl.e.split(':').map(Number);return nm>=sh*60+sm&&nm<eh*60+em;});
    const nxt=!cur&&slots.find(sl=>{if(sl.brk)return false;const[sh,sm]=sl.s.split(':').map(Number);return nm<sh*60+sm;});
    banner.innerHTML=`<div class="today-banner"><div class="tb-tag">Hoje · ${DNAMES2[dow]}</div><div class="tb-date">${fd}</div>${cur?`<span class="tb-now">Agora: ${cur.sub} · ${cur.s}–${cur.e}</span>`:nxt?`<div class="tb-note">Próxima: ${nxt.sub} às ${nxt.s}</div>`:`<div class="tb-note">Aulas encerradas hoje</div>`}</div>`;
  }else{
    banner.innerHTML=`<div class="today-banner"><div class="tb-tag">${DNAMES2[dow]} · Sem aulas</div><div class="tb-date">${fd}</div><div class="tb-note">Próxima aula: Segunda-feira</div></div>`;
  }
}

function selDay2(d){selDay=d;}
function selDay(d){
  selDay2(d);
  document.querySelectorAll('.dtab').forEach(b=>b.classList.toggle('active',parseInt(b.dataset.d)===d));
  renderSlots();
}

let nTimers={};
function renderSlots(){
  const c=document.getElementById('slist');c.innerHTML='';
  const slots=SCH[selDay]||[];
  const now=new Date();const todDow=now.getDay();const isToday=selDay===todDow;
  const nm=now.getHours()*60+now.getMinutes();
  const mon=getMon(wkOffset);const monStr=d2s(mon);

  slots.forEach((sl,i)=>{
    const item=document.createElement('div');
    item.className='si'+(sl.brk?' brk':'');
    if(isToday&&!sl.brk){
      const[sh,sm]=sl.s.split(':').map(Number);const[eh,em]=sl.e.split(':').map(Number);
      if(nm>=sh*60+sm&&nm<eh*60+em)item.classList.add('cur');
    }
    const st=ss(sl.sub);
    const nv=sl.brk?'':gNote(monStr,selDay,i);
    const hn=nv.trim().length>0;
    if(sl.brk){
      item.innerHTML=`<div class="sr"><span class="stime">${sl.s} – ${sl.e}</span><span class="spill" style="background:${st.bg};color:${st.tc}">☕ ${sl.sub}</span></div>`;
    }else{
      item.innerHTML=`
        <div class="sr" onclick="togNote(this,'${monStr}',${selDay},${i})">
          <span class="stime">${sl.s} – ${sl.e}</span>
          <span class="spill" style="background:${st.bg};color:${st.tc}">${sl.sub}</span>
          ${hn?`<span class="snote-badge">nota</span>`:''}
          <span class="sexp">▾</span>
        </div>
        <div class="npanel">
          <label>📝 Anotações — ${DSHORT[selDay]}, ${sl.s} · Semana de ${mon.getDate()}/${mon.getMonth()+1}</label>
          <textarea class="nta" id="nt-${monStr}-${selDay}-${i}" placeholder="O que foi visto? Dúvidas, resumo, tarefa de casa...">${nv}</textarea>
          <div class="nsaved" id="ns-${monStr}-${selDay}-${i}">✓ Salvo</div>
        </div>`;
    }
    c.appendChild(item);
  });

  // Auto-save listeners
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
        if(sv){sv.style.display='block';setTimeout(()=>sv.style.display='none',1500);}
      },600);
    });
  });
}

function togNote(row,mon,d,i){
  const item=row.parentElement;
  const was=item.classList.contains('nopen');
  document.querySelectorAll('.si.nopen').forEach(el=>el.classList.remove('nopen'));
  if(!was){
    item.classList.add('nopen');
    setTimeout(()=>{const ta=document.getElementById(`nt-${mon}-${d}-${i}`);if(ta)ta.focus();},40);
  }
}

function chgWeek(d){wkOffset+=d;renderWeek();renderSlots();}

function renderWeek(){
  const mon=getMon(wkOffset);const monStr=d2s(mon);
  const fri=new Date(mon);fri.setDate(mon.getDate()+4);
  document.getElementById('wlabel').textContent=`${mon.getDate()} ${MONTHS_S[mon.getMonth()]} – ${fri.getDate()} ${MONTHS_S[fri.getMonth()]}`;
  const today=new Date();today.setHours(0,0,0,0);const todStr=d2s(today);
  const dDates=[1,2,3,4,5].map(d=>{const dt=new Date(mon);dt.setDate(mon.getDate()+d-1);return dt;});
  const dShort=['Seg','Ter','Qua','Qui','Sex'];
  let h='<thead><tr><th></th>';
  dDates.forEach((dt,i)=>{const s=d2s(dt),isT=s===todStr;h+=`<th${isT?' class="tcol"':''}>${dShort[i]}<br><span style="font-size:.6rem;font-weight:400">${dt.getDate()}/${dt.getMonth()+1}</span></th>`;});
  h+='</tr></thead><tbody>';
  [0,1,2,'brk',3,4,5].forEach(si=>{
    if(si==='brk'){
      h+='<tr class="brow"><td class="tc">15:45</td>';
      for(let d=0;d<5;d++)h+='<td><span class="brlbl">Intervalo</span></td>';
      h+='</tr>';return;
    }
    const ref=SCH[1][si]||{};
    h+=`<tr><td class="tc">${ref.s||''}</td>`;
    [1,2,3,4,5].forEach((dow,di)=>{
      const sl=SCH[dow][si];const dt=dDates[di];const s=d2s(dt);const isT=s===todStr;
      if(sl){
        const st2=ss(sl.sub);
        const hn=gNote(monStr,dow,si).trim().length>0;
        h+=`<td${isT?' style="background:#faf5ff"':''}><span class="wpill" style="background:${st2.bg};color:${st2.tc}">${sl.sub}${hn?' 📝':''}</span></td>`;
      }else h+='<td>—</td>';
    });
    h+='</tr>';
  });
  h+='</tbody>';
  document.getElementById('wtbl').innerHTML=h;
}

// ═══════════════════════════════════════════════════════════════
// GOOGLE CALENDAR
// ═══════════════════════════════════════════════════════════════
async function loadGCal(){
  const st=document.getElementById('gcal-st'),sp=document.getElementById('gcal-sp');
  if(sp)sp.style.display='inline-block';
  const start=`${calY}-${String(calM+1).padStart(2,'0')}-01T00:00:00`;
  const nm2=calM+1>11?0:calM+1,ny=calM+1>11?calY+1:calY;
  const end=`${ny}-${String(nm2+1).padStart(2,'0')}-01T00:00:00`;
  try{
    const r=await window.cowork.callMcpTool('mcp__649a3805-7245-4766-8382-01cd79dd468a__list_events',
      {startTime:start,endTime:end,pageSize:150,orderBy:'startTime'});
    if(r.isError)throw new Error();
    const data=r.structuredContent??JSON.parse(r.content[0].text);
    gcalEvts=(data.events||[]).map(e=>{
      const dt=e.start?.dateTime||e.start?.date||'';
      const dstr=dt.substring(0,10);
      let time='';
      if(e.start?.dateTime){const d=new Date(e.start.dateTime);time=d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});}
      return{date:dstr,title:e.summary||'(sem título)',time,color:GCOL[e.colorId]||GCOL.default};
    });
    if(st){st.innerHTML=`✓ ${(data.events||[]).length} eventos do Google Calendar`;st.style.color='#38a169';}
  }catch{
    if(st){st.innerHTML='⚠ Não foi possível carregar o Google Calendar';st.style.color='#e53e3e';}
  }
  if(sp)sp.style.display='none';
  renderCal();
}

// ═══════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════
document.getElementById('f-date').value=new Date().toISOString().split('T')[0];
renderCal();renderTasks();updStats();loadGCal();
