// Prisma V1.01 browser replica, ported from Prisma.cs.
(() => {
  "use strict";
  const host = document.getElementById("prismaWrap");
  if (!host) return;
  const W = 1180, H = 790, pt = (p) => p * 4 / 3 + "px";
  const LS = { get(k) { try { return localStorage.getItem("prismaDemo." + k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem("prismaDemo." + k, v); } catch (e) {} } };
  const K = (r, g, b) => [r, g, b], WHITE = [255, 255, 255], BLACK = [0, 0, 0];
  const mix = (a, b, t) => [0, 1, 2].map((i) => Math.trunc(a[i] + (b[i] - a[i]) * t));
  const css = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
  const T = (name, bg, fill, fill2, line, track, acc, acc2, mute, glow) => ({ name, bg, fill, fill2, line, track, acc, acc2, mute, glow });
  const THEMES = [
    T("Purple", K(6, 4, 10), K(15, 10, 24), K(23, 16, 36), K(38, 27, 59), K(43, 32, 64), K(168, 85, 247), K(124, 58, 237), K(143, 132, 168), false),
    T("Ocean", K(4, 8, 14), K(10, 18, 30), K(16, 28, 46), K(25, 45, 72), K(30, 50, 80), K(56, 189, 248), K(14, 116, 196), K(125, 150, 175), true),
    T("Crimson", K(10, 4, 6), K(24, 10, 14), K(38, 16, 22), K(66, 26, 36), K(72, 30, 40), K(244, 63, 94), K(190, 18, 60), K(176, 130, 140), false),
    T("Matrix", K(2, 9, 5), K(8, 22, 14), K(14, 36, 22), K(22, 62, 40), K(26, 70, 46), K(52, 211, 153), K(5, 150, 105), K(110, 170, 140), true),
    T("Sunset", K(12, 6, 3), K(28, 16, 8), K(44, 26, 12), K(76, 46, 22), K(84, 52, 26), K(251, 146, 60), K(217, 95, 14), K(186, 150, 120), false),
    T("Mono", K(8, 8, 9), K(20, 20, 22), K(32, 32, 35), K(52, 52, 58), K(60, 60, 66), K(228, 228, 235), K(120, 120, 130), K(150, 150, 160), true),
    T("Custom", K(5, 7, 12), K(13, 17, 27), BLACK, BLACK, BLACK, K(59, 130, 246), BLACK, BLACK, false),
  ];
  const derive = (t) => { t.fill2 = mix(t.fill, WHITE, 0.07); t.line = mix(t.fill, t.acc, 0.28); t.track = mix(t.fill, t.acc, 0.35); t.acc2 = mix(t.acc, BLACK, 0.3); t.mute = mix(mix(t.fill, WHITE, 0.6), t.acc, 0.2); };
  derive(THEMES[6]);
  let L = THEMES[2], themeIdx = 2, rad = 18;
  const R = (h) => Math.min(Math.trunc(h / 2), Math.max(3, Math.trunc(Math.min(h, 36) * rad / 64)));
  const S = { sat: 50, bri: 0, con: 100, gam: 100, def: 50 };
  const mins = [0, -100, 50, 50], maxs = [100, 100, 150, 200], names = ["Saturation", "Brightness", "Contrast", "Gamma"], keys = ["sat", "bri", "con", "gam"];
  let filterOn = true, screenOn = false, allMode = false, page = 0, panelOpen = true;
  let animOn = true, soundOn = false, warpOn = true, tourDone = LS.get("tour") === "1";
  const pnames = ["Competitive", "Vivid", "Cinematic", "Night", "Natural"], pvals = { Competitive: [75, 5, 110, 110], Vivid: [85, 0, 115, 100], Cinematic: [60, -5, 120, 90], Night: [55, 20, 95, 130], Natural: [50, 0, 100, 100] };

  host.innerHTML = "";
  const root = document.createElement("div"); root.id = "prisma"; host.appendChild(root);
  const radEls = [], radCards = [], tiles = [];
  const fit = () => { const s = Math.min(1, host.clientWidth / W); root.style.transform = `scale(${s})`; host.style.height = H * s + "px"; };
  addEventListener("resize", fit);
  let xprevDraw = null;
  function applyTheme() {
    const t = L, v = { bg: t.bg, fill: t.fill, fill2: t.fill2, line: t.line, track: t.track, acc: t.acc, acc2: t.acc2, mute: t.mute,
      border: mix(t.line, t.acc, 0.3), navon: mix(t.fill2, t.acc, 0.22), navonb: mix(t.line, t.acc, 0.5), togon: mix(t.fill2, t.acc, 0.16),
      bub: mix(t.fill, t.acc, 0.18), fillh: mix(t.fill, t.acc, 0.18), fill2h: mix(t.fill2, t.acc, 0.18), acc2h: mix(t.acc2, t.acc, 0.18),
      pb: t.glow ? mix(t.line, t.acc, 0.6) : t.line, pg1: t.acc2, pg2: mix(t.acc2, t.acc, 0.6), pg1h: mix(t.acc2, t.acc, 0.5), pg2h: t.acc,
      pt: t.acc[0] + t.acc[1] + t.acc[2] > 600 ? BLACK : WHITE };
    for (const k in v) root.style.setProperty("--" + k, css(v[k]));
    root.style.setProperty("--pbw", t.glow ? "2px" : "1px"); root.style.setProperty("--rad", rad);
    document.documentElement.style.setProperty("--pacc", css(t.acc));
    radEls.forEach(([e, h]) => (e.style.borderRadius = R(h) + "px"));
    radCards.forEach((c) => (c.style.borderRadius = Math.min(rad, 24) + "px"));
    tiles.forEach((tl, i) => tl.draw(i === themeIdx));
    drawPreview(); drawStrip(); if (xprevDraw) xprevDraw(); refreshLogoImg();
  }

  // builders
  function box(parent, cls, x, y, w, h, tag) {
    const e = document.createElement(tag || "div"); e.className = "ab " + (cls || "");
    Object.assign(e.style, { left: x + "px", top: y + "px", width: w + "px", height: h + "px" });
    parent.appendChild(e); return e;
  }
  function label(parent, text, x, y, w, h, color, size, bold, align) {
    const e = box(parent, "lbl", x, y, w, h); e.textContent = text;
    e.style.color = color; e.style.fontSize = pt(size); if (bold) e.style.fontWeight = 700; if (align) e.style.textAlign = align;
    return e;
  }
  const MUTE = "var(--mute)", ACC = "var(--acc)";
  const rpanel = (p, x, y, w, h) => box(p, "rp", x, y, w, h);
  function rbtn(parent, text, x, y, w, h, back, onClick) {
    const b = box(parent, "rb " + (back === 1 ? "f1" : back === "red" ? "red" : "f2"), x, y, w, h, "button");
    b.textContent = text; radEls.push([b, h]);
    if (onClick) b.addEventListener("click", (e) => { snd(0); onClick(e); });
    return b;
  }
  function pill(parent, text, x, y, w, h, onClick, glyph, quiet) {
    const b = box(parent, "pill", x, y, w, h, "button");
    b.textContent = glyph ? glyph + "  " + text : text; radEls.push([b, h]);
    if (onClick) b.addEventListener("click", (e) => { if (!quiet) snd(0); onClick(e); });
    return b;
  }
  function textbox(parent, x, y, w, max) { const t = box(parent, "tb", x, y, w, 25, "input"); t.type = "text"; if (max) t.maxLength = max; t.spellcheck = false; return t; }
  function toggle(parent, onT, offT, x, y, w, h, on, change) {
    const e = box(parent, "tg", x, y, w, h); radEls.push([e, h]);
    e.innerHTML = `<span class="tr" style="top:${(h - 20) / 2 - 1}px"><span class="kn"></span></span><span class="tx" style="top:${(h - 20) / 2 - 1}px"></span>`;
    const tx = e.querySelector(".tx");
    e.set = (v) => { e.checked = v; e.classList.toggle("on", v); tx.textContent = v ? onT : offT; };
    e.set(on);
    e.addEventListener("click", () => { e.set(!e.checked); snd(e.checked ? 1 : 2); if (change) change(e.checked); });
    return e;
  }
  const mksw = (p, t, x, y, on, ch) => toggle(p, t + ": on", t + ": off", x, y, 320, 38, on, ch);
  function slider(parent, x, y, w, lo, hi, val, onChange, onRelease) {
    const e = box(parent, "ps", x, y, w, 28);
    e.innerHTML = '<div class="t"></div><div class="f"></div><div class="k"></div>';
    const f = e.querySelector(".f"), k = e.querySelector(".k");
    let v = val;
    const draw = () => { const t = hi > lo ? (v - lo) / (hi - lo) : 0, px = 12 + t * (w - 24); k.style.left = px + "px"; f.style.width = Math.max(0, px - 9) + "px"; f.style.display = px > 12.5 ? "" : "none"; };
    e.get = () => v;
    e.set = (nv, silent) => { nv = Math.max(lo, Math.min(hi, Math.round(nv))); if (nv === v) return; v = nv; draw(); if (!silent && onChange) onChange(v); };
    const fromX = (cx) => { const r = e.getBoundingClientRect(), s = r.width / w; let t = ((cx - r.left) / s - 12) / (w - 24); t = Math.max(0, Math.min(1, t)); const nv = lo + Math.round(t * (hi - lo)); if (nv !== v) { v = nv; draw(); if (onChange) onChange(v); } };
    e.addEventListener("pointerdown", (ev) => { e.setPointerCapture(ev.pointerId); e.classList.add("drag"); fromX(ev.clientX); });
    e.addEventListener("pointermove", (ev) => { if (e.classList.contains("drag")) fromX(ev.clientX); });
    const up = () => { if (!e.classList.contains("drag")) return; e.classList.remove("drag"); if (onRelease) onRelease(v); };
    e.addEventListener("pointerup", up); e.addEventListener("pointercancel", up);
    draw(); return e;
  }
  const flow = (p, x, y, w, h) => box(p, "flow", x, y, w, h);
  const mctx = document.createElement("canvas").getContext("2d");
  const measure = (t) => { mctx.font = '13.33px "Segoe UI", "Open Sans", system-ui, sans-serif'; return Math.ceil(mctx.measureText(t).width) + 6; };
  function flowBtn(fl, text, sel, onClick) {
    const b = document.createElement("button"); b.className = "ab rb f2" + (sel ? " sel" : ""); b.textContent = text;
    Object.assign(b.style, { width: measure(text) + 30 + "px", height: "30px", position: "relative", borderRadius: R(30) + "px" }); radEls.push([b, 30]);
    if (onClick) b.addEventListener("click", (e) => { snd(0); onClick(e); });
    fl.appendChild(b); return b;
  }
  let actx = null;
  function snd(k) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const q = [[[520], 50, 0.07], [[440, 587], 80, 0.09], [[587, 440], 80, 0.09], [[440, 554, 659], 120, 0.09]][k];
      let t0 = actx.currentTime;
      for (const fr of q[0]) {
        const o = actx.createOscillator(), g = actx.createGain(), d = q[1] / 1000;
        o.frequency.value = fr; o.connect(g); g.connect(actx.destination);
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(q[2], t0 + d / 2); g.gain.linearRampToValueAtTime(0, t0 + d);
        o.start(t0); o.stop(t0 + d); t0 += d;
      }
    } catch (e) {}
  }

  // header
  const logoSvg = (sz) => `<svg viewBox="0 0 64 64" width="${sz}" height="${sz}"><defs><linearGradient id="lg${sz}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--acc)"/><stop offset="1" style="stop-color:var(--acc2)"/></linearGradient></defs><polygon points="32,3 60,32 32,61 4,32" fill="url(#lg${sz})"/><polygon points="32,3 60,32 32,32" fill="rgba(255,255,255,.35)"/><path d="M4 32H60M32 3V61" stroke="rgba(255,255,255,.59)" stroke-width="2"/></svg>`;
  const logo = box(root, "", 18, 14, 32, 32); logo.innerHTML = logoSvg(32); logo.style.cursor = "pointer";
  const brand = label(root, "P R I S M A", 58, 18, 124, 28, "#fff", 13, true); brand.style.cursor = "pointer";
  box(root, "bubble", 188, 23, 58, 22).textContent = "V1.01";
  logo.onclick = brand.onclick = () => showSplashScreen();
  box(root, "streak", 0, 62, 460, 3);
  const capBtn = (x, kind) => { const c = box(root, "cap " + (kind ? "x" : ""), x, 16, 34, 30); radEls.push([c, 30]);
    c.innerHTML = kind ? '<svg viewBox="0 0 34 30"><path d="M12 10 22 20M22 10 12 20"/></svg>' : '<svg viewBox="0 0 34 30"><path d="M11 15H23"/></svg>'; return c; };
  capBtn(1090, 0).onclick = () => showSplashScreen();
  capBtn(1128, 1).onclick = () => showSplashScreen();
  const filterT = toggle(root, "Filter on", "Filter off", 952, 14, 122, 36, true, (v) => { filterOn = v; applyScreen(); updatePreview(); updateStatus(); });

  // sidebar
  const side = rpanel(root, 18, 66, 214, 584);
  label(side, "MENU", 20, 16, 150, 18, MUTE, 8, true);
  label(side, "GENERAL", 20, 396, 150, 18, MUTE, 8, true);
  const pageNames = ["Colour", "Presets", "Themes", "Account", "About", "Settings", "Optimize", "Crosshair", "Binds", "Overlay", "Games"];
  const glyphs = ["◐", "☰", "✦", "☺", "ⓘ", "⚙", "⚡", "⊕", "⌨", "▤", "♞"];
  const tops = [36, 80, 124, 416, 504, 460, 168, 212, 256, 300, 344];
  const nav = pageNames.map((n, i) => {
    const b = box(side, "nb", 12, tops[i], 190, 42); radEls.push([b, 42]);
    b.innerHTML = `<span class="g${i === 8 ? " emo" : ""}">${glyphs[i]}</span><span class="t">${n}</span>`;
    b.onclick = () => { snd(0); onNav(i); };
    return b;
  });

  // picture panel
  const pp = rpanel(root, 246, 66, 916, 470); pp.classList.add("lay");
  const prevC = box(pp, "prev", 12, 12, 892, 384, "canvas"); prevC.width = 892; prevC.height = 384;
  const strip = box(pp, "strip lay", 12, 402, 476, 58, "canvas"); strip.width = 476; strip.height = 58;
  const fileIn = document.createElement("input"); fileIn.type = "file"; fileIn.accept = "image/png,image/jpeg,image/bmp"; fileIn.multiple = true; fileIn.hidden = true; root.appendChild(fileIn);
  const loadBtn = pill(pp, "Load screenshot", 496, 414, 142, 34, () => fileIn.click(), "⬆"); loadBtn.classList.add("lay");
  const delBtn = rbtn(pp, "Delete screenshot", 646, 414, 128, 34, 2, () => deleteShot(shot)); delBtn.classList.add("lay"); delBtn.style.display = "none";
  const hint = label(pp, "Prisma works best with your own uploaded screenshots", 780, 404, 124, 56, MUTE, 8.5, false, "right");
  hint.classList.add("lay"); Object.assign(hint.style, { display: "flex", alignItems: "center", justifyContent: "flex-end" });

  // controls panel
  const ctrl = rpanel(root, 246, 548, 916, 226); ctrl.classList.add("lay");
  const title = label(ctrl, "Colour", 18, 14, 300, 28, "#fff", 13, true);
  const addBtn = rbtn(ctrl, "+", 862, 12, 36, 32, 1, () => { msg.textContent = "No new displays found. Connect another monitor, then press + again."; });
  const allBtn = rbtn(ctrl, "All displays", 734, 12, 120, 32, 1, () => { allMode = !allMode; allBtn.classList.toggle("sel", allMode); d1.classList.toggle("sel", !allMode); msg.textContent = allMode ? "All displays now share the same settings." : ""; });
  const d1 = rbtn(ctrl, "Display 1", 618, 12, 104, 32, 1, () => { allMode = false; allBtn.classList.remove("sel"); d1.classList.add("sel"); msg.textContent = ""; });
  d1.classList.add("sel");
  const pages = pageNames.map(() => { const p = box(ctrl, "page lay", 6, 46, 904, 148); p.style.display = "none"; p.style.background = "var(--fill)"; return p; });

  // page 0: colour
  const cp = pages[0], bars = [], vals = [];
  const fmt = (k, v) => k === 0 ? v + "%" : k === 1 ? (v > 0 ? "+" : "") + v : k === 2 ? v + "%" : (v / 100).toFixed(2);
  for (let k = 0; k < 4; k++) {
    const x = 18 + k * 222;
    label(cp, names[k], x, 4, 110, 22, "#fff", 10);
    vals[k] = label(cp, "", x + 100, 4, 66, 22, ACC, 10, true, "right");
    rbtn(cp, "↺", x + 172, 1, 28, 26, 1, () => bars[k].set(k === 0 ? S.def : k === 1 ? 0 : 100));
    bars[k] = slider(cp, x - 4, 30, 208, mins[k], maxs[k], S[keys[k]], (v) => { S[keys[k]] = v; vals[k].textContent = fmt(k, v); updatePreview(); applyScreen(); });
  }
  const screenT = toggle(cp, "Whole screen: on", "Whole screen: off", 18, 66, 230, 38, false, (v) => { screenOn = v; applyScreen(); updateStatus(); });
  rbtn(cp, "Reset this display", 590, 68, 150, 34, 2, () => resetDisplay());
  rbtn(cp, "Reset all displays", 750, 68, 150, 34, 2, () => resetDisplay());
  const status = label(cp, "", 18, 108, 880, 20, "#fff", 9.5, true);
  const msg = label(cp, "", 18, 128, 880, 20, MUTE, 9);

  // page 1: presets
  const pr = pages[1];
  label(pr, "Save the current look for this display", 18, 6, 400, 22, MUTE, 9);
  const pname = textbox(pr, 18, 34, 300, 20);
  pill(pr, "Save look", 332, 32, 140, 30, () => savePreset());
  const plist = flow(pr, 18, 76, 880, 60);
  label(pr, "Click a saved look to use it. Right-click it to delete it.", 18, 142, 880, 22, MUTE, 8.5);
  const delPop = rbtn(pr, "Delete", 0, 0, 90, 30, "red", () => { const n = delPop.dataset.n; delPop.style.display = "none"; if (n) { pnames.splice(pnames.indexOf(n), 1); delete pvals[n]; rebuildPresets(); refreshGames(); } });
  delPop.style.display = "none"; delPop.style.zIndex = 5; delPop.addEventListener("mouseleave", () => (delPop.style.display = "none"));

  // page 2: themes
  const th = pages[2];
  THEMES.forEach((t, i) => {
    const c = box(th, "tile", 12 + i * 126, 4, 118, 92, "canvas"); c.width = 118; c.height = 92;
    c.draw = (sel) => {
      const g = c.getContext("2d"); g.fillStyle = css(L.fill); g.fillRect(0, 0, 118, 92);
      g.beginPath(); g.roundRect(1.5, 1.5, 114, 88, R(92)); g.fillStyle = css(t.fill); g.fill(); g.lineWidth = sel ? 2.5 : 1; g.strokeStyle = css(sel ? t.acc : t.line); g.stroke();
      [[t.acc, 14], [t.acc2, 34], [t.mute, 54]].forEach(([col, x]) => { g.beginPath(); g.arc(x + 7, 21, 7, 0, 7); g.fillStyle = css(col); g.fill(); });
      g.fillStyle = css(t.track); g.fillRect(14, 44, 78, 6); g.fillStyle = css(t.acc); g.fillRect(14, 44, 46, 6);
      g.fillStyle = "#fff"; g.font = 'bold 13.33px "Segoe UI", "Open Sans", system-ui, sans-serif'; g.textBaseline = "top"; g.fillText(t.name, 14, 64);
    };
    c.onclick = () => { snd(0); setTheme(i); };
    tiles.push(c);
  });
  label(th, "Make your own:", 14, 112, 120, 24, MUTE, 9.5);
  rbtn(th, "Accent", 136, 108, 90, 32, 2, () => pickCustom(0));
  rbtn(th, "Background", 232, 108, 112, 32, 2, () => pickCustom(1));
  rbtn(th, "Panels", 350, 108, 90, 32, 2, () => pickCustom(2));
  label(th, "Roundness", 470, 112, 90, 24, MUTE, 9.5);
  const roundS = slider(th, 560, 110, 200, 4, 32, rad, (v) => { rad = v; applyTheme(); });

  // page 3: account (real login, same account as the app)
  const ac = pages[3], C = window.PRISMA || {};
  const sb = window.supabase && C.SUPABASE_ANON_KEY && !C.SUPABASE_ANON_KEY.startsWith("PASTE_") ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
  const acOut = [label(ac, "Email", 18, 6, 280, 20, MUTE, 9), label(ac, "Password", 310, 6, 280, 20, MUTE, 9)];
  const email = textbox(ac, 18, 30, 280), pass = textbox(ac, 310, 30, 280); pass.type = "password"; acOut.push(email, pass);
  const acMsg = label(ac, "", 18, 100, 880, 44, MUTE, 9.5);
  acOut.push(pill(ac, "Log in", 610, 28, 130, 32, () => acAuth(false)), rbtn(ac, "Create account", 750, 28, 150, 32, 2, () => acAuth(true)),
    label(ac, "Log in to save your looks, crosshairs and game profiles online and use them on another PC.", 18, 70, 880, 22, MUTE, 8.5));
  const acWho = label(ac, "", 18, 10, 700, 30, "#fff", 12, true);
  const acIn = [acWho, pill(ac, "Upload to cloud", 18, 52, 190, 36, () => { acMsg.textContent = "Upload is off in the browser demo so your real saves stay safe. Use the Prisma app."; }),
    rbtn(ac, "Download from cloud", 220, 52, 210, 36, 2, () => acDownload()),
    rbtn(ac, "Log out", 442, 52, 120, 36, 2, async () => { if (sb) await sb.auth.signOut(); acEmail = ""; acShow(); acMsg.textContent = "Logged out."; }),
    label(ac, "Upload saves your looks, crosshairs and game profiles. Download replaces the ones on this PC with your saved copy.", 18, 150, 880, 22, MUTE, 8.5)];
  let acEmail = "", acBusy = false;
  const acShow = () => { const inn = !!acEmail; acOut.forEach((c) => (c.style.display = inn ? "none" : "")); acIn.forEach((c) => (c.style.display = inn ? "" : "none")); acWho.textContent = "Signed in as " + acEmail; };
  async function acAuth(create) {
    if (acBusy) return;
    const em = email.value.trim(), pw = pass.value;
    if (em.length < 5 || em.indexOf("@") < 1) return (acMsg.textContent = "Type a valid email.");
    if (pw.length < 6) return (acMsg.textContent = "Your password needs at least 6 characters.");
    if (!sb) return (acMsg.textContent = "Could not reach the server. Are you online?");
    acBusy = true; acMsg.textContent = "Working...";
    try {
      const { data, error } = create ? await sb.auth.signUp({ email: em, password: pw, options: { emailRedirectTo: new URL("account.html", location.href).href } }) : await sb.auth.signInWithPassword({ email: em, password: pw });
      if (error) { const m = error.message || ""; acMsg.textContent = /invalid login/i.test(m) ? "Wrong email or password." : /already/i.test(m) ? "That email already has an account. Log in instead." : /rate limit/i.test(m) ? "Too many tries. Wait a minute and try again." : m; }
      else if (data.session) { acEmail = em; pass.value = ""; acShow(); acMsg.textContent = create ? "Account created. You are logged in." : "Logged in."; }
      else acMsg.textContent = "Account created. Check your email to confirm it, then log in.";
    } catch (e) { acMsg.textContent = "Could not reach the server. Are you online?"; }
    acBusy = false;
  }
  async function acDownload() {
    if (!sb) return;
    acMsg.textContent = "Downloading...";
    try {
      const { data: { user } } = await sb.auth.getUser();
      const { data, error } = await sb.from("prisma_sync").select("data").eq("user_id", user.id).maybeSingle();
      if (error) return (acMsg.textContent = "Could not download right now.");
      if (!data || !data.data) return (acMsg.textContent = "Nothing saved online yet. Upload first.");
      const txt = new TextDecoder().decode(Uint8Array.from(atob(data.data), (c) => c.charCodeAt(0)));
      txt.split("@@FILE ").forEach((part) => {
        const nl = part.indexOf("\n"); if (nl < 0) return;
        const name = part.slice(0, nl).trim();
        part.slice(nl + 1).replace(/\r/g, "").split("\n").forEach((line) => {
          const p = line.split("|");
          if (name === "presets.txt" && p.length >= 5) { if (!pvals[p[0]]) pnames.push(p[0]); pvals[p[0]] = p.slice(1, 5).map(Number); }
          if (name === "xhs.txt" && p.length >= 8) { if (!xSaved[p[0]]) xNames.push(p[0]); xSaved[p[0]] = xhParse(p, 1, p.length >= 10); }
          if (name === "games.txt" && p.length >= 2 && !line.startsWith("on=")) games.push([p[0], p[1], p[2] || "None", "demo"]);
        });
      });
      rebuildPresets(); rebuildXList(); refreshGames();
      acMsg.textContent = "Downloaded! Your saved looks are in the demo now.";
    } catch (e) { acMsg.textContent = "Could not download right now."; }
  }
  if (sb) sb.auth.getSession().then(({ data }) => { if (data.session) { acEmail = data.session.user.email; acShow(); } });
  acShow();

  // page 8: binds
  const bpg = pages[8], bn = ["Filter on / off", "Whole screen on / off", "Crosshair on / off", "Show / hide Prisma", "Reset all displays"];
  const BindHint = "Click a key box, then press the keys you want, for example Ctrl + Alt + P. Esc cancels.";
  const binds = [null, null, null, null, null, null], bKey = [];
  let capId = 0;
  for (let i = 0; i < 5; i++) {
    const id = i + 1, bx = 18 + Math.trunc(i / 3) * 442, by = 10 + (i % 3) * 52;
    label(bpg, bn[i], bx, by + 6, 190, 24, "#fff", 10);
    bKey[id] = rbtn(bpg, "Not set", bx + 196, by, 150, 34, 2, () => { capId = id; refreshBinds(); bKey[id].textContent = "Press keys..."; bHint.textContent = "Press the keys you want. Esc cancels."; });
    rbtn(bpg, "Clear", bx + 354, by, 70, 34, 2, () => { binds[id] = null; refreshBinds(); });
  }
  const bHint = label(bpg, BindHint, 18, 170, 860, 22, MUTE, 9);
  const refreshBinds = () => { for (let id = 1; id <= 5; id++) bKey[id].textContent = binds[id] || "Not set"; };
  const keyName = (e) => /^Key[A-Z]$/.test(e.code) ? e.code.slice(3) : /^Digit\d$/.test(e.code) ? e.code.slice(5) : /^F\d+$/.test(e.code) ? e.code : e.key.length === 1 ? e.key.toUpperCase() : e.key;
  addEventListener("keydown", (e) => {
    if (["Control", "Shift", "Alt", "Meta"].includes(e.key)) return;
    const combo = (e.ctrlKey ? "Ctrl+" : "") + (e.altKey ? "Alt+" : "") + (e.shiftKey ? "Shift+" : "");
    if (capId > 0) {
      e.preventDefault(); const id = capId; capId = 0;
      if (e.key === "Escape") { refreshBinds(); bHint.textContent = BindHint; return; }
      if (!combo) { refreshBinds(); bHint.textContent = "Use Ctrl, Alt or Shift together with a key."; return; }
      binds[id] = combo + keyName(e); refreshBinds(); bHint.textContent = BindHint; return;
    }
    if (!combo) return;
    const id = binds.indexOf(combo + keyName(e));
    if (id > 0) { e.preventDefault(); runBind(id); }
  });
  function runBind(id) {
    if (id === 1) { filterOn = !filterOn; filterT.set(filterOn); applyScreen(); updatePreview(); updateStatus(); }
    else if (id === 2) { screenOn = !screenOn; screenT.set(screenOn); applyScreen(); updateStatus(); }
    else if (id === 3) { xhOn = !xhOn; xhT.set(xhOn); xhApply(); }
    else if (id === 4) root.style.visibility = root.style.visibility === "hidden" ? "" : "hidden";
    else resetDisplay();
  }

  // page 5: settings
  const se = pages[5];
  mksw(se, "Start with Windows", 18, 8, false);
  mksw(se, "Start minimised", 18, 54, false);
  mksw(se, "Instant mode", 18, 100, false, (v) => { animOn = !v; root.classList.toggle("instant", v); });
  label(se, "Turn this on if your Prisma is lagging. It turns off all motion.", 18, 142, 320, 34, MUTE, 8.5);
  mksw(se, "Sound cues", 18, 178, false, (v) => { soundOn = v; snd(1); });
  mksw(se, "Start animation", 350, 178, true, (v) => (warpOn = v));
  mksw(se, "Show start screen", 350, 8, true);
  mksw(se, "Keep colours applied", 350, 54, false);
  mksw(se, "Background animation", 350, 100, true, (v) => root.classList.toggle("nobg", !v));
  label(se, "A light streak under the title bar.", 350, 144, 320, 24, MUTE, 8.5);
  rbtn(se, "Open settings folder", 690, 10, 200, 34, 2, () => (updMsg.textContent = "In the app this opens %APPDATA%\\Prisma."));
  rbtn(se, "Reset Prisma settings", 690, 54, 200, 34, 2, () => { resetDisplay(); screenOn = false; screenT.set(false); applyScreen(); rad = 18; roundS.set(18, true); setTheme(2); updateStatus(); msg.textContent = "Prisma settings were reset."; });
  rbtn(se, "Replay tour", 690, 98, 200, 34, 2, () => startTour());
  rbtn(se, "Check for updates", 690, 142, 200, 34, 2, () => { updMsg.textContent = "Checking..."; setTimeout(() => (updMsg.textContent = "You have the newest version."), 700); });
  const updMsg = label(se, "", 690, 180, 210, 36, MUTE, 8.5);

  // page 4: about
  const ab = pages[4]; ab.classList.add("scroll");
  const aTitle = ["Beta version", "About Prisma", "How to use it", "Rainbow Six Siege", "Start-up and closing", "Troubleshooting", "About us"];
  const aText = ["Prisma is in beta. It is still being tested, so it might be a bit laggy or have small bugs, especially when you drag the sliders very fast or use several big monitors. If something looks wrong, restart Prisma or press Reset all displays. Thank you for trying it!",
    "Prisma is a game toolkit for Windows PCs. It changes saturation (through your NVIDIA driver), brightness, contrast and gamma for every monitor, and it also has Windows optimizations for smoother games, a crosshair overlay, hotkeys and themes. More tools are coming.",
    "1. Move the sliders and drag the line on the picture to compare before and after.  2. Press Load screenshot to add your own pictures. Click one in the strip to switch to it, or click the x on it to delete it.  3. Turn on Whole screen to apply the look to your real screen.  4. Save looks you like on the Presets tab.",
    "Run Siege in borderless or windowed mode for the most reliable result. Prisma changes your whole display through the driver and Windows, it does not touch the game. Check Ubisoft's rules about colour tools before using it in ranked matches.",
    "Start with Windows opens Prisma minimised when you sign in. Minimising keeps it running as normal. Closing the window leaves your colours applied. Turn Whole screen off first if you want normal colours back.",
    "If saturation does nothing, update your NVIDIA driver and restart Prisma. The message under the sliders shows the exact reason. If colours look wrong, press Reset all displays or turn Whole screen off. Your settings are stored in %APPDATA%\\Prisma.",
    "Prisma is a small personal project made for gamers who want their games to look and run better. New tools are added all the time. Accounts let you sync your looks to another PC. Version V1.01."];
  const aHead = [], aBody = [], aOpen = [];
  aText.forEach((t, i) => {
    const h = rbtn(ab, "", 8, 0, 862, 34, 2, () => { aOpen[i] = !aOpen[i]; aboutLayout(); }); h.classList.add("left", "acc");
    const l = label(ab, t, 20, 0, 838, 10, MUTE, 9.5); l.classList.add("acc");
    aHead.push(h); aBody.push(l); aOpen.push(i === 0);
  });
  const spacer = box(ab, "", 0, 0, 1, 1);
  function aboutLayout() {
    let y = 4;
    aHead.forEach((h, i) => {
      h.textContent = (aOpen[i] ? "▾   " : "▸   ") + aTitle[i]; h.style.top = y + "px"; y += 38;
      const b = aBody[i]; b.style.top = y + "px";
      let full = 0; if (aOpen[i]) { b.style.height = "auto"; full = b.scrollHeight + 12; }
      b.style.height = full + "px"; b.style.visibility = full ? "" : "hidden"; y += full + (full ? 6 : 0);
    });
    spacer.style.top = y + "px";
  }

  // big pages: Optimize, Crosshair, Overlay, Games
  const bigPanel = () => { const p = box(root, "", 246, 66, 916, 708); p.style.display = "none"; return p; };
  const header = (p, t, sub) => { const hd = rpanel(p, 0, 0, 916, 100); label(hd, t, 24, 12, 400, 40, "#fff", 20, true); return [hd, label(hd, sub, 24, 58, 660, 24, MUTE, 10)]; };

  const optPanel = bigPanel();
  const [ohd, optSub] = header(optPanel, "Optimizer", "Real Windows tweaks for smoother games. Undo puts it all back.");
  const TW = [["High performance power plan", "CPU stays at full speed instead of saving power. Steadier frame times."], ["Game Mode", "Windows gives the game you play first claim on CPU and GPU time."], ["Background recording off", "Stops Xbox Game Bar recording clips in the background."], ["Windowed game boost", "Flip model for borderless and windowed games: lower input delay."], ["Mouse acceleration off", "1:1 aim. Turns off Enhance pointer precision."], ["Sticky Keys popup off", "No more Sticky Keys window when you press Shift five times."], ["Pop-up notifications off", "No app notifications popping up over your game."], ["Background apps off", "Store apps stop running in the background."], ["Transparency off", "Less GPU work on the taskbar and Windows menus."], ["Window animations off", "Windows open and minimize instantly."], ["Game Bar popups off", "Stops the Game Bar tips and the controller popup."], ["Taskbar animations off", "Taskbar buttons stop sliding and fading."], ["Menus open instantly", "Removes the small wait before menus open."], ["Windows tips off", "No more tips, ads and suggestions popping up."], ["Faster key repeat", "Keys repeat sooner when you hold them down."], ["Faster startup apps", "Apps that start with Windows do not wait for a delay."]];
  rbtn(ohd, "Undo all", 640, 28, 120, 44, 2, () => { cards.forEach((c) => c.setOn(false)); optSub.textContent = "Everything is back to how it was."; });
  pill(ohd, "Optimize all", 772, 26, 124, 48, () => { cards.forEach((c) => c.setOn(true)); optSub.textContent = "All tweaks are on."; });
  const optScroll = box(optPanel, "scroll", 0, 112, 916, 596);
  const card = (t, d, x, y, w, btn) => {
    const c = box(optScroll, "tw", x, y, w, 92); radCards.push(c);
    c.innerHTML = `<span class="tt"></span><span class="td" style="width:${w - (btn ? 190 : 120)}px"></span>`;
    c.querySelector(".tt").textContent = t; const dd = c.querySelector(".td"); dd.textContent = d; c.desc = (s) => (dd.textContent = s);
    if (btn) { const b = document.createElement("button"); b.className = "act"; b.textContent = btn; Object.assign(b.style, { left: w - 150 + "px", top: "26px" }); c.appendChild(b); c.btn = b; }
    else { const s = document.createElement("span"); s.className = "sw"; s.innerHTML = "<i></i>"; Object.assign(s.style, { left: w - 80 + "px", top: "30px" }); c.appendChild(s);
      c.setOn = (v) => { c.on = v; c.classList.toggle("on", v); }; s.onclick = () => c.setOn(!c.on); c.setOn(false); }
    return c;
  };
  const cards = TW.map(([t, d], i) => card(t, d, (i % 2) * 452, Math.trunc(i / 2) * 100, 444));
  const rows = TW.length / 2;
  const cleanCard = card("Clean temp files", "Deletes files older than a day from your own Temp folder. Files in use are skipped.", 0, rows * 100, 896, "Clean");
  const binCard = card("Empty recycle bin", "Permanently deletes everything in your Recycle Bin.", 0, rows * 100 + 100, 896, "Empty");
  const dnsCard = card("Flush DNS cache", "Clears saved network addresses. Can fix odd connection problems.", 0, rows * 100 + 200, 896, "Flush");
  cleanCard.btn.onclick = () => { cleanCard.desc("Cleaning, one moment..."); setTimeout(() => cleanCard.desc("Removed 214 files (381 MB). Files in use were skipped. (Demo: nothing was deleted.)"), 900); };
  binCard.btn.onclick = () => binCard.desc("Done! Your Recycle Bin is empty. (Demo: nothing was deleted.)");
  dnsCard.btn.onclick = () => dnsCard.desc("Done! The DNS cache was cleared. (Demo)");

  // crosshair
  const xhPanel = bigPanel();
  const [xhd] = header(xhPanel, "Crosshair", "Make your own crosshair and show it on top of your game. Works in windowed and borderless mode.");
  let xhOn = false; const newXh = () => ({ style: 0, col: [0, 255, 120], size: 12, thick: 2, gap: 4, opac: 100, outline: true, offX: 0, offY: 0 });
  let xh = newXh();
  const xhT = toggle(xhd, "Crosshair: on", "Crosshair: off", 700, 30, 190, 40, false, (v) => { xhOn = v; xhApply(); });
  const pc = rpanel(xhPanel, 0, 112, 440, 404);
  const xprev = box(pc, "xhprev", 12, 12, 416, 380, "canvas"); xprev.width = 416; xprev.height = 380;
  const cc = rpanel(xhPanel, 452, 112, 464, 404);
  label(cc, "Style", 18, 12, 200, 20, MUTE, 9.5);
  const xStyle = ["Cross", "Dot", "Circle", "Cross + dot"].map((n, i) => rbtn(cc, n, 18 + i * 106, 36, 100, 32, 2, () => { xh.style = i; xhChanged(); }));
  label(cc, "Colour", 18, 80, 200, 20, MUTE, 9.5);
  const cols = [[0, 255, 120], [255, 255, 255], [255, 60, 60], [255, 230, 0], [0, 230, 255], [255, 80, 200], [255, 150, 30], [80, 120, 255]];
  const xsw = cols.map((c, i) => { const w2 = box(cc, "swt", 18 + i * 36, 104, 28, 28); w2.innerHTML = `<i style="background:${css(c)}"></i>`; w2.onclick = () => { xh.col = c.slice(); xhChanged(); }; return w2; });
  rbtn(cc, "Custom", 310, 102, 110, 32, 2, () => pickCustom(3));
  const xln = ["Size", "Thickness", "Gap", "Opacity", "Offset X", "Offset Y"], xk = ["size", "thick", "gap", "opac", "offX", "offY"];
  const xlo = [2, 1, 0, 20, -100, -100], xhi = [60, 8, 20, 100, 100, 100], xVal = [], xs = [];
  let xLoad = false;
  xln.forEach((n, i) => {
    label(cc, n, 18, 148 + i * 36, 90, 24, "#fff", 10);
    xs[i] = slider(cc, 104, 146 + i * 36, 260, xlo[i], xhi[i], xh[xk[i]], (v) => { if (xLoad) return; xh[xk[i]] = v; xhChanged(); });
    xVal[i] = label(cc, "", 372, 148 + i * 36, 70, 24, ACC, 10, true, "right");
  });
  const xOut = mksw(cc, "Black outline", 18, 364, true, (v) => { xh.outline = v; xhChanged(); });
  rbtn(cc, "Reset", 350, 366, 96, 34, 2, () => { xh = newXh(); xhSync(); xhChanged(); });
  const sc = rpanel(xhPanel, 0, 528, 916, 180);
  label(sc, "Saved crosshairs", 18, 12, 300, 26, "#fff", 12, true);
  const xName = textbox(sc, 18, 46, 180, 20);
  const xNames = [], xSaved = {};
  pill(sc, "Save crosshair", 206, 42, 134, 34, () => { let n = xName.value.trim().replace(/\|/g, ""); if (!n) n = "Crosshair " + (xNames.length + 1); if (!xSaved[n]) xNames.push(n); xSaved[n] = { ...xh, col: xh.col.slice() }; xName.value = ""; rebuildXList(); });
  const xCode = textbox(sc, 352, 46, 250);
  const xHint = label(sc, "Click a crosshair to use it. Right-click one of yours to delete it.", 18, 152, 880, 22, MUTE, 8.5);
  rbtn(sc, "Copy code", 612, 42, 120, 34, 2, async () => { const cd = xhCode(xh); xCode.value = cd; try { await navigator.clipboard.writeText(cd); xHint.textContent = "Code copied. Send it to a friend and they can import it."; } catch (e) { xHint.textContent = "Copy the code from the box."; } });
  rbtn(sc, "Import code", 740, 42, 120, 34, 2, async () => { let t = xCode.value.trim(); if (!t) { try { t = await navigator.clipboard.readText(); } catch (e) { t = ""; } } const nx = xhFromCode(t); if (!nx) return (xHint.textContent = "That code does not look right."); xh = nx; xhSync(); xhChanged(); xHint.textContent = "Crosshair imported."; });
  const xList = flow(sc, 18, 86, 880, 62);
  const xDel = rbtn(sc, "Delete", 0, 0, 90, 30, "red", () => { const n = xDel.dataset.n; xDel.style.display = "none"; if (n) { xNames.splice(xNames.indexOf(n), 1); delete xSaved[n]; rebuildXList(); } });
  xDel.style.display = "none"; xDel.style.zIndex = 5; xDel.addEventListener("mouseleave", () => (xDel.style.display = "none"));
  const MkX = (style, col, size, thick, gap, opac, outline) => ({ style, col, size, thick, gap, opac, outline, offX: 0, offY: 0 });
  const xBN = ["Classic", "Tiny dot", "Red dot", "Ring", "Thin cross", "Big cross", "Pro gap", "Cross + dot", "Sniper", "Soft ring"];
  const xBuilt = [MkX(0, [0, 255, 120], 12, 2, 4, 100, true), MkX(1, [255, 255, 255], 4, 2, 0, 100, true), MkX(1, [255, 60, 60], 4, 3, 0, 100, true), MkX(2, [0, 230, 255], 10, 2, 0, 100, true), MkX(0, [255, 255, 255], 8, 1, 3, 100, false), MkX(0, [255, 230, 0], 20, 3, 6, 100, true), MkX(0, [0, 230, 255], 7, 2, 8, 100, true), MkX(3, [255, 80, 200], 10, 2, 5, 100, true), MkX(0, [255, 60, 60], 40, 1, 0, 100, false), MkX(2, [255, 255, 255], 14, 1, 0, 70, false)];
  const toArgb = (c) => ((255 << 24) | (c[0] << 16) | (c[1] << 8) | c[2]) | 0;
  const fromArgb = (n) => [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const xhCode = (x) => "PRISMA-XH1-" + btoa([x.style, toArgb(x.col), x.size, x.thick, x.gap, x.opac, x.outline ? 1 : 0, x.offX, x.offY].join(","));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function xhFromCode(code) {
    try {
      code = code.trim(); if (!code.startsWith("PRISMA-XH1-")) return null;
      const p = atob(code.slice(11)).split(",").map((s) => parseInt(s, 10)); if (p.length < 9 || p.some(isNaN)) return null;
      return { style: clamp(p[0], 0, 3), col: fromArgb(p[1]), size: clamp(p[2], 2, 60), thick: clamp(p[3], 1, 8), gap: clamp(p[4], 0, 20), opac: clamp(p[5], 20, 100), outline: p[6] === 1, offX: clamp(p[7], -100, 100), offY: clamp(p[8], -100, 100) };
    } catch (e) { return null; }
  }
  function xhParse(p, o, ofs) { const n = (i) => parseInt(p[o + i], 10); return { style: n(0), col: fromArgb(n(1)), size: n(2), thick: n(3), gap: n(4), opac: n(5), outline: (p[o + 6] || "").trim() === "1", offX: ofs ? n(7) : 0, offY: ofs ? n(8) : 0 }; }
  function xhDraw(g, cx, cy, p) {
    const t = Math.max(1, p.thick), x0 = cx - Math.trunc(t / 2), y0 = cy - Math.trunc(t / 2), col = css(p.col);
    const circ = (x, y, d, fill, lw) => { g.beginPath(); g.ellipse(x + d / 2, y + d / 2, d / 2, d / 2, 0, 0, 7); if (fill) g.fill(); else { g.lineWidth = lw; g.stroke(); } };
    if (p.style === 0 || p.style === 3) {
      const r = [[x0 - p.gap - p.size, y0, p.size, t], [x0 + t + p.gap, y0, p.size, t], [x0, y0 - p.gap - p.size, t, p.size], [x0, y0 + t + p.gap, t, p.size]];
      if (p.outline) { g.fillStyle = "#000"; r.forEach((q) => g.fillRect(q[0] - 1, q[1] - 1, q[2] + 2, q[3] + 2)); }
      g.fillStyle = col; r.forEach((q) => g.fillRect(...q));
    }
    if (p.style === 1 || p.style === 3) {
      const d = t % 2 === 0 ? t * 2 : t * 2 + 1, dx = x0 + Math.trunc((t - d) / 2), dy = y0 + Math.trunc((t - d) / 2);
      if (p.outline) { g.fillStyle = "#000"; circ(dx - 1, dy - 1, d + 2, true); }
      g.fillStyle = col; circ(dx, dy, d, true);
    }
    if (p.style === 2) {
      const dd = Math.max(4, p.size * 2) + (t % 2), ex = x0 + Math.trunc((t - dd) / 2), ey = y0 + Math.trunc((t - dd) / 2);
      if (p.outline) { g.strokeStyle = "#000"; circ(ex, ey, dd, false, t + 2); }
      g.strokeStyle = col; circ(ex, ey, dd, false, t);
    }
  }
  xprevDraw = () => {
    const g = xprev.getContext("2d"), w = 416, h = 380, gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "rgb(40,48,62)"); gr.addColorStop(1, "rgb(14,16,22)"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(255,255,255,.1)"; g.lineWidth = 1; g.beginPath();
    for (let x = (w / 2) % 40; x < w; x += 40) { g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, h); }
    for (let y = (h / 2) % 40; y < h; y += 40) { g.moveTo(0, y + 0.5); g.lineTo(w, y + 0.5); }
    g.stroke(); xhDraw(g, w / 2 + xh.offX, h / 2 + xh.offY, xh);
    g.fillStyle = "rgba(255,255,255,.59)"; g.font = '11.33px "Segoe UI", "Open Sans", system-ui, sans-serif'; g.textBaseline = "top"; g.fillText("Preview", 14, 10);
    xprev.style.borderRadius = Math.min(rad, 22) + "px";
  };
  const xov = document.createElement("canvas"); xov.className = "prisma-xh"; xov.width = 480; xov.height = 480; xov.style.display = "none"; document.body.appendChild(xov);
  function xhApply() { xov.style.display = xhOn ? "" : "none"; if (!xhOn) return; const g = xov.getContext("2d"); g.clearRect(0, 0, 480, 480); xhDraw(g, 240 + xh.offX, 240 + xh.offY, xh); xov.style.opacity = xh.opac / 100; }
  function xhLabels() {
    xVal[0].textContent = xh.size + " px"; xVal[1].textContent = xh.thick + " px"; xVal[2].textContent = xh.gap + " px"; xVal[3].textContent = xh.opac + "%"; xVal[4].textContent = xh.offX + " px"; xVal[5].textContent = xh.offY + " px";
    xStyle.forEach((b, i) => b.classList.toggle("sel", xh.style === i));
    xsw.forEach((w2, i) => w2.classList.toggle("sel", toArgb(cols[i]) === toArgb(xh.col)));
  }
  function xhSync() { xLoad = true; xk.forEach((k, i) => xs[i].set(xh[k], true)); xOut.set(xh.outline); xLoad = false; xhLabels(); }
  function xhChanged() { xhLabels(); xprevDraw(); xhApply(); }
  function rebuildXList() {
    xList.innerHTML = "";
    xBuilt.forEach((bx, i) => flowBtn(xList, xBN[i], false, () => { xh = { ...bx, col: bx.col.slice() }; xhSync(); xhChanged(); }));
    xNames.forEach((n) => { const b = flowBtn(xList, n, false, () => { xh = { ...xSaved[n], col: xSaved[n].col.slice() }; xhSync(); xhChanged(); }); b.oncontextmenu = (e) => { e.preventDefault(); popAt(xDel, sc, e, n); }; });
  }
  function popAt(btn, parent, e, n) {
    const r = parent.getBoundingClientRect(), s = r.width / parent.offsetWidth;
    btn.dataset.n = n; btn.style.left = Math.max(0, (e.clientX - r.left) / s - 14) + "px"; btn.style.top = Math.max(0, (e.clientY - r.top) / s - 12) + "px"; btn.style.display = "";
  }

  // overlay
  const ovPanel = bigPanel();
  const [ovhd] = header(ovPanel, "Overlay", "Shows your CPU, GPU and memory use on top of your game. Works in windowed and borderless mode.");
  let ovOn = false, ovCorner = 1, ovSize = 11, ovOp = 85; const ovShow = { cpu: true, gpu: true, ram: true, temp: true, vram: false, fps: true };
  toggle(ovhd, "Overlay: on", "Overlay: off", 700, 30, 190, 40, false, (v) => { ovOn = v; ovTick(); });
  const bd = rpanel(ovPanel, 0, 112, 916, 400);
  label(bd, "Position", 18, 12, 200, 20, MUTE, 9.5);
  const ovCb = ["Top left", "Top right", "Bottom left", "Bottom right"].map((n, i) => rbtn(bd, n, 18 + i * 126, 36, 120, 32, 2, () => { ovCorner = i; ovCb.forEach((b, k) => b.classList.toggle("sel", k === i)); ovTick(); }));
  ovCb[1].classList.add("sel");
  label(bd, "Show", 18, 80, 200, 20, MUTE, 9.5);
  [["CPU use", 18, 104, "cpu"], ["GPU use", 340, 104, "gpu"], ["Memory (RAM)", 18, 150, "ram"], ["GPU temperature", 340, 150, "temp"], ["FPS (needs PresentMon)", 340, 196, "fps"], ["Video memory", 18, 196, "vram"]]
    .forEach(([n, x, y, k]) => mksw(bd, n, x, y, ovShow[k], (v) => { ovShow[k] = v; ovTick(); }));
  label(bd, "Text size", 18, 254, 90, 24, "#fff", 10);
  const v1 = label(bd, "11 pt", 430, 254, 70, 24, ACC, 10, true);
  slider(bd, 120, 252, 300, 9, 24, 11, (v) => { ovSize = v; v1.textContent = v + " pt"; ovTick(); });
  label(bd, "Opacity", 18, 292, 90, 24, "#fff", 10);
  const v2 = label(bd, "85%", 430, 292, 70, 24, ACC, 10, true);
  slider(bd, 120, 290, 300, 30, 100, 85, (v) => { ovOp = v; v2.textContent = v + "%"; ovTick(); });
  label(bd, "GPU numbers need an NVIDIA driver. FPS needs the free PresentMon.exe (from the PresentMon project on GitHub) placed next to Prisma.exe, and Prisma started as administrator.", 18, 340, 860, 40, MUTE, 9);
  const so = document.createElement("div"); so.className = "prisma-stats"; so.style.display = "none"; document.body.appendChild(so);
  let fps = 0, frames = 0, last = performance.now();
  (function loop(t) { frames++; if (t - last >= 1000) { fps = Math.round((frames * 1000) / (t - last)); frames = 0; last = t; } requestAnimationFrame(loop); })(last);
  const sim = { cpu: 9, gpu: 6, ram: 41, temp: 44, vram: 1.6 };
  function ovTick() {
    if (!ovOn) { so.style.display = "none"; return; }
    const busy = !!gmActive, w = (k, lo, hi, f) => (sim[k] += (lo + Math.random() * (hi - lo) - sim[k]) * (f || 0.3));
    w("cpu", busy ? 38 : 4, busy ? 66 : 15); w("gpu", busy ? 86 : 2, busy ? 99 : 12); w("ram", busy ? 58 : 40, busy ? 62 : 43, 0.2); w("temp", busy ? 66 : 41, busy ? 75 : 47, 0.12); w("vram", busy ? 6.2 : 1.4, busy ? 6.9 : 1.8, 0.2);
    const r = [];
    if (ovShow.fps) r.push(["FPS", fps > 1 ? fps + "" : "-"]);
    if (ovShow.cpu) r.push(["CPU", Math.round(sim.cpu) + "%"]);
    if (ovShow.gpu) r.push(["GPU", Math.round(sim.gpu) + "%"]);
    if (ovShow.temp) r.push(["GPU temp", Math.round(sim.temp) + " °C"]);
    if (ovShow.vram) r.push(["VRAM", sim.vram.toFixed(1) + " / 8.0 GB"]);
    if (ovShow.ram) r.push(["RAM", Math.round(sim.ram) + "%"]);
    if (!r.length) r.push(["Nothing selected", ""]);
    so.innerHTML = r.map(([a, b]) => `<span>${a}</span><b>${b}</b>`).join("");
    Object.assign(so.style, { display: "grid", fontSize: pt(ovSize), opacity: ovOp / 100, left: ovCorner & 1 ? "auto" : "14px", right: ovCorner & 1 ? "14px" : "auto", top: ovCorner < 2 ? "14px" : "auto", bottom: ovCorner < 2 ? "auto" : "14px" });
  }
  setInterval(ovTick, 1000);

  // games
  const gmPanel = bigPanel();
  const [ghd] = header(gmPanel, "Game profiles", "Choose a game and a look. Prisma switches to it when the game starts and puts your colours back when it closes.");
  let gmOn = true, gmSel = null, gmXh = "None", gmActive = null, gmSnap = null; const games = [];
  toggle(ghd, "Auto-apply: on", "Auto-apply: off", 700, 30, 190, 40, true, (v) => { gmOn = v; if (!v && gmActive) gameStop(); });
  const ad = rpanel(gmPanel, 0, 112, 916, 170);
  label(ad, "Game program (for example RainbowSix.exe)", 18, 12, 400, 20, MUTE, 9.5);
  const gmBox = textbox(ad, 18, 40, 250);
  const exeIn = document.createElement("input"); exeIn.type = "file"; exeIn.accept = ".exe"; exeIn.hidden = true; root.appendChild(exeIn);
  exeIn.onchange = () => { if (exeIn.files[0]) gmBox.value = exeIn.files[0].name; exeIn.value = ""; };
  rbtn(ad, "Find game...", 280, 36, 130, 34, 2, () => exeIn.click());
  label(ad, "Look to use", 430, 12, 300, 20, MUTE, 9.5);
  const gmPick = flow(ad, 430, 38, 470, 84);
  const gmXhBtn = rbtn(ad, "Crosshair: None", 180, 88, 230, 34, 2, () => { const o = ["None", ...xBN, ...xNames]; gmXh = o[(o.indexOf(gmXh) + 1) % o.length]; gmXhBtn.textContent = "Crosshair: " + gmXh; });
  pill(ad, "Add game", 18, 88, 150, 34, () => {
    let n = gmBox.value.trim().split(/[\\/]/).pop();
    if (!n) return (gmStatus.textContent = "Type the game's program name first.");
    if (!gmSel || !pvals[gmSel]) return (gmStatus.textContent = "Click a look on the right first.");
    if (!n.includes(".")) n += ".exe";
    for (let i = games.length - 1; i >= 0; i--) if (games[i][0].toLowerCase() === n.toLowerCase()) games.splice(i, 1);
    games.push([n, gmSel, gmXh, "demo"]); gmBox.value = ""; refreshGames(); gmStatus.textContent = "Added " + n + ".";
  });
  const gmStatus = label(ad, "Waiting for one of your games to start...", 18, 134, 860, 24, MUTE, 9.5);
  const lp = rpanel(gmPanel, 0, 294, 916, 414);
  label(lp, "Your games", 18, 12, 300, 26, "#fff", 12, true);
  const gmList = box(lp, "scroll", 18, 50, 880, 350);
  const foundP = rpanel(gmPanel, 0, 294, 916, 414); foundP.style.display = "none";
  const foundT = label(foundP, "", 18, 12, 700, 26, "#fff", 12, true);
  label(foundP, "Click a game to fill it in above. Then pick a look and press Add game.", 18, 42, 700, 22, MUTE, 9);
  rbtn(foundP, "Close", 796, 10, 100, 34, 2, () => (foundP.style.display = "none"));
  const foundL = flow(foundP, 14, 72, 888, 330);
  pill(lp, "Find my games", 716, 10, 180, 34, () => {
    foundL.innerHTML = ""; foundT.textContent = "Looking for your games..."; foundP.style.display = "";
    setTimeout(() => {
      const g = [["Neon Drift", "NeonDrift.exe"], ["Frontline Ops", "FrontlineOps.exe"], ["Skyreach", "Skyreach.exe"], ["Hollow Depths", "HollowDepths.exe"], ["Turbo Karts", "TurboKarts.exe"]];
      foundT.textContent = "Found " + g.length + " games (demo examples)";
      g.forEach(([n, exe]) => flowBtn(foundL, n, false, () => { gmBox.value = exe; foundP.style.display = "none"; gmStatus.textContent = n + " picked. Now click a look and press Add game."; }));
    }, 700);
  }, "\u2315");
  function refreshGames() {
    gmPick.innerHTML = "";
    if (!pnames.length) { const e = document.createElement("div"); e.className = "lbl"; e.style.color = "var(--mute)"; e.textContent = "No looks yet. Save one on the Presets tab first."; gmPick.appendChild(e); }
    pnames.forEach((n) => flowBtn(gmPick, n, gmSel === n, () => { gmSel = n; [...gmPick.children].forEach((c) => c.classList.toggle("sel", c.textContent === n)); }));
    gmList.innerHTML = "";
    if (!games.length) label(gmList, "No games yet. Add one above.", 0, 4, 600, 24, MUTE, 10);
    games.forEach((g, i) => {
      const miss = !pvals[g[1]], running = gmActive === g;
      label(gmList, g[0] + "   ›   " + g[1] + (g[2] !== "None" ? "   +   " + g[2] : "") + (miss ? "  (look not found)" : ""), 0, i * 46 + 8, 620, 26, miss ? MUTE : "#fff", 10.5);
      rbtn(gmList, running ? "Quit" : "Play", 630, i * 46 + 4, 100, 32, 2, () => { if (running) return gameStop(); if (gmActive) gameStop(); gmStatus.textContent = "Starting " + g[0] + "..."; setTimeout(() => gmOn && gameStart(g), 600); });
      rbtn(gmList, "Remove", 740, i * 46 + 4, 100, 32, 2, () => { if (gmActive === g) gameStop(); games.splice(games.indexOf(g), 1); refreshGames(); });
    });
  }
  const findXh = (n) => { const i = xBN.indexOf(n); return i >= 0 ? xBuilt[i] : xSaved[n] || null; };
  function gameStart(g) {
    const v = pvals[g[1]]; if (!v) return;
    gmActive = g; gmSnap = { s: [S.sat, S.bri, S.con, S.gam], screen: screenOn, filter: filterOn, xh: null };
    setVals(v); screenOn = true; screenT.set(true); filterOn = true; filterT.set(true);
    const gx = findXh(g[2]);
    if (gx) { gmSnap.xh = { x: xh, on: xhOn }; xh = { ...gx, col: gx.col.slice() }; xhOn = true; xhT.set(true); xhSync(); xhChanged(); }
    applyScreen(); updateStatus(); snd(3);
    gmStatus.textContent = "Playing " + g[0] + ". Your look \"" + g[1] + "\" is on.";
    refreshGames();
  }
  function gameStop() {
    const s = gmSnap; gmActive = null; if (!s) return;
    setVals(s.s);
    if (s.xh) { xh = s.xh.x; xhOn = s.xh.on; xhT.set(xhOn); xhSync(); xhChanged(); }
    screenOn = s.screen; screenT.set(screenOn); filterOn = s.filter; filterT.set(filterOn);
    applyScreen(); updateStatus(); snd(3);
    gmStatus.textContent = "Waiting for one of your games to start...";
    refreshGames();
  }

  // colour picker
  const picker = rpanel(root, (W - 360) / 2, 230, 360, 280); picker.style.display = "none"; picker.style.zIndex = 12;
  label(picker, "Pick a colour", 18, 14, 300, 26, "#fff", 12, true);
  const swatch = box(picker, "", 18, 50, 324, 40);
  let pkWhich = 0;
  const pk = ["Hue", "Saturation", "Brightness"].map((n, i) => { label(picker, n, 18, 104 + i * 40, 90, 24, MUTE, 9.5); return slider(picker, 112, 102 + i * 40, 230, 0, i === 0 ? 360 : 100, 0, () => pkChanged()); });
  const hsv = (h, s, v) => { s /= 100; v /= 100; const c = v * s, hh = (h % 360) / 60, x = c * (1 - Math.abs((hh % 2) - 1)), m = v - c; const q = [[c, x, 0], [x, c, 0], [0, c, x], [0, x, c], [x, 0, c], [c, 0, x]][Math.min(5, Math.trunc(hh))]; return q.map((z) => Math.round((z + m) * 255)); };
  const toHsv = (c) => { const [r, g, b] = c.map((q) => q / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d > 0) h = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4); if (h < 0) h += 360; return [h, mx === 0 ? 0 : (d / mx) * 100, mx * 100]; };
  const pkColor = () => hsv(pk[0].get(), pk[1].get(), pk[2].get());
  const pkChanged = () => (swatch.style.background = css(pkColor()));
  rbtn(picker, "Cancel", 18, 232, 110, 34, 2, () => (picker.style.display = "none"));
  pill(picker, "Done", 232, 232, 110, 34, () => {
    const c = pkColor(); picker.style.display = "none";
    if (pkWhich === 3) { xh.col = c; xhChanged(); return; }
    const t = THEMES[6]; if (pkWhich === 0) t.acc = c; else if (pkWhich === 1) t.bg = c; else t.fill = c;
    derive(t); setTheme(6);
  });
  function pickCustom(which) {
    pkWhich = which; const t = THEMES[6];
    const [h, s, v] = toHsv(which === 3 ? xh.col : which === 0 ? t.acc : which === 1 ? t.bg : t.fill);
    pk[0].set(h, true); pk[1].set(s, true); pk[2].set(v, true); pkChanged(); picker.style.display = "";
  }
  function setTheme(i) { L = THEMES[i]; themeIdx = i; applyTheme(); }

  // preview
  const shots = []; let shot = 0, split = 0.5, rect = null, srcData = null, srcCanvas = null, afterCanvas = null;
  const lutFor = (bri, con, gam) => { const lut = new Uint8ClampedArray(256), c = con / 100, g = gam / 100, bb = bri / 400; for (let i = 0; i < 256; i++) { let v = Math.max(0, Math.min(1, (i / 255 - 0.5) * c + 0.5 + bb)); lut[i] = Math.round(Math.pow(v, 1 / g) * 255); } return lut; };
  function updatePreview() {
    if (!srcData) return drawPreview();
    const sf = filterOn ? Math.min(2.5, S.sat / S.def) : 1, lut = filterOn ? lutFor(S.bri, S.con, S.gam) : lutFor(0, 100, 100);
    const p = srcData.data, o = new ImageData(srcData.width, srcData.height), d = o.data, c = (v) => (v < 0 ? 0 : v > 255 ? 255 : v) | 0;
    for (let i = 0; i < p.length; i += 4) {
      const rd = p[i], gr = p[i + 1], bl = p[i + 2], l = 0.299 * rd + 0.587 * gr + 0.114 * bl;
      d[i] = lut[c(l + (rd - l) * sf)]; d[i + 1] = lut[c(l + (gr - l) * sf)]; d[i + 2] = lut[c(l + (bl - l) * sf)]; d[i + 3] = 255;
    }
    afterCanvas.getContext("2d").putImageData(o, 0, 0);
    drawPreview();
  }
  function drawPreview() {
    const g = prevC.getContext("2d"), cw = prevC.width, ch = prevC.height;
    g.fillStyle = css(L.fill); g.fillRect(0, 0, cw, ch);
    if (!srcCanvas) { g.fillStyle = "gray"; g.font = '14.67px "Segoe UI", "Open Sans", system-ui, sans-serif'; g.textBaseline = "top"; g.fillText("Load a screenshot to preview your colours", 20, 20); return; }
    g.drawImage(afterCanvas, rect.x, rect.y);
    const sx = rect.x + Math.trunc(rect.w * split);
    g.save(); g.beginPath(); g.rect(rect.x, rect.y, Math.max(0, sx - rect.x), rect.h); g.clip(); g.drawImage(srcCanvas, rect.x, rect.y); g.restore();
    g.fillStyle = "rgba(10,6,18,.667)"; g.fillRect(rect.x + 10, rect.y + 10, 64, 20); g.fillRect(rect.x + rect.w - 70, rect.y + 10, 60, 20);
    g.fillStyle = "#fff"; g.font = 'bold 10.67px "Segoe UI", "Open Sans", system-ui, sans-serif'; g.textBaseline = "top";
    g.fillText("BEFORE", rect.x + 16, rect.y + 14); g.fillText("AFTER", rect.x + rect.w - 62, rect.y + 14);
    g.strokeStyle = "#fff"; g.lineWidth = 2; g.beginPath(); g.moveTo(sx, rect.y); g.lineTo(sx, rect.y + rect.h); g.stroke();
    const cy = rect.y + rect.h / 2;
    g.fillStyle = css(L.acc2); g.beginPath(); g.arc(sx, cy, 17, 0, 7); g.fill(); g.stroke();
    g.fillStyle = "#fff"; g.font = 'bold 14.67px "Segoe UI Symbol", "Segoe UI", sans-serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("⟷", sx, cy + 1); g.textAlign = "left";
  }
  function setImage(img) {
    const cw = prevC.width, ch = prevC.height, sc2 = Math.min(cw / img.width, ch / img.height), w = Math.max(1, Math.trunc(img.width * sc2)), h = Math.max(1, Math.trunc(img.height * sc2));
    rect = { x: Math.trunc((cw - w) / 2), y: Math.trunc((ch - h) / 2), w, h };
    srcCanvas = document.createElement("canvas"); srcCanvas.width = w; srcCanvas.height = h;
    const g = srcCanvas.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, 0, 0, w, h);
    srcData = g.getImageData(0, 0, w, h);
    afterCanvas = document.createElement("canvas"); afterCanvas.width = w; afterCanvas.height = h;
    updatePreview();
  }
  const prevFromX = (cx) => { if (!rect) return; const r = prevC.getBoundingClientRect(), s = r.width / prevC.width; split = Math.max(0, Math.min(1, ((cx - r.left) / s - rect.x) / rect.w)); drawPreview(); };
  prevC.addEventListener("pointerdown", (e) => { prevC.setPointerCapture(e.pointerId); prevC._d = 1; prevFromX(e.clientX); });
  prevC.addEventListener("pointermove", (e) => prevC._d && prevFromX(e.clientX));
  prevC.addEventListener("pointerup", () => (prevC._d = 0));
  let stripOff = 0;
  function drawStrip() {
    const g = strip.getContext("2d"); g.fillStyle = css(L.fill); g.fillRect(0, 0, strip.width, strip.height);
    shots.forEach((s, i) => {
      const x = 8 + i * 88 - stripOff;
      g.save(); g.beginPath(); g.roundRect(x, 6, 80, 45, 8); g.clip(); g.drawImage(s.thumb, x, 6, 80, 45); g.restore();
      g.beginPath(); g.roundRect(x, 6, 80, 45, 8); g.lineWidth = i === shot ? 2.5 : 1; g.strokeStyle = css(i === shot ? L.acc : L.line); g.stroke();
    });
  }
  strip.addEventListener("click", (e) => { const r = strip.getBoundingClientRect(), ex = (e.clientX - r.left) / (r.width / strip.width) + stripOff; if (ex < 8) return; const i = Math.trunc((ex - 8) / 88); if (i < shots.length && (ex - 8) % 88 <= 80) selectShot(i); });
  strip.addEventListener("wheel", (e) => { const mx = Math.max(0, shots.length * 88 + 8 - strip.width); stripOff = Math.max(0, Math.min(mx, stripOff + (e.deltaY > 0 ? 88 : -88))); drawStrip(); e.preventDefault(); }, { passive: false });
  function addShot(img, select) { const t = document.createElement("canvas"); t.width = 80; t.height = 45; t.getContext("2d").drawImage(img, 0, 0, 80, 45); shots.push({ img, thumb: t }); if (select) selectShot(shots.length - 1); else drawStrip(); }
  function selectShot(i) { if (i < 0 || i >= shots.length) return; shot = i; delBtn.style.display = i > 0 ? "" : "none"; setImage(shots[i].img); drawStrip(); }
  function deleteShot(i) { if (i <= 0 || i >= shots.length) return; shots.splice(i, 1); if (shot >= i) shot--; selectShot(shot); }
  fileIn.onchange = () => { [...fileIn.files].forEach((f) => { const im = new Image(); im.onload = () => addShot(im, true); im.onerror = () => (msg.textContent = "Could not open that picture: " + f.name); im.src = URL.createObjectURL(f); }); fileIn.value = ""; };
  const sample = new Image(); sample.onload = () => { addShot(sample, false); selectShot(0); }; sample.src = "assets/sample.svg";

  // whole screen = filter over the whole web page (like the gamma ramp)
  const fsvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  fsvg.setAttribute("width", "0"); fsvg.setAttribute("height", "0"); fsvg.style.position = "absolute";
  fsvg.innerHTML = '<filter id="prismaScreen" color-interpolation-filters="sRGB"><feColorMatrix id="pfm" type="matrix"/><feComponentTransfer><feFuncR id="pfr" type="table"/><feFuncG id="pfg" type="table"/><feFuncB id="pfb" type="table"/></feComponentTransfer></filter>';
  document.body.appendChild(fsvg);
  function applyScreen() {
    if (!(screenOn && filterOn)) { document.documentElement.style.filter = ""; return; }
    const s = Math.min(2.5, S.sat / S.def), a = 1 - s, lr = 0.299 * a, lg = 0.587 * a, lb = 0.114 * a;
    document.getElementById("pfm").setAttribute("values", `${lr + s} ${lg} ${lb} 0 0 ${lr} ${lg + s} ${lb} 0 0 ${lr} ${lg} ${lb + s} 0 0 0 0 0 1 0`);
    const t = Array.from(lutFor(S.bri, S.con, S.gam), (v) => (v / 255).toFixed(4)).join(" ");
    ["pfr", "pfg", "pfb"].forEach((id) => document.getElementById(id).setAttribute("tableValues", t));
    document.documentElement.style.filter = "url(#prismaScreen)";
  }
  function updateStatus() {
    status.textContent = screenOn && filterOn ? "Whole screen is ON. Your changes apply to every monitor and to your games."
      : screenOn ? "Whole screen is ON, but the filter is off, so your screen shows normal colours." : "Whole screen is OFF. The sliders only change the picture above.";
  }
  function setVals(v) { [S.sat, S.bri, S.con, S.gam] = v; bars.forEach((b, k) => { b.set(S[keys[k]], true); vals[k].textContent = fmt(k, S[keys[k]]); }); updatePreview(); applyScreen(); }
  function resetDisplay() { setVals([S.def, 0, 100, 100]); }
  function savePreset() { let n = pname.value.trim().replace(/\|/g, ""); if (!n) n = "Look " + (pnames.length + 1); if (!pvals[n]) pnames.push(n); pvals[n] = [S.sat, S.bri, S.con, S.gam]; pname.value = ""; rebuildPresets(); refreshGames(); }
  function rebuildPresets() {
    plist.innerHTML = "";
    if (!pnames.length) { const e = document.createElement("div"); e.className = "lbl"; e.style.color = "var(--mute)"; e.textContent = "No saved looks yet"; plist.appendChild(e); return; }
    pnames.forEach((n) => { const b = flowBtn(plist, n, false, () => setVals(pvals[n])); b.oncontextmenu = (e) => { e.preventDefault(); popAt(delPop, pr, e, n); }; });
  }

  // navigation
  const OV = [6, 7, 9, 10];
  function onNav(i) {
    if (OV.includes(i)) { page = i; panelOpen = true; showOverlay(i); updateNav(); return; }
    showOverlay(-1);
    if (panelOpen && page === i) { panelOpen = false; ctrl.style.display = "none"; }
    else { panelOpen = true; ctrl.style.display = ""; showPage(i); }
    updateNav();
  }
  function showOverlay(w) {
    const ov = OV.includes(w);
    optPanel.style.display = w === 6 ? "" : "none"; xhPanel.style.display = w === 7 ? "" : "none";
    ovPanel.style.display = w === 9 ? "" : "none"; gmPanel.style.display = w === 10 ? "" : "none";
    if (w === 10) refreshGames();
    pp.style.display = ov ? "none" : ""; ctrl.style.display = !ov && panelOpen ? "" : "none";
  }
  function showPage(i) {
    page = i; pages.forEach((p, k) => (p.style.display = k === i ? "" : "none"));
    title.textContent = pageNames[i];
    [d1, allBtn, addBtn, loadBtn].forEach((b) => (b.style.display = i === 0 ? "" : "none"));
    setLay(i !== 0);
    if (i === 4) aboutLayout();
    if (animOn) { const p = pages[i]; p.classList.add("slide"); void p.offsetWidth; p.classList.remove("slide"); }
  }
  const updateNav = () => nav.forEach((b, i) => b.classList.toggle("on", panelOpen && page === i));
  let layBig = null;
  function setLay(big) {
    if (layBig === big) return; layBig = big; const d = big ? 70 : 0;
    pp.style.height = 470 - d + "px"; prevC.style.height = 384 - d + "px"; prevC.height = 384 - d;
    strip.style.top = 402 - d + "px"; loadBtn.style.top = 414 - d + "px"; delBtn.style.top = 414 - d + "px"; hint.style.top = 404 - d + "px";
    ctrl.style.top = 548 - d + "px"; ctrl.style.height = 226 + d + "px"; pages.forEach((p) => (p.style.height = 148 + d + "px"));
    if (shots[shot]) setImage(shots[shot].img); else drawPreview();
  }

  // splash + warp
  const splash = box(root, "splash", 0, 0, 1178, 788);
  const slogo = box(splash, "", (W - 150) / 2, 190, 150, 150); slogo.innerHTML = logoSvg(150);
  label(splash, "P R I S M A", 0, 352, W, 56, "#fff", 28, true, "center").style.lineHeight = "56px";
  label(splash, "Your game toolkit", 0, 410, W, 26, MUTE, 11, false, "center").style.lineHeight = "26px";
  const endSplash = () => { splash.style.display = "none"; if (!tourDone) startTour(); };
  pill(splash, "Start", (W - 190) / 2, 468, 190, 46, () => {
    if (!animOn) endSplash(); else if (warpOn) startWarp();
    else splash.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300 }).onfinish = endSplash;
  }, null, true);
  (function bob(t) { if (splash.style.display !== "none" && animOn) slogo.style.transform = `translateY(${Math.sin(t / 1000 * 2.33) * 6}px)`; requestAnimationFrame(bob); })(0);
  const showSplashScreen = () => { splash.style.display = ""; };
  const warp = box(root, "warp", 0, 0, 1178, 788, "canvas"); warp.width = 1178; warp.height = 788; warp.style.display = "none";
  const N = 230, ang = [], bs = [], sp = [], tint = [];
  for (let i = 0; i < N; i++) { ang[i] = Math.random() * Math.PI * 2; bs[i] = Math.random(); sp[i] = 0.35 + Math.random() * 1.9; tint[i] = Math.random(); }
  const logoImg = new Image();
  function refreshLogoImg() { const s = logoSvg(150).replace("var(--acc)", css(L.acc)).replace("var(--acc2)", css(L.acc2)).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" '); logoImg.src = "data:image/svg+xml," + encodeURIComponent(s); }
  function startWarp() {
    const pal = [L.acc, L.acc2, mix(L.acc, L.acc2, 0.5), mix(L.acc, WHITE, 0.3)], glow = [], core = [];
    for (let i = 0; i < N; i++) { glow[i] = pal[i % 4]; core[i] = mix(WHITE, glow[i], 0.18); }
    const g = warp.getContext("2d"), cx = warp.width / 2, cy = warp.height / 2, maxR = Math.hypot(cx, cy), t0 = performance.now();
    const A = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(255, a)) / 255})`;
    const ln = (ax, ay, bx, by, lw, c) => { g.lineWidth = lw; g.strokeStyle = c; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke(); };
    warp.style.display = ""; warp.style.opacity = 1; let hid = false;
    (function frame(now) {
      const t = (now - t0) / 1500;
      if (t >= 1.4) { warp.style.display = "none"; if (!tourDone) startTour(); return; }
      if (t > 1) { if (!hid) { splash.style.display = "none"; hid = true; } const k = Math.min(1, (t - 1) / 0.4); g.fillStyle = css(L.bg); g.fillRect(0, 0, warp.width, warp.height); warp.style.opacity = Math.pow(1 - k, 3); return requestAnimationFrame(frame); }
      g.fillStyle = "rgb(2,2,8)"; g.fillRect(0, 0, warp.width, warp.height); g.lineCap = "round";
      const head = Math.pow(t, 1.7), tail = Math.pow(Math.max(0, t - 0.12), 1.7);
      for (let i = 0; i < N; i++) {
        const fh = (bs[i] + sp[i] * head) % 1, ft = (bs[i] + sp[i] * tail) % 1; if (ft > fh) continue;
        const h = maxR * 0.05 * Math.pow(22, fh), tl = maxR * 0.05 * Math.pow(22, ft), ca = Math.cos(ang[i]), sa = Math.sin(ang[i]);
        const x0 = cx + ca * tl, y0 = cy + sa * tl, x2 = cx + ca * h, y2 = cy + sa * h, x1 = x0 + (x2 - x0) * 0.55, y1 = y0 + (y2 - y0) * 0.55;
        const w = (0.7 + fh * 2.6) * (0.7 + 0.6 * tint[i]) * (0.8 + t), br = 90 + 165 * fh;
        ln(x1, y1, x2, y2, w * 3.4, A(glow[i], br * 0.22)); ln(x0, y0, x1, y1, w * 1.5, A(glow[i], br * 0.55));
        ln(x1, y1, x2, y2, w * 1.5, A(glow[i], br)); ln(x1, y1, x2, y2, Math.max(1, w * 0.6), A(core[i], br));
      }
      if (t < 0.4) { const k = t / 0.4, s = 1 + k * 5; g.save(); g.globalAlpha = 1 - k; g.translate(cx, cy); g.scale(s, s); g.drawImage(logoImg, -75, -75, 150, 150); g.restore(); }
      if (t > 0.78) { g.globalAlpha = Math.min(1, (t - 0.78) / 0.22); g.fillStyle = css(L.bg); g.fillRect(0, 0, warp.width, warp.height); g.globalAlpha = 1; }
      requestAnimationFrame(frame);
    })(t0);
  }


  // ---------- Ask Prisma (same answers as the app) ----------
  const AskK = [["hi", "hello", "hey", "hej"], ["saturation", "vibrance", "not working", "nothing happens", "doesnt work", "does not work"], ["whole screen", "in game", "ingame", "game colour", "game color", "apply"], ["fps", "presentmon", "frames"], ["crosshair", "cross", "share", "code", "import"], ["preset", "look", "save"], ["games", "profile", "auto", "exe", "switch"], ["bind", "hotkey", "shortcut", "key"], ["optimiz", "optimis", "tweak", "undo", "faster", "boost"], ["ban", "anti-cheat", "anticheat", "safe", "allowed", "cheat", "vac"], ["account", "sync", "upload", "download", "cloud", "pc"], ["password", "forgot", "login", "log in", "locked", "tries"], ["reset", "wrong", "weird", "strange", "dark", "bright"], ["theme", "colour of app", "crimson", "round", "custom"], ["start with windows", "startup", "minimis", "minimiz", "boot"], ["lag", "slow", "laggy", "instant"], ["monitor", "display", "screens", "second"], ["uninstall", "remove", "delete prisma"], ["folder", "appdata", "settings file", "where"], ["overlay", "cpu", "gpu", "temp", "ram", "vram", "stats"]], AskA = ["Prisma is a game toolkit for NVIDIA PCs. It changes your screen colours, adds a crosshair and stats overlay, switches looks per game, and has Windows tweaks for smoother games.", "Saturation uses your NVIDIA driver. Update the driver and restart Prisma. The message under the sliders on the Colour tab tells you the exact reason. Brightness, contrast and gamma work even without NVIDIA.", "Turn on Whole screen on the Colour tab. Then your look shows on your real monitor and in your games. Borderless or windowed mode works best.", "FPS needs the free PresentMon.exe (from the PresentMon project on GitHub). Put it next to Prisma.exe, start Prisma as administrator, and turn on FPS on the Overlay tab.", "Go to the Crosshair tab, pick a style or a built-in crosshair, and turn Crosshair on. It shows in windowed and borderless games. Press Copy code to share it. Your friend uses Import code.", "Set the sliders the way you like, open Presets, type a name and press Save look. Click a saved look to use it again. Right-click it to delete it.", "Open the Games tab. Press Find my games to list your Steam and Epic games, or type the program name (for example RainbowSix.exe). Click a look, then press Add game. Prisma switches when the game starts and puts your colours back when it closes.", "Open the Binds tab, click a key box and press your keys together with Ctrl, Alt or Shift, for example Ctrl + Alt + F. Esc cancels.", "The Optimize tab has 16 Windows tweaks for smoother games. Press Optimize all, or turn single tweaks on. Undo all puts everything back.", "Prisma changes your screen colours through your driver and Windows. It does not touch game files. Some games do not allow overlays like a crosshair, so check the game's rules first. You use it at your own risk.", "On the Account tab, Upload saves your looks, crosshairs and game profiles online. On another PC, log in and press Download to get them back.", "Forgot your password? Use Forgot password on the Prisma website and we send you a reset email. After 5 wrong tries you wait 5 minutes. You only need an account to sync your looks.", "If colours look wrong, press Reset all displays on the Colour tab, or turn Whole screen off.", "Open Themes to pick a theme, make your own with Custom, and change how round the corners are with Roundness.", "In Settings you can turn on Start with Windows and Start minimised.", "If Prisma feels laggy, turn on Instant mode in Settings. It turns off all motion.", "Every monitor has its own settings. Use the Display buttons on the Colour tab, or All displays to change them all. After plugging in a monitor, press +.", "Turn Whole screen off first, then go to Windows Settings > Apps > Installed apps > Prisma > Uninstall.", "Your Prisma settings are in %APPDATA%\\Prisma. Settings > Open settings folder opens it.", "The Overlay tab shows CPU, GPU, RAM, GPU temperature and video memory on top of your game. Pick a corner, text size and opacity, then turn Overlay on."];
  const askAnswer = (q) => { q = " " + q.toLowerCase().replace(/'/g, "") + " "; let best = -1, score = 0;
    AskK.forEach((ks, i) => { let sc = 0; ks.forEach((k) => { if (q.includes(k.length <= 3 ? " " + k : k)) sc += k.length; }); if (sc > score) { score = sc; best = i; } });
    return best < 0 ? "Sorry, I do not know that yet. Try asking about saturation, presets, the crosshair, the overlay, FPS, games, binds, themes or your account." : AskA[best]; };
  const askP = rpanel(root, 700, 66, 462, 470); askP.style.display = "none"; askP.style.zIndex = 11;
  label(askP, "Ask Prisma", 18, 14, 300, 28, "#fff", 13, true);
  label(askP, "Click a question to get an answer.", 18, 42, 420, 20, MUTE, 9);
  const askX = box(askP, "cap x", 414, 12, 34, 30); askX.innerHTML = '<svg viewBox="0 0 34 30"><path d="M12 10 22 20M22 10 12 20"/></svg>'; askX.onclick = () => (askP.style.display = "none");
  const AQ = [["What is Prisma?", 0], ["Saturation does nothing", 1], ["Colours in my games", 2], ["How do I get FPS?", 3], ["Show CPU / GPU stats", 19], ["Crosshair in game", 4], ["Share a crosshair", 4], ["Save a look", 5], ["Auto look per game", 6], ["Set a hotkey", 7], ["Make my PC faster", 8], ["Can I get banned?", 9], ["Sync to another PC", 10], ["Forgot password", 11], ["Colours look wrong", 12], ["Change the theme", 13], ["Start with Windows", 14], ["Prisma is laggy", 15], ["Two monitors", 16], ["Uninstall Prisma", 17]];
  const askOut = label(askP, "Hi! Pick a question below.", 18, 70, 426, 112, "#fff", 10); askOut.style.whiteSpace = "pre-wrap";
  label(askP, "Popular questions", 18, 188, 300, 20, MUTE, 9);
  const askQ = flow(askP, 14, 210, 438, 250);
  AQ.forEach(([q, n]) => flowBtn(askQ, q, false, () => (askOut.textContent = q + "\n\n" + AskA[n])));
  rbtn(root, "?  Ask Prisma", 818, 16, 124, 32, 2, () => { const o = askP.style.display === "none"; askP.style.display = o ? "" : "none";  });

  // first-run tour
  const tT = ["Welcome to Prisma", "Colour", "Presets", "Themes", "Optimize", "Crosshair", "Overlay", "Games", "Binds", "Account", "Settings", "About", "You are ready"];
  const tP = [0, 0, 1, 2, 6, 7, 9, 10, 8, 3, 5, 4, 0];
  const tB = ["This quick tour shows you around. It takes about a minute. Prisma makes your games look better and run better.", "Move the sliders to change saturation, brightness, contrast and gamma. Turn on Whole screen so it also shows in your games.", "Found a look you like? Save it here. Click a saved look any time to use it again.", "Change how Prisma looks. Pick a theme, make your own with Custom, and set how round the corners are.", "One-click tweaks to make Windows run lighter for games. Every tweak can be undone.", "Build your own crosshair, pick one of the built-in ones, and share it with a friend using a code.", "Shows CPU, GPU and memory use (and FPS if you add PresentMon) on top of your game.", "Pick a game and a look. Prisma switches to it when the game starts and back when it closes.", "Set your own keyboard shortcuts, for example to turn the filter or crosshair on and off while you play.", "Create a free account to save your looks, crosshairs and game profiles online. Press Upload to save them, and Download on another PC to get them back.", "Start with Windows, update check and sound cues live here. You can replay this tour from here too.", "Find out what Prisma is, who made it, and what is coming next.", "That is it! Have fun, and press the Prisma logo any time to see the start screen again."];
  const tour = rpanel(root, 620, 566, 530, 206); tour.classList.add("tour"); tour.style.display = "none";
  const tTitle = label(tour, "", 20, 14, 400, 30, "#fff", 14, true), tStep = label(tour, "", 430, 18, 80, 22, MUTE, 9, false, "right"), tBody = label(tour, "", 20, 54, 490, 70, MUTE, 10);
  let tI = 0;
  rbtn(tour, "Skip tour", 20, 150, 100, 34, 2, () => endTour());
  const tBack = rbtn(tour, "Back", 300, 150, 90, 34, 2, () => tourGo(tI - 1));
  const tNext = pill(tour, "Next", 400, 148, 110, 36, () => (tI >= tT.length - 1 ? endTour() : tourGo(tI + 1)));
  function startTour() { tour.style.display = ""; tourGo(0); }
  function tourGo(i) {
    tI = Math.max(0, i); const pg = tP[tI];
    if (!OV.includes(pg)) panelOpen = false;
    onNav(pg);
    tTitle.textContent = tT[tI]; tBody.textContent = tB[tI]; tStep.textContent = tI + 1 + " / " + tT.length;
    tBack.style.display = tI > 0 ? "" : "none"; tNext.textContent = tI >= tT.length - 1 ? "Finish" : "Next";
    if (animOn) { tour.classList.add("in"); void tour.offsetWidth; tour.classList.remove("in"); }
  }
  function endTour() { tour.style.display = "none"; if (!tourDone) snd(3); tourDone = true; LS.set("tour", "1"); }

  // start
  setVals([50, 0, 100, 100]); updateStatus(); rebuildPresets(); rebuildXList(); refreshGames(); xhSync(); xhChanged(); refreshBinds();
  applyTheme(); fit(); showPage(0); updateNav();
  addEventListener("pagehide", () => (document.documentElement.style.filter = ""));
})();
