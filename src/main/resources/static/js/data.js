/**
 * data.js — localStorage data layer for StudioGest
 * All data is stored client-side only; nothing is ever transmitted over the network.
 */

const DB = {
    KEY: 'gest_data',

    load() {
        try { return JSON.parse(localStorage.getItem(this.KEY) || '{}'); }
        catch { return {}; }
    },

    save(data) {
        localStorage.setItem(this.KEY, JSON.stringify(data));
    },

    getAll(entity) {
        return this.load()[entity] || [];
    },

    getById(entity, id) {
        return this.getAll(entity).find(x => x.id === id) || null;
    },

    getByCliente(entity, clienteId) {
        return this.getAll(entity).filter(x => x.clienteId === clienteId);
    },

    create(entity, obj) {
        const data = this.load();
        if (!data[entity]) data[entity] = [];
        const item = { ...obj, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) };
        data[entity].push(item);
        this.save(data);
        return item;
    },

    update(entity, id, patch) {
        const data = this.load();
        const idx = (data[entity] || []).findIndex(x => x.id === id);
        if (idx === -1) return null;
        data[entity][idx] = { ...data[entity][idx], ...patch };
        this.save(data);
        return data[entity][idx];
    },

    delete(entity, id) {
        const data = this.load();
        data[entity] = (data[entity] || []).filter(x => x.id !== id);
        this.save(data);
    },

    count(entity) {
        return this.getAll(entity).length;
    }
};

/* ── Studio profile helpers ───────────────────────── */
const GENERICO_KEY = 'gest_generico';
const PROFILO_DEFAULT = {
    titolo:          'Prof.',
    nome:            'Giovanni',
    cognome:         'Esposito',
    qualifica:       'Maestro di pilates',
    specializzazione:'Nulla',
    competenze:      'specialista di pilates',
    telefono:        '000 0000000',
    indirizzo:       'Via Emilia 1, 00100 Roma',
    sitoWeb:         ''
};

const Profilo = {
    get() {
        try { return { ...PROFILO_DEFAULT, ...JSON.parse(localStorage.getItem(GENERICO_KEY) || '{}') }; }
        catch { return { ...PROFILO_DEFAULT }; }
    },
    save(data) {
        localStorage.setItem(GENERICO_KEY, JSON.stringify({ ...this.get(), ...data }));
    },
    /** Returns short display name (title + surname) */
    displayName() {
        const m = this.get();
        return `${m.titolo} ${m.cognome}`.trim();
    },
    /** Returns initials from nome + cognome */
    initials() {
        const m = this.get();
        const parts = `${m.nome} ${m.cognome}`.trim().split(/\s+/);
        return parts.map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('');
    }
};

/* ── Auth helpers ─────────────────────────────────── */
const Auth = {
    login(nome, cognome) {
        sessionStorage.setItem('gest_user', JSON.stringify({ nome, cognome }));
    },
    logout() {
        sessionStorage.removeItem('gest_user');
        window.location.href = 'login.html';
    },
    getUser() {
        try { return JSON.parse(sessionStorage.getItem('gest_user')); }
        catch { return null; }
    },
    requireLogin() {
        if (!this.getUser()) window.location.href = 'login.html';
    }
};

/* ── expiry helpers ──────────────────────────── */
function getResourceStatus(dataScadenza) {
    if (!dataScadenza) return 'ok';
    const exp = new Date(dataScadenza);
    const now = new Date();
    const diff = (exp - now) / (1000 * 60 * 60 * 24);
    if (diff < 0)  return 'scaduto';
    if (diff <= 30) return 'in-scadenza';
    return 'ok';
}

function getResStatusBadge(dataScadenza) {
    const s = getResourceStatus(dataScadenza);
    if (s === 'scaduto')    return '<span class="badge badge-danger">Scaduto</span>';
    if (s === 'in-scadenza') return '<span class="badge badge-warning">In scadenza</span>';
    return '<span class="badge badge-success">OK</span>';
}

