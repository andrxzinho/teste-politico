// Acessibilidade: axe-core (regras WCAG 2.1 A e AA) nas telas principais, nos dois temas.
import fs from "node:fs";
import { createRequire } from "node:module";
import { servidorEstatico, navegador, verificador, RESPONDER, executandoDireto } from "./ajuda/ambiente.mjs";
const AXE = fs.readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"), "utf8");

export async function testarAcessibilidade({ detalhar = true } = {}) {
  const s = await servidorEstatico(), b = await navegador(), v = verificador("Acessibilidade");
  const telas = [
    ["início", "/", null], ["consentimento", "/", "show('consent')"],
    ["pergunta", "/", "st=fresh('full');st.seen=st.bs.map((_,j)=>j);st.cur=5;show('quiz');render()"],
    ["resultado", "/", `st=fresh('full');${RESPONDER}(-1);document.querySelectorAll('#results details').forEach(d=>d.open=true)`],
    ["glossário aberto", "/", "st=fresh('full');st.seen=st.bs.map((_,j)=>j);st.base.splice(0,0,'D16');st.cur=0;show('quiz');render();document.querySelector('#stmt .termo').click()"],
    ["corrigir respostas", "/", `st=fresh('full');${RESPONDER}(-1);save();results();abrirCorrecao();document.querySelectorAll('.ed-frase')[0].click()`],
    ["ideologia", "/ideologias/social-democrata/", null], ["lista", "/ideologias/", null],
    ["perguntas frequentes", "/perguntas-frequentes/", "document.querySelectorAll('details').forEach(d=>d.open=true)"], ["metodologia", "/metodologia.html", "document.querySelectorAll('details').forEach(d=>d.open=true)"],
  ];
  for (const tema of ["light", "dark"]) for (const [nome, url, js] of telas) {
    const pg = await b.newPage({ viewport: { width: 390, height: 844 }, colorScheme: tema, reducedMotion: "reduce" }); // sem animações: o contraste é medido nas cores finais
    await pg.goto(s.url + url); await pg.waitForTimeout(250);
    if (js) { await pg.evaluate(js); await pg.waitForTimeout(350); }
    await pg.addScriptTag({ content: AXE });
    const r = await pg.evaluate(async () => (await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } })).violations.map((x) => ({ id: x.id, impacto: x.impact, n: x.nodes.length, ex: x.nodes[0].target.join(" ") + " | " + (x.nodes[0].failureSummary || "").split("\n")[1] })));
    for (const x of r) if (detalhar) console.log(`  ${tema} ${nome}: ${x.id} (${x.impacto}, ${x.n}x) ${x.ex}`.slice(0, 230));
    v.confere(!r.length, `${tema} ${nome}: ${r.length} problema(s) de acessibilidade`);
    await pg.close();
  }
  await b.close(); await s.fechar();
  return v.fim();
}
if (executandoDireto(import.meta.url)) process.exitCode = (await testarAcessibilidade()) ? 1 : 0;
