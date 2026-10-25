// Página de resultado: blocos, eixos, perfil em palavras, extremos, observações.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- blocos reutilizáveis do resultado
const matchLab=m=>m>=75?"Muito alta":m>=60?"Alta":m>=45?"Média":"Baixa";
// a ideologia cuja posição típica fica mais longe das suas posições nos eixos (entre as 21, extremas incluídas)
function ideoMaisDistante(){return IDEO.map(o=>({n:o.n,m:agree(R.s,AXK.map(k=>o.p[k]),IW)})).sort((a,b)=>a.m-b.m)[0]}
function linhaDistante(){const d=ideoMaisDistante(),p=el("p","distante");p.append(el("span","rotulo","Mais distante de você"));
  const a=el("a",null,d.n);a.href="/ideologias/"+slugIdeo(d.n)+"/";p.append(a,document.createTextNode(": a posição típica dessa ideologia é a que fica mais longe das suas respostas nos eixos."));return p}
const probLab=p=>p>=50?"Muito provável":p>=20?"Provável":p>=5?"Possível":"Pouco provável";
function item(name,pct,o={}){const e=el("div","item"+(o.cls?" "+o.cls:""));e.innerHTML=`<div class="row"><b></b><span>${o.plab?probLab(pct):o.lab?matchLab(pct):o.indice?pct+" de 100":pct+"%"}</span></div><div class="bar"><i style="width:${pct}%"></i></div>`;e.querySelector("b").textContent=name;if(o.note)e.append(el("small",null,o.note));return e}
function moreBlock(box,nodes,n,more,less="Ver menos",count=true){box.innerHTML="";nodes.slice(0,n).forEach(x=>box.append(x));if(nodes.length<=n)return;
  const rest=el("div","hidden");nodes.slice(n).forEach(x=>rest.append(x));box.append(rest);
  const lbl=()=>count?`${more} (${nodes.length-n})`:more;const b=el("button","more-btn",lbl());b.setAttribute("aria-expanded","false");
  b.onclick=()=>{const open=rest.classList.toggle("hidden")===false;b.setAttribute("aria-expanded",open);b.textContent=open?less:lbl()};box.after(b);box.__more=b}
function clearMore(box){if(box.__more){box.__more.remove();box.__more=null}}
function scaleNode(v,fv,ci){const sc=el("div","scale");if(ci){const r=el("span","ci");r.style.left=(ci[0]+100)/2+"%";r.style.width=(ci[1]-ci[0])/2+"%";sc.append(r)}if(fv!==undefined){const f=el("i","fr");f.style.left=(fv+100)/2+"%";sc.append(f)}const i=el("i");i.style.left=(v+100)/2+"%";sc.append(i);return sc}

