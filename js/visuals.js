// Geordende Anatomische Lichaams-Metrokaart met Prikkel-Dropdown
// Kloppende hiërarchie: CZS boven • PZS (43 paar -> Afferent & Efferent -> Somatisch/Motor-unit & Autonoom) onder
// Geen overlap tussen tekst/blokjes; eigen SVG-iconen; 100% uit samenvatting-hoofdstuk-3.txt

window.NeuroVisuals = (function () {
  // Ruim raster (viewBox 0 0 820 770) met gegarandeerd >= 20px marge rond elk blokje
  const BODY_STATIONS = [
    // --- CZS (Hoofd, Brein & Ruggenmerg) ---
    { id: "czs-overzicht",        label: "CZS Overzicht",            sub: ">100 mld neuronen",        x: 135, y: 58,  w: 164, h: 36, color: "#8b5cf6" },
    { id: "primaire-motorcortex", label: "Primaire motorcortex",     sub: "Precentrale gyrus",        x: 410, y: 58,  w: 192, h: 36, color: "#c084fc" },

    { id: "frontale-kwab",        label: "Frontale kwab",            sub: "Planning & motoriek",      x: 120, y: 120, w: 152, h: 36, color: "#8b5cf6" },
    { id: "premotorcortex",       label: "Premotorcortex",           sub: "Opslag vaardigheden",      x: 312, y: 120, w: 152, h: 36, color: "#a855f7" },
    { id: "parietale-kwab",       label: "Pariëtale kwab",           sub: "Tast, pijn, temp, ruimte", x: 506, y: 120, w: 156, h: 36, color: "#6366f1" },
    { id: "occipitale-kwab",      label: "Occipitale kwab",          sub: "Zicht",                    x: 700, y: 120, w: 152, h: 36, color: "#0ea5e9" },

    { id: "temporele-kwab",       label: "Temporele kwab",           sub: "Gehoor",                   x: 130, y: 182, w: 156, h: 36, color: "#3b82f6" },
    { id: "cerebrum",             label: "Corpus callosum & Cortex", sub: "2 hemisferen • Grijze stof", x: 410, y: 182, w: 204, h: 36, color: "#d946ef" },
    { id: "centrale-insula",      label: "Centrale insula",          sub: "5e kwab • Emoties",        x: 685, y: 182, w: 156, h: 36, color: "#ec4899" },

    { id: "basale-ganglia",       label: "Basale ganglia",           sub: "Armzwaai & spiertonus",    x: 185, y: 244, w: 164, h: 36, color: "#f43f5e" },
    { id: "thalamus",             label: "Thalamus",                 sub: "Schakelstation (geen reuk)", x: 410, y: 244, w: 178, h: 36, color: "#e879f9" },
    { id: "hypothalamus",         label: "Hypothalamus",             sub: "Homeostase",               x: 635, y: 244, w: 164, h: 36, color: "#fb7185" },

    { id: "reticulaire-formatie", label: "Reticulaire formatie",     sub: "Arousal & pijncontrole",   x: 185, y: 308, w: 172, h: 36, color: "#eab308" },
    { id: "hersenstam",           label: "Hersenstam",               sub: "Midden / Pons / Medulla",  x: 410, y: 308, w: 172, h: 36, color: "#fbbf24" },
    { id: "cerebellum",           label: "Cerebellum",               sub: "Vergelijkt plan & uitvoer", x: 635, y: 308, w: 172, h: 36, color: "#f59e0b" },

    { id: "ruggenmerg",           label: "Ruggenmerg (CZS)",         sub: "Tractussen & reflexen",    x: 410, y: 374, w: 186, h: 36, color: "#d97706" },

    // --- PZS (Overkoepelende boom: 43 paar -> Afferent links, Efferent rechts) ---
    { id: "pzs-overzicht",        label: "PZS: 43 paar zenuwen",     sub: "12 craniaal + 31 spinaal", x: 410, y: 470, w: 230, h: 38, color: "#38bdf8" },

    // Linker PZS-tak: Sensorisch (Afferent) -> gaat naar PZS / CZS
    { id: "afferent-receptoren",   label: "Sensorisch (Afferent): 5 Receptoren",   sub: "Mechano, Thermo, Noci, Foto, Chemo",       x: 185, y: 548, w: 274, h: 38, color: "#38bdf8" },
    { id: "gewrichtssensoren",     label: "Gewrichtssensoren (Afferent)",          sub: "Vrije uiteinden & Kinesthetisch",          x: 185, y: 608, w: 274, h: 38, color: "#0ea5e9" },
    { id: "spierspoeltjes",        label: "Spierspoeltjes (Rekbewakers)",          sub: "4–20 intrafusale vezels • γ-voorspanning", x: 185, y: 668, w: 274, h: 38, color: "#06b6d4" },
    { id: "golgi-peeslichaampjes", label: "Golgi-peeslichaampjes (Pees)",          sub: "5–25 vezels • Autogene inhibitie",         x: 185, y: 728, w: 274, h: 38, color: "#14b8a6" },

    // Rechter PZS-tak: Motorisch (Efferent) -> Somatisch (Motor-unit) & Autonoom (Sympathisch/Parasympathisch)
    { id: "efferent-divisies",     label: "Motorisch (Efferent): Somatisch & Autonoom", sub: "Skeletspier vs. Glad/Hart/Klieren",   x: 635, y: 548, w: 280, h: 38, color: "#f97316" },
    { id: "motorische-eenheid",    label: "Motorische Eenheid (Motor-unit)",       sub: "1 α-neuron • Homogeen • 1:15 vs 1:2.000", x: 635, y: 608, w: 280, h: 38, color: "#fb923c" },
    { id: "sympathisch",           label: "Autonoom: Sympathisch",                 sub: "Fight or Flight • Noradrenaline",          x: 635, y: 668, w: 280, h: 38, color: "#ef4444" },
    { id: "parasympathisch",       label: "Autonoom: Parasympathisch",             sub: "Rest and Digest • Acetylcholine",          x: 635, y: 728, w: 280, h: 38, color: "#10b981" }
  ];

  // Nette orthogonaal-vloeiende verbindingslijnen
  const BASE_LINKS = [
    // CZS verbindingen
    { from: "frontale-kwab", to: "premotorcortex", color: "#a855f7" },
    { from: "premotorcortex", to: "primaire-motorcortex", color: "#c084fc" },
    { from: "primaire-motorcortex", to: "hersenstam", color: "#c084fc" },
    { from: "cerebrum", to: "thalamus", color: "#d946ef" },
    { from: "basale-ganglia", to: "thalamus", color: "#f43f5e" },
    { from: "hypothalamus", to: "hersenstam", color: "#fb7185" },
    { from: "thalamus", to: "parietale-kwab", color: "#6366f1" },
    { from: "thalamus", to: "occipitale-kwab", color: "#0ea5e9" },
    { from: "thalamus", to: "temporele-kwab", color: "#3b82f6" },
    { from: "hersenstam", to: "reticulaire-formatie", color: "#eab308" },
    { from: "hersenstam", to: "cerebellum", color: "#f59e0b" },
    { from: "hersenstam", to: "thalamus", color: "#e879f9" },
    { from: "hersenstam", to: "ruggenmerg", color: "#d97706" },

    // Brug CZS <-> PZS
    { from: "ruggenmerg", to: "pzs-overzicht", color: "#38bdf8" },

    // PZS Boomstructuur: PZS -> Afferent (links) & Efferent (rechts)
    { from: "afferent-receptoren", to: "pzs-overzicht", color: "#38bdf8", dashed: true },
    { from: "gewrichtssensoren", to: "afferent-receptoren", color: "#0ea5e9", dashed: true },
    { from: "spierspoeltjes", to: "gewrichtssensoren", color: "#06b6d4", dashed: true },
    { from: "golgi-peeslichaampjes", to: "spierspoeltjes", color: "#14b8a6", dashed: true },
    { from: "pzs-overzicht", to: "efferent-divisies", color: "#f97316" },
    { from: "efferent-divisies", to: "motorische-eenheid", color: "#fb923c" },
    { from: "motorische-eenheid", to: "sympathisch", color: "#ef4444" },
    { from: "sympathisch", to: "parasympathisch", color: "#10b981" }
  ];

  function getStation(id) {
    return BODY_STATIONS.find((s) => s.id === id);
  }

  function createBodyMapController(container, data, onSelectTopic, onViewIn3D) {
    let selectedTopicId = "frontale-kwab";
    let activeRoute = null;
    let routeStepIdx = 0;
    const brainIco = (window.NEURO_ICONS && window.NEURO_ICONS.brain) || "";

    container.innerHTML = `
      <div class="bodymap-layout">
        <!-- Strakke prikkel-dropdown + Bekijk in 3D (past perfect op mobiel en PC) -->
        <div class="stimulus-bar">
          <label for="stim-select" class="stim-bar-label">Prikkel:</label>
          <select id="stim-select" class="stim-select" aria-label="Kies een prikkel om over de metrokaart te volgen">
            <option value="">Kies prikkel om te volgen...</option>
            ${data.signalRoutes.map((r) => `<option value="${r.id}">${r.label}</option>`).join("")}
          </select>
          <button type="button" class="stim-clear-btn" id="btn-clear-route" style="display:none;">Reset</button>
          <button type="button" class="step-ctrl-btn primary map-3d-btn" id="btn-map-to-3d" title="Bekijk geselecteerd onderdeel in 3D">
            <span class="svg-ico">${brainIco}</span>
            <span>Bekijk in 3D</span>
          </button>
        </div>

        <!-- Stap-balk tijdens actieve prikkel -->
        <div class="route-stepper" id="route-stepper" style="display:none;">
          <div class="route-step-text" id="route-step-text"></div>
          <div class="route-step-controls">
            <button type="button" class="step-ctrl-btn" id="btn-prev-step">Vorige</button>
            <button type="button" class="step-ctrl-btn primary" id="btn-next-step">Volgende</button>
            <button type="button" class="step-ctrl-btn" id="btn-step-to-3d" title="Bekijk deze stap in 3D">In 3D</button>
          </div>
        </div>

        <!-- SVG Menselijk Lichaam + Brein Metrokaart -->
        <div class="bodymap-svg-wrap" id="bodymap-svg-wrap"></div>
      </div>
    `;

    const stimSelect = container.querySelector("#stim-select");
    const clearBtn = container.querySelector("#btn-clear-route");
    const stepper = container.querySelector("#route-stepper");
    const stepText = container.querySelector("#route-step-text");
    const svgWrap = container.querySelector("#bodymap-svg-wrap");

    container.querySelector("#btn-map-to-3d").addEventListener("click", () => {
      if (onViewIn3D) onViewIn3D(selectedTopicId);
    });
    container.querySelector("#btn-step-to-3d").addEventListener("click", () => {
      if (onViewIn3D) onViewIn3D(selectedTopicId);
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

    clearBtn.addEventListener("click", () => {
      stimSelect.value = "";
      stopRoute();
    });

    container.querySelector("#btn-prev-step").addEventListener("click", () => {
      if (!activeRoute) return;
      routeStepIdx = (routeStepIdx - 1 + activeRoute.steps.length) % activeRoute.steps.length;
      syncRouteStep();
    });

    container.querySelector("#btn-next-step").addEventListener("click", () => {
      if (!activeRoute) return;
      routeStepIdx = (routeStepIdx + 1) % activeRoute.steps.length;
      syncRouteStep();
    });

    function startRoute(route) {
      activeRoute = route;
      routeStepIdx = 0;
      clearBtn.style.display = "inline-flex";
      stepper.style.display = "flex";
      stepper.style.borderColor = route.color;
      syncRouteStep();
    }

    function stopRoute() {
      activeRoute = null;
      clearBtn.style.display = "none";
      stepper.style.display = "none";
      drawSVG();
    }

    function syncRouteStep() {
      if (!activeRoute) return;
      const step = activeRoute.steps[routeStepIdx];
      selectedTopicId = step.topicId;
      stepText.innerHTML = `<span class="step-pill" style="background:${activeRoute.color};">Stap ${routeStepIdx + 1}/${activeRoute.steps.length}</span> ${step.text}`;
      drawSVG();
      if (onSelectTopic) onSelectTopic(step.topicId, true);
    }

    function drawSVG() {
      const svgNS = "http://www.w3.org/2000/svg";
      svgWrap.innerHTML = "";

      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 820 775");
      svg.setAttribute("class", "bodymap-svg");

      // 1. VERZORGDE ANATOMISCHE ACHTERGRONDTEKENING (Hoofd/Brein, Wervelkolom, Organen, Spieren/Gewricht)
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
        <text x="38" y="34" fill="#c4b5fd" font-size="11.5" font-weight="800">CENTRAAL ZENUWSTELSEL (CZS) — Integratie, banen &amp; tractussen</text>

        <rect x="20" y="424" width="780" height="340" rx="22"
              fill="rgba(56, 189, 248, 0.05)" stroke="rgba(56, 189, 248, 0.28)" stroke-width="1.5" />
        <text x="38" y="444" fill="#7dd3fc" font-size="11.5" font-weight="800">PERIFEER ZENUWSTELSEL (PZS) — 43 paar zenuwen, receptoren &amp; motor-units</text>

        <!-- Menselijk Lichaam & Vergrote Schedel/Brein Silhouet -->
        <path d="M 245 190
                 C 220 95, 290 36, 410 36
                 C 530 36, 600 95, 575 190
                 C 562 245, 515 295, 455 310
                 L 455 352
                 L 595 385
                 C 655 400, 695 450, 690 545
                 L 668 748
                 L 510 748
                 L 495 570
                 L 410 645
                 L 325 570
                 L 310 748
                 L 152 748
                 L 130 545
                 C 125 450, 165 400, 225 385
                 L 365 352
                 L 365 310
                 C 305 295, 258 245, 245 190 Z"
              fill="url(#bodyGlow)" stroke="rgba(148, 163, 184, 0.26)" stroke-width="2" />

        <!-- Subtiele Hersen-contour & Hersenwindingen in de achtergrond -->
        <path d="M 272 178 C 258 108, 315 58, 410 58 C 505 58, 562 108, 548 178 C 538 228, 490 264, 410 264 C 330 264, 282 228, 272 178 Z"
              fill="rgba(139, 92, 246, 0.08)" stroke="rgba(192, 132, 252, 0.25)" stroke-width="1.5" />
        <path d="M 410 62 L 410 258" stroke="rgba(192, 132, 252, 0.2)" stroke-width="1.5" stroke-dasharray="4 4" />

        <!-- Wervelkolom-segmenten (Ruggenmerg) -->
        <rect x="394" y="295" width="32" height="145" rx="14"
              fill="rgba(245, 158, 11, 0.10)" stroke="rgba(245, 158, 11, 0.30)" stroke-width="1.5" />

        <!-- Symmetrische ribbenkast / hart / long-accenten (achtergrond) -->
        <ellipse cx="378" cy="495" rx="28" ry="42" fill="none" stroke="rgba(56, 189, 248, 0.15)" stroke-width="1.5" />
        <ellipse cx="442" cy="495" rx="28" ry="42" fill="none" stroke="rgba(249, 115, 22, 0.15)" stroke-width="1.5" />

        <!-- Taklabels links vs rechts onder PZS -->
        <text x="185" y="514" text-anchor="middle" fill="#38bdf8" font-size="11" font-weight="800">▲ SENSORISCH (AFFERENT) — naar CZS</text>
        <text x="635" y="514" text-anchor="middle" fill="#f97316" font-size="11" font-weight="800">▼ MOTORISCH (EFFERENT) — uit CZS</text>
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

      // 3. Actieve prikkel-route + bewegende puls
      if (activeRoute && activeRoute.steps.length > 1) {
        const pts = activeRoute.steps.map((st) => getStation(st.topicId)).filter(Boolean);
        const pathD = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");

        const activePath = document.createElementNS(svgNS, "path");
        activePath.setAttribute("d", pathD);
        activePath.setAttribute("fill", "none");
        activePath.setAttribute("stroke", activeRoute.color);
        activePath.setAttribute("stroke-width", "5.5");
        activePath.setAttribute("stroke-linecap", "round");
        activePath.setAttribute("stroke-linejoin", "round");
        svg.appendChild(activePath);

        const cur = pts[routeStepIdx] || pts[0];
        const prev = pts[Math.max(0, routeStepIdx - 1)] || pts[0];
        const segD = `M ${prev.x} ${prev.y} L ${cur.x} ${cur.y}`;

        const dot = document.createElementNS(svgNS, "circle");
        dot.setAttribute("r", "8");
        dot.setAttribute("fill", "#ffffff");
        dot.setAttribute("stroke", activeRoute.color);
        dot.setAttribute("stroke-width", "4");

        const anim = document.createElementNS(svgNS, "animateMotion");
        anim.setAttribute("dur", "1.1s");
        anim.setAttribute("repeatCount", "indefinite");
        anim.setAttribute("path", segD);
        dot.appendChild(anim);
        svg.appendChild(dot);
      }

      // 4. Teken alle strakke stationsblokjes (zonder overlap)
      BODY_STATIONS.forEach((st) => {
        const isSelected = st.id === selectedTopicId;
        const routeIdx = routeTopicIds.indexOf(st.id);
        const isInRoute = routeIdx !== -1;
        const dimmed = activeRoute && !isInRoute;

        const g = document.createElementNS(svgNS, "g");
        g.style.cursor = "pointer";
        g.style.opacity = dimmed ? "0.26" : "1";

        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", String(st.x - st.w / 2));
        rect.setAttribute("y", String(st.y - st.h / 2));
        rect.setAttribute("width", String(st.w));
        rect.setAttribute("height", String(st.h));
        rect.setAttribute("rx", "9");
        rect.setAttribute("fill", isSelected ? st.color : "#131b30");
        rect.setAttribute("stroke", st.color);
        rect.setAttribute("stroke-width", isSelected ? "3.2" : "2");
        g.appendChild(rect);

        const title = document.createElementNS(svgNS, "text");
        title.setAttribute("x", String(st.x));
        title.setAttribute("y", String(st.y - 2));
        title.setAttribute("text-anchor", "middle");
        title.setAttribute("fill", isSelected ? "#08101f" : "#f8fafc");
        title.setAttribute("font-size", "11.2");
        title.setAttribute("font-weight", "800");
        title.textContent = st.label;
        g.appendChild(title);

        const sub = document.createElementNS(svgNS, "text");
        sub.setAttribute("x", String(st.x));
        sub.setAttribute("y", String(st.y + 12));
        sub.setAttribute("text-anchor", "middle");
        sub.setAttribute("fill", isSelected ? "#131b30" : "#94a3b8");
        sub.setAttribute("font-size", "9.2");
        sub.setAttribute("font-weight", "600");
        sub.textContent = st.sub;
        g.appendChild(sub);

        if (isInRoute) {
          const badge = document.createElementNS(svgNS, "circle");
          badge.setAttribute("cx", String(st.x - st.w / 2 + 4));
          badge.setAttribute("cy", String(st.y - st.h / 2 + 4));
          badge.setAttribute("r", "10");
          badge.setAttribute("fill", activeRoute.color);
          g.appendChild(badge);

          const num = document.createElementNS(svgNS, "text");
          num.setAttribute("x", String(st.x - st.w / 2 + 4));
          num.setAttribute("y", String(st.y - st.h / 2 + 8));
          num.setAttribute("text-anchor", "middle");
          num.setAttribute("fill", "#08101f");
          num.setAttribute("font-size", "11");
          num.setAttribute("font-weight", "900");
          num.textContent = String(routeIdx + 1);
          g.appendChild(num);
        }

        g.addEventListener("click", () => {
          selectedTopicId = st.id;
          if (activeRoute) {
            const idx = routeTopicIds.indexOf(st.id);
            if (idx !== -1) {
              routeStepIdx = idx;
              syncRouteStep();
              return;
            } else {
              stimSelect.value = "";
              stopRoute();
            }
          }
          drawSVG();
          if (onSelectTopic) onSelectTopic(st.id, false);
        });

        svg.appendChild(g);
      });

      svgWrap.appendChild(svg);
    }

    drawSVG();

    return {
      setSelected(topicId) {
        selectedTopicId = topicId;
        drawSVG();
      }
    };
  }

  return { createBodyMapController, BODY_STATIONS };
})();
