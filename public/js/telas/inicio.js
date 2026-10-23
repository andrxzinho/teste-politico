// Início do teste, consentimento e tela de importância.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- início, consentimento e importância
async function start(mode){
  // teste pela metade: avisa antes de apagar o progresso
  if(!st.done&&st.cur>0&&Object.keys(st.ans).some(id=>st.ans[id]!=="g")&&!confirm(`Você tem um teste em andamento no modo ${nomeModo(st.mode)}. Começar um novo apaga esse progresso. Quer começar mesmo assim?`))return;
  retomarVisivel(false);st=fresh(mode);save();if(ONLINE)pegarDesafio();
  if(await coleta){$("cOk").checked=false;$("cMaior").checked=false;$("cAge").value="";$("cUf").value="";updConsent();show("consent")}else{show("quiz");render()}
}
const UFS=["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO","Exterior"];
UFS.forEach(u=>{const o=el("option",null,u==="Exterior"?"Moro fora do Brasil":u);o.value=u;$("cUf").append(o)});
IDEO.forEach(i=>{const o=el("option",null,i.n);o.value=i.n;$("siIde").append(o)});
// participar exige confirmar a idade (18 anos ou mais) além de aceitar os termos; quem informa menos de 18 faz o teste sem enviar nada
function updConsent(){const minor=$("cAge").value==="<18";$("cMinor").classList.toggle("hidden",!minor);$("cCheckWrap").classList.toggle("hidden",minor);$("cMaiorWrap").classList.toggle("hidden",minor);$("cGo").disabled=!minor&&!($("cOk").checked&&$("cMaior").checked)}
$("cAge").onchange=updConsent;$("cOk").onchange=updConsent;$("cMaior").onchange=updConsent;
$("cGo").onclick=()=>{const minor=$("cAge").value==="<18",aceitou=!minor&&$("cOk").checked&&$("cMaior").checked;Object.assign(st.study,{minor,ok:aceitou,ini:aceitou,idade:minor?"":$("cAge").value,uf:minor?"":$("cUf").value,t0:Date.now()});save();if(st.study.ok)evt("inicio");show("quiz");render()};
$("cSkip").onclick=()=>{Object.assign(st.study,{ok:false,minor:$("cAge").value==="<18",idade:"",uf:"",t0:Date.now()});save();show("quiz");render()};
function showImp(){
  const box=$("impOut");box.innerHTML="";
  [["E","Economia"],["A","Segurança e liberdade"],["C","Costumes"],["N","O Brasil e o mundo"]].forEach(([k,l])=>{
    const row=el("div","improw");row.append(el("b",null,l));const seg=el("div","seg");
    [["pouco","Pesa pouco"],["normal","Normal"],["muito","Pesa muito"]].forEach(([v,t])=>{const b=el("button",null,t);b.setAttribute("aria-pressed",st.imp[k]===v);b.onclick=()=>{st.imp[k]=v;save();showImp()};seg.append(b)});
    row.append(seg);box.append(row)});
  $("siEsp").value=st.si.esp||"";$("siIde").value=st.si.ide||"";show("imp");
}
$("impGo").onclick=()=>{st.si={esp:$("siEsp").value,ide:$("siIde").value};save();telaFim(()=>results())};
$("impBack").onclick=()=>{st.cur=seq().length-1;show("quiz");render()};

