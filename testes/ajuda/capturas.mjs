// Capturas de tela pra conferência visual: node testes/ajuda/capturas.mjs <pasta> <nome:url:código|...>
// Cada captura sai em 390 px e 1280 px, nos temas claro e escuro. O código roda na página antes da captura;
// se ele devolver um seletor, a captura mostra só esse elemento.
import fs from "node:fs";
import { servidorEstatico, navegador, RESPONDER } from "./ambiente.mjs";

const [pasta, ...alvos] = process.argv.slice(2);
fs.mkdirSync(pasta, { recursive: true });
const srv = await servidorEstatico(), nav = await navegador();
for (const alvo of alvos) {
  const [nome, url, codigo = ""] = alvo.split("|");
  for (const [w, h] of [[390, 844], [1280, 860]]) for (const tema of ["light", "dark"]) {
    const pg = await nav.newPage({ viewport: { width: w, height: h }, colorScheme: tema, reducedMotion: "reduce" });
    await pg.goto(srv.url + url); await pg.waitForTimeout(400);
    const sel = codigo ? await pg.evaluate(codigo.replaceAll("RESPONDER", RESPONDER)) : null;
    await pg.waitForTimeout(1200);
    const larg = await pg.evaluate("document.documentElement.scrollWidth");
    const arq = `${pasta}/${nome}-${w}-${tema === "light" ? "claro" : "escuro"}.png`;
    if (sel) await pg.locator(sel).screenshot({ path: arq }); else await pg.screenshot({ path: arq });
    console.log(arq, larg > w ? `ROLAGEM LATERAL (${larg}px)` : "ok");
    await pg.close();
  }
}
await nav.close(); await srv.fechar();
