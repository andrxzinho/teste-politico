// Código de comparação com amigos e histórico no aparelho.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- comparar e histórico
const MCOD={quick:"q",full:"f",deep:"d"},MDEC={q:"quick",f:"full",d:"deep"};
const encode=(n,s,m)=>"b"+(MCOD[m]||"f")+IDEO.findIndex(o=>o.n===n).toString(36)+AXK6.map(k=>(s[k]+100).toString(36).padStart(2,"0")).join("");
function decode(str){const t=String(str||"");let md=null,m=t.match(/b([qfd])([0-9a-k])([0-9a-z]{12})(?![0-9a-z])/i);if(m){md=MDEC[m[1].toLowerCase()];m=[m[0],m[2],m[3]]}else m=t.match(/a([0-9a-k])([0-9a-z]{12})(?![0-9a-z])/i);if(!m)return null;const i=parseInt(m[1],36);if(!IDEO[i])return null;
  const s={};for(let j=0;j<6;j++){const v=parseInt(m[2].substr(j*2,2),36)-100;if(!(v>=-100&&v<=100))return null;s[AXK6[j]]=v}return {n:IDEO[i].n,s,m:md}}
const myLink=()=>(ONLINE?location.origin+location.pathname:"https://"+SITE+"/")+"?comparar="+encode(R.ranked[0].n,R.s,st.mode);
function renderComparar(){
  $("myCode").textContent=encode(R.ranked[0].n,R.s,st.mode);
  let fr=null;try{fr=decode(localStorage.getItem(FKEY))}catch(e){}
  if(fr)renderFriend(fr);else $("friendOut").innerHTML="";
  renderHistory();
}
$("sendCode").onclick=async()=>{const b=$("sendCode"),txt=textoCompartilhar();
  try{if(navigator.share){await navigator.share({text:txt});return}}catch(e){if(e&&e.name==="AbortError")return}
  try{await navigator.clipboard.writeText(txt);b.textContent="Copiado: é só colar"}catch(e){b.textContent="Não deu pra copiar"}setTimeout(()=>b.textContent="Enviar link",2500)};
$("friendGo").onclick=()=>{const fr=decode($("friendIn").value);if(!fr){$("friendErr").textContent="Esse link ou código não parece válido. Confira se copiou tudo, do começo ao fim.";return}
  $("friendErr").textContent="";try{localStorage.setItem(FKEY,encode(fr.n,fr.s,fr.m))}catch(e){}renderFriend(fr)};
