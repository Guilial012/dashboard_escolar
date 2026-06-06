// ─────────────────────────────────────────────────────────────────
// app.js — Lógica do Dashboard Escolar
// Depende de: js/data.js (carregado antes no HTML)
// ─────────────────────────────────────────────────────────────────

// ══ Estado global ═════════════════════════════════════════════════
let calY = 2026, calM = 5;   // calendário: ano e mês atual (0-based)
let selDate   = null;         // data selecionada no calendário
let gcalEvts  = [];           // eventos do Google Calendar
let filt      = 'all';        // filtro de tarefas ativo
let activeTab = 'tasks';      // aba ativa

let curSchDay = null;         // dia selecionado no horário (1=Seg…5=Sex)
let wkOff     = 0;            // offset de semana na tabela semanal

// ── localStorage ─────────────────────────────────────────────────
const ls  = (k, d) => { try { return JSON.parse(localStorage.getItem(k) ?? 'null') ?? d; } catch { return d; } };
const lss = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

let cTasks    = ls('sc_ct_v4', []);         // tarefas customizadas
let doneTasks = new Set(ls('sc_dn_v4', [])); // IDs concluídos
let tDescs    = ls('sc_td_v4', {});          // descrições por ID

const nKey = (m, d, i) => `cn_${m}_${d}_${i}`;
const gNote = (m, d, i) => ls(nKey(m, d, i), '');
const sNote = (m, d, i, v) => lss(nKey(m, d, i), v);

const allTasks = () => [...PRESET, ...cTasks];

// ══ Utilitários ═══════════════════════════════════════════════════
function fmtAgo(ts) {
  const s = Math.round((Date.now() - ts) / 1000);
  if (s < 60)   return `há ${s}s`;
  if (s < 3600) return `há ${Math.round(s / 60)}min`;
  return `há ${Math.round(s / 3600)}h`;
}

function updateCacheBadge(ts) {
  const badge = document.getElementById('cache-badge');
  if (!ts) { badge.classList.remove('visible'); return; }
  badge.textContent = `⚡ ${fmtAgo(ts)}`;
  badge.classList.add('visible');
}

