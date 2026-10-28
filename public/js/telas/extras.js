// Funcionalidades da etapa C: comparar com uma ideologia, tensões e posições incomuns, leituras e relatório em PDF.
// ano de publicação: anos antes de Cristo aparecem como "c. 340 a.C."
const anoObra=a=>a<0?`c. ${-a} a.C.`:String(a);
const EIXOS5=["E","A","C","N","D"];
const slugIdeo=n=>slugFoto(n); // mesmo endereço das páginas /ideologias/<nome>/
const nomeSub=key=>{const [k,s]=key.split(".");return FORA_EIXO[key]?FORA_EIXO[key].nome:(SUBS[k]||{})[s]||key};
const distancia=d=>Math.abs(d)<15?"Perto":Math.abs(d)<35?"Um pouco diferente":"Longe";
const posEsc=v=>(Math.max(-100,Math.min(100,v))+100)/2;
function linhaComparada(nome,voce,outro,faixa){
  const w=el("div","axis"),row=el("div","row");row.append(el("b",null,nome),el("span",null,distancia(voce-outro)));
  const sc=el("div","scale");
  if(Array.isArray(faixa)){const c=el("span","ci");c.style.left=posEsc(faixa[0])+"%";c.style.width=Math.max(1,posEsc(faixa[1])-posEsc(faixa[0]))+"%";sc.append(c)}
  const a=el("i");a.style.left=posEsc(voce)+"%";const b=el("i","fr");b.style.left=posEsc(outro)+"%";sc.append(a,b);w.append(row,sc);return w}

// o que aproxima e o que afasta você de uma ideologia: os 2 eixos com a menor distância até a posição típica dela e o
// de maior distância, com o lado pra onde você fica (mesmas distâncias de "Comparar com uma ideologia")
function aproximaAfasta(o){
  const dif=EIXOS5.map(k=>({k,d:R.s[k]-(o.p[k]||0)})).sort((a,b)=>Math.abs(a.d)-Math.abs(b.d));
  const nome=x=>eixoMin(x.k),perto=dif.slice(0,2),longe=dif[dif.length-1];
  const p1=`Mais perto em ${nome(perto[0])} e ${nome(perto[1])}.`;
  if(Math.abs(longe.d)<15)return `${p1} Não fica longe em nenhum eixo.`;
  const lado=(longe.d<0?AX[longe.k].left:AX[longe.k].right).toLowerCase();
  return `${p1} Mais longe em ${nome(longe)}: você fica mais pro lado “${lado}”.`}

// 1. comparar com qualquer ideologia, eixo por eixo e subtema por subtema
function compararIdeologia(nome){
  const box=$("compIdeoOut");box.innerHTML="";const o=IDEO.find(x=>x.n===nome);if(!o||!R)return;
  const dif=EIXOS5.map(k=>({k,d:R.s[k]-(o.p[k]||0)}));
  const pertos=dif.filter(x=>Math.abs(x.d)<15).map(x=>eixoMin(x.k)),longes=dif.filter(x=>Math.abs(x.d)>=35).map(x=>eixoMin(x.k));
  const lista=a=>a.length>1?a.slice(0,-1).join(", ")+" e "+a[a.length-1]:a[0];
  const p=el("p","highlight");
  p.textContent=pertos.length&&longes.length?`Você fica perto da posição típica de ${nome} em ${lista(pertos)}, e longe em ${lista(longes)}.`:pertos.length?`Você fica perto da posição típica de ${nome} em ${lista(pertos)}, e não fica longe em nenhum eixo.`:longes.length?`Você fica longe da posição típica de ${nome} em ${lista(longes)}.`:`Você fica a uma distância média de ${nome} em todos os eixos.`;
  const leg=el("div","legend");leg.append(el("span",null,"Você"),el("span","f",nome));
  const eixos=el("div","box");EIXOS5.forEach(k=>eixos.append(linhaComparada(AX[k].name,R.s[k],o.p[k]||0,R.ci&&R.ci[k])));
  const det=el("details","more");det.append(el("summary",null,"Ver subtema por subtema"));const subs=el("div","box");
  const pf=PERFIS[nome]||[];SUBT.forEach((key,i)=>{const s=R.sub[key];if(!s||!s.n||pf[i]==null)return;subs.append(linhaComparada(nomeSub(key),s.v,pf[i]))});
  det.append(subs);const ver=el("a","more-btn","Ver o que "+nome+" defende");ver.href="/ideologias/"+slugIdeo(nome)+"/";
  box.append(p,leg,eixos,det,ver)}

