// ─────────────────────────────────────────────────────────────────
// cache.js — Cache em memória com TTL
// ─────────────────────────────────────────────────────────────────

const TTL   = 10 * 60 * 1000; // 10 minutos em ms
const store = new Map();

/**
 * Busca um item no cache.
 * Retorna { data, ts } se válido, ou null se expirado/ausente.
 */
function get(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() - hit.ts > TTL) {
    store.delete(key);
    return null;
  }
  return hit;
}

/**
 * Armazena um item no cache.
 */
function set(key, data) {
  store.set(key, { data, ts: Date.now() });
}

/**
 * Remove um item do cache (ex: após criar um evento).
 */
function del(key) {
  store.delete(key);
}

/**
 * Limpa todo o cache.
 */
function clear() {
  store.clear();
}

/** Retorna a idade de um item em ms, ou null se não existir. */
function age(key) {
  const hit = store.get(key);
  return hit ? Date.now() - hit.ts : null;
}

module.exports = { get, set, del, clear, age, TTL };
