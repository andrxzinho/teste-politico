// Seção de candidatos e compatibilidade.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- candidatos
let candRanked={},candTab="pres";
function renderCands(){
  const iw={};for(const k in st.imp)iw[k]=IMPV[st.imp[k]]||1;
  for(const k in CAND)candRanked[k]=CAND[k].list.map(c=>({...c,match:candMatch(R.s,c.p,iw)})).sort((a,b)=>b.match-a.match);
  const cn=$("candNote");cn.innerHTML="";const now=Date.now();
  if(now>=Date.parse("2026-10-26T03:00:00Z"))cn.append(el("div","note","As eleições de 2026 já terminaram. Lula (PT) foi reeleito presidente no 2º turno, em 25 de outubro. A lista mostra todos os candidatos do 1º turno, pra comparação."));
  else if(now>=Date.parse("2026-10-05T03:00:00Z"))cn.append(el("div","note","O 1º turno foi em 4 de outubro. Pra presidente, o 2º turno é em 25 de outubro. Em São Paulo, governador e senadores já foram eleitos."));
  cn.append(el("div","note","A compatibilidade compara a sua posição com uma estimativa da posição de cada candidato, e as duas têm margem de erro. Diferenças pequenas entre candidatos não querem dizer muito. Não é recomendação de voto."));
  candTab="pres";renderCand();
}
function renderCand(){
  const tabs=$("candTabs");tabs.innerHTML="";
  for(const k in CAND){const b=el("button",null,CAND[k].label);b.setAttribute("role","tab");b.setAttribute("aria-selected",k===candTab);b.onclick=()=>{candTab=k;renderCand()};tabs.append(b)}
  const out=$("candOut");out.innerHTML="";const list=candRanked[candTab];
  const note=c=>(c.b?c.b+" ":"")+(c.pe?"Posição estimada pelo partido. ":"")+(c.s==null?"Partido criado em 2025, ainda sem nota na escala dos cientistas políticos.":`Partido: ${String(c.s).replace(".",",")} numa escala de 0 (esquerda) a 10 (direita).`);
  // 2º turno: qual dos dois que disputaram está mais perto da pessoa
  const dois=list.filter(c=>c.t2);
  if(dois.length===2){const [x,y]=dois,t=Math.abs(x.match-y.match)<3?`No 2º turno, você está praticamente na mesma distância de ${x.n} e ${y.n}.`:`No 2º turno, você está mais perto de ${x.n}, com compatibilidade ${matchLab(x.match).toLowerCase()}, do que de ${y.n}, com compatibilidade ${matchLab(y.match).toLowerCase()}.`;out.append(el("p","runoff",t))}
  const nodes=list.map((c,i)=>{const e=item(c.n,c.match,{cls:i===0?"top":(c.match<35?"low":""),lab:1});if(c.st)e.querySelector("b").append(el("span","st"+(c.st==="Eleito"||c.st==="2º turno"?" on":""),c.st));
    const det=el("details","more");det.append(el("summary",null,"Ver detalhes"),el("small",null,note(c)));const g=el("div","cmp");g.append(el("span"),el("b",null,"Você"),el("b",null,"Candidato"));
    CAXK.forEach((k,j)=>{g.append(el("span",null,AX[k].name),el("span",null,short(R.s[k],k)),el("span",null,short(c.p[j],k)))});det.append(g);e.append(det);
    if(candTab==="part")return e;const w=el("div","item-foto"+(i===0?" top":""));w.append(fotoPessoa(c.n),e);return w});
  const box=el("div","card box");out.append(box);moreBlock(box,nodes,4,`Ver todos os ${list.length}`,"Ver menos",false);
  out.append(el("p","fine",CAND[candTab].extra));
}