// 2b. onde você foge do típico da sua ideologia: frases de concordância em que você e alguém típico dela ficariam em
// lados opostos. A resposta típica é estimada pela posição típica da ideologia no subtema da frase (a mesma que a
// classificação usa: eixo + lambda × diferença do perfil), convertida na escala de resposta como faz o motor (50 por ponto).
function divergencias(o){
  const pf=PERFIS[o.n]||[],porSub=new Map();
  for(const id of seq()){const it=ITEMS[id],v=st.ans[id];
    if(!it||typeof v!=="number"||!it.sc||escolha(it)||it.f==="d"||v===0)continue;
    const i=SUBT.indexOf(it.k+"."+it.s);if(i<0||pf[i]==null||o.p[it.k]==null)continue;
    const mu=tipicaSub(o,i),tip=Math.max(-2,Math.min(2,mu*it.d/50));
    if(Math.sign(v)===Math.sign(tip)||Math.abs(tip)<.75)continue;
    const x={id,v,tip,dist:Math.abs(v-tip),sub:it.k+"."+it.s};const ant=porSub.get(x.sub);if(!ant||x.dist>ant.dist)porSub.set(x.sub,x)}
  return [...porSub.values()].sort((a,b)=>b.dist-a.dist).slice(0,4)}
function mostrarDivergencias(){
  const o=R.ranked[0],out=$("divergeOut");out.innerHTML="";$("t-diverge").textContent=`Onde você difere de ${o.n}`;
  const lista=divergencias(o),rot=v=>(OPTS_A.find(x=>x[0]===v)||[,""])[1];
  out.append(el("p","small",`Frases em que você respondeu do lado oposto à posição típica de ${o.n}. Essa posição é uma estimativa do teste, a partir de onde essa tradição fica em cada tema, e não vem de uma pesquisa com pessoas reais. Ninguém concorda com tudo da própria tradição: isso só mostra onde as suas ideias fogem do padrão dela.`));
  if(!lista.length){out.append(el("p","note",`Em nenhuma frase você ficou do lado oposto à posição típica de ${o.n}. Nas frases que você respondeu, suas respostas seguem o padrão dela.`));$("s-diverge").textContent="Nenhuma frase do lado oposto";return 0}
  const box=el("div","box");lista.forEach(x=>{const d=el("div","item diverge");
    const tipo=(x.tip>0?"concordar":"discordar")+(Math.abs(x.tip)>=1.5?" totalmente":"");
    d.append(el("p","diverge-frase",ITEMS[x.id].t),el("p","small",`Você: ${rot(x.v).toLowerCase()}. Posição típica de ${o.n}: ${tipo}.`));box.append(d)});
  out.append(box);$("s-diverge").textContent=`${lista.length} ${lista.length===1?"frase":"frases"} do lado oposto`;return lista.length}

let ultimasTensoes=[];
// 2. tensões e posições incomuns (comparadas com as 21 tradições, não com outras pessoas)
function tensoesIncomuns(){
  const out=$("tensOut");out.innerHTML="";const itens=[];
  const inc=SUBT.map((key,i)=>{const s=R.sub[key];if(!s||!s.n)return null;let m=null;IDEO.forEach(o=>{const pv=(PERFIS[o.n]||[])[i];if(pv==null)return;const d=Math.abs(s.v-pv);if(!m||d<m.d)m={d,n:o.n}});return m&&{key,v:s.v,...m}}).filter(Boolean).sort((a,b)=>b.d-a.d);
  for(const x of inc.filter(x=>x.d>=25).slice(0,2)){const k=x.key[0],ax=FORA_EIXO[x.key]||AX[k],lado=x.v<0?ax.left:ax.right;
    itens.push(["Posição incomum",`Em ${nomeSub(x.key).toLowerCase()}, você fica bem mais pro lado "${lado.toLowerCase()}" do que qualquer uma das 21 tradições. A mais próxima é ${x.n}.`])}
  let pior=null;for(let i=0;i<EIXOS5.length;i++)for(let j=i+1;j<EIXOS5.length;j++){const a=EIXOS5[i],b=EIXOS5[j];
    const md=Math.min(...IDEO.map(o=>Math.hypot(R.s[a]-(o.p[a]||0),R.s[b]-(o.p[b]||0))));if(!pior||md>pior.md)pior={a,b,md}}
  if(pior&&pior.md>=35)itens.push(["Combinação rara",`Você combina ${band(R.s[pior.a],pior.a).toLowerCase()} em ${eixoMin(pior.a)} com ${band(R.s[pior.b],pior.b).toLowerCase()} em ${eixoMin(pior.b)}. Nenhuma das 21 tradições costuma ter essa combinação.`]);
  ultimasTensoes=itens.slice();
  if(!itens.length)itens.push(["Sem tensões fortes","Suas posições se combinam de um jeito comum entre as tradições políticas. Nenhuma combinação é rara e nenhum tema fica muito fora do padrão."]);
  itens.forEach(([t,x])=>{const d=el("div","item");d.append(el("b",null,t),el("p",null,x));out.append(d)});
  out.append(el("p","small","A comparação é com as posições típicas das 21 ideologias, não com outras pessoas. Quando o estudo tiver dados suficientes, ela poderá ser feita com quem fez o teste."));
  return itens[0][0]==="Sem tensões fortes"?0:itens.length}

