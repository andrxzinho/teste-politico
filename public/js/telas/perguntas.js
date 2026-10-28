// Tela de perguntas, respostas, desempate e janela de explicação da frase.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- perguntas
let shownAt=0,ultimoCur=null;
// barra de progresso em trechos, um por bloco de tema (e um no fim pro desempate); o trecho pulsa quando o bloco termina
function desenharBarra(){
  const t=$("barTrack"),n=st.bs.length,tb=st.tb.length,partes=n+(tb?1:0);
  if(t.children.length!==partes){t.innerHTML="";for(let i=0;i<partes;i++){const sp=el("span");sp.append(el("i"));t.append(sp)}}
  [...t.children].forEach((sp,b)=>{let f;
    if(b<n){const ini=st.bs[b],fim=b+1<n?st.bs[b+1]:st.base.length;f=st.cur>=fim?1:Math.max(0,(st.cur-ini)/Math.max(1,fim-ini))}
    else f=Math.max(0,(st.cur-st.base.length)/tb);
    const cheio=f>=1,era=sp.classList.contains("cheio");sp.style.setProperty("--f",f.toFixed(3));sp.classList.toggle("cheio",cheio);
    if(cheio&&!era&&ultimoCur!==null&&st.cur>ultimoCur){sp.classList.remove("pulsa");void sp.offsetWidth;sp.classList.add("pulsa")}});
  const tot=st.base.length+tb;t.setAttribute("aria-valuenow",String(Math.round(Math.min(1,st.cur/Math.max(1,tot))*100)));
}
function direcao(){const d=ultimoCur===null||st.cur>=ultimoCur?"frente":"volta";ultimoCur=st.cur;$("qcard").dataset.dir=d}
const blockOf=i=>{if(i>=st.base.length)return -1;let b=0;st.bs.forEach((x,j)=>{if(x<=i)b=j});return b};
function render(){
  const ids=seq(),id=ids[st.cur],o=ITEMS[id],inTb=st.cur>=st.base.length,b=blockOf(st.cur);
  const box=$("answers");box.innerHTML="";
  $("explainBtn").classList.remove("hidden");$("blkDesc").classList.add("hidden");$("skipBtn").classList.remove("hidden");
  $("backBtn").style.visibility=st.cur===0?"hidden":"visible";
  // tela de abertura de cada bloco
  if(b>=0&&st.cur===st.bs[b]&&!st.seen.includes(b)){
    const [nm,ds]=BLK[st.bk[b]];visorNum(b+1,true,st.bs.length);$("vRod").textContent=matchMedia("(hover: none) and (pointer: coarse)").matches?"Toque no botão abaixo pra começar o bloco.":"Aperte Enter ou o botão abaixo pra começar o bloco.";$("qof").textContent="de "+st.bs.length;
    desenharBarra();direcao();$("tag").textContent="";$("tag").style.display="none";$("tbTag").classList.add("hidden");
    fecharTermo();$("stmt").textContent=nm;$("blkDesc").textContent=ds;$("blkDesc").classList.remove("hidden");
    $("dil").classList.add("hidden");$("explainBtn").classList.add("hidden");$("skipBtn").classList.add("hidden");
    const go=el("button","primary",b===0?"Começar":"Continuar");go.style.marginTop="0";go.onclick=()=>{st.seen.push(b);save();render()};box.append(go);
    for(const e of [$("qcard"),box]){e.classList.remove("enter");void e.offsetWidth;e.classList.add("enter")}focarPergunta();return}
  const shown=ids.filter((x,i)=>i<st.base.length&&st.ans[x]!=="g"&&!(gated(ITEMS[x])&&st.ans[x]===undefined&&i!==st.cur));
  const total=inTb?st.tb.length:shown.length,pos=inTb?st.cur-st.base.length:ids.slice(0,st.cur).filter(x=>st.ans[x]!=="g").length;
  visorNum(pos+1,false,total);$("qof").textContent="de "+total;
  desenharBarra();direcao();
  $("tag").textContent=topicOf(o);$("tag").style.display="";$("tbTag").classList.toggle("hidden",!inTb);
  marcarTermos($("stmt"),o.t);
  $("dil").classList.toggle("hidden",o.f!=="d");if(o.f==="d"){$("dilA").textContent=o.a;$("dilB").textContent=o.b}
  const lad=escolha(o);$("explainBtn").classList.toggle("hidden",lad);$("skipBtn").textContent=o.f==="l"?"Nenhuma chega perto":o.f==="c"?"Nenhuma das duas":"Não tenho opinião";
  const inv=a=>st.inv?[...a].reverse():a;
  (o.f==="l"?inv(o.o.map((t,i)=>[i-2,t])):o.f==="c"?inv([[-2,o.a],[0,"As duas, igualmente"],[2,o.b]]):o.f==="d"?optsD(o):OPTS_A).forEach(([v,l])=>{
    const b=el("button","ans"+(lad?" ladder":"")+(st.ans[id]===v?" sel":""));b.dataset.v=v;b.setAttribute("aria-pressed",st.ans[id]===v);
    b.append(el("span",null,l));if(!lad){const m=el("span","meter");m.setAttribute("aria-hidden","true");m.innerHTML="<i></i><i></i><i></i><i></i><i></i>";b.append(m)}
    b.onclick=()=>{if(busy)return;busy=true;box.querySelectorAll(".ans").forEach(x=>x.classList.remove("sel"));b.classList.add("picked");setTimeout(()=>{busy=false;pick(v)},170)};
    box.append(b)});
  $("skipBtn").classList.toggle("sel",st.ans[id]==="x"||st.ans[id]==="n");
  shownAt=Date.now();
  for(const e of [$("qcard"),box]){e.classList.remove("enter");void e.offsetWidth;e.classList.add("enter")}
  focarPergunta();
  {const n=box.querySelectorAll("button.ans").length,tm=$("stmt").querySelector(".termo");const toque=matchMedia("(hover: none) and (pointer: coarse)").matches;
    $("vRod").textContent=(n?(toque?"Toque numa resposta.":`Aperte uma tecla de 1 a ${n}.`):"")+(tm?` ${toque?"Toque":"Clique"} nos termos sublinhados pra ver o que significam.`:"")}
}
// leitor de tela: quando o botão apertado some (nova pergunta), o foco vai pro enunciado, que é lido em seguida
function focarPergunta(){const a=document.activeElement;if(!interagiu||$("quiz").classList.contains("hidden"))return;
  if(!a||a===document.body||!a.isConnected||a===$("stmt")||$("answers").contains(a))focarSemRolar($("stmt"))}