function dateStr(y, m, d) {
  const mm = ((m % 12) + 12) % 12;
  const yy = m < 0 ? y - 1 : m > 11 ? y + 1 : y;
  return `${yy}-${String(mm + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function fmtDate(s) {
  const [y, m, d] = s.split('-');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const dt    = new Date(+y, +m - 1, +d);
  const diff  = Math.round((dt - today) / 86400000);
  const lbl   = `${+d} ${MONTHS_S[+m - 1]}`;
  if (diff === 0) return `Hoje · ${lbl}`;
  if (diff === 1) return `Amanhã · ${lbl}`;
  if (diff > 0 && diff <= 7) return `Em ${diff} dias · ${lbl}`;
  return lbl;
}

function tagCls(tag) {
  return { prova:'tag-p', apresentacao:'tag-a', entrega:'tag-e', filme:'tag-f', outro:'tag-o' }[tag] || 'tag-o';
}

// ══ Abas ══════════════════════════════════════════════════════════
function showTab(t) {
  activeTab = t;
  document.getElementById('tab-tasks').style.display    = t === 'tasks'    ? '' : 'none';
  document.getElementById('tab-schedule').style.display = t === 'schedule' ? '' : 'none';
  document.getElementById('fab').style.display          = t === 'tasks'    ? 'flex' : 'none';
  document.querySelectorAll('.nav-item').forEach((b, i) =>
    b.classList.toggle('active', (i === 0 && t === 'tasks') || (i === 1 && t === 'schedule')));
  if (t === 'schedule') renderSch();
}

// ══ Calendário ════════════════════════════════════════════════════
function chMonth(delta) {
  calM += delta;
  if (calM > 11) { calM = 0; calY++; }
  if (calM < 0)  { calM = 11; calY--; }
  renderCal();
  loadGCal();
}

function renderCal() {
  document.getElementById('cal-title').textContent = `${MONTHS[calM]} ${calY}`;
  const grid  = document.getElementById('cal-grid');
  grid.innerHTML = '';

  DAYS_PT.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dn';
    el.textContent = d;
    grid.appendChild(el);
  });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const fw    = new Date(calY, calM, 1).getDay();
  const dim   = new Date(calY, calM + 1, 0).getDate();
  const pd    = new Date(calY, calM, 0).getDate();
  const tasks = allTasks();

  for (let i = fw - 1; i >= 0; i--) grid.appendChild(mkDay(calY, calM - 1, pd - i, true,  tasks, today));
  for (let d = 1; d <= dim; d++)     grid.appendChild(mkDay(calY, calM,     d,       false, tasks, today));
  const pad = (fw + dim) % 7;
  for (let d = 1; d <= (pad ? 7 - pad : 0); d++) grid.appendChild(mkDay(calY, calM + 1, d, true, tasks, today));

  renderDayDetail();
}

function mkDay(y, m, d, other, tasks, today) {
  const s  = dateStr(y, m, d);
  const el = document.createElement('div');
  el.className = 'cal-d' + (other ? ' om' : '');

  const dt = new Date(y, ((m % 12) + 12) % 12, d); dt.setHours(0, 0, 0, 0);
  if (dt.getTime() === today.getTime()) el.classList.add('today');
  if (s === selDate) el.classList.add('sel');

  const dn = document.createElement('div');
  dn.className = 'cal-dnum';
  dn.textContent = d;
  el.appendChild(dn);

  const tc = tasks.filter(t => t.date === s && !doneTasks.has(t.id)).length;
  const gc = gcalEvts.filter(e => e.date === s).length;
  if (tc || gc) {
    const dots = document.createElement('div');
    dots.className = 'cal-dots';
    for (let i = 0; i < Math.min(tc, 3); i++) {
      const x = document.createElement('div'); x.className = 'dot dot-t'; dots.appendChild(x);
    }
    for (let i = 0; i < Math.min(gc, 2); i++) {
      const x = document.createElement('div'); x.className = 'dot dot-g'; dots.appendChild(x);
    }
    el.appendChild(dots);
  }

  el.addEventListener('click', () => { selDate = (selDate === s ? null : s); renderCal(); });
  return el;
}

function renderDayDetail() {
  const p = document.getElementById('day-detail');
  if (!selDate) { p.innerHTML = ''; return; }

  const tasks = allTasks().filter(t => t.date === selDate);
  const evts  = gcalEvts.filter(e => e.date === selDate);
  if (!tasks.length && !evts.length) { p.innerHTML = ''; return; }

  const [, m, d] = selDate.split('-');
  let h = `<div class="day-detail">
    <div class="day-detail-title">📅 ${+d} de ${MONTHS[+m - 1]}</div>`;

  if (tasks.length) {
    h += '<div class="dd-section">Tarefas</div>';
    tasks.forEach(t => {
      const dc = tDescs[t.id] || t.sub;
      h += `<div class="dd-event">
        <div class="dd-dot" style="background:${TCOL[t.tag] || '#49454F'}"></div>
        <div>
          <div class="dd-name">${t.title}</div>
          ${dc ? `<div class="dd-sub">${dc}</div>` : ''}
        </div>
      </div>`;
    });
  }
  if (evts.length) {
    h += '<div class="dd-section">Google Calendar</div>';
    evts.forEach(e => {
      h += `<div class="dd-event">
        <div class="dd-dot" style="background:${e.color}"></div>
        <div>
          <div class="dd-name">${e.title}</div>
          ${e.time ? `<div class="dd-sub">${e.time}</div>` : ''}
        </div>
      </div>`;
    });
  }
  h += '</div>';
  p.innerHTML = h;
}

// ══ Tarefas ═══════════════════════════════════════════════════════
function setFilt(f) {
  filt = f;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  const idx = { all:0, prova:1, apresentacao:2, entrega:3, outro:4 }[f];
  document.querySelectorAll('.chip')[idx]?.classList.add('active');
  renderTasks();
}

function togDone(id) {
  doneTasks.has(id) ? doneTasks.delete(id) : doneTasks.add(id);
  lss('sc_dn_v4', [...doneTasks]);
  renderTasks(); renderCal(); updStats();
}

function togDesc(id) {
  const b   = document.getElementById('d-' + id);
  const btn = document.getElementById('db-' + id);
  if (!b) return;
  const open = b.classList.toggle('open');
  if (btn) btn.classList.toggle('open', open);
}

function renderTasks() {
  const c = document.getElementById('task-list');
  let tasks = allTasks().filter(t => filt === 'all' || t.tag === filt);
  if (!tasks.length) {
    c.innerHTML = '<div class="empty-state">Nenhuma tarefa nesta categoria.</div>';
    return;
  }
  tasks.sort((a, b) => {
    const da = doneTasks.has(a.id), db = doneTasks.has(b.id);
    if (da !== db) return da ? 1 : -1;
    return a.date.localeCompare(b.date);
  });
  c.innerHTML = '';
  tasks.forEach(t => {
    const done = doneTasks.has(t.id);
    const desc = tDescs[t.id] || t.sub || '';
    const hasDesc = desc.length > 0;
    const item = document.createElement('div');
    item.className = 'task-item' + (done ? ' done' : '');
    item.innerHTML = `
      <div class="task-row">
        <div class="task-chk" onclick="togDone('${t.id}')"></div>
        <div class="task-body">
          <div class="task-name">${t.title}</div>
          <div class="task-date">${fmtDate(t.date)}</div>
        </div>
        <span class="task-tag ${tagCls(t.tag)}">${TLAB[t.tag] || t.tag}</span>
        ${hasDesc ? `<button class="task-expand" id="db-${t.id}" onclick="togDesc('${t.id}')">▾</button>` : ''}
      </div>
      ${hasDesc ? `<div class="task-desc" id="d-${t.id}">${desc}</div>` : ''}`;
    c.appendChild(item);
  });
}

function updStats() {
  const tasks = allTasks().filter(t => !doneTasks.has(t.id));
  document.getElementById('st-pr').textContent = tasks.filter(t => t.tag === 'prova').length;
  document.getElementById('st-ap').textContent = tasks.filter(t => t.tag === 'apresentacao').length;
  document.getElementById('st-en').textContent = tasks.filter(t => t.tag === 'entrega' || t.tag === 'filme').length;
  document.getElementById('st-ou').textContent = tasks.filter(t => t.tag === 'outro').length;
  const total = allTasks().length, done = doneTasks.size;
  document.getElementById('subtitle').textContent =
    done === total && total > 0
      ? '🎉 Tudo concluído! Arrasou!'
      : `${done} de ${total} atividades concluídas`;
}

// ══ Bottom Sheet ══════════════════════════════════════════════════
function openSheet()  { document.getElementById('sheet-overlay').classList.add('open'); }
function closeSheet(e) {
  if (!e || e.target === document.getElementById('sheet-overlay'))
    document.getElementById('sheet-overlay').classList.remove('open');
}

async function submitTask() {
  const title = document.getElementById('f-title').value.trim();
  const date  = document.getElementById('f-date').value;
  const type  = document.getElementById('f-type').value;
  const desc  = document.getElementById('f-desc').value.trim();
  const sync  = document.getElementById('f-gcal').checked;
  const msg   = document.getElementById('f-msg');
  const btn   = document.getElementById('f-sub');

  msg.className = 'form-msg';
  if (!title || !date) {
    msg.textContent = 'Preencha o título e a data.';
    msg.className = 'form-msg err';
    return;
  }

  const id = 'c' + Date.now();
  cTasks.push({ id, date, title, sub: '', tag: type });
  if (desc) tDescs[id] = desc;
  lss('sc_ct_v4', cTasks);
  lss('sc_td_v4', tDescs);

  if (sync) {
    btn.disabled = true; btn.textContent = 'Salvando...';
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary:     `📚 ${title}`,
          startTime:   `${date}T09:00:00`,
          endTime:     `${date}T10:00:00`,
          description: desc || TLAB[type] + ' escolar',
          timeZone:    'America/Recife',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      msg.textContent = '✓ Adicionada e salva no Google Calendar!';
      msg.className = 'form-msg ok';
    } catch {
      msg.textContent = '⚠ Salva localmente, mas falhou ao sincronizar.';
      msg.className = 'form-msg err';
    }
    btn.disabled = false; btn.textContent = 'Adicionar';
  } else {
    msg.textContent = '✓ Tarefa adicionada!';
    msg.className = 'form-msg ok';
    setTimeout(() => msg.className = 'form-msg', 2500);
  }

  document.getElementById('f-title').value = '';
  document.getElementById('f-desc').value  = '';
  renderTasks(); renderCal(); updStats();
}

// ══ Google Calendar (via servidor) ════════════════════════════════
async function loadGCal(forceRefresh = false) {
  const barEl   = document.getElementById('gcal-bar');
  const syncBtn = document.getElementById('sync-btn');

  syncBtn.classList.add('loading');
  barEl.innerHTML  = '<span class="sp"></span> Buscando eventos...';
  barEl.className  = 'gcal-bar';
  updateCacheBadge(null);

  try {
    const url = `/api/events?year=${calY}&month=${calM + 1}${forceRefresh ? '&refresh=true' : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    gcalEvts = data.events || [];
    barEl.textContent = `✓ ${gcalEvts.length} eventos do Google Calendar${data.cached ? ' (cache)' : ''}`;
    barEl.className   = 'gcal-bar ok';
    updateCacheBadge(data.ts);
  } catch (err) {
    barEl.innerHTML = '⚠ Servidor offline — inicie com <code>npm start</code>';
    barEl.className = 'gcal-bar err';
    updateCacheBadge(null);
  }

  syncBtn.classList.remove('loading');
  renderCal();
}

