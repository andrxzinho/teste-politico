// Gera a imagem de compartilhamento (1200×630) de cada ideologia em public/img/og/<nome>.png, no estilo da urna:
// nome, família e resumo no visor e, ao lado, o mapa das 21 ideologias com a posição típica dela em destaque.
// Rode da raiz do projeto depois de mudar ideologias.js: node ferramentas/gerar_imagens_ideologias.mjs
// (precisa do Chromium do Playwright; CHROMIUM_PATH aponta pra um já instalado)
import fs from "node:fs";
import vm from "node:vm";
import { chromium } from "playwright";

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("public/js/dados/ideologias.js", "utf8") + ";globalThis.D={IDEO,IDEO_GRUPOS,IDEO_RESUMO};", ctx);
const { IDEO, IDEO_GRUPOS, IDEO_RESUMO } = ctx.D;
// mesmo slug de ferramentas/gerar_paginas.mjs (importar de lá rodaria o gerador inteiro)
const slug = (n) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fonte = fs.readFileSync("public/fonts/arimo-latin.woff2").toString("base64");

// mesmo desenho do mapa da página inicial (heroMap em public/js/principal.js), com as cores do tema claro
function mapa(atual) {
  const L = 58, R = 282, T = 26, B = 208, cx = (L + R) / 2, cy = (T + B) / 2;
  const X = (e) => cx + (e * (R - L)) / 2 / 100, Y = (a) => cy - (a * (B - T)) / 2 / 100;
  const F = 'font-family="Arimo"', txt = (x, y, t, an = "middle") => `<text x="${x}" y="${y}" text-anchor="${an}" font-size="10.5" font-weight="600" fill="#5E5A50" ${F}>${t}</text>`;
  let g = "";
  for (let i = 1; i < 8; i++) { if (i === 4) continue; const gx = L + (i * (R - L)) / 8, gy = T + (i * (B - T)) / 8; g += `<line x1="${gx}" y1="${T}" x2="${gx}" y2="${B}" stroke="#D3D6CC"/><line x1="${L}" y1="${gy}" x2="${R}" y2="${gy}" stroke="#D3D6CC"/>`; }
  g += `<line x1="${cx}" y1="${T}" x2="${cx}" y2="${B}" stroke="#5E5A50" stroke-opacity=".5"/><line x1="${L}" y1="${cy}" x2="${R}" y2="${cy}" stroke="#5E5A50" stroke-opacity=".5"/>`;
  g += txt(cx, T - 10, "Mais ordem") + txt(cx, B + 18, "Mais liberdade") + txt(L - 7, cy + 3.5, "Esquerda", "end") + txt(R + 7, cy + 3.5, "Direita", "start");
  for (const o of IDEO) if (o !== atual) g += `<circle cx="${X(o.p.E).toFixed(1)}" cy="${Y(o.p.A).toFixed(1)}" r="3.2" fill="#151513" opacity=".3"/>`;
  const x = X(atual.p.E), y = Y(atual.p.A);
  g += `<circle cx="${x}" cy="${y}" r="17" fill="#2FA35A" opacity=".18"/><circle cx="${x}" cy="${y}" r="8.5" fill="#2FA35A" stroke="#F3F5EF" stroke-width="3"/>`;
  return `<svg viewBox="0 0 340 236" xmlns="http://www.w3.org/2000/svg">${g}</svg>`;
}

function html(o) {
  const familia = (IDEO_GRUPOS.find(([, l]) => l.includes(o.n)) || ["Outras"])[0];
  // a palavra mais longa do nome precisa caber numa linha do visor (cerca de 470 px)
  const maior = Math.max(...o.n.split(/[\s-]/).map((w) => w.length + 1));
  const nome = Math.min(72, Math.floor(470 / (maior * 0.56)));
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Arimo;src:url(data:font/woff2;base64,${fonte}) format("woff2");font-weight:400 700}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#2B2A27;font-family:Arimo,Arial,sans-serif;display:grid;place-items:center}
.urna{width:1120px;height:550px;background:#E3DED1;border-radius:30px;box-shadow:0 12px 0 #A9A69C;padding:30px;display:grid;grid-template-columns:minmax(0,1fr) 450px;grid-template-rows:100%;gap:28px}
.visor{background:#3A3935;border-radius:14px;padding:14px;min-height:0}
.tela{background:#F3F5EF;border-radius:4px;height:100%;padding:36px 44px;display:flex;flex-direction:column}
.fam{font-size:20px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#5E5A50}
h1{font-size:${nome}px;line-height:1;font-weight:700;color:#151513;letter-spacing:-.02em;margin-top:18px}
p{font-size:23px;line-height:1.38;color:#3A3935;margin-top:18px}
.end{margin-top:auto;display:flex;align-items:center;gap:12px;font-size:22px;font-weight:700;color:#151513}
.end i{display:inline-block;width:13px;height:13px;border-radius:50%;background:#2FA35A}
.lado{background:#2B2A27;border-radius:14px;padding:20px;display:flex;flex-direction:column;min-height:0}
.mapa{background:#F3F5EF;border-radius:4px;flex:1;display:grid;place-items:center;min-height:0}
.mapa svg{width:100%;height:auto}
.rot{margin-top:16px;color:#E3DED1;font-size:19px;line-height:1.35;text-align:center}
</style></head><body><div class="urna">
<div class="visor"><div class="tela">
<div class="fam">Família: ${esc(familia)}</div>
<h1>${esc(o.n)}</h1>
<p>${esc(IDEO_RESUMO[o.n])}</p>
<div class="end"><i></i>testepolitico.vercel.app</div>
</div></div>
<div class="lado"><div class="mapa">${mapa(o)}</div><div class="rot">Economia na horizontal, liberdade × ordem na vertical</div></div>
</div></body></html>`;
}

fs.mkdirSync("public/img/og", { recursive: true });
const nav = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const pg = await nav.newPage({ viewport: { width: 1200, height: 630 } });
for (const o of IDEO) {
  await pg.setContent(html(o), { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: `public/img/og/${slug(o.n)}.png` });
}
await nav.close();
console.log(`${IDEO.length} imagens em public/img/og/`);
