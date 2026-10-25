// Janelas de informação e calibração exibida (CALIB, INFO).
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- janelas de informação da abertura
// Medido em simulações (ver MUDANCAS-v6.md): acerto da ideologia por modo e por nível de confiança, e repetição no reteste.
const CALIB={"quick":{"frases":"cerca de 65","acerto":0.942,"top2":0.984,"reteste":0.933,"conf":{"alta":{"parte":0.81,"acerto":0.951},"media":{"parte":0.157,"acerto":0.899},"baixa":{"parte":0.034,"acerto":0.941}}},"full":{"frases":"cerca de 135","acerto":0.964,"top2":0.982,"reteste":0.964,"conf":{"alta":{"parte":0.899,"acerto":0.98},"media":{"parte":0.093,"acerto":0.809},"baixa":{"parte":0.008,"acerto":1}}},"deep":{"frases":"cerca de 210","acerto":0.964,"top2":0.984,"reteste":0.96,"conf":{"alta":{"parte":0.891,"acerto":0.969},"media":{"parte":0.101,"acerto":0.922},"baixa":{"parte":0.008,"acerto":1}}}}; // média dos geradores A e B, 1.008 respondentes por modo
const de100=x=>x>=.995?"mais de 99 de cada 100":Math.round(x*100)+" de cada 100";
const INFO={
 modos:{t:"Como os modos foram testados",b:()=>{const out=[el("p",null,"Antes de publicar o teste, rodamos o cálculo com cerca de mil respondentes simulados por modo: pessoas artificiais, criadas a partir das ideias típicas de cada uma das 21 ideologias, algumas respondendo com mais cautela e outras com mais convicção. Como a ideologia de cada uma é conhecida, dá pra contar quantas vezes o teste acerta.")];
   if(CALIB){const ul=el("ul","ilist");["quick","full","deep"].forEach(m=>{const c=CALIB[m],li=el("li");li.append(el("b",null,nomeModo(m)),document.createTextNode(`A ideologia apontada estava certa pra ${de100(c.acerto)} respondentes simulados. Pra ${de100(c.top2)}, a certa aparecia entre as duas primeiras. Refazendo o teste, deu a mesma ideologia pra ${de100(c.reteste)}.`));ul.append(li)});out.push(ul)}
   out.push(el("p",null,"Isso mostra que o cálculo faz o que promete com as suas próprias regras. Não mostra quanto o teste acerta com pessoas reais: os respondentes simulados foram criados a partir das mesmas posições típicas que o teste usa pra classificar. Se essas posições estiverem um pouco erradas, o acerto cai (num teste com erro de 20 pontos nas posições, o Essencial caiu pra cerca de 8 em 10). Com pessoas reais, o acerto deve ser menor."));return out}},
 confianca:{t:"O que significa a confiança",b:()=>{const m=st.mode,c=CALIB&&CALIB[m],out=[el("p",null,"A confiança diz quão claro ficou o resultado dentro das regras do próprio teste. Ela junta três coisas: o quanto a primeira ideologia ficou à frente das outras, a precisão da sua posição nos eixos (que depende de quantas frases você respondeu) e a coerência das suas respostas. Ela não mede se o teste acerta sobre você: isso ainda não foi verificado com pessoas reais.")];
   if(c){const ul=el("ul","ilist");[["alta","Confiança alta"],["media","Confiança média"],["baixa","Confiança baixa"]].forEach(([k,l])=>{if(!c.conf[k])return;const li=el("li");li.append(el("b",null,l),document.createTextNode(`No modo ${nomeModo(m)}, ${de100(c.conf[k].parte)} respondentes simulados receberam esse nível, e entre eles a ideologia apontada estava certa pra ${de100(c.conf[k].acerto)}.`));ul.append(li)});out.push(ul)}
   out.push(el("p",null,"Nas simulações, as respostas eram coerentes de propósito. Com pessoas reais, que às vezes respondem de forma menos consistente, confiança média e baixa devem aparecer com mais frequência."),el("p",null,"Mesmo com confiança alta, o rótulo é uma aproximação: leve em conta também o perfil em palavras e os eixos. Um caso conhecido: quem responde quase tudo no meio-termo pode receber Centrista com confiança alta, porque o teste não consegue separar moderação de falta de opinião formada."));return out}},
 anonimo:{t:"O que é enviado e o que não é",b:()=>{const ul=el("ul","ilist");[["O que é enviado, se você participar","Sua ideologia, sua posição nos eixos em faixas, a resposta a cada frase, o tempo gasto em faixas e, só se você quiser, idade e estado."],
   ["O que nunca é enviado","Nome, e-mail, endereço IP, navegador, localização e a sua compatibilidade com candidatos."],
   ["O que fica só no seu aparelho","O progresso do teste e o histórico dos seus resultados."]].forEach(([b,t])=>{const li=el("li");li.append(el("b",null,b),document.createTextNode(t));ul.append(li)});
   const a=el("a","ilink","Ler os termos de uso e privacidade");a.href="termos.html";
   return [el("p",null,"Participar do estudo é opcional, e você escolhe antes de começar. Quem não participa faz o teste normalmente e nada é enviado."),ul,
     el("p",null,"Como nada que identifique você é enviado, não dá pra saber de quem é cada resultado. Quem tem menos de 18 anos pode fazer o teste, mas nada é enviado."),a]}}};
const infoSheet=$("infoSheet");
function openInfo(k){const it=INFO[k];if(!it)return;$("infoTitle").textContent=it.t;const body=$("infoBody");body.innerHTML="";body.append(...it.b());
  if(typeof infoSheet.showModal==="function")infoSheet.showModal();else infoSheet.setAttribute("open","");infoSheet.scrollTop=0}
document.querySelectorAll("[data-info]").forEach(b=>b.onclick=()=>openInfo(b.dataset.info));
$("infoClose").onclick=$("infoOk").onclick=()=>closeDlg(infoSheet);infoSheet.addEventListener("click",e=>{if(e.target===infoSheet)closeDlg(infoSheet)});

const _resultsOrig=results;results=function(){_resultsOrig.apply(this,arguments);preencherSumario();renderExtras();respostasInsuficientes()};
// com menos de 20% de respostas com opinião, um rótulo não teria sentido: mostra quanto foi respondido e oferece refazer
function respostasInsuficientes(){const insuf=!!R&&R.respondeu<INSUFICIENTE;$("results").classList.toggle("insuficiente",insuf);if(!insuf)return;
  // mesma contagem usada no cálculo (R.respondeu), pra mensagem e regra nunca divergirem
  const total=R.perguntas,deu=R.perguntas-R.semOpiniao;
  $("insufTxt").textContent=`Você deu opinião em ${deu} de ${total} perguntas. Pra calcular um resultado com sentido, o teste precisa de opinião em pelo menos ${Math.ceil(total*INSUFICIENTE)}.`}
