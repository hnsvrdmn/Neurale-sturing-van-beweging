// Gedetailleerd Eigen Anatomisch 3D-Brein (CZS & PZS)
// Naadloze 3D-opbouw langs één doorlopende centrale as:
// 1. Cerebrum (6 sluitende kwabben + gyri/sulci + insula + corpus callosum/fornix + caudatus/lentiformis)
// 2. Diencephalon (thalamus + adhesio interthalamica + pulvinar/geniculata + hypothalamus/chiasma/mammillaria/hypofyse)
// 3. Cerebellum (hemisferen + vermis + diepe folia + middelste cerebellaire pedunkels -> pons)
// 4. Hersenstam & Ruggenmerg (middenhersenen, pons, medulla oblongata, reticulaire formatie, ruggenmerg + spinale/craniale wortels)

window.Brain3DViewer = (function () {
  const TOPIC_META = {
    "frontale-kwab":        { label: "Frontale kwab",                    region: "cerebrum",     layer: "outer", color: 0x8b5cf6, hex: "#8b5cf6", yaw: -0.68, pitch: 0.22, zoom: 4.3 },
    "premotorcortex":       { label: "Premotorcortex",                   region: "cerebrum",     layer: "outer", color: 0xa855f7, hex: "#a855f7", yaw: -0.58, pitch: 0.44, zoom: 4.1 },
    "primaire-motorcortex": { label: "Primaire motorcortex",             region: "cerebrum",     layer: "outer", color: 0xc084fc, hex: "#c084fc", yaw: -0.52, pitch: 0.52, zoom: 4.1 },
    "parietale-kwab":       { label: "Pariëtale kwab",                   region: "cerebrum",     layer: "outer", color: 0x6366f1, hex: "#6366f1", yaw: -1.32, pitch: 0.42, zoom: 4.3 },
    "temporele-kwab":       { label: "Temporele kwab",                   region: "cerebrum",     layer: "outer", color: 0x3b82f6, hex: "#3b82f6", yaw: -1.56, pitch: 0.05, zoom: 4.2 },
    "occipitale-kwab":      { label: "Occipitale kwab",                  region: "cerebrum",     layer: "outer", color: 0x0ea5e9, hex: "#0ea5e9", yaw: -2.55, pitch: 0.14, zoom: 4.2 },
    "centrale-insula":      { label: "Centrale insula (5e kwab)",        region: "cerebrum",     layer: "deep",  color: 0xec4899, hex: "#ec4899", yaw: -1.35, pitch: 0.10, zoom: 3.6 },
    "cerebrum":             { label: "Corpus callosum & Hemisferen",     region: "cerebrum",     layer: "deep",  color: 0xd946ef, hex: "#d946ef", yaw: -1.05, pitch: 0.28, zoom: 3.7 },
    "basale-ganglia":       { label: "Basale ganglia (basale kernen)",   region: "cerebrum",     layer: "deep",  color: 0xf43f5e, hex: "#f43f5e", yaw: -0.82, pitch: 0.20, zoom: 3.5 },
    "thalamus":             { label: "Thalamus (Diencephalon)",          region: "diencephalon", layer: "deep",  color: 0xe879f9, hex: "#e879f9", yaw: -0.92, pitch: 0.16, zoom: 3.1 },
    "hypothalamus":         { label: "Hypothalamus (Diencephalon)",      region: "diencephalon", layer: "deep",  color: 0xfb7185, hex: "#fb7185", yaw: -0.52, pitch: 0.04, zoom: 3.0 },
    "cerebellum":           { label: "Cerebellum (Kleine hersenen)",     region: "cerebellum",   layer: "stem",  color: 0xf59e0b, hex: "#f59e0b", yaw: -2.35, pitch: -0.05, zoom: 3.3 },
    "hersenstam":           { label: "Hersenstam (Midden/Pons/Medulla)", region: "stem",         layer: "stem",  color: 0xfbbf24, hex: "#fbbf24", yaw: -0.58, pitch: -0.08, zoom: 3.6 },
    "middenhersenen":       { label: "Middenhersenen (Mesencephalon)",   region: "stem",         layer: "stem",  color: 0xf59e0b, hex: "#f59e0b", yaw: -0.58, pitch: -0.02, zoom: 3.3 },
    "pons":                 { label: "Pons",                             region: "stem",         layer: "stem",  color: 0xfbbf24, hex: "#fbbf24", yaw: -0.58, pitch: -0.08, zoom: 3.4 },
    "medulla-oblongata":    { label: "Medulla oblongata (Verlengde merg)", region: "stem",       layer: "stem",  color: 0xfcd34d, hex: "#fcd34d", yaw: -0.58, pitch: -0.14, zoom: 3.5 },
    "reticulaire-formatie": { label: "Reticulaire formatie",             region: "stem",         layer: "stem",  color: 0xeab308, hex: "#eab308", yaw: -1.10, pitch: -0.08, zoom: 3.6 },
    "ruggenmerg":           { label: "Ruggenmerg",                       region: "stem",         layer: "stem",  color: 0xd97706, hex: "#d97706", yaw: -0.75, pitch: -0.18, zoom: 4.8 },
    "pzs-overzicht":        { label: "PZS (12 craniale + 31 spinale)",   region: "stem",         layer: "pzs",   color: 0x38bdf8, hex: "#38bdf8", yaw: -0.60, pitch: -0.14, zoom: 4.7 }
  };

  function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  function mapTopicTo3DId(topicId) {
    if (TOPIC_META[topicId]) return topicId;
    if (topicId === "czs-overzicht") return "frontale-kwab";
    return "pzs-overzicht";
  }

  // ==================== GEDEELDE CENTRALE AS (MIDDENHERSENEN -> RUGGENMERG) ====================
  // Garandeert 0.00 gat tussen diencephalon, middenhersenen, pons, medulla oblongata en ruggenmerg.
  function evalStemAxis(y) {
    if (y >= -0.84) {
      const t = Math.max(0, Math.min(1, (0.15 - y) / 0.99));
      const s = t * t * (3 - 2 * t);
      return { x: 0, y, z: -0.04 - 0.28 * s };
    }
    const t2 = Math.max(0, Math.min(1, (-0.84 - y) / 1.24));
    return {
      x: 0,
      y,
      z: -0.32 - 0.045 * Math.sin(t2 * Math.PI * 0.5) - 0.015 * Math.sin(t2 * Math.PI)
    };
  }

  // ==================== NAADLOZE ANATOMISCHE HERSENVERVORMING (GYRI & SULCI) ====================
  function evalBrainSurface(side, uz, alpha, isInner) {
    const rCircle = Math.sqrt(Math.max(0, 1 - uz * uz));
    const ux = rCircle * Math.cos(alpha);
    const uy = rCircle * Math.sin(alpha);

    let x = ux * 0.88;
    let y = uy * 0.82 + 0.36;
    let z = uz * 1.26;

    // 1. Gladde frontale versmalling vooraan (+Z)
    if (uz > 0.25) {
      const f = (uz - 0.25) / 0.75;
      x *= 1 - 0.21 * f * f;
      y -= 0.10 * f * f;
    }

    // 2. Occipitale tentorium-inkeping onderaan (-Z) boven het cerebellum
    if (uz < -0.10 && uy < 0.22) {
      const o = smoothstep(-0.10, -0.85, uz) * smoothstep(0.22, -0.65, uy);
      y += 0.26 * o;
      x *= 1 - 0.10 * o;
    }

    // 3. Gladde temporele kwab onder de Sylvian fissure
    const tz = Math.sin(smoothstep(-0.56, 0.34, uz) * Math.PI);
    const ty = smoothstep(0.10, -0.60, uy);
    const tx = smoothstep(0.16, 0.72, ux);
    const tw = tz * ty * tx;
    x += 0.13 * tw;
    y -= 0.21 * tw;
    z += 0.11 * tw;

    // 4. Mediale basisboog zodat diencephalon & middenhersenen netjes vrij liggen zonder botsing
    if (uy < 0.0 && ux < 0.45 && uz > -0.45 && uz < 0.45) {
      const arch = smoothstep(0.45, 0.05, ux) * smoothstep(0.0, -0.5, uy) * (1 - Math.abs(uz) / 0.45);
      y += 0.16 * Math.max(0, arch);
    }

    // 5. Volledig gladde (C1) mediale wand (longitudinale fissuur tussen beide hemisferen)
    const medialBlend = smoothstep(0.0, 0.24, ux);
    const medialX = Math.max(0.028, x);
    x = 0.028 * (1 - medialBlend) + medialX * medialBlend;

    // 6. Hersenwindingen (gyri & sulci) aan de buitenzijde
    let shade = 1.0;
    if (!isInner) {
      const lateralFade = smoothstep(0.08, 0.26, ux);
      const topFade = smoothstep(0.02, 0.22, uy);
      const f1 = Math.sin(z * 12.2 + Math.cos(y * 10.2) * 1.5);
      const f2 = Math.cos(y * 11.4 + Math.sin(x * 11.8 + z * 5.4) * 1.3);
      const f3 = Math.sin((x + y - z) * 9.5);
      const ridge = 1 - Math.abs(f1 * 0.46 + f2 * 0.36 + f3 * 0.18);
      const fold = (ridge - 0.38) * 0.048 * lateralFade;

      const sylvianMask = smoothstep(-0.48, -0.25, uz) * (1 - smoothstep(0.20, 0.38, uz));
      const sylvian = Math.exp(-Math.pow((uy - 0.04) / 0.065, 2)) * sylvianMask * lateralFade;
      const centralSulcus = Math.exp(-Math.pow((uz + 0.02) / 0.032, 2)) * topFade * lateralFade;
      const motorBump = Math.exp(-Math.pow((uz - 0.07) / 0.075, 2)) * topFade * lateralFade;

      const disp = fold - sylvian * 0.052 - centralSulcus * 0.030 + motorBump * 0.022;
      x += ux * disp;
      y += uy * disp;
      z += uz * disp * 0.45;

      shade = Math.max(0.66, Math.min(1.08, 0.74 + ridge * 0.34 * lateralFade - sylvian * 0.22 - centralSulcus * 0.15));
    } else {
      // Sluit elke kwab naar de vlakke mediale wand (x = 0.028) zodat geen enkel kwabblok hol of open is
      x = 0.028;
      y = 0.34 + (y - 0.34) * 0.78;
      z *= 0.84;
      shade = 0.72;
    }

    return { x: x * side, y, z, shade };
  }

  // Bouwt één waterdichte, solide kwab tussen (uz, alpha)-grenzen
  function buildLobeGeometry(THREE, side, uzMin, uzMax, aMin, aMax, uSteps, vSteps) {
    const positions = [];
    const colors = [];
    const indices = [];
    const ringCols = uSteps + 1;

    function addGrid(isInner) {
      const offset = positions.length / 3;
      for (let iv = 0; iv <= vSteps; iv++) {
        const alpha = aMin + (aMax - aMin) * (iv / vSteps);
        for (let iu = 0; iu <= uSteps; iu++) {
          const uz = uzMin + (uzMax - uzMin) * (iu / uSteps);
          const pt = evalBrainSurface(side, uz, alpha, isInner);
          positions.push(pt.x, pt.y, pt.z);
          colors.push(pt.shade, pt.shade, pt.shade);
        }
      }
      return offset;
    }

    const outerOff = addGrid(false);
    const innerOff = addGrid(true);

    for (let iv = 0; iv < vSteps; iv++) {
      for (let iu = 0; iu < uSteps; iu++) {
        const a = outerOff + iv * ringCols + iu;
        const b = a + 1;
        const c = a + ringCols;
        const d = c + 1;
        if (side > 0) indices.push(a, c, b, b, c, d);
        else indices.push(a, b, c, b, d, c);

        const ia = innerOff + iv * ringCols + iu;
        const ib = ia + 1;
        const ic = ia + ringCols;
        const id = ic + 1;
        if (side > 0) indices.push(ia, ib, ic, ib, id, ic);
        else indices.push(ia, ic, ib, ib, ic, id);
      }
    }

    function stitchEdge(outerIndices, innerIndices, flip) {
      for (let i = 0; i < outerIndices.length - 1; i++) {
        const o0 = outerIndices[i], o1 = outerIndices[i + 1];
        const i0 = innerIndices[i], i1 = innerIndices[i + 1];
        if ((side > 0) !== flip) indices.push(o0, i0, o1, o1, i0, i1);
        else indices.push(o0, o1, i0, o1, i1, i0);
      }
    }

    const topO = [], topI = [], botO = [], botI = [], leftO = [], leftI = [], rightO = [], rightI = [];
    for (let iu = 0; iu <= uSteps; iu++) {
      botO.push(outerOff + iu);
      botI.push(innerOff + iu);
      topO.push(outerOff + vSteps * ringCols + iu);
      topI.push(innerOff + vSteps * ringCols + iu);
    }
    for (let iv = 0; iv <= vSteps; iv++) {
      leftO.push(outerOff + iv * ringCols);
      leftI.push(innerOff + iv * ringCols);
      rightO.push(outerOff + iv * ringCols + uSteps);
      rightI.push(innerOff + iv * ringCols + uSteps);
    }

    stitchEdge(botO, botI, true);
    stitchEdge(topO, topI, false);
    stitchEdge(leftO, leftI, false);
    stitchEdge(rightO, rightI, true);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  // ==================== WATERDICHTE ORGANISCHE LOFT-GENERATOR (STAM & RUGGENMERG) ====================
  function buildLoftedSurfaceGeo(THREE, yVals, segs, evalRingPtFn, capTopFn, capBotFn) {
    const positions = [];
    const colors = [];
    const indices = [];
    const stride = segs + 1;

    for (let iy = 0; iy < yVals.length; iy++) {
      const y = yVals[iy];
      for (let is = 0; is <= segs; is++) {
        const theta = (is / segs) * Math.PI * 2;
        const p = evalRingPtFn(y, theta, iy, yVals.length - 1);
        positions.push(p.x, p.y, p.z);
        colors.push(p.shade, p.shade, p.shade);
      }
    }

    for (let iy = 0; iy < yVals.length - 1; iy++) {
      for (let is = 0; is < segs; is++) {
        const a = iy * stride + is;
        const b = a + 1;
        const c = a + stride;
        const d = c + 1;
        // Buitengerichte winding: (a, c, b) en (b, c, d) geven uitwaartse normalen
        indices.push(a, c, b, b, c, d);
      }
    }

    // Sluit boven- en onderkap waterdicht af met uitwaartse normalen
    if (capTopFn) {
      const topCenter = capTopFn();
      const tcIdx = positions.length / 3;
      positions.push(topCenter.x, topCenter.y, topCenter.z);
      colors.push(topCenter.shade, topCenter.shade, topCenter.shade);
      for (let is = 0; is < segs; is++) {
        indices.push(tcIdx, is, is + 1);
      }
    }
    if (capBotFn) {
      const botCenter = capBotFn();
      const bcIdx = positions.length / 3;
      positions.push(botCenter.x, botCenter.y, botCenter.z);
      colors.push(botCenter.shade, botCenter.shade, botCenter.shade);
      const lastRow = (yVals.length - 1) * stride;
      for (let is = 0; is < segs; is++) {
        indices.push(bcIdx, lastRow + is + 1, lastRow + is);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }

  function createBrainstemRegionGeo(THREE, yTop, yBot, stepsY) {
    const yVals = [];
    const span = yTop - yBot;
    for (let i = 0; i <= stepsY; i++) {
      yVals.push(yTop - (span * i) / stepsY);
    }

    return buildLoftedSurfaceGeo(
      THREE,
      yVals,
      36,
      (y, theta) => {
        const axis = evalStemAxis(y);
        const sinT = Math.sin(theta); // ±X (zij)
        const cosT = Math.cos(theta); // +Z (voor/ventraal) bij cosT=1, -Z (achter/dorsaal) bij cosT=-1

        // Basis straal: middenhersenen (0.17), pons (0.19 -> 0.25), medulla (0.14 -> 0.095)
        let rX = 0.145;
        let rZ = 0.135;
        let zShift = 0;
        let shade = 0.88;

        // Middenhersenen (+0.17 .. -0.14): Pedunculi cerebri vooraan + Colliculi achteraan
        const midW = smoothstep(-0.18, -0.04, y);
        const peduncle = Math.pow(Math.max(0, cosT), 1.4) * (0.045 - 0.060 * Math.exp(-Math.pow(sinT / 0.28, 2))) * midW;
        const supColl = Math.exp(-Math.pow((y - 0.03) / 0.045, 2)) * smoothstep(-0.2, -0.65, cosT) * (0.034 - 0.022 * Math.exp(-Math.pow(sinT / 0.18, 2)));
        const infColl = Math.exp(-Math.pow((y + 0.065) / 0.042, 2)) * smoothstep(-0.2, -0.65, cosT) * (0.028 - 0.018 * Math.exp(-Math.pow(sinT / 0.18, 2)));

        // Pons (-0.12 .. -0.46): Bolle ventrale brug + fibrae transversae + sulcus basilaris
        const ponsW = Math.exp(-Math.pow((y + 0.29) / 0.13, 2));
        const ponsBelly = Math.max(0, cosT + 0.35) * 0.095 * ponsW;
        const ponsSide = Math.abs(sinT) * 0.075 * ponsW;
        const sulcusBasilaris = Math.exp(-Math.pow(sinT / 0.24, 2)) * Math.max(0, cosT) * 0.022 * ponsW;
        const ponsFibers = Math.sin(y * 78) * 0.006 * ponsW * Math.max(0, cosT + 0.2);

        // Medulla oblongata (-0.46 .. -0.84): Slanker verloop naar ruggenmerg + Piramiden + Olijven
        const medT = smoothstep(-0.46, -0.84, y);
        const piramideW = Math.exp(-Math.pow((y + 0.62) / 0.15, 2));
        const piramide = Math.max(0, cosT) * Math.exp(-Math.pow((Math.abs(sinT) - 0.34) / 0.22, 2)) * 0.026 * piramideW;
        const olijfW = Math.exp(-Math.pow((y + 0.56) / 0.085, 2));
        const olijf = Math.exp(-Math.pow((Math.abs(sinT) - 0.85) / 0.20, 2)) * Math.max(0, cosT + 0.3) * 0.028 * olijfW;
        const antFissure = Math.exp(-Math.pow(sinT / 0.16, 2)) * Math.max(0, cosT) * 0.015 * smoothstep(-0.44, -0.58, y);

        rX = rX * (1 - 0.33 * medT) + ponsSide + olijf * 0.7;
        rZ = rZ * (1 - 0.39 * medT) + ponsBelly * 0.55;
        zShift = ponsBelly * 0.45;

        const rLocal = 1 + peduncle + supColl + infColl + ponsFibers - sulcusBasilaris + piramide - antFissure;
        const x = axis.x + sinT * rX * rLocal;
        const z = axis.z + zShift + cosT * rZ * rLocal;

        shade = Math.max(0.68, Math.min(1.06,
          0.86 + ponsBelly * 1.1 + ponsFibers * 8 - sulcusBasilaris * 4 - antFissure * 5 + supColl * 2.5 + infColl * 2.5 + olijf * 3
        ));
        return { x, y: axis.y, z, shade };
      },
      () => {
        const a = evalStemAxis(yTop);
        return { x: a.x, y: a.y, z: a.z, shade: 0.78 };
      },
      () => {
        const a = evalStemAxis(yBot);
        return { x: a.x, y: a.y, z: a.z, shade: 0.78 };
      }
    );
  }

  function createSpinalCordGeometry(THREE) {
    const stepsY = 38;
    const yVals = [];
    for (let i = 0; i <= stepsY; i++) {
      yVals.push(-0.78 - (1.30 * i) / stepsY); // -0.78 (overlap met medulla) -> -2.08
    }

    return buildLoftedSurfaceGeo(
      THREE,
      yVals,
      32,
      (y, theta) => {
        const axis = evalStemAxis(y);
        const sinT = Math.sin(theta);
        const cosT = Math.cos(theta);

        // Cervicale verdikking rond y = -1.25
        const cerv = 1 + 0.14 * Math.exp(-Math.pow((y + 1.24) / 0.24, 2));
        const antGroove = Math.exp(-Math.pow(sinT / 0.16, 2)) * Math.max(0, cosT) * 0.014;
        const postGroove = Math.exp(-Math.pow(sinT / 0.16, 2)) * Math.max(0, -cosT) * 0.010;
        const rootSulci = Math.exp(-Math.pow((Math.abs(sinT) - 0.65) / 0.15, 2)) * 0.005;

        const rX = 0.098 * cerv - rootSulci;
        const rZ = 0.080 * cerv - antGroove - postGroove;

        const x = axis.x + sinT * rX;
        const z = axis.z + cosT * rZ;
        const shade = Math.max(0.70, Math.min(1.04, 0.90 - antGroove * 10 - postGroove * 8 + 0.05 * Math.sin(y * 28)));
        return { x, y: axis.y, z, shade };
      },
      () => {
        const a = evalStemAxis(-0.78);
        return { x: a.x, y: a.y, z: a.z, shade: 0.78 };
      },
      () => {
        const a = evalStemAxis(-2.08);
        return { x: a.x, y: a.y, z: a.z, shade: 0.65 };
      }
    );
  }

  // ==================== CEREBELLUM MET DIEPE FOLIA, VERMIS & FLOCCULI ====================
  function createCerebellumLobeGeo(THREE, sx, sy, sz, isVermis) {
    const geo = new THREE.SphereGeometry(1, 38, 32);
    const pos = geo.attributes.position;
    const cols = [];
    const v = new THREE.Vector3();

    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const folia = Math.sin(v.y * 42) * 0.048 + Math.cos(v.z * 14) * 0.012;
      const primaryFissure = Math.exp(-Math.pow((v.y - 0.18) / 0.07, 2)) * 0.065;
      const shade = Math.max(0.68, Math.min(1.06, 0.80 + 0.22 * (0.5 + 0.5 * Math.sin(v.y * 42)) - primaryFissure * 2.2));
      const mult = 1 - primaryFissure * (isVermis ? 0.8 : 1.0);
      v.x *= sx * mult * (1 + folia * 0.55);
      v.y *= sy * (1 + folia);
      v.z *= sz * mult * (1 + folia * 0.75);
      pos.setXYZ(i, v.x, v.y, v.z);
      cols.push(shade, shade, shade);
    }
    geo.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    return geo;
  }

  // ==================== HOOFDVERSIE VAN HET 3D-MODEL ====================
  function create(container, onSelectCallback) {
    const state = {
      selectedId: "frontale-kwab",
      layerMode: "all",
      exploded: false,
      explodeAmount: 0,
      yaw: -0.68,
      pitch: 0.16,
      targetYaw: -0.68,
      targetPitch: 0.16,
      zoom: 4.5,
      targetZoom: 4.5
    };

    const hudBadge = document.createElement("div");
    hudBadge.className = "brain-status-pill";
    hudBadge.textContent = "Sleep om te draaien • Tik op een deel";

    container.innerHTML = "";
    container.appendChild(hudBadge);

    if (window.THREE) {
      initThree(container, state, hudBadge, onSelectCallback);
    } else {
      initFallbackCanvas(container, state, hudBadge, onSelectCallback);
    }

    return {
      selectTopic(topicId) {
        const mapped = mapTopicTo3DId(topicId);
        state.selectedId = mapped;
        const meta = TOPIC_META[mapped];
        if (meta) {
          state.targetYaw = meta.yaw;
          state.targetPitch = meta.pitch;
          if (meta.zoom) state.targetZoom = meta.zoom;

          // Zorg dat het gekozen onderdeel nooit verborgen blijft onder een andere regiofilter
          if (meta.region === "diencephalon" && state.layerMode !== "xray") {
            state.layerMode = "diencephalon";
          } else if (meta.region === "cerebellum" && state.layerMode !== "all" && state.layerMode !== "xray") {
            state.layerMode = "cerebellum";
          } else if (meta.region === "stem" && state.layerMode !== "all" && state.layerMode !== "xray") {
            state.layerMode = "stem";
          } else if (meta.layer === "deep" && meta.region === "cerebrum" && (state.layerMode === "all" || state.layerMode === "diencephalon" || state.layerMode === "cerebellum" || state.layerMode === "stem")) {
            state.layerMode = "xray";
          } else if (meta.region === "cerebrum" && meta.layer === "outer" && state.layerMode !== "all" && state.layerMode !== "cerebrum") {
            state.layerMode = "cerebrum";
          }
          if (state.onLayerSync) state.onLayerSync(state.layerMode);
          hudBadge.textContent = meta.label;
        }
      },
      setLayerMode(mode) {
        state.layerMode = mode;
        if (mode === "diencephalon") state.targetZoom = 3.2;
        else if (mode === "cerebellum") state.targetZoom = 3.4;
        else if (mode === "stem") state.targetZoom = 4.6;
        else if (mode === "cerebrum") state.targetZoom = 4.3;
        else if (mode === "all") state.targetZoom = 4.5;
      },
      setExploded(val) {
        state.exploded = Boolean(val);
      },
      resetView() {
        state.targetYaw = -0.68;
        state.targetPitch = 0.16;
        state.targetZoom = 4.5;
        state.exploded = false;
        state.layerMode = "all";
        if (state.onLayerSync) state.onLayerSync("all");
      },
      onLayerChange(cb) {
        state.onLayerSync = cb;
      }
    };
  }

  function initThree(container, state, hudBadge, onSelect) {
    const THREE = window.THREE;
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, state.zoom);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.touchAction = "none";
    container.insertBefore(renderer.domElement, container.firstChild);

    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    const key = new THREE.DirectionalLight(0xffffff, 0.94);
    key.position.set(4, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x93c5fd, 0.56);
    rim.position.set(-5, -2, -4);
    scene.add(rim);
    const botFill = new THREE.DirectionalLight(0xcbd5e1, 0.38);
    botFill.position.set(0, -6, 2);
    scene.add(botFill);

    const rootGroup = new THREE.Group();
    rootGroup.position.y = 0.20;
    scene.add(rootGroup);

    const clickableMeshes = [];

    function registerMesh(mesh, topicId, explodeVec) {
      const meta = TOPIC_META[topicId];
      mesh.userData = {
        topicId,
        region: meta.region,
        layer: meta.layer,
        basePos: mesh.position.clone(),
        explodeVec: new THREE.Vector3(explodeVec[0], explodeVec[1], explodeVec[2])
      };
      rootGroup.add(mesh);
      clickableMeshes.push(mesh);
      return mesh;
    }

    function makeMat(topicId, useVertexColors, colorOverride) {
      return new THREE.MeshStandardMaterial({
        color: colorOverride != null ? colorOverride : TOPIC_META[topicId].color,
        vertexColors: Boolean(useVertexColors),
        roughness: 0.45,
        metalness: 0.06,
        side: THREE.DoubleSide,
        transparent: false,
        opacity: 1
      });
    }

    // 1. DE 6 NAADLOZE CORTICALE KWABBEN (LINKS & RECHTS)
    const HPI = Math.PI / 2;
    const lobeSpecs = [
      { id: "occipitale-kwab",      uz: [-1.0, -0.54], a: [-HPI, HPI],  u: 26, v: 30, exp: [0.20, 0.08, -0.46] },
      { id: "temporele-kwab",       uz: [-0.54, 0.34], a: [-HPI, 0.05], u: 28, v: 22, exp: [0.48, -0.06, 0.06] },
      { id: "parietale-kwab",       uz: [-0.54,-0.02], a: [0.05, HPI],  u: 26, v: 24, exp: [0.28, 0.28, -0.22] },
      { id: "primaire-motorcortex", uz: [-0.02, 0.16], a: [0.05, HPI],  u: 14, v: 24, exp: [0.22, 0.40, 0.04] },
      { id: "premotorcortex",       uz: [0.16,  0.34], a: [0.05, HPI],  u: 14, v: 24, exp: [0.22, 0.34, 0.22] },
      { id: "frontale-kwab",        uz: [0.34,  1.0],  a: [-HPI, HPI],  u: 28, v: 30, exp: [0.26, 0.20, 0.46] }
    ];

    [-1, 1].forEach((side) => {
      lobeSpecs.forEach((spec) => {
        const geo = buildLobeGeometry(THREE, side, spec.uz[0], spec.uz[1], spec.a[0], spec.a[1], spec.u, spec.v);
        registerMesh(new THREE.Mesh(geo, makeMat(spec.id, true)), spec.id, [spec.exp[0] * side, spec.exp[1], spec.exp[2]]);
      });
    });

    // 2. CEREBRUM: CORPUS CALLOSUM (Rostrum, Genu, Truncus, Splenium) + FORNIX-BOOG
    const ccCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.23, 0.38),
      new THREE.Vector3(0, 0.36, 0.48), // Genu
      new THREE.Vector3(0, 0.49, 0.26),
      new THREE.Vector3(0, 0.51, -0.04), // Truncus
      new THREE.Vector3(0, 0.44, -0.34),
      new THREE.Vector3(0, 0.31, -0.45)  // Splenium
    ]);
    const ccGeo = new THREE.TubeGeometry(ccCurve, 34, 0.088, 16, false);
    ccGeo.scale(2.45, 0.72, 1.0);
    registerMesh(new THREE.Mesh(ccGeo, makeMat("cerebrum")), "cerebrum", [0, 0.28, 0]);

    // Fornix-boog onder corpus callosum tot aan mammillaria van hypothalamus
    [-1, 1].forEach((side) => {
      const fxCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.05 * side, 0.32, -0.32),
        new THREE.Vector3(0.03 * side, 0.36, -0.04),
        new THREE.Vector3(0.04 * side, 0.16, 0.13),
        new THREE.Vector3(0.05 * side, -0.03, 0.05)
      ]);
      registerMesh(new THREE.Mesh(new THREE.TubeGeometry(fxCurve, 22, 0.032, 10, false), makeMat("cerebrum")), "cerebrum", [0.06 * side, 0.18, 0.02]);
    });

    // 3. CENTRALE INSULA (waaiervormige korticale windingen diep in Sylvian groeve)
    [-1, 1].forEach((side) => {
      const insGeo = new THREE.SphereGeometry(1, 22, 18);
      const pos = insGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i), vy = pos.getY(i), vz = pos.getZ(i);
        const fan = 1 + 0.07 * Math.sin(vz * 18 + vy * 8);
        pos.setXYZ(i, vx * 0.11 * fan, vy * 0.22 * fan, vz * 0.34);
      }
      insGeo.computeVertexNormals();
      const ins = new THREE.Mesh(insGeo, makeMat("centrale-insula"));
      ins.position.set(0.49 * side, 0.18, 0.08);
      ins.rotation.set(0.18, 0, -0.14 * side);
      registerMesh(ins, "centrale-insula", [0.34 * side, 0.04, 0.06]);
    });

    // 4. BASALE GANGLIA (Nucleus caudatus + Nucleus lentiformis / Putamen + Celbruggen)
    [-1, 1].forEach((side) => {
      const caudateCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.18 * side, 0.22, 0.34), // Caput (kop)
        new THREE.Vector3(0.24 * side, 0.36, 0.14), // Corpus
        new THREE.Vector3(0.26 * side, 0.32, -0.18),
        new THREE.Vector3(0.32 * side, 0.12, -0.28),
        new THREE.Vector3(0.35 * side, -0.02, 0.04)  // Cauda (staart richting amygdala)
      ]);
      registerMesh(new THREE.Mesh(new THREE.TubeGeometry(caudateCurve, 28, 0.068, 12, false), makeMat("basale-ganglia")), "basale-ganglia", [0.22 * side, 0.14, 0.06]);

      // Nucleus lentiformis (putamen + globus pallidus) naast thalamus
      const lentGeo = new THREE.SphereGeometry(1, 20, 16);
      lentGeo.scale(0.10, 0.16, 0.24);
      const lent = new THREE.Mesh(lentGeo, makeMat("basale-ganglia"));
      lent.position.set(0.33 * side, 0.16, 0.02);
      lent.rotation.y = -0.18 * side;
      registerMesh(lent, "basale-ganglia", [0.28 * side, 0.10, 0.06]);

      // Striatale verbindingsbruggen
      [-0.08, 0.08, 0.22].forEach((zOff) => {
        const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.16, 8), makeMat("basale-ganglia"));
        bridge.position.set(0.27 * side, 0.24, zOff);
        bridge.rotation.z = 0.72 * side;
        registerMesh(bridge, "basale-ganglia", [0.25 * side, 0.12, 0.06]);
      });
    });

    // 5. DIENCEPHALON — THALAMUS (Eivormige kernen + Pulvinar + Adhesio interthalamica + Geniculata + Overgangshals)
    [-1, 1].forEach((side) => {
      const thGeo = new THREE.SphereGeometry(1, 24, 18);
      const tPos = thGeo.attributes.position;
      for (let i = 0; i < tPos.count; i++) {
        const vx = tPos.getX(i), vy = tPos.getY(i), vz = tPos.getZ(i);
        // Breder achteraan (pulvinar), iets smaller vooraan (anterior tubercle)
        const zTaper = 1 - 0.16 * vz;
        tPos.setXYZ(i, vx * 0.135 * zTaper, vy * 0.125, vz * 0.235);
      }
      thGeo.computeVertexNormals();
      const th = new THREE.Mesh(thGeo, makeMat("thalamus"));
      th.position.set(0.145 * side, 0.19, -0.07);
      registerMesh(th, "thalamus", [0.10 * side, 0.08, -0.04]);

      // Geniculate kernen aan onder-achterzijde (verbinding met colliculi van middenhersenen)
      const gen = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 12), makeMat("thalamus"));
      gen.position.set(0.16 * side, 0.085, -0.22);
      registerMesh(gen, "thalamus", [0.10 * side, 0.05, -0.06]);
    });

    // Adhesio interthalamica (brug tussen linker en rechter thalamus)
    const interThal = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.24, 12), makeMat("thalamus"));
    interThal.rotation.z = Math.PI / 2;
    interThal.position.set(0, 0.19, -0.05);
    registerMesh(interThal, "thalamus", [0, 0.08, -0.04]);

    // Pineal body / Habenula tussen pulvinar-kernen direct boven bovenste colliculi
    const pineal = new THREE.Mesh(new THREE.SphereGeometry(0.052, 14, 12), makeMat("thalamus"));
    pineal.scale.set(0.95, 0.85, 1.35);
    pineal.position.set(0, 0.145, -0.26);
    registerMesh(pineal, "thalamus", [0, 0.06, -0.10]);

    // Subthalamische/tegmentale verbindingsbrug: dicht het volledige raakvlak met hypothalamus & middenhersenen (0.00 gat)
    const subThal = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 16), makeMat("thalamus"));
    subThal.scale.set(0.155, 0.088, 0.145);
    subThal.position.set(0, 0.105, -0.09);
    registerMesh(subThal, "thalamus", [0, 0.03, -0.04]);

    // 6. DIENCEPHALON — HYPOTHALAMUS (Ventraal onder thalamus, sluit direct aan op thalamus + middenhersenen)
    // Hoofdmassa: trechtervormige kern onder de thalamus tot aan pedunculi cerebri
    const hypMainGeo = new THREE.SphereGeometry(1, 22, 18);
    hypMainGeo.scale(0.145, 0.115, 0.185);
    const hypMain = new THREE.Mesh(hypMainGeo, makeMat("hypothalamus"));
    hypMain.position.set(0, 0.055, 0.085);
    hypMain.rotation.x = -0.22;
    registerMesh(hypMain, "hypothalamus", [0, -0.04, 0.14]);

    // Verbindingskraag vanuit onderzijde thalamus naar hypothalamus & middenhersenen (0.00 gat)
    [-1, 1].forEach((side) => {
      const mamm = new THREE.Mesh(new THREE.SphereGeometry(0.044, 14, 12), makeMat("hypothalamus"));
      mamm.position.set(0.052 * side, -0.032, 0.015);
      registerMesh(mamm, "hypothalamus", [0.03 * side, -0.06, 0.12]);

      // Tractus opticus van chiasma opticum rondom pedunculi naar geniculatum laterale (thalamus)
      const optCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.13 * side, -0.04, 0.40),
        new THREE.Vector3(0.025 * side, -0.015, 0.24),
        new THREE.Vector3(0.14 * side, 0.035, 0.02),
        new THREE.Vector3(0.16 * side, 0.08, -0.20)
      ]);
      registerMesh(new THREE.Mesh(new THREE.TubeGeometry(optCurve, 22, 0.026, 10, false), makeMat("hypothalamus")), "hypothalamus", [0.04 * side, -0.05, 0.16]);
    });

    // Infundibulum (hypofysesteel) + Hypofyse
    const infCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.01, 0.15),
      new THREE.Vector3(0, -0.11, 0.18),
      new THREE.Vector3(0, -0.17, 0.19)
    ]);
    registerMesh(new THREE.Mesh(new THREE.TubeGeometry(infCurve, 12, 0.028, 10, false), makeMat("hypothalamus")), "hypothalamus", [0, -0.08, 0.16]);

    const pit = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 14), makeMat("hypothalamus"));
    pit.scale.set(1.15, 0.85, 1.0);
    pit.position.set(0, -0.185, 0.19);
    registerMesh(pit, "hypothalamus", [0, -0.09, 0.16]);

    // 7. CEREBELLUM (Hemisferen + Vermis + Flocculi + Middelste Cerebellaire Pedunkels naar Pons)
    const cbLeft = new THREE.Mesh(createCerebellumLobeGeo(THREE, 0.34, 0.27, 0.35, false), makeMat("cerebellum", true));
    cbLeft.position.set(-0.29, -0.40, -0.64);
    registerMesh(cbLeft, "cerebellum", [-0.18, -0.16, -0.38]);

    const cbRight = new THREE.Mesh(createCerebellumLobeGeo(THREE, 0.34, 0.27, 0.35, false), makeMat("cerebellum", true));
    cbRight.position.set(0.29, -0.40, -0.64);
    registerMesh(cbRight, "cerebellum", [0.18, -0.16, -0.38]);

    const cbVermis = new THREE.Mesh(createCerebellumLobeGeo(THREE, 0.14, 0.26, 0.31, true), makeMat("cerebellum", true));
    cbVermis.position.set(0, -0.39, -0.62);
    registerMesh(cbVermis, "cerebellum", [0, -0.16, -0.38]);

    // Cerebellaire pedunkels sluiten vanuit pons (-0.30, -0.17) naadloos aan in het cerebellum (-0.40, -0.58)
    [-1, 1].forEach((side) => {
      const pedCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.11 * side, -0.30, -0.16),
        new THREE.Vector3(0.20 * side, -0.34, -0.34),
        new THREE.Vector3(0.25 * side, -0.39, -0.56)
      ]);
      const pedGeo = new THREE.TubeGeometry(pedCurve, 16, 0.082, 12, false);
      registerMesh(new THREE.Mesh(pedGeo, makeMat("cerebellum")), "cerebellum", [0.09 * side, -0.14, -0.22]);
    });

    // 8. HERSENSTAM (Naadloos opgedeeld in Middenhersenen, Pons & Medulla oblongata langs evalStemAxis)
    registerMesh(new THREE.Mesh(createBrainstemRegionGeo(THREE, 0.17, -0.14, 22), makeMat("middenhersenen", true)), "middenhersenen", [0, -0.10, 0]);
    registerMesh(new THREE.Mesh(createBrainstemRegionGeo(THREE, -0.13, -0.46, 22), makeMat("pons", true)), "pons", [0, -0.16, 0]);
    registerMesh(new THREE.Mesh(createBrainstemRegionGeo(THREE, -0.45, -0.84, 22), makeMat("medulla-oblongata", true)), "medulla-oblongata", [0, -0.22, 0]);

    // 9. RETICULAIRE FORMATIE (Meerdelige kernkolom centraal in de hersenstam langs evalStemAxis)
    const retPts = [];
    for (let i = 0; i <= 14; i++) {
      const y = 0.04 - (0.78 * i) / 14;
      const a = evalStemAxis(y);
      retPts.push(new THREE.Vector3(0, a.y, a.z - 0.025));
    }
    const retCurve = new THREE.CatmullRomCurve3(retPts);
    registerMesh(new THREE.Mesh(new THREE.TubeGeometry(retCurve, 26, 0.048, 12, false), makeMat("reticulaire-formatie")), "reticulaire-formatie", [0, -0.16, -0.18]);

    // Beaded nuclei nodes along reticular formation for anatomical look
    [0.0, -0.22, -0.44, -0.64].forEach((ny) => {
      const a = evalStemAxis(ny);
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.060, 12, 10), makeMat("reticulaire-formatie"));
      node.position.set(0, a.y, a.z - 0.025);
      registerMesh(node, "reticulaire-formatie", [0, -0.16, -0.18]);
    });

    // 10. RUGGENMERG (Sluit op y=-0.78..-0.84 naadloos aan op medulla oblongata langs evalStemAxis)
    registerMesh(new THREE.Mesh(createSpinalCordGeometry(THREE), makeMat("ruggenmerg", true)), "ruggenmerg", [0, -0.42, -0.06]);

    // Vlindervormige grijze stof onderaan het snijvlak van het ruggenmerg
    const bottomAxis = evalStemAxis(-2.08);
    [-1, 1].forEach((side) => {
      const horn = new THREE.Mesh(new THREE.SphereGeometry(0.026, 10, 8), makeMat("ruggenmerg"));
      horn.scale.set(0.8, 0.4, 2.0);
      horn.position.set(0.028 * side, bottomAxis.y + 0.005, bottomAxis.z);
      registerMesh(horn, "ruggenmerg", [0, -0.42, -0.06]);
    });

    // 11. PZS ZENUWEN (Verankerd in hersenstam & ruggenmerg, met dorsaal/ventraal wortelpaar)
    [-1, 1].forEach((side) => {
      // 6 paren craniale zenuwen geworteld in middenhersenen, pons & medulla
      [
        { y: -0.08, rIn: 0.09, zIn: 0.04, xOut: 0.36, yOut: -0.14, zOut: 0.24 },
        { y: -0.26, rIn: 0.14, zIn: 0.05, xOut: 0.46, yOut: -0.31, zOut: 0.20 },
        { y: -0.36, rIn: 0.14, zIn: 0.02, xOut: 0.48, yOut: -0.42, zOut: 0.12 },
        { y: -0.52, rIn: 0.10, zIn: 0.02, xOut: 0.44, yOut: -0.60, zOut: 0.04 },
        { y: -0.66, rIn: 0.09, zIn: 0.01, xOut: 0.40, yOut: -0.75, zOut: -0.05 }
      ].forEach((cn) => {
        const a = evalStemAxis(cn.y);
        const curve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(cn.rIn * side, cn.y, a.z + cn.zIn),
          new THREE.Vector3((cn.rIn + 0.16) * side, cn.y - 0.03, a.z + cn.zIn + 0.08),
          new THREE.Vector3(cn.xOut * side, cn.yOut, a.z + cn.zOut)
        ]);
        registerMesh(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.019, 8, false), makeMat("pzs-overzicht")), "pzs-overzicht", [0.22 * side, -0.16, 0.08]);
      });

      // 5 paren spinale zenuwen langs ruggenmerg: dorsale wortel (afferent, blauw) + ventrale wortel (efferent, oranje)
      [-0.98, -1.22, -1.46, -1.70, -1.92].forEach((sy) => {
        const a = evalStemAxis(sy);
        const joinPt = new THREE.Vector3(0.24 * side, sy - 0.06, a.z);

        // Dorsale wortel (sensorisch/afferent) + spinaal ganglion
        const dorsalCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.05 * side, sy + 0.02, a.z - 0.045),
          new THREE.Vector3(0.16 * side, sy - 0.02, a.z - 0.035),
          joinPt
        ]);
        registerMesh(new THREE.Mesh(new THREE.TubeGeometry(dorsalCurve, 8, 0.015, 7, false), makeMat("pzs-overzicht", false, 0x38bdf8)), "pzs-overzicht", [0.24 * side, -0.42, -0.06]);

        const ganglion = new THREE.Mesh(new THREE.SphereGeometry(0.028, 10, 8), makeMat("pzs-overzicht", false, 0x38bdf8));
        ganglion.scale.set(1.3, 0.85, 0.85);
        ganglion.position.set(0.17 * side, sy - 0.03, a.z - 0.025);
        registerMesh(ganglion, "pzs-overzicht", [0.24 * side, -0.42, -0.06]);

        // Ventrale wortel (motorisch/efferent)
        const ventralCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.05 * side, sy - 0.01, a.z + 0.045),
          new THREE.Vector3(0.16 * side, sy - 0.04, a.z + 0.035),
          joinPt
        ]);
        registerMesh(new THREE.Mesh(new THREE.TubeGeometry(ventralCurve, 8, 0.015, 7, false), makeMat("pzs-overzicht", false, 0xf97316)), "pzs-overzicht", [0.24 * side, -0.42, -0.06]);

        // Gecombineerde spinale zenuw verder naar buiten
        const tipPt = new THREE.Vector3(0.49 * side, sy - 0.18, a.z + 0.05);
        const nerveCurve = new THREE.CatmullRomCurve3([
          joinPt,
          new THREE.Vector3(0.36 * side, sy - 0.11, a.z + 0.02),
          tipPt
        ]);
        registerMesh(new THREE.Mesh(new THREE.TubeGeometry(nerveCurve, 10, 0.021, 8, false), makeMat("pzs-overzicht")), "pzs-overzicht", [0.24 * side, -0.42, -0.06]);
      });
    });

    // ==================== TOUCH / MUIS BESTURING ====================
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const activePointers = new Map();
    let prevPinch = 0, movedDist = 0, lastX = 0, lastY = 0;

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", (e) => {
      dom.setPointerCapture(e.pointerId);
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (activePointers.size === 1) {
        movedDist = 0; lastX = e.clientX; lastY = e.clientY;
      } else if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        prevPinch = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      }
    });

    dom.addEventListener("pointermove", (e) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (activePointers.size === 1) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        movedDist += Math.hypot(dx, dy);
        state.targetYaw += dx * 0.009;
        state.targetPitch = Math.max(-1.15, Math.min(1.15, state.targetPitch + dy * 0.008));
        lastX = e.clientX; lastY = e.clientY;
      } else if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (prevPinch > 0) {
          state.targetZoom = Math.max(2.3, Math.min(7.5, state.targetZoom + (prevPinch - dist) * 0.012));
        }
        prevPinch = dist; movedDist += 20;
      }
    });

    dom.addEventListener("pointerup", (e) => {
      activePointers.delete(e.pointerId);
      if (activePointers.size === 0 && movedDist < 8) {
        const rect = dom.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const pickable = clickableMeshes.filter((m) => m.visible && m.material.opacity > 0.25);
        const hits = raycaster.intersectObjects(pickable, false);
        if (hits.length > 0) {
          const hitId = hits[0].object.userData.topicId;
          state.selectedId = hitId;
          hudBadge.textContent = TOPIC_META[hitId].label;
          if (onSelect) onSelect(hitId);
        }
      }
    });

    dom.addEventListener("wheel", (e) => {
      e.preventDefault();
      state.targetZoom = Math.max(2.3, Math.min(7.5, state.targetZoom + e.deltaY * 0.003));
    }, { passive: false });

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(() => {
        const w = container.clientWidth || 360;
        const h = container.clientHeight || 360;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }).observe(container);
    }

    let clock = 0;
    function updateFrame() {
      clock += 0.035;

      state.yaw += (state.targetYaw - state.yaw) * 0.12;
      state.pitch += (state.targetPitch - state.pitch) * 0.12;
      state.zoom += (state.targetZoom - state.zoom) * 0.14;
      state.explodeAmount += ((state.exploded ? 1 : 0) - state.explodeAmount) * 0.12;

      rootGroup.rotation.y = state.yaw;
      rootGroup.rotation.x = state.pitch;
      camera.position.z = state.zoom;

      const selectedMeta = TOPIC_META[state.selectedId];
      const selectedIsDeepCerebrum = Boolean(selectedMeta && selectedMeta.region === "cerebrum" && selectedMeta.layer === "deep");
      const stemChildIds = new Set(["middenhersenen", "pons", "medulla-oblongata"]);
      const pulse = 0.30 + 0.22 * Math.sin(clock * 2.2);

      for (let i = 0; i < clickableMeshes.length; i++) {
        const m = clickableMeshes[i];
        const ud = m.userData;
        const isSelected = ud.topicId === state.selectedId || (state.selectedId === "hersenstam" && stemChildIds.has(ud.topicId));
        const isDeep = ud.layer === "deep";
        const isOuter = ud.layer === "outer";

        m.position.copy(ud.basePos).addScaledVector(ud.explodeVec, state.explodeAmount);

        let visible = true;
        let opacity = 1.0;

        if (state.layerMode === "cerebrum") {
          visible = ud.region === "cerebrum";
          if (selectedIsDeepCerebrum && isOuter) opacity = 0.16;
        } else if (state.layerMode === "diencephalon") {
          visible = ud.region === "diencephalon";
        } else if (state.layerMode === "cerebellum") {
          visible = ud.region === "cerebellum";
        } else if (state.layerMode === "stem") {
          visible = ud.region === "stem";
        } else if (state.layerMode === "xray") {
          opacity = isOuter ? 0.14 : 1.0;
        } else {
          // "all": volledig dekkend zodat hardware Z-buffer nul sorteer-gaten toont
          opacity = 1.0;
        }

        const effectiveOpacity = isSelected ? 1.0 : opacity;
        const nextTransparent = effectiveOpacity < 0.995;
        m.visible = visible;
        m.material.opacity = effectiveOpacity;
        if (m.material.transparent !== nextTransparent) {
          m.material.transparent = nextTransparent;
          m.material.needsUpdate = true;
        }
        m.material.depthWrite = effectiveOpacity > 0.5;

        if (isSelected) {
          m.material.emissive.setHex(0xffffff);
          m.material.emissiveIntensity = pulse;
        } else {
          m.material.emissive.setHex(0x000000);
          m.material.emissiveIntensity = 0;
        }
      }

      renderer.render(scene, camera);
    }

    function animate() {
      requestAnimationFrame(animate);
      updateFrame();
    }
    animate();
  }

  // ==================== OFFLINE CANVAS FALLBACK ====================
  function initFallbackCanvas(container, state, hudBadge, onSelect) {
    hudBadge.textContent = "Offline 3D-Brein";
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";
    container.insertBefore(canvas, container.firstChild);
    const ctx = canvas.getContext("2d");

    const pts = [
      { id: "frontale-kwab", x: 0, y: 0.45, z: 0.85, r: 0.55 },
      { id: "premotorcortex", x: 0, y: 0.82, z: 0.30, r: 0.35 },
      { id: "primaire-motorcortex", x: 0, y: 0.90, z: 0.06, r: 0.35 },
      { id: "parietale-kwab", x: 0, y: 0.68, z: -0.45, r: 0.52 },
      { id: "occipitale-kwab", x: 0, y: 0.25, z: -1.00, r: 0.42 },
      { id: "temporele-kwab", x: 0.65, y: 0.0, z: 0.05, r: 0.38 },
      { id: "cerebrum", x: 0, y: 0.40, z: 0.0, r: 0.28 },
      { id: "centrale-insula", x: 0.45, y: 0.14, z: 0.10, r: 0.22 },
      { id: "basale-ganglia", x: 0.28, y: 0.20, z: 0.10, r: 0.22 },
      { id: "thalamus", x: 0.15, y: 0.19, z: -0.07, r: 0.18 },
      { id: "hypothalamus", x: 0, y: 0.05, z: 0.09, r: 0.14 },
      { id: "cerebellum", x: 0, y: -0.40, z: -0.64, r: 0.38 },
      { id: "middenhersenen", x: 0, y: 0.02, z: -0.08, r: 0.17 },
      { id: "pons", x: 0, y: -0.29, z: -0.17, r: 0.21 },
      { id: "medulla-oblongata", x: 0, y: -0.63, z: -0.27, r: 0.15 },
      { id: "reticulaire-formatie", x: 0, y: -0.38, z: -0.20, r: 0.09 },
      { id: "ruggenmerg", x: 0, y: -1.45, z: -0.35, r: 0.12 },
      { id: "pzs-overzicht", x: 0.35, y: -1.45, z: -0.34, r: 0.11 }
    ];

    let dragging = false, moved = 0, lx = 0, ly = 0, drawn = [];
    canvas.addEventListener("pointerdown", (e) => { dragging = true; moved = 0; lx = e.clientX; ly = e.clientY; });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lx, dy = e.clientY - ly;
      moved += Math.hypot(dx, dy);
      state.targetYaw += dx * 0.01;
      state.targetPitch = Math.max(-1.1, Math.min(1.1, state.targetPitch + dy * 0.009));
      lx = e.clientX; ly = e.clientY;
    });
    window.addEventListener("pointerup", (e) => {
      if (!dragging) return;
      dragging = false;
      if (moved < 8) {
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left, py = e.clientY - rect.top;
        for (let i = drawn.length - 1; i >= 0; i--) {
          if (Math.hypot(px - drawn[i].sx, py - drawn[i].sy) <= drawn[i].sr + 8) {
            state.selectedId = drawn[i].id;
            if (onSelect) onSelect(drawn[i].id);
            break;
          }
        }
      }
    });

    function loop() {
      requestAnimationFrame(loop);
      const w = container.clientWidth || 360, h = container.clientHeight || 360;
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      state.yaw += (state.targetYaw - state.yaw) * 0.12;
      state.pitch += (state.targetPitch - state.pitch) * 0.12;
      ctx.clearRect(0, 0, w, h);

      const cosY = Math.cos(state.yaw), sinY = Math.sin(state.yaw);
      const cosX = Math.cos(state.pitch), sinX = Math.sin(state.pitch);
      const sf = Math.min(w, h) * 0.24;

      drawn = pts.map((p) => {
        const meta = TOPIC_META[p.id];
        const x1 = p.x * cosY - p.z * sinY, z1 = p.x * sinY + p.z * cosY;
        const y2 = (p.y + 0.2) * cosX - z1 * sinX, z2 = (p.y + 0.2) * sinX + z1 * cosX;
        const persp = 4.6 / (4.6 - z2);
        return {
          id: p.id, hex: meta.hex, region: meta.region, layer: meta.layer,
          sx: w / 2 + x1 * sf * persp, sy: h / 2 - y2 * sf * persp,
          sr: p.r * sf * persp, z: z2
        };
      }).filter((d) => {
        if (state.layerMode === "cerebrum") return d.region === "cerebrum";
        if (state.layerMode === "diencephalon") return d.region === "diencephalon";
        if (state.layerMode === "cerebellum") return d.region === "cerebellum";
        if (state.layerMode === "stem") return d.region === "stem";
        return true;
      }).sort((a, b) => a.z - b.z);

      drawn.forEach((d) => {
        ctx.save();
        ctx.globalAlpha = (state.layerMode === "xray" && d.layer === "outer") ? 0.16 : 0.94;
        ctx.beginPath();
        ctx.arc(d.sx, d.sy, d.sr, 0, Math.PI * 2);
        ctx.fillStyle = d.hex;
        ctx.fill();
        if (d.id === state.selectedId) {
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = "#ffffff";
          ctx.stroke();
        }
        ctx.restore();
      });
    }
    loop();
  }

  return { create, TOPIC_META, evalStemAxis, evalBrainSurface, mapTopicTo3DId };
})();
