// Pensadores clássicos e figuras históricas brasileiras mais parecidos com as posições da pessoa.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// Mesma conta de semelhança dos candidatos (agree). Num eixo sem posição (tema de outra época), conta meia semelhança:
// assim quem tem menos eixos não fica artificialmente parecido com todo mundo.
const SEM_POSICAO=.5;
function semelhancaPensador(s,pf){let soma=0,tot=0;AXK.forEach((k,i)=>{const v=pf.p[k];soma+=IW[i]*(v===null||v===undefined?SEM_POSICAO:Math.max(0,1-Math.abs(s[k]-v)/100));tot+=IW[i]});
  return tot?Math.round(100*Math.pow(soma/tot,1.6)):0}
function pensadoresOrdenados(s){return PENSADORES.map(pf=>({...pf,m:semelhancaPensador(s,pf)})).sort((a,b)=>b.m-a.m)}
function cartaoPensador(pf,rot){
  const d=el("div","pensador"+(pf.m<45?" baixa":""));if(rot)d.append(el("span","rotulo",rot));
  const cab=el("div","pens-cab"),txt=el("div","pens-txt");
  const topo=el("div","row");topo.append(el("b",null,pf.n),el("span",null,`Semelhança ${matchLab(pf.m).toLowerCase()}`));
  const bar=el("div","bar"),i=el("i");i.style.width=pf.m+"%";bar.append(i);
  txt.append(topo,el("small","pens-quem",`${pf.r}, ${pf.a}`),bar);cab.append(fotoPessoa(pf.n),txt);
  d.append(cab,el("p",null,pf.j));
  const eixos=AXK.filter(k=>pf.p[k]!==null&&pf.p[k]!==undefined).map(k=>eixoMin(k));
  if(eixos.length<AXK.length)d.append(el("small","pens-eixos",`Comparado em: ${eixos.join(", ")}.`));
  return d;
}
function renderPensadores(){
  const box=$("pensOut");box.innerHTML="";const lista=pensadoresOrdenados(R.s),top=lista.slice(0,3);
  top.forEach((pf,i)=>box.append(cartaoPensador(pf,i===0?"Mais parecido com você":null)));
  const br=lista.find(pf=>pf.br),cl=lista.find(pf=>!pf.br);
  if(!top.includes(br))box.append(cartaoPensador(br,"Mais parecido entre os brasileiros"));
  if(!top.includes(cl))box.append(cartaoPensador(cl,"Mais parecido entre os pensadores clássicos"));
  box.append(cartaoPensador(lista[lista.length-1],"Mais distante de você"));
  const todos=el("details","more pens-todos");todos.append(el("summary",null,`Ver todos (${lista.length})`));
  const wrap=el("div","box");lista.forEach(pf=>wrap.append(item(pf.n,pf.m,{lab:1,note:`${pf.r}, ${pf.a}`})));todos.append(wrap);box.append(todos);
}
