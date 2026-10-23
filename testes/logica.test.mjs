// Lógica: a mesma simulação, com sorteio fixado, precisa dar exatamente os resultados gravados em
// testes/referencia/logica.json. Mudou a lógica de propósito? Rode `npm run test:atualizar` e revise a diferença.
import fs from "node:fs";
import { servidorEstatico, navegador, verificador, executandoDireto } from "./ajuda/ambiente.mjs";

const SIM = fs.readFileSync(new URL("./simulacao.js", import.meta.url), "utf8").replace(/^\/\/.*\n/, "");
const REF = new URL("./referencia/logica.json", import.meta.url);

export async function testarLogica({ atualizar = process.argv.includes("--atualizar") } = {}) {
  const s = await servidorEstatico(process.env.RAIZ_SITE || "public"), b = await navegador(), pg = await b.newPage(), erros = [];
  pg.on("pageerror", (e) => erros.push(String(e)));
  await pg.goto(s.url + "/index.html");
  const res = {};
  for (const g of ["A", "B"]) for (const m of ["quick", "full", "deep"]) {
    await pg.evaluate(() => { let x = 12345; Math.random = () => { x = (x * 16807) % 2147483647; return x / 2147483647; }; });
    res[`${g}_${m}`] = await pg.evaluate(`(${SIM.trim().replace(/;$/, "")})(${JSON.stringify({ mode: m, porCelula: 2, seed: g === "A" ? 2026 : 77, ger: g, escada: "otimista" })})`);
  }
  await b.close(); await s.fechar();
  const v = verificador("Lógica");
  v.confere(!erros.length, "erros na página: " + erros.join(" | "));
  for (const m of ["quick", "full", "deep"]) {
    const rs = [...res["A_" + m], ...res["B_" + m]], acerto = rs.filter((r) => r.a.top === r.esperada).length / rs.length;
    v.confere(acerto >= 0.85, `acerto do modo ${m} caiu para ${(acerto * 100).toFixed(0)}%`);
  }
  if (atualizar || !fs.existsSync(REF)) { fs.writeFileSync(REF, JSON.stringify(res)); console.log("  referência gravada em testes/referencia/logica.json"); return v.fim(); }
  const ref = JSON.parse(fs.readFileSync(REF, "utf8"));
  // números comparados com 12 algarismos significativos: versões diferentes do Chromium podem mudar o último dígito
  // de Math.exp e Math.pow (diferenças da ordem de 1e-16), o que não é mudança de lógica
  const norm = (o) => JSON.stringify(o, (_, v) => (typeof v === "number" ? Number(v.toPrecision(12)) : v));
  let total = 0, dif = 0;
  for (const k in ref) ref[k].forEach((x, i) => { for (const r of ["a", "b"]) { total++; if (norm(x[r]) !== norm(res[k]?.[i]?.[r])) dif++; } });
  v.confere(dif === 0, `${dif} de ${total} resultados diferentes da referência`);
  return v.fim();
}
if (executandoDireto(import.meta.url)) process.exitCode = (await testarLogica()) ? 1 : 0;
