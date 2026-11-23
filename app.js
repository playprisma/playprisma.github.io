(() => {
  const C = window.PRISMA || {};
  const page = document.body.dataset.page;
  const base = new URL("./", location.href).href;
  const keyOk = C.SUPABASE_ANON_KEY && !C.SUPABASE_ANON_KEY.startsWith("PASTE_");
  const sb = keyOk && window.supabase ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
  const $ = (s, r = document) => r.querySelector(s);
  const qp = new URLSearchParams(location.search);
  const hp = new URLSearchParams(location.hash.slice(1));
  const linkError = hp.get("error_description") || qp.get("error_description");
  const DL_FALLBACK = `https://github.com/${C.GITHUB_REPO}/releases/latest/download/Prisma-Setup.exe`;
  const DL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0-5-5m5 5 5-5M4 21h16"/></svg>';

  const msg = (el, text, type = "err") => { el.innerHTML = ""; el.append(text); el.className = "msg " + type; el.hidden = !text; };
  const busy = (btn, on) => { btn.disabled = on; if (on) { btn.dataset.t = btn.innerHTML; btn.innerHTML = '<span class="spin"></span>'; } else if (btn.dataset.t) btn.innerHTML = btn.dataset.t; };
  const toast = (t) => { const d = document.createElement("div"); d.className = "toast"; d.textContent = t; document.body.append(d); setTimeout(() => d.remove(), 4500); };
  const fmtDate = (d) => new Date(d).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  const ago = (d) => { const s = (Date.now() - new Date(d)) / 1000, u = [[86400, "day"], [3600, "hour"], [60, "minute"]];
    for (const [n, w] of u) if (s >= n) { const v = Math.floor(s / n); return `${v} ${w}${v > 1 ? "s" : ""} ago`; } return "just now"; };
  const bytes = (n) => (n / 1048576).toFixed(1) + " MB";

  // ---------- layout ----------
  const nav = [["index.html", "Home", "home", "nav-home"], ["features.html", "Features", "features", "hide-sm"], ["demo.html", "Try demo", "demo", ""], ["reviews.html", "Reviews", "reviews", "hide-sm"], ["download.html", "Download", "download", "hide-sm"]].filter(([, , p]) => p !== "download");
  const header = $("header.site");
  if (header) header.innerHTML = `<div class="wrap"><a class="brand" href="index.html"><img src="assets/icon-64.png" alt="">Prisma</a><nav>
    ${nav.map(([h, t, p, c]) => `<a href="${h}" class="${c} ${p === page ? "active" : ""}">${t}</a>`).join("")}
    <a id="authLink" href="login.html" class="${["login", "signup", "account"].includes(page) ? "active" : ""}">Log in</a>
    <a class="btn btn-sm" href="download.html">Download</a></nav></div>`;
  const footer = $("footer.site");
  if (footer) footer.innerHTML = `<div class="wrap"><span>© ${new Date().getFullYear()} Prisma. Not affiliated with NVIDIA.</span>
    <div class="links"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="https://github.com/${C.GITHUB_REPO}" rel="noopener">GitHub</a></div></div>`;
  document.querySelectorAll("[data-cfg]").forEach((el) => { const v = C[el.dataset.cfg]; if (v) { el.textContent = v; if (el.tagName === "A" && v.includes("@")) el.href = "mailto:" + v; } });
  let loggedIn = false;
  const gateDl = () => { if (loggedIn) return; document.querySelectorAll("[data-dl]").forEach((a) => { a.href = "login.html?next=download.html"; a.title = "Log in to download"; }); const n = $("#dlGate"); if (n) n.hidden = false; };
  if (sb) sb.auth.getSession().then(({ data }) => { if (data.session) { loggedIn = true; const a = $("#authLink"); a.textContent = "Account"; a.href = "account.html"; } gateDl(); });
  if (qp.get("deleted")) toast("Your account and synced data have been deleted.");

  // ---------- scroll reveal ----------
  const sel = ".fsec > .card, .faq, .card.rv, .chips-l, .rv-form, .demo-note, #prismaWrap, .hero > div > *, .hero .mock, .sec-head, .grid > .card, .shots > .shot, .cta-band, .demo-head,  .page > h1, .page > p, .dl-card, .acct > .card, .auth .card, .legal > *";
  const els = [...document.querySelectorAll(sel)];
  if ("IntersectionObserver" in window) {
    els.forEach((el) => {
      const sibs = [...el.parentElement.children].filter((c) => c.matches(sel));
      el.style.setProperty("--d", Math.min(sibs.indexOf(el), 8) * 0.07 + "s");
      el.classList.add("rv");
    });
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.01, rootMargin: "0px 0px -20px 0px" });
    requestAnimationFrame(() => els.forEach((el) => io.observe(el)));
  }

  // ---------- GitHub release ----------
  async function latestRelease() {
    const k = "prisma-release";
    try { const c = JSON.parse(sessionStorage.getItem(k)); if (c && Date.now() - c.t < 6e5) return c.r; } catch {}
    const res = await fetch(`https://api.github.com/repos/${C.GITHUB_REPO}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error("GitHub " + res.status);
    const j = await res.json();
    const a = (j.assets || []).find((x) => x.name.toLowerCase() === "prisma-setup.exe");
    const r = { tag: j.tag_name, date: j.published_at, url: j.html_url, notes: (j.body || "").trim(),
      asset: a && { url: a.browser_download_url, size: a.size, digest: a.digest || "" } };
    try { sessionStorage.setItem(k, JSON.stringify({ t: Date.now(), r })); } catch {}
    return r;
  }
  const dlLinks = document.querySelectorAll("[data-dl]");
  dlLinks.forEach((a) => (a.href = DL_FALLBACK));
  if (dlLinks.length || page === "download") latestRelease().then((r) => {
    document.querySelectorAll("[data-version]").forEach((el) => (el.textContent = r.tag));
    $("#newPill")?.removeAttribute("hidden");
    if (r.asset && loggedIn) dlLinks.forEach((a) => (a.href = r.asset.url));
    if (page === "download") {
      $("#relDate").textContent = new Date(r.date).toLocaleDateString(undefined, { dateStyle: "long" });
      $("#relSize").textContent = r.asset ? bytes(r.asset.size) : "2.6 MB";
      if (r.asset?.digest) { $("#relHash").textContent = r.asset.digest.replace(/^sha256:/, ""); $("#hashRow").hidden = false; }
      $("#relLink").href = r.url;
      if (r.notes) { $("#notes").textContent = r.notes; $("#notesCard").hidden = false; }
    }
  }).catch(() => document.querySelectorAll("[data-version]").forEach((el) => (el.textContent = el.classList.contains("ver") ? "Latest" : "")));

  // show / hide password
  document.querySelectorAll('input[type=password]').forEach((i) => {
    const w = document.createElement("span"); w.className = "pw"; i.parentNode.insertBefore(w, i); w.appendChild(i);
    const b = document.createElement("button"); b.type = "button"; b.className = "pw-btn"; b.textContent = "Show"; w.appendChild(b);
    b.onclick = () => { const h = i.type === "password"; i.type = h ? "text" : "password"; b.textContent = h ? "Hide" : "Show"; };
  });

  // ---------- auth pages ----------
  const form = $("#form"), box = $("#msg");
  const needSb = () => { if (sb) return true; if (box) msg(box, "Accounts are not configured yet: add the Supabase anon key in config.js."); if (form) form.querySelector("button").disabled = true; return false; };

  const pages = {
    async signup() {
      if (!needSb()) return;
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = form.email.value.trim(), pw = form.password.value, btn = form.querySelector("button");
        if (pw.length < 8) return msg(box, "Password must be at least 8 characters.");
        if (pw !== form.confirm.value) return msg(box, "Passwords don't match.");
        busy(btn, true);
        const { data, error } = await sb.auth.signUp({ email, password: pw, options: { emailRedirectTo: base + "account.html" } });
        busy(btn, false);
        if (error) return msg(box, error.message);
        if (data.session) return location.assign("account.html");
        form.hidden = true; $("#doneEmail").textContent = email; $("#done").hidden = false; box.hidden = true;
      });
    },

    async login() {
      if (!needSb()) return;
      if ((await sb.auth.getSession()).data.session) return location.replace("account.html");
      if (linkError) msg(box, linkError);
      const LK = "prisma-lock", lk = () => { try { return JSON.parse(localStorage.getItem(LK)) || { n: 0, until: 0 }; } catch { return { n: 0, until: 0 }; } }, lkSave = (v) => { try { localStorage.setItem(LK, JSON.stringify(v)); } catch {} };
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const L = lk(), wait = Math.ceil((L.until - Date.now()) / 60000);
        if (wait > 0) return msg(box, `Too many wrong tries. Wait ${wait} min and try again.`);
        const email = form.email.value.trim(), btn = form.querySelector("button");
        busy(btn, true);
        const { error } = await sb.auth.signInWithPassword({ email, password: form.password.value });
        busy(btn, false);
        if (!error) { lkSave({ n: 0, until: 0 }); }
        if (error && error.code === "invalid_credentials") {
          const L2 = lk(); L2.n++;
          if (L2.n >= 5) { lkSave({ n: 0, until: Date.now() + 300000 }); return msg(box, "Too many wrong tries. Wait 5 min and try again."); }
          lkSave(L2); return msg(box, `Wrong email or password. ${5 - L2.n} tries left.`);
        }
        if (!error) return location.assign(/^[a-z]+\.html$/.test(qp.get("next") || "") ? qp.get("next") : "account.html");
        if (/confirm/i.test(error.message)) {
          const b = document.createElement("button"); b.type = "button"; b.textContent = "Resend confirmation email";
          b.onclick = async () => { await sb.auth.resend({ type: "signup", email, options: { emailRedirectTo: base + "account.html" } }); msg(box, "Confirmation email sent. Check your inbox.", "ok"); };
          msg(box, "Please confirm your email first. "); box.append(b);
        } else msg(box, error.code === "invalid_credentials" ? "Wrong email or password." : error.message);
      });
    },

    async forgot() {
      if (!needSb()) return;
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btn = form.querySelector("button"); busy(btn, true);
        const { error } = await sb.auth.resetPasswordForEmail(form.email.value.trim(), { redirectTo: base + "reset.html" });
        busy(btn, false);
        if (error && error.status === 429) return msg(box, "Too many requests. Please wait a minute and try again.");
        msg(box, "If an account exists for that email, a reset link is on its way. Check your inbox (and spam).", "ok");
        form.reset();
      });
    },

    async reset() {
      if (!needSb()) return;
      const { data } = await sb.auth.getSession();
      if (!data.session || linkError) {
        form.hidden = true;
        msg(box, (linkError || "This reset link is invalid or has expired.") + " ");
        const a = document.createElement("a"); a.href = "forgot.html"; a.textContent = "Request a new link"; box.append(a); return;
      }
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const pw = form.password.value, btn = form.querySelector("button");
        if (pw.length < 8) return msg(box, "Password must be at least 8 characters.");
        if (pw !== form.confirm.value) return msg(box, "Passwords don't match.");
        busy(btn, true);
        const { error } = await sb.auth.updateUser({ password: pw });
        busy(btn, false);
        if (error) return msg(box, error.message);
        location.assign("account.html?pw=1");
      });
    },

    async account() {
      if (!needSb()) return;
      const { data: { session } } = await sb.auth.getSession();
      if (!session) return location.replace("login.html");
      const user = session.user;
      sb.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_OUT") location.replace("login.html"); });
      $("#email").textContent = user.email;
      $("#since").textContent = fmtDate(user.created_at);
      $("#acct").hidden = false;
      if (qp.get("pw")) toast("Password updated.");
      else if (hp.get("type") === "signup" || hp.get("access_token")) toast("Email confirmed. Welcome to Prisma!");
      history.replaceState(null, "", "account.html");

      // sync status
      const { data: row, error: rowErr } = await sb.from("prisma_sync").select("updated_at, data").eq("user_id", user.id).maybeSingle();
      const st = $("#syncStatus");
      if (rowErr) { st.innerHTML = "<i></i>Couldn't check sync status"; }
      else if (row) {
        st.classList.add("on"); st.innerHTML = "<i></i>Presets synced";
        $("#syncWhen").textContent = `Last synced ${ago(row.updated_at)} · ${fmtDate(row.updated_at)}`;
      } else {
        st.innerHTML = "<i></i>Not synced yet";
        $("#syncWhen").textContent = "Sign in inside the Prisma app with this account to back up your presets.";
      }

      // change password
      const pf = $("#pwForm"), pm = $("#pwMsg");
      pf.addEventListener("submit", async (e) => {
        e.preventDefault();
        const pw = pf.password.value, btn = pf.querySelector("button");
        if (pw.length < 8) return msg(pm, "Password must be at least 8 characters.");
        if (pw !== pf.confirm.value) return msg(pm, "Passwords don't match.");
        busy(btn, true);
        const { error } = await sb.auth.updateUser({ password: pw });
        busy(btn, false);
        if (error) return msg(pm, error.message);
        pf.reset(); msg(pm, "Password updated.", "ok");
      });

      $("#logout").onclick = async () => { await sb.auth.signOut(); location.assign("index.html"); };

      // export my data (GDPR portability)
      $("#export").onclick = () => {
        const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), email: user.email, account_created: user.created_at, prisma_sync: row || null }, null, 2)], { type: "application/json" });
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "prisma-my-data.json"; a.click(); URL.revokeObjectURL(a.href);
      };

      // delete account
      const dlg = $("#delDialog"), di = $("#delInput"), dbtn = $("#delConfirm"), dm = $("#delMsg");
      $("#delete").onclick = () => { di.value = ""; dbtn.disabled = true; dm.hidden = true; dlg.showModal(); };
      $("#delCancel").onclick = () => dlg.close();
      di.oninput = () => (dbtn.disabled = di.value.trim() !== "DELETE");
      dbtn.onclick = async () => {
        busy(dbtn, true);
        const { error } = await sb.rpc("delete_user");
        if (error) { busy(dbtn, false); return msg(dm, "Couldn't delete the account: " + error.message); }
        await sb.auth.signOut({ scope: "local" });
        location.replace("index.html?deleted=1");
      };
    },
  };
  pages.reviews = async () => {
    const grid = $("#rvGrid"), f = $("#rvForm"), m = $("#rvMsg");
    const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    if (!sb) return msg(m, "Reviews could not load.");
    const { data: { session } } = await sb.auth.getSession();
    async function load() {
      const { data, error } = await sb.from("reviews").select("id,user_id,name,body,created_at").order("created_at", { ascending: false }).limit(200);
      if (error) return msg(m, "Reviews could not load.");
      grid.innerHTML = data.map((r) => `<div class="card rv"><span class="rv-tag">✓ Review</span><p>“${esc(r.body)}”</p><div class="rv-who"><i>${esc(r.name[0].toUpperCase())}</i><span><b>${esc(r.name)}</b><small>${new Date(r.created_at).toLocaleDateString(undefined, { dateStyle: "medium" })}</small></span></div></div>`).join("");
      $("#rvEmpty").hidden = data.length > 0;
      const mine = session && data.find((r) => r.user_id === session.user.id);
      f.hidden = !session || !!mine; $("#rvLogin").hidden = !!session; $("#rvMine").hidden = !mine;
    }
    f.addEventListener("submit", async (e) => {
      e.preventDefault(); const btn = f.querySelector("button"); busy(btn, true);
      const { error } = await sb.from("reviews").insert({ name: f.name.value.trim(), body: f.body.value.trim() });
      busy(btn, false);
      if (error) return msg(m, error.code === "23505" ? "You already wrote a review." : "Could not post: " + error.message);
      m.hidden = true; f.reset(); load();
    });
    $("#rvDel").onclick = async () => { await sb.from("reviews").delete().eq("user_id", session.user.id); load(); };
    load();
  };
  pages[page]?.();
})();
