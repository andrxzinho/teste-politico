// Corrigir respostas no resultado: lista das frases respondidas, por bloco; a pessoa troca o que quiser e,
// ao confirmar, o resultado é recalculado com as mesmas frases (nada é perguntado de novo).
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
const editSheet=$("editSheet");
let edMudou={}; // id -> nova resposta, só aplicada ao confirmar
// opções de resposta de uma frase, na ordem natural (a mesma lógica da tela de perguntas, sem a inversão aleatória)
function opcoesFrase(o){
  const base=o.f==="l"?o.o.map((t,i)=>[i-2,t]):o.f==="c"?[[-2,o.a],[0,"As duas, igualmente"],[2,o.b]]:o.f==="d"?optsD(o):OPTS_A;
  const sem=escolha(o)?"n":"x";return [...base,[sem,ansLabel(o,sem)]];
}
// frases que a pessoa de fato viu e respondeu (as de extremo que não abriram ficam de fora)
function frasesRespondidas(){
  const ids=seq(),grupos=[];
  st.bs.forEach((ini,b)=>{const fim=b+1<st.bs.length?st.bs[b+1]:st.base.length;
    const it=ids.slice(ini,fim).filter(id=>st.ans[id]!==undefined&&st.ans[id]!=="g");
    if(it.length)grupos.push([BLK[st.bk[b]][0],it])});
  const tb=st.tb.filter(id=>st.ans[id]!==undefined);if(tb.length)grupos.push(["Desempate",tb]);
  return grupos;
}
function abrirCorrecao(){
  edMudou={};const box=$("edLista");box.innerHTML="";let n=0;
  frasesRespondidas().forEach(([nome,ids],g)=>{
    const d=el("details","ed-bloco");if(g===0)d.open=true;
    const sm=el("summary");sm.append(el("span",null,nome),el("small",null,`${ids.length} ${ids.length===1?"frase":"frases"}`));d.append(sm);
    ids.forEach(id=>{n++;const o=ITEMS[id],it=el("div","ed-item");it.dataset.id=id;
      const topo=el("button","ed-frase");topo.type="button";topo.setAttribute("aria-expanded","false");
      topo.append(el("span","ed-n",String(n)),el("span","ed-t",stmtOf(o)),el("span","ed-r",ansLabel(o,st.ans[id])));
      const ops=el("div","ed-opcoes hidden");ops.setAttribute("role","group");ops.setAttribute("aria-label","Trocar a resposta");
      topo.onclick=()=>{const ab=ops.classList.toggle("hidden");topo.setAttribute("aria-expanded",String(!ab));if(!ab&&!ops.firstChild)montarOpcoes(o,id,ops,topo)};
      it.append(topo,ops);d.append(it)});
    box.append(d)});
  atualizarRodape();
  if(typeof editSheet.showModal==="function")editSheet.showModal();else editSheet.setAttribute("open","");editSheet.scrollTop=0;
}
function montarOpcoes(o,id,ops,topo){
  const atual=()=>id in edMudou?edMudou[id]:st.ans[id];
  opcoesFrase(o).forEach(([v,t])=>{const b=el("button",null,t);b.type="button";b.setAttribute("aria-pressed",String(atual()===v));
    b.onclick=()=>{if(v===st.ans[id])delete edMudou[id];else edMudou[id]=v;
      ops.querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
      topo.querySelector(".ed-r").textContent=ansLabel(o,v);topo.parentElement.classList.toggle("mudou",id in edMudou);atualizarRodape()};
    ops.append(b)});
}
function atualizarRodape(){const n=Object.keys(edMudou).length,b=$("edAplicar");b.disabled=!n;
  b.textContent=n?`Atualizar resultado (${n} ${n===1?"mudança":"mudanças"})`:"Atualizar resultado";}
function aplicarCorrecao(){
  const n=Object.keys(edMudou).length;if(!n)return;
  Object.assign(st.ans,edMudou);edMudou={};st.editadas=(st.editadas||0)+n;save();closeDlg(editSheet);
  const antes=R&&R.ranked[0].n;results();atualizarHistorico();
  const depois=R.ranked[0].n,av=$("edAviso");av.textContent=antes&&antes!==depois?`Resultado atualizado: agora a mais próxima é ${depois} (antes era ${antes}).`:`Resultado atualizado com ${n} ${n===1?"resposta corrigida":"respostas corrigidas"}.`;
  av.classList.remove("hidden");clearTimeout(aplicarCorrecao.t);aplicarCorrecao.t=setTimeout(()=>av.classList.add("hidden"),6000);
}
// o histórico guarda o resultado desta rodada no topo: troca pelo corrigido em vez de criar outro
function atualizarHistorico(){try{const h=JSON.parse(localStorage.getItem(HKEY)||"[]");if(!h.length)return;
  h[0]={...h[0],n:R.ranked[0].n,s:R.s};localStorage.setItem(HKEY,JSON.stringify(h))}catch(e){}}
$("edAplicar").onclick=aplicarCorrecao;
$("edCancelar").onclick=$("edClose").onclick=()=>{edMudou={};closeDlg(editSheet)};
editSheet.addEventListener("click",e=>{if(e.target===editSheet){edMudou={};closeDlg(editSheet)}});
editSheet.addEventListener("cancel",()=>{edMudou={}});
document.querySelectorAll("[data-corrigir]").forEach(b=>b.onclick=abrirCorrecao);