// 3. leituras: obras da tradição e as críticas mais fortes a ela
let leiturasAba="favor",leiturasIdeo=null;
function mostrarLeituras(){
  const out=$("leitOut");out.innerHTML="";const n=leiturasIdeo,L=LEITURAS[n];if(!L)return;
  if(R.two){const t=el("div","tabs");t.setAttribute("role","tablist");t.setAttribute("aria-label","Ideologia");[R.ranked[0].n,R.ranked[1].n].forEach(x=>{const b=el("button",null,x);b.type="button";b.setAttribute("role","tab");b.setAttribute("aria-selected",String(x===n));b.onclick=()=>{leiturasIdeo=x;mostrarLeituras()};t.append(b)});out.append(t)}
  const abas=el("div","tabs");abas.setAttribute("role","tablist");abas.setAttribute("aria-label","Leituras");[["favor","Pra entender por dentro"],["contra","Pra entender as críticas"]].forEach(([k,t])=>{const b=el("button",null,t);b.type="button";b.setAttribute("role","tab");b.setAttribute("aria-selected",String(k===leiturasAba));b.onclick=()=>{leiturasAba=k;mostrarLeituras()};abas.append(b)});out.append(abas);
  const ext=["Comunista","Anarquista","Anarcocapitalista","Fascista","Extrema direita","Extrema esquerda"].includes(n);
  out.append(el("p","small",leiturasAba==="favor"?(ext?`Fontes históricas e textos de referência de ${n}, pra entender o que essa tradição defendeu. Não é recomendação.`:`Obras que ajudam a entender ${n} como os próprios defensores a entendem.`):"As críticas mais fortes, de lados diferentes. Conhecer o melhor argumento contrário ajuda a pensar melhor sobre o próprio."));
  L[leiturasAba].forEach(([t,a,ano,d,x])=>{const it=el("div","item livro com-capa"),tx=el("div");tx.append(el("b",null,t),el("small",null,`${a}, ${anoObra(ano)}`),el("p",null,d));if(x)tx.append(linhaEdicao(x));it.append(capaLivro(t,a),tx);out.append(it)})}
// edição citada e link conferido de cada livro (Amazon, Estante Virtual ou, sem edição brasileira, a Wikipédia)
// edição citada, link informativo (Wikipédia, editora ou Open Library) e, menor, a loja (mesma linha em ferramentas/gerar_paginas.mjs)
function linhaEdicao(x){const p=el("p","livro-ed");if(x.ed)p.append(el("span",null,x.ed));
  if(x.link){const a=el("a",null,x.onde);a.href=x.link;a.target="_blank";a.rel="noopener";p.append(a)}
  if(x.loja){const a=el("a","loja",`Loja: ${x.lojaNome}`);a.href=x.loja;a.target="_blank";a.rel="noopener";p.append(a)}return p}

