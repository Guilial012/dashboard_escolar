// ─────────────────────────────────────────────────────────────────
// data.js — Constantes, horários e tarefas do IC 9º Ano A
// ─────────────────────────────────────────────────────────────────

const MONTHS   = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                  'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MONTHS_S = ['jan','fev','mar','abr','mai','jun',
                  'jul','ago','set','out','nov','dez'];
const DAYS_PT  = ['D','S','T','Q','Q','S','S'];
const DSHORT   = ['','Seg','Ter','Qua','Qui','Sex'];
const DLONG    = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira',
                  'Quinta-feira','Sexta-feira','Sábado'];

const TLAB = {
  prova:        'Prova',
  apresentacao: 'Apresentação',
  entrega:      'Entrega',
  filme:        'Filme',
  outro:        'Outro',
};

const TCOL = {
  prova:        '#B3261E',
  apresentacao: '#1565C0',
  entrega:      '#7D5260',
  filme:        '#F57F17',
  outro:        '#2E7D32',
};

// Mapeamento de colorId do Google Calendar → cor hex
const GCAL_COLORS = {
  1:'#a78bfa', 2:'#6ee7b7', 3:'#c084fc', 4:'#f9a8d4', 5:'#fde68a',
  6:'#fb923c', 7:'#38bdf8', 8:'#9ca3af', 9:'#60a5fa', 10:'#34d399',
  11:'#f87171', default:'#60a5fa',
};

// Estilos de matéria (background + text color)
const SUB_STYLES = {
  'Matemática':   { bg: 'var(--sub-mat-bg)', tc: 'var(--sub-mat-tc)' },
  'Português':    { bg: 'var(--sub-por-bg)', tc: 'var(--sub-por-tc)' },
  'Geografia':    { bg: 'var(--sub-geo-bg)', tc: 'var(--sub-geo-tc)' },
  'Biologia':     { bg: 'var(--sub-bio-bg)', tc: 'var(--sub-bio-tc)' },
  'Física':       { bg: 'var(--sub-fis-bg)', tc: 'var(--sub-fis-tc)' },
  'História':     { bg: 'var(--sub-his-bg)', tc: 'var(--sub-his-tc)' },
  'Arte/Música':  { bg: 'var(--sub-art-bg)', tc: 'var(--sub-art-tc)' },
  'Ed. Física':   { bg: 'var(--sub-edf-bg)', tc: 'var(--sub-edf-tc)' },
  'Inglês':       { bg: 'var(--sub-ing-bg)', tc: 'var(--sub-ing-tc)' },
  'Química':      { bg: 'var(--sub-qui-bg)', tc: 'var(--sub-qui-tc)' },
  'Filosofia':    { bg: 'var(--sub-fil-bg)', tc: 'var(--sub-fil-tc)' },
  'S.O.E.':       { bg: 'var(--sub-soe-bg)', tc: 'var(--sub-soe-tc)' },
  'Art. Cênicas': { bg: 'var(--sub-cen-bg)', tc: 'var(--sub-cen-tc)' },
  'Intervalo':    { bg: 'var(--sub-int-bg)', tc: 'var(--sub-int-tc)' },
};

/** Retorna o estilo de uma matéria, com fallback. */
function subStyle(name) {
  return SUB_STYLES[name] || { bg: 'var(--sub-soe-bg)', tc: 'var(--sub-soe-tc)' };
}

