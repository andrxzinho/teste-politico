// Perfis sintéticos: confere propriedades que as próprias regras do código declaram (probabilidades somam 1,
// determinismo, filtro dos extremos, simetria do cálculo dos eixos, avisos de estilo, efeito de respostas faltando).
// Isto NÃO mede validade: um perfil artificial cair onde se espera só mostra que o cálculo segue as regras escritas.
// Roda sem navegador: carrega os scripts do núcleo num vm, com um DOM mínimo de mentira.
// Propriedades que hoje falham por decisão de projeto ou defeito conhecido ficam como PENDENTE (não contam como falha)
// e estão explicadas em docs/AUDITORIA-METODOLOGIA.md. Se uma pendente passar a valer, o teste avisa.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { verificador, executandoDireto } from "./ajuda/ambiente.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", process.env.RAIZ_SITE || "public", "js");
const ARQUIVOS = ["nucleo/motor.js", "dados/frases.js", "dados/ideologias.js", "dados/candidatos.js", "nucleo/base.js", "nucleo/estado.js", "nucleo/calculo.js"];

// carrega o núcleo num contexto novo; semente fixa o Math.random (usado na ordem dos pares de simetria e na inversão das opções)
function carregar(semente = 1) {
  const nada = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : k === "classList" ? { toggle() {}, add() {}, remove() {}, contains() { return false; } } : k === "children" ? [] : k === "style" || k === "dataset" ? {} : nada()), set: () => true, apply: () => nada() });
  const guardado = {};
  const M = {};
  for (const k of Object.getOwnPropertyNames(Math)) M[k] = Math[k];
  let x = semente; M.random = () => { x = (x * 16807) % 2147483647; return x / 2147483647; };
  const c = {
    console, Math: M, Date, JSON, Object, Array, Set, Map, Promise, Number, String, Boolean, RegExp, Error, Symbol, Proxy, Reflect, parseInt, parseFloat, isNaN, isFinite, Infinity, NaN, undefined,
    location: { protocol: "file:", hostname: "", href: "file:///" },
    localStorage: { getItem: (k) => guardado[k] ?? null, setItem: (k, v) => { guardado[k] = String(v); }, removeItem: (k) => { delete guardado[k]; } },
    addEventListener() {}, getComputedStyle: () => ({ getPropertyValue: () => "" }), fetch: () => Promise.reject(new Error("offline")), window: {}, navigator: {},
    document: { getElementById: () => nada(), querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, createElement: () => nada(), documentElement: {}, body: null },
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000000", getRandomValues: (a) => a },
  };
  c.globalThis = c;
  vm.createContext(c);
  const fonte = ARQUIVOS.map((f) => fs.readFileSync(path.join(RAIZ, f), "utf8")).join("\n;\n")
    + "\n;globalThis.__T={get st(){return st},set st(v){st=v},ITEMS,PAIRS,IDEO,EXTP,GATE,INSUFICIENTE,Motor,compute,fresh,gated,gateOK,escolha};";
  vm.runInContext(fonte, c, { filename: "nucleo-do-site.js" });
  return c.__T;
}

