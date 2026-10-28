// Gera as imagens de prévia de links (1200×630), no estilo da urna:
//   public/og-urna.png: a do site (visor com o título e o teclado);
//   public/img/og/<nome>.png: a de cada ideologia (nome, família e resumo no visor e o mapa com a posição típica dela).
// Rode da raiz do projeto depois de mudar ideologias.js: node ferramentas/gerar_imagens_compartilhar.mjs
// (precisa do Chromium do Playwright; CHROMIUM_PATH aponta pra um já instalado)
import fs from "node:fs";
import vm from "node:vm";
import { chromium } from "playwright";
import { slug, esc } from "./comum.mjs";

const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("public/js/dados/ideologias.js", "utf8") + ";globalThis.D={IDEO,IDEO_GRUPOS,IDEO_RESUMO};", ctx);
const { IDEO, IDEO_GRUPOS, IDEO_RESUMO } = ctx.D;
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

// imagem geral do site: visor com o título e o teclado da urna (sem símbolos oficiais)
function htmlGeral() {
  const tecla = (t, cls = "") => `<div class="tecla ${cls}">${t}</div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Arimo;src:url(data:font/woff2;base64,${fonte}) format("woff2");font-weight:400 700}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#2B2A27;font-family:Arimo,Arial,sans-serif;display:grid;place-items:center}
.urna{width:1120px;height:552px;background:#E3DED1;border-radius:30px;box-shadow:0 12px 0 #A9A69C;padding:30px;display:grid;grid-template-columns:minmax(0,1fr) 300px;grid-template-rows:100%;gap:28px}
.visor{background:#3A3935;border-radius:14px;padding:14px;min-height:0}
.tela{background:#F3F5EF;border-radius:4px;height:100%;padding:0 36px;display:flex;flex-direction:column;justify-content:center}
.nome{font-size:19px;font-weight:700;letter-spacing:.14em;color:#5E5A50}
h1{font-size:68px;line-height:1.02;font-weight:700;color:#151513;margin-top:16px}
p{font-size:25px;line-height:1.35;color:#3A3935;margin-top:20px}
.dig{display:flex;align-items:center;gap:8px;margin-top:28px}
.dig span{display:inline-flex;align-items:center;justify-content:center;width:40px;height:50px;border:3px solid #151513;border-radius:4px;font-size:26px;font-weight:700;color:#151513}
.dig i{width:3px;height:34px;background:#151513;margin-left:4px}
.teclado{background:#2B2A27;border-radius:14px;padding:62px 20px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;align-content:center}
.tecla{height:52px;border-radius:6px;background:#1A1A18;box-shadow:0 5px 0 #000;color:#F5F5F0;font-size:22px;font-weight:700;display:grid;place-items:center}
.larga{grid-column:1/-1;font-size:16px;letter-spacing:.04em;color:#151513}
.branco{background:#F4F4EF;box-shadow:0 5px 0 #A9A69C}.corrige{background:#E8732C;box-shadow:0 5px 0 #9C4A16}.confirma{background:#2FA35A;box-shadow:0 5px 0 #1B6A39}
</style></head><body><div class="urna">
<div class="visor"><div class="tela">
<div class="nome">TESTE POLÍTICO</div>
<h1>Onde você fica na política?</h1>
<p>Três modos, de 65 a 210 perguntas. Sua posição em 6 eixos e a mais próxima de 21 ideologias.</p>
<div class="dig"><span>0</span><span>1</span><i></i></div>
</div></div>
<div class="teclado">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => tecla(n)).join("")}${tecla("BRANCO", "larga branco")}${tecla("CORRIGE", "larga corrige")}${tecla("CONFIRMA", "larga confirma")}</div>
</div></body></html>`;
}

fs.mkdirSync("public/img/og", { recursive: true });
const nav = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const pg = await nav.newPage({ viewport: { width: 1200, height: 630 } });
await pg.setContent(htmlGeral(), { waitUntil: "load" }); await pg.evaluate(() => document.fonts.ready);
await pg.screenshot({ path: "public/og-urna.png" });
for (const o of IDEO) {
  await pg.setContent(html(o), { waitUntil: "load" });
  await pg.evaluate(() => document.fonts.ready);
  await pg.screenshot({ path: `public/img/og/${slug(o.n)}.png` });
}
await nav.close();
console.log(`public/og-urna.png e ${IDEO.length} imagens em public/img/og/`);