/* ── Vocabulary / Label presets ───────────────────── */
const VOCAB_PRESETS = {
    generico: {
        _label: 'Generico',
        appNome: 'StudioGest',
        clienti: 'Clienti', cliente: 'Cliente',
        sessioni: 'Appuntamenti', sessione: 'Appuntamento',
        risorse: 'Risorse', risorsa: 'Risorsa',
        richiestaDocumenti: 'Documenti',
        schedaCliente: 'Scheda Cliente',
        nuovoCliente: 'Nuovo Cliente',
        nuovoRisorsa: 'Nuova Risorsa',
        nuovaSessione: 'Nuovo Appuntamento',
        nome_cliente: 'Note cliente',
        tab_sessioni: 'Appuntamenti',
        tab_servizi: 'Servizi',
        tab_note_cliente: 'Note cliente',
        tab_analisi: 'Analisi',
        tab_doc_tecnici: 'Doc. tecnici',
        tab_richieste: 'Richieste',
        tab_in_corso: 'In corso',
        tab_consenso: 'Consenso',
        tipo_t1: 'Tipo A',
        tipo_t2: 'Tipo B',
        tipo_t3: 'Tipo C',
        tipo_t4: 'Tipo D',
        tipo_t5: 'Tipo E',
    },
    fisioterapia: {
        _label: 'Fisioterapia',
        appNome: 'StudioGest',
        clienti: 'Clienti', cliente: 'Cliente',
        sessioni: 'Sessioni', sessione: 'Sessione',
        risorse: 'Attrezzature', risorsa: 'Attrezzatura',
        richiestaDocumenti: 'Certificati',
        schedaCliente: 'Scheda Cliente',
        nuovoCliente: 'Nuovo Cliente',
        nuovoRisorsa: 'Nuova Attrezzatura',
        nuovaSessione: 'Nuova Sessione',
        nome_cliente: 'Note',
        tab_sessioni: 'Sedute',
        tab_servizi: 'Trattamenti',
        tab_note_cliente: 'Note Cliente',
        tab_analisi: 'Analisi',
        tab_doc_tecnici: 'Referti',
        tab_richieste: 'Certificati',
        tab_in_corso: 'In trattamento',
        tab_consenso: 'Consenso',
        tipo_t1: 'Massoterapia',
        tipo_t2: 'Tecar',
        tipo_t3: 'Laser',
        tipo_t4: 'Ultrasuoni',
        tipo_t5: 'Esercizio terapeutico',
    },
    psicologia: {
        _label: 'Psicologia',
        appNome: 'StudioGest',
        clienti: 'Clienti', cliente: 'Cliente',
        sessioni: 'Sessioni', sessione: 'Sessione',
        risorse: 'Materiali', risorsa: 'Materiale',
        richiestaDocumenti: 'Documenti',
        schedaCliente: 'Scheda Cliente',
        nuovoCliente: 'Nuovo Cliente',
        nuovoRisorsa: 'Nuovo Materiale',
        nuovaSessione: 'Nuova Sessione',
        nome_cliente: 'Note iniziali',
        tab_sessioni: 'Sedute',
        tab_servizi: 'Servizi',
        tab_note_cliente: 'Note cliente',
        tab_analisi: 'Test',
        tab_doc_tecnici: 'Valutazioni',
        tab_richieste: 'Documenti',
        tab_in_corso: 'Percorso attuale',
        tab_consenso: 'Consenso',
        tipo_t1: 'Individuale',
        tipo_t2: 'Coppia',
        tipo_t3: 'Famiglia',
        tipo_t4: 'Valutazione',
        tipo_t5: 'Sostegno',
    },
    legale: {
        _label: 'Studio Legale',
        appNome: 'StudioGest',
        clienti: 'Clienti', cliente: 'Cliente',
        sessioni: 'Udienze', sessione: 'Udienza',
        risorse: 'Documenti', risorsa: 'Documento',
        richiestaDocumenti: 'Atti',
        schedaCliente: 'Scheda Cliente',
        nuovoCliente: 'Nuovo Cliente',
        nuovoRisorsa: 'Nuovo Documento',
        nuovaSessione: 'Nuova Udienza',
        nome_cliente: 'Note caso',
        tab_sessioni: 'Udienze',
        tab_servizi: 'Atti',
        tab_note_cliente: 'Note caso',
        tab_analisi: 'Perizie',
        tab_doc_tecnici: 'Documenti',
        tab_richieste: 'Richieste',
        tab_in_corso: 'Pratiche aperte',
        tab_consenso: 'Mandato',
        tipo_t1: 'Consulenza',
        tipo_t2: 'Udienza',
        tipo_t3: 'Redazione atti',
        tipo_t4: 'Arbitrato',
        tipo_t5: 'Mediazione',
    },
};

const Vocab = {
    KEY: 'gest_vocab',
    get() {
        try {
            const saved = JSON.parse(localStorage.getItem(this.KEY) || 'null');
            return saved ? { ...VOCAB_PRESETS.generico, ...saved } : { ...VOCAB_PRESETS.generico };
        } catch { return { ...VOCAB_PRESETS.generico }; }
    },
    save(data) { localStorage.setItem(this.KEY, JSON.stringify(data)); },
    applyPreset(key) {
        if (VOCAB_PRESETS[key]) this.save({ ...VOCAB_PRESETS[key], _preset: key });
    },
    currentPreset() {
        try {
            const s = JSON.parse(localStorage.getItem(this.KEY) || 'null');
            return s?._preset || 'generico';
        } catch { return 'generico'; }
    }
};


