# Voortgang

## Regels (onthouden)
- Minimaal tekst, direct visueel (ADHD & dyslexie).
- Geen standaard emoticons; alleen eigen ontworpen SVG-iconen.
- Geen app-naam, geen XP/streaks, geen verspringende schermen.
- Volledige focus op **3D-Brein** en **Lichaams-Metrokaart** (met prikkel-simulatie).
- Alle inhoud komt 100% uit `samenvatting-hoofdstuk-3.txt` en `hoofdstuk3.docx` (Module 2 & 3).

---

## Updates

### [20:37:08] — Start herontwerp op basis van feedback
- **Actie:** Overbodige schermen, tekstblokken, app-titel, XP en standaard-emoji's verwijderen.
- **Volgende stap:** Open-source 3D-breinmodel zoeken/ophalen én het 3D-brein voorzien van realistische hersenwindingen (gyri/sulci) en anatomische vorm.

### [20:39:53] — Open-source 3D-breinmodel (`Z-Anatomy / BodyParts3D`) toegevoegd
- **Actie:** Echt anatomisch 3D-breinmodel (`models/brain.glb` + `models/manifest.json` + `models/brain-bundle.js`) met 437 gesegmenteerde structuren gedownload en gekoppeld (o.a. kwabben, precentrale gyrus, corticospinale tractussen, corpus callosum, insula, basale ganglia, thalamus, hypothalamus, cerebellum, hersenstam en craniale zenuwen).
- **Volgende stap:** Minimalistische dataset (`js/data.js`), het geüpgradede 3D-brein (`js/brain3d.js`) en de anatomische Lichaams-Metrokaart met interactieve prikkel-simulatie (`js/visuals.js`) bouwen.

