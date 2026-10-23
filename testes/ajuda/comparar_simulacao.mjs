// Simulação antes × depois de uma mudança no cálculo: node testes/ajuda/comparar_simulacao.mjs <pasta antes> <pasta depois>
// Cada pasta é uma cópia de public/. Roda a mesma simulação de testes/simulacao.js nas duas e mais os perfis de
// resposta uniforme e de meio-termo no eixo Democracia (docs/AUDITORIA-METODOLOGIA.md, seções 6.3 e 6.4).
import fs from "node:fs";
import { servidorEstatico, navegador } from "./ambiente.mjs";

const SIM = fs.readFileSync(new URL("../simulacao.js", import.meta.url), "utf8").replace(/^\/\/.*\n/, "").trim().replace(/;$/, "");
const MODOS = ["quick", "full", "deep"];
// respostas fixas: v por frase de concordância, e o que fazer nas escolhas e contrastes
const UNIFORMES = `((v,meio)=>{for(const id of st.base){const o=ITEMS[id];if(gated(o)&&!gateOK(id)){st.ans[id]='g';continue}st.ans[id]=escolha(o)?(meio?0:v):v}st.seen=st.bs.map((_,j)=>j);st.cur=seq().length;st.done=true;const r=compute(st.ans);return {top:r.ranked[0].n,P1:Math.round(r.P1*1000)/10,conf:r.conf,cons:r.cons}})`;
// perfil fixo nos eixos E, A, C, N e resposta fixa (meio-termo ou democrática) no eixo D
const PERFIL_D = `((alvo,dMeio)=>{for(const id of st.base){const o=ITEMS[id];if(gated(o)&&!gateOK(id)){st.ans[id]='g';continue}
  if(o.f==='l'){const t=(alvo[o.k]??0);let bi=0;o.v.forEach((x,i)=>{if(Math.abs(x-t)<Math.abs(o.v[bi]-t))bi=i});st.ans[id]=o.k==='D'&&dMeio?0:bi-2;continue}
  if(o.f==='c'){st.ans[id]=0;continue}
  if(o.k==='D'){st.ans[id]=dMeio?0:Math.max(-2,Math.min(2,Math.round(-1.2*o.d)));continue}
  const t=(alvo[o.k]??0);st.ans[id]=Math.max(-2,Math.min(2,Math.round(2*t/100*o.d)))}
  st.seen=st.bs.map((_,j)=>j);st.cur=seq().length;st.done=true;const r=compute(st.ans);return {top:r.ranked[0].n,P1:Math.round(r.P1*1000)/10,conf:r.conf,D:r.s.D}})`;
const PERFIS = { "Conservador-nacional": { E: 30, A: 50, C: 65, N: 60 }, "Esquerda": { E: -60, A: -10, C: -50, N: -20 }, "Centro": { E: 0, A: 0, C: 0, N: 0 }, "Liberal-conservador": { E: 45, A: 15, C: 40, N: 10 } };

