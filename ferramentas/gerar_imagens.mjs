// Lista as fotos (public/img/p) e capas (public/img/l) que existem e escreve public/js/dados/imagens.js, usado pelo site
// pra saber quando mostrar a imagem ou o retrato/capa tipográfica. Os créditos ficam em ferramentas/creditos-imagens.json
// e viram a página /creditos/ (ferramentas/gerar_paginas.mjs). Rode depois de incluir ou trocar imagens:
//   node ferramentas/gerar_imagens.mjs
import fs from "node:fs";
const lista = (d) => (fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith(".webp")).map((f) => f.slice(0, -5)).sort() : []);
const p = lista("public/img/p"), l = lista("public/img/l");
fs.writeFileSync("public/js/dados/imagens.js", `// GERADO por ferramentas/gerar_imagens.mjs. Não edite aqui.\n// Fotos de pessoas (/img/p) e capas de livros (/img/l) disponíveis, pelo nome do arquivo.\nconst IMAGENS = ${JSON.stringify({ p, l })};\n`);
console.log(`${p.length} fotos e ${l.length} capas`);
