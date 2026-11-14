// Geordende Anatomische Lichaams-Metrokaart met Afferent/Efferent-kleuring
// Exacte CZS/PZS-boom inclusief Middenhersenen, Pons & Medulla oblongata; 100% uit hoofdstuk3.docx & samenvatting-hoofdstuk-3.txt

window.NeuroVisuals = (function () {
  // Ruim raster (viewBox 0 0 820 775) met gegarandeerde marge rond alle 26 stations (0 overlap)
  const BODY_STATIONS = [
    // --- CZS (Hoofd, Brein & Ruggenmerg) ---
    { id: "czs-overzicht",        label: "CZS Overzicht",            sub: ">100 mld neuronen",        x: 145, y: 54,  w: 168, h: 32, color: "#8b5cf6" },
    { id: "cerebrum",             label: "Corpus callosum & Cortex", sub: "2 hemisferen • Grijze stof", x: 410, y: 54, w: 196, h: 32, color: "#d946ef" },
    { id: "primaire-motorcortex", label: "Primaire motorcortex",     sub: "Precentrale gyrus",        x: 675, y: 54,  w: 186, h: 32, color: "#c084fc" },

    { id: "frontale-kwab",        label: "Frontale kwab",            sub: "Planning & motoriek",      x: 120, y: 106, w: 152, h: 32, color: "#8b5cf6" },
    { id: "premotorcortex",       label: "Premotorcortex",           sub: "Opslag vaardigheden",      x: 312, y: 106, w: 154, h: 32, color: "#a855f7" },
    { id: "parietale-kwab",       label: "Pariëtale kwab",           sub: "Tast, pijn, temp, ruimte", x: 506, y: 106, w: 156, h: 32, color: "#6366f1" },
    { id: "occipitale-kwab",      label: "Occipitale kwab",          sub: "Zicht",                    x: 700, y: 106, w: 152, h: 32, color: "#0ea5e9" },

    { id: "temporele-kwab",       label: "Temporele kwab",           sub: "Gehoor",                   x: 145, y: 158, w: 162, h: 32, color: "#3b82f6" },
    { id: "basale-ganglia",       label: "Basale ganglia",           sub: "Armzwaai & spiertonus",    x: 410, y: 158, w: 176, h: 32, color: "#f43f5e" },
    { id: "centrale-insula",      label: "Centrale insula",          sub: "5e kwab • Emoties",        x: 675, y: 158, w: 162, h: 32, color: "#ec4899" },

    { id: "thalamus",             label: "Thalamus",                 sub: "Schakelstation (geen reuk)", x: 275, y: 210, w: 184, h: 32, color: "#e879f9" },
    { id: "hypothalamus",         label: "Hypothalamus",             sub: "Homeostase",               x: 545, y: 210, w: 184, h: 32, color: "#fb7185" },

    { id: "reticulaire-formatie", label: "Reticulaire formatie",     sub: "Arousal & pijncontrole",   x: 135, y: 264, w: 168, h: 34, color: "#eab308" },
    { id: "middenhersenen",       label: "Middenhersenen",           sub: "Hersenstam (boven)",       x: 322, y: 264, w: 158, h: 34, color: "#f59e0b" },
    { id: "pons",                 label: "Pons (Brug)",              sub: "Hersenstam (midden)",      x: 498, y: 264, w: 146, h: 34, color: "#fb923c" },
    { id: "cerebellum",           label: "Cerebellum",               sub: "Coördinatie & correctie",  x: 680, y: 264, w: 168, h: 34, color: "#f59e0b" },

    { id: "hersenstam",           label: "Hersenstam (Overzicht)",   sub: "10 van 12 paar zenuwen",   x: 275, y: 320, w: 184, h: 34, color: "#fbbf24" },
    { id: "medulla-oblongata",    label: "Medulla oblongata",        sub: "Verlengde merg • Autonoom", x: 545, y: 320, w: 194, h: 34, color: "#ea580c" },

    { id: "ruggenmerg",           label: "Ruggenmerg (CZS)",         sub: "Tractussen & reflexen",    x: 410, y: 376, w: 192, h: 34, color: "#d97706" },

    // --- PZS (Exacte boomstructuur: Afferent vs. Efferent -> Somatisch & Autonoom -> Sympathisch & Parasympathisch) ---
    { id: "pzs-overzicht",        label: "Perifeer Zenuwstelsel (PZS)", sub: "43 paar: 12 craniaal + 31 spinaal", x: 410, y: 470, w: 236, h: 36, color: "#38bdf8" },

    { id: "afferent-receptoren",  label: "Sensorisch / Afferent deel",  sub: "Zintuigen, gewricht & spierreceptoren", x: 190, y: 548, w: 284, h: 42, color: "#38bdf8" },
    { id: "efferent-divisies",    label: "Motorisch / Efferent deel",   sub: "Van CZS naar spieren & organen",        x: 610, y: 548, w: 276, h: 42, color: "#f97316" },

    { id: "somatisch",            label: "Somatisch (Willekeurig)",     sub: "Skeletspieren • α-neuron & motor-unit", x: 440, y: 632, w: 224, h: 40, color: "#fb923c" },
    { id: "autonoom",             label: "Autonoom (Onwillekeurig)",    sub: "Glad spierweefsel, hart & klieren",     x: 682, y: 632, w: 206, h: 40, color: "#f97316" },

    { id: "sympathisch",          label: "Sympathisch",                 sub: "Fight or Flight • Noradrenaline",       x: 440, y: 714, w: 224, h: 38, color: "#ef4444" },
    { id: "parasympathisch",      label: "Parasympathisch",             sub: "Rest and Digest • Acetylcholine",       x: 682, y: 714, w: 206, h: 38, color: "#10b981" }
  ];

  // Nette orthogonaal-vloeiende verbindingslijnen
  const BASE_LINKS = [
    // CZS verbindingen
    { from: "czs-overzicht", to: "cerebrum", color: "#8b5cf6" },
    { from: "frontale-kwab", to: "premotorcortex", color: "#a855f7" },
    { from: "premotorcortex", to: "primaire-motorcortex", color: "#c084fc" },
    { from: "primaire-motorcortex", to: "middenhersenen", color: "#c084fc" },
    { from: "cerebrum", to: "thalamus", color: "#d946ef" },
    { from: "basale-ganglia", to: "thalamus", color: "#f43f5e" },
    { from: "thalamus", to: "parietale-kwab", color: "#6366f1" },
    { from: "thalamus", to: "occipitale-kwab", color: "#0ea5e9" },
    { from: "thalamus", to: "temporele-kwab", color: "#3b82f6" },
    { from: "thalamus", to: "middenhersenen", color: "#e879f9" },
    { from: "hypothalamus", to: "middenhersenen", color: "#fb7185" },
    { from: "hersenstam", to: "middenhersenen", color: "#fbbf24" },
    { from: "hersenstam", to: "reticulaire-formatie", color: "#eab308" },
    { from: "middenhersenen", to: "pons", color: "#f59e0b" },
    { from: "pons", to: "cerebellum", color: "#f59e0b" },
    { from: "pons", to: "medulla-oblongata", color: "#fb923c" },
    { from: "medulla-oblongata", to: "ruggenmerg", color: "#ea580c" },

    // Brug CZS <-> PZS
    { from: "ruggenmerg", to: "pzs-overzicht", color: "#38bdf8" },

    // PZS Boomstructuur: Afferent (blauw, naar CZS) vs. Efferent (oranje, uit CZS -> Somatisch & Autonoom)
    { from: "afferent-receptoren", to: "pzs-overzicht", color: "#38bdf8", dashed: true },
    { from: "pzs-overzicht", to: "efferent-divisies", color: "#f97316" },
    { from: "efferent-divisies", to: "somatisch", color: "#fb923c" },
    { from: "efferent-divisies", to: "autonoom", color: "#f97316" },
    { from: "autonoom", to: "sympathisch", color: "#ef4444" },
    { from: "autonoom", to: "parasympathisch", color: "#10b981" }
  ];

  function getStation(id) {
    return BODY_STATIONS.find((s) => s.id === id);
  }

  function dirColor(dir) {
    return dir === "efferent" ? "#f97316" : "#38bdf8";
  }

  function createBodyMapController(container, data, onSelectTopic, onViewIn3D) {
    let selectedTopicId = "frontale-kwab";
    let speakingTopicId = null;
    let speakingStatus = "idle";
    let activeRoute = null;
    let routeStepIdx = 0;
    let routePlaying = false;
    let routeTimer = null;
    let mapZoom = 1;
    let mapPanX = 0;
    let mapPanY = 0;
    let lastGestureTime = 0;
    const icons = window.NEURO_ICONS || {};
    const playIco = icons.play || "";
    const pauseIco = icons.pause || "";
    const prevIco = icons.chevronLeft || "&lsaquo;";
    const nextIco = icons.chevronRight || "&rsaquo;";
    const zoomInIco = icons.zoomIn || "+";
    const zoomOutIco = icons.zoomOut || "-";

    container.innerHTML = `
      <div class="bodymap-layout">
        <!-- Minimale prikkel-dropdown + icoon Play/Pause voor automatisch doorlopen -->
        <div class="stimulus-bar">
          <select id="stim-select" class="stim-select" aria-label="Kies een prikkel om over de metrokaart te volgen">
            <option value="">Kies prikkel om te volgen...</option>
            ${data.signalRoutes.map((r) => `<option value="${r.id}">${r.label}</option>`).join("")}
          </select>
          <button type="button" class="icon-btn route-play-btn" id="btn-route-play" title="Prikkel automatisch afspelen of pauzeren" aria-label="Speel prikkel af of pauzeer" style="display:none;">
            <span class="svg-ico">${pauseIco}</span>
          </button>
        </div>

        <!-- Stap-balk tijdens actieve prikkel -->
        <div class="route-stepper" id="route-stepper" style="display:none;">
          <div class="route-step-text" id="route-step-text"></div>
          <div class="route-step-controls">
            <button type="button" class="step-ctrl-btn" id="btn-prev-step" title="Vorige stap" aria-label="Vorige stap"><span class="svg-ico">${prevIco}</span></button>
            <button type="button" class="step-ctrl-btn primary" id="btn-next-step" title="Volgende stap" aria-label="Volgende stap"><span class="svg-ico">${nextIco}</span></button>
            <button type="button" class="step-ctrl-btn" id="btn-step-to-3d" title="Bekijk deze stap in 3D">3D</button>
          </div>
        </div>

        <!-- Zoombare & swipebare SVG Lichaams-Metrokaart -->
        <div class="bodymap-svg-wrap" id="bodymap-svg-wrap">
          <div class="bodymap-zoom-bar">
            <button type="button" class="map-zoom-btn" id="btn-map-zoom-out" title="Uitzoomen" aria-label="Uitzoomen"><span class="svg-ico">${zoomOutIco}</span></button>
            <button type="button" class="map-zoom-btn map-zoom-pct" id="btn-map-zoom-reset" title="Reset kaartzoom" aria-label="Reset zoom">100%</button>
            <button type="button" class="map-zoom-btn" id="btn-map-zoom-in" title="Inzoomen" aria-label="Inzoomen"><span class="svg-ico">${zoomInIco}</span></button>
          </div>
          <div class="bodymap-transform" id="bodymap-transform"></div>
        </div>
      </div>
    `;

    const stimSelect = container.querySelector("#stim-select");
    const routePlayBtn = container.querySelector("#btn-route-play");
    const stepper = container.querySelector("#route-stepper");
    const stepText = container.querySelector("#route-step-text");
    const svgWrap = container.querySelector("#bodymap-svg-wrap");
    const transformEl = container.querySelector("#bodymap-transform");
    const zoomResetBtn = container.querySelector("#btn-map-zoom-reset");

    function updateTransform(instant) {
      if (!transformEl) return;
      mapZoom = Math.max(1.0, Math.min(3.2, Number(mapZoom.toFixed(2))));
      const W = svgWrap.clientWidth || 390;
      const H = svgWrap.clientHeight || 520;
      if (mapZoom <= 1.02) {
        mapZoom = 1.0;
        mapPanX = 0;
        mapPanY = 0;
      } else {
        const maxPanX = W * 0.55 * mapZoom;
        const maxPanY = H * 0.55 * mapZoom;
        mapPanX = Math.max(-maxPanX, Math.min(maxPanX, mapPanX));
        mapPanY = Math.max(-maxPanY, Math.min(maxPanY, mapPanY));
      }
      transformEl.style.transition = instant ? "none" : "transform 0.34s cubic-bezier(0.2, 0.8, 0.2, 1)";
      transformEl.style.transform = `translate(${Math.round(mapPanX)}px, ${Math.round(mapPanY)}px) scale(${mapZoom})`;
      if (zoomResetBtn) zoomResetBtn.textContent = `${Math.round(mapZoom * 100)}%`;
    }

    function focusStation(topicId, forceMobileZoom) {
      const st = getStation(topicId);
      if (!st || !svgWrap) return;
      const W = svgWrap.clientWidth || 0;
      const H = svgWrap.clientHeight || 0;
      if (W <= 0 || H <= 0) return;

      const isCompact = window.innerWidth < 768;
      if (!isCompact && mapZoom <= 1.05) {
        updateTransform(false);
        return;
      }

      const svgScale = Math.min(W / 820, H / 775);
      if (svgScale <= 0) return;
      const cx0 = (st.x - 410) * svgScale;
      const cy0 = (st.y - 387.5) * svgScale;

      if (isCompact && (forceMobileZoom || mapZoom <= 1.05)) {
        mapZoom = Math.max(1.85, Math.min(2.45, mapZoom > 1.3 ? mapZoom : 2.05));
      }
      const desiredOffY = isCompact ? H * (0.40 - 0.5) : 0;
      mapPanX = -cx0 * mapZoom;
      mapPanY = desiredOffY - cy0 * mapZoom;
      updateTransform(false);
    }

    function resetAutoTimer() {
      if (routeTimer) {
        clearInterval(routeTimer);
        routeTimer = null;
      }
      if (activeRoute && routePlaying) {
        routeTimer = setInterval(() => {
          if (!activeRoute || !routePlaying) return;
          routeStepIdx = (routeStepIdx + 1) % activeRoute.steps.length;
          syncRouteStep();
        }, 2400);
      }
    }

    function updateRoutePlayBtn() {
      if (!routePlayBtn) return;
      routePlayBtn.style.display = activeRoute ? "inline-flex" : "none";
      routePlayBtn.classList.toggle("is-on", routePlaying);
      routePlayBtn.innerHTML = `<span class="svg-ico">${routePlaying ? pauseIco : playIco}</span>`;
      routePlayBtn.setAttribute("aria-label", routePlaying ? "Pauzeer prikkel" : "Speel prikkel af");
      routePlayBtn.title = routePlaying ? "Pauzeer automatisch afspelen" : "Hervat automatisch afspelen";
    }

    container.querySelector("#btn-step-to-3d").addEventListener("click", () => {
      if (onViewIn3D) onViewIn3D(selectedTopicId);
    });

    container.querySelector("#btn-map-zoom-in").addEventListener("click", () => {
      mapZoom = Math.min(3.2, mapZoom + 0.35);
      focusStation(selectedTopicId, false);
    });
    container.querySelector("#btn-map-zoom-out").addEventListener("click", () => {
      mapZoom = Math.max(1.0, mapZoom - 0.35);
      updateTransform(false);
    });
    zoomResetBtn.addEventListener("click", () => {
      mapZoom = 1.0;
      mapPanX = 0;
      mapPanY = 0;
      updateTransform(false);
    });

    // Touch (pinch-to-zoom, 1-vinger swipe/pan, dubbel-tik reset) + Muiswiel/Sleep op desktop
    let touchPinch = false, tStartDist = 0, tStartZoom = 1, tStartMidX = 0, tStartMidY = 0, tStartPanX = 0, tStartPanY = 0;
    let tSingle = null, tMoved = false, lastTapTs = 0;

    svgWrap.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        touchPinch = true;
        tMoved = true;
        const t1 = e.touches[0], t2 = e.touches[1];
        tStartDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        tStartZoom = mapZoom;
        tStartMidX = (t1.clientX + t2.clientX) / 2;
        tStartMidY = (t1.clientY + t2.clientY) / 2;
        tStartPanX = mapPanX;
        tStartPanY = mapPanY;
        tSingle = null;
      } else if (e.touches.length === 1) {
        touchPinch = false;
        tMoved = false;
        tSingle = { x: e.touches[0].clientX, y: e.touches[0].clientY, px: mapPanX, py: mapPanY };
      }
    }, { passive: true });

    svgWrap.addEventListener("touchmove", (e) => {
      if (e.touches.length === 2 && touchPinch && tStartDist > 0) {
        e.preventDefault();
        const t1 = e.touches[0], t2 = e.touches[1];
        const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
        mapZoom = Math.max(1.0, Math.min(3.2, Number((tStartZoom * (dist / tStartDist)).toFixed(2))));
        const mx = (t1.clientX + t2.clientX) / 2;
        const my = (t1.clientY + t2.clientY) / 2;
        mapPanX = tStartPanX + (mx - tStartMidX);
        mapPanY = tStartPanY + (my - tStartMidY);
        lastGestureTime = Date.now();
        updateTransform(true);
      } else if (e.touches.length === 1 && tSingle) {
        const dx = e.touches[0].clientX - tSingle.x;
        const dy = e.touches[0].clientY - tSingle.y;
        if (Math.hypot(dx, dy) > 8) {
          e.preventDefault();
          tMoved = true;
          mapPanX = tSingle.px + dx;
          mapPanY = tSingle.py + dy;
          lastGestureTime = Date.now();
          updateTransform(true);
        }
      }
    }, { passive: false });

    svgWrap.addEventListener("touchend", (e) => {
      if (touchPinch) {
        if (e.touches.length === 0) touchPinch = false;
        return;
      }
      if (!tMoved && tSingle) {
        const now = Date.now();
        if (now - lastTapTs < 280) {
          mapZoom = mapZoom > 1.2 ? 1.0 : 2.1;
          if (mapZoom <= 1.05) { mapPanX = 0; mapPanY = 0; }
          updateTransform(false);
          lastTapTs = 0;
        } else {
          lastTapTs = now;
        }
      }
      tSingle = null;
      tMoved = false;
    }, { passive: true });

    svgWrap.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY) * 0.25;
      mapZoom = Math.max(1.0, Math.min(3.2, Number((mapZoom + delta).toFixed(2))));
      updateTransform(false);
    }, { passive: false });

    svgWrap.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || mapZoom <= 1.02) return;
      if (e.target && e.target.closest && e.target.closest(".bodymap-zoom-bar")) return;
      const sx = e.clientX, sy = e.clientY, px = mapPanX, py = mapPanY;
      let dragged = false;
      const onMove = (me) => {
        const dx = me.clientX - sx, dy = me.clientY - sy;
        if (Math.hypot(dx, dy) > 5) {
          dragged = true;
          mapPanX = px + dx;
          mapPanY = py + dy;
          lastGestureTime = Date.now();
          updateTransform(true);
        }
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        if (dragged) lastGestureTime = Date.now();
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    });

    stimSelect.addEventListener("change", () => {
      const id = stimSelect.value;
      if (!id) {
        stopRoute();
        return;
      }
      const found = data.signalRoutes.find((r) => r.id === id);
      if (found) startRoute(found);
    });

    routePlayBtn.addEventListener("click", () => {
      if (!activeRoute) return;
      routePlaying = !routePlaying;
      updateRoutePlayBtn();
      resetAutoTimer();
    });

    container.querySelector("#btn-prev-step").addEventListener("click", () => {
      if (!activeRoute) return;
      routeStepIdx = (routeStepIdx - 1 + activeRoute.steps.length) % activeRoute.steps.length;
      syncRouteStep();
      resetAutoTimer();
    });

    container.querySelector("#btn-next-step").addEventListener("click", () => {
      if (!activeRoute) return;
      routeStepIdx = (routeStepIdx + 1) % activeRoute.steps.length;
      syncRouteStep();
      resetAutoTimer();
    });

    function startRoute(route) {
      activeRoute = route;
      routeStepIdx = 0;
      routePlaying = true;
      updateRoutePlayBtn();
      stepper.style.display = "flex";
      stepper.style.borderColor = route.color;
      syncRouteStep();
      resetAutoTimer();
    }

    function stopRoute() {
      activeRoute = null;
      routePlaying = false;
      resetAutoTimer();
      updateRoutePlayBtn();
      stepper.style.display = "none";
      drawSVG();
    }

    function syncRouteStep() {
      if (!activeRoute) return;
      const step = activeRoute.steps[routeStepIdx];
      const dCol = dirColor(step.dir);
      const dLbl = step.dir === "efferent" ? "▼ EFFERENT" : "▲ AFFERENT";
      selectedTopicId = step.topicId;
      stepper.style.borderColor = dCol;
      stepText.innerHTML = `<span class="step-pill" style="background:${dCol};">${dLbl} • Stap ${routeStepIdx + 1}/${activeRoute.steps.length}</span> ${step.text}`;
      drawSVG();
      focusStation(step.topicId, true);
      if (onSelectTopic) onSelectTopic(step.topicId, true);
    }

    function drawSVG() {
      const svgNS = "http://www.w3.org/2000/svg";
      const targetRoot = transformEl || svgWrap;
      targetRoot.innerHTML = "";

      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 820 775");
      svg.setAttribute("class", "bodymap-svg");

      // 1. VERZORGDE ANATOMISCHE ACHTERGRONDTEKENING (Vloeiend hoofd-, romp- en wervelsilhouet zonder V-inkeping)
      const bg = document.createElementNS(svgNS, "g");
      bg.innerHTML = `
        <defs>
          <radialGradient id="bodyGlow" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stop-color="#22305a" stop-opacity="0.55" />
            <stop offset="100%" stop-color="#0d1324" stop-opacity="0.15" />
          </radialGradient>
        </defs>

        <!-- Zachte Zone 1 (CZS) & Zone 2 (PZS) kaders -->
        <rect x="20" y="14" width="780" height="398" rx="22"
              fill="rgba(139, 92, 246, 0.05)" stroke="rgba(139, 92, 246, 0.25)" stroke-width="1.5" />
        <text x="38" y="30" fill="#c4b5fd" font-size="11.5" font-weight="800">CENTRAAL ZENUWSTELSEL (CZS) — Integratie, hersenregio's &amp; ruggenmerg</text>

        <rect x="20" y="424" width="780" height="340" rx="22"
              fill="rgba(56, 189, 248, 0.05)" stroke="rgba(56, 189, 248, 0.28)" stroke-width="1.5" />
        <text x="38" y="443" fill="#7dd3fc" font-size="11.5" font-weight="800">PERIFEER ZENUWSTELSEL (PZS) — 43 paar zenuwen (Afferent vs. Efferent)</text>

        <!-- Vloeiend Menselijk Silhouet (Hoofd, Hals, Schouders, Romp & Armen; gladde basis onderaan) -->
        <path d="M 240 190
                 C 214 94, 286 34, 410 34
                 C 534 34, 606 94, 580 190
                 C 564 252, 514 294, 452 308
                 C 448 334, 452 350, 474 362
                 C 548 380, 628 394, 668 446
                 C 694 480, 704 548, 694 646
                 C 686 710, 666 742, 626 750
                 C 556 762, 484 762, 410 762
                 C 336 762, 264 762, 194 750
                 C 154 742, 134 710, 126 646
                 C 116 548, 126 480, 152 446
                 C 192 394, 272 380, 346 362
                 C 368 350, 372 334, 368 308
                 C 306 294, 256 252, 240 190 Z"
              fill="url(#bodyGlow)" stroke="rgba(148, 163, 184, 0.24)" stroke-width="2" />

        <!-- Subtiele Hersen-contour, Sleutelbeenderen, Binnenromp & Wervelkolom -->
        <path d="M 272 178 C 258 108, 315 58, 410 58 C 505 58, 562 108, 548 178 C 538 228, 490 264, 410 264 C 330 264, 282 228, 272 178 Z"
              fill="rgba(139, 92, 246, 0.08)" stroke="rgba(192, 132, 252, 0.25)" stroke-width="1.5" />
        <path d="M 410 62 L 410 258" stroke="rgba(192, 132, 252, 0.2)" stroke-width="1.5" stroke-dasharray="4 4" />
        <rect x="396" y="295" width="28" height="162" rx="13"
              fill="rgba(245, 158, 11, 0.10)" stroke="rgba(245, 158, 11, 0.28)" stroke-width="1.5" />
        <path d="M 294 398 C 344 378, 382 374, 410 374 C 438 374, 476 378, 526 398"
              fill="none" stroke="rgba(148, 163, 184, 0.18)" stroke-width="1.5" stroke-linecap="round" />
        <path d="M 232 496 C 242 560, 242 642, 232 712 M 588 496 C 578 560, 578 642, 588 712"
              fill="none" stroke="rgba(148, 163, 184, 0.15)" stroke-width="1.5" stroke-linecap="round" />
        <ellipse cx="378" cy="495" rx="28" ry="42" fill="none" stroke="rgba(56, 189, 248, 0.15)" stroke-width="1.5" />
        <ellipse cx="442" cy="495" rx="28" ry="42" fill="none" stroke="rgba(249, 115, 22, 0.15)" stroke-width="1.5" />

        <!-- Taklabels links vs rechts onder PZS -->
        <text x="190" y="514" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="800">▲ SENSORISCH (AFFERENT) — naar CZS</text>
        <text x="610" y="514" text-anchor="middle" fill="#f97316" font-size="11" font-weight="800">▼ MOTORISCH (EFFERENT) — uit CZS</text>
      `;
      svg.appendChild(bg);

      const routeTopicIds = activeRoute ? activeRoute.steps.map((s) => s.topicId) : [];

      // 2. Teken de verbindingen
      BASE_LINKS.forEach((lk) => {
        const s1 = getStation(lk.from);
        const s2 = getStation(lk.to);
        if (!s1 || !s2) return;

        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", String(s1.x));
        line.setAttribute("y1", String(s1.y));
        line.setAttribute("x2", String(s2.x));
        line.setAttribute("y2", String(s2.y));
        line.setAttribute("stroke", lk.color);
        line.setAttribute("stroke-width", "3");
        line.setAttribute("stroke-opacity", activeRoute ? "0.14" : "0.45");
        if (lk.dashed) line.setAttribute("stroke-dasharray", "6 5");
        svg.appendChild(line);
      });

      // 3. Actieve prikkel-route met Afferent (#38bdf8) vs. Efferent (#f97316) kleur per segment
      if (activeRoute && activeRoute.steps.length > 1) {
        const seenEdges = new Set();
        for (let i = 1; i < activeRoute.steps.length; i++) {
          const prevSt = getStation(activeRoute.steps[i - 1].topicId);
          const nextSt = getStation(activeRoute.steps[i].topicId);
          if (!prevSt || !nextSt) continue;

          const edgeKey = [prevSt.id, nextSt.id].sort().join("|");
          const xOff = seenEdges.has(edgeKey) ? 6 : 0;
          seenEdges.add(edgeKey);

          const segLine = document.createElementNS(svgNS, "line");
          segLine.setAttribute("class", "route-seg-line");
          segLine.setAttribute("x1", String(prevSt.x + xOff));
          segLine.setAttribute("y1", String(prevSt.y));
          segLine.setAttribute("x2", String(nextSt.x + xOff));
          segLine.setAttribute("y2", String(nextSt.y));
          segLine.setAttribute("stroke", dirColor(activeRoute.steps[i].dir));
          segLine.setAttribute("stroke-width", "5.5");
          segLine.setAttribute("stroke-linecap", "round");
          svg.appendChild(segLine);
        }

        const curStep = activeRoute.steps[routeStepIdx] || activeRoute.steps[0];
        const prevStep = activeRoute.steps[Math.max(0, routeStepIdx - 1)] || curStep;
        const cur = getStation(curStep.topicId);
        const prev = getStation(prevStep.topicId);
        if (cur && prev) {
          const pulseColor = dirColor(curStep.dir);
          const segD = `M ${prev.x} ${prev.y} L ${cur.x} ${cur.y}`;

          const dot = document.createElementNS(svgNS, "circle");
          dot.setAttribute("class", "route-pulse-dot");
          dot.setAttribute("r", "8");
          dot.setAttribute("fill", "#ffffff");
          dot.setAttribute("stroke", pulseColor);
          dot.setAttribute("stroke-width", "4");

          const anim = document.createElementNS(svgNS, "animateMotion");
          anim.setAttribute("dur", "1.1s");
          anim.setAttribute("repeatCount", "indefinite");
          anim.setAttribute("path", segD);
          dot.appendChild(anim);
          svg.appendChild(dot);
        }
      }

      const activeStepObj = activeRoute ? (activeRoute.steps[routeStepIdx] || activeRoute.steps[0]) : null;

      // 4. Teken alle strakke stationsblokjes (zonder overlap)
      BODY_STATIONS.forEach((st) => {
        const isSelected = st.id === selectedTopicId;
        const isSpeakingHere = st.id === speakingTopicId && speakingStatus !== "idle";
        const matchingSteps = activeRoute
          ? activeRoute.steps.map((s, idx) => ({ s, idx })).filter((item) => item.s.topicId === st.id)
          : [];
        const isInRoute = matchingSteps.length > 0;
        const dimmed = activeRoute && !isInRoute;

        const g = document.createElementNS(svgNS, "g");
        g.style.cursor = "pointer";
        g.style.opacity = dimmed ? "0.26" : "1";

        let badgeColor = st.color;
        let badgeIdx = -1;
        if (isInRoute) {
          const curHit = matchingSteps.find((m) => m.idx === routeStepIdx) || matchingSteps[0];
          badgeIdx = curHit.idx;
          badgeColor = dirColor(curHit.s.dir);
        }

        const strokeCol = isSelected && activeStepObj && activeStepObj.topicId === st.id
          ? dirColor(activeStepObj.dir)
          : (isSpeakingHere ? "#38bdf8" : st.color);

        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", String(st.x - st.w / 2));
        rect.setAttribute("y", String(st.y - st.h / 2));
        rect.setAttribute("width", String(st.w));
        rect.setAttribute("height", String(st.h));
        rect.setAttribute("rx", "9");
        rect.setAttribute("fill", isSelected ? strokeCol : "#131b30");
        rect.setAttribute("stroke", strokeCol);
        rect.setAttribute("stroke-width", isSelected || isSpeakingHere ? "3.2" : "2");
        g.appendChild(rect);

        const title = document.createElementNS(svgNS, "text");
        title.setAttribute("x", String(st.x));
        title.setAttribute("y", String(st.y - 2));
        title.setAttribute("text-anchor", "middle");
        title.setAttribute("fill", isSelected ? "#08101f" : "#f8fafc");
        title.setAttribute("font-size", "10.8");
        title.setAttribute("font-weight", "800");
        title.textContent = st.label;
        g.appendChild(title);

        const sub = document.createElementNS(svgNS, "text");
        sub.setAttribute("x", String(st.x));
        sub.setAttribute("y", String(st.y + 11));
        sub.setAttribute("text-anchor", "middle");
        sub.setAttribute("fill", isSelected ? "#131b30" : "#94a3b8");
        sub.setAttribute("font-size", "8.9");
        sub.setAttribute("font-weight", "600");
        sub.textContent = st.sub;
        g.appendChild(sub);

        if (isInRoute) {
          const badge = document.createElementNS(svgNS, "circle");
          badge.setAttribute("cx", String(st.x - st.w / 2 + 4));
          badge.setAttribute("cy", String(st.y - st.h / 2 + 4));
          badge.setAttribute("r", "10");
          badge.setAttribute("fill", badgeColor);
          g.appendChild(badge);

          const num = document.createElementNS(svgNS, "text");
          num.setAttribute("x", String(st.x - st.w / 2 + 4));
          num.setAttribute("y", String(st.y - st.h / 2 + 8));
          num.setAttribute("text-anchor", "middle");
          num.setAttribute("fill", "#08101f");
          num.setAttribute("font-size", "11");
          num.setAttribute("font-weight", "900");
          num.textContent = String(badgeIdx + 1);
          g.appendChild(num);
        }

        if (isSpeakingHere) {
          const sx = st.x + st.w / 2 - 4;
          const sy = st.y - st.h / 2 + 4;
          const spkBg = document.createElementNS(svgNS, "circle");
          spkBg.setAttribute("class", "map-speaking-badge");
          spkBg.setAttribute("cx", String(sx));
          spkBg.setAttribute("cy", String(sy));
          spkBg.setAttribute("r", "10");
          spkBg.setAttribute("fill", speakingStatus === "paused" ? "#f59e0b" : "#38bdf8");
          spkBg.setAttribute("stroke", "#08101f");
          spkBg.setAttribute("stroke-width", "1.5");
          g.appendChild(spkBg);

          const bars = speakingStatus === "paused"
            ? `<rect x="${sx - 3.2}" y="${sy - 4}" width="2.2" height="8" rx="0.8" fill="#08101f"/><rect x="${sx + 1}" y="${sy - 4}" width="2.2" height="8" rx="0.8" fill="#08101f"/>`
            : `<rect x="${sx - 4}" y="${sy - 2.5}" width="2" height="5" rx="0.8" fill="#08101f"/><rect x="${sx - 1}" y="${sy - 5}" width="2" height="10" rx="0.8" fill="#08101f"/><rect x="${sx + 2}" y="${sy - 3.5}" width="2" height="7" rx="0.8" fill="#08101f"/>`;
          const icoG = document.createElementNS(svgNS, "g");
          icoG.innerHTML = bars;
          g.appendChild(icoG);
        }

        g.addEventListener("click", () => {
          if (Date.now() - lastGestureTime < 280) return;
          selectedTopicId = st.id;
          if (activeRoute) {
            const idx = routeTopicIds.indexOf(st.id);
            if (idx !== -1) {
              routeStepIdx = idx;
              syncRouteStep();
              resetAutoTimer();
              return;
            } else {
              stimSelect.value = "";
              stopRoute();
            }
          }
          drawSVG();
          focusStation(st.id, false);
          if (onSelectTopic) onSelectTopic(st.id, false);
        });

        svg.appendChild(g);
      });

      targetRoot.appendChild(svg);
    }

    drawSVG();
    updateTransform(true);

    return {
      setSelected(topicId) {
        selectedTopicId = topicId;
        drawSVG();
        focusStation(topicId, false);
      },
      setSpeaking(topicId, status) {
        speakingTopicId = topicId || null;
        speakingStatus = status || "idle";
        drawSVG();
      },
      onShow() {
        drawSVG();
        focusStation(selectedTopicId, true);
      }
    };
  }

  return { createBodyMapController, BODY_STATIONS };
})();
