// Abertura e ligação dos botões. Carregado por último.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- abertura
// Mapa da abertura: as 21 ideologias pela posição típica (economia na horizontal, liberdade × ordem na vertical).
// O "?" passeia sem parar pelo mapa, de quadrante em quadrante: a pergunta da página é onde você fica.
// Pausa com a aba em segundo plano ou o mapa fora da tela; com "reduzir movimento", fica parado no centro.
const heroAnim={id:0,visivel:true,obs:null,retomar:null};
function heroMap(){
  const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const line=css("--line"),muted=css("--muted"),ink=css("--ink"),card=css("--card"),accent=css("--accent");
  const L=58,R=282,T=26,B=208,cx=(L+R)/2,cy=(T+B)/2;
  const X=e=>cx+e*(R-L)/2/100,Y=a=>cy-a*(B-T)/2/100;
  let g="";for(let i=1;i<8;i++){if(i===4)continue;const gx=L+i*(R-L)/8,gy=T+i*(B-T)/8;g+=`<line x1="${gx}" y1="${T}" x2="${gx}" y2="${B}" stroke="${line}"/><line x1="${L}" y1="${gy}" x2="${R}" y2="${gy}" stroke="${line}"/>`}
  const F='font-family="Arimo,Arial,sans-serif"';
  const T_=(x,y,t,an="middle")=>`<text x="${x}" y="${y}" text-anchor="${an}" font-size="10.5" font-weight="600" fill="${muted}" ${F}>${t}</text>`;
  const rot={Comunista:["start",7,3.5],Anarquista:["start",7,3.5],Fascista:["start",7,3.5],Anarcocapitalista:["end",-7,3.5]};
  let dots="";IDEO.forEach(o=>{const x=X(o.p.E),y=Y(o.p.A),l=rot[o.n];
    dots+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.2" fill="${ink}" opacity="${l?.85:.4}"/>`;
    if(l)dots+=`<text x="${(x+l[1]).toFixed(1)}" y="${(y+l[2]).toFixed(1)}" text-anchor="${l[0]}" font-size="10.5" font-weight="650" fill="${ink}" ${F}>${o.n}</text>`});
  $("heroSvg").innerHTML=`${g}<line x1="${cx}" y1="${T}" x2="${cx}" y2="${B}" stroke="${muted}" stroke-opacity=".5"/><line x1="${L}" y1="${cy}" x2="${R}" y2="${cy}" stroke="${muted}" stroke-opacity=".5"/>`+
    T_(cx,T-10,"Mais ordem")+T_(cx,B+18,"Mais liberdade")+T_(L-7,cy+3.5,"Esquerda","end")+T_(R+7,cy+3.5,"Direita","start")+dots+
    `<g class="you"><circle r="19" fill="${accent}" opacity=".16"/><circle r="11.5" fill="${accent}" stroke="${card}" stroke-width="3"/><text y="4.6" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" ${F}>?</text></g>`;
  const you=$("heroSvg").querySelector(".you"),put=(e,a)=>you.setAttribute("transform",`translate(${X(e).toFixed(1)} ${Y(a).toFixed(1)})`);
  const calmo=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  const id=++heroAnim.id;put(0,0);if(calmo)return;
  // roteiro: passa pelos quatro quadrantes e pelo centro, com uma pausa curta em cada ponto
  const rota=[[0,0],[-55,-30],[-30,40],[45,30],[60,-35],[15,-55],[-15,15]],ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  let k=0,t0=null,espera=0,parado=0;
  const quadro=now=>{
    if(id!==heroAnim.id)return; // o mapa foi redesenhado: este laço termina
    if(document.hidden||!heroAnim.visivel){heroAnim.retomar=()=>{t0=null;requestAnimationFrame(quadro)};return}
    if(t0===null)t0=now-parado;
    const dt=now-t0;parado=dt;
    if(dt<espera){requestAnimationFrame(quadro);return}
    const t=Math.min(1,(dt-espera)/1600),p=ease(t),[e0,a0]=rota[k],[e1,a1]=rota[(k+1)%rota.length];
    put(e0+(e1-e0)*p,a0+(a1-a0)*p);
    if(t>=1){k=(k+1)%rota.length;t0=now;parado=0;espera=700}
    requestAnimationFrame(quadro)};
  heroAnim.retomar=null;espera=900;requestAnimationFrame(quadro);
  if(!heroAnim.obs&&"IntersectionObserver" in window){heroAnim.obs=new IntersectionObserver(es=>{heroAnim.visivel=es[0].isIntersecting;if(heroAnim.visivel&&heroAnim.retomar){const r=heroAnim.retomar;heroAnim.retomar=null;r()}});heroAnim.obs.observe($("heroSvg"))}
}
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&heroAnim.retomar){const r=heroAnim.retomar;heroAnim.retomar=null;r()}});
function fitTitle(){const e=$("ideo");e.style.fontSize="";let sz=parseFloat(getComputedStyle(e).fontSize);while(e.scrollWidth>e.clientWidth+1&&sz>26){sz-=2;e.style.fontSize=sz+"px"}}
addEventListener("resize",()=>{if(!$("results").classList.contains("hidden"))fitTitle()});
function showResume(){if(!Object.keys(st.ans).length||st.done)return;const r=$("resumeBtn");r.innerHTML="";r.append(document.createTextNode("Continuar de onde parei"));
  r.append(el("span",null,`Modo ${nomeModo(st.mode)}, ${Math.round(st.cur/seq().length*100)}% feito`));retomarVisivel(true)}
