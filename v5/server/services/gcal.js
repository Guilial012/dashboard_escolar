// ─────────────────────────────────────────────────────────────────
// gcal.js — Serviço de Google Calendar (googleapis + OAuth2)
// ─────────────────────────────────────────────────────────────────
require('dotenv').config();
const { google } = require('googleapis');

// ── Cliente OAuth2 ────────────────────────────────────────────────
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI || 'http://localhost:3000/auth/callback'
);

// Carrega o refresh_token salvo (obtido na primeira autorização)
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
}

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// ── Mapeamento de colorId → hex ────────────────────────────────────
const COLOR_MAP = {
  '1': '#a78bfa', '2': '#6ee7b7', '3':  '#c084fc', '4':  '#f9a8d4',
  '5': '#fde68a', '6': '#fb923c', '7':  '#38bdf8',  '8':  '#9ca3af',
  '9': '#60a5fa', '10':'#34d399', '11': '#f87171',
};
const colorHex = id => COLOR_MAP[id] || '#60a5fa';

// ── Funções públicas ───────────────────────────────────────────────

/**
 * Lista eventos de um mês inteiro.
 * @param {number} year   - ex: 2026
 * @param {number} month  - 1-based, ex: 6 para junho
 */
async function listEvents(year, month) {
  const timeMin = new Date(year, month - 1, 1).toISOString();
  const timeMax = new Date(year, month,     1).toISOString(); // 1º dia do mês seguinte

  const res = await calendar.events.list({
    calendarId:   'primary',
    timeMin,
    timeMax,
    maxResults:   200,
    singleEvents: true,
    orderBy:      'startTime',
  });

  return (res.data.items || []).map(e => ({
    id:    e.id,
    date:  (e.start.dateTime || e.start.date || '').substring(0, 10),
    title: e.summary || '(sem título)',
    time:  e.start.dateTime
      ? new Date(e.start.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '',
    color: colorHex(e.colorId),
  }));
}

/**
 * Cria um evento no calendário primário.
 */
async function createEvent({ summary, startTime, endTime, description, timeZone = 'America/Recife' }) {
  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary,
      description,
      start: { dateTime: startTime, timeZone },
      end:   { dateTime: endTime,   timeZone },
    },
  });
  return res.data;
}

/**
 * Gera a URL para iniciar o fluxo OAuth2 (primeira configuração).
 */
function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt:      'consent',  // garante que retorna refresh_token
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
}

/**
 * Troca o código de autorização por tokens.
 * Retorna o refresh_token (salve-o no .env).
 */
async function handleCallback(code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  return tokens.refresh_token; // pode ser null se já autorizado antes
}

module.exports = { listEvents, createEvent, getAuthUrl, handleCallback };
