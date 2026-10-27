// Seção de presidentes e partidos, com a compatibilidade (uma aba por lista em CAND).
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- presidentes e partidos
let candRanked={},candTab=Object.keys(CAND)[0];
function renderCands(){
  const iw={};for(const k in st.imp)iw[k]=IMPV[st.imp[k]]||1;
  for(const k in CAND)candRanked[k]=CAND[k].list.map(c=>({...c,match:candMatch(R.s,c.p,iw)})).sort((a,b)=>b.match-a.match);
  const cn=$("candNote");cn.innerHTML="";
  cn.append(el("div","note","A compatibilidade compara a sua posição com uma estimativa da posição de cada presidente ou partido, e as duas têm margem de erro. Diferenças pequenas não querem dizer muito. Não é recomendação de voto."));
  candTab=Object.keys(CAND)[0];renderCand();
}
function renderCand(){
  const tabs=$("candTabs");tabs.innerHTML="";tabs.style.display=Object.keys(CAND).length<2?"none":"";
  for(const k in CAND){const b=el("button",null,CAND[k].label);b.setAttribute("role","tab");b.setAttribute("aria-selected",k===candTab);b.onclick=()=>{candTab=k;renderCand()};tabs.append(b)}
  const out=$("candOut");out.innerHTML="";const list=candRanked[candTab];
  const note=c=>(c.b?c.b+" ":"")+(candTab!=="part"?"":c.s==null?"Partido criado em 2025, ainda sem nota na escala dos cientistas políticos.":`Nota ${String(c.s).replace(".",",")} numa escala de 0 (esquerda) a 10 (direita), feita por cientistas políticos.`);
  const nodes=list.map((c,i)=>{const e=item(c.n,c.match,{cls:i===0?"top":(c.match<35?"low":""),lab:1});if(c.st)e.querySelector("b").append(el("span","st",c.st));
    const det=el("details","more");det.append(el("summary",null,"Ver detalhes"),el("small",null,note(c)));const g=el("div","cmp");g.append(el("span"),el("b",null,"Você"),el("b",null,CAND[candTab].quem||"Partido"));
    CAXK.forEach((k,j)=>{g.append(el("span",null,AX[k].name),el("span",null,short(R.s[k],k)),el("span",null,short(c.p[j],k)))});det.append(g);e.append(det);
    if(candTab==="part")return e;const w=el("div","item-foto"+(i===0?" top":""));w.append(fotoPessoa(c.n),e);return w});
  const box=el("div","card box");out.append(box);moreBlock(box,nodes,4,`Ver todos os ${list.length}`,"Ver menos",false);
  out.append(el("p","fine",CAND[candTab].extra));
}

