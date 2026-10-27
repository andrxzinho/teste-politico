// Interface: o fluxo real no navegador, nos três modos, e as funções principais da página de resultado.
import fs from "node:fs";
import path from "node:path";
import { servidorEstatico, navegador, verificador, RESPONDER, executandoDireto } from "./ajuda/ambiente.mjs";

// os scripts do site compartilham o mesmo escopo: um nome definido em dois arquivos faz um substituir o outro calado
function nomesRepetidos() {
  const defs = {}, ler = (d) => fs.readdirSync(d).forEach((f) => { const q = path.join(d, f); if (fs.statSync(q).isDirectory()) ler(q); else if (q.endsWith(".js") && !q.includes("painel") && !q.includes("navegacao") && !q.includes("paginas")) for (const m of fs.readFileSync(q, "utf8").matchAll(/^(?:async )?function (\w+)\(|^(?:const|let|var) (\w+)\s*=/gm)) (defs[m[1] || m[2]] ||= []).push(f); });
  ler("public/js"); return Object.entries(defs).filter(([, a]) => a.length > 1).map(([n, a]) => `${n} (${a.join(", ")})`);
}

const telaAtual = "['intro','consent','quiz','tbintro','imp','results'].find(s=>!$(s).classList.contains('hidden'))";

export async function testarInterface() {
  const s = await servidorEstatico(), b = await navegador(), v = verificador("Interface"), erros = [];
  const rep = nomesRepetidos(); v.confere(!rep.length, "nomes definidos em mais de um arquivo: " + rep.join("; "));
  const novaPagina = async (opc = {}) => { const pg = await b.newPage({ viewport: { width: 390, height: 844 }, ...opc }); pg.on("pageerror", (e) => erros.push(String(e))); await pg.goto(s.url + "/index.html"); await pg.evaluate(() => localStorage.clear()); await pg.reload(); return pg; };

  // fluxo real em cada modo: tecla de modo, primeiras respostas pelo teclado, FIM e resultado
  for (const [modo, caixas] of [["quick", 2], ["full", 3], ["deep", 3]]) {
    const pg = await novaPagina();
    await pg.click(`.mode[data-mode="${modo}"]`);
    if ((await pg.evaluate(telaAtual)) === "consent") await pg.click("#cSkip");
    if (await pg.evaluate("onIntro()")) await pg.click("#answers button");
    v.confere((await pg.locator("#qn .digito").count()) === caixas, `${modo}: número da pergunta deveria ter ${caixas} caixas`);
    for (let i = 0; i < 3; i++) { await pg.keyboard.press("2"); await pg.waitForTimeout(260); }
    v.confere((await pg.evaluate("Object.values(st.ans).filter(x=>x===1).length")) >= 3, `${modo}: tecla 2 deveria registrar "Concordo"`);
    await pg.evaluate(`${RESPONDER}(-1)`);
    await pg.evaluate("show('imp')"); await pg.click("#impGo");
    v.confere(!(await pg.evaluate("$('fim').classList.contains('hidden')")), `${modo}: tela de FIM deveria aparecer`);
    await pg.waitForFunction("!$('results').classList.contains('hidden')", null, { timeout: 4000 });
    // conteúdo de cada parte do resultado (não só a existência das seções)
    v.confere((await pg.evaluate("$('compassSvg').childElementCount")) > 10, `${modo}: a bússola deveria estar desenhada`);
    v.confere((await pg.evaluate("$('prof').textContent.length")) > 60, `${modo}: o perfil em palavras deveria estar escrito`);
    v.confere((await pg.locator("#matches .item").count()) >= 3, `${modo}: as ideologias parecidas deveriam estar listadas`);
    v.confere((await pg.evaluate("$('why').textContent.length")) > 60, `${modo}: "por que deu esse resultado" deveria estar preenchido`);
    // resumo primeiro: o principal à vista, o completo sob demanda
    v.confere(await pg.evaluate("!$('results').classList.contains('completo')&&getComputedStyle(document.querySelector('#results .acc-list')).display==='none'"), `${modo}: o resultado deveria abrir no resumo`);
    v.confere((await pg.locator("#resumo .eixo-tipico").count()) === 6 && (await pg.locator("#resumo .resumo-ideo").count()) === 3 && (await pg.locator("#resumo #leitOut .livro").count()) === 4 && (await pg.locator("#resumo #pensOut .pensador").count()) >= 4, `${modo}: o resumo deveria ter 6 eixos, 3 ideologias, pensadores e leituras com 4 obras por aba`);
    v.confere(await pg.evaluate("[...$('resumo').children].map(e=>e.id).join(',')").then((o) => /blocoPensadores,blocoLeituras,blocoPartilha,blocoCorrigir$/.test(o)), `${modo}: o resumo deveria seguir a ordem pensadores, leituras, compartilhar e comparar`);
    v.confere((await pg.locator("#resumo .code").count()) === 1 && (await pg.locator("#results .acc-list #friendIn").count()) === 0, `${modo}: a comparação com amigos deveria aparecer uma vez só, no resumo`);
    v.confere((await pg.locator("#partilhaOut .formato").count()) === 4 && (await pg.locator("#partilhaOut .app").count()) === 8, `${modo}: compartilhar deveria ter 4 formatos e os aplicativos`);
    v.confere(await pg.evaluate("document.querySelector('#resumo .code').textContent===myLink().split('comparar=')[1]"), `${modo}: o código de comparação deveria aparecer no resumo, igual ao do link`);
    await pg.click("#verCompleto");
    v.confere(await pg.evaluate("$('results').classList.contains('completo')&&getComputedStyle(document.querySelector('#results .acc-list')).display!=='none'"), `${modo}: "Ver resultado completo" deveria abrir as seções`);
    v.confere((await pg.locator("#results details.acc").count()) === 10, `${modo}: resultado completo deveria ter 10 seções`);
    v.confere(await pg.evaluate("[...document.querySelectorAll('#results .acc-list > details.acc')].slice(0,2).map(d=>d.id).join()") === "a-perfil,a-porque", `${modo}: "Por que deu esse resultado" deveria vir logo depois do perfil`);
    v.confere((await pg.evaluate("$('ideo').textContent")).length > 3, `${modo}: ideologia vazia`);
    v.confere(/^Mais perto: /.test(await pg.evaluate("$('s-candidatos').textContent")), `${modo}: resumo de partidos sem o partido mais perto`);
    v.confere((await pg.evaluate("$('myCode').textContent")).startsWith({ quick: "bq", full: "bf", deep: "bd" }[modo]), `${modo}: código de comparação deveria indicar o modo`);
    // etapa C: comparar com uma ideologia, tensões, leituras e relatório
    v.confere((await pg.locator("#compIdeoOut > div.box > .axis").count()) === 5, `${modo}: comparação com ideologia deveria ter 5 eixos`);
    await pg.evaluate("document.getElementById('a-compideo').open=true"); await pg.selectOption("#compIdeoSel", "Fascista");
    v.confere(/Fascista/.test(await pg.evaluate("$('compIdeoOut').textContent")), `${modo}: trocar a ideologia deveria refazer a comparação`);
    v.confere((await pg.locator("#leitOut .livro").count()) === 4, `${modo}: leituras deveriam mostrar 4 obras por aba`);
    v.confere((await pg.locator("#tensOut .item").count()) >= 1, `${modo}: tensões deveria ter pelo menos um item`);
    if (modo === "quick") {
      await pg.evaluate("window.__imprimiu=0;window.print=()=>{window.__imprimiu++;window.__abertas=[...document.querySelectorAll('#results details.acc')].every(d=>d.open);dispatchEvent(new Event('afterprint'))}");
      await pg.evaluate("setCompleto(false);window.print=()=>{window.__imprimiu++;window.__abertas=[...document.querySelectorAll('#results details.acc')].every(d=>d.open)&&$('results').classList.contains('completo');dispatchEvent(new Event('afterprint'))}");
      await pg.click("#pdfBtn"); await pg.waitForTimeout(200);
      v.confere(await pg.evaluate("!$('results').classList.contains('completo')"), "depois do PDF, deveria voltar pro resumo");
      v.confere(await pg.evaluate("window.__imprimiu===1&&window.__abertas"), "relatório deveria abrir todas as seções e chamar a impressão");
      v.confere(await pg.evaluate("[...document.querySelectorAll('#results details.acc')].filter(d=>d.open).length<=2"), "depois da impressão, as seções deveriam voltar como estavam");
      await pg.evaluate("scrollTo(0,0)"); await pg.click("#shareBtn"); await pg.waitForTimeout(900);
      v.confere(await pg.evaluate("Math.abs($('blocoPartilha').getBoundingClientRect().top)<300"), "Compartilhar e comparar deveria levar ao bloco de compartilhar e comparar");
    }
    if (modo === "full") {
      await pg.click("#partilhaOut .formato");
      await pg.waitForFunction("!!shareFile", null, { timeout: 6000 });
      v.confere((await pg.evaluate("shareFile.size")) > 50000, "imagem de compartilhar vazia ou pequena demais");
      const dims = () => pg.evaluate("new Promise(r=>{const i=new Image();i.onload=()=>r([i.width,i.height]);i.src=shareUrl})");
      v.confere(JSON.stringify(await dims()) === "[1080,1920]", "imagem padrão deveria ser story (1080 × 1920)");
      const antes = await pg.evaluate("shareFile.size"); await pg.click('#shareSheet [data-tema="escuro"]'); await pg.waitForTimeout(1500);
      v.confere((await pg.evaluate("shareFile.size")) !== antes, "tema escuro deveria mudar a imagem");
      for (const [f, wh] of [["retrato", "[1080,1350]"], ["quadrado", "[1080,1080]"], ["paisagem", "[1600,900]"]]) {
        await pg.click(`#shareSheet [data-formato="${f}"]`); await pg.waitForFunction(`shOp.formato==="${f}"&&!!shareFile&&shareFile.name.includes("${f}")`, null, { timeout: 6000 });
        v.confere(JSON.stringify(await dims()) === wh, `imagem ${f} deveria ter ${wh}`);
      }
      v.confere(/^https:\/\/wa\.me\/\?text=.*comparar%3D/.test(await pg.evaluate("$('shZap').href")), "WhatsApp deveria levar o texto com o link de comparação");
      await pg.click("#shLink"); await pg.waitForTimeout(150);
      v.confere(/copiado/i.test(await pg.evaluate("$('shAviso').textContent")), "copiar o link deveria avisar que copiou");
      await pg.keyboard.press("Escape");
      await pg.fill("#friendIn", "codigo-invalido"); await pg.click("#friendGo");
      v.confere(/não parece válido/.test(await pg.evaluate("$('friendErr').textContent")), "código inválido deveria ser recusado");
      await pg.fill("#friendIn", "a51k1e1m1j181d"); await pg.click("#friendGo");
      v.confere((await pg.evaluate("$('friendOut').textContent")).length > 20, "código antigo deveria continuar valendo");
    }
    await pg.close();
  }

  // som ligado: responder (toc da tecla) e o FIM (som de confirmação) não podem dar erro
  {
    const pg = await novaPagina();
    await pg.evaluate("localStorage.setItem('tp-som','1')"); await pg.reload(); await pg.waitForTimeout(200);
    await pg.evaluate("st=fresh('quick');st.seen=st.bs.map((_,j)=>j);st.cur=3;show('quiz');render()");
    await pg.keyboard.press("2"); await pg.waitForTimeout(200);
    await pg.evaluate("somConfirma()"); await pg.waitForTimeout(300);
    v.confere(await pg.evaluate("somOn"), "com o som ligado, os sons deveriam tocar sem erro");
    // ligar o som (tecla do teste ou menu) toca o som de confirmação da urna; desligar não toca nada
    await pg.evaluate("window.__toques=0;const o=TP_NAV.som.confirma;TP_NAV.som.confirma=()=>{window.__toques++;o()}");
    await pg.click("#quiz .som"); await pg.click("#quiz .som"); await pg.waitForTimeout(100);
    v.confere(await pg.evaluate("window.__toques===1&&somOn"), "desligar e ligar o som pela tecla deveria tocar a confirmação uma vez (só ao ligar)");
    await pg.evaluate("show('intro')"); await pg.click(".menu-btn"); await pg.click(".menu .chave"); await pg.click(".menu .chave"); await pg.waitForTimeout(100);
    v.confere(await pg.evaluate("window.__toques===2"), "ligar o som pelo menu deveria tocar a confirmação");
    await pg.close();
  }

  // resultado: sem o menu de três traços, e a tecla do cabeçalho vira "Refazer teste"; teste pela metade pode ser descartado
  {
    const pg = await novaPagina({ viewport: { width: 1440, height: 900 } });
    await pg.evaluate(`st=fresh('full');${RESPONDER}(-1);save();results()`); await pg.waitForTimeout(200);
    v.confere(!(await pg.locator(".menu-btn").isVisible()) && (await pg.locator("#site-cab .tecla-ok").textContent()) === "Refazer teste", "no resultado, o menu deveria sumir e a tecla dizer Refazer teste");
    await pg.click("#site-cab .tecla-ok"); await pg.waitForTimeout(200);
    v.confere(await pg.evaluate("document.body.dataset.tela==='intro'&&!st.done") && (await pg.locator("#site-cab .tecla-ok").textContent()) === "Fazer o teste" && await pg.locator(".menu-btn").isVisible(), "Refazer teste deveria voltar pra abertura com o menu de volta");
    await pg.click('.mode[data-mode="quick"]'); if ((await pg.evaluate(telaAtual)) === "consent") await pg.click("#cSkip");
    if (await pg.evaluate("onIntro()")) await pg.click("#answers button");
    for (let i = 0; i < 3; i++) { await pg.keyboard.press("2"); await pg.waitForTimeout(250); }
    await pg.click("#exitBtn"); await pg.waitForTimeout(200);
    v.confere(await pg.locator("#resumeBtn").isVisible() && await pg.locator("#descartarBtn").isVisible(), "teste pela metade deveria mostrar continuar e descartar");
    pg.once("dialog", (d) => d.accept()); await pg.click("#descartarBtn"); await pg.waitForTimeout(200);
    v.confere(await pg.evaluate("!Object.keys(st.ans).length&&$('retomar').classList.contains('hidden')&&!localStorage.getItem(KEY)?.includes('\"ans\":{\"')"), "descartar deveria apagar o progresso e esconder o continuar");
    await pg.close();
  }

  // link de amigo: o resultado dele aparece antes mesmo de fazer o teste
  {
    const pg = await b.newPage({ viewport: { width: 390, height: 844 } }); pg.on("pageerror", (e) => erros.push(String(e)));
    await pg.goto(s.url + "/index.html?comparar=bf51j1n1n1p1i1h"); await pg.waitForTimeout(300);
    v.confere((await pg.locator("#friendBanner.amigo .eixo-tipico").count()) === 5, "link de amigo deveria mostrar o resultado dele com 5 eixos");
    // vindo de uma página de ideologia, com teste terminado: abre direto a comparação
    await pg.evaluate(`st=fresh('quick');${RESPONDER}(1);save()`);
    await pg.goto(s.url + "/index.html?ideologia=conservador"); await pg.waitForTimeout(400);
    v.confere(await pg.evaluate("!$('results').classList.contains('hidden')&&$('a-compideo').open&&$('compIdeoSel').value==='Conservador'"), "?ideologia= deveria abrir o resultado já comparando com a ideologia");
    await pg.close();
  }

  // retomar depois de recarregar e aviso ao trocar de modo com teste em andamento
  {
    const pg = await novaPagina();
    await pg.click('.mode[data-mode="full"]');
    if ((await pg.evaluate(telaAtual)) === "consent") await pg.click("#cSkip");
    if (await pg.evaluate("onIntro()")) await pg.click("#answers button");
    for (let i = 0; i < 4; i++) { await pg.keyboard.press("3"); await pg.waitForTimeout(260); }
    const pos = await pg.evaluate("st.cur");
    await pg.reload(); await pg.waitForTimeout(300);
    v.confere(await pg.evaluate("!$('resumeBtn').classList.contains('hidden')"), "botão de continuar deveria aparecer depois de recarregar");
    await pg.click("#resumeBtn"); await pg.waitForTimeout(200);
    v.confere((await pg.evaluate("st.cur")) === pos, "retomar deveria voltar à mesma pergunta");
    await pg.click("#exitBtn"); await pg.waitForTimeout(200);
    let aviso = null; pg.once("dialog", (d) => { aviso = d.message(); d.dismiss(); });
    await pg.click('.mode[data-mode="quick"]'); await pg.waitForTimeout(300);
    v.confere(!!aviso && (await pg.evaluate("st.mode")) === "full", "trocar de modo deveria avisar e manter o teste ao cancelar");
    await pg.close();
  }

  // B2: perguntas como a urna no computador, transição de tela, falha da imagem e aviso de erro
  {
    const pg = await novaPagina({ viewport: { width: 1280, height: 800 } });
    await pg.evaluate("st=fresh('full');st.seen=st.bs.map((_,j)=>j);st.cur=4;show('quiz');render()");
    const [vx, tx] = await pg.evaluate("[document.querySelector('#quiz .qvisor').getBoundingClientRect().left,$('answers').getBoundingClientRect().left]");
    v.confere(tx > vx + 300, "no computador, o teclado de respostas deveria ficar à direita do visor");
    v.confere(await pg.evaluate("$('quiz').classList.contains('entra')"), "troca de tela deveria ter transição");
    await pg.evaluate(`buildImage=()=>Promise.reject(new Error('falha simulada'));st=fresh('full');${RESPONDER}(1)`);
    await pg.waitForTimeout(300); await pg.evaluate("abrirImagem()"); await pg.waitForTimeout(300);
    v.confere(/Não deu pra gerar/.test(await pg.evaluate("$('shNote').textContent")), "falha na imagem deveria mostrar mensagem clara");
    v.confere(await pg.evaluate("$('shSave').classList.contains('hidden')"), "sem imagem, o botão de salvar não deveria aparecer");
    await pg.keyboard.press("Escape");
    await pg.evaluate("setTimeout(()=>{throw new Error('falha simulada')},0)"); await pg.waitForTimeout(200);
    v.confere((await pg.locator(".erro-geral").count()) === 1, "um erro inesperado deveria mostrar o aviso de recarregar");
    erros.length = 0; // os erros acima foram provocados de propósito
    // quase tudo "não tenho opinião": o teste não dá um rótulo, explica e oferece refazer
    await pg.evaluate("document.querySelectorAll('.erro-geral').forEach(e=>e.remove());st=fresh('quick');st.seen=st.bs.map((_,j)=>j);for(const id of st.base){st.ans[id]=gated(ITEMS[id])&&!gateOK(id)?'g':'x'}st.cur=seq().length;st.done=true;R=compute(st.ans);show('results');results()");
    v.confere(await pg.evaluate("$('results').classList.contains('insuficiente')&&$('insuf').offsetParent!==null&&$('ideo').offsetParent===null"), "sem respostas, deveria mostrar 'Respostas insuficientes' no lugar da ideologia");
    v.confere(/opinião em 0 de/.test(await pg.evaluate("$('insufTxt').textContent")), "a tela deveria dizer quantas perguntas tiveram opinião");
    await pg.close();
  }

  // nada escapa pros lados em telas pequenas e grandes, nos dois temas
  for (const [w, h] of [[320, 640], [820, 1100], [1280, 800]]) for (const tema of ["light", "dark"]) {
    const pg = await novaPagina({ viewport: { width: w, height: h }, colorScheme: tema });
    for (const [nome, js] of [["início", "show('intro')"], ["pergunta", "st=fresh('full');st.seen=st.bs.map((_,j)=>j);st.cur=3;show('quiz');render()"], ["resultado", `st=fresh('deep');${RESPONDER}(1);document.querySelectorAll('#results details').forEach(d=>d.open=true)`]]) {
      await pg.evaluate(js); await pg.waitForTimeout(120);
      v.confere(!(await pg.evaluate("document.documentElement.scrollWidth>innerWidth+1")), `${w}px ${tema}: ${nome} rola pros lados`);
    }
    await pg.close();
  }
  v.confere(!erros.length, "erros na página: " + [...new Set(erros)].join(" | "));
  // abertura enxuta: o que mora no menu não se repete na página; o "?" do mapa passeia sem parar
  {
    const pg = await novaPagina({ viewport: { width: 1440, height: 900 } });
    v.confere((await pg.locator("#intro .learn, #intro .atalhos, #intro .faq").count()) === 0, "abertura não deveria repetir atalhos e perguntas frequentes do menu");
    v.confere((await pg.locator(".site-nav a:not(.tecla-ok)").count()) === 0, "cabeçalho do computador deveria ter só 'Fazer o teste' e o menu");
    v.confere((await pg.locator(".garantias").isVisible()) && (await pg.locator("#como-t").isVisible()), "abertura deveria mostrar anonimato e 'Como funciona'");
    v.confere(await pg.evaluate("document.querySelector('.intro-visor').getBoundingClientRect().bottom<=1000&&document.querySelector('#como-t').closest('section').getBoundingClientRect().bottom<=1000"), "no computador, a abertura (visor, modos e 'Como funciona') deveria caber em pouco mais de uma tela");
    v.confere(await pg.evaluate("document.body.scrollHeight<=1450&&!!document.querySelector('.home-fonte a[href*=\"github.com\"]')"), "a seção de código-fonte deveria vir logo abaixo, com o link do GitHub");
    v.confere(await pg.evaluate("getComputedStyle(document.querySelector('.visor-rodape .so-pc')).display!=='none'"), "no computador, o visor deveria dizer 'ao lado'");
    const pos = async () => pg.evaluate("document.querySelector('#heroSvg .you').getAttribute('transform')");
    const vistos = new Set(); for (let i = 0; i < 5; i++) { vistos.add(await pos()); await pg.waitForTimeout(1300); }
    v.confere(vistos.size >= 4, "o '?' do mapa deveria continuar se mexendo");
    await pg.evaluate("document.dispatchEvent(new Event('tp-tema'))"); const a1 = await pos(); await pg.waitForTimeout(2600);
    v.confere(a1 !== await pos(), "depois de redesenhar o mapa (troca de tema), o '?' deveria continuar se mexendo");
    await pg.click('.mode[data-mode="quick"]'); await pg.waitForTimeout(400); const p1 = await pos(); await pg.waitForTimeout(1500);
    v.confere(p1 === await pos(), "com a abertura escondida, a animação deveria pausar");
    await pg.close();
    const calma = await novaPagina({ reducedMotion: "reduce" }); await calma.waitForTimeout(2500);
    v.confere((await calma.evaluate("document.querySelector('#heroSvg .you').getAttribute('transform')")) === "translate(170.0 117.0)", "com 'reduzir movimento', o '?' deveria ficar parado no centro");
    await calma.close();
  }

  // etapa de movimento: índice do resultado, mais distante, progresso por bloco, direção e "reduzir movimento"
  {
    const pg = await novaPagina({ viewport: { width: 1440, height: 900 } });
    await pg.evaluate(`st=fresh('full');${RESPONDER}(-1);save();results()`); await pg.waitForTimeout(300);
    const nSec = await pg.locator("#results .acc-list > details.acc").count();
    const nBlocos = await pg.locator("#resumo > .resumo-bloco[id]").count();
    v.confere(await pg.locator("#indice").isVisible() && (await pg.locator("#indice button").count()) === nSec + nBlocos, "no computador largo, o índice deveria listar os blocos do resumo e todas as seções");
    await pg.click('#indice button[data-alvo="a-candidatos"]'); await pg.waitForTimeout(300);
    v.confere(await pg.evaluate("$('results').classList.contains('completo')&&$('a-candidatos').open"), "clicar no índice deveria abrir o resultado completo na seção");
    v.confere((await pg.locator("#resumo .distante a").count()) === 1 && (await pg.locator("#matches .distante a").count()) === 1, "deveria mostrar a ideologia mais distante no resumo e nas parecidas");
    v.confere(await pg.evaluate("$('resumo').querySelector('.distante a').textContent===ideoMaisDistante().n&&ideoMaisDistante().n!==R.ranked[0].n"), "a mais distante deveria ser diferente da mais próxima");
    await pg.waitForTimeout(1500);
    v.confere(await pg.evaluate("[...document.querySelectorAll('#resumo [data-conta]')].every(e=>e.textContent===e.dataset.conta+'%')"), "as porcentagens deveriam terminar no valor certo depois de contar");
    await pg.close();
    const q = await novaPagina();
    await q.click('.mode[data-mode="full"]'); if ((await q.evaluate(telaAtual)) === "consent") await q.click("#cSkip");
    v.confere(await q.evaluate("$('barTrack').children.length===st.bs.length"), "a barra de progresso deveria ter um trecho por bloco");
    if (await q.evaluate("onIntro()")) await q.click("#answers button");
    for (let i = 0; i < 3; i++) { await q.keyboard.press("2"); await q.waitForTimeout(260); }
    v.confere(await q.evaluate("parseFloat($('barTrack').children[0].style.getPropertyValue('--f'))>0&&$('qcard').dataset.dir==='frente'"), "ao avançar, o primeiro trecho deveria encher e a frase vir da frente");
    await q.click("#backBtn"); await q.waitForTimeout(200);
    v.confere(await q.evaluate("$('qcard').dataset.dir==='volta'"), "ao voltar, a frase deveria vir do outro lado");
    await q.close();
    const c = await novaPagina({ reducedMotion: "reduce" });
    await c.evaluate(`st=fresh('quick');${RESPONDER}(1);save();results()`); await c.waitForTimeout(200);
    v.confere(await c.evaluate("!document.documentElement.classList.contains('mov')&&[...document.querySelectorAll('#resumo .resumo-bloco')].every(e=>getComputedStyle(e).opacity==='1')"), "com 'reduzir movimento', nada deveria ficar escondido esperando animação");
    await c.close();
  }

  // corrigir respostas: troca uma resposta, cancela (nada muda), troca de novo e confirma (resultado recalcula)
  {
    const pg = await novaPagina();
    await pg.evaluate(`st=fresh('full');${RESPONDER}(-1);save();results()`); await pg.waitForTimeout(300);
    const n = await pg.evaluate("frasesRespondidas().reduce((a,[,ids])=>a+ids.length,0)");
    await pg.locator(".resumo-corrigir button").click(); await pg.waitForTimeout(200);
    v.confere(await pg.evaluate("editSheet.open") && (await pg.locator(".ed-item").count()) === n && n > 100, "a correção deveria listar todas as frases respondidas");
    const id = await pg.evaluate("document.querySelectorAll('.ed-item')[0].dataset.id"), antes = await pg.evaluate(`st.ans['${id}']`);
    await pg.locator(".ed-frase").first().click(); await pg.locator(".ed-item").first().locator(".ed-opcoes button").first().click();
    v.confere(await pg.evaluate("!$('edAplicar').disabled"), "trocar uma resposta deveria liberar 'Atualizar resultado'");
    await pg.click("#edCancelar");
    v.confere((await pg.evaluate(`st.ans['${id}']`)) === antes, "cancelar não deveria mudar a resposta");
    const s0 = await pg.evaluate("JSON.stringify(R.s)"), h0 = await pg.evaluate("JSON.parse(localStorage.getItem(HKEY)).length");
    await pg.evaluate("abrirCorrecao()");
    for (let i = 0; i < 6; i++) { await pg.locator(".ed-frase").nth(i).click(); await pg.locator(".ed-item").nth(i).locator(".ed-opcoes button").first().click(); }
    await pg.click("#edAplicar"); await pg.waitForTimeout(300);
    v.confere((await pg.evaluate("JSON.stringify(R.s)")) !== s0 && await pg.evaluate("!$('edAviso').classList.contains('hidden')"), "confirmar deveria recalcular o resultado e avisar");
    v.confere((await pg.evaluate("JSON.parse(localStorage.getItem(HKEY)).length")) === h0, "corrigir não deveria criar outro item no histórico");
    v.confere(await pg.evaluate(`JSON.parse(localStorage.getItem(KEY)).ans['${id}']===st.ans['${id}']`), "a resposta corrigida deveria ficar salva no aparelho");
    await pg.close();
  }

  // glossário: o texto da frase não muda, todo termo aparece em alguma frase, e tocar mostra o significado
  {
    const pg = await novaPagina();
    const r = await pg.evaluate(() => { const d = document.createElement("div"), usados = new Set(); let mexeu = 0, com = 0;
      Object.values(ITEMS).forEach((o) => { if (typeof o.t !== "string") return; marcarTermos(d, o.t); if (d.textContent !== o.t) mexeu++;
        const ts = d.querySelectorAll(".termo"); if (ts.length) com++; ts.forEach((b) => usados.add(b.textContent.toLowerCase())); });
      const sem = GLOSSARIO.filter((g) => !g.v.some((v) => usados.has(v.toLowerCase()))).map((g) => g.t);
      return { mexeu, com, sem }; });
    v.confere(r.mexeu === 0, "marcar termos não deveria mudar o texto das frases");
    v.confere(r.sem.length === 0, "termos do glossário que não aparecem em nenhuma frase: " + r.sem.join(", "));
    v.confere(r.com >= 40, "deveria haver termos explicados em pelo menos 40 frases");
    const id = await pg.evaluate("Object.keys(ITEMS).find(k=>ITEMS[k].t&&ITEMS[k].t.includes('STF')&&ITEMS[k].f!=='l')");
    await pg.evaluate(`st=fresh('full');st.seen=st.bs.map((_,j)=>j);st.base.splice(0,0,'${id}');st.cur=0;show('quiz');render()`);
    await pg.click("#stmt .termo");
    v.confere(await pg.evaluate("!$('glossa').classList.contains('hidden')&&$('glossaT').textContent.length>0"), "tocar num termo deveria mostrar o significado");
    await pg.keyboard.press("2"); await pg.waitForTimeout(300);
    v.confere(await pg.evaluate(`st.ans['${id}']===1&&$('glossa').classList.contains('hidden')`), "responder com o termo aberto deveria funcionar e fechar a explicação");
    await pg.close();
  }

  // pensadores e figuras históricas: dados coerentes, calibração com as ideologias e a seção no resultado
  {
    const pg = await novaPagina();
    const d = await pg.evaluate(() => ({
      ruins: PENSADORES.filter((p) => AXK.filter((k) => p.p[k] !== null && p.p[k] !== undefined).length < 3 || AXK.some((k) => p.p[k] !== null && (p.p[k] < -100 || p.p[k] > 100)) || !p.j || !p.r || !p.a).map((p) => p.n),
      repetidos: PENSADORES.length - new Set(PENSADORES.map((p) => p.n)).size,
      br: PENSADORES.filter((p) => p.br).length, total: PENSADORES.length,
      top: Object.fromEntries(["Comunista", "Social-democrata", "Centrista", "Libertário", "Conservador", "Fascista"].map((n) => [n, pensadoresOrdenados(IDEO.find((o) => o.n === n).p).slice(0, 3).map((x) => x.n)])),
    }));
    v.confere(!d.ruins.length && !d.repetidos, "pensadores com dados incompletos ou repetidos: " + d.ruins.join(", "));
    v.confere(d.br >= 15 && d.total - d.br >= 15, "deveria haver pelo menos 15 brasileiros e 15 clássicos");
    const espera = { Comunista: ["Luís Carlos Prestes", "Karl Marx", "Carlos Marighella"], "Social-democrata": ["Eduard Bernstein", "John Rawls", "John Maynard Keynes"], Centrista: ["Tancredo Neves"], Libertário: ["Milton Friedman", "Robert Nozick"], Conservador: ["Edmund Burke", "Roger Scruton"], Fascista: ["Plínio Salgado"] };
    for (const [n, ns] of Object.entries(espera)) v.confere(d.top[n].some((x) => ns.includes(x)), `a posição típica de ${n} deveria ficar perto de ${ns.join(" ou ")}, mas deu ${d.top[n].join(", ")}`);
    await pg.evaluate(`st=fresh('full');${RESPONDER}(-1);save();results()`); await pg.waitForTimeout(300);
    v.confere((await pg.locator("#pensOut .pensador").count()) >= 4 && (await pg.locator("#pensOut .pens-todos .item").count()) === d.total, "a seção de pensadores deveria mostrar os mais parecidos, o mais distante e a lista completa");
    v.confere((await pg.locator("#resumo #pensOut .pensador").count()) >= 4 && (await pg.locator("#results .acc-list #pensOut").count()) === 0, "pensadores deveriam aparecer no resumo, e não no completo");
    await pg.close();
  }

  await b.close(); await s.fechar();
  return v.fim();
}
if (executandoDireto(import.meta.url)) process.exitCode = (await testarInterface()) ? 1 : 0;
