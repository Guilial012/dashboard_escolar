// ── Constants ──────────────────────────────────────────────────────────────────
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_S = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const DAYS_PT = ['D','S','T','Q','Q','S','S'];
const TAG_LABELS = {prova:'Prova',apresentacao:'Apresentação',entrega:'Entrega',filme:'Filme',outro:'Outro'};
const TAG_COLORS = {prova:'#e53e3e',apresentacao:'#3182ce',entrega:'#805ad5',filme:'#d69e2e',outro:'#38a169'};
const GCAL_COLOR_MAP = {
  1:'#a78bfa',2:'#6ee7b7',3:'#c084fc',4:'#f9a8d4',5:'#fde68a',
  6:'#fb923c',7:'#38bdf8',8:'#9ca3af',9:'#60a5fa',10:'#34d399',11:'#f87171',
  default:'#60a5fa'
};

// ── Pre-loaded school tasks ────────────────────────────────────────────────────
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

// ── State ──────────────────────────────────────────────────────────────────────
let calYear = 2026, calMonth = 5; // June (0-indexed)
let selectedDate = null;
let gcalEvts = [];
let activeFilter = 'all';
let openDescs = new Set();

function ls(k, d) { try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? d; } catch { return d; } }
function ls_set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

let customTasks = ls('sch_custom_v3', []);
let doneTasks = new Set(ls('sch_done_v3', []));
let taskDescs = ls('sch_descs_v3', {}); // id -> extra description

function allTasks() { return [...PRESET, ...customTasks]; }

// ── Calendar ───────────────────────────────────────────────────────────────────
function changeMonth(d) {
  calMonth += d;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCal();
  loadGCal();
}

function renderCal() {
  document.getElementById('cal-title').textContent = `${MONTHS[calMonth]} ${calYear}`;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  DAYS_PT.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dayname';
    el.textContent = d;
    grid.appendChild(el);
  });

  const today = new Date(); today.setHours(0,0,0,0);
  const firstWd = new Date(calYear, calMonth, 1).getDay();
  const daysInMo = new Date(calYear, calMonth + 1, 0).getDate();
  const prevDays  = new Date(calYear, calMonth, 0).getDate();
  const tasks = allTasks();

  for (let i = firstWd - 1; i >= 0; i--)
    grid.appendChild(makeDay(calYear, calMonth - 1, prevDays - i, true, tasks, today));
  for (let d = 1; d <= daysInMo; d++)
    grid.appendChild(makeDay(calYear, calMonth, d, false, tasks, today));
  const pad = (firstWd + daysInMo) % 7;
  for (let d = 1; d <= (pad ? 7 - pad : 0); d++)
    grid.appendChild(makeDay(calYear, calMonth + 1, d, true, tasks, today));

  renderDayPanel();
}

function dateStr(year, month, day) {
  const m = ((month % 12) + 12) % 12;
  const y = month < 0 ? year - 1 : month > 11 ? year + 1 : year;
  return `${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function makeDay(year, month, day, other, tasks, today) {
  const ds = dateStr(year, month, day);
  const el = document.createElement('div');
  el.className = 'cal-day' + (other ? ' other-month' : '');

  const d = new Date(year, ((month%12)+12)%12, day); d.setHours(0,0,0,0);
  if (d.getTime() === today.getTime()) el.classList.add('today');
  if (ds === selectedDate) el.classList.add('selected');

  const numEl = document.createElement('div');
  numEl.className = 'day-num';
  numEl.textContent = day;
  el.appendChild(numEl);

  const tCount = tasks.filter(t => t.date === ds && !doneTasks.has(t.id)).length;
  const gCount = gcalEvts.filter(e => e.date === ds).length;

  if (tCount || gCount) {
    const dots = document.createElement('div');
    dots.className = 'day-dots';
    for (let i = 0; i < Math.min(tCount, 3); i++) {
      const dot = document.createElement('div'); dot.className = 'dot task'; dots.appendChild(dot);
    }
    for (let i = 0; i < Math.min(gCount, 2); i++) {
      const dot = document.createElement('div'); dot.className = 'dot gcal'; dots.appendChild(dot);
    }
    el.appendChild(dots);
  }

  el.addEventListener('click', () => {
    selectedDate = selectedDate === ds ? null : ds;
    renderCal();
  });

  return el;
}

function renderDayPanel() {
  const panel = document.getElementById('day-panel');
  if (!selectedDate) { panel.innerHTML = ''; return; }

  const tasks = allTasks().filter(t => t.date === selectedDate);
  const evts  = gcalEvts.filter(e => e.date === selectedDate);
  if (!tasks.length && !evts.length) { panel.innerHTML = ''; return; }

  const [y,m,d] = selectedDate.split('-');
  let html = `<div class="day-panel"><h3>📅 ${parseInt(d)}/${parseInt(m)}/${y}</h3>`;

  if (tasks.length) {
    html += `<div class="day-section-label">Tarefas Escolares</div>`;
    tasks.forEach(t => {
      const desc = taskDescs[t.id] || t.sub;
      html += `<div class="day-event">
        <div class="event-dot" style="background:${TAG_COLORS[t.tag]||'#718096'}"></div>
        <div><div class="event-title">${t.title}</div>${desc?`<div class="event-sub">${desc}</div>`:''}</div>
      </div>`;
    });
  }

  if (evts.length) {
    html += `<div class="day-section-label">Google Calendar</div>`;
    evts.forEach(e => {
      html += `<div class="day-event">
        <div class="event-dot" style="background:${e.color}"></div>
        <div><div class="event-title">${e.title}</div>${e.time?`<div class="event-sub">${e.time}</div>`:''}</div>
      </div>`;
    });
  }

  html += '</div>';
  panel.innerHTML = html;
}

// ── Tasks list ─────────────────────────────────────────────────────────────────
function setFilter(f) {
  activeFilter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.filter-btn.f-${f}`);
  if (btn) btn.classList.add('active');
  renderTasks();
}