document.querySelectorAll(".start").forEach(b=>b.onclick=()=>start(b.dataset.mode));
$("resumeBtn").onclick=()=>{show("quiz");render()};
$("exitBtn").onclick=()=>{save();showResume();show("intro")};
$("backBtn").onclick=()=>{if(busy)return;if(st.cur>0){st.cur=prevIdx();save();render()}};
$("skipBtn").onclick=()=>{if(!busy)pick(escolha(ITEMS[seq()[st.cur]])?"n":"x")};
$("redoBtn").onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}st=fresh("full");retomarVisivel(false);show("intro")};
// teste pela metade: dá pra jogar fora o progresso e começar do zero (o resultado de quem participa do estudo não é afetado)
function retomarVisivel(on){$("retomar").classList.toggle("hidden",!on);$("resumeBtn").classList.toggle("hidden",!on)}
$("descartarBtn").onclick=()=>{if(!confirm(`Descartar as respostas do modo ${nomeModo(st.mode)} e começar do zero? Isso não dá pra desfazer.`))return;
  try{localStorage.removeItem(KEY)}catch(e){}st=fresh("full");retomarVisivel(false);$("modos").scrollIntoView({block:"start"})};
document.addEventListener("keydown",e=>{if($("quiz").classList.contains("hidden")||sheet.open||shareSheet.open||infoSheet.open)return;if(e.key==="?"){if(!onIntro()&&!escolha(ITEMS[seq()[st.cur]]))openSheet();return}if(busy)return;if(onIntro()){if(e.key==="Enter"){const b=$("answers").querySelector("button");if(b)b.click()}return}const i="12345".indexOf(e.key);if(i>=0)pick(escolha(ITEMS[seq()[st.cur]])?(()=>{const b=$("answers").querySelectorAll("button.ans")[i];return b?+b.dataset.v:null})():[2,1,0,-1,-2][i])});
// link de comparação recebido
{const m=location.search.match(/[?&]comparar=([0-9a-z]+)/i);if(m){const fr=decode(m[1]);if(fr){try{localStorage.setItem(FKEY,encode(fr.n,fr.s,fr.m))}catch(e){}
  cartaoAmigo(fr)}else{const b=$("friendBanner");b.className="note";b.textContent="O link de comparação que você abriu está incompleto ou foi copiado errado, então não deu pra mostrar o resultado de quem mandou. Peça o link de novo ou cole o link ou o código no seu resultado, no bloco \"Compartilhar e comparar\"."}}}
// resultado de quem mandou o link, visível mesmo antes de fazer o teste
function cartaoAmigo(fr){const b=$("friendBanner");b.innerHTML="";b.className="note amigo";
  const t=el("p",null,"Resultado que te mandaram"+(fr.m?` (modo ${nomeModo(fr.m)})`:"")+":");const a=el("a",null,fr.n);a.href="/ideologias/"+slugIdeo(fr.n)+"/";const h=el("h3");h.append(a);
  const ex=el("div","eixos-tipicos");EIXOS5.forEach(k=>{const d=el("div","eixo-tipico"),topo=el("div","topo");topo.append(el("b",null,AX[k].name),el("span",null,band(fr.s[k],k)));const tr=el("div","trilho"),i=el("i");i.style.left=posEsc(fr.s[k])+"%";tr.append(i);d.append(topo,tr);ex.append(d)});
  b.append(t,h,ex,el("p",null,"Faça o teste pra ver os dois resultados lado a lado, no bloco \"Compartilhar e comparar\" do resultado."))}
// vindo da página de uma ideologia: compara direto, se já houver um teste terminado neste aparelho
$("pdfBtn").onclick=relatorioPDF;
heroMap();
const redesenhar=()=>{heroMap();if(R&&!$("results").classList.contains("hidden")){compass(R.s);prepareShare()}};
if(window.matchMedia)matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change",redesenhar);
document.addEventListener("tp-tema",redesenhar); // tema escolhido no menu
// "Fazer o teste" (/#modos): volta pra abertura e mostra os modos, de qualquer tela
function irParaModos(){if(location.hash!=="#modos")return;if($("intro").classList.contains("hidden"))show("intro");setTimeout(()=>$("modos").scrollIntoView({block:"start"}),0)}
window.addEventListener("hashchange",irParaModos);irParaModos();
// teclas de ação ao lado do visor do resultado (computador) repassam o toque pras de baixo
document.querySelectorAll("[data-clica]").forEach(b=>b.onclick=()=>$(b.dataset.clica).click());
if(load()){if(st.done)results();else showResume()}
// vindo da página de uma ideologia (?ideologia=): com teste terminado, abre a comparação; sem, convida a fazer o teste
// (roda depois de carregar o teste salvo, pra saber se ele já terminou)
{const m=location.search.match(/[?&]ideologia=([a-z0-9-]+)/);const o=m&&IDEO.find(x=>slugIdeo(x.n)===m[1]);
  if(o){if(st.done&&R&&!$("results").classList.contains("hidden")){$("compIdeoSel").value=o.n;compararIdeologia(o.n);abrirSecao("a-compideo")}
    else{const b=$("friendBanner");b.textContent=`Faça o teste pra comparar as suas posições com ${o.n}, eixo por eixo.`;b.classList.remove("hidden")}}}


