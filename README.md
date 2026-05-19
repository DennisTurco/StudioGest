# 🏢 StudioGest — Gestionale per Studi Professionali

> **⚠️ DISCLAIMER — LEGGERE PRIMA DI USARE ⚠️**
> Vedere la sezione [Disclaimer e Limitazioni Legali](#️-disclaimer-e-limitazioni-legali) più in basso.

Applicazione desktop per la **gestione organizzativa di uno studio professionale**: anagrafica clienti, sessioni/appuntamenti, risorse/inventario, documenti e reportistica.
Realizzata con **Java 21 + Spring Boot 3 + JavaFX** — gira interamente in locale, senza connessione internet o cloud.

---

## ⚠️ Disclaimer e Limitazioni Legali

### 🇮🇹 Italiano

**QUESTO SOFTWARE È UN PROGETTO PERSONALE A SCOPO EDUCATIVO/DIMOSTRATIVO.**

- Questo software è destinato **esclusivamente a uso personale e non commerciale**.
- **Non è certificato, validato o approvato** da alcun ente regolatorio.
- **Non è conforme** alle normative GDPR per il trattamento professionale/commerciale di dati personali di terzi.
- **Non sostituisce** software professionale certificato per la gestione di studi professionali.
- L'autore **non si assume alcuna responsabilità** per danni diretti o indiretti derivanti dall'uso di questo software.
- **Non è destinato alla vendita** né alla distribuzione come prodotto commerciale.
- Chiunque utilizzi questo software lo fa **a proprio rischio**, assumendosi piena responsabilità del trattamento dei dati.

**Se hai necessità professionali/commerciali**: utilizza software certificato e conforme alle normative vigenti del tuo settore.

---

### 🇬🇧 English

**THIS SOFTWARE IS A PERSONAL PROJECT FOR EDUCATIONAL/DEMONSTRATIONAL PURPOSES ONLY.**

- This software is intended **exclusively for personal, non-commercial use**.
- It is **not certified, approved, or validated** by any regulatory body.
- It is **not GDPR-compliant** for professional or commercial processing of third-party personal data.
- It does **not replace** certified professional studio management software.
- The author accepts **no liability** for any direct or indirect damage resulting from the use of this software.
- This software is **not for sale** and is not intended for commercial distribution.
- Anyone using this software does so **entirely at their own risk**.

**If you have professional/commercial needs**: use certified software compliant with applicable regulations in your sector.

---

## Stack Tecnologico

| Livello | Tecnologia |
|---------|------------|
| Finestra desktop | JavaFX 21 + WebView |
| Server embedded | Spring Boot 3.2.5 (Tomcat) |
| REST API | Spring MVC (`@RestController`) |
| Database | SQLite 3 (file `database.db`) + localStorage (dati operativi) |
| ORM | Hibernate / Spring Data JPA |
| Frontend | HTML5 + CSS3 (custom, no framework) + Vanilla JS |
| Build | Maven |

> **Nota architetturale**: i dati anagrafici di base usano SQLite via API REST; i dati operativi (sessioni, risorse, documenti, ecc.) sono salvati nel `localStorage` del browser embedded. Nessun dato viene mai trasmesso in rete.

---

## Funzionalità

- **Dashboard** — KPI in tempo reale (clienti totali, sessioni, risorse in scadenza)
- **Clienti** — anagrafica completa con ricerca, CRUD, export CSV/PDF
- **Scheda Cliente** — 8 schede configurabili: sessioni, servizi, note, analisi, doc. tecnici, richieste, pratiche in corso, consenso/mandato
- **Sessioni** — registro colorato per tipo (5 tipi configurabili), export CSV
- **Risorse** — inventario con alert scadenza (righe colorate per elementi scaduti/in scadenza)
- **Documenti** — foglio A4 con intestazione studio configurabile, export PDF
- **Impostazioni** — profilo professionale configurabile, preset vocabolario (fisioterapia / psicologia / legale / generico), backup/ripristino dati, export
- **Login/Registrazione** — accesso protetto da credenziali locali

---

## Avvio Rapido

```bash
# Avvia l'app desktop completa (con finestra)
mvn clean javafx:run

# Solo il server web (senza finestra, utile per debug)
mvn spring-boot:run
# poi aprire http://localhost:8080 nel browser
```

### Porta già in uso (`Port 8080 was already in use`)
```bash
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

## Configurazione Profilo Studio

Al primo avvio, andare su **Impostazioni → Profilo** e compilare:

- Titolo, Nome, Cognome
- Qualifica e Specializzazione
- Competenze (appare nell'intestazione dei documenti)
- Telefono e Indirizzo Studio

Selezionare il **preset vocabolario** più adatto al tipo di studio (fisioterapia, psicologia, legale, generico) oppure personalizzare singole etichette dalla sezione **Personalizzazione — Tipo di Studio**.

I dati vengono salvati nel `localStorage` del browser locale e non vengono mai trasmessi.

---

## Requisiti di Sistema

- **Java 21** (JDK, non solo JRE)
- **Maven 3.8+**
- Windows (il `pom.xml` ha `javafx.platform=win` — modificare in `mac` o `linux` se necessario)

---

## Licenza

MIT License — vedere file `LICENSE`.

> Il software è fornito "così com'è" (*as-is*), senza garanzie di alcun tipo, esplicite o implicite.  
> L'autore declina ogni responsabilità per qualsiasi danno derivante dal suo utilizzo.