const onIntro=()=>{const b=blockOf(st.cur);return b>=0&&st.cur===st.bs[b]&&!st.seen.includes(b)};
// próxima frase: as frases de um extremo só aparecem se a posição no eixo já aponta pra aquele lado
function nextIdx(){const ids=seq();let i=st.cur+1;
  while(i<ids.length){const id=ids[i];if(i<st.base.length&&gated(ITEMS[id])){if(gateOK(id)){if(st.ans[id]==="g")delete st.ans[id];break}st.ans[id]="g";i++;continue}break}
  return i}
function prevIdx(){const ids=seq();let i=st.cur-1;while(i>0&&st.ans[ids[i]]==="g")i--;return Math.max(0,i)}
function pick(v){if(onIntro()||v===null)return;somTecla();const id=seq()[st.cur];st.ans[id]=v;
  if(shownAt&&st.tm&&st.tm[id]===undefined)st.tm[id]=Date.now()-shownAt;
  const i=nextIdx();if(i<seq().length){st.cur=i;save();render();window.scrollTo(0,0);return}save();afterLast()}
function afterLast(){
  if(!st.tbAsked){st.tbAsked=true;const r=compute(st.ans);
    if(r.two&&st.mode!=="deep"&&tbUseful(r)){const tb=pickTb(r);if(tb.length){st.tb=tb;save();
      $("tbText").textContent=`Suas respostas ficaram muito perto de duas ideologias: ${r.ranked[0].n} e ${r.ranked[1].n}. Responda mais ${tb.length} perguntas, escolhidas pra separar as duas.`;show("tbintro");return}}}
  save();showImp();
}
// Empates quase sempre vêm de a pessoa estar entre duas ideologias vizinhas, e não de falta de informação.
// Mais frases só ajudam quando a faixa provável é larga num dos eixos que separam as duas.
function tbUseful(r){const p1=r.ranked[0].p,p2=r.ranked[1].p;
  return AXK.some((k,i)=>Math.abs(p1[k]-p2[k])*IW[i]>=20&&r.hw[k]>=12)}
