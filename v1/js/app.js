const DATA = [
  {
    date: "2026-06-08",
    label: "08/06", weekday: "Segunda-feira",
    items: [
      { id: "p1", text: "Prova de Português", sub: "Memórias Póstumas de Brás Cubas", tag: "prova" },
      { id: "p2", text: "Prova de Matemática", sub: "Capítulo 4 — Explorando as Funções", tag: "prova" },
    ]
  },
  {
    date: "2026-06-09",
    label: "09/06", weekday: "Terça-feira",
    items: [
      { id: "p3", text: "Apresentação — Seminário Tipos de Amor", sub: "Português", tag: "apresentacao" },
      { id: "p4", text: "Prova de Geografia", sub: "", tag: "prova" },
    ]
  },
  {
    date: "2026-06-10",
    label: "10/06", weekday: "Quarta-feira",
    items: [
      { id: "p5", text: "Prova de Reflexão Linguística", sub: "Orações Subordinadas Adverbiais", tag: "prova" },
      { id: "p6", text: "Continuação — Prova de História", sub: "Revolução Russa", tag: "prova" },
    ]
  },
  {
    date: "2026-06-12",
    label: "12/06", weekday: "Sexta-feira",
    items: [
      { id: "p7", text: "Prova de Química", sub: "", tag: "prova" },
      { id: "p8", text: "Entrega de Crônicas", sub: "Português", tag: "entrega" },
    ]
  },
  {
    date: "2026-06-15",
    label: "15/06", weekday: "Segunda-feira",
    items: [
      { id: "p9", text: "Prova de Biologia", sub: "", tag: "prova" },
      { id: "p10", text: "Apresentação — Seminário Tipos de Amor", sub: "Português", tag: "apresentacao" },
    ]
  },
  {
    date: "2026-06-16",
    label: "16/06", weekday: "Terça-feira",
    items: [
      { id: "p11", text: "Filme da Unidade: Filadélfia", sub: "Português — parte 1", tag: "filme" },
    ]
  },
  {
    date: "2026-06-17",
    label: "17/06", weekday: "Quarta-feira",
    items: [
      { id: "p12", text: "Filme da Unidade: Filadélfia", sub: "Português — parte 2", tag: "filme" },
    ]
  },
  {
    date: "2026-06-18",
    label: "18/06", weekday: "Quinta-feira",
    items: [
      { id: "p13", text: "Test 2 — Red Balloon", sub: "", tag: "prova" },
    ]
  },
];

const TAG_LABELS = {
  prova: "Prova",
  apresentacao: "Apresentação",
  entrega: "Entrega",
  filme: "Filme",
  outro: "Outro"
};

// Load saved state
let saved = {};
try { saved = JSON.parse(localStorage.getItem('escolar_done') || '{}'); } catch(e) {}

function save() {
  try { localStorage.setItem('escolar_done', JSON.stringify(saved)); } catch(e) {}
}

function getDaysUntil(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const target = new Date(dateStr + 'T00:00:00');
  return Math.round((target - today) / 86400000);
}

function getBadge(days, allDone) {
  if (allDone) return ['done', 'Tudo feito ✓'];
  if (days < 0) return ['done', 'Passou'];
  if (days === 0) return ['urgent', 'Hoje!'];
  if (days === 1) return ['urgent', 'Amanhã'];
  if (days <= 3) return ['soon', `Em ${days} dias`];
  return ['later', `Em ${days} dias`];
}

function updateStats() {
  let provas = 0, apres = 0, trab = 0, outros = 0;
  DATA.forEach(d => d.items.forEach(item => {
    if (saved[item.id]) return;
    if (item.tag === 'prova') provas++;
    else if (item.tag === 'apresentacao') apres++;
    else if (item.tag === 'entrega') trab++;
    else outros++;
  }));
  document.getElementById('cnt-provas').textContent = provas;
  document.getElementById('cnt-apres').textContent = apres;
  document.getElementById('cnt-trab').textContent = trab;
  document.getElementById('cnt-outros').textContent = outros;

  const total = DATA.reduce((s, d) => s + d.items.length, 0);
  const done = Object.values(saved).filter(Boolean).length;
  document.getElementById('subtitle').textContent =
    done === total
      ? '🎉 Tudo concluído! Arrasou!'
      : `${done} de ${total} atividades concluídas`;
}

function render() {
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '';

  DATA.forEach(day => {
    const days = getDaysUntil(day.date);
    const allDone = day.items.every(i => saved[i.id]);
    const doneCnt = day.items.filter(i => saved[i.id]).length;
    const [badgeClass, badgeText] = getBadge(days, allDone);

    const block = document.createElement('div');
    block.className = 'day-block';

    block.innerHTML = `
      <div class="day-header">
        <div>
          <span class="date">${day.label}</span>
          <span class="weekday">${day.weekday}</span>
        </div>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="progress-bar-wrap">
        <div class="progress-bar" style="width: ${day.items.length ? (doneCnt/day.items.length*100) : 0}%"></div>
      </div>
      <div class="items" id="items-${day.date}"></div>
    `;

    timeline.appendChild(block);

    const itemsEl = document.getElementById(`items-${day.date}`);
    day.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'item' + (saved[item.id] ? ' completed' : '');
      div.innerHTML = `
        <div class="checkbox"></div>
        <div class="item-content">
          <div class="item-text">${item.text}</div>
          ${item.sub ? `<div class="item-sub">${item.sub}</div>` : ''}
        </div>
        <span class="item-tag tag-${item.tag}">${TAG_LABELS[item.tag] || item.tag}</span>
      `;
      div.addEventListener('click', () => {
        saved[item.id] = !saved[item.id];
        save();
        render();
        updateStats();
      });
      itemsEl.appendChild(div);
    });
  });

  updateStats();
}

render();
