// Números do site: o que as páginas afirmam (perguntas por modo, ideologias, acerto das simulações) precisa bater com o
// código. Calcula a partir dos dados reais (núcleo carregado num vm, sem navegador) e procura os números nos textos.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { verificador, executandoDireto } from "./ajuda/ambiente.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ler = (f) => fs.readFileSync(path.join(RAIZ, f), "utf8");

function carregarNucleo() {
  const nada = () => new Proxy(function () {}, { get: (t, k) => (k === Symbol.toPrimitive ? () => "" : k === "classList" ? { toggle() {}, add() {}, remove() {}, contains() { return false; } } : k === "children" ? [] : k === "style" || k === "dataset" ? {} : nada()), set: () => true, apply: () => nada() });
  const c = {
    console, Math, Date, JSON, Object, Array, Set, Map, Promise, Number, String, Boolean, RegExp, Error, Symbol, Proxy, Reflect, parseInt, parseFloat, isNaN, isFinite,
    location: { protocol: "file:", hostname: "", href: "file:///" }, localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    addEventListener() {}, getComputedStyle: () => ({ getPropertyValue: () => "" }), fetch: () => Promise.reject(new Error("offline")), window: {}, navigator: {},
    document: { getElementById: () => nada(), querySelector: () => null, querySelectorAll: () => [], addEventListener() {}, createElement: () => nada(), documentElement: {}, body: null },
    crypto: { randomUUID: () => "0", getRandomValues: (a) => a },
  };
  c.globalThis = c; vm.createContext(c);
  const arquivos = ["nucleo/motor.js", "dados/frases.js", "dados/ideologias.js", "dados/candidatos.js", "nucleo/base.js", "nucleo/estado.js", "nucleo/calculo.js"];
  vm.runInContext(arquivos.map((f) => ler("public/js/" + f)).join("\n;\n") + ";globalThis.__T={order,ITEMS,gated,IDEO,SUBS};", c);
  return c.__T;
}

export async function testarNumeros() {
  const v = verificador("Números do site"), T = carregarNucleo();
  const met = ler("public/metodologia.html"), faq = ler("public/perguntas-frequentes/index.html"), ini = ler("public/index.html"), readme = ler("README.md");

  // perguntas por modo: mínimo (sem as frases dos extremos) e máximo (com todas), sem contar o desempate
  const faixa = {};
  for (const m of ["quick", "full", "deep"]) { const L = T.order(m).L, g = L.filter((id) => T.gated(T.ITEMS[id])).length; faixa[m] = [L.length - g, L.length]; }
  for (const [m, nome] of [["quick", "Essencial"], ["full", "Padrão"], ["deep", "Aprofundado"]]) {
    const [a, b] = faixa[m], txt = `de ${a} a ${b}`;
    v.confere(met.includes(txt), `metodologia deveria dizer "${txt}" perguntas no ${nome}`);
    v.confere(faq.includes(txt), `perguntas frequentes deveriam dizer "${txt}" no ${nome}`);
    // "cerca de N" na página inicial e no README: N precisa estar dentro da faixa real
    const cerca = { quick: 65, full: 135, deep: 210 }[m];
    v.confere(cerca >= a && cerca <= b, `"cerca de ${cerca}" fora da faixa real do ${nome} (${a} a ${b})`);
    v.confere(ini.includes(`Cerca de ${cerca} perguntas`), `página inicial deveria dizer "Cerca de ${cerca} perguntas" no ${nome}`);
  }
  v.confere(readme.includes("cerca de 65, 135 e 210"), "README deveria dizer cerca de 65, 135 e 210 frases");

  // 21 ideologias e 6 eixos, e só Instituições sem subtemas
  v.confere(T.IDEO.length === 21, `deveria haver 21 ideologias (há ${T.IDEO.length})`);
  const semSub = Object.keys(T.SUBS).filter((k) => !Object.keys(T.SUBS[k]).length);
  v.confere(semSub.join() === "S", `só Instituições deveria ficar sem subtemas (sem subtemas: ${semSub.join()})`);

  // acerto das simulações: a tabela da metodologia mostra os números de CALIB, arredondados
  const CALIB = JSON.parse(ler("public/js/telas/janelas.js").match(/const CALIB=(\{.*?\});/)[1]);
  const de100 = (x) => (x >= 0.995 ? "mais de 99 de 100" : `${Math.round(x * 100)} de 100`);
  for (const [m, nome] of [["quick", "Essencial"], ["full", "Padrão"], ["deep", "Aprofundado"]]) {
    const c = CALIB[m], linha = `<tr><td>${nome}</td><td>${de100(c.acerto)}</td><td>${de100(c.top2)}</td><td>${de100(c.reteste)}</td></tr>`;
    v.confere(met.includes(linha), `tabela de simulações da metodologia não bate com CALIB no ${nome}: esperado ${linha}`);
  }
  // o Aprofundado não pode ser anunciado como "o mais preciso" enquanto não acertar mais que o Padrão
  if (CALIB.deep.acerto <= CALIB.full.acerto) v.confere(!/mais preciso/i.test(ini), 'a página inicial não deveria chamar o Aprofundado de "o mais preciso"');
  return v.fim();
}
if (executandoDireto(import.meta.url)) process.exitCode = (await testarNumeros()) ? 1 : 0;