const SESSION_TYPES = {
    t1: { label: 'Tipo A', cssClass: 'sessione-t1', badge: 'badge-t1' },
    t2: { label: 'Tipo B', cssClass: 'sessione-t2', badge: 'badge-t2' },
    t3: { label: 'Tipo C', cssClass: 'sessione-t3', badge: 'badge-t3' },
    t4: { label: 'Tipo D', cssClass: 'sessione-t4', badge: 'badge-t4' },
    t5: { label: 'Tipo E', cssClass: 'sessione-t5', badge: 'badge-t5' },
};

function getSessioneLabel(tipo) {
    if (typeof Vocab !== 'undefined') {
        const lbl = Vocab.get()['tipo_' + tipo];
        if (lbl) return lbl;
    }
    return SESSION_TYPES[tipo]?.label || tipo || '—';
}

function sessionTypeBadge(tipo) {
    const t = SESSION_TYPES[tipo];
    if (!t) return `<span class="badge badge-muted">${tipo || '—'}</span>`;
    return `<span class="badge ${t.badge}">${getSessioneLabel(tipo)}</span>`;
}

/* ── CSV export ───────────────────────────────────── */
function exportToCSV(data, filename) {
    if (!data || !data.length) { showToast('Nessun dato da esportare', 'warning'); return; }
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(','));
    const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 500);
}

/* ── Print helper ─────────────────────────────────── */
function printElement(el) {
    if (!el) return;
    const win = window.open('', '_blank', 'width=800,height=700');
    win.document.write(`<!DOCTYPE html><html lang="it"><head><meta charset="UTF-8">
        <title>Stampa — gest</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: 'Inter', Arial, sans-serif; font-size: 12pt; padding: 20mm; color: #1E293B; }
            table { width: 100%; border-collapse: collapse; margin: 12px 0; }
            th, td { border: 1px solid #CBD5E1; padding: 7px 10px; text-align: left; }
            th { background: #F1F5F9; font-weight: 600; font-size: 10pt; }
            h1 { font-size: 18pt; margin-bottom: 8px; }
            h2 { font-size: 14pt; margin: 16px 0 8px; }
            .teal { color: #0F766E; }
            .meta { color: #64748B; font-size: 10pt; margin-bottom: 6px; }
            .section { margin-bottom: 20px; }
            .divider { border-top: 2px solid #0F766E; margin: 12px 0; }
            @page { margin: 15mm; }
        </style>
    </head><body>${el.innerHTML}</body></html>`);
    win.document.close();
    win.onload = () => { win.print(); setTimeout(() => win.close(), 500); };
}

/* ── Seed demo data if empty ─────────────────────── */
(function seedDemo() {
    if (DB.count('clienti') > 0) return;
    const p1 = DB.create('clienti', { nome: 'Mario', cognome: 'Rossi', cf: 'RSSMRA80A01H501X', dataNascita: '1980-01-01', comuneNascita: 'Roma', telefono: '333 1234567', residenza: 'Via Roma 1, Roma', note: '' });
    const p2 = DB.create('clienti', { nome: 'Giulia', cognome: 'Bianchi', cf: 'BNCGLI85B41F205Z', dataNascita: '1985-02-01', comuneNascita: 'Milano', telefono: '347 9876543', residenza: 'Via Milano 5, Milano', note: '' });
    DB.create('sessioni', { clienteId: p1.id, tipo: 't1', data: new Date().toISOString().slice(0,10), risorse: '', descrizione: 'Prima sessione dimostrativa', nota: '', numero: 1 });
    DB.create('sessioni', { clienteId: p2.id, tipo: 't4', data: new Date().toISOString().slice(0,10), risorse: '', descrizione: 'Sessione dimostrativa', nota: '', numero: 1 });
    DB.create('risorse', { nome: 'Risorsa Alpha', dataScadenza: '2025-03-01', descrizione: 'Risorsa di esempio (scaduta)', quantita: '10 unità' });
    DB.create('risorse', { nome: 'Risorsa Beta', dataScadenza: '2027-12-31', descrizione: 'Risorsa di esempio (valida)', quantita: '5 unità' });
    DB.create('risorse', { nome: 'Risorsa Gamma', dataScadenza: new Date(Date.now() + 15*24*3600*1000).toISOString().slice(0,10), descrizione: 'Risorsa di esempio (in scadenza)', quantita: '3 unità' });
})();