// ── Horário semanal — IC 9º Ano A (turno vespertino 13:25–18:40)
// Fonte: https://sites.google.com/.../9%C2%BA-ano-a
const SCH = {
  1: [ // Segunda
    { s:'13:25', e:'14:15', sub:'S.O.E.' },
    { s:'14:15', e:'15:00', sub:'Matemática' },
    { s:'15:00', e:'15:45', sub:'Matemática' },
    { s:'15:45', e:'16:25', sub:'Intervalo', brk: true },
    { s:'16:25', e:'17:10', sub:'Biologia' },
    { s:'17:10', e:'17:55', sub:'Português' },
    { s:'17:55', e:'18:40', sub:'Português' },
  ],
  2: [ // Terça
    { s:'13:25', e:'14:15', sub:'Português' },
    { s:'14:15', e:'15:00', sub:'Geografia' },
    { s:'15:00', e:'15:45', sub:'Geografia' },
    { s:'15:45', e:'16:25', sub:'Intervalo', brk: true },
    { s:'16:25', e:'17:10', sub:'Ed. Física' },
    { s:'17:10', e:'17:55', sub:'Física' },
    { s:'17:55', e:'18:40', sub:'Física' },
  ],
  3: [ // Quarta
    { s:'13:25', e:'14:15', sub:'Arte/Música' },
    { s:'14:15', e:'15:00', sub:'Arte/Música' },
    { s:'15:00', e:'15:45', sub:'História' },
    { s:'15:45', e:'16:25', sub:'Intervalo', brk: true },
    { s:'16:25', e:'17:10', sub:'História' },
    { s:'17:10', e:'17:55', sub:'Português' },
    { s:'17:55', e:'18:40', sub:'Português' },
  ],
  4: [ // Quinta
    { s:'13:25', e:'14:15', sub:'Ed. Física' },
    { s:'14:15', e:'15:00', sub:'Inglês' },
    { s:'15:00', e:'15:45', sub:'Filosofia' },
    { s:'15:45', e:'16:25', sub:'Intervalo', brk: true },
    { s:'16:25', e:'17:10', sub:'Matemática' },
    { s:'17:10', e:'17:55', sub:'Matemática' },
    { s:'17:55', e:'18:40', sub:'História' },
  ],
  5: [ // Sexta
    { s:'13:25', e:'14:15', sub:'Art. Cênicas' },
    { s:'14:15', e:'15:00', sub:'Art. Cênicas' },
    { s:'15:00', e:'15:45', sub:'Química' },
    { s:'15:45', e:'16:25', sub:'Intervalo', brk: true },
    { s:'16:25', e:'17:10', sub:'Química' },
    { s:'17:10', e:'17:55', sub:'Matemática' },
    { s:'17:55', e:'18:40', sub:'Matemática' },
  ],
};

// ── Tarefas iniciais (junho 2026)
const PRESET = [
  { id:'p1',  date:'2026-06-08', title:'Prova de Português',                  sub:'Memórias Póstumas de Brás Cubas',    tag:'prova'        },
  { id:'p2',  date:'2026-06-08', title:'Prova de Matemática',                 sub:'Cap. 4 — Explorando as Funções',      tag:'prova'        },
  { id:'p3',  date:'2026-06-09', title:'Apresentação — Seminário Tipos de Amor', sub:'Português',                       tag:'apresentacao' },
  { id:'p4',  date:'2026-06-09', title:'Prova de Geografia',                  sub:'',                                    tag:'prova'        },
  { id:'p5',  date:'2026-06-10', title:'Prova de Reflexão Linguística',       sub:'Orações Subordinadas Adverbiais',     tag:'prova'        },
  { id:'p6',  date:'2026-06-10', title:'Continuação — Prova de História',     sub:'Revolução Russa',                     tag:'prova'        },
  { id:'p7',  date:'2026-06-12', title:'Prova de Química',                    sub:'',                                    tag:'prova'        },
  { id:'p8',  date:'2026-06-12', title:'Entrega de Crônicas',                 sub:'Português',                           tag:'entrega'      },
  { id:'p9',  date:'2026-06-15', title:'Prova de Biologia',                   sub:'',                                    tag:'prova'        },
  { id:'p10', date:'2026-06-15', title:'Apresentação — Seminário Tipos de Amor', sub:'Português (2ª parte)',             tag:'apresentacao' },
  { id:'p11', date:'2026-06-16', title:'Filme da Unidade: Filadélfia',        sub:'Português — parte 1',                 tag:'filme'        },
  { id:'p12', date:'2026-06-17', title:'Filme da Unidade: Filadélfia',        sub:'Português — parte 2',                 tag:'filme'        },
  { id:'p13', date:'2026-06-18', title:'Test 2 — Red Balloon',                sub:'Inglês',                              tag:'prova'        },
];
