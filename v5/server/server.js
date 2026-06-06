// ─────────────────────────────────────────────────────────────────
// server.js — Servidor Express do Dashboard Escolar
//
// Rotas:
//   GET  /auth/login          → inicia OAuth2 Google
//   GET  /auth/callback       → recebe código, exibe refresh_token
//   GET  /api/events          → lista eventos do mês (com cache)
//   POST /api/events          → cria um evento
//
// Uso:
//   npm install
//   node server.js
// ─────────────────────────────────────────────────────────────────
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const gcal    = require('./services/gcal');
const cache   = require('./services/cache');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve o front-end (pasta raiz do projeto)
app.use(express.static(path.join(__dirname, '..')));

// ── Auth ──────────────────────────────────────────────────────────
// Passo 1: acesse /auth/login para autorizar o Google Calendar
app.get('/auth/login', (req, res) => {
  res.redirect(gcal.getAuthUrl());
});

// Passo 2: Google redireciona aqui após o usuário aceitar
app.get('/auth/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.status(400).send(`Erro: ${error}`);

  try {
    const refreshToken = await gcal.handleCallback(code);
    if (refreshToken) {
      res.send(`
        <!DOCTYPE html><html><head><meta charset="UTF-8">
        <title>Autorizado ✅</title>
        <style>body{font-family:system-ui;max-width:600px;margin:40px auto;padding:0 20px}
        pre{background:#f5f5f5;padding:16px;border-radius:8px;overflow-x:auto}</style></head><body>
        <h2>✅ Google Calendar autorizado!</h2>
        <p>Adicione esta linha ao seu arquivo <code>.env</code>:</p>
        <pre>GOOGLE_REFRESH_TOKEN=${refreshToken}</pre>
        <p>Depois reinicie o servidor com <code>node server.js</code>.</p>
        </body></html>`);
    } else {
      res.send('<h2>✅ Já autorizado! Reinicie o servidor se necessário.</h2>');
    }
  } catch (err) {
    console.error('[auth/callback]', err.message);
    res.status(500).send('Erro durante a autorização: ' + err.message);
  }
});

// ── GET /api/events ───────────────────────────────────────────────
// Query params:
//   year    (default: ano atual)
//   month   (default: mês atual, 1-based)
//   refresh (default: false) — ignora o cache e força nova busca
app.get('/api/events', async (req, res) => {
  const year    = parseInt(req.query.year)  || new Date().getFullYear();
  const month   = parseInt(req.query.month) || new Date().getMonth() + 1;
  const force   = req.query.refresh === 'true';
  const cacheKey = `${year}-${String(month).padStart(2, '0')}`;

  // Tenta cache primeiro
  if (!force) {
    const hit = cache.get(cacheKey);
    if (hit) {
      return res.json({
        events: hit.data,
        cached: true,
        ts:     hit.ts,
        count:  hit.data.length,
      });
    }
  }

  // Busca na API do Google
  try {
    const events = await gcal.listEvents(year, month);
    cache.set(cacheKey, events);
    const stored = cache.get(cacheKey);
    res.json({
      events,
      cached: false,
      ts:     stored.ts,
      count:  events.length,
    });
  } catch (err) {
    console.error('[GET /api/events]', err.message);

    // Verifica se falta configuração
    if (!process.env.GOOGLE_REFRESH_TOKEN) {
      return res.status(503).json({
        error:  'Google Calendar não configurado',
        detail: 'Acesse /auth/login para autorizar.',
      });
    }
    res.status(500).json({ error: 'Erro ao buscar eventos', detail: err.message });
  }
});

// ── POST /api/events ──────────────────────────────────────────────
// Body: { summary, startTime, endTime, description, timeZone }
app.post('/api/events', async (req, res) => {
  const { summary, startTime, endTime, description, timeZone } = req.body;
  if (!summary || !startTime || !endTime) {
    return res.status(400).json({ error: 'summary, startTime e endTime são obrigatórios' });
  }

  try {
    const event = await gcal.createEvent({ summary, startTime, endTime, description, timeZone });

    // Invalida o cache do mês do evento criado
    const d = new Date(startTime);
    const cacheKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    cache.del(cacheKey);

    res.status(201).json(event);
  } catch (err) {
    console.error('[POST /api/events]', err.message);
    res.status(500).json({ error: 'Erro ao criar evento', detail: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Dashboard rodando em http://localhost:${PORT}`);
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    console.warn('⚠  GOOGLE_REFRESH_TOKEN não encontrado no .env');
    console.warn(`   Acesse http://localhost:${PORT}/auth/login para autorizar.\n`);
  } else {
    console.log('✅ Google Calendar configurado.\n');
  }
});
