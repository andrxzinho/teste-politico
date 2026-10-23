// Gera as listas de frases usadas pelas funções (servidor/comum.mjs) e pelo painel (public/painel.js)
// a partir do DATA de public/js/dados/frases.js. Rode da raiz do projeto sempre que mudar as frases:
//   node ferramentas/gerar_listas.mjs
import fs from "node:fs";
const idx = ["public/js/dados/frases.js", "public/js/dados/ideologias.js", "public/js/dados/candidatos.js"].map((f) => fs.readFileSync(f, "utf8")).join("\n");
const DATA = JSON.parse(idx.match(/^const DATA = (\{.*?\});\n/ms)[1]);
const AXK6 = ["E","A","C","N","D","S"];
const ITEMS = [...AXK6.flatMap(k => DATA.Q[k].map(o => ({ ...o, k }))), ...DATA.POOL, ...(DATA.LAD || []), ...(DATA.EXTRA || [])];
const scored = o => !o.nm && !(o.k !== "D" && o.m.some(g => g !== "eco"));
const escolha = o => o.f === "l" || o.f === "c";
const IDS = ITEMS.map(o => o.id);
const META = Object.fromEntries(ITEMS.map(o => [o.id, [o.k, o.d]]));
const NAO = ITEMS.filter(o => !scored(o)).map(o => o.id);
let c = fs.readFileSync("servidor/comum.mjs", "utf8");
c = c.replace(/export const IDS = \[.*?\];/s, `export const IDS = ${JSON.stringify(IDS)};`)
     .replace(/export const META = \{.*?\};/s, `export const META = ${JSON.stringify(META)};`);
if (!c.includes("export const NAO_PONTUA")) c = c.replace(/(export const META = .*?;\n)/s, `$1// frases que não entram na média do eixo (marcadores de extremos fora do eixo Democracia e temas avulsos)\nexport const NAO_PONTUA = [];\n`);
c = c.replace(/export const NAO_PONTUA = \[.*?\];/s, `export const NAO_PONTUA = ${JSON.stringify(NAO)};`);
const LAD = Object.fromEntries((DATA.LAD || []).map((o) => [o.id, [o.k, o.v]]));
if (!c.includes("export const ESCADAS")) c = c.replace(/(export const NAO_PONTUA = .*?;\n)/s, `$1// perguntas de escolha forçada: eixo e posição de cada opção (usadas na correção do estilo de resposta)\nexport const ESCADAS = {};\n`);
c = c.replace(/export const ESCADAS = \{.*?\};/s, `export const ESCADAS = ${JSON.stringify(LAD)};`);
fs.writeFileSync("servidor/comum.mjs", c);
// motor do servidor: o mesmo arquivo do site, com as frases no formato que ele usa
const ITENS = Object.fromEntries(ITEMS.map((o) => [o.id, { k: o.k, s: o.s || null, d: o.d, f: o.f, sc: scored(o) && !escolha(o), ...(o.f === "l" ? { v: o.v } : {}), ...(o.f === "c" ? { va: o.va, vb: o.vb } : {}), lv: o.lv || 2 }]));
const motor = fs.readFileSync("public/js/nucleo/motor.js", "utf8");
fs.writeFileSync("servidor/motor.mjs", "// GERADO por ferramentas/gerar_listas.mjs a partir de public/js/nucleo/motor.js. Não edite aqui.\n" + motor + `\nexport const ITENS = ${JSON.stringify(ITENS)};\nexport default Motor;\n`);
let p = fs.readFileSync("public/js/painel.js", "utf8");
const CAN = Object.fromEntries(ITEMS.map(o => [o.id, { t: o.t, k: o.k, f: o.f }]));
p = p.replace(/const CANON = \{.*?\};\n/s, `const CANON = ${JSON.stringify(CAN)};\n`);
fs.writeFileSync("public/js/painel.js", p);
console.log(`${IDS.length} frases (${NAO.length} fora da média) | motor do servidor gerado`);
