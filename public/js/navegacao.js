// Navegação comum a todas as páginas públicas: tema, cabeçalho, menu (teclado numerado) e rodapé.
// Carregado no <head>, antes do resto, pra aplicar o tema escolhido sem piscar.
(function () {
  "use strict";
  const TEMA = "tp-tema", SOM = "tp-som";
  const ler = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const gravar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

  // tema: "auto" segue o aparelho; "claro" e "escuro" forçam
  function aplicarTema() {
    const t = ler(TEMA) || "auto", r = document.documentElement;
    if (t === "claro") r.dataset.theme = "light"; else if (t === "escuro") r.dataset.theme = "dark"; else delete r.dataset.theme;
    document.dispatchEvent(new Event("tp-tema"));
  }
  aplicarTema();

  // páginas do site: a mesma lista alimenta o menu (numerado, na ordem) e o rodapé (sem o Início). "Fazer o teste" fica só
  // no botão do cabeçalho, que já leva aos modos
  const PAGINAS = [
    { h: "/", t: "Início" },
    { h: "/ideologias/", t: "Ideologias" },
    { h: "/metodologia.html", t: "Metodologia" },
    { h: "/perguntas-frequentes/", t: "Perguntas frequentes" },
    { h: "/sobre/", t: "Sobre o projeto" },
    { h: "/codigo-aberto/", t: "Código-fonte" },
    { h: "/termos.html", t: "Privacidade e termos" },
  ];
  // data da última atualização, mostrada no rodapé: a mesma da entrada mais recente do CHANGELOG.md (conferido nos testes)
  const ATUALIZADO = "28 de outubro de 2026";
  const LICENCA = "https://github.com/andrxzinho/teste-politico/blob/main/LICENSE";
  const caminho = () => location.pathname.replace(/index\.html$/, "");
  const ehAtual = (h) => !h.includes("#") && (h === "/" ? caminho() === "/" : caminho().startsWith(h.replace(/\/$/, "")));
  function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function link(p, cls) { const a = el("a", cls); a.href = p.h; if (ehAtual(p.h)) a.setAttribute("aria-current", "page"); return a; }

  let fundo, botao, ultimoFoco;
  function abrir() {
    ultimoFoco = document.activeElement; atualizarConfig();
    fundo.hidden = false; botao.setAttribute("aria-expanded", "true"); document.body.style.overflow = "hidden";
    fundo.querySelector(".menu-item").focus();
  }
  function fechar() {
    fundo.hidden = true; botao.setAttribute("aria-expanded", "false"); document.body.style.overflow = "";
    (ultimoFoco || botao).focus();
  }
  function atualizarConfig() {
    const som = ler(SOM) === "1", b = fundo.querySelector(".chave");
    b.setAttribute("aria-pressed", String(som)); b.textContent = som ? "Ligado" : "Desligado";
    const t = ler(TEMA) || "auto";
    fundo.querySelectorAll(".seg3 button").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.tema === t)));
  }

  function montar() {
    const cab = document.getElementById("site-cab");
    if (cab && !cab.firstChild) {
      cab.className = "site-cab";
      const marca = el("a", "site-marca"); marca.href = "/";
      marca.append(el("b", null, "TESTE POLÍTICO"));
      const dir = el("div", "site-cab-dir"), nav = el("nav", "site-nav"); nav.setAttribute("aria-label", "Principal");
      PAGINAS.filter((p) => p.cab).forEach((p) => { const a = link(p); a.textContent = p.t; nav.append(a); });
      const ok = el("a", "tecla-ok", "Fazer o teste"); ok.href = "/#modos"; nav.append(ok);
      botao = el("button", "menu-btn"); botao.type = "button"; botao.setAttribute("aria-label", "Abrir menu"); botao.setAttribute("aria-expanded", "false"); botao.setAttribute("aria-controls", "menu");
      botao.append(el("i"), el("i"), el("i")); botao.onclick = abrir;
      dir.append(nav, botao); cab.append(marca, dir);

      fundo = el("div", "menu-fundo"); fundo.hidden = true;
      const menu = el("nav", "menu"); menu.id = "menu"; menu.setAttribute("aria-label", "Menu");
      const topo = el("div", "menu-topo"), fx = el("button", "menu-fechar", "×");
      fx.type = "button"; fx.setAttribute("aria-label", "Fechar menu"); fx.onclick = fechar;
      topo.append(el("span", "menu-rot", "MENU"), fx); menu.append(topo);
      PAGINAS.forEach((p, i) => { const a = link(p, "menu-item"); a.append(el("b", null, String(i + 1)), el("span", null, p.t)); menu.append(a); });
      const cfg = el("div", "menu-cfg");
      cfg.append(el("span", "menu-rot", "CONFIGURAÇÕES"));
      const lSom = el("div", "linha"), bSom = el("button", "chave"); bSom.type = "button";
      bSom.onclick = () => { const liga = ler(SOM) !== "1"; gravar(SOM, liga ? "1" : "0"); atualizarConfig(); if (liga) som.confirma(); document.dispatchEvent(new Event("tp-som")); };
      lSom.append(el("span", null, "Som da urna"), bSom);
      const lTema = el("div"), seg = el("div", "seg3"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "Tema");
      [["auto", "Automático"], ["claro", "Claro"], ["escuro", "Escuro"]].forEach(([k, t]) => { const b = el("button", null, t); b.type = "button"; b.dataset.tema = k; b.onclick = () => { gravar(TEMA, k); aplicarTema(); atualizarConfig(); }; seg.append(b); });
      lTema.append(el("span", null, "Tema"), seg); lTema.style.cssText = "display:flex;flex-direction:column;gap:6px";
      cfg.append(lSom, lTema); menu.append(cfg); fundo.append(menu);
      fundo.addEventListener("click", (e) => { if (e.target === fundo) fechar(); });
      fundo.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { e.preventDefault(); fechar(); return; }
        const n = Number(e.key); if (n >= 1 && n <= menu.querySelectorAll(".menu-item").length && !e.altKey && !e.ctrlKey && !e.metaKey) { e.preventDefault(); menu.querySelectorAll(".menu-item")[n - 1].click(); return; }
        if (e.key === "Tab") { // mantém o foco dentro do menu
          const f = [...menu.querySelectorAll("a,button")], a = f[0], z = f[f.length - 1];
          if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
        }
      });
      document.body.append(fundo);
    }
    const rod = document.getElementById("site-rod");
    if (rod && !rod.firstChild) {
      rod.className = "site-rod";
      const nav = el("nav"); nav.setAttribute("aria-label", "Rodapé");
      PAGINAS.slice(1).forEach((p) => { const a = link(p); a.textContent = p.t; nav.append(a); });
      const legal = el("p", "site-rod-legal"), lic = el("a", null, "Licença PolyForm Strict"), cred = el("a", null, "ver créditos");
      lic.href = LICENCA; lic.rel = "noopener"; cred.href = "/creditos/"; if (ehAtual(cred.getAttribute("href"))) cred.setAttribute("aria-current", "page");
      const img = el("span", null, "Imagens: "); img.append(cred);
      legal.append(el("span", null, "© 2026 André Leal"), lic, img, el("span", null, `Atualizado em ${ATUALIZADO}`));
      rod.append(nav, el("p", null, "Projeto independente e sem fins lucrativos. Sem ligação com partidos, candidatos, governos ou a Justiça Eleitoral. O visual só se inspira na urna eletrônica. Não é recomendação de voto."), legal);
    }
  }
  // ---------- som da urna, sintetizado no navegador (nenhuma gravação é usada). O de confirmação foi recriado a partir de
  // medições do som da urna: tom puro alternando entre ~2,2 kHz e ~2,3 kHz a cada 100 ms, por 0,7 s. O de tecla é um "toc" curto.
  let actx = null, ruido = null;
  function contexto() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === "suspended") actx.resume(); return actx; } catch (e) { return null; } }
  function tocarConfirma(c, t) {
    const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.setValueAtTime(2300, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.006);
    for (let i = 0; i < 7; i++) { const f = i % 2 ? 2300 : 2200, ti = t + 0.04 + i * 0.1; o.frequency.setValueAtTime(f, ti); g.gain.setValueAtTime(f > 2250 ? 0.12 : 0.16, ti); }
    g.gain.setValueAtTime(0.16, t + 0.68); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.71); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.72);
  }
  function tocarTecla(c, t) {
    const o = c.createOscillator(), g = c.createGain(); o.type = "sine"; o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(105, t + 0.045);
    g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(0.2, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + 0.075);
    if (!ruido) { ruido = c.createBuffer(1, Math.round(c.sampleRate * 0.04), c.sampleRate); const d = ruido.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const n = c.createBufferSource(), f = c.createBiquadFilter(), gn = c.createGain(); n.buffer = ruido; f.type = "lowpass"; f.frequency.value = 1200;
    gn.gain.setValueAtTime(0.09, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.035); n.connect(f); f.connect(gn); gn.connect(c.destination); n.start(t); n.stop(t + 0.04);
  }
  const som = { confirma() { const c = contexto(); if (c) tocarConfirma(c, c.currentTime + 0.02); }, tecla() { const c = contexto(); if (c) tocarTecla(c, c.currentTime + 0.005); } };

  // ---------- movimento: a classe .mov liga as animações (movimento.css); com "reduzir movimento", nada se mexe
  const calmo = () => !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (!calmo()) document.documentElement.classList.add("mov");
  if (window.matchMedia) { const mq = matchMedia("(prefers-reduced-motion: reduce)"); mq.addEventListener && mq.addEventListener("change", () => document.documentElement.classList.toggle("mov", !mq.matches)); }
  // números que contam de 0 até o valor (o texto final fica em data-conta, com o sufixo em data-sufixo)
  function contar(e) {
    const fim = Number(e.dataset.conta), suf = e.dataset.sufixo || "";
    if (!isFinite(fim) || calmo() || e.dataset.contou) { e.textContent = fim + suf; return; }
    e.dataset.contou = "1"; const t0 = performance.now(), dur = 850;
    const f = (now) => { const t = Math.min(1, (now - t0) / dur), v = Math.round(fim * (1 - Math.pow(1 - t, 3))); e.textContent = v + suf; if (t < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }
  // blocos que aparecem quando entram na tela; --mi escalona irmãos do mesmo grupo
  let obs = null;
  function ver(e) { e.classList.add("visto"); e.querySelectorAll("[data-conta]").forEach(contar); }
  function revelar(lista) {
    const els = typeof lista === "string" ? [...document.querySelectorAll(lista)] : [...lista];
    if (!els.length) return;
    if (calmo() || !("IntersectionObserver" in window)) { els.forEach(ver); return; }
    if (!obs) obs = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { obs.unobserve(x.target); ver(x.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    let grupo = null, i = 0;
    els.forEach((e) => { if (e.parentElement !== grupo) { grupo = e.parentElement; i = 0; } e.style.setProperty("--mi", String(Math.min(i++, 6))); e.classList.add("revela"); e.classList.remove("visto"); obs.observe(e); });
  }
  function revelarPagina() { revelar(".lista-ideo .cartao, .livros .livro, .vizinhas > *, .faq details, .sec, .eixos-tipicos .eixo-tipico, .pagina .rotulo-secao"); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { montar(); revelarPagina(); }); else { montar(); revelarPagina(); }
  window.TP_NAV = { aplicarTema, fecharMenu: () => fundo && !fundo.hidden && fechar(), revelar, contar, calmo, som };
})();