// 4. relatório em PDF (impressão do navegador): abre todas as seções e volta como estava depois
function relatorioPDF(){
  const ds=[...document.querySelectorAll("#results details")],estado=ds.map(d=>d.open),eraCompleto=$("results").classList.contains("completo");ds.forEach(d=>d.open=true);setCompleto(true);
  $("soImpressao").textContent=`Teste Político. Relatório gerado em ${new Date().toLocaleDateString("pt-BR")} no modo ${nomeModo(st.mode)}. testepolitico.vercel.app`;
  const fim=()=>{ds.forEach((d,i)=>d.open=estado[i]);setCompleto(eraCompleto);removeEventListener("afterprint",fim)};addEventListener("afterprint",fim);setTimeout(()=>window.print(),60)}

function renderExtras(){
  if(!R)return;
  const sel=$("compIdeoSel");
  if(!sel.options.length)IDEO_GRUPOS.forEach(([g,l])=>{const og=document.createElement("optgroup");og.label=g;l.forEach(n=>{const op=document.createElement("option");op.value=n;op.textContent=n;og.append(op)});sel.append(og)});
  sel.value=R.ranked[1]?R.ranked[1].n:R.ranked[0].n;sel.onchange=()=>compararIdeologia(sel.value);compararIdeologia(sel.value);
  $("s-compideo").textContent="Escolha qualquer uma das 21 e veja eixo por eixo";
  const n=tensoesIncomuns();$("s-tensoes").textContent=n?`${n} ${n===1?"ponto":"pontos"} fora do padrão das tradições`:"Nenhuma tensão forte";
  mostrarDivergencias();
  leiturasIdeo=R.ranked[0].n;leiturasAba="favor";mostrarLeituras();
  montarResumo();setCompleto(false);
  if($("friendOut").children.length)setTimeout(()=>irParaBloco("blocoPartilha"),400)} // chegou por link de amigo: mostra a comparação

