// Minimalistische hoofdcontroller: 3D-Brein + Lichaams-Metrokaart + Kaart→3D + Audio Pauze/Verder + Hoofdstuktekst + Uitgebreide Overhoring
// Geen standaard emoticons, geen verspringende schermen, inhoud 100% uit hoofdstuk3.docx & samenvatting-hoofdstuk-3.txt

(function () {
  const DATA = window.NEURO_DATA;
  const ICONS = window.NEURO_ICONS;

  const state = {
    view: "3d", // "3d" | "map" | "quiz"
    selectedId: "frontale-kwab",
    dyslexia: false,
    showQuote: false,
    modalOpen: false,
    modalTopicId: null,
    viewer3D: null,
    bodyMap: null,
    quizPool: [],
    quizPos: 0,
    quizAnswered: false,
    chosenIdx: null,
    correctCount: 0,
    wrongItems: [],
    quizFinished: false,
    isRetryMode: false
  };

  // Echte Play / Pauze / Verder / Stop controller met zin- en karakterpositie-tracking
  const speech = {
    status: "idle", // "idle" | "playing" | "paused"
    topicId: null,
    chunks: [],
    chunkIdx: 0,
    charOffset: 0,
    baseOffset: 0,
    pausedViaCancel: false,
    suppressEnd: false,
    activeUtterance: null,
    sessionId: 0
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getTopicById(id) {
    return DATA.topics.find((x) => x.id === id) || DATA.topics[0];
  }

  function getChapterParagraphs(topic) {
    if (Array.isArray(topic.chapterText) && topic.chapterText.length > 0) {
      return topic.chapterText;
    }
    return [topic.exactQuote || ""];
  }

  function cleanTextForSpeech(text) {
    return String(text)
      .replace(/<[^>]+>/g, " ")
      .replace(/→/g, " naar ")
      .replace(/↑/g, " neemt toe ")
      .replace(/↓/g, " daalt ")
      .replace(/•/g, ", ")
      .replace(/\bα-/g, "alfa-")
      .replace(/\bβ-/g, "bèta-")
      .replace(/\bγ-/g, "gamma-")
      .replace(/α/g, "alfa")
      .replace(/β/g, "bèta")
      .replace(/γ/g, "gamma")
      .replace(/\s+/g, " ")
      .trim();
  }

  function splitParagraphsIntoSentences(items) {
    const out = [];
    items.forEach((raw) => {
      const cleaned = cleanTextForSpeech(raw);
      if (!cleaned) return;
      // Splits op zinseinden (. ! ? ;) maar behoud afkortingen en korte delen bij elkaar
      const parts = cleaned.match(/[^.!?]+(?:[.!?]+|$)/g) || [cleaned];
      parts.forEach((p) => {
        const s = p.trim();
        if (s) out.push(s);
      });
    });
    return out;
  }

  function findWordBoundaryStart(text, approxOffset) {
    if (!approxOffset || approxOffset <= 0) return 0;
    if (approxOffset >= text.length) return text.length;
    let pos = approxOffset;
    while (pos > 0 && !/\s/.test(text[pos - 1])) {
      pos -= 1;
    }
    return pos;
  }

  function loadScript(url, timeoutMs) {
    return new Promise((resolve) => {
      let done = false;
      const t = setTimeout(() => { if (!done) { done = true; resolve(false); } }, timeoutMs);
      const s = document.createElement("script");
      s.src = url;
      s.async = true;
      s.onload = () => { if (!done) { done = true; clearTimeout(t); resolve(true); } };
      s.onerror = () => { if (!done) { done = true; clearTimeout(t); resolve(false); } };
      (document.head || document.documentElement).appendChild(s);
    });
  }

  async function init() {
    document.querySelectorAll("[data-icon]").forEach((el) => {
      const key = el.getAttribute("data-icon");
      if (ICONS[key]) el.innerHTML = ICONS[key];
    });

    setupTopBar();
    setupModal();
    renderQuickStrip();
    renderDockCard();
    updateSpeakButtons();
    startQuizRound(DATA.questions, false);

    state.bodyMap = window.NeuroVisuals.createBodyMapController(
      document.getElementById("bodymap-container"),
      DATA,
      (topicId, fromRoute) => {
        selectTopic(topicId, !fromRoute);
      },
      (topicId) => {
        viewTopicIn3D(topicId);
      }
    );

    // Laad Three.js voor het zelfgemaakte anatomische 3D-brein
    if (!window.THREE) {
      await loadScript("https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js", 1800);
    }
    init3DPane();
  }

  function setupTopBar() {
    document.querySelectorAll(".view-tab").forEach((btn) => {
      btn.addEventListener("click", () => setView(btn.dataset.view));
    });

    const btnDys = document.getElementById("btn-dyslexia");
    btnDys.addEventListener("click", () => {
      state.dyslexia = !state.dyslexia;
      document.body.classList.toggle("dyslexia-mode", state.dyslexia);
      btnDys.classList.toggle("is-on", state.dyslexia);
    });

    document.getElementById("btn-speak").addEventListener("click", () => {
      if (speech.status === "playing") {
        pauseSpeaking();
        return;
      }
      if (speech.status === "paused") {
        resumeSpeaking();
        return;
      }
      const activeTopicId = state.modalOpen && state.modalTopicId ? state.modalTopicId : state.selectedId;
      startTopicSpeech(activeTopicId, state.showQuote || state.modalOpen ? "chapter" : "full");
    });

    document.getElementById("btn-speak-stop").addEventListener("click", stopSpeaking);
  }

  function setView(v) {
    state.view = v;
    document.querySelectorAll(".view-tab").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.view === v);
    });
    document.getElementById("pane-3d").classList.toggle("is-active", v === "3d");
    document.getElementById("pane-map").classList.toggle("is-active", v === "map");
    document.getElementById("pane-quiz").classList.toggle("is-active", v === "quiz");
    renderDockCard();
  }

  function viewTopicIn3D(topicId) {
    const tid = topicId || state.selectedId;
    setView("3d");
    selectTopic(tid, true);
  }

  // ==================== AUDIO CONTROLLER (SPEEL / PAUZE / VERDER / STOP) ====================
  function startTopicSpeech(topicId, mode) {
    const t = getTopicById(topicId || state.selectedId);
    const paras = getChapterParagraphs(t);
    const rawItems = mode === "chapter"
      ? [t.title, ...paras]
      : [t.title, ...t.bullets, "Uit hoofdstuk drie.", ...paras];
    const sentences = splitParagraphsIntoSentences(rawItems);
    if (sentences.length === 0) return;

    speech.sessionId += 1;
    speech.topicId = t.id;
    speech.chunks = sentences;
    speech.chunkIdx = 0;
    speech.charOffset = 0;
    speech.baseOffset = 0;
    speech.pausedViaCancel = false;
    speech.status = "playing";

    speakCurrentChunk(false);
    updateSpeakButtons();
  }

  function speakCurrentChunk(fromCharOffset) {
    if (!("speechSynthesis" in window)) {
      stopSpeaking();
      return;
    }
    if (speech.chunkIdx >= speech.chunks.length) {
      stopSpeaking();
      return;
    }

    const synth = window.speechSynthesis;
    const sid = speech.sessionId;
    const fullChunk = speech.chunks[speech.chunkIdx];
    const startIdx = fromCharOffset ? findWordBoundaryStart(fullChunk, speech.charOffset) : 0;
    const textToSpeak = fullChunk.slice(startIdx).trim();

    if (!textToSpeak) {
      speech.chunkIdx += 1;
      speech.charOffset = 0;
      speech.baseOffset = 0;
      speakCurrentChunk(false);
      return;
    }

    speech.baseOffset = startIdx;
    speech.suppressEnd = true;
    synth.cancel();
    speech.suppressEnd = false;

    const u = new SpeechSynthesisUtterance(textToSpeak);
    u.lang = "nl-NL";
    u.rate = 0.96;
    speech.activeUtterance = u;

    u.onboundary = (ev) => {
      if (sid !== speech.sessionId || speech.activeUtterance !== u) return;
      if (typeof ev.charIndex === "number") {
        speech.charOffset = speech.baseOffset + ev.charIndex;
      }
    };

    u.onend = () => {
      if (sid !== speech.sessionId || speech.activeUtterance !== u || speech.suppressEnd) return;
      if (speech.status !== "playing") return;
      speech.chunkIdx += 1;
      speech.charOffset = 0;
      speech.baseOffset = 0;
      if (speech.chunkIdx >= speech.chunks.length) {
        stopSpeaking();
      } else {
        speakCurrentChunk(false);
      }
    };

    u.onerror = () => {
      if (sid !== speech.sessionId || speech.activeUtterance !== u || speech.suppressEnd) return;
      stopSpeaking();
    };

    synth.speak(u);
  }

  function pauseSpeaking() {
    if (speech.status !== "playing") return;
    speech.status = "paused";

    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      if (typeof synth.pause === "function") {
        synth.pause();
      }
      // Fallback voor omgevingen zonder werkende native synth.pause()
      if (!synth.paused) {
        speech.pausedViaCancel = true;
        speech.suppressEnd = true;
        synth.cancel();
        speech.suppressEnd = false;
      } else {
        speech.pausedViaCancel = false;
      }
    }
    updateSpeakButtons();
  }

  function resumeSpeaking() {
    if (speech.status !== "paused") return;
    speech.status = "playing";

    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      if (!speech.pausedViaCancel && typeof synth.resume === "function" && synth.paused) {
        synth.resume();
      } else {
        speech.pausedViaCancel = false;
        speakCurrentChunk(true);
      }
    }
    updateSpeakButtons();
  }

  function stopSpeaking() {
    speech.sessionId += 1;
    speech.suppressEnd = true;
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    speech.suppressEnd = false;
    speech.activeUtterance = null;
    speech.status = "idle";
    speech.topicId = null;
    speech.chunks = [];
    speech.chunkIdx = 0;
    speech.charOffset = 0;
    speech.baseOffset = 0;
    speech.pausedViaCancel = false;
    updateSpeakButtons();
  }

  function toggleChapterSpeech(topicId) {
    const tid = topicId || state.selectedId;
    if (speech.topicId === tid) {
      if (speech.status === "playing") {
        pauseSpeaking();
        return;
      }
      if (speech.status === "paused") {
        resumeSpeaking();
        return;
      }
    }
    startTopicSpeech(tid, "chapter");
  }

  function updateSpeakButtons() {
    const isPlaying = speech.status === "playing";
    const isPaused = speech.status === "paused";
    const isActive = isPlaying || isPaused;

    const topBtn = document.getElementById("btn-speak");
    const topStop = document.getElementById("btn-speak-stop");
    if (topBtn) {
      topBtn.classList.toggle("is-on", isPlaying);
      topBtn.classList.toggle("is-paused", isPaused);
      const ico = topBtn.querySelector(".svg-ico");
      const lbl = topBtn.querySelector("span:last-child");
      if (ico) ico.innerHTML = isPlaying ? ICONS.pause : (isPaused ? ICONS.play : ICONS.speaker);
      if (lbl) lbl.textContent = isPlaying ? "Pauze" : (isPaused ? "Verder" : "Stem");
    }
    if (topStop) topStop.style.display = isActive ? "inline-flex" : "none";

    const dockSameTopic = speech.topicId === state.selectedId;
    const dockPlaying = isPlaying && dockSameTopic;
    const dockPaused = isPaused && dockSameTopic;
    const dockBtn = document.getElementById("btn-dock-speak");
    const dockStop = document.getElementById("btn-dock-speak-stop");
    if (dockBtn) {
      dockBtn.classList.toggle("is-open", dockPlaying);
      dockBtn.classList.toggle("is-paused", dockPaused);
      const dIco = dockPlaying ? ICONS.pause : (dockPaused ? ICONS.play : ICONS.speaker);
      const dLbl = dockPlaying ? "Pauze" : (dockPaused ? "Verder" : "Lees voor");
      dockBtn.innerHTML = `<span class="svg-ico">${dIco}</span><span>${dLbl}</span>`;
    }
    if (dockStop) dockStop.style.display = (dockPlaying || dockPaused) ? "inline-flex" : "none";

    const modalTid = state.modalTopicId || state.selectedId;
    const modalSameTopic = speech.topicId === modalTid;
    const modalPlaying = isPlaying && modalSameTopic;
    const modalPaused = isPaused && modalSameTopic;
    const modalBtn = document.getElementById("btn-modal-speak");
    const modalIco = document.getElementById("btn-modal-speak-ico");
    const modalLbl = document.getElementById("btn-modal-speak-label");
    const modalStop = document.getElementById("btn-modal-speak-stop");
    if (modalBtn) {
      modalBtn.classList.toggle("is-on", modalPlaying);
      modalBtn.classList.toggle("is-paused", modalPaused);
    }
    if (modalIco) modalIco.innerHTML = modalPlaying ? ICONS.pause : (modalPaused ? ICONS.play : ICONS.speaker);
    if (modalLbl) modalLbl.textContent = modalPlaying ? "Pauze" : (modalPaused ? "Verder" : "Lees voor");
    if (modalStop) modalStop.style.display = (modalPlaying || modalPaused) ? "inline-flex" : "none";
  }

  function setupModal() {
    const modal = document.getElementById("chapter-modal");
    const closeBtn = document.getElementById("btn-modal-close");
    const speakBtn = document.getElementById("btn-modal-speak");
    const stopBtn = document.getElementById("btn-modal-speak-stop");

    closeBtn.addEventListener("click", closeChapterModal);
    speakBtn.addEventListener("click", () => {
      toggleChapterSpeech(state.modalTopicId || state.selectedId);
    });
    stopBtn.addEventListener("click", stopSpeaking);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.modalOpen) {
        closeChapterModal();
      }
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeChapterModal();
    });
  }

  function openChapterModal(topicId) {
    const t = getTopicById(topicId || state.selectedId);
    state.modalTopicId = t.id;
    state.modalOpen = true;

    const modEl = document.getElementById("chapter-modal-mod");
    modEl.textContent = t.module;
    modEl.style.background = t.color;

    document.getElementById("chapter-modal-title").textContent = t.title;
    document.getElementById("chapter-modal-tag").textContent = t.tag;

    const bodyEl = document.getElementById("chapter-modal-body");
    const paras = getChapterParagraphs(t);
    bodyEl.innerHTML = `
      <div class="chapter-modal-prose">
        ${paras.map((p) => `<p class="chapter-para" style="border-left-color:${t.color};">${escapeHtml(p)}</p>`).join("")}
      </div>
    `;
    bodyEl.scrollTop = 0;

    const modal = document.getElementById("chapter-modal");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    updateSpeakButtons();
  }

  function closeChapterModal() {
    state.modalOpen = false;
    const modal = document.getElementById("chapter-modal");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    updateSpeakButtons();
  }

  function init3DPane() {
    const stage = document.getElementById("brain3d-stage");
    state.viewer3D = window.Brain3DViewer.create(stage, (topicId) => {
      selectTopic(topicId, false);
    });

    state.viewer3D.onLayerChange((layer) => {
      document.querySelectorAll(".floating-3d-bar [data-layer]").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.layer === layer);
      });
    });

    document.querySelectorAll(".floating-3d-bar [data-layer]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const layer = btn.dataset.layer;
        document.querySelectorAll(".floating-3d-bar [data-layer]").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.viewer3D.setLayerMode(layer);
      });
    });

    let exploded = false;
    const btnExplode = document.getElementById("btn-explode");
    btnExplode.addEventListener("click", () => {
      exploded = !exploded;
      btnExplode.classList.toggle("is-active", exploded);
      state.viewer3D.setExploded(exploded);
    });

    document.getElementById("btn-reset-3d").addEventListener("click", () => {
      exploded = false;
      btnExplode.classList.remove("is-active");
      state.viewer3D.resetView();
    });
  }

  function selectTopic(topicId, move3DCamera) {
    const found = DATA.topics.find((t) => t.id === topicId);
    if (!found) return;
    state.selectedId = topicId;
    renderDockCard();
    updateQuickStripActive();
    if (state.bodyMap) state.bodyMap.setSelected(topicId);
    if (move3DCamera && state.viewer3D) state.viewer3D.selectTopic(topicId);
  }

  function renderDockCard() {
    const t = getTopicById(state.selectedId);
    const paras = getChapterParagraphs(t);
    const dock = document.getElementById("dock-card");
    const show3DBtn = state.view !== "3d";

    dock.innerHTML = `
      <div class="dock-header">
        <div class="dock-title-wrap">
          <span class="mod-tag" style="background:${t.color};">${t.module}</span>
          <h2 class="dock-title">${escapeHtml(t.title)}</h2>
          <span class="dock-sub">${escapeHtml(t.tag)}</span>
        </div>
        <div class="dock-header-actions">
          ${show3DBtn ? `
            <button type="button" class="quote-toggle-btn is-open" id="btn-dock-to-3d" title="Bekijk dit onderdeel in 3D">
              <span class="svg-ico">${ICONS.brain}</span>
              <span>In 3D</span>
            </button>
          ` : ""}
          <button type="button" class="quote-toggle-btn ${state.showQuote ? "is-open" : ""}" id="btn-toggle-quote">
            <span class="svg-ico">${ICONS.doc}</span>
            <span>Hoofdstuktekst</span>
          </button>
          <button type="button" class="quote-toggle-btn" id="btn-header-fullscreen" title="Open hoofdstuktekst op volledig scherm">
            <span class="svg-ico">${ICONS.fullscreen}</span>
            <span>Volledig scherm</span>
          </button>
        </div>
      </div>
      <ul class="dock-bullets">
        ${t.bullets.map((b) => `<li style="border-left-color:${t.color};">${b}</li>`).join("")}
      </ul>
      ${state.showQuote ? `
        <div class="dock-quote-box">
          <div class="dock-quote-toolbar">
            <strong>Uit hoofdstuk3.docx:</strong>
            <div class="dock-quote-tools">
              <button type="button" class="quote-toggle-btn" id="btn-dock-speak">
                <span class="svg-ico">${ICONS.speaker}</span>
                <span>Lees voor</span>
              </button>
              <button type="button" class="quote-toggle-btn" id="btn-dock-speak-stop" title="Stop voorlezen" style="display:none;">
                <span class="svg-ico">${ICONS.stop}</span>
                <span>Stop</span>
              </button>
              <button type="button" class="quote-toggle-btn" id="btn-open-fullscreen">
                <span class="svg-ico">${ICONS.fullscreen}</span>
                <span>Volledig scherm</span>
              </button>
            </div>
          </div>
          ${paras.map((p) => `<p class="chapter-para">${escapeHtml(p)}</p>`).join("")}
        </div>
      ` : ""}
    `;

    const to3dBtn = document.getElementById("btn-dock-to-3d");
    if (to3dBtn) {
      to3dBtn.addEventListener("click", () => viewTopicIn3D(t.id));
    }

    document.getElementById("btn-toggle-quote").addEventListener("click", () => {
      state.showQuote = !state.showQuote;
      renderDockCard();
    });

    document.getElementById("btn-header-fullscreen").addEventListener("click", () => {
      openChapterModal(t.id);
    });

    if (state.showQuote) {
      document.getElementById("btn-dock-speak").addEventListener("click", () => {
        toggleChapterSpeech(t.id);
      });
      document.getElementById("btn-dock-speak-stop").addEventListener("click", stopSpeaking);
      document.getElementById("btn-open-fullscreen").addEventListener("click", () => {
        openChapterModal(t.id);
      });
    }
    updateSpeakButtons();
  }

  function renderQuickStrip() {
    const strip = document.getElementById("quick-strip");
    strip.innerHTML = DATA.topics.map((t) => `
      <button type="button" class="strip-pill ${t.id === state.selectedId ? "is-active" : ""}" data-tid="${t.id}" style="border-left:3px solid ${t.color};">
        ${escapeHtml(t.title)}
      </button>
    `).join("");

    strip.querySelectorAll(".strip-pill").forEach((btn) => {
      btn.addEventListener("click", () => selectTopic(btn.dataset.tid, true));
    });
  }

  function updateQuickStripActive() {
    document.querySelectorAll(".strip-pill").forEach((btn) => {
      const active = btn.dataset.tid === state.selectedId;
      btn.classList.toggle("is-active", active);
      if (active) {
        btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    });
  }

  // ================= UITGEBREIDE OVERHORING (MET UITLEG & HERHALING) =================
  function startQuizRound(pool, retryMode) {
    state.quizPool = Array.isArray(pool) && pool.length > 0 ? pool.slice() : DATA.questions.slice();
    state.quizPos = 0;
    state.quizAnswered = false;
    state.chosenIdx = null;
    state.correctCount = 0;
    state.wrongItems = [];
    state.quizFinished = false;
    state.isRetryMode = Boolean(retryMode);
    renderQuiz();
  }

  function renderQuiz() {
    if (state.quizFinished || state.quizPos >= state.quizPool.length) {
      renderQuizSummary();
      return;
    }

    const q = state.quizPool[state.quizPos];
    const box = document.getElementById("quiz-container");
    const isCorrect = state.quizAnswered && state.chosenIdx === q.answer;
    const wrongCount = state.wrongItems.length;

    box.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-top-meta">
          <div class="quiz-score-bar">
            <span class="dock-sub">Vraag ${state.quizPos + 1} / ${state.quizPool.length}</span>
            ${state.isRetryMode ? `<span class="quiz-retry-badge"><span class="svg-ico">${ICONS.retry}</span><span>Herhaalronde fouten</span></span>` : ""}
          </div>
          <div class="quiz-score-bar">
            <span class="score-pill good">Goed: ${state.correctCount}</span>
            <span class="score-pill bad">Fout: ${wrongCount}</span>
            ${wrongCount > 0 ? `<button type="button" class="step-ctrl-btn" id="btn-finish-now">Resultaat</button>` : ""}
            <button type="button" class="step-ctrl-btn" id="btn-skip-q">${state.quizPos + 1 < state.quizPool.length ? "Volgende →" : "Einde →"}</button>
          </div>
        </div>

        <p class="quiz-q">${escapeHtml(q.q)}</p>

        <div class="quiz-opts">
          ${q.options.map((opt, i) => {
            let cls = "";
            let mark = "";
            if (state.quizAnswered) {
              if (i === q.answer) {
                cls = "correct";
                mark = `<span class="svg-ico">${ICONS.check}</span>`;
              } else if (i === state.chosenIdx) {
                cls = "wrong";
                mark = `<span class="svg-ico">${ICONS.cross}</span>`;
              }
            }
            return `
              <button type="button" class="quiz-opt ${cls}" data-idx="${i}" ${state.quizAnswered ? "disabled" : ""}>
                <span>${escapeHtml(opt)}</span>
                ${mark}
              </button>
            `;
          }).join("")}
        </div>

        ${state.quizAnswered ? `
          <div class="quiz-feedback ${isCorrect ? "is-good" : "is-bad"}">
            <div class="quiz-fb-status">
              <span class="svg-ico">${isCorrect ? ICONS.check : ICONS.cross}</span>
              <span>${isCorrect ? "Goed beantwoord!" : "Fout antwoord"}</span>
            </div>
            ${!isCorrect ? `
              <p class="mistake-ans-bad">Jouw keuze: ${escapeHtml(q.options[state.chosenIdx])}</p>
              <p class="mistake-ans-good">Juiste antwoord: ${escapeHtml(q.options[q.answer])}</p>
            ` : ""}
            <p class="quiz-fb-explain">${escapeHtml(q.explain || "")}</p>
            <div class="quiz-action-row">
              <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button type="button" class="quiz-btn" id="btn-quiz-read">
                  <span class="svg-ico">${ICONS.fullscreen}</span>
                  <span>Hoofdstuktekst</span>
                </button>
                <button type="button" class="quiz-btn" id="btn-quiz-3d">
                  <span class="svg-ico">${ICONS.brain}</span>
                  <span>In 3D</span>
                </button>
              </div>
              <button type="button" class="quiz-btn primary" id="btn-next-after-fb">
                ${state.quizPos + 1 < state.quizPool.length ? "Volgende vraag →" : "Bekijk eindresultaat →"}
              </button>
            </div>
          </div>
        ` : ""}
      </div>
    `;

    const finishBtn = document.getElementById("btn-finish-now");
    if (finishBtn) {
      finishBtn.addEventListener("click", () => {
        state.quizFinished = true;
        renderQuiz();
      });
    }

    document.getElementById("btn-skip-q").addEventListener("click", advanceQuizQuestion);

    if (state.quizAnswered) {
      document.getElementById("btn-quiz-read").addEventListener("click", () => openChapterModal(q.topicId));
      document.getElementById("btn-quiz-3d").addEventListener("click", () => viewTopicIn3D(q.topicId));
      document.getElementById("btn-next-after-fb").addEventListener("click", advanceQuizQuestion);
    } else {
      box.querySelectorAll(".quiz-opt").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (state.quizAnswered) return;
          const chosen = Number(btn.dataset.idx);
          state.quizAnswered = true;
          state.chosenIdx = chosen;
          if (chosen === q.answer) {
            state.correctCount += 1;
          } else if (!state.wrongItems.some((w) => w.question === q)) {
            state.wrongItems.push({ question: q, chosenIdx: chosen });
          }
          selectTopic(q.topicId, true);
          renderQuiz();
        });
      });
    }
  }

  function advanceQuizQuestion() {
    state.quizAnswered = false;
    state.chosenIdx = null;
    if (state.quizPos + 1 >= state.quizPool.length) {
      state.quizFinished = true;
    } else {
      state.quizPos += 1;
    }
    renderQuiz();
  }

  function renderQuizSummary() {
    const wrongCount = state.wrongItems.length;
    const totalAnswered = state.correctCount + wrongCount;
    const pct = totalAnswered > 0 ? Math.round((state.correctCount / totalAnswered) * 100) : 0;
    const box = document.getElementById("quiz-container");

    box.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-top-meta">
          <div class="quiz-score-bar">
            <h3 style="margin:0; font-size:1.05rem;">Eindresultaat ${state.isRetryMode ? "(Herhaalronde)" : ""}</h3>
          </div>
          <span class="dock-sub">${totalAnswered} / ${state.quizPool.length} beantwoord</span>
        </div>

        <div class="quiz-summary-stats">
          <div class="stat-box">
            <div class="stat-val" style="color:#6ee7b7;">${state.correctCount}</div>
            <div class="stat-lbl">Goed</div>
          </div>
          <div class="stat-box">
            <div class="stat-val" style="color:#fca5a5;">${wrongCount}</div>
            <div class="stat-lbl">Fout</div>
          </div>
          <div class="stat-box">
            <div class="stat-val" style="color:var(--accent);">${pct}%</div>
            <div class="stat-lbl">Score</div>
          </div>
        </div>

        <div class="quiz-action-row">
          ${wrongCount > 0 ? `
            <button type="button" class="quiz-btn warn" id="btn-retry-wrong">
              <span class="svg-ico">${ICONS.retry}</span>
              <span>Foute vragen herhalen (${wrongCount})</span>
            </button>
          ` : `
            <span class="score-pill good">
              <span class="svg-ico">${ICONS.check}</span>
              <span>Geen foute vragen meer in deze ronde!</span>
            </span>
          `}
          <button type="button" class="quiz-btn primary" id="btn-restart-all">
            <span class="svg-ico">${ICONS.reset}</span>
            <span>Opnieuw (alle ${DATA.questions.length} vragen)</span>
          </button>
        </div>

        ${wrongCount > 0 ? `
          <div class="quiz-mistake-list">
            <strong style="font-size:0.86rem;">Wat ging er mis (${wrongCount}):</strong>
            ${state.wrongItems.map((item) => `
              <div class="quiz-mistake-item">
                <p class="mistake-q">${escapeHtml(item.question.q)}</p>
                <p class="mistake-ans-bad">Jouw antwoord: ${escapeHtml(item.question.options[item.chosenIdx])}</p>
                <p class="mistake-ans-good">Juiste antwoord: ${escapeHtml(item.question.options[item.question.answer])}</p>
                <p class="mistake-explain">${escapeHtml(item.question.explain || "")}</p>
                <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
                  <button type="button" class="quiz-btn" data-open-topic="${item.question.topicId}">
                    <span class="svg-ico">${ICONS.fullscreen}</span>
                    <span>Lees hoofdstuktekst</span>
                  </button>
                  <button type="button" class="quiz-btn" data-3d-topic="${item.question.topicId}">
                    <span class="svg-ico">${ICONS.brain}</span>
                    <span>In 3D</span>
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;

    const retryBtn = document.getElementById("btn-retry-wrong");
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        startQuizRound(state.wrongItems.map((w) => w.question), true);
      });
    }

    document.getElementById("btn-restart-all").addEventListener("click", () => {
      startQuizRound(DATA.questions, false);
    });

    box.querySelectorAll("[data-open-topic]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tid = btn.getAttribute("data-open-topic");
        selectTopic(tid, true);
        openChapterModal(tid);
      });
    });

    box.querySelectorAll("[data-3d-topic]").forEach((btn) => {
      btn.addEventListener("click", () => {
        viewTopicIn3D(btn.getAttribute("data-3d-topic"));
      });
    });
  }

  // Voor testen en debugging beschikbaar op window
  window.__NEURO_DEBUG__ = { state, speech };

  document.addEventListener("DOMContentLoaded", init);
})();