function toggleDone(id) {
  doneTasks.has(id) ? doneTasks.delete(id) : doneTasks.add(id);
  ls_set('sch_done_v3', [...doneTasks]);
  renderTasks(); renderCal(); updateStats();
}

function toggleDesc(id) {
  const box = document.getElementById('d-' + id);
  const btn = document.getElementById('db-' + id);
  if (!box) return;
  const open = box.classList.toggle('open');
  if (btn) btn.classList.toggle('open', open);
}

function fmtDate(ds) {
  const [y,m,d] = ds.split('-');
  const today = new Date(); today.setHours(0,0,0,0);
  const dt = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
  const diff = Math.round((dt - today) / 86400000);
  const label = `${parseInt(d)} ${MONTHS_S[parseInt(m)-1]}`;
  if (diff === 0) return `Hoje · ${label}`;
  if (diff === 1) return `Amanhã · ${label}`;
  if (diff > 0 && diff <= 7) return `Em ${diff} dias · ${label}`;
  return label;
}

function renderTasks() {
  const container = document.getElementById('tasks-list');
  let tasks = allTasks().filter(t => activeFilter === 'all' || t.tag === activeFilter);

  if (!tasks.length) {
    container.innerHTML = '<div class="empty">Nenhuma tarefa nesta categoria.</div>';
    return;
  }

  tasks.sort((a, b) => {
    const dA = doneTasks.has(a.id), dB = doneTasks.has(b.id);
    if (dA !== dB) return dA ? 1 : -1;
    return a.date.localeCompare(b.date);
  });

  container.innerHTML = '';
  tasks.forEach(t => {
    const done = doneTasks.has(t.id);
    const extraDesc = taskDescs[t.id] || '';
    const desc = extraDesc || t.sub || '';
    const hasDesc = desc.length > 0;

    const item = document.createElement('div');
    item.className = 'task-item' + (done ? ' done' : '');

    item.innerHTML = `
      <div class="task-row">
        <div class="task-check" onclick="toggleDone('${t.id}')"></div>
        <div class="task-body">
          <div class="task-title">${t.title}</div>
          <div class="task-date">${fmtDate(t.date)}</div>
        </div>
        <span class="task-tag tag-${t.tag}">${TAG_LABELS[t.tag]||t.tag}</span>
        ${hasDesc ? `<button class="task-expand" id="db-${t.id}" onclick="toggleDesc('${t.id}')">▾</button>` : ''}
      </div>
      ${hasDesc ? `<div class="task-desc-box" id="d-${t.id}">${desc}</div>` : ''}
    `;
    container.appendChild(item);
  });
}

function updateStats() {
  const tasks = allTasks().filter(t => !doneTasks.has(t.id));
  document.getElementById('st-provas').textContent   = tasks.filter(t => t.tag === 'prova').length;
  document.getElementById('st-apres').textContent    = tasks.filter(t => t.tag === 'apresentacao').length;
  document.getElementById('st-entregas').textContent = tasks.filter(t => t.tag === 'entrega' || t.tag === 'filme').length;
  document.getElementById('st-outros').textContent   = tasks.filter(t => t.tag === 'outro').length;

  const total = allTasks().length, done = doneTasks.size;
  document.getElementById('subtitle').textContent =
    done === total && total > 0
      ? '🎉 Tudo concluído! Arrasou!'
      : `${done} de ${total} atividades concluídas`;
}