// resumo do resultado: o principal à vista; o completo abre pela tecla "Ver resultado completo"
function setCompleto(on){const r=$("results"),b=$("verCompleto");r.classList.toggle("completo",on);b.textContent=on?"Ver só o resumo":"Ver resultado completo";b.setAttribute("aria-expanded",String(on))}
function montarResumo(){
  // blocos fixos (pensadores, leituras, compartilhar e comparar) ficam no HTML e são encaixados aqui, na ordem do resumo
  const fixos=Object.fromEntries(["blocoPensadores","blocoLeituras","blocoPartilha"].map(id=>[id,$(id)]));
  const box=$("resumo");box.innerHTML="";const bloco=(t,id)=>{const d=el("section","resumo-bloco");if(id)d.id=id;d.append(el("h2",null,t));box.append(d);return d};
  const eixos=bloco("Seus eixos","blocoEixos"),ex=el("div","eixos-tipicos");
  AXK6.forEach(k=>{const d=el("div","eixo-tipico"),topo=el("div","topo");topo.append(el("b",null,AX[k].name),el("span",null,band(R.s[k],k)));
    const tr=el("div","trilho"),i=el("i");i.style.left=posEsc(R.s[k])+"%";tr.append(i);const pts=el("div","pontas");pts.setAttribute("aria-hidden","true");pts.append(el("span",null,AX[k].left),el("span",null,AX[k].right));d.append(topo,tr,pts);ex.append(d)});
  eixos.append(ex);
  const prox=bloco("Ideologias que melhor explicam suas respostas","blocoIdeologias");
  prox.append(el("p","small nota-prob","A porcentagem é a chance de cada ideologia dentro do modelo do teste, comparando as 21 entre si. Não é o quanto você concorda com ela."));
  R.ranked.slice(0,3).forEach(o=>{const a=el("a","resumo-ideo");a.href="/ideologias/"+slugIdeo(o.n)+"/";const p=Math.round(o.prob*100);
    const pc=el("span",null,p<1?"menos de 1%":p+"%");if(p>=1){pc.dataset.conta=p;pc.dataset.sufixo="%"}
    a.append(el("b",null,o.n),pc);const b=el("i");b.style.setProperty("--p",Math.max(2,p)+"%");a.append(b);prox.append(a,el("p","ideo-eixos",aproximaAfasta(o)))});
  prox.append(linhaDistante());
  // destaques: presidente mais perto, afinidade forte com extremos e a principal tensão
  const dest=[],pr1=(candRanked.pres||[])[0];
  if(pr1)dest.push(`Entre os presidentes desde 1985, você está mais perto de ${pr1.n} (${pr1.st}), com compatibilidade ${matchLab(pr1.match).toLowerCase()}.`);
  Object.keys(EXT).filter(g=>R.extAsked&&R.extAsked[g]&&R.ext[g]>=GATE).forEach(g=>dest.push(`Afinidade forte com ${EXT[g].n.toLowerCase()}: índice ${R.ext[g]} de 100.`));
  if(ultimasTensoes.length)dest.push(ultimasTensoes[0][1]);
  if(dest.length){const d=bloco("Destaques","blocoDestaques");const ul=el("ul","destaques");dest.forEach(x=>ul.append(el("li",null,x)));d.append(ul)}
  box.append(fixos.blocoPensadores,fixos.blocoLeituras,fixos.blocoPartilha);
  const cr=bloco("Clicou errado?","blocoCorrigir");cr.classList.add("resumo-corrigir");cr.append(el("p","small","Dá pra trocar qualquer resposta e ver o resultado recalculado, sem refazer o teste."));
  const bcr=el("button","secondary","Corrigir respostas");bcr.type="button";bcr.onclick=()=>abrirCorrecao();cr.append(bcr);
  if(window.TP_NAV){TP_NAV.revelar(box.children);TP_NAV.revelar(document.querySelectorAll("#results .acc-list > details.acc"))}
  montarIndice();
}
function irParaBloco(id){const e=$(id);if(e)e.scrollIntoView({block:"start",behavior:window.TP_NAV&&TP_NAV.calmo()?"auto":"smooth"})}
$("copiarLink").onclick=async()=>{const b=$("copiarLink");try{await navigator.clipboard.writeText(myLink());b.textContent="Link copiado"}catch(e){b.textContent="Não deu pra copiar"}setTimeout(()=>b.textContent="Copiar link",2000)};
// índice do resultado (computador largo): resumo e cada seção; marca a que está na tela
let indiceObs=null;
function montarIndice(){
  const nav=$("indice");nav.innerHTML="";nav.append(el("p","rotulo","Nesta página"));
  const itens=[...[...document.querySelectorAll("#resumo > .resumo-bloco[id]")].map(d=>[d.id,d.querySelector("h2").textContent]),...[...document.querySelectorAll("#results .acc-list > details.acc")].map(d=>[d.id,d.querySelector(".acc-t").textContent])];
  itens.forEach(([id,t])=>{const b=el("button",null,t);b.type="button";b.dataset.alvo=id;
    b.onclick=()=>{if(id.startsWith("bloco"))irParaBloco(id);else abrirSecao(id)};nav.append(b)});
  nav.querySelector('[data-alvo="a-perfil"]')?.insertAdjacentElement("beforebegin",el("p","rotulo indice-sep","Resultado completo"));
  if(indiceObs)indiceObs.disconnect();if(!("IntersectionObserver" in window))return;
  const marcar=id=>nav.querySelectorAll("button").forEach(b=>b.setAttribute("aria-current",String(b.dataset.alvo===id)));
  const vis=new Map();indiceObs=new IntersectionObserver(es=>{es.forEach(x=>vis.set(x.target.id,x.isIntersecting?x.boundingClientRect.top:null));
    const on=itens.map(([id])=>[id,vis.get(id)]).filter(([,t])=>t!==null&&t!==undefined);if(on.length)marcar(on[0][0])},{rootMargin:"-80px 0px -55% 0px"});
  itens.forEach(([id])=>indiceObs.observe($(id)));marcar(itens[0][0]);
}
// barra fina no topo: quanto do resultado já foi lido
{const barra=document.querySelector(".leitura");let pedido=false;
  const atualizar=()=>{pedido=false;if(document.body.dataset.tela!=="results")return;const max=document.documentElement.scrollHeight-innerHeight;barra.style.setProperty("--lido",max>0?Math.min(1,scrollY/max).toFixed(4):"0")};
  addEventListener("scroll",()=>{if(!pedido){pedido=true;requestAnimationFrame(atualizar)}},{passive:true});addEventListener("resize",atualizar)}
function abrirSecao(id){setCompleto(true);const d=$(id);d.open=true;setTimeout(()=>d.scrollIntoView({block:"start"}),60)}
$("verCompleto").onclick=()=>{const on=!$("results").classList.contains("completo");setCompleto(on);if(on)setTimeout(()=>$("verCompleto").scrollIntoView({block:"start"}),60)};
$("shareBtn").onclick=()=>irParaBloco("blocoPartilha");
