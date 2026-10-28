// Motor de cálculo dos eixos, compartilhado entre o site (este arquivo) e o servidor (servidor/motor.mjs, gerado
// a partir deste por ferramentas/gerar_listas.mjs). Qualquer mudança aqui vale pros dois lados.
//
// Entrada: respostas (id -> número de -2 a 2, "x" pra sem opinião, "g" pra frase não mostrada), o mapa de frases e
// os pesos. Cada frase tem: k (eixo), s (subtema), d (direção), f (formato: "a" concordância, "d" dilema, "l" escolha
// forçada, "c" contraste), sc (conta na média de concordância), v (posições das opções, na escolha forçada) e va/vb
// (posições das duas frases, no contraste).
//
// 1. Média de concordância por subtema, em -100 a 100, com margem de erro.
// 2. Âncoras: escolhas forçadas, que dizem onde a pessoa se coloca sem depender de quão forte ela responde.
//    Os contrastes NÃO são âncoras: escolher entre duas frases só diz de que lado do ponto médio a pessoa está.
//    Eles entram na classificação (js/nucleo/calculo.js), comparando a resposta com a posição típica de cada ideologia.
// 3. Fator de estilo: inclinação da reta "âncora ≈ fator × média". Limitado e puxado pra 1 quando há pouca informação.
//    Com mais âncoras, o limite é mais largo.
// 4. Posição de cada subtema: média × fator combinada com as âncoras, cada uma pesando pela sua precisão.
// 5. Eixo: média dos subtemas, cada subtema com o mesmo peso. Faixa provável: ±1,28 margem de erro (80%).
//    Subtemas fora do eixo (CFG.fora: meio ambiente) têm posição própria, mas não entram na média do eixo nem recebem
//    as escolhas forçadas do eixo inteiro.
var Motor = (function () {
  var EIXOS = ["E", "A", "C", "N", "D", "S"];
  var CFG = {
    sdMin: 35,          // desvio mínimo das respostas num subtema (evita margem zero com poucas frases iguais)
    seEscadaSub: 32,    // margem de uma escolha forçada de subtema
    seEscadaEixo: 42,   // margem de uma escolha forçada do eixo inteiro, aplicada a cada subtema dele
    estilo: 0.3,        // erro de estilo que não diminui com mais frases: fração da própria média (soma-se à margem)
    denMin: 1200, encolhe: 5000, gMin: 0.8, gMax: 1.3, gMinAmplo: 0.6, gMaxAmplo: 1.6, ancorasAmplo: 8,
    fora: ["N.amb"]     // subtemas com posição própria, fora da média do eixo (desde a versão 4 do cálculo)
  };
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function chaveSub(o) { return o.k + "." + (o.s || "-"); }
  // opcoes.fora troca a lista de subtemas fora do eixo (o servidor usa [] pra conferir envios da versão 3)
  function calcular(A, itens, ids, pesos, opcoes) {
    pesos = pesos || {};
    var fora = opcoes && opcoes.fora ? opcoes.fora : CFG.fora;
    var soma = {}, peso = {}, qtd = {}, quad = {}, subsDoEixo = {};
    EIXOS.forEach(function (k) { subsDoEixo[k] = {}; });
    ids.forEach(function (id) {
      var o = itens[id], v = A[id];
      if (!o || typeof v !== "number" || !o.sc) return;
      var key = chaveSub(o), w = id[0] === "P" ? 1 : (pesos[id] || 1), x = v * o.d * 50;
      soma[key] = (soma[key] || 0) + x * w; peso[key] = (peso[key] || 0) + w; qtd[key] = (qtd[key] || 0) + 1; quad[key] = (quad[key] || 0) + x * x * w;
      if (fora.indexOf(key) < 0) subsDoEixo[o.k][key] = 1;
    });
    var media = {}, mse = {};
    Object.keys(soma).forEach(function (key) {
      var m = soma[key] / peso[key], dp = Math.max(CFG.sdMin, Math.sqrt(Math.max(0, quad[key] / peso[key] - m * m)));
      media[key] = m; mse[key] = dp / Math.sqrt(qtd[key]);
    });
    var eixoMedia = {};
    EIXOS.forEach(function (k) { var ks = Object.keys(subsDoEixo[k]); eixoMedia[k] = ks.length ? ks.reduce(function (a, key) { return a + media[key]; }, 0) / ks.length : null; });
    // âncoras
    var anc = [];
    ids.forEach(function (id) {
      var o = itens[id], v = A[id];
      if (!o || typeof v !== "number") return;
      if (o.f === "l" && o.v && o.v[v + 2] !== undefined) anc.push({ k: o.k, s: o.s || null, x: o.v[v + 2], se: o.s ? CFG.seEscadaSub : CFG.seEscadaEixo });
    });
    // fator de estilo
    var num = 0, den = 0, nA = 0;
    anc.forEach(function (a) {
      var base = a.s && media[a.k + "." + a.s] !== undefined ? media[a.k + "." + a.s] : eixoMedia[a.k];
      if (base === null || base === undefined) return;
      num += a.x * base; den += base * base; nA++;
    });
    var gam = 1;
    if (nA >= 3 && den >= CFG.denMin) {
      var amplo = nA >= CFG.ancorasAmplo, g0 = clamp(num / den, amplo ? CFG.gMinAmplo : CFG.gMin, amplo ? CFG.gMaxAmplo : CFG.gMax);
      gam = 1 + (den / (den + CFG.encolhe)) * (g0 - 1);
    }
    // posição por subtema: precisão = 1 / margem²
    var subs = {};
    Object.keys(media).forEach(function (key) { subs[key] = { p: 0, w: 0, n: qtd[key] }; var mg = media[key] * gam, se = Math.sqrt(Math.pow(mse[key] * gam, 2) + Math.pow(CFG.estilo * mg, 2)); subs[key].p += clamp(media[key] * gam, -100, 100) / (se * se); subs[key].w += 1 / (se * se); });
    anc.forEach(function (a) {
      var alvo = a.s ? [a.k + "." + a.s] : Object.keys(subsDoEixo[a.k]);
      if (!alvo.length) alvo = [a.k + ".-"]; // eixo sem nenhuma frase de concordância respondida: a escolha vira a posição do eixo
      alvo.forEach(function (key) { if (!subs[key]) subs[key] = { p: 0, w: 0, n: 0 }; subs[key].p += a.x / (a.se * a.se); subs[key].w += 1 / (a.se * a.se); subsDoEixo[a.k][key] = 1; });
    });
    var sub = {}, raw = {}, se = {}, s = {}, ci = {}, hw = {};
    Object.keys(subs).forEach(function (key) { sub[key] = { v: clamp(subs[key].p / subs[key].w, -100, 100), se: 1 / Math.sqrt(subs[key].w), n: subs[key].n }; });
    EIXOS.forEach(function (k) {
      var ks = Object.keys(subsDoEixo[k]).filter(function (key) { return sub[key]; });
      if (!ks.length) { raw[k] = 0; se[k] = 100; }
      else {
        raw[k] = ks.reduce(function (a, key) { return a + sub[key].v; }, 0) / ks.length;
        se[k] = Math.sqrt(ks.reduce(function (a, key) { return a + sub[key].se * sub[key].se; }, 0)) / ks.length;
      }
      s[k] = Math.round(raw[k]);
      var meia = Math.max(6, 1.28 * se[k]);
      ci[k] = [Math.round(clamp(raw[k] - meia, -100, 100)), Math.round(clamp(raw[k] + meia, -100, 100))];
      hw[k] = (ci[k][1] - ci[k][0]) / 2;
    });
    return { s: s, raw: raw, se: se, ci: ci, hw: hw, sub: sub, gam: gam, ancoras: nA };
  }
  return { calcular: calcular, CFG: CFG, EIXOS: EIXOS };
})();
