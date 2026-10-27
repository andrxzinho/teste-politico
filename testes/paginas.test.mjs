// Páginas públicas e navegação: links internos, menu (teclado numerado), escolha de tema e nada rolando pros lados.
import fs from "node:fs";
import { servidorEstatico, navegador, verificador, executandoDireto } from "./ajuda/ambiente.mjs";

export async function testarPaginas() {
  const s = await servidorEstatico(), b = await navegador(), v = verificador("Páginas"), erros = [];
  const paginas = ["/", "/ideologias/", "/ideologias/social-democrata/", "/ideologias/fascista/", "/perguntas-frequentes/", "/creditos/", "/codigo-aberto/", "/sobre/", "/404.html", "/metodologia.html", "/termos.html"];
  v.confere(fs.readdirSync("public/ideologias").filter((d) => fs.existsSync(`public/ideologias/${d}/index.html`)).length === 21, "deveria haver 21 páginas de ideologia");

  // rodapé: a data de "Atualizado em" é a da entrada mais recente do CHANGELOG
  const dataLog = (fs.readFileSync("CHANGELOG.md", "utf8").match(/^## .*\((\d{1,2} de \S+ de \d{4})\)/m) || [])[1];
  v.confere(dataLog && fs.readFileSync("public/js/navegacao.js", "utf8").includes(`const ATUALIZADO = "${dataLog}"`), `data do rodapé deveria ser a do CHANGELOG (${dataLog})`);
  // security.txt (RFC 9116): contato e validade, que precisa estar a mais de 30 dias de vencer
  const sec = fs.readFileSync("public/.well-known/security.txt", "utf8"), vence = Date.parse((sec.match(/^Expires: (.+)$/m) || [])[1]);
  v.confere(/^Contact: https:\/\//m.test(sec), "security.txt deveria ter Contact");
  v.confere(vence - Date.now() > 30 * 864e5, "security.txt vence em menos de 30 dias: atualize o Expires");
  // 404 fora dos buscadores e do sitemap; imagem de compartilhamento pra cada ideologia; dados estruturados válidos
  v.confere(fs.readFileSync("public/404.html", "utf8").includes('name="robots" content="noindex"') && !fs.readFileSync("public/sitemap.xml", "utf8").includes("404"), "404 deveria ficar fora dos buscadores");
  for (const d of fs.readdirSync("public/ideologias").filter((d) => fs.existsSync(`public/ideologias/${d}/index.html`))) {
    const h = fs.readFileSync(`public/ideologias/${d}/index.html`, "utf8");
    v.confere(h.includes(`/img/og/${d}.png"`) && fs.existsSync(`public/img/og/${d}.png`), `${d}: faltando a imagem de compartilhamento`);
  }
  for (const arq of ["public/index.html", "public/ideologias/index.html", "public/ideologias/fascista/index.html"]) {
    const m = fs.readFileSync(arq, "utf8").match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    let ok = false; try { ok = !!JSON.parse(m[1])["@graph"].length; } catch (e) {}
    v.confere(ok, `${arq}: dados estruturados (JSON-LD) faltando ou inválidos`);
  }

  // todos os links internos de todas as páginas apontam pra algo que existe
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  pg.on("pageerror", (e) => erros.push(String(e)));
  const vistos = new Set();
  for (const p of paginas) {
    await pg.goto(s.url + p); await pg.waitForTimeout(150);
    v.confere((await pg.locator("#site-cab .menu-btn").count()) === 1 && (await pg.locator("#site-rod nav a").count()) >= 4, `${p}: cabeçalho ou rodapé faltando`);
    v.confere((await pg.locator('link[href="/css/movimento.css"]').count()) === 1, `${p}: faltando o estilo de movimento`);
    await pg.waitForTimeout(1800); // segurança do "aparecer ao rolar": nada fica invisível pra sempre
    v.confere(await pg.evaluate("[...document.querySelectorAll('.revela')].every(e=>getComputedStyle(e).opacity==='1')"), `${p}: há blocos que continuam invisíveis`);
    for (const h of await pg.evaluate(() => [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href").split("#")[0]))) {
      if (!h || vistos.has(h)) continue; vistos.add(h);
      const r = await fetch(s.url + h); v.confere(r.ok, `link quebrado em ${p}: ${h}`);
    }
  }
  await pg.goto(s.url + "/ideologias/social-democrata/"); await pg.waitForTimeout(150);
  v.confere((await pg.locator(".livro").count()) === 8, "página de ideologia deveria ter 8 leituras (4 por dentro, 4 críticas)");
  v.confere((await pg.locator('a[href="/?ideologia=social-democrata"]').count()) === 1, "página de ideologia deveria ter o atalho pra comparar");
  // menu: abre, fecha com Esc, tecla 2 leva às ideologias, foco volta ao botão
  await pg.goto(s.url + "/"); await pg.waitForTimeout(150);
  await pg.click(".menu-btn");
  v.confere(await pg.evaluate("!document.querySelector('.menu-fundo').hidden"), "menu deveria abrir");
  v.confere(await pg.evaluate("document.activeElement.classList.contains('menu-item')"), "foco deveria ir pro primeiro item do menu");
  await pg.keyboard.press("Escape");
  v.confere(await pg.evaluate("document.querySelector('.menu-fundo').hidden&&document.activeElement.classList.contains('menu-btn')"), "Esc deveria fechar o menu e devolver o foco");
  await pg.click(".menu-btn"); await pg.keyboard.press("2"); await pg.waitForURL("**/ideologias/");
  v.confere(true, "tecla 2 leva às ideologias");
  // tema escolhido no menu vale pra todas as páginas e sobrevive à recarga
  await pg.click(".menu-btn"); await pg.click('.seg3 button[data-tema="escuro"]');
  v.confere((await pg.evaluate("document.documentElement.dataset.theme")) === "dark", "tema escuro deveria ser aplicado");
  await pg.goto(s.url + "/perguntas-frequentes/");
  v.confere((await pg.evaluate("document.documentElement.dataset.theme")) === "dark", "tema escolhido deveria valer em outra página");
  await pg.evaluate(() => localStorage.removeItem("tp-tema"));
  // filtro da lista de ideologias
  await pg.goto(s.url + "/ideologias/"); await pg.click('.filtros button[data-grupo="extremos"]');
  v.confere((await pg.locator(".lista-ideo .cartao:visible").count()) === 4, "filtro Extremos deveria mostrar 4 ideologias");
  await pg.close();

  // nada rola pros lados, em telas pequenas e grandes, nos dois temas
  for (const [w, h] of [[320, 640], [768, 1024], [1280, 800]]) for (const tema of ["light", "dark"]) {
    const p2 = await b.newPage({ viewport: { width: w, height: h }, colorScheme: tema });
    p2.on("pageerror", (e) => erros.push(String(e)));
    for (const p of paginas) {
      await p2.goto(s.url + p); await p2.waitForTimeout(100);
      v.confere(!(await p2.evaluate("document.documentElement.scrollWidth>innerWidth+1")), `${w}px ${tema}: ${p} rola pros lados`);
    }
    await p2.close();
  }
  v.confere(!erros.length, "erros na página: " + [...new Set(erros)].join(" | "));
  await b.close(); await s.fechar();
  return v.fim();
}
if (executandoDireto(import.meta.url)) process.exitCode = (await testarPaginas()) ? 1 : 0;
