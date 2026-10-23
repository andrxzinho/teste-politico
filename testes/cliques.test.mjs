// Clica em todos os botões, gavetas, abas, seletores e links internos visíveis de cada tela e estado (links pra
// outras páginas são conferidos em paginas.test.mjs), no celular (toque) e no computador,
// e falha se algum clique gerar erro na página ou o aviso de "algo deu errado".
import { servidorEstatico, navegador, verificador, RESPONDER, executandoDireto } from "./ajuda/ambiente.mjs";

const PREP = "window.print=()=>{};navigator.share=()=>Promise.resolve();navigator.canShare=()=>true;";
const ESTADOS = [
  ["início", "/", ""],
  ["consentimento", "/", "show('consent')"],
  ["pergunta comum", "/", "st=fresh('full');st.seen=st.bs.map((_,j)=>j);st.cur=3;show('quiz');render()"],
  ["escolha forçada", "/", "st=fresh('full');st.seen=st.bs.map((_,j)=>j);st.cur=seq().findIndex(id=>ITEMS[id].f==='l');show('quiz');render()"],
  ["contraste", "/", "st=fresh('full');st.seen=st.bs.map((_,j)=>j);st.cur=seq().findIndex(id=>ITEMS[id].f==='c');show('quiz');render()"],
  ["início de bloco", "/", "st=fresh('full');st.cur=0;show('quiz');render()"],
  ["desempate", "/", `st=fresh('quick');${RESPONDER}(1);st.done=false;st.tbAsked=true;st.tb=DATA.POOL.filter(o=>o.k==='E').slice(0,5).map(o=>o.id);save();$('tbText').textContent='Desempate de teste.';show('tbintro')`],
  ["importância", "/", "st=fresh('full');show('imp')"],
  ["resultado", "/", `st=fresh('full');${RESPONDER}(-1);document.querySelectorAll('#results details').forEach(d=>d.open=true)`],
  ["resultado entre duas", "/", `st=fresh('quick');${RESPONDER}(0);document.querySelectorAll('#results details').forEach(d=>d.open=true)`],
  ["respostas insuficientes", "/", "st=fresh('quick');st.seen=st.bs.map((_,j)=>j);for(const id of st.base)st.ans[id]=gated(ITEMS[id])&&!gateOK(id)?'g':'x';st.cur=seq().length;st.done=true;R=compute(st.ans);show('results');results()"],
  ["janela de compartilhar", "/", `st=fresh('full');${RESPONDER}(1);abrirImagem()`],
  ["janela de confiança", "/", `st=fresh('full');${RESPONDER}(1);document.querySelector('#confChip button').click()`],
  ["explicação da frase", "/", "st=fresh('full');st.seen=st.bs.map((_,j)=>j);st.cur=3;show('quiz');render();$('explainBtn').click()"],
  ["link de amigo", "/?comparar=bf51j1n1n1p1i1h", ""],
  ["lista de ideologias", "/ideologias/", ""],
  ["página de ideologia", "/ideologias/conservador/", ""],
  ["perguntas frequentes", "/perguntas-frequentes/", ""],
  ["metodologia", "/metodologia.html", ""],
  ["termos", "/termos.html", ""],
];
const MARCAR = `(()=>{const v=[...document.querySelectorAll('button,summary,a[href],select,input[type=checkbox],[role=tab]')].filter(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&!e.closest('[hidden],.hidden')&&!(e.tagName==='A'&&!(e.getAttribute('href')||'').startsWith('#'))});
  v.forEach((e,i)=>e.dataset.tc=i);return v.map(e=>(e.textContent||e.getAttribute('aria-label')||e.tagName).trim().replace(/\\s+/g,' ').slice(0,40))})()`;

export async function testarCliques() {
  const s = await servidorEstatico(), b = await navegador(), v = verificador("Cliques");
  const DISP = [["celular", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }], ["computador", { viewport: { width: 1280, height: 860 } }]].filter(([d]) => !process.env.DISPOSITIVO || process.env.DISPOSITIVO === d);
  for (const [disp, opc] of DISP) {
    const ctx = await b.newContext(opc), pg = await ctx.newPage(); let erros = [];
    pg.on("pageerror", (e) => erros.push(String(e))); pg.on("dialog", (d) => d.accept());
    let total = 0;
    for (const [nome, url, js] of ESTADOS) {
      const preparar = async () => { await pg.goto(s.url + url); await pg.evaluate("localStorage.clear()"); await pg.goto(s.url + url); await pg.waitForTimeout(120); await pg.evaluate(PREP); if (js) { await pg.evaluate(js); await pg.waitForTimeout(nome.startsWith("janela de compartilhar") ? 2200 : 150); } return pg.evaluate(MARCAR); };
      let nomes = await preparar();
      for (let i = 0; i < nomes.length; i++) {
        erros = [];
        const alvo = pg.locator(`[data-tc="${i}"]`);
        try {
          if ((await alvo.count()) && (await alvo.isVisible())) {
            await alvo.scrollIntoViewIfNeeded({ timeout: 1500 });
            if (disp === "celular") await alvo.tap({ timeout: 1500, force: true }); else await alvo.click({ timeout: 1500, force: true });
            await pg.waitForTimeout(130); total++;
          }
        } catch (e) { /* elemento coberto ou sumiu depois de um clique anterior: o estado é refeito abaixo */ }
        const aviso = await pg.locator(".erro-geral").count().catch(() => 0);
        v.confere(!erros.length && !aviso, `${disp}, ${nome}: clicar em "${nomes[i]}" gerou erro: ${erros.join(" | ").slice(0, 160)}`);
        await pg.keyboard.press("Escape").catch(() => {});
        // se o clique mudou de página ou de tela, volta ao estado pra continuar do próximo elemento
        const mudou = !pg.url().startsWith(s.url + url.split("?")[0]) || (await pg.locator(`[data-tc="${i + 1}"]`).count().catch(() => 0)) === 0;
        if (mudou && i + 1 < nomes.length) nomes = await preparar();
      }
    }
    console.log(`  ${disp}: ${total} cliques em ${ESTADOS.length} telas e estados`);
    await ctx.close();
  }
  await b.close(); await s.fechar();
  return v.fim();
}
if (executandoDireto(import.meta.url)) process.exitCode = (await testarCliques()) ? 1 : 0;