// ── Add form ───────────────────────────────────────────────────────────────────
function openAddForm() {
  const toggle = document.getElementById('add-toggle');
  const body   = document.getElementById('add-body');
  toggle.classList.add('open');
  body.classList.add('open');
  document.getElementById('add-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function toggleAddForm() {
  document.getElementById('add-toggle').classList.toggle('open');
  document.getElementById('add-body').classList.toggle('open');
}

async function submitTask() {
  const title  = document.getElementById('f-title').value.trim();
  const date   = document.getElementById('f-date').value;
  const type   = document.getElementById('f-type').value;
  const desc   = document.getElementById('f-desc').value.trim();
  const syncGC = document.getElementById('f-gcal').checked;
  const msg    = document.getElementById('f-msg');
  const btn    = document.getElementById('f-submit');

  msg.className = 'form-msg';

  if (!title || !date) {
    msg.textContent = 'Preencha o título e a data.';
    msg.className = 'form-msg err';
    return;
  }

  const id = 'c' + Date.now();
  const task = { id, date, title, sub: desc ? '' : '', tag: type };
  customTasks.push(task);
  if (desc) taskDescs[id] = desc;
  ls_set('sch_custom_v3', customTasks);
  ls_set('sch_descs_v3', taskDescs);

  if (syncGC) {
    btn.disabled = true;
    btn.textContent = 'Sincronizando...';
    try {
      const r = await window.cowork.callMcpTool(
        'mcp__649a3805-7245-4766-8382-01cd79dd468a__create_event',
        {
          summary: `📚 ${title}`,
          startTime: date + 'T09:00:00',
          endTime:   date + 'T10:00:00',
          description: desc || TAG_LABELS[type] + ' escolar',
          timeZone: 'America/Recife'
        }
      );
      if (r.isError) throw new Error();
      msg.textContent = '✓ Tarefa adicionada e sincronizada com o Google Calendar!';
      msg.className = 'form-msg ok';
    } catch {
      msg.textContent = '⚠ Tarefa salva localmente, mas falhou ao sincronizar com o Google Calendar.';
      msg.className = 'form-msg err';
    }
    btn.disabled = false;
    btn.textContent = 'Adicionar Tarefa';
  } else {
    msg.textContent = '✓ Tarefa adicionada!';
    msg.className = 'form-msg ok';
    setTimeout(() => { msg.className = 'form-msg'; }, 3000);
  }

  document.getElementById('f-title').value = '';
  document.getElementById('f-date').value  = new Date().toISOString().split('T')[0];
  document.getElementById('f-desc').value  = '';

  renderTasks(); renderCal(); updateStats();
}

// ── Google Calendar ────────────────────────────────────────────────────────────
async function loadGCal() {
  const statusEl  = document.getElementById('gcal-status');
  const spinnerEl = document.getElementById('gcal-spinner');
  spinnerEl.style.display = 'inline-block';

  const y = calYear, m = calMonth;
  const start = `${y}-${String(m+1).padStart(2,'0')}-01T00:00:00`;
  const nextM = m + 1 > 11 ? 0 : m + 1;
  const nextY = m + 1 > 11 ? y + 1 : y;
  const end   = `${nextY}-${String(nextM+1).padStart(2,'0')}-01T00:00:00`;

  try {
    const r = await window.cowork.callMcpTool(
      'mcp__649a3805-7245-4766-8382-01cd79dd468a__list_events',
      { startTime: start, endTime: end, pageSize: 150, orderBy: 'startTime' }
    );
    if (r.isError) throw new Error();
    const data   = r.structuredContent ?? JSON.parse(r.content[0].text);
    const events = data.events || [];

    gcalEvts = events.map(e => {
      const dt  = e.start?.dateTime || e.start?.date || '';
      const ds  = dt.substring(0, 10);
      let time  = '';
      if (e.start?.dateTime) {
        const d = new Date(e.start.dateTime);
        time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      }
      return {
        date:  ds,
        title: e.summary || '(sem título)',
        time,
        color: GCAL_COLOR_MAP[e.colorId] || GCAL_COLOR_MAP.default
      };
    });

    statusEl.innerHTML = `✓ ${events.length} eventos do Google Calendar`;
    statusEl.style.color = '#38a169';
  } catch {
    statusEl.innerHTML = '⚠ Não foi possível carregar o Google Calendar';
    statusEl.style.color = '#e53e3e';
  }

  spinnerEl.style.display = 'none';
  renderCal();
}

// ── Init ───────────────────────────────────────────────────────────────────────
document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
renderCal();
renderTasks();
updateStats();
loadGCal();
