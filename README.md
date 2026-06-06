# 📚 Dashboard Escolar — Instituto Capibaribe

Dashboard pessoal para organizar provas, tarefas e o horário semanal do **9º Ano A** do Instituto Capibaribe (Recife, PE). Desenvolvido iterativamente com foco em praticidade e design moderno.

---

## ✨ Funcionalidades

- **Calendário dinâmico** com marcadores visuais de tarefas e eventos
- **Lista de tarefas** com filtros por tipo (prova, apresentação, entrega, outros)
- **Sincronização com Google Calendar** — leitura e criação de eventos
- **Cache no servidor** (10 min de TTL) para carregamento rápido
- **Aba Horário** — grade semanal do IC 9º Ano A com anotações por aula
- **Notas por aula** salvas automaticamente no navegador
- **Material Design 3** — paleta, tipografia e componentes do Google
- **Back-end Node.js** com OAuth2 seguro para o Google Calendar

---

## 🗂️ Histórico de versões

| Versão | Descrição |
|--------|-----------|
| [`v1/`](v1/) | Timeline estática com checkboxes e localStorage |
| [`v2/`](v2/) | Calendário dinâmico + integração Google Calendar |
| [`v3/`](v3/) | Aba Horário com grade semanal e notas por aula |
| [`v4/`](v4/) | Redesign Material Design 3 + cache em memória |
| [`v5/`](v5/) | Código desmembrado (HTML/CSS/JS) + back-end Node.js |

---

## 🚀 Como rodar (v5)

### Pré-requisitos
- [Node.js](https://nodejs.org) v18 ou superior
- Conta Google com acesso ao Calendar

### 1. Instalar dependências

```bash
cd v5
npm install
```

### 2. Configurar credenciais do Google

1. Acesse o [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto e ative a **Google Calendar API**
3. Em *Credentials*, crie um **OAuth 2.0 Client ID** do tipo *Web Application*
4. Adicione `http://localhost:3000/auth/callback` como URI de redirecionamento
5. Copie `.env.example` para `.env` e preencha com seu Client ID e Secret

```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

### 3. Autorizar o Google Calendar

```bash
node server/server.js
```

Abra [http://localhost:3000/auth/login](http://localhost:3000/auth/login), autorize e copie o `GOOGLE_REFRESH_TOKEN` gerado para o `.env`.

### 4. Rodar o servidor

```bash
npm start
# Acesse http://localhost:3000
```

---

## 📁 Estrutura do projeto (v5)

```
v5/
├── index.html              # Estrutura HTML
├── css/
│   └── style.css           # Material Design 3
├── js/
│   ├── data.js             # Horários, tarefas e constantes
│   └── app.js              # Lógica do front-end
└── server/
    ├── server.js           # Express + rotas /api e /auth
    └── services/
        ├── gcal.js         # Google Calendar API (OAuth2)
        └── cache.js        # Cache em memória com TTL
```

---

## 🛠️ Tecnologias

**Front-end:** HTML5 · CSS3 · JavaScript vanilla · Material Design 3  
**Back-end:** Node.js · Express · googleapis  
**Autenticação:** Google OAuth 2.0

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).
