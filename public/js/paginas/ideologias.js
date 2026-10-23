// Filtro por família na lista de ideologias (página /ideologias/).
(function () {
  const botoes = document.querySelectorAll(".filtros button"), itens = document.querySelectorAll(".lista-ideo .cartao"), cont = document.querySelector(".contagem");
  function filtrar(g) {
    let n = 0;
    itens.forEach((a) => { const v = g === "todas" || a.dataset.grupo === g; a.hidden = !v; if (v) n++; });
    botoes.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.grupo === g)));
    cont.textContent = `${n} ${n === 1 ? "ideologia" : "ideologias"}`;
  }
  botoes.forEach((b) => (b.onclick = () => filtrar(b.dataset.grupo)));
})();