const lim = (v, a, b) => Math.max(a, Math.min(b, v));
// gerador: alvo por eixo (ou "E.imp" etc.); concordância = arredonda(ganho × 2 × alvo/100 × direção), como o gerador A da simulação
function gerador(alvo, { ganho = 1, marcas = -2 } = {}) {
  return (o) => {
    const t = o.s && alvo[o.k + "." + o.s] !== undefined ? alvo[o.k + "." + o.s] : alvo[o.k] ?? 0;
    if (o.f === "l") { let i = 0; o.v.forEach((x, j) => { if (Math.abs(x - t) < Math.abs(o.v[i] - t)) i = j; }); return i - 2; }
    if (o.f === "c") { const da = Math.abs(t - o.va), db = Math.abs(t - o.vb); return Math.abs(da - db) < 6 ? 0 : da < db ? -2 : 2; }
    if (o.m.some((g) => g !== "eco") && o.k !== "D") return typeof marcas === "function" ? marcas(o) : marcas;
    return lim(Math.round(ganho * 2 * (t / 100) * o.d), -2, 2);
  };
}
// responde o teste na ordem em que aparece, aplicando o filtro dos extremos como o site faz (frase não liberada = "g")
function responder(T, modo, resposta, { tempo = 4000 } = {}) {
  T.st = T.fresh(modo);
  const st = T.st;
  st.seen = st.bs.map((_, j) => j);
  st.base.forEach((id, i) => {
    const o = T.ITEMS[id];
    if (T.gated(o) && !T.gateOK(id)) { st.ans[id] = "g"; return; }
    const v = resposta(o, id, i);
    if (v !== undefined) st.ans[id] = v;
    st.tm[id] = tempo;
  });
  return T.compute(st.ans);
}
const numeros = (r) => [...Object.values(r.s), ...Object.values(r.se), ...Object.values(r.ci).flat(), ...Object.values(r.ext), r.cons, r.gam, r.P1, r.hwAvg, ...r.ranked.map((o) => o.prob)];

const PERFIS_SINT = {
  moderado: gerador({ E: -30, A: 0, C: -20, N: -15, D: -65, S: -10 }),
  radical: gerador({ E: -75, A: 20, C: -60, N: -10, D: 40, S: 50 }),
  extremo: gerador({ E: 0, A: 90, C: 60, N: 95, D: 85, S: 60 }, { marcas: (o) => (o.m.includes("fas") ? 2 : -2) }),
  centrista: gerador({ E: 0, A: 0, C: 0, N: 0, D: -65, S: 0 }),
  misto: gerador({ E: -60, A: -50, C: 0, N: 60, D: -65, S: 0, "C.fam": 50, "C.div": -50 }),
  intervencionistaConservador: gerador({ E: -50, A: 35, C: 50, N: 30, D: -65, S: 0 }),
  liberalProgressista: gerador({ E: 50, A: -40, C: -50, N: -30, D: -65, S: 0 }),
};