// ══ Horário ═══════════════════════════════════════════════════════
function getMon(offset) {
  const now = new Date();
  const dow = now.getDay();
  const mon = new Date(now);
  mon.setDate(now.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  mon.setHours(0, 0, 0, 0);
  return mon;
}
function d2s(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function renderSch() {
  renderBanner();
  const now = new Date(), dow = now.getDay();
  if (!curSchDay) curSchDay = (dow >= 1 && dow <= 5) ? dow : 1;
  document.querySelectorAll('.day-tab').forEach(b => {
    const d = +b.dataset.d;
    b.classList.toggle('active', d === curSchDay);
  });
  renderSlots();
  renderWeekTable();
}

function renderBanner() {
  const now = new Date(), dow = now.getDay();
  const fd  = `${now.getDate()} de ${MONTHS[now.getMonth()]} de ${now.getFullYear()}`;
  const banner = document.getElementById('today-banner');
  if (dow >= 1 && dow <= 5) {
    const slots = SCH[dow] || [], nm = now.getHours() * 60 + now.getMinutes();
    const cur = slots.find(sl => {
      if (sl.brk) return false;
      const [sh, sm] = sl.s.split(':').map(Number);
      const [eh, em] = sl.e.split(':').map(Number);
      return nm >= sh * 60 + sm && nm < eh * 60 + em;
    });
    const nxt = !cur && slots.find(sl => {
      if (sl.brk) return false;
      const [sh, sm] = sl.s.split(':').map(Number);
      return nm < sh * 60 + sm;
    });
    banner.innerHTML = `<div class="today-banner">
      <div class="tb-label">Hoje · ${DLONG[dow]}</div>
      <div class="tb-date">${fd}</div>
      ${cur ? `<div class="tb-now">▶ Agora: ${cur.sub} · ${cur.s}–${cur.e}</div>`
            : nxt ? `<div class="tb-now">⏭ Próxima: ${nxt.sub} às ${nxt.s}</div>`
            : `<div class="tb-now">✔ Aulas encerradas</div>`}
    </div>`;
  } else {
    banner.innerHTML = `<div class="today-banner">
      <div class="tb-label">${DLONG[dow]} · Sem aulas</div>
      <div class="tb-date">${fd}</div>
      <div class="tb-now">📅 Próxima aula: Segunda-feira</div>
    </div>`;
  }
}

function selectDay(d) {
  curSchDay = d;
  document.querySelectorAll('.day-tab').forEach(b =>
    b.classList.toggle('active', +b.dataset.d === d));
  renderSlots();
}

let noteTimers = {};

function renderSlots() {
  const c      = document.getElementById('slot-list');
  c.innerHTML  = '';
  const slots  = SCH[curSchDay] || [];
  const now    = new Date(), todDow = now.getDay();
  const isToday = curSchDay === todDow;
  const nm     = now.getHours() * 60 + now.getMinutes();
  const mon    = getMon(wkOff), monStr = d2s(mon);

  slots.forEach((sl, i) => {
    const item = document.createElement('div');
    item.className = 'slot-item' + (sl.brk ? ' brk' : '');

    if (isToday && !sl.brk) {
      const [sh, sm] = sl.s.split(':').map(Number);
      const [eh, em] = sl.e.split(':').map(Number);
      if (nm >= sh * 60 + sm && nm < eh * 60 + em) item.classList.add('cur');
    }

    const st = subStyle(sl.sub);
    const nv = sl.brk ? '' : gNote(monStr, curSchDay, i);
    const hn = nv.trim().length > 0;

    if (sl.brk) {
      item.innerHTML = `<div class="slot-row">
        <span class="slot-time">${sl.s} – ${sl.e}</span>
        <span class="slot-pill" style="background:${st.bg};color:${st.tc}">☕ ${sl.sub}</span>
      </div>`;
    } else {
      item.innerHTML = `
        <div class="slot-row" onclick="togNote(this,'${monStr}',${curSchDay},${i})">
          <span class="slot-time">${sl.s} – ${sl.e}</span>
          <span class="slot-pill" style="background:${st.bg};color:${st.tc}">${sl.sub}</span>
          ${hn ? `<span class="note-badge">📝 nota</span>` : ''}
          <span class="slot-exp">▾</span>
        </div>
        <div class="notes-panel">
          <div class="np-label">${DSHORT[curSchDay]} · ${sl.s} · Semana ${mon.getDate()}/${mon.getMonth()+1}</div>
          <textarea class="note-ta" id="nt-${monStr}-${curSchDay}-${i}"
            placeholder="O que foi visto? Dúvidas, resumo, tarefa de casa...">${nv}</textarea>
          <div class="note-saved" id="ns-${monStr}-${curSchDay}-${i}">✓ Salvo automaticamente</div>
        </div>`;
    }
    c.appendChild(item);
  });

  // Debounce para auto-salvar notas
  slots.forEach((sl, i) => {
    if (sl.brk) return;
    const ta = document.getElementById(`nt-${monStr}-${curSchDay}-${i}`);
    if (!ta) return;
    ta.addEventListener('input', () => {
      const k = `${monStr}_${curSchDay}_${i}`;
      clearTimeout(noteTimers[k]);
      noteTimers[k] = setTimeout(() => {
        sNote(monStr, curSchDay, i, ta.value);
        const sv = document.getElementById(`ns-${monStr}-${curSchDay}-${i}`);
        if (sv) { sv.style.display = 'block'; setTimeout(() => sv.style.display = 'none', 1800); }
      }, 600);
    });
  });
}

function togNote(row, mon, d, i) {
  const item = row.parentElement;
  const was  = item.classList.contains('nopen');
  document.querySelectorAll('.slot-item.nopen').forEach(el => el.classList.remove('nopen'));
  if (!was) {
    item.classList.add('nopen');
    setTimeout(() => {
      const ta = document.getElementById(`nt-${mon}-${d}-${i}`);
      if (ta) ta.focus();
    }, 40);
  }
}

function chWeek(delta) {
  wkOff += delta;
  renderWeekTable();
  renderSlots();
}

function renderWeekTable() {
  const mon    = getMon(wkOff), monStr = d2s(mon);
  const fri    = new Date(mon); fri.setDate(mon.getDate() + 4);
  document.getElementById('wlabel').textContent =
    `${mon.getDate()} ${MONTHS_S[mon.getMonth()]} – ${fri.getDate()} ${MONTHS_S[fri.getMonth()]}`;

  const today  = new Date(); today.setHours(0, 0, 0, 0);
  const todStr = d2s(today);
  const dDates = [1,2,3,4,5].map(d => {
    const dt = new Date(mon); dt.setDate(mon.getDate() + d - 1); return dt;
  });

  let h = '<thead><tr><th></th>';
  dDates.forEach((dt, i) => {
    const s = d2s(dt), isT = s === todStr;
    h += `<th${isT ? ' class="tc"' : ''}>${DSHORT[i+1]}<br>
      <span style="font-size:.6rem;font-weight:400">${dt.getDate()}/${dt.getMonth()+1}</span></th>`;
  });
  h += '</tr></thead><tbody>';

  [0,1,2,'brk',3,4,5].forEach(si => {
    if (si === 'brk') {
      h += '<tr class="brow"><td class="time-c">15:45</td>';
      for (let d = 0; d < 5; d++) h += '<td><span class="brlbl">Intervalo</span></td>';
      h += '</tr>'; return;
    }
    const ref = SCH[1][si] || {};
    h += `<tr><td class="time-c">${ref.s || ''}</td>`;
    [1,2,3,4,5].forEach((dow, di) => {
      const sl = SCH[dow][si], dt = dDates[di], s = d2s(dt), isT = s === todStr;
      if (sl) {
        const st2 = subStyle(sl.sub);
        const hn  = gNote(monStr, dow, si).trim().length > 0;
        h += `<td${isT ? ' style="background:var(--md-primary-container)"' : ''}>
          <span class="wpill" style="background:${st2.bg};color:${st2.tc}">${sl.sub}${hn ? ' 📝' : ''}</span>
        </td>`;
      } else {
        h += '<td>—</td>';
      }
    });
    h += '</tr>';
  });
  h += '</tbody>';
  document.getElementById('wtbl').innerHTML = h;
}

// ══ Init ══════════════════════════════════════════════════════════
document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
renderCal();
renderTasks();
updStats();
loadGCal();