function renderFriend(fr){
  const box=$("friendOut");box.innerHTML="";const s=R.s;
  const sim=agree(s,AXK.map(k=>fr.s[k]),IW);
  const diffs=AXK6.map(k=>[k,Math.abs(s[k]-fr.s[k])]).sort((a,b)=>a[1]-b[1]);
  const c=el("div","card box");c.style.marginTop="1rem";
  const head=el("div","item top");head.innerHTML=`<div class="row"><b>Semelhança entre vocês</b><span>${matchLab(sim)}</span></div><div class="bar"><i style="width:${sim}%"></i></div>`;
  head.append(el("small",null,`Você: ${R.ranked[0].n}${fr.m&&fr.m!==st.mode?` (modo ${nomeModo(st.mode)})`:""}. Seu amigo: ${fr.n}${fr.m&&fr.m!==st.mode?` (modo ${nomeModo(fr.m)})`:""}. Vocês mais concordam em ${eixoMin(diffs[0][0])} e mais discordam em ${eixoMin(diffs[5][0])}.`));c.append(head);
  if(fr.m&&fr.m!==st.mode)c.append(el("p","small",`Vocês fizeram modos diferentes. Dá pra comparar, porque os eixos são os mesmos, mas a posição de quem fez o modo mais curto é menos precisa.`));
  if(!fr.m)c.append(el("p","small","Esse código é de uma versão antiga do teste, que não registrava o modo. A comparação usa as posições salvas no código."));
  AXK6.forEach(k=>{const e=el("div","axis"),row=el("div","row");row.append(el("b",null,AX[k].name));e.append(row,scaleNode(s[k],fr.s[k]));const en=el("div","ends");en.append(el("span",null,AX[k].left),el("span",null,AX[k].right));e.append(en);c.append(e)});
  const lg=el("div","legend");lg.append(el("span",null,"Você"),el("span","f","Seu amigo"));c.append(lg);
  box.append(c);
}
function saveHistory(top){try{const h=JSON.parse(localStorage.getItem(HKEY)||"[]");h.unshift({d:new Date().toISOString().slice(0,10),m:st.mode,n:top.n,s:R.s});localStorage.setItem(HKEY,JSON.stringify(h.slice(0,10)))}catch(e){}}
// evolução: um trilho por eixo (de -100 a 100) com a posição em cada teste salvo neste aparelho, do mais antigo
// (círculo vazado) ao mais recente (ponto verde), e uma seta da primeira pra última posição. O texto de cada linha
// diz o mesmo em palavras (de onde pra onde), então a cor nunca é a única informação.
function evolucao(h){
  const crono=h.slice().reverse(),NS="http://www.w3.org/2000/svg",X=v=>12+(Math.max(-100,Math.min(100,v))+100)/200*276;
  const svgEl=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};
  const data=x=>{const [y,m,d]=x.d.split("-");return `${d}/${m}/${y}`};
  const w=el("div","evo");w.append(el("p","small",`Sua posição em cada eixo nos ${crono.length} testes salvos neste aparelho. Círculo vazado: o primeiro; pontos cinza: os do meio; ponto verde: o mais recente.`));
  AXK6.forEach(k=>{const vs=crono.map(x=>x.s[k]||0),ini=vs[0],fim=vs[vs.length-1],linha=el("div","evo-eixo"),topo=el("div","topo");
    const fi=band(ini,k).toLowerCase(),ff=band(fim,k).toLowerCase(),lado=(fim<ini?AX[k].left:AX[k].right).toLowerCase();
    topo.append(el("b",null,AX[k].name),el("span",null,Math.abs(fim-ini)<5?`${band(fim,k)}, sem mudança grande`:fi===ff?`${band(fim,k)}, um pouco mais pro lado “${lado}”`:`de ${fi} pra ${ff}`));
    const svg=svgEl("svg",{viewBox:"0 0 300 30",class:"evo-svg","aria-hidden":"true",focusable:"false"});
    svg.append(svgEl("line",{x1:12,x2:288,y1:20,y2:20,class:"evo-trilho"}),svgEl("line",{x1:150,x2:150,y1:14,y2:26,class:"evo-centro"}));
    if(Math.abs(fim-ini)>=5){const a=X(ini),b=X(fim),dir=b>a?1:-1;
      svg.append(svgEl("line",{x1:a,x2:b-dir*5,y1:7,y2:7,class:"evo-seta"}),svgEl("path",{d:`M${b} 7 L${b-dir*6} 3.5 L${b-dir*6} 10.5 Z`,class:"evo-ponta"}))}
    // ordem de desenho: os do meio, o mais recente e por último o primeiro (anel vazado), que fica visível mesmo em cima do verde
    const ordem=crono.map((_,i)=>i).sort((a,b)=>(a===0?2:a===crono.length-1?1:0)-(b===0?2:b===crono.length-1?1:0));
    ordem.forEach(i=>{const x=crono[i],ult=i===crono.length-1,pri=i===0,c=svgEl("circle",{cx:X(vs[i]),cy:20,r:ult?6:pri?5:3,class:ult?"evo-ult":pri?"evo-pri":"evo-meio"});
      const t=svgEl("title",{});t.textContent=`${data(x)}: ${band(vs[i],k).toLowerCase()}`;c.append(t);svg.append(c)});
    const pts=el("div","pontas");pts.setAttribute("aria-hidden","true");pts.append(el("span",null,AX[k].left),el("span",null,AX[k].right));
    linha.append(topo,svg,pts);w.append(linha)});
  return w}
function renderHistory(){const box=$("histOut");box.innerHTML="";let h=[];try{h=JSON.parse(localStorage.getItem(HKEY)||"[]")}catch(e){}
  if(!h.length){box.append(el("p","small","Nenhum resultado salvo ainda."));return}
  if(h.length>1){const ch=AXK6.map(k=>[k,(h[0].s[k]||0)-(h[1].s[k]||0)]).filter(x=>Math.abs(x[1])>=10);
    const p=el("p","small",ch.length?"Desde o resultado anterior: "+ch.map(([k,d])=>`${AX[k].name} ${d>0?"+":""}${d}`).join(", ")+".":"Seu resultado ficou parecido com o anterior.");p.style.margin=".6rem 0";box.append(p)}
  if(h.length>1)box.append(evolucao(h));
  h.forEach(x=>{const [y,m,d]=x.d.split("-");const r=el("div","hist-item");r.append(el("b",null,x.n),el("span",null,`${d}/${m}/${y}, modo ${nomeModo(x.m)}`));box.append(r)});
}

