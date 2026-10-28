// Comparar duas ideologias (página /ideologias/comparar/). Os dados vêm prontos na própria página
// (gerados por ferramentas/gerar_paginas.mjs); aqui só monta a tela e guarda a escolha no endereço (?a=...&b=...).
(function () {
  const D = JSON.parse(document.getElementById("dados-comparar").textContent);
  const porSlug = Object.fromEntries(D.ideo.map((o) => [o.s, o]));
  const selA = document.getElementById("ideoA"), selB = document.getElementById("ideoB"), out = document.getElementById("comparacao");
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const q = new URLSearchParams(location.search);
  if (Object.hasOwn(porSlug, q.get("a") || "")) selA.value = q.get("a");
  if (Object.hasOwn(porSlug, q.get("b") || "")) selB.value = q.get("b");
  // se vier só a primeira (link "Comparar com outra ideologia") e ela for igual à segunda padrão, a segunda passa a ser a vizinha da lista
  if (selA.value === selB.value) selB.selectedIndex = (selA.selectedIndex + 1) % selB.options.length;

  function montar() {
    const a = porSlug[selA.value], b = porSlug[selB.value];
    out.innerHTML = "";
    if (a === b) { out.append(el("p", "intro-pagina", "Escolha duas ideologias diferentes.")); return; }
    const leg = el("div", "comp-legenda");
    [["marca-a", a], ["marca-b", b]].forEach(([m, o]) => { const s = el("span"), i = el("i", m); i.setAttribute("aria-hidden", "true"); s.append(i, o.n); leg.append(s); });
    const grade = el("div", "comp-grade"), colE = el("div"), colD = el("div", "comp-lado");
    grade.append(colE, colD); out.append(grade);
    colE.append(el("h2", "rotulo-secao", "Posição típica nos eixos"), leg);
    const lista = el("div", "eixos-tipicos comp-eixos"), perto = [];
    D.eixos.forEach((x) => {
      const pa = a.p[x.k], pb = b.p[x.k], linha = el("div", "eixo-tipico");
      if (Math.abs(pa - pb) < 15) perto.push(x.nome);
      const topo = el("div", "topo"); topo.append(el("b", null, x.nome)); linha.append(topo);
      const tr = el("div", "trilho comp-trilho"); tr.setAttribute("aria-hidden", "true");
      const ia = el("i", "marca-a"), ib = el("i", "marca-b");
      ia.style.left = (pa + 100) / 2 + "%"; ib.style.left = (pb + 100) / 2 + "%";
      tr.append(ia, ib); linha.append(tr);
      const pts = el("div", "pontas"); pts.setAttribute("aria-hidden", "true"); pts.append(el("span", null, x.esq), el("span", null, x.dir)); linha.append(pts);
      const fx = el("ul", "comp-faixas");
      [["marca-a", a], ["marca-b", b]].forEach(([m, o]) => { const li = el("li"), i = el("i", m); i.setAttribute("aria-hidden", "true"); li.append(i, el("span", null, `${o.n}: `), el("b", null, o.f[x.k])); fx.append(li); });
      linha.append(fx); lista.append(linha);
    });
    colE.append(lista);
    colD.append(el("h2", "rotulo-secao", "Em que se separam"));
    const p = el("p", "comp-texto"); p.append(el("b", null, a.n), ` em relação a ${b.n}: ${D.dif[a.s + "|" + b.s]}`); colD.append(p);
    colD.append(el("p", "comp-texto", perto.length ? `Ficam perto (menos de 15 pontos de distância) em: ${perto.join(", ")}.` : "Não ficam perto em nenhum eixo."));
    colD.append(el("h2", "rotulo-secao", "Em uma frase"));
    const res = el("div", "comp-resumos");
    [["marca-a", a], ["marca-b", b]].forEach(([m, o]) => {
      const c = el("div", "comp-resumo"), t = el("b"), i = el("i", m); i.setAttribute("aria-hidden", "true");
      t.append(i, o.n); const ln = el("a", null, `Ver a página de ${o.n}`); ln.href = `/ideologias/${o.s}/`;
      c.append(t, el("small", null, `Família: ${o.g}`), el("p", null, o.r), ln); res.append(c);
    });
    colD.append(res);
    const ac = el("div", "acoes-pagina acoes-pagina-linha"), ok = el("a", "ok", "Fazer o teste"), br = el("a", "branco", "Ver as 21 ideologias");
    ok.href = "/#modos"; br.href = "/ideologias/"; ac.append(ok, br); colD.append(ac);
    document.title = `${a.n} × ${b.n} | Teste político`;
    history.replaceState(null, "", `?a=${a.s}&b=${b.s}`);
  }
  selA.onchange = selB.onchange = montar;
  document.getElementById("trocar").onclick = () => { const t = selA.value; selA.value = selB.value; selB.value = t; montar(); };
  montar();
})();
