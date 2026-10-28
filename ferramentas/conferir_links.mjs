// Abre cada link dos livros (public/js/dados/leituras.js): o link informativo e o da loja.
// Falha (código de saída 1) só quando um link some de verdade: 404, 410 ou endereço que não existe mais.
// Lojas e a Wikipédia às vezes recusam robôs (403, 429, 503): isso aparece como aviso, sem falhar.
// Rode da raiz do projeto: npm run links (roda também uma vez por mês no GitHub, em .github/workflows/links.yml)
import fs from "node:fs";
import vm from "node:vm";

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("public/js/dados/leituras.js", "utf8") + ";globalThis.L=LEITURAS;", ctx);
const UA = "TestePolitico/1.0 (+https://testepolitico.vercel.app; conferência mensal de links)";
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// cada endereço uma vez só, com as obras que o usam
const links = new Map();
for (const [ideo, v] of Object.entries(ctx.L)) for (const [t, a, , , x] of [...v.favor, ...v.contra]) {
  for (const u of [x?.link, x?.loja].filter(Boolean)) {
    if (!links.has(u)) links.set(u, new Set());
    links.get(u).add(`${t} (${a}), em ${ideo}`);
  }
}

async function abrir(u) {
  let ultimo = "";
  for (let t = 0; t < 3; t++) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA, Accept: "text/html" }, redirect: "follow", signal: AbortSignal.timeout(30000) });
      await r.body?.cancel();
      if (r.ok || r.status === 404 || r.status === 410) return r.status;
      ultimo = r.status;
    } catch (e) { ultimo = e.cause?.code || e.name; }
    await espera(5000 * (t + 1));
  }
  return ultimo;
}

const quebrados = [], avisos = [];
for (const [u, obras] of links) {
  const c = await abrir(u);
  if (c === 404 || c === 410 || c === "ENOTFOUND") quebrados.push([u, c, obras]);
  else if (c !== 200 && !(typeof c === "number" && c < 400)) avisos.push([u, c, obras]);
  await espera(1000);
}
console.log(`${links.size} links conferidos: ${quebrados.length} quebrados, ${avisos.length} sem resposta clara`);
for (const [u, c, obras] of avisos) console.log(`  AVISO (${c}): ${u}\n    ${[...obras].join("; ")}`);
for (const [u, c, obras] of quebrados) console.log(`  QUEBRADO (${c}): ${u}\n    ${[...obras].join("; ")}`);
if (quebrados.length) process.exitCode = 1;
