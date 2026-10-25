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
  head.append(el("small",null,`Você: ${R.ranked[0].n}${fr.m&&fr.m!==st.mode?` (modo ${nomeModo(st.mode)})`:""}. Seu amigo: ${fr.n}${fr.m&&fr.m!==st.mode?` (modo ${nomeModo(fr.m)})`:""}. Vocês mais concordam em ${AX[diffs[0][0]].name.toLowerCase()} e mais discordam em ${AX[diffs[5][0]].name.toLowerCase()}.`));c.append(head);
  if(fr.m&&fr.m!==st.mode)c.append(el("p","small",`Vocês fizeram modos diferentes. Dá pra comparar, porque os eixos são os mesmos, mas a posição de quem fez o modo mais curto é menos precisa.`));
  if(!fr.m)c.append(el("p","small","Esse código é de uma versão antiga do teste, que não registrava o modo. A comparação usa as posições salvas no código."));
  AXK6.forEach(k=>{const e=el("div","axis"),row=el("div","row");row.append(el("b",null,AX[k].name));e.append(row,scaleNode(s[k],fr.s[k]));const en=el("div","ends");en.append(el("span",null,AX[k].left),el("span",null,AX[k].right));e.append(en);c.append(e)});
  const lg=el("div","legend");lg.append(el("span",null,"Você"),el("span","f","Seu amigo"));c.append(lg);
  box.append(c);
}
function saveHistory(top){try{const h=JSON.parse(localStorage.getItem(HKEY)||"[]");h.unshift({d:new Date().toISOString().slice(0,10),m:st.mode,n:top.n,s:R.s});localStorage.setItem(HKEY,JSON.stringify(h.slice(0,10)))}catch(e){}}
function renderHistory(){const box=$("histOut");box.innerHTML="";let h=[];try{h=JSON.parse(localStorage.getItem(HKEY)||"[]")}catch(e){}
  if(!h.length){box.append(el("p","small","Nenhum resultado salvo ainda."));return}
  if(h.length>1){const ch=AXK6.map(k=>[k,(h[0].s[k]||0)-(h[1].s[k]||0)]).filter(x=>Math.abs(x[1])>=10);
    const p=el("p","small",ch.length?"Desde o resultado anterior: "+ch.map(([k,d])=>`${AX[k].name} ${d>0?"+":""}${d}`).join(", ")+".":"Seu resultado ficou parecido com o anterior.");p.style.margin=".6rem 0";box.append(p)}
  h.forEach(x=>{const [y,m,d]=x.d.split("-");const r=el("div","hist-item");r.append(el("b",null,x.n),el("span",null,`${d}/${m}/${y}, modo ${nomeModo(x.m)}`));box.append(r)});
}