export async function testarPerfis() {
  const v = verificador("Perfis sintéticos");
  let pendentes = 0;
  const pendente = (cond, msg, motivo) => {
    if (cond) console.log(`  AVISO: a propriedade pendente "${msg}" passou a valer; pode virar verificação normal.`);
    else { pendentes++; console.log(`  PENDENTE: ${msg} (${motivo})`); }
  };
  const T = carregar(1);
  const modos = ["quick", "full", "deep"];

  // 1. propriedades gerais, em todos os perfis e modos
  const resultados = {};
  for (const m of modos) for (const [nome, f] of Object.entries(PERFIS_SINT)) {
    const r = responder(T, m, f);
    resultados[m + ":" + nome] = r;
    const tag = `${nome}/${m}`;
    v.confere(numeros(r).every(Number.isFinite), `${tag}: algum número não é finito (NaN/Infinity)`);
    const soma = r.ranked.reduce((a, o) => a + o.prob, 0);
    v.confere(Math.abs(soma - 1) < 1e-9, `${tag}: probabilidades somam ${soma}, não 1`);
    v.confere(r.ranked.every((o, i) => o.prob >= 0 && o.prob <= 1 && (i === 0 || r.ranked[i - 1].prob >= o.prob)), `${tag}: probabilidades fora de [0,1] ou fora de ordem`);
    v.confere(Object.keys(r.s).every((k) => r.s[k] >= -100 && r.s[k] <= 100 && r.ci[k][0] <= r.s[k] && r.s[k] <= r.ci[k][1]), `${tag}: posição fora de [-100,100] ou fora da própria faixa`);
    v.confere(r.ranked.every((o) => !o.g || r.ext[o.g] >= T.GATE), `${tag}: ideologia com filtro (extremo/ecologista) disputou sem passar do GATE`);
    v.confere(r.ranked.every((o) => !o.g || o.g === "eco" || r.extAsked[o.g]), `${tag}: extremo disputou sem nenhuma frase dele respondida`);
    // determinismo: mesma entrada, mesma saída; e contexto novo com outro sorteio dá a mesma posição e as mesmas probabilidades
    const de = T.compute(T.st.ans);
    v.confere(JSON.stringify(de) === JSON.stringify(r), `${tag}: compute não é determinístico com a mesma entrada`);
    const T2 = carregar(987654);
    T2.st = T2.fresh(m); T2.st.ans = { ...T.st.ans }; T2.st.tm = { ...T.st.tm };
    const r2 = T2.compute(T2.st.ans);
    v.confere(JSON.stringify(r2.s) === JSON.stringify(r.s) && JSON.stringify(r2.ranked.map((o) => [o.n, o.prob])) === JSON.stringify(r.ranked.map((o) => [o.n, o.prob])), `${tag}: posição ou probabilidades mudam com outro sorteio`);
  }

  // 2. extremos: só aparecem se passarem do GATE; quem rejeita as frases do extremo nunca recebe o rótulo
  for (const m of modos) {
    const r = resultados[m + ":extremo"];
    v.confere(r.ext.fas >= T.GATE && r.ranked.some((o) => o.n === "Fascista"), `extremo/${m}: quem concorda totalmente com as frases do fascismo e está no canto dos eixos devia passar do filtro (ext.fas=${r.ext.fas})`);
    // rejeita todas as frases marcadas como fascismo, inclusive as do eixo Democracia (que também contam como marcadoras)
    const g = gerador({ E: 0, A: 90, C: 60, N: 95, D: 85, S: 60 }, { marcas: -2 });
    const rej = responder(T, m, (o) => (o.m.includes("fas") ? -2 : g(o)));
    v.confere(rej.ext.fas < T.GATE && !rej.ranked.some((o) => o.n === "Fascista"), `extremo/${m}: rejeitando as frases do fascismo, Fascista não podia disputar (ext.fas=${rej.ext.fas})`);
    for (const nome of ["moderado", "centrista", "liberalProgressista"]) {
      const q = resultados[m + ":" + nome];
      v.confere(!q.ranked.some((o) => o.g && o.g !== "eco"), `${nome}/${m}: extremo entrou na disputa`);
    }
  }

  // 3. simetria do cálculo dos eixos: espelhar as respostas de concordância (sem escolhas nem contrastes) espelha a posição
  for (const m of modos) for (const nome of ["moderado", "radical", "misto", "liberalProgressista"]) {
    const f = PERFIS_SINT[nome];
    const base = (o) => (o.f === "l" || o.f === "c" ? "x" : f(o));
    responder(T, m, base);
    const A = { ...T.st.ans }, ids = T.st.base, B = {};
    for (const id in A) B[id] = typeof A[id] === "number" ? -A[id] : A[id];
    const a = T.Motor.calcular(A, T.ITEMS, ids, {}), b = T.Motor.calcular(B, T.ITEMS, ids, {});
    v.confere(Object.keys(a.raw).every((k) => Math.abs(a.raw[k] + b.raw[k]) < 1e-9 && Math.abs(a.se[k] - b.se[k]) < 1e-9), `${nome}/${m}: espelhar as respostas não espelhou a posição nos eixos`);
  }

  // 4. combinações que cruzam os eixos: o sinal de cada eixo segue o lado das respostas (regra concordância × direção)
  for (const m of modos) {
    const ic = resultados[m + ":intervencionistaConservador"], lp = resultados[m + ":liberalProgressista"], mi = resultados[m + ":misto"];
    v.confere(ic.s.E < 0 && ic.s.C > 0, `intervencionista+conservador/${m}: esperado E<0 e C>0, veio E=${ic.s.E} C=${ic.s.C}`);
    v.confere(lp.s.E > 0 && lp.s.C < 0 && lp.s.A < 0, `liberal+progressista/${m}: esperado E>0, C<0, A<0, veio ${JSON.stringify(lp.s)}`);
    v.confere(mi.sub["C.fam"].v > 0 && mi.sub["C.div"].v < 0, `misto/${m}: subtemas de costumes em lados opostos deviam aparecer separados`);
    // moderado x radical do mesmo lado: o radical fica mais longe do centro na economia e nos costumes
    const md = resultados[m + ":moderado"], rd = resultados[m + ":radical"];
    v.confere(rd.s.E < md.s.E && rd.s.C < md.s.C, `radical/${m}: devia ficar mais à esquerda que o moderado em E e C`);
  }

  // 5. respostas uniformes
  for (const m of modos) {
    const tudo = (val) => (o) => (o.f === "a" || o.f === "d" ? val : 0); // escolhas e contrastes na opção do meio
    const conc = responder(T, m, tudo(1)), disc = responder(T, m, tudo(-1)), meio = responder(T, m, () => 0);
    v.confere(conc.flat || conc.acq, `tudo "concordo"/${m}: devia gerar aviso de estilo (sequência igual ou concordância automática)`);
    v.confere(conc.cons < 70, `tudo "concordo"/${m}: consistência devia ficar abaixo de 70 (veio ${conc.cons})`);
    v.confere(conc.conf !== "alta", `tudo "concordo"/${m}: confiança não podia ser alta`);
    v.confere(disc.flat, `tudo "discordo"/${m}: devia gerar aviso de respostas sempre iguais`);
    // discordar de tudo, qualquer que seja o lado da frase, é não diferenciação: a confiança não pode ser alta
    v.confere(disc.conf !== "alta", `tudo "discordo"/${m}: confiança não podia ser alta (veio ${disc.conf})`);
    // no Essencial só 3 pares de frases opostas podem ser comparados; discordar de tudo quase não forma contradições
    (m === "quick" ? pendente : v.confere)(disc.cons < 70, `tudo "discordo"/${m}: consistência < 70 (veio ${disc.cons})`,
      "discordar de tudo quase não forma pares contraditórios; só a sequência igual desconta 15 pontos");
    v.confere(meio.flat, `tudo "meio-termo"/${m}: devia gerar aviso de respostas sempre iguais`);
    v.confere(meio.conf === "baixa", `tudo "meio-termo"/${m}: confiança devia ser baixa (veio ${meio.conf}, Centrista ${Math.round(meio.ranked[0].prob * 100)}%)`);
  }

  // 6. sem opinião, incompleto e respostas faltando
  for (const m of modos) {
    const nada = responder(T, m, () => "x");
    v.confere(nada.respondeu < T.INSUFICIENTE && nada.conf === "baixa", `tudo "não tenho opinião"/${m}: devia cair em respostas insuficientes com confiança baixa`);
    const p0 = nada.ranked[0].prob;
    v.confere(nada.ranked.every((o) => Math.abs(o.prob - p0) < 1e-12), `tudo "não tenho opinião"/${m}: sem dados, as ideologias deviam empatar`);
    v.confere(nada.two, `tudo "não tenho opinião"/${m}: empate devia mostrar duas ideologias`);
    // incompleto: só 20% das frases com opinião, o resto "não tenho opinião"
    const f = PERFIS_SINT.moderado, total = T.fresh(m).base.length;
    const inc = responder(T, m, (o, id, i) => (i < Math.ceil(total * 0.2) ? f(o) : "x"));
    const comp = resultados[m + ":moderado"];
    v.confere(inc.conf === "baixa", `incompleto 20%/${m}: confiança devia ser baixa (veio ${inc.conf})`);
    v.confere(inc.hwAvg > comp.hwAvg, `incompleto 20%/${m}: faixas deviam ser mais largas que no teste completo (${inc.hwAvg} x ${comp.hwAvg})`);
    v.confere(numeros(inc).every(Number.isFinite), `incompleto 20%/${m}: número não finito`);
    // metade sem opinião: regra declarada "pular metade ou mais dá confiança baixa"
    // exatamente metade das frases perguntadas com "não tenho opinião"
    responder(T, m, f);
    const perg = T.st.base.filter((id) => T.st.ans[id] !== "g" && T.st.ans[id] !== undefined);
    if (perg.length % 2) delete T.st.ans[perg.pop()];
    perg.forEach((id, i) => { if (i % 2) T.st.ans[id] = "x"; });
    const metade = T.compute(T.st.ans);
    v.confere(metade.respondeu === 0.5, `metade "não tenho opinião"/${m}: montagem do caso devia dar respondeu = 0,5 (deu ${metade.respondeu})`);
    v.confere(metade.conf === "baixa", `metade "não tenho opinião"/${m}: pular metade ou mais dá confiança baixa (veio ${metade.conf}, respondeu ${metade.respondeu.toFixed(3)})`);
  }

  // 7. contraditório: concordar totalmente com as duas frases de cada par oposto reduz a consistência
  for (const m of modos) {
    const f = PERFIS_SINT.moderado, pares = new Set(T.PAIRS.filter((p) => p.t === "contra" || p.t === "espelho").flatMap((p) => [p.a, p.b]));
    const r = responder(T, m, (o, id) => (pares.has(id) ? 2 : f(o))), base = resultados[m + ":moderado"];
    v.confere(r.inc.length > 0 && r.cons <= Math.max(0, 100 - 12 * r.inc.length) && r.cons < base.cons, `contraditório/${m}: pares contraditórios deviam descontar 12 pontos cada (inc=${r.inc.length}, cons ${base.cons}→${r.cons})`);
    v.confere(r.conf !== "alta" || r.inc.length < 3, `contraditório/${m}: com ${r.inc.length} contradições a confiança não podia ser alta`);
    // simetria partidária: julgar diferente o mesmo caso conforme o lado gera o aviso
    const s = responder(T, m, (o, id) => (id === "Z1" ? 2 : id === "Z2" ? -2 : id === "A25" ? 2 : id === "A26" ? -2 : f(o)));
    const vistos = T.PAIRS.filter((p) => p.t === "simetria" && typeof T.st.ans[p.a] === "number" && typeof T.st.ans[p.b] === "number").length;
    v.confere(s.sym.length === vistos, `simetria/${m}: respostas opostas no mesmo caso com lados trocados deviam ser apontadas (${s.sym.length} de ${vistos})`);
  }

  // 8. valores extremos: todas as respostas no máximo pra um lado e entradas fora da escala não estouram os limites
  for (const m of modos) {
    for (const lado of [-1, 1]) {
      const r = responder(T, m, (o) => (o.f === "l" ? 2 * lado : o.f === "c" ? (Math.sign(o.vb - o.va) === lado ? 2 : -2) : 2 * lado * o.d));
      v.confere(numeros(r).every(Number.isFinite) && Object.values(r.s).every((x) => Math.abs(x) <= 100), `tudo no polo ${lado}/${m}: número inválido ou fora de [-100,100]`);
      v.confere(r.ci.E[0] >= -100 && r.ci.E[1] <= 100, `tudo no polo ${lado}/${m}: faixa fora de [-100,100]`);
    }
    const fora = responder(T, m, (o) => (o.f === "a" || o.f === "d" ? 7 : undefined));
    v.confere(numeros(fora).every(Number.isFinite) && Object.values(fora.s).every((x) => Math.abs(x) <= 100), `entrada fora da escala/${m}: o cálculo devia limitar a posição a [-100,100]`);
  }

  console.log(`  ${pendentes} propriedade(s) pendente(s), documentadas em docs/AUDITORIA-METODOLOGIA.md`);
  return v.fim();
}
if (executandoDireto(import.meta.url)) process.exitCode = (await testarPerfis()) ? 1 : 0;
