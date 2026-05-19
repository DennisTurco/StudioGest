/**
 * app.js — gest shared UI logic
 */

/* ══════════ VOCABULARY LABELS ══════════════════════ */
function applyVocab() {
    if (typeof Vocab === 'undefined') return;
    const v = Vocab.get();

    // App name in sidebar logos
    document.querySelectorAll('.sidebar-logo').forEach(el => {
        [...el.childNodes]
            .filter(n => n.nodeType === 3 && n.textContent.trim())
            .forEach(n => { n.textContent = n.textContent.replace(/\S[\s\S]*$/, v.appNome); });
    });

    // Nav item text labels
    const NAV_MAP = {
        clienti:       v.clienti,
        sessioni:      v.sessioni,
        risorse:       v.risorse,
        'richiesta-documenti': v.richiestaDocumenti,
    };
    document.querySelectorAll('.nav-item[data-page]').forEach(el => {
        const key = el.dataset.page;
        if (NAV_MAP[key]) {
            [...el.childNodes]
                .filter(n => n.nodeType === 3 && n.textContent.trim())
                .forEach(n => { n.textContent = ' ' + NAV_MAP[key]; });
        }
    });

    // Any element with data-vocab attribute
    document.querySelectorAll('[data-vocab]').forEach(el => {
        const key = el.dataset.vocab;
        if (v[key] !== undefined) el.textContent = v[key];
    });

    // Page <title>
    if (document.title) document.title = document.title.replace(/^[^—]+/, v.appNome + ' ');

    // Apply vocab labels to session type select options
    document.querySelectorAll('option[data-tipo]').forEach(opt => {
        const key = 'tipo_' + opt.dataset.tipo;
        if (v[key]) opt.textContent = v[key];
    });
}

/* ══════════ NAVIGATION ═════════════════════════════ */
const ROUTES = {
    dashboard:       'index.html',
    clienti:        'clienti.html',
    sessioni:          'sessioni.html',
    risorse:         'risorse.html',
    'richiesta-documenti': 'documenti.html',
    impostazioni:    'impostazioni.html',
    login:           'login.html',
};

function navigateTo(page) {
    const file = ROUTES[page];
    if (file) window.location.href = file;
}

function initSidebarActiveState() {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item[data-page]').forEach(el => {
        const page = el.dataset.page;
        const file = ROUTES[page];
        if (file === currentFile) el.classList.add('active');
        el.addEventListener('click', () => {
            if (page === 'logout') { Auth.logout(); return; }
            navigateTo(page);
        });
    });

    // Update sidebar footer with studio profile
    if (typeof Profilo !== 'undefined') {
        const m = Profilo.get();
        const nameEl  = document.getElementById('sidebar-user-name');
        const avEl    = document.getElementById('sidebar-user-avatar');
        const roleEl  = document.getElementById('sidebar-user-role');
        if (nameEl) nameEl.textContent = `${m.titolo} ${m.cognome}`;
        if (avEl)   avEl.textContent   = Profilo.initials();
        if (roleEl) roleEl.textContent = m.qualifica;
    }
}

/* ══════════ MODAL ══════════════════════════════════ */
function openModal(overlayId) {
    const el = document.getElementById(overlayId);
    if (el) el.classList.add('open');
}
function closeModal(overlayId) {
    const el = document.getElementById(overlayId);
    if (el) el.classList.remove('open');
}
function initModalCloseHandlers() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });
    });
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.modalClose));
    });
    document.querySelectorAll('[data-modal-open]').forEach(btn => {
        btn.addEventListener('click', () => openModal(btn.dataset.modalOpen));
    });
}

/* ══════════ DOM UTILITIES ══════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
function setHTML(el, html) { if (el) el.innerHTML = html; }
function showLoading(el) { setHTML(el, `<div class="text-center" style="padding:32px"><div class="spinner"></div></div>`); }
function showEmptyState(el, msg = 'Nessun elemento', actionLabel = '', actionCallback = '') {
    const action = actionLabel ? `<button class="btn btn-primary btn-sm" onclick="${actionCallback}">${actionLabel}</button>` : '';
    setHTML(el, `<div class="empty-state"><div class="empty-icon"><i class="fa-solid fa-clipboard-list"></i></div><h3>${msg}</h3><p>Nessun elemento da mostrare.</p>${action}</div>`);
}
function filterItems(items, query, fields) {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(item => fields.some(f => String(item[f] ?? '').toLowerCase().includes(q)));
}

/* ══════════ TABS ═══════════════════════════════════ */
function initTabs(containerSel = '.tabs') {
    document.querySelectorAll(containerSel + ' .tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const panel = btn.dataset.tab;
            const parent = btn.closest('[data-tabs-scope]') || document;
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.tab-panel').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const panelEl = parent.querySelector(`#tab-${panel}`) || document.getElementById(`tab-${panel}`);
            if (panelEl) panelEl.classList.add('active');
        });
    });
}

/* ══════════ COMMON INIT ════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    // Auth guard: skip on login page
    const isLoginPage = window.location.pathname.endsWith('login.html');
    if (!isLoginPage && typeof Auth !== 'undefined') Auth.requireLogin();

    initSidebarActiveState();
    applyVocab();
    initModalCloseHandlers();
    initTabs();
});
