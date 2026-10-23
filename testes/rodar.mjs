// Roda todos os testes: `npm test`. Use CHROMIUM_PATH pra apontar um Chromium já instalado.
import { testarLogica } from "./logica.test.mjs";
import { testarInterface } from "./interface.test.mjs";
import { testarServidor } from "./servidor.test.mjs";
import { testarPaginas } from "./paginas.test.mjs";
import { testarAcessibilidade } from "./acessibilidade.test.mjs";
import { testarCliques } from "./cliques.test.mjs";
import { testarPerfis } from "./perfis.test.mjs";
import { testarNumeros } from "./numeros.test.mjs";
let falhas = 0;
for (const [nome, t] of [["lógica", testarLogica], ["perfis sintéticos", testarPerfis], ["números do site", testarNumeros], ["interface", testarInterface], ["servidor", testarServidor], ["páginas", testarPaginas], ["acessibilidade", () => testarAcessibilidade({ detalhar: true })], ["cliques", testarCliques]]) {
  console.log(`\n== ${nome}`);
  try { falhas += await t(); } catch (e) { falhas++; console.log("  ERRO:", e.message); }
}
console.log(falhas ? `\n${falhas} falha(s).` : "\nTudo certo.");
process.exitCode = falhas ? 1 : 0;