function pickTb(r){
  const p1=r.ranked[0].p,p2=r.ranked[1].p;
  const axes=AXK.map((k,i)=>[k,Math.abs(p1[k]-p2[k])*IW[i]]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const used=new Set(seq()),out=[],N=st.mode==="quick"?5:6;
  const lvl=MODOS[st.mode].lv,cand=k=>[...POOL.filter(o=>o.k===k).map(o=>o.id),...[...Q[k],...EXTRA].filter(o=>o.k===k&&(o.lv||2)>lvl&&ITEMS[o.id].sc&&!o.lt&&!PAIRS.some(p=>p.a===o.id||p.b===o.id)).map(o=>o.id)].filter(id=>!used.has(id)&&!out.includes(id));
  for(let round=0;round<6&&out.length<N;round++)for(const [k] of axes){const c=cand(k);if(c.length&&out.length<N)out.push(c[0])}
  return out;
}
$("tbGo").onclick=()=>{st.cur=st.base.length;save();show("quiz");render()};
$("tbSkip").onclick=()=>{st.tb=[];save();showImp()};

// ---------- explicação
const sheet=$("sheet");
function openSheet(){if(onIntro())return;const o=ITEMS[seq()[st.cur]];if(!st.study.exp.includes(o.id)){st.study.exp.push(o.id);save()}
  const d=o.f==="d";$("exTitle").textContent=d?"Entenda esta escolha":o.t;$("exText").textContent=o.e;$("exEx").textContent=o.ex;
  $("exCL").textContent=d?`Quem prefere “${o.la}” costuma pensar que`:"Quem concorda costuma pensar que";$("exC").textContent=o.c;
  $("exDL").textContent=d?`Quem prefere “${o.lb}” costuma pensar que`:"Quem discorda costuma pensar que";$("exD").textContent=o.dd;
  if(typeof sheet.showModal==="function")sheet.showModal();else sheet.setAttribute("open","");sheet.scrollTop=0}
function closeDlg(d){if(typeof d.close==="function")d.close();else d.removeAttribute("open")}
$("explainBtn").onclick=openSheet;$("exClose").onclick=$("exOk").onclick=()=>closeDlg(sheet);
sheet.addEventListener("click",e=>{if(e.target===sheet)closeDlg(sheet)});


// ---------- glossário: termos técnicos da frase viram botões; o significado aparece logo abaixo, dentro do visor
const termoRe=v=>new RegExp("(?<![\\p{L}\\p{N}])"+v.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![\\p{L}\\p{N}])",/[a-zà-ú]/.test(v)?"iu":"u");
const TERMOS=GLOSSARIO.flatMap((g,i)=>g.v.map(v=>({i,re:termoRe(v)})));
function marcarTermos(alvo,texto){
  fecharTermo();alvo.textContent="";const achados=[];
  TERMOS.forEach(({i,re})=>{const m=re.exec(texto);if(m)achados.push({i,ini:m.index,fim:m.index+m[0].length})});
  achados.sort((a,b)=>a.ini-b.ini||(b.fim-b.ini)-(a.fim-a.ini));
  let pos=0;const usados=new Set();
  achados.forEach(a=>{if(a.ini<pos||usados.has(a.i))return;usados.add(a.i);
    if(a.ini>pos)alvo.append(document.createTextNode(texto.slice(pos,a.ini)));
    // span com papel de botão (e não <button>): assim um termo longo quebra no fim da linha como o resto do texto
    const b=el("span","termo",texto.slice(a.ini,a.fim));b.setAttribute("role","button");b.tabIndex=0;b.setAttribute("aria-expanded","false");b.setAttribute("aria-controls","glossa");
    b.onclick=e=>{e.stopPropagation();abrirTermo(a.i,b)};
    b.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();e.stopPropagation();abrirTermo(a.i,b)}};alvo.append(b);pos=a.fim});
  if(pos<texto.length)alvo.append(document.createTextNode(texto.slice(pos)));
}
function abrirTermo(i,b){const g=GLOSSARIO[i],box=$("glossa"),aberto=!box.classList.contains("hidden")&&box.dataset.i===String(i);
  fecharTermo();if(aberto)return;
  $("glossaT").textContent=g.t;$("glossaD").textContent=g.d;box.dataset.i=String(i);box.classList.remove("hidden");b.setAttribute("aria-expanded","true")}
function fecharTermo(){const box=$("glossa");box.classList.add("hidden");box.dataset.i="";document.querySelectorAll("#stmt .termo").forEach(x=>x.setAttribute("aria-expanded","false"))}
$("glossaX").onclick=fecharTermo;
