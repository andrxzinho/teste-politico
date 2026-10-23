// Visor (número digitado), tela de FIM e som.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- visor, tela de FIM e som (visual inspirado na urna; não muda nenhuma regra)
// número da pergunta "digitado" em caixas, com cursor piscando; só anima quando o número muda
let visorUlt=null;
// como na urna, o número de caixas acompanha o tamanho do total (Essencial: 2 caixas; Padrão e Aprofundado: 3; blocos: 1)
function visorNum(n,bloco,total){const q=$("qn");q.closest(".qnum").classList.toggle("bloco",!!bloco);const t=String(n).padStart(String(Math.max(n,total||n)).length,"0"),k=(bloco?"b":"p")+t;
  if(k===visorUlt&&q.querySelector(".digito"))return;const novo=visorUlt!==null;visorUlt=k;q.textContent="";q.append(el("span","sr",(bloco?"Bloco ":"Pergunta ")+n));
  [...t].forEach((d,i)=>{const s=el("span","digito",d);s.setAttribute("aria-hidden","true");s.style.animationDelay=novo?(i*70)+"ms":"0ms";q.append(s)});const c=el("span","cursor");c.setAttribute("aria-hidden","true");q.append(c)}
const SOMK="tp-som";let somOn=false;try{somOn=localStorage.getItem(SOMK)==="1"}catch(e){}
function somUI(){document.querySelectorAll(".som").forEach(b=>{b.setAttribute("aria-pressed",String(somOn));b.querySelector("span").textContent=somOn?"Som ligado":"Som desligado"})}
// os sons são sintetizados em navegacao.js (TP_NAV.som), que carrega em todas as páginas
function somConfirma(){if(somOn&&window.TP_NAV)TP_NAV.som.confirma()}
function somTecla(){if(somOn&&window.TP_NAV)TP_NAV.som.tecla()}
// ligar o som toca o som de confirmação da urna, pra pessoa saber como ele é
document.querySelectorAll(".som").forEach(b=>b.onclick=()=>{somOn=!somOn;try{localStorage.setItem(SOMK,somOn?"1":"0")}catch(e){}somUI();somConfirma()});somUI();
// som ligado ou desligado pelo menu do site
document.addEventListener("tp-som",()=>{try{somOn=localStorage.getItem(SOMK)==="1"}catch(e){}somUI()}); // o menu já toca o som ao ligar
// tela de FIM entre o fim do teste e o resultado
function telaFim(depois){const f=$("fim"),calmo=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;f.classList.remove("hidden");
  somConfirma();setTimeout(()=>{f.classList.add("hidden");depois()},calmo?450:1350)}