### [20:43:58] — 3D-Brein (`js/brain3d.js`) en minimalistische data (`js/data.js`) vernieuwd
- **Actie:** `js/data.js` gestript tot maximaal 2–3 korte kernpunten per onderdeel en voorzien van eigen SVG-iconen (geen emoji's) en 6 interactieve prikkelroutes. `js/brain3d.js` laadt nu het echte Z-Anatomy 3D-breinmodel (`models/brain.glb`) én heeft een geplooide gyri/sulci 3D-mesh als directe fallback.
- **Volgende stap:** De Lichaams-Metrokaart (`js/visuals.js`) bouwen in de vorm van een groot, duidelijk menselijk lichaam + brein waarin je prikkels stap-voor-stap kunt versturen en volgen.

### [20:47:51] — Lichaams-Metrokaart, vaste layout & controles voltooid
- **Actie:**
  - `js/visuals.js`: grote verticale **Lichaams-Metrokaart** (silhouet van hoofd/brein, ruggenmerg, armen, benen en organen) met 6 klikbare **Stuur prikkel**-routes (*Pijn / Hitte, Spieractie, Zicht, Gehoor, Fight or Flight, Rest & Digest*) die je stap-voor-stap kunt volgen.
  - `css/style.css`, `index.html`, `js/app.js`: vaste `100dvh`-layout zodat schermen nooit verspringen, geen app-naam, geen XP/streaks, geen standaard-emoji's en maximaal 2–3 korte regels tekst per onderdeel.
  - Automatische controle geslaagd: 0 emoji's, 0 syntaxfouten, 437 3D-structuren gekoppeld in `models/brain.glb`.

### [2026-11-14 21:03:11] — Update #1 (Ronde 3): Nieuw plan gestart voor 3D-Brein, Metrokaart-hiërarchie & Prikkels
- **Actie:** De externe `.glb` gaat eruit en maakt plaats voor een eigen, echt anatomisch vormgegeven 3D-brein met hersenwindingen, C-vormig corpus callosum, diepe kernen, geribbeld cerebellum, 3-delige hersenstam en gebogen zenuwen.
- **Metrokaart:** De PZS-hiërarchie wordt kloppend gemaakt (PZS als overkoepelend knooppunt boven Afferent/Efferent → Somatisch & Autonoom → Sympathisch & Parasympathisch), de lichaamsillustratie wordt verfijnd en de blokjes krijgen ruime tussenruimte zonder overlap.
- **Overige aanpassingen:** Prikkels gaan in een strakke dropdown (11 prikkelroutes), de `.glb`-knop verdwijnt, en de knop `Samenvattingstekst` (exact citaat uit `samenvatting-hoofdstuk-3.txt`) komt terug in de vaste onder-dock.
- **Nu mee bezig:** Stap 2 — `js/data.js` uitbreiden met `exactQuote` bij alle 22 onderdelen en 11 prikkelroutes.

### [2026-11-14 21:04:09] — Update #2: `js/data.js` uitgebreid met exacte samenvattingscitaten & 11 prikkels
- **Gedaan:** Alle 22 onderdelen hebben nu weer hun letterlijke citaat (`exactQuote`) uit `samenvatting-hoofdstuk-3.txt`, en het aantal interactieve prikkelroutes is uitgebreid van 6 naar 11 verschillende prikkels (o.a. reuk zonder thalamus, armzwaai, bloedgassen/homeostase, beweging bijsturen via cerebellum, Fight or Flight en Rest & Digest).
- **Nu mee bezig:** Stap 3 — bouwen van het nieuwe, eigen anatomische 3D-brein in `js/brain3d.js` (echte breinvorm met sluitende hemisferen, hersenwindingen, C-vormig corpus callosum, diepe kernen, cerebellum met folia, 3-delige hersenstam en gebogen zenuwen).

### [2026-11-14 21:05:21] — Update #3: Eigen anatomisch 3D-Brein (`js/brain3d.js`) gebouwd
- **Gedaan:** De externe `.glb` volledig losgelaten en een eigen, massief en naadloos aansluitend 3D-brein gebouwd in [`js/brain3d.js`](js/brain3d.js):
  - Sluitende linker & rechter hemisferen met longitudinale fissuur, vooruitstekende temporele kwabben, gyri/sulci hersenwindingen, en duidelijke motorische stroken (*premotorcortex* & *primaire motorcortex*).
  - C-vormig *corpus callosum*, diepe *centrale insula*, C-vormige *basale ganglia*, *thalamus*, trechtervormige *hypothalamus*, geribbeld *cerebellum* (folia), vloeiende 3-delige *hersenstam* (middenhersenen, pons, medulla oblongata) met *reticulaire formatie*, *ruggenmerg* en symmetrisch gebogen craniale & spinale zenuwen.
- **Nu mee bezig:** Stap 4 — `js/visuals.js` vernieuwen met een nette prikkel-dropdown, mooiere anatomische lichaamsillustratie en kloppende PZS-boomstructuur zonder overlap.

### [2026-11-14 21:06:10] — Update #4: Lichaams-Metrokaart & Prikkel-Dropdown (`js/visuals.js`) vernieuwd
- **Gedaan:**
  - Prikkels omgezet naar een strakke **dropdown (`<select>`)** met alle 11 verschillende prikkels.
  - Hiërarchie kloppend gemaakt: **PZS (43 paar zenuwen)** staat nu bovenaan Module 3, met daaronder links **Sensorisch (Afferent)** → CZS en rechts **Motorisch (Efferent): Somatisch & Autonoom** → **Sympathisch** & **Parasympathisch**.
  - Achtergrond-illustratie (vergroote schedel/hersenwindingen, wervelkolom, ribben/long-accenten) verfijnd en alle blokjes op een ruim, niet-overlappend raster gezet.
- **Nu mee bezig:** Stap 5 — `index.html`, `css/style.css` en `js/app.js` bijwerken (`.glb`-knop en `brain-bundle.js` verwijderen, `Samenvattingstekst`-knop terugplaatsen) en de overlap-/syntaxcontroles uitvoeren.

### [2026-11-14 21:07:35] — Update #5: Alle aanpassingen afgerond & geverifieerd
- **Gedaan:**
  - `.glb`-uploadknop en `models/brain-bundle.js` verwijderd uit [`index.html`](index.html) en [`js/app.js`](js/app.js).
  - Knop **`Samenvattingstekst`** toegevoegd aan de vaste onder-dock ([`js/app.js`](js/app.js), [`css/style.css`](css/style.css)) zodat je per onderdeel de exacte zin uit `samenvatting-hoofdstuk-3.txt` kunt openklappen zonder dat het scherm verspringt.
  - Verificaties gedraaid: `22` onderwerpen met `exactQuote`, `11` prikkelroutes in de dropdown, `22` Lichaams-Metrokaart stations, `0` overlappende blokjes (`Bounding-box overlaps: 0`), `0` standaard-emoji's, `0` JS-syntaxfouten, en alle bestanden geven `HTTP 200`.


### [2026-11-14 21:19:05] — Update #6 (Ronde 4): Volledige tekst uit `hoofdstuk3.docx`, Fullscreen + Voorlezen & Uitgebreide Quiz
- **Actie:** Gestart met Ronde 4 op basis van jouw verzoek:
  - Per onderdeel de bijbehorende volledige hoofdstuktekst uit `hoofdstuk3.docx` opnemen (`chapterText`).
  - Voorleesknop (`nl-NL`) laten werken op deze volledige hoofdstuktekst + een **Volledig scherm**-modus bouwen.
  - De quiz uitbreiden met duidelijke feedback/uitleg bij antwoorden en een functie om op het einde (of tussendoor) de fout beantwoorde vragen opnieuw te herhalen.
- **Nu mee bezig:** Stap 2 — `js/data.js` bijwerken met `chapterText` voor alle 22 onderdelen, extra SVG-iconen en 26 tentamenvragen met `explain`.


### [2026-11-14 21:21:24] — Update #7: `js/data.js` en `index.html` bijgewerkt
- **Gedaan:**
  - [`js/data.js`](js/data.js): alle 22 onderdelen voorzien van de volledige hoofdstuktekst (`chapterText`) uit `hoofdstuk3.docx`, 6 extra eigen SVG-iconen (`fullscreen`, `close`, `stop`, `retry`, `check`, `cross`), en uitgebreide tentamenvragen (`26` vragen) voorzien van directe uitleg (`explain`).
  - [`index.html`](index.html): Fullscreen modal (`#chapter-modal`) buiten `.app-shell` toegevoegd zodat de vaste `100dvh`-layout nooit verspringt.
- **Nu mee bezig:** Stap 3 — `css/style.css` en `js/app.js` bijwerken voor volledige hoofdstuktekst-weergave, Voorleesknop (`nl-NL`), Fullscreen-lezer, en de uitgebreide quiz met fout-uitleg en **Foute vragen herhalen**.


### [2026-11-14 21:22:44] — Update #8: `css/style.css` en `js/app.js` voltooid
- **Gedaan:**
  - [`css/style.css`](css/style.css): opmaak toegevoegd voor de fullscreen hoofdstuklezer (`#chapter-modal`), voorleesknoppen, en scrollbare quizkaarten met fout-uitleg en eindresultaat (zonder dat de `100dvh`-schil verspringt).
  - [`js/app.js`](js/app.js):
    - Dockknop **`Hoofdstuktekst`** toont per onderdeel de alinea's uit `hoofdstuk3.docx` inclusief eigen **`Lees voor / Stop`** (`nl-NL`, alinea-wachtrij) en **`Volledig scherm`**-knop.
    - Bovenbalkknop `Stem` en de knoppen in de dock/fullscreen blijven gesynchroniseerd (`Lees voor` ↔ `Stop`).
    - Uitgebreide **Overhoring** toont na elk antwoord direct goed/fout, de gekozen vs. juiste optie, de uitleg (`explain`) uit het hoofdstuk, directe knop naar fullscreen hoofdstuktekst, en een eindoverzicht met de knop **`Foute vragen herhalen`**.
- **Nu mee bezig:** Stap 4 — Syntax-, emoji-, brondata- en DOM-controles draaien.


### [2026-11-14 21:23:48] — Update #9: Alle controles geslaagd & Ronde 4 afgerond
- **Verificatie gedraaid & geslaagd:**
  - `node --check` op `js/data.js`, `js/visuals.js`, `js/brain3d.js` en `js/app.js`: 0 syntaxfouten.
  - Datacontrole: `22` onderdelen met volledige `chapterText` uit `hoofdstuk3.docx`, `11` prikkelroutes, `26` overhoringsvragen met `explain`, `0` standaard-emoji's.
  - End-to-end DOM- en logica-test in Node: `Hoofdstuktekst` openklappen, `Lees voor / Stop` alinea-voor-alinea spraakwachtrij, `Volledig scherm`-modal openen/sluiten, foute antwoorden + uitleg bekijken, en `Foute vragen herhalen` doorlopen tot `0` fouten — alles geslaagd.
  - Lokale HTTP-servertest: alle app-bestanden (`index.html`, `css/style.css`, `js/data.js`, `js/visuals.js`, `js/brain3d.js`, `js/app.js`) geven `HTTP 200`.


### [2026-11-14 21:38:58] — Update #10 (Ronde 5): Audio Pauze/Verder, Vaste Dock-scroll, Kaart→3D, 4 Regio's & Naadloos 3D-Brein
- **Actie:** Gestart met 5 verbeteringen plus volledige simulatie en GitHub-upload:
  1. Audio echt kunnen **pauzeren** en **verder afspelen** zonder opnieuw te beginnen (plus aparte Stop-knop).
  2. Vaste dock-scroll zodat veel hoofdstuktekst de onderdelenlijst eronder nooit wegdrukt.
  3. Direct vanuit de `Lichaams-Kaart` (en dock) naar `3D-Brein` springen op het gekozen onderdeel (`Bekijk in 3D`).
  4. Onderin de 3D-view filteren op de 4 hoofdregio's: **Cerebrum**, **Diencephalon**, **Cerebellum** en **Stam & Ruggenmerg** (+ Alles / X-Ray).
  5. Het 3D-model veel gedetailleerder maken en alle gaten dichten tussen kwabben, diencephalon, cerebellum, hersenstam en ruggenmerg.
- **Nu mee bezig:** Stap 2 — Pauze/Play SVG-iconen toevoegen aan `js/data.js` en `index.html` bijwerken.


### [2026-11-14 21:42:40] — Update #11: Code voor Audio Pauze/Verder, Vaste Dock, Kaart→3D & Gedetailleerd 3D-Brein geschreven
- **Gedaan:**
  - [`js/brain3d.js`](js/brain3d.js): herschreven met doorlopende as `evalStemAxis`, 0-gat verbindingen (*thalamus + adhesio interthalamica + geniculata*, *hypothalamus + chiasma/tractus opticus + corpora mammillaria + hypofyse*, *hersenstam met pedunculi cerebri, colliculi, pons + dwarse vezels, piramiden & olijven*, *cerebellum + middelste pedunkels*, *reticulaire formatie*, *ruggenmerg*, plus *craniale & spinale wortels met spinaal ganglion*) en 4 hoofdregio-filters (`cerebrum`, `diencephalon`, `cerebellum`, `stem`).
  - [`js/visuals.js`](js/visuals.js): **`Bekijk in 3D`** en **`In 3D`** knoppen toegevoegd in de `Lichaams-Kaart`.
  - [`css/style.css`](css/style.css): vaste scroll-hoogtes (`max-height`, `min-height: 0`, `overflow-y: auto`) op `.dock-card` en `.dock-quote-box` zodat hoofdstuktekst de onderdelenlijst eronder nooit wegdrukt.
  - [`js/app.js`](js/app.js): echte **Pauze / Verder** audio-controller met karakter- & zinspositie-tracking (`onboundary` + fallback) én **`In 3D`** knoppen in dock en quiz.
- **Nu mee bezig:** Stap 5 — Volledige simulatie draaien over alle onderdelen en functionaliteiten.



### [2026-11-14 21:53:15] — Update #12: Volledige simulatie geslaagd & klaargezet voor GitHub-upload
- **Simulatie & controles geslaagd (0 fouten):**
  - Syntaxcontrole (`node --check`) op `js/data.js`, `js/brain3d.js`, `js/visuals.js`, `js/app.js`: allemaal geslaagd.
  - Brondata & layout: `22` onderdelen met volledige `chapterText` uit `hoofdstuk3.docx`, `11` prikkelroutes, `26` tentamenvragen met uitleg (`explain`), `0` standaard-emoji's in alle projectbestanden, vergrendelde `100dvh`-layout en vaste scrollhoogte op `.dock-quote-box` / `.info-dock` zodat `#quick-strip` altijd zichtbaar blijft.
  - 3D-model (`js/brain3d.js`): `104` interactieve meshes opgebouwd zonder NaN-waarden, `0.000` anatomische gaten tussen *thalamus*, *hypothalamus*, *hersenstam*, *ruggenmerg*, *cerebellum*, *reticulaire formatie* en *PZS-zenuwwortels*, C1-vloeiende hersenwindingen, en werkende regiofilters voor **Cerebrum**, **Diencephalon**, **Cerebellum**, **Stam & Ruggenmerg**, **X-Ray** en **Alles**.
  - Interactieve flows (Node VM + mock-DOM): **Pauze / Verder** van spraak werkt zowel via native `speechSynthesis.pause()/resume()` als via de woordpositie-fallback (`onboundary`) zonder opnieuw te starten; **Bekijk in 3D** werkt vanuit zowel `Lichaams-Kaart`, dockkaart als overhoring; sluiten van de fullscreen lezer laat audio doorlopen; foute quiz-antwoorden tonen directe uitleg en starten **Foute vragen herhalen**.
  - Lokale HTTP-servertest: `HTTP 200` op alle 7 kernbestanden (`index.html`, `manifest.json`, `css/style.css`, `js/data.js`, `js/brain3d.js`, `js/visuals.js`, `js/app.js`).
- **GitHub-upload:** `.gitignore` (`models/`) aangemaakt en repository `Neurale-sturing-van-beweging` klaargemaakt om te pushen naar `https://github.com/hnsvrdmn/Neurale-sturing-van-beweging`.



### [2026-11-14 21:58:30] — Update #13 (Ronde 6): Naadloze integratie van sensomotorische integratie, reflexen, proprioceptoren & motor-units
- **Actie:** Gestart met het naadloos verwerken van alle resterende stof over sensomotorische integratie, integratieniveaus, reflexen, spierspoeltjes, Golgi-peeslichaampjes en de motorische eenheid (motor-unit) in de bestaande **CZS**- en **PZS**-onderdelen (zonder los 'Module 4'-kopje):
  - `js/data.js`: verrijken van CZS-onderdelen (`czs-overzicht`, `parietale-kwab`, `thalamus`, `cerebellum`, `hersenstam`, `ruggenmerg`), toevoegen van `spierspoeltjes`, `golgi-peeslichaampjes` en `motorische-eenheid` onder `PZS` (`25` onderdelen totaal), uitbreiden van prikkelroutes naar `14` en tentamenvragen naar `32`.
  - `js/visuals.js`: Lichaams-Kaart symmetrisch uitlijnen met alle 25 stations en actuele CZS/PZS-koppen (0 overlap).
  - `js/brain3d.js`: toevoegen van 3D-meshes voor `spierspoeltjes`, `golgi-peeslichaampjes` en `motorische-eenheid` aansluitend op de spinale zenuwwortels (`0.000` gat).
- **Nu mee bezig:** Stap 2 — `js/data.js` bijwerken met exacte brontekst uit `samenvatting-hoofdstuk-3.txt` en `hoofdstuk3.docx`.



### [2026-11-14 22:04:00] — Update #14 (Ronde 6 afgerond): Naadloze integratie geverifieerd & klaar voor GitHub-push
- **Doorgevoerd in alle lagen:**
  - [`js/data.js`](js/data.js): alle resterende onderwerpen uit Module 4 (sensomotorische integratie in 5 stappen, de 5 CZS-integratieniveaus, Wetenschapsperspectief 3.3, spinale motorische reflexen, *spierspoeltjes* + gamma-voorspanning + rekreflex, *Golgi-peeslichaampjes* + autogene inhibitie, en de *motorische eenheid / motor-unit* + innervatieverhoudingen 1:15 vs. 1:2.000+) naadloos ondergebracht onder de bestaande **CZS**- en **PZS**-onderdelen (`25` onderdelen, `14` prikkelroutes incl. terugtrekreflex/rekreflex/autogene inhibitie, `32` tentamenvragen met directe uitleg).
  - [`js/visuals.js`](js/visuals.js): `Lichaams-Kaart` uitgebreid naar een symmetrisch raster van `25` stations binnen `viewBox="0 0 820 775"` (links *Afferent: 5 receptoren, gewrichtssensoren, spierspoeltjes, Golgi-peeslichaampjes*; rechts *Efferent: Somatisch & Autonoom, Motorische Eenheid, Sympathisch, Parasympathisch*), zonder losse module-labels of overlappende blokjes.
  - [`js/brain3d.js`](js/brain3d.js): gedetailleerde 3D-eindstructuren (`spierspoeltjes`, `motorische-eenheid`, `golgi-peeslichaampjes`) direct aangesloten op de PZS-spinale zenuwen (`0.000` gat), inclusief 2D-canvas fallback-coördinaten.
  - [`index.html`](index.html) & [`manifest.json`](manifest.json): paginatitel en manifest gelijkgetrokken naar een uniforme **CZS & PZS**-structuur zonder losse `Module 2/3/4`-labels.
- **Simulatie & controles (`node --check` + `sim.js`, uitgevoerd na laatste code-edit):**
  - `node --check` op `js/data.js`, `js/visuals.js`, `js/brain3d.js`, `js/app.js`: allemaal geslaagd.
  - Brondata & structuur: `25` onderdelen (`CZS`/`PZS` only, alle met volledige `chapterText`), `14` prikkelroutes, `32` quizvragen met `explain` en geldige `topicId`, `0` standaard-emoji's in alle bestanden.
  - 3D-model: `158` interactieve meshes zonder NaN-waarden, `0.000` anatomisch gat over alle 10 gecontroleerde verbindingen (inclusief `pzs-overzicht` naar `spierspoeltjes`, `golgi-peeslichaampjes` en `motorische-eenheid`), alle regiofilters (**Cerebrum**, **Diencephalon**, **Cerebellum**, **Stam & Ruggenmerg**, **X-Ray**, **Alles**) geverifieerd.
  - Lichaams-Kaart SVG: exact `25` station-blokjes binnen het `820x775` frame met `0` onderlinge overlap.
  - App-interacties & server: **Pauze / Verder** audio (`native` + `onboundary`-fallback), **Bekijk in 3D** (vanuit Kaart, Dock en Quiz), inline hoofdstuktekst, fullscreen lezer, quizfout-uitleg + **Foute vragen herhalen**, en `HTTP 200` op alle 7 kernbestanden.
- **Volgende stap:** Committen en pushen naar `https://github.com/hnsvrdmn/Neurale-sturing-van-beweging`.



### [2026-11-14 22:18:00] — Update #15 (Ronde 7 gestart): Naadloze CZS/PZS-boom, Afferent/Efferent kaartkleuring, Audio-Navigator & 3D-reparatie
- **Feedback van de gebruiker opgepakt:**
  1. **Geen geforceerde losse blokjes:** `gewrichtssensoren`, `spierspoeltjes`, `golgi-peeslichaampjes` en `motorische-eenheid` gaan terug naar hun natuurlijke plek onder `Sensorisch / Afferent deel` en `Somatisch` (exact volgens het Zenuwstelsel-boomschema).
  2. **Middenhersenen, Pons & Medulla oblongata afzonderlijk:** toegevoegd aan CZS (data, Lichaams-Kaart én 3D-Brein).
  3. **Afferent vs. Efferent kleuring:** elke stap in de prikkelroutes krijgt richting `afferent` (blauw) of `efferent` (oranje) in lijnsegmenten, puls en stap-balk.
  4. **Audio-indicator & betere Audio-Navigator:** klein afspeel-icoontje op het spelende onderdeel (in zowel de onderdelenstrip als op de kaart) tijdens het doorklikken, plus een compacte Audio-Navigator bovenin met spelend onderdeel, zin-teller en vorige/pauze/volgende/stop-knoppen.
  5. **Gaten in 3D-model verhelpen + visuele Chrome-controle:** winding-order/normalen (`buildLoftedSurfaceGeo`), waterdichte mediale afsluiting van de hersenkwabben (`evalBrainSurface`/`buildLobeGeometry`) en `transparent`/`depthWrite` corrigeren, gevolgd door screenshot-inspectie in Chrome via de browser-subagent.
- **Nu bezig:** Stap 2 — `js/data.js` herstructureren (`26` onderdelen: `19` CZS incl. middenhersenen, pons, medulla oblongata + `7` PZS).



### [2026-11-14 22:28:00] — Update #16 (Ronde 7 afgerond): Naadloze CZS/PZS-boom, Afferent/Efferent kaartkleuring, Audio-Navigator & waterdichte 3D-meshes
- **Doorgevoerd in de codebase:**
  - [`js/data.js`](js/data.js): `26` onderdelen (`19` CZS inclusief afzonderlijke onderdelen **Middenhersenen**, **Pons** en **Medulla oblongata** onder de Hersenstam, plus `7` PZS exact volgens de zenuwstelsel-boom: `pzs-overzicht` -> `afferent-receptoren` en `efferent-divisies` -> `somatisch` & `autonoom` -> `sympathisch` & `parasympathisch`). De losse tegels voor `gewrichtssensoren`, `spierspoeltjes`, `golgi-peeslichaampjes` en `motorische-eenheid` zijn verwijderd en natuurlijk ondergebracht onder **Sensorisch / Afferent deel** en **Somatisch**. Alle `14` prikkelroutes dragen nu per stap `dir: "afferent" | "efferent"`, en alle `32` overhoringsvragen zijn opgeschoond. Nieuwe custom SVG-iconen (`prev`, `next`, `wave`) toegevoegd aan `NEURO_ICONS`.
  - [`js/visuals.js`](js/visuals.js) & [`css/style.css`](css/style.css): `Lichaams-Kaart` (`viewBox="0 0 820 775"`, `26` stations zonder overlap) kleurt actieve routelijnen, bewegende impuls, stap-badge en legenda als **blauw (`▲ Afferent`, `#38bdf8`)** of **oranje (`▼ Efferent`, `#f97316`)**, met een kleine X-offset voor retourbanen. Bovendien toont `setSpeaking(topicId, status)` een afspeel-/pauze-badge direct op de stationsknop op de kaart.
  - [`js/brain3d.js`](js/brain3d.js): hersenstam opgesplitst in `middenhersenen`, `pons` en `medulla-oblongata` (die bij selectie van `hersenstam` alle drie tegelijk oplichten), buitengerichte driehoekswindingen en boven-/onderkappen in `buildLoftedSurfaceGeo` hersteld, corticale kwabben met `x = 0.028 * side` aan de binnenzijde dichtgemaakt, een subthalamische/tegmentale brug onder de thalamus toegevoegd, `DoubleSide` en correcte `transparent`/`depthWrite`-instelling toegepast (waardoor Z-sorting-gaten in `"Alles"` verdwijnen), en geforceerde losse spier-/peesmeshes bij het PZS weggehaald met behoud van blauwe dorsale (afferente) en oranje ventrale (efferente) wortels.
  - [`index.html`](index.html), [`css/style.css`](css/style.css) & [`js/app.js`](js/app.js): vernieuwde `#audio-nav` bovenin (klikbare topic-pil `#btn-audio-topic` met zinsteller `i/n`, `#btn-speak-prev`, `#btn-speak`, `#btn-speak-next`, `#btn-speak-stop` met compacte mobiele weergave via `body.has-audio`), directe voorleesknop `#btn-dock-speak` in `.dock-header-actions`, en blijvende afspeel-/pauze-iconen op `.strip-pill` in de snelle balk tijdens het doorklikken.
- **Verificatie (uitgevoerd na de laatste code-aanpassing):**
  - `node --check` op `js/data.js`, `js/visuals.js`, `js/brain3d.js`, `js/app.js` en headless simulatiesuite `sim.js`: alle checks geslaagd (`26` onderdelen, `14` prikkelroutes met `dir`, `32` vragen, `107` 3D-meshes met uitwaartse normalen, `DoubleSide`, gesloten corticale binnenwanden, `0.000` anatomisch gat op alle 9 geteste koppelingen, `26` niet-overlappende kaartstations, Afferent/Efferent routekleuren, Audio-Navigator + blijvend afspeel-icoon, en `HTTP 200`).
  - Browser-/screenshotcontrole via `browser`-subagent (`chrome_devtools` MCP): poging op `http://127.0.0.1:8123` meldde `DevToolsActivePort (ENOENT)` omdat er geen Chrome-instantie met ingeschakelde remote debugging (`chrome://inspect/#remote-debugging`) actief was; er zijn daarom in deze sessie geen live Chrome-screenshots kunnen worden beoordeeld.
- **Volgende stap:** Hercontrole na deze logupdate en pushen naar `origin main`.
