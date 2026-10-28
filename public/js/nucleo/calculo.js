// Classificação: probabilidade de cada ideologia, filtros dos extremos, confiança e consistência.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- cálculo
// Classificação: em cada subtema, a distância entre a sua posição e a posição típica de cada ideologia é medida em
// relação à margem de erro da sua posição (que depende do modo e da coerência das respostas) mais a variação natural
// dentro de cada ideologia (TAU). Daí sai a probabilidade de cada ideologia entre as que passam pelos filtros.
// lambda: quanto a classificação confia nas diferenças entre subtemas dos perfis (1 = totalmente, 0 = só a posição do eixo)
// temp: temperatura da probabilidade (versão 4). Divide a evidência antes de virar porcentagem, pra que a chance mostrada
// da 1ª ideologia fique perto da taxa de acerto quando os perfis teóricos estão errados em cerca de 20 pontos
// (simulação em docs/METODOLOGIA.md). Não muda a ordem das ideologias, só o quanto a 1ª se destaca.
const CLS={tau:25,lambda:.5,contraste:1.5,marcadoras:.8,temp:1.5};
// posição típica de uma ideologia num subtema: entre a do eixo e a do perfil (lambda); nos subtemas fora do eixo
// (meio ambiente), é a do próprio perfil, porque a posição do eixo não diz nada sobre eles
const tipicaSub=(o,i)=>{const pf=PERFIS[o.n]||[],key=SUBT[i];if(Motor.CFG.fora.includes(key))return pf[i];const b=o.p[key[0]];return b+CLS.lambda*(pf[i]-b)};
// Concordância esperada com as frases que definem cada extremo: a própria ideologia concorda (+1,5) e todas as outras
// discordam igualmente (-1,5). Isso só separa o extremo das demais, sem favorecer nenhuma ideologia não extrema.
// Vale igual pros quatro extremos, à esquerda e à direita.
const marcaEsperada=(o,g)=>o.g===g?1.5:-1.5; // escolhidos pelo pior caso entre dois geradores de respondentes (MUDANCAS-v6.md)
function compute(A){
  const mk={com:[],anq:[],fas:[],anc:[],eco:[]};let unsure=0,asked=0,noop=0;const ids=seq();
  for(const id of ids){const o=ITEMS[id],v=A[id];if(v==="g"||v===undefined)continue;asked++;
    // "Nenhuma chega perto" e "Nenhuma das duas" (n) são resposta, não falta de opinião: só não entram no cálculo
    if(v==="n")continue;
    if(typeof v!=="number"){unsure++;noop++;continue}if(v===0&&!escolha(o))unsure++;
    o.m.forEach(g=>mk[g]&&mk[g].push(o.mi?-v:v))}
  const M=Motor.calcular(A,ITEMS,ids,WEIGHTS),s=M.s,ci=M.ci,hw=M.hw,gam=M.gam;
  const sub={};for(const key in M.sub)if(!key.endsWith(".-"))sub[key]={v:Math.round(M.sub[key].v),n:M.sub[key].n};
  const asked_={};for(const g in mk)asked_[g]=mk[g].length>0;
  // adesão às frases que definem a ideologia: concordar em média (1 de 2) já vale 2/3; "concordo totalmente" em média (1,5+) vale tudo
  const ext={};for(const g in mk){const avg=mk[g].length?mk[g].reduce((a,b)=>a+b,0)/mk[g].length:0;const marker=Math.min(1,Math.max(0,avg)/1.5);
    const ks=Object.keys(EXTP[g]);const fit=ks.reduce((a,k)=>a+Math.max(0,1-Math.abs(s[k]-EXTP[g][k])/100),0)/ks.length;ext[g]=Math.round(100*marker*(.35+.65*fit))}
  // contrastes: probabilidade de escolher cada frase, dada a posição típica da ideologia naquele subtema
  const cts=ids.filter(id=>ITEMS[id].f==="c"&&typeof A[id]==="number"&&A[id]!==-1&&A[id]!==1);
  const ll=IDEO.map(o=>{const mu=i=>tipicaSub(o,i);let L=0,z=0,nd=0;SUBT.forEach((key,i)=>{const x=M.sub[key];if(!x)return;const v2=x.se*x.se+CLS.tau*CLS.tau,d=x.v-mu(i);L-=d*d/(2*v2);z+=d*d/v2;nd++});
    cts.forEach(id=>{const c=ITEMS[id],i=SUBT.indexOf(c.k+"."+c.s);if(i<0)return;const zz=(mu(i)-(c.va+c.vb)/2)*Math.sign(c.vb-c.va)/(Math.abs(c.vb-c.va)/2+15),pb=1/(1+Math.exp(-CLS.contraste*zz)),v=A[id];L+=v===2?Math.log(pb+1e-6):v===-2?Math.log(1-pb+1e-6):-.5*zz*zz});
    // frases que definem os extremos: com a escala no teto, um fascista e um radical de direita podem ter posição parecida nos eixos,
    // mas não concordam igual com essas frases
    ["com","anq","fas","anc"].forEach(g=>{if(!mk[g].length)return;const avg=mk[g].reduce((x,y)=>x+y,0)/mk[g].length,d=avg-marcaEsperada(o,g);L-=d*d/(2*CLS.marcadoras*CLS.marcadoras)});
    return {o,L,z:nd?z/nd:0}});
  // adesão às frases de ruptura do eixo Democracia (de -2 a 2): as extremas só disputam com concordância explícita,
  // e não por ficar no meio-termo nas frases de democracia. Algumas rupturas têm lado (ld: uma revolução, a esquerda;
  // uma intervenção militar, a direita): cada extrema é medida pelas rupturas do próprio lado mais as sem lado.
  const rupDe=l=>{const v=ids.filter(id=>{const o=ITEMS[id];return o.k==="D"&&o.s==="rup"&&!escolha(o)&&(!o.ld||o.ld===l)&&typeof A[id]==="number"}).map(id=>A[id]*ITEMS[id].d);return v.length?v.reduce((a,b)=>a+b,0)/v.length:0};
  const ruptura={e:rupDe("e"),d:rupDe("d")};
  const elig=ll.filter(q=>(!q.o.g||ext[q.o.g]>=GATE)&&(!q.o.rup||ruptura[q.o.rup]>=RUP_GATE)),T=CLS.temp,mx=Math.max(...elig.map(q=>q.L)),tot=elig.reduce((a,q)=>a+Math.exp((q.L-mx)/T),0);
  const dc=o=>Math.hypot(o.p.E,o.p.A,o.p.C,o.p.N,o.p.D+65); // distância da posição típica ao centro democrático
  let ranked=elig.map(q=>{const p=Math.exp((q.L-mx)/T)/tot;return {...q.o,prob:p,match:Math.round(p*100),z:q.z}}).sort((a,b)=>(b.prob-a.prob)||(dc(a)-dc(b)));
  if(!ranked.length)ranked=[{...IDEO.find(o=>o.n==="Centrista"),prob:1,match:100,z:0}];
  const margin=ranked[1]?Math.round((ranked[0].prob-ranked[1].prob)*100):99,two=!!ranked[1]&&ranked[1].prob>=.6*ranked[0].prob;
  // pares: contrários (só concordar com os dois é contradição), espelhos (concordar ou discordar dos dois),
  // tensões (princípio x caso concreto) e simetria (mesma situação com o lado político trocado)
  const inc=[],weak=[],ten=[],sym=[];
  PAIRS.forEach(p=>{const va=A[p.a],vb=A[p.b];if(typeof va!=="number"||typeof vb!=="number")return;
    if(p.t==="contra"){if(va>=1&&vb>=1)(va+vb>=3?inc:weak).push(p)}
    else if(p.t==="espelho"){if((va>=1&&vb>=1)||(va<=-1&&vb<=-1))(Math.abs(va+vb)>=3?inc:weak).push(p)}
    else if(p.t==="tensao"){if(va>=1&&vb>=1&&va+vb>=3)ten.push(p)}
    else if(p.t==="simetria"){if(Math.abs(va-vb)>=2)sym.push({...p,d:va-vb})}});
  // estilo de resposta: sequência longa de respostas iguais e respostas rápidas demais
  // (só frases de concordância: nas perguntas de escolha, um centrista escolhe a opção do meio várias vezes seguidas, e isso é coerente)
  const nums=seq().filter(id=>!escolha(ITEMS[id])).map(id=>A[id]).filter(v=>typeof v==="number");let run=1,maxRun=nums.length?1:0;
  for(let i=1;i<nums.length;i++){run=nums[i]===nums[i-1]?run+1:1;if(run>maxRun)maxRun=run}
  const tms=Object.values(st.tm||{}).filter(x=>x>0).sort((a,b)=>a-b),medT=tms.length>=15?tms[Math.floor(tms.length/2)]:null;
  const flat=maxRun>=12,fast=medT!==null&&medT<1800,ur=asked?unsure/asked:0,nr=asked?noop/asked:0;
  const checked=PAIRS.filter(p=>p.t!=="simetria"&&typeof A[p.a]==="number"&&typeof A[p.b]==="number").length;
  const acq=weak.length>=3;
  const cons=Math.max(0,Math.min(100,100-12*inc.length-(acq?8*weak.length:0)-4*ten.length-(flat?15:0)-(fast?20:0)-(nr>.25?10:0)));
  const hwAvg=["E","A","C","N"].reduce((a,k)=>a+hw[k],0)/4;
  // dois indicadores separados: precisão dos eixos (faixas) e definição do rótulo (vantagem sobre a 2ª ideologia)
  const prec=hwAvg<=20?"alta":hwAvg<=32?"média":"baixa",P1=ranked[0].prob,lab=two?"entre duas":P1>=.6?"clara":"razoável";
  // quem pulou muitas frases ("não tenho opinião") não pode ter confiança alta, por mais que as poucas respostas apontem pra um lado
  const respondeu=asked?1-noop/asked:0;
  // não diferenciação: quase tudo no meio-termo, ou concordar (ou discordar) de quase tudo, qualquer que seja o lado
  // da frase. Nos dois casos as respostas dizem pouco sobre a posição, e a confiança não pode ser alta.
  const lik=ids.filter(id=>!escolha(ITEMS[id])&&typeof A[id]==="number").map(id=>A[id]);
  const neutro=lik.length?lik.filter(v=>v===0).length/lik.length:0,aquiesc=lik.length?lik.reduce((a,b)=>a+b,0)/lik.length:0;
  const naoDif=neutro>=.6||Math.abs(aquiesc)>=.7;
  // respostas espalhadas: no mesmo eixo, as respostas vão pros dois lados com força (variância alta das respostas já
  // orientadas pelo lado de cada frase). É o padrão de quem responde ao acaso, cuja média cai no centro e parece moderação.
  const porEixo={};ids.forEach(id=>{const o=ITEMS[id],v=A[id];if(typeof v!=="number"||escolha(o)||!["E","A","C","N"].includes(o.k))return;(porEixo[o.k]||(porEixo[o.k]=[])).push(v*(o.d||1))});
  const vars=Object.values(porEixo).filter(a=>a.length>=4).map(a=>{const m=a.reduce((x,y)=>x+y,0)/a.length;return a.reduce((x,y)=>x+(y-m)**2,0)/a.length});
  const espalhado=vars.length?vars.reduce((a,b)=>a+b,0)/vars.length:0;
  let conf=P1>=.6&&cons>=70&&prec!=="baixa"?"alta":P1>=.35&&cons>=50?"media":"baixa";
  if(respondeu<=.5)conf="baixa";else if(respondeu<.75&&conf==="alta")conf="media";
  if(neutro>=.8||Math.abs(aquiesc)>=1)conf="baixa";else if(naoDif&&conf==="alta")conf="media";
  if(espalhado>=ESPALHADO_BAIXA)conf="baixa";else if(espalhado>=ESPALHADO_MEDIA&&conf==="alta")conf="media";
  return {s,gam,ancoras:M.ancoras,se:M.se,two,P1,sub,ext,extAsked:asked_,ranked,margin,unsure:ur,noop:nr,inc,weak,acq,ten,sym,ci,hw,hwAvg,cons,checked,flat,fast,conf,prec,lab,respondeu,perguntas:asked,semOpiniao:noop,neutro,aquiesc,naoDif,espalhado,ruptura};
}
// posição provisória num eixo, usada pra decidir se as frases de um extremo aparecem
function axisNow(k){return Motor.calcular(st.ans,ITEMS,seq(),WEIGHTS).raw[k]}
function gateOK(id){const o=ITEMS[id];if(!gated(o))return true;const sc=axisNow(o.k);
  return o.m.some(g=>g!=="eco"&&EXTP[g]&&EXTP[g][o.k]!==undefined&&Math.sign(EXTP[g][o.k])===Math.sign(sc)&&Math.abs(sc)>=GATE_AX)}
function band(v,k){const a=AX[k];if(v<=-40)return a.left;if(v<=-12)return a.left+" (moderado)";if(v<12)return "Centro";if(v<40)return a.right+" (moderado)";return a.right}
const short=(v,k)=>band(v,k).replace(" (moderado)",", moderado");

