// Ambiente dos testes: servidor estático local, navegador e contador de verificações.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".png": "image/png", ".json": "application/json", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json" };

export async function servidorEstatico(raiz = "public", porta = 0) {
  const base = path.resolve(raiz);
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://local").pathname);
    if (p.endsWith("/")) p += "index.html";
    let f = path.join(base, p);
    if (!fs.existsSync(f) && fs.existsSync(f + ".html")) f += ".html"; // como o Netlify: /termos serve termos.html
    if (!f.startsWith(base) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "content-type": TIPOS[path.extname(f)] || "application/octet-stream" });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => srv.listen(porta, "127.0.0.1", r));
  return { url: `http://127.0.0.1:${srv.address().port}`, fechar: () => new Promise((r) => srv.close(r)) };
}

// CHROMIUM_PATH aponta pra um Chromium já instalado; sem ele, usa o do Playwright (npx playwright install chromium)
export function navegador() {
  return chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
}

export function verificador(nome) {
  let ok = 0, falhas = 0;
  return {
    confere(cond, msg) { if (cond) ok++; else { falhas++; console.log(`  FALHOU: ${msg}`); } },
    fim() { console.log(`${nome}: ${ok} verificações ok, ${falhas} falha(s)`); return falhas; },
  };
}

// responde todas as frases do teste atual no navegador (lado: -1 esquerda, 1 direita) e mostra o resultado
export const RESPONDER = `(lado=>{st.seen=st.bs.map((_,j)=>j);for(const id of st.base){const o=ITEMS[id];if(gated(o)&&!gateOK(id)){st.ans[id]='g';continue}
  st.ans[id]=o.f==='l'?lado:o.f==='c'?((o.va<o.vb)===(lado<0)?-2:2):extreme(o)?-2:Math.max(-2,Math.min(2,Math.round(lado*1.2*o.d)))}
  st.cur=seq().length;st.done=true;R=compute(st.ans);show('results');results();if(typeof setCompleto==='function')setCompleto(true)})`;

export const executandoDireto = (url) => url === `file://${process.argv[1]}`;
