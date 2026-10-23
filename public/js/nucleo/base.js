// Utilidades, rótulos de temas e blocos, modos e montagem da lista de frases (ITEMS, CANON).
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// Aviso de erro: se algo quebrar, mostra uma mensagem clara (as respostas ficam salvas no aparelho) em vez de travar calado.
(function(){let mostrado=false;const ignorar=/ResizeObserver|Script error|extension:\/\//i;
  function avisar(msg){if(mostrado||ignorar.test(String(msg||"")))return;mostrado=true;
    const mostrar=()=>{const d=document.createElement("div");d.className="erro-geral";d.setAttribute("role","alert");
      const p=document.createElement("p");p.textContent="Algo deu errado nesta página. Suas respostas ficam salvas neste aparelho: recarregue pra continuar de onde parou.";
      const b=document.createElement("button");b.type="button";b.className="primary";b.textContent="Recarregar";b.onclick=()=>location.reload();
      d.append(p,b);document.body.append(d)};
    document.body?mostrar():addEventListener("DOMContentLoaded",mostrar)}
  addEventListener("error",e=>{if(e.target&&e.target!==window&&e.target.tagName)return;avisar(e.message)}); // falha de imagem ou fonte não conta
  addEventListener("unhandledrejection",e=>avisar(e.reason&&e.reason.message||e.reason));
})();
// ---------- dados e utilidades
const {Q,POOL,SUBS,PAIRS}=DATA,LAD=DATA.LAD||[],EXTRA=DATA.EXTRA||[],PERFIS=DATA.PERFIS||{},SUBT=DATA.SUBT||[];
// frases extremas (marcadores de comunismo, anarquismo, fascismo, anarcocapitalismo) servem só de filtro pra essas ideologias:
// fora do eixo Democracia, elas não entram na média do eixo, porque rejeitar um extremo não diz onde a pessoa fica no eixo.
const extreme=o=>o.m.some(g=>g!=="eco");
const gated=o=>o.k!=="D"&&extreme(o);
const scored=o=>!o.nm&&!gated(o);
const GATE_AX=20; // as frases de um extremo só aparecem pra quem já está a 20 pontos ou mais daquele lado do eixo
const TOPIC={"E.imp":"Impostos e benefícios","E.trab":"Trabalho","E.est":"Estado e mercado","A.pol":"Polícia e punição","A.lib":"Liberdades individuais","A.vig":"Vigilância e internet","A.arm":"Armas","C.fam":"Família e gênero","C.rel":"Religião e moral","C.div":"Diversidade e educação","N.com":"Comércio e indústria","N.sob":"Soberania e meio ambiente","N.cul":"Imigração e cultura","D.reg":"Eleições","D.rup":"Poder e governo","D.opo":"Oposição e imprensa"};
const topicOf=o=>escolha(o)?"Sua posição em resumo":TOPIC[o.k+"."+o.s]||"Instituições";
const BLK={E:["Economia e trabalho","Impostos, emprego, serviços públicos e o papel do Estado."],A:["Segurança e liberdades","Polícia, punição, internet e o que o governo pode ou não fazer."],C:["Costumes e valores","Família, religião, educação e diversidade."],N:["O Brasil e o mundo","Comércio, imigração, Amazônia e relação com outros países."],D:["Democracia e poder","Eleições, oposição e limites pra quem governa."],S:["Confiança nas instituições","Justiça, imprensa, partidos e urnas."],L:["Para fechar","Algumas últimas frases, de temas variados. Responda sem pensar no que disse antes."],R:["Sua posição em resumo","Aqui você não diz o quanto concorda: escolhe a frase que chega mais perto do que pensa. Isso ajuda o teste a separar a sua posição da força com que você costuma responder."]};
const AXK6=["E","A","C","N","D","S"];
const ITEMS={};for(const k in Q)Q[k].forEach(o=>ITEMS[o.id]={...o,k});[...POOL,...LAD,...EXTRA].forEach(o=>ITEMS[o.id]={...o});
const escolha=o=>o.f==="l"||o.f==="c"; // escolha forçada e contraste: posição sem depender da força da resposta
for(const id in ITEMS){const o=ITEMS[id];o.sc=scored(o)&&!escolha(o)}
// ordem fixa das frases nos dados gravados: as novas sempre no fim
const CANON=[...AXK6.flatMap(k=>Q[k].map(o=>o.id)),...POOL.map(o=>o.id),...LAD.map(o=>o.id),...EXTRA.map(o=>o.id)];
// modos: cada um inclui todas as frases do anterior (Essencial ⊂ Padrão ⊂ Aprofundado)
const MODOS={quick:{lv:1,nome:"Essencial"},full:{lv:2,nome:"Padrão"},deep:{lv:3,nome:"Aprofundado"}},PROX={quick:"full",full:"deep"};
const nomeModo=m=>(MODOS[m]||MODOS.full).nome;
// abaixo desta fração de perguntas respondidas com opinião, o teste não mostra uma ideologia
const INSUFICIENTE=.2;
const SITE="testepolitico.vercel.app";
const $=id=>document.getElementById(id);
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const OPTS_A=[[2,"Concordo totalmente"],[1,"Concordo"],[0,"Depende / meio-termo"],[-1,"Discordo"],[-2,"Discordo totalmente"]];
const optsD=o=>[[2,"Totalmente: "+o.la],[1,"Mais pra: "+o.la],[0,"Meio a meio"],[-1,"Mais pra: "+o.lb],[-2,"Totalmente: "+o.lb]];
const LBL_A={"2":"Concordo totalmente","1":"Concordo","0":"Depende / meio-termo","-1":"Discordo","-2":"Discordo totalmente"};
const ansLabel=(o,v)=>v==="x"?(o.f==="l"?"Nenhuma chega perto":o.f==="c"?"Nenhuma das duas":"Não tenho opinião"):o.f==="l"?o.o[v+2]:o.f==="c"?(v===-2?o.a:v===2?o.b:"As duas, igualmente"):o.f==="d"?Object.fromEntries(optsD(o))[v]:LBL_A[v];
const KEY="teste-politico-v7",HKEY="teste-politico-historico",FKEY="teste-politico-amigo";
const IMPV={pouco:.5,normal:1,muito:2};
const ONLINE=/^https?:$/.test(location.protocol);
// Modo de teste: só em links de rascunho e no computador local, ou com uma sessão de teste aberta pelo painel.
// A sessão fica neste navegador (nunca no endereço) e o servidor confere a assinatura antes de aceitar.
const SKEY="tp-sessao-teste",HOST_TEST=/--|^localhost$|^127\./.test(location.hostname);
let SESSAO=null;try{const j=JSON.parse(localStorage.getItem(SKEY)||"null");if(j&&j.token&&j.exp>Date.now())SESSAO=j;else localStorage.removeItem(SKEY)}catch(e){}
let TEST_MODE=HOST_TEST||!!SESSAO;
const coleta=ONLINE?fetch("/api/coletar",{cache:"no-store",headers:SESSAO?{"x-sessao-teste":SESSAO.token}:{}}).then(r=>r.json()).then(j=>{if(SESSAO&&!j.sessao)sairTeste();if(j.teste&&!TEST_MODE){TEST_MODE=true;badgeTeste()}return !!j.ativo}).catch(()=>false):Promise.resolve(false);
let WEIGHTS={};
if(ONLINE)fetch("/api/pesos",{cache:"no-store"}).then(r=>r.ok?r.json():{}).then(j=>{WEIGHTS=j.pesos||{}}).catch(()=>{});
function badgeTeste(){const old=document.querySelector(".testbadge");if(old)old.remove();if(!TEST_MODE||!ONLINE)return;
  const b=el("div","testbadge");b.setAttribute("role","status");b.append(el("span",null,SESSAO?`Modo teste até ${new Date(SESSAO.exp).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}`:"Modo teste"));
  b.title="Os resultados enviados daqui vão pra área de teste do painel";
  if(SESSAO){const x=el("button",null,"Sair");x.setAttribute("aria-label","Sair do modo teste");x.onclick=()=>{if(confirm("Sair do modo teste? Os próximos resultados enviados deste navegador vão pros dados reais."))sairTeste()};b.append(x)}
  document.body.append(b)}
function sairTeste(){try{localStorage.removeItem(SKEY)}catch(e){}SESSAO=null;TEST_MODE=HOST_TEST;badgeTeste()}
badgeTeste();

