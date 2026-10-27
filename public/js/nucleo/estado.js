// Estado do teste (st), ordem das frases, salvar e retomar.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- estado
function order(mode,ja){
  let sd=mode==="quick"?20261104:20261101;const rnd=()=>{sd=(sd*1664525+1013904223)%4294967296;return sd/4294967296};
  const sh=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const lvl=MODOS[mode].lv,use=o=>(o.lv||2)<=lvl&&!(ja&&ja.has(o.id));
  // nos pares de simetria (mesma situação com lados trocados), cada pessoa recebe uma das versões no fim, por sorteio
  const late=new Set();PAIRS.forEach(p=>{if(p.t==="simetria")late.add(Math.random()<.5?p.a:p.b)});
  const L=[],bs=[],bk=[],last=[];
  for(const k of AXK6){const main=[],gt=[];
    for(const o of [...Q[k],...(lvl>=3?POOL.filter(o=>o.k===k):[]),...EXTRA.filter(o=>o.k===k&&!escolha(o))]){if(!use(o))continue;if(o.lt||late.has(o.id)){last.push(o.id);continue}(gated(o)?gt:main).push(o.id)}
    if(main.length||gt.length){bs.push(L.length);bk.push(k);L.push(...sh(main),...sh(gt))}}
  if(last.length){bs.push(L.length);bk.push("L");L.push(...sh(last))}
  // perguntas de escolha: as do eixo inteiro primeiro, depois as de subtema na ordem dos eixos, e os contrastes no fim
  const esc=[...LAD,...EXTRA.filter(o=>o.f==="l")].filter(use).sort((x,y)=>(x.s?1:0)-(y.s?1:0)||AXK6.indexOf(x.k)-AXK6.indexOf(y.k)).map(o=>o.id);
  const con=sh(EXTRA.filter(o=>o.f==="c"&&use(o)).map(o=>o.id));
  if(esc.length||con.length){bs.push(L.length);bk.push("R");L.push(...esc,...con)}
  return {L,bs,bk};
}
function aprofundar(){const prox=PROX[st.mode];if(!prox)return;
  const ja=new Set(Object.keys(st.ans).filter(id=>st.ans[id]!=="g")),antes=seq().filter(id=>ja.has(id)),o=order(prox,ja);
  Object.assign(st,{mode:prox,base:[...antes,...o.L],bs:o.bs.map(x=>x+antes.length),bk:o.bk,seen:[],tb:[],tbAsked:false,cur:antes.length,done:false,hist:false});
  if(st.study.sent){st.study.de=st.study.de||(prox==="full"?"quick":"full");st.study.sent=false}
  save();R=null;show("quiz");render()}
function novoId(){try{return crypto.randomUUID()}catch(e){const b=crypto.getRandomValues(new Uint8Array(16));b[6]=b[6]&15|64;b[8]=b[8]&63|128;const h=[...b].map(x=>x.toString(16).padStart(2,"0")).join("");return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`}}
// inv: metade das pessoas vê as opções das perguntas de escolha em ordem invertida, pra que a tendência de escolher a
// primeira ou a última opção não empurre ninguém sistematicamente pra um lado
function fresh(mode){const o=order(mode);return {mode,inv:Math.random()<.5,base:o.L,bs:o.bs,bk:o.bk,seen:[],tm:{},tb:[],tbAsked:false,cur:0,ans:{},imp:{E:"normal",A:"normal",C:"normal",N:"normal"},
  study:{ok:false,minor:false,idade:"",uf:"",t0:Date.now(),exp:[],sent:false,id:novoId(),ini:false},si:{esp:"",ide:""},done:false,hist:false}}
let st=fresh("full"),busy=false;
const seq=()=>st.base.concat(st.tb);
function save(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}
function load(){try{const s=JSON.parse(localStorage.getItem(KEY)||"null");if(s&&Array.isArray(s.base)&&Array.isArray(s.bs)&&s.base.every(id=>ITEMS[id])&&(s.tb||[]).every(id=>ITEMS[id])){st=s;return true}}catch(e){}return false}
function show(id){for(const s of ["intro","consent","quiz","tbintro","imp","results"])$(s).classList.toggle("hidden",s!==id);document.body.dataset.tela=id;botaoCabecalho(id);const t=$(id);t.classList.remove("entra");void t.offsetWidth;t.classList.add("entra");window.scrollTo(0,0);
  // teclado e leitor de tela: a cada troca de tela (depois que a pessoa já interagiu), o foco vai pro título da tela nova
  if(interagiu){const h=[...t.querySelectorAll("h1,h2")].find(x=>x.offsetParent!==null);if(h)focarSemRolar(h)}}
let interagiu=false;["keydown","pointerdown"].forEach(ev=>addEventListener(ev,()=>{interagiu=true},{once:true,capture:true}));
function focarSemRolar(e){if(!e.hasAttribute("tabindex"))e.setAttribute("tabindex","-1");if(document.activeElement===e)e.blur();e.focus({preventScroll:true})}


// tecla verde do cabeçalho: no resultado vira "Refazer teste" (o mesmo que a tecla CORRIGE), nas outras telas leva aos modos
function botaoCabecalho(tela){const b=document.querySelector("#site-cab .tecla-ok");if(!b)return;
  if(tela==="results"){b.textContent="Refazer teste";b.onclick=e=>{e.preventDefault();$("redoBtn").click()}}else{b.textContent="Fazer o teste";b.onclick=null}}
document.addEventListener("DOMContentLoaded",()=>botaoCabecalho(document.body.dataset.tela)); // o cabeçalho é montado depois dos scripts da página