// ---------- resultado
let R=null;
// linha de resumo de cada seção da sanfona: o dado principal fica visível com a seção fechada
function preencherSumario(){if(!R)return;const t=(id,v)=>{const e=$(id);if(e)e.textContent=v||""},r=R.ranked,s=R.s;
  t("s-perfil",($("prof").querySelector("h3")||{}).textContent);
  t("s-parecidas",r[1]?`Depois vêm ${r.slice(1,3).map(o=>o.n).join(" e ")}`:"");
  t("s-porque","As frases que mais pesaram em cada eixo");
  t("s-eixos",`${band(s.E,"E")} na economia, ${band(s.C,"C").toLowerCase()} nos costumes`);
  const EXN={com:"comunismo",anq:"anarquismo",fas:"fascismo",anc:"anarcocapitalismo"},perg=Object.keys(EXN).filter(g=>R.extAsked[g]);
  const alto=perg.filter(g=>R.ext[g]>=50).sort((x,y)=>R.ext[y]-R.ext[x]);
  t("s-extremos",!perg.length?"Frases dos extremos não perguntadas":alto.length?`Afinidade forte com o ${EXN[alto[0]]} (índice ${R.ext[alto[0]]} de 100)`:"Nenhum com índice acima de 50");
  const r2=(candRanked.pres||[]).filter(c=>c.st==="2º turno");t("s-candidatos",r2.length===2?`No 2º turno, mais perto de ${r2[0].n}`:"");
  const nn=$("resNotes").children.length,cf={alta:"Confiança alta",media:"Confiança média",baixa:"Confiança baixa"}[R.conf];t("s-notas",`${cf}. ${nn} ${nn===1?"observação":"observações"}`);
  const nh=$("histOut").querySelectorAll(".hist-item").length;t("s-hist",nh?`${nh} ${nh===1?"resultado salvo":"resultados salvos"} neste aparelho`:"");
}
function results(){
  R=compute(st.ans);const {ranked,margin}=R;const top=ranked[0];
  const two=R.two;$("ideo").textContent=two?`${top.n} / ${ranked[1].n}`:top.n;
  $("ideoDesc").textContent=two?`Duas ideologias vizinhas explicam suas respostas quase igualmente bem. ${top.d}`:top.d;
  const after=st.tb.length?" após o desempate":"";
  const lv=R.conf==="alta"?["Confiança alta"+after,""]:R.conf==="media"?[(two?"Entre duas ideologias":"Confiança média")+after,"mid"]:[(two?"Entre duas ideologias":"Confiança baixa")+after,"low"];
  $("confChip").innerHTML="";const ch=el("button","chip "+lv[1]);ch.type="button";ch.append(el("i"),document.createTextNode(lv[0]),el("span","i",""));ch.querySelector(".i").textContent="i";ch.onclick=()=>openInfo("confianca");$("confChip").append(ch);
  // resultado em sanfona: só o perfil começa aberto (as abas foram substituídas pelas seções)
  document.querySelectorAll("#results details.acc").forEach(d=>d.open=d.id==="a-perfil");
  renderResumo();renderEixos();renderExtremos();renderCands();renderPensadores();
  if(!st.hist){saveHistory(top);st.hist=true}st.done=true;save();
  renderComparar();
  shareData={top,two:!!two,ranked,s:R.s,ext:R.ext,extAsked:R.extAsked,cand:candRanked,modo:nomeModo(st.mode),conf:lv[0]};shareFile=null;prepareShare();montarPartilha();
  setupStats();show("results");fitTitle();
}
// ---------- perfil em palavras
const PROF=[
 {n:"Desenvolvimentista soberano",w:s=>s.E<=-15&&s.N>=25&&Math.abs(s.C)<25,d:"Você quer um Estado que conduza a economia, proteja a indústria e as empresas estratégicas e negocie com o mundo sem abrir mão da soberania. Nos costumes, fica perto do meio.",t:"No protecionismo e na soberania, você está mais perto de parte da direita nacionalista do que de liberais de qualquer lado."},
 {n:"Conservador popular",w:s=>s.E<=-15&&s.C>=15,d:"Você quer o governo presente no bolso: salário, programas sociais, saúde pública. Ao mesmo tempo, valoriza família, religião e tradição, e prefere que os costumes mudem devagar.",t:"Você pede um Estado forte pra proteger quem precisa, mas desconfia dele quando o assunto é valores e a educação dos filhos. É um perfil comum no Brasil e mal descrito pelos rótulos de esquerda e direita."},
 {n:"Progressista institucional",w:s=>s.E<=-15&&s.C<=-15&&s.S<=-10,d:"Você apoia ampliar direitos e serviços públicos e vê as instituições, mesmo com defeitos, como o caminho pra mudar o país.",t:"O teste pra esse perfil é defender a imparcialidade da Justiça e da imprensa também quando as decisões contrariam o seu lado."},
 {n:"Progressista crítico do sistema",w:s=>s.E<=-15&&s.C<=-15,d:"Você quer reduzir desigualdades e abrir espaço pra novos valores, mas desconfia de que as instituições, do jeito que funcionam, sirvam a quem mais precisa.",t:"A desconfiança do sistema aproxima você de gente do lado oposto, que desconfia das mesmas instituições por outros motivos."},
 {n:"Liberal de mercado e de costumes",w:s=>s.E>=15&&s.C<=-15,d:"Você confia no mercado pra gerar riqueza, se incomoda com burocracia e gasto público sem controle, e é aberto a estilos de vida diferentes.",t:"É comum, nesse perfil, defender liberdade individual em quase tudo, mas aceitar mais controle quando o tema é segurança ou desinformação."},
 {n:"Conservador de mercado",w:s=>s.E>=15&&s.C>=15,d:"Você quer menos governo na economia e mais peso pra família, religião e tradição na vida pública.",t:"É comum, nesse perfil, pedir um Estado pequeno na economia e, ao mesmo tempo, atuante pra proteger os costumes e a ordem."},
 {n:"Moderado pragmático",w:s=>Math.abs(s.E)<15&&Math.abs(s.C)<15,d:"Você não segue um pacote fechado: avalia cada tema separadamente e fica perto do meio na economia e nos costumes.",t:"Ficar no meio pode ser uma posição pensada ou falta de opinião formada sobre alguns temas. Veja nos eixos quais frases puxaram você pra cada lado."}];