async function rodar(raiz) {
  const s = await servidorEstatico(raiz), b = await navegador(), pg = await b.newPage(), erros = [];
  pg.on("pageerror", (e) => erros.push(String(e)));
  await pg.goto(s.url + "/index.html");
  const out = { sim: {}, uniformes: {}, democracia: {} };
  for (const g of ["A", "B"]) for (const m of MODOS) {
    await pg.evaluate(() => { let x = 12345; Math.random = () => { x = (x * 16807) % 2147483647; return x / 2147483647; }; });
    out.sim[`${g}_${m}`] = await pg.evaluate(`(${SIM})(${JSON.stringify({ mode: m, porCelula: 4, seed: g === "A" ? 2026 : 77, ger: g, escada: "otimista" })})`);
  }
  for (const m of MODOS) for (const [nome, v, meio] of [["tudo concordo", 1, true], ["tudo concordo totalmente", 2, true], ["tudo discordo", -1, true], ["tudo meio-termo", 0, true]]) {
    await pg.evaluate(`st=fresh('${m}')`); out.uniformes[`${m}|${nome}`] = await pg.evaluate(`${UNIFORMES}(${v},${meio})`);
  }
  for (const m of ["quick", "full"]) for (const [nome, p] of Object.entries(PERFIS)) for (const dMeio of [false, true]) {
    await pg.evaluate(`st=fresh('${m}')`); out.democracia[`${m}|${nome}|${dMeio ? "D meio-termo" : "D democrático"}`] = await pg.evaluate(`${PERFIL_D}(${JSON.stringify(p)},${dMeio})`);
  }
  await b.close(); await s.fechar();
  if (erros.length) console.log("erros na página:", erros.join(" | "));
  return out;
}
function resumo(r) {
  const linhas = {};
  for (const m of MODOS) {
    const rs = [...r.sim["A_" + m], ...r.sim["B_" + m]], n = rs.length;
    const pct = (f) => Math.round((rs.filter(f).length / n) * 1000) / 10;
    linhas[m] = { acerto: pct((x) => x.a.top === x.esperada), entreDuas: pct((x) => x.a.top === x.esperada || x.a.seg === x.esperada), reteste: pct((x) => x.a.top === x.b.top), confAlta: pct((x) => x.a.conf === "alta"), P1medio: Math.round((rs.reduce((s, x) => s + (x.a.P1 || 0), 0) / n) * 1000) / 1000 };
  }
  return linhas;
}
const [antes, depois] = process.argv.slice(2);
const A = await rodar(antes), D = await rodar(depois);
const ra = resumo(A), rd = resumo(D);
console.log("\n## Simulação (21 ideologias × 3 estilos × 4, dois geradores)\n\n| Modo | Acerto | Certa entre 2 | Reteste | Conf. alta | P1 médio |\n|---|---|---|---|---|---|");
for (const m of MODOS) console.log(`| ${m} | ${ra[m].acerto}% → ${rd[m].acerto}% | ${ra[m].entreDuas}% → ${rd[m].entreDuas}% | ${ra[m].reteste}% → ${rd[m].reteste}% | ${ra[m].confAlta}% → ${rd[m].confAlta}% | ${ra[m].P1medio} → ${rd[m].P1medio} |`);
console.log("\n## Respostas uniformes\n\n| Modo e padrão | Antes | Depois |\n|---|---|---|");
for (const k in A.uniformes) { const a = A.uniformes[k], d = D.uniformes[k]; console.log(`| ${k.replace("|", ", ")} | ${a.top} ${a.P1}%, conf. ${a.conf} | ${d.top} ${d.P1}%, conf. ${d.conf} |`); }
console.log("\n## Meio-termo no eixo Democracia\n\n| Modo, perfil e respostas em D | Antes | Depois |\n|---|---|---|");
for (const k in A.democracia) { const a = A.democracia[k], d = D.democracia[k]; console.log(`| ${k.replaceAll("|", ", ")} | ${a.top} ${a.P1}%, conf. ${a.conf} | ${d.top} ${d.P1}%, conf. ${d.conf} |`); }
// quem mudou de ideologia na simulação
const mud = {};
for (const k in A.sim) A.sim[k].forEach((x, i) => { const y = D.sim[k][i]; if (y && x.a.top !== y.a.top) { const c = `${x.a.top} → ${y.a.top}`; mud[c] = (mud[c] || 0) + 1; } });
console.log("\n## Mudanças de 1ª ideologia na simulação (" + Object.values(mud).reduce((a, b) => a + b, 0) + " de " + Object.values(A.sim).flat().length + ")\n");
Object.entries(mud).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([c, n]) => console.log(`- ${c}: ${n}`));
// acerto por ideologia (depois), pra ver onde estão os erros
const porIdeo = {};
for (const k in D.sim) D.sim[k].forEach((x) => { const e = (porIdeo[x.esperada] ||= { n: 0, ok: 0, antes: 0 }); e.n++; if (x.a.top === x.esperada) e.ok++; });
for (const k in A.sim) A.sim[k].forEach((x) => { const nome = { "Esquerda radical": "Extrema esquerda", "Direita radical": "Extrema direita" }[x.esperada] || x.esperada; if (porIdeo[nome] && (x.a.top === x.esperada)) porIdeo[nome].antes++; });
console.log("\n## Acerto por ideologia (todos os modos)\n\n| Ideologia | Antes | Depois |\n|---|---|---|");
Object.entries(porIdeo).forEach(([n, e]) => console.log(`| ${n} | ${Math.round((e.antes / e.n) * 100)}% | ${Math.round((e.ok / e.n) * 100)}% |`));
// números de calibração no formato de CALIB (public/js/telas/janelas.js), calculados com o cálculo "depois"
const calib = {};
for (const [m, fr] of [["quick", "cerca de 65"], ["full", "cerca de 135"], ["deep", "cerca de 210"]]) {
  const rs = [...D.sim["A_" + m], ...D.sim["B_" + m]], n = rs.length, r3 = (x) => Math.round(x * 1000) / 1000;
  const conf = {};
  for (const k of ["alta", "media", "baixa"]) { const g = rs.filter((x) => x.a.conf === k); if (g.length) conf[k] = { parte: r3(g.length / n), acerto: r3(g.filter((x) => x.a.top === x.esperada).length / g.length) }; }
  calib[m] = { frases: fr, acerto: r3(rs.filter((x) => x.a.top === x.esperada).length / n), top2: r3(rs.filter((x) => x.a.top === x.esperada || x.a.seg === x.esperada).length / n), reteste: r3(rs.filter((x) => x.a.top === x.b.top).length / n), conf };
}
console.log("\nCALIB=" + JSON.stringify(calib));