function profile(){
  const {s,sub,ranked}=R,top=ranked[0];
  const p=PROF.find(x=>x.w(s))||{n:"Perfil próprio",d:AXTXT.E[s.E<=-12?"l":s.E>=12?"r":"c"]+" "+AXTXT.C[s.C<=-12?"l":s.C>=12?"r":"c"],t:"Sua combinação de posições não se encaixa num perfil comum, o que é mais frequente do que parece."};
  const extra=[];const pol=sub["A.pol"]?sub["A.pol"].v:0;
  if(pol>=30&&s.D<=-50)extra.push("Na segurança, você defende punição mais dura e respaldo à polícia, sem abrir mão de eleições, oposição livre e limites ao poder.");
  else if(pol<=-30)extra.push("Na segurança, você dá prioridade a garantias individuais e a controles sobre a polícia.");
  if(s.D>-30)extra.push("Você aceita, em algumas situações, exceções às regras democráticas pra chegar a um objetivo.");
  if(s.S>=35)extra.push("Você desconfia bastante das instituições, como Justiça, imprensa e partidos.");
  const box=$("prof");box.innerHTML="";box.append(el("h3",null,p.n),el("p",null,p.d+(extra.length?" "+extra.join(" "):"")));
  const t=el("p","tension");t.append(el("b",null,"Ponto de atenção: "),document.createTextNode(p.t));box.append(t);
  // onde a pessoa se afasta do perfil típico da ideologia mais próxima
  const dev=[];for(const id of seq()){const o=ITEMS[id],v=st.ans[id];if(typeof v!=="number"||Math.abs(v)<2||!scored(o)||o.k==="S")continue;
    const pk=top.p[o.k];if(pk===undefined||Math.abs(pk)<25)continue;if(Math.sign(v*o.d)!==Math.sign(pk))dev.push({o,v,w:Math.abs(pk)})}
  dev.sort((a,b)=>b.w-a.w);
  if(dev.length){const d=el("div","dev");d.append(el("p","lbl",`Onde você se afasta do perfil típico de ${top.n}:`));const ul=el("ul");
    dev.slice(0,3).forEach(x=>{const li=el("li",null,stmtOf(x.o));li.append(el("span",null,"Você: "+ansLabel(x.o,x.v)));ul.append(li)});d.append(ul);box.append(d)}
  box.append(el("p","fine","O rótulo ideológico é só a tradição política mais próxima. Este perfil descreve melhor a combinação das suas respostas."));
}
const SYMTXT={Z1:"um presidente reeditando medidas provisórias rejeitadas pelo Congresso",A25:"um bloqueio de rodovia num protesto pacífico"};
function renderResumo(){
  const {s,ranked,margin,unsure,noop,inc,weak,ten,sym,cons,flat,fast}=R,top=ranked[0],notes=$("resNotes");notes.innerHTML="";
  const nb=(txt,btn)=>{const d=el("div",null,txt);if(btn){const b=el("button","text-btn",btn[0]);b.onclick=btn[1];d.append(b)}notes.append(d);return d};
  const list=(d,pairs)=>{const det=el("details","more");det.append(el("summary",null,"Ver quais"));const ul=el("ul");ul.style.margin=".4rem 0 0";ul.style.paddingLeft="1.1rem";
    pairs.forEach(p=>{const li=el("li",null,`“${stmtOf(ITEMS[p.a])}” (você: ${ansLabel(ITEMS[p.a],st.ans[p.a]).toLowerCase()}) e “${stmtOf(ITEMS[p.b])}” (você: ${ansLabel(ITEMS[p.b],st.ans[p.b]).toLowerCase()})`);ul.append(li)});det.append(ul);d.append(det)};
  if(st.si.ide){if(st.si.ide===top.n)nb(`Você disse que se identifica como ${st.si.ide}, e o teste concordou.`);
    else{const o=IDEO.find(i=>i.n===st.si.ide);const m=o?agree(s,AXK.map(k=>o.p[k]),IW):0;nb(`Você disse que se identifica como ${st.si.ide}. Pelas suas respostas, a semelhança com essa ideologia é ${matchLab(m).toLowerCase()}, e com ${top.n} é ${matchLab(agree(s,AXK.map(k=>top.p[k]),IW)).toLowerCase()}. Isso é comum: muita gente se identifica com um nome antes de comparar as posições.`)}}
  else if(st.si.esp&&st.si.esp!=="Não me identifico com nenhum")nb(`Você se define como ${st.si.esp}. Na economia, suas respostas ficaram em ${band(s.E,"E").toLowerCase()}.`);
  if(R.two)nb(`${top.n} e ${ranked[1].n} ficaram com chances parecidas no cálculo. Isso pode acontecer porque sua posição fica entre as duas tradições ou porque poucas frases do teste separam as duas. Por isso o resultado mostra as duas.`);
  if(R.gam&&Math.abs(R.gam-1)>=.1)nb(R.gam>1?`Você usou a escala de concordância de forma mais suave do que as frases que escolheu nas perguntas de posição indicam. Por isso o teste ampliou seus eixos em ${Math.round((R.gam-1)*100)}%, pra que a forma de responder não puxe você pro centro.`:`Você usou a escala de concordância de forma mais forte do que as frases que escolheu nas perguntas de posição indicam. Por isso o teste reduziu seus eixos em ${Math.round((1-R.gam)*100)}%, pra que a forma de responder não empurre você pros extremos.`);
  if(top.z>2.5)nb("Seu conjunto de posições não se parece muito com nenhuma das 21 ideologias do teste. Leve em conta mais o seu perfil em palavras e os eixos do que o rótulo.");
  nb(`Precisão dos eixos: ${R.prec}. Ela depende de quantas frases você respondeu e de quanto elas combinam entre si. Distância entre as duas primeiras ideologias: ${R.lab==="entre duas"?"quase empatadas":R.lab==="clara"?"a primeira ficou bem à frente":"a primeira ficou à frente, mas sem muita folga"}.`);
  nb(R.checked<3?`Consistência das respostas: avaliação limitada. Neste modo só ${R.checked===1?"um par de frases opostas pôde ser comparado":R.checked+" pares de frases opostas puderam ser comparados"}. O modo Padrão compara cerca de 11.`:`Consistência das respostas: ${cons} de 100. Mede se você respondeu de forma coerente frases que dizem o oposto uma da outra, e se respondeu rápido demais ou sempre igual.`);
  if(inc.length){const d=nb(`Em ${inc.length===1?"um par":inc.length+" pares"} de frases que dizem coisas opostas, suas respostas apontaram pros dois lados ao mesmo tempo. Isso deixa o resultado menos preciso.`);list(d,inc)}
  const careless=flat||R.acq||inc.length>=4;
  if(R.acq){const d=nb(`Em ${weak.length} pares de frases que dizem coisas opostas, você concordou (ou discordou) das duas. Isso costuma indicar a tendência de concordar com tudo, e reduz a precisão do resultado.`);list(d,weak)}
  if(ten.length&&!careless){const d=nb("Tensão entre princípio e caso concreto: você defendeu a liberdade de dizer coisas ofensivas, mas também apoiou processar alguém por uma fala ofensiva específica. Não é um erro: indica que, pra você, o contexto pesa mais que o princípio geral.");list(d,ten)}
  const symAns=PAIRS.filter(p=>p.t==="simetria"&&typeof st.ans[p.a]==="number"&&typeof st.ans[p.b]==="number");
  sym.forEach(p=>{const d=nb(`Você julgou de forma diferente ${SYMTXT[p.a]||"a mesma situação"} conforme o lado: foi mais tolerante quando era ${p.d>0?"a esquerda":"a direita"}. Isso é muito comum. Vale pensar qual das duas respostas reflete o que você acha de verdade.`);list(d,[p])});
  if(symAns.length&&!sym.length&&!careless)nb(`Você julgou do mesmo jeito ${symAns.length>1?"as situações que apareceram":"a situação que apareceu"} com o lado político trocado. Isso indica que você avalia o comportamento, e não quem o pratica.`);
  if(flat)nb("Você deu a mesma resposta em muitas frases seguidas. Se foi no automático, o resultado pode não refletir bem o que você pensa.");
  if(fast)nb("Você respondeu muito rápido na maior parte das frases. O resultado pode estar menos preciso.");
  if(Math.abs(R.aquiesc)>=.7)nb(`Você ${R.aquiesc>0?"concordou com a maior parte":"discordou da maior parte"} das frases, inclusive das que puxam pra lados opostos. Isso costuma indicar um jeito de responder, e não uma posição política, por isso a confiança do resultado ficou ${R.conf==="baixa"?"baixa":"no máximo média"}.`);
  if(noop>.25)nb(`Você marcou “Não tenho opinião” em ${Math.round(noop*100)}% das perguntas, então o resultado pode estar menos definido que o normal.`);
  else if(unsure-noop>=.6&&top.n==="Centrista")nb(`Você ficou no meio-termo em ${Math.round((unsure-noop)*100)}% das frases. Por isso o resultado caiu no centro. Isso pode ser moderação de verdade ou falta de opinião formada sobre muitos temas, e o teste não consegue separar as duas coisas. Aqui, o rótulo Centrista diz pouco, e a confiança do resultado não pode ser alta: veja nos eixos onde você pendeu pra algum lado.`);
  else if(R.neutro>=.6)nb(`Você ficou no meio-termo em ${Math.round(R.neutro*100)}% das frases de concordância. Isso pode ser moderação ou falta de opinião formada sobre muitos temas, e o teste não consegue separar as duas coisas, por isso a confiança do resultado não pode ser alta.`);
  else if(unsure>.4)nb(`Você ficou no meio-termo em boa parte das frases. Isso não conta como falta de opinião: só indica que, em muitos temas, você não pende pra nenhum lado.`);
  if(R.espalhado>=ESPALHADO_MEDIA)nb(`Nas frases de um mesmo tema, suas respostas foram muito pros dois lados: você concordou forte com algumas e discordou forte de outras que puxam pro mesmo lado. Respostas assim se anulam e jogam o resultado pro centro, por isso a confiança ficou ${R.conf==="baixa"?"baixa":"no máximo média"}.`);
  const prox=PROX[st.mode];$("quickNote").classList.toggle("hidden",!prox);
  if(prox){const ja=new Set(Object.keys(st.ans).filter(id=>st.ans[id]!=="g")),falta=order(prox,ja).L.length;
    $("quickNoteTxt").textContent=`Você fez o modo ${nomeModo(st.mode)}. Dá pra continuar no ${nomeModo(prox)} respondendo só as cerca de ${falta} perguntas que faltam; as respostas que você já deu são aproveitadas.`;
    $("quickFull").textContent=`Continuar no modo ${nomeModo(prox)}`;$("quickFull").onclick=e=>{e.preventDefault();aprofundar()}}
  notes.classList.toggle("hidden",!notes.children.length);
  profile();renderWhy();
  const mb=$("matches");clearMore(mb);moreBlock(mb,ranked.slice(0,8).map((o,i)=>item(o.n,o.match,{cls:i===0?"top":"",plab:1})),3,"Ver mais ideologias");
  mb.append(linhaDistante());
  compass(s);
}
function stmtOf(o){return o.f==="d"?`${o.a} ou ${o.b.charAt(0).toLowerCase()+o.b.slice(1)}?`:o.t}
function renderWhy(){
  const {s,ranked}=R,top=ranked[0];
  const strong=["E","A","C","N","D"].filter(k=>Math.abs(s[k])>=12).sort((a,b)=>Math.abs(s[b])-Math.abs(s[a]));
  const nm=k=>`${AX[k].name} (${short(s[k],k).replace(/^./,c=>c.toLowerCase())})`;
  $("whySum").textContent=!strong.length?"Suas respostas ficaram equilibradas: nenhum tema puxou você com força pra um lado.":`O que mais pesou no seu resultado foi ${strong.length>1?nm(strong[0])+" e "+nm(strong[1]):nm(strong[0])}.`;
  const items=[];for(const id of seq()){const o=ITEMS[id],v=st.ans[id];if(typeof v!=="number"||v===0||!scored(o))continue;const c=v*o.d,sk=s[o.k];
    if(o.k==="S"||Math.abs(sk)<12||Math.sign(c)!==Math.sign(sk))continue;items.push({o,v,w:Math.abs(c)*(Math.abs(sk)/100+.2)})}
  items.sort((a,b)=>b.w-a.w);const per={},top3=[];for(const it of items){per[it.o.k]=per[it.o.k]||0;if(per[it.o.k]>=2)continue;per[it.o.k]++;top3.push(it);if(top3.length>=3)break}
  const nodes=top3.map(it=>{const d=el("div","why-item");d.append(el("p",null,stmtOf(it.o)),el("span",null,`Você: ${ansLabel(it.o,it.v)} (${AX[it.o.k].name})`));return d});
  const full=el("div");full.style.marginTop=nodes.length?".5rem":"0";
  AXK6.slice().sort((a,b)=>Math.abs(s[b])-Math.abs(s[a])).forEach(k=>{
    const its=[];for(const id of seq()){const o=ITEMS[id],v=st.ans[id];if(o.k!==k||typeof v!=="number"||v===0||!scored(o))continue;its.push({o,v,c:v*o.d})}
    const Rr=its.filter(x=>x.c>0).sort((a,b)=>b.c-a.c),Lf=its.filter(x=>x.c<0).sort((a,b)=>a.c-b.c);
    const d=el("div","why-axis"),h=el("h3",null,AX[k].name);h.append(el("span",null,band(s[k],k)));d.append(h);
    if(!its.length)d.append(el("p","lbl","Nenhuma resposta com opinião nesse eixo."));
    (s[k]>=0?[["right",Rr],["left",Lf]]:[["left",Lf],["right",Rr]]).forEach(([side,arr],idx)=>{if(!arr.length)return;
      d.append(el("p","lbl",(Math.abs(s[k])<12?"Puxaram pra ":idx===0?"Puxaram você pra ":"Mas estas puxaram pra ")+AX[k][side].toLowerCase()+":"));
      const ul=el("ul");arr.slice(0,idx===0?3:2).forEach(it=>{const li=el("li",null,stmtOf(it.o));li.append(el("span",null,"Você: "+ansLabel(it.o,it.v)));ul.append(li)});d.append(ul)});
    full.append(d)});
  const wb=$("why");clearMore(wb);wb.innerHTML="";
  if(!nodes.length){wb.append(full);return}
  moreBlock(wb,[...nodes,full],3,"Ver explicação completa","Ver menos",false);
}
function compass(s){
  const x=160+s.E*1.3,y=160-s.A*1.3,line=css("--line"),muted=css("--muted"),surface=css("--surface"),accent=css("--accent"),card=css("--card");
  let g="";for(let i=1;i<8;i++){const p=30+i*32.5;if(i!==4)g+=`<line x1="${p}" y1="30" x2="${p}" y2="290" stroke="${line}" stroke-width=".6"/><line x1="30" y1="${p}" x2="290" y2="${p}" stroke="${line}" stroke-width=".6"/>`}
  const T=(x,y,t,a="middle")=>`<text x="${x}" y="${y}" text-anchor="${a}" font-size="12" fill="${muted}" font-family="Arimo,Arial,sans-serif">${t}</text>`;
  const ci=R&&R.ci?R.ci:null;let rx=ci?160+ci.E[0]*1.3:0,rw=ci?(ci.E[1]-ci.E[0])*1.3:0,ry=ci?160-ci.A[1]*1.3:0,rh=ci?(ci.A[1]-ci.A[0])*1.3:0;
  // a faixa nunca fica menor que o ponto, senão some atrás dele
  if(ci){const M=38;if(rw<M){rx-=(M-rw)/2;rw=M}if(rh<M){ry-=(M-rh)/2;rh=M}rx=Math.max(30,Math.min(290-rw,rx));ry=Math.max(30,Math.min(290-rh,ry))}
  const box=ci?`<rect class="voce-faixa" x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="${Math.min(10,rw/5,rh/5).toFixed(1)}" fill="${accent}" fill-opacity=".12" stroke="${accent}" stroke-opacity=".7" stroke-dasharray="4 3"/>`:"";
  $("compassSvg").innerHTML=`<defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${accent}"/></linearGradient><radialGradient id="cgl"><stop offset="0" stop-color="${accent}" stop-opacity=".35"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs><rect x="30" y="30" width="260" height="260" rx="3" fill="${surface}"/>${g}<line x1="160" y1="30" x2="160" y2="290" stroke="${muted}" stroke-width="1.2"/><line x1="30" y1="160" x2="290" y2="160" stroke="${muted}" stroke-width="1.2"/>${T(160,20,"Mais ordem")}${T(160,309,"Mais liberdade")}${T(36,153,"Esquerda","start")}${T(284,153,"Direita","end")}${box}<g class="voce-ponto" style="--dx:${(160-x).toFixed(1)}px;--dy:${(160-y).toFixed(1)}px"><circle cx="${x}" cy="${y}" r="11" fill="url(#cg)" stroke="${card}" stroke-width="3.5"/></g>`;
}
function renderEixos(){
  const {s,sub}=R,hl=$("highlights");hl.innerHTML="";const lines=[];
  ["E","A","C","N","D"].forEach(k=>{const ks=Object.keys(SUBS[k]).filter(x=>sub[k+"."+x]&&sub[k+"."+x].n>=2);if(ks.length<2)return;
    ks.sort((a,b)=>sub[k+"."+b].v-sub[k+"."+a].v);const hi=ks[0],lo=ks[ks.length-1],vh=sub[k+"."+hi].v,vl=sub[k+"."+lo].v;
    if(vh-vl>=50&&vh>=15&&vl<=-15)lines.push(`Em ${AX[k].name.toLowerCase()}, suas respostas vão pro lado “${AX[k].right.toLowerCase()}” em ${SUBS[k][hi].toLowerCase()} e pro lado “${AX[k].left.toLowerCase()}” em ${SUBS[k][lo].toLowerCase()}.`)});
  if(lines.length){const d=el("div","note highlight");d.style.marginTop="0";d.style.marginBottom="1rem";d.append(el("b",null,"Destaques"));lines.forEach(t=>d.append(el("p",null,t)));d.querySelectorAll("p").forEach(p=>p.style.margin=".35rem 0 0");hl.append(d)}
  const out=$("axesOut");out.innerHTML="";out.classList.remove("open");
  AXK6.forEach(k=>{const v=s[k],e=el("div","axis"),row=el("div","row");row.append(el("b",null,AX[k].name),el("span",null,band(v,k)));e.append(row,scaleNode(v,undefined,R.ci[k]));
    const en=el("div","ends");en.append(el("span",null,AX[k].left),el("span",null,AX[k].right));e.append(en);
    const lo=band(R.ci[k][0],k),hi=band(R.ci[k][1],k);e.append(el("p","range",lo===hi?`Faixa provável: ${lo.toLowerCase()}`:`Faixa provável: de ${lo.toLowerCase()} a ${hi.toLowerCase()}`));
    const ks=Object.keys(SUBS[k]).filter(x=>sub[k+"."+x]);if(ks.length){const sb=el("div","subs");ks.forEach(x=>{const r=el("div","sub");r.append(el("span",null,SUBS[k][x]),scaleNode(sub[k+"."+x].v));sb.append(r)});e.append(sb)}
    const p=el("p","hidden",AXTXT[k][v<=-12?"l":v>=12?"r":"c"]);e.append(p);out.append(e)});
  const so=$("soloOut");so.innerHTML="";const solo=seq().map(id=>ITEMS[id]).filter(o=>o.nm&&o.solo&&typeof st.ans[o.id]==="number");
  if(solo.length){const c=el("div","card box");c.append(el("p","small","Fora dos eixos. Estes temas dividem as pessoas de um jeito que não cabe em nenhum eixo, então aparecem separados."));
    solo.forEach(o=>{const d=el("div","why-item");d.append(el("p",null,`${o.solo}: ${o.t}`),el("span",null,"Você: "+ansLabel(o,st.ans[o.id])));c.append(d)});so.append(c)}
  const b=$("axesTxt");b.setAttribute("aria-expanded","false");b.textContent="Ver explicação de cada eixo";
  b.onclick=()=>{const o=b.getAttribute("aria-expanded")!=="true";out.querySelectorAll(".axis > p").forEach(p=>p.classList.toggle("hidden",!o));b.setAttribute("aria-expanded",o);b.textContent=o?"Esconder explicações":"Ver explicação de cada eixo"};
}
function renderExtremos(){const th=$("thermoOut");th.innerHTML="";Object.entries(R.ext).filter(([g])=>EXT[g]).sort((a,b)=>b[1]-a[1]).forEach(([g,v])=>{
  if(!R.extAsked[g]){const e=el("div","item low");e.innerHTML=`<div class="row"><b></b><span>Não perguntado</span></div>`;e.querySelector("b").textContent=EXT[g].n;e.append(el("small",null,EXT[g].d+" As frases que definem essa ideologia só aparecem pra quem já está perto dela nos eixos, e você estava longe."));th.append(e);return}
  th.append(item(EXT[g].n,v,{note:EXT[g].d,cls:v>=GATE?"hot":"",indice:1}))})}

