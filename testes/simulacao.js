// Simulação de respondentes (21 ideologias × 3 estilos × reteste) com dois geradores. Roda dentro do site, no motor real.
// Simulação v6: dois geradores, três estilos, reteste. Roda no motor real do site.
(({mode,porCelula,seed,ger,escada,soIdeo,cfg,pf,subt})=>{
 const PF=pf||PERFIS,ST=subt||SUBT;
 if(cfg){if(cfg.tau!==undefined)CLS.tau=cfg.tau;if(cfg.lambda!==undefined)CLS.lambda=cfg.lambda;if(cfg.contraste!==undefined)CLS.contraste=cfg.contraste;if(cfg.promo)for(const [id,lv] of Object.entries(cfg.promo)){const e=EXTRA.find(o=>o.id===id);if(e)e.lv=lv;if(ITEMS[id])ITEMS[id].lv=lv}for(const k of ['estilo','gMinAmplo','gMaxAmplo','seEscadaSub','seEscadaEixo'])if(cfg[k]!==undefined)Motor.CFG[k]=cfg[k]}
 // a ordem das frases (versão 4) usa o sorteio da página (Math.random, fixado pelos testes), pra simulação ser repetível
 if(typeof novaSemente==="function")novaSemente=()=>Math.floor(Math.random()*4294967296);
 let s0=seed;const R_=()=>{s0=(s0*1664525+1013904223)%4294967296;return s0/4294967296};
 const G=()=>{let u=0,v=0;while(!u)u=R_();while(!v)v=R_();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
 const EST={cauteloso:.65,tipico:1.0,forte:1.3},LADO={com:-1,anq:-1,fas:1,anc:1};
 // gerador B: erro fixo da teoria por ideologia/subtema e localização oculta de cada frase
 let s1=seed+999;const R1=()=>{s1=(s1*1664525+1013904223)%4294967296;return s1/4294967296};const G1=()=>{let u=0,v=0;while(!u)u=R1();while(!v)v=R1();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
 const erro={};IDEO.forEach(o=>erro[o.n]=ST.map(()=>10*G1()));
 // frases graduadas: X pares são as radicais (localização 45), ímpares as moderadas (0); as demais têm localização sorteada de -15 a 35
const loc={};Object.values(ITEMS).forEach(o=>{loc[o.id]=o.id[0]==="X"?(+o.id.slice(1)%2===0?45:0):-15+50*R1()});
 // B: as posições reais das frases de contraste e das opções de escolha diferem das que o teste supõe
 const mid={},opv={};Object.values(ITEMS).forEach(o=>{if(o.f==="c")mid[o.id]=(o.va+o.vb)/2+15*G1();if(o.f==="l")opv[o.id]=o.v.map(x=>x+10*G1())});
 const out=[];
 for(const X of IDEO){if(soIdeo&&!soIdeo.includes(X.n))continue;for(const [nivel,gain] of Object.entries(EST))for(let r=0;r<porCelula;r++){
  const prof=ST.map((key,i)=>Math.max(-100,Math.min(100,(ger==="B"?PF[X.n][i]+erro[X.n][i]:X.p[key[0]])+(ger==="B"?12:8)*G())));
  const pos={};ST.forEach((key,i)=>pos[key]=prof[i]);const ax={};["E","A","C","N","D"].forEach(k=>{const ks=ST.filter(x=>x[0]===k);ax[k]=ks.reduce((a,x)=>a+pos[x],0)/ks.length});ax.S=25*G();
  const th=o=>o.s&&pos[o.k+"."+o.s]!==undefined?pos[o.k+"."+o.s]:ax[o.k];
  const lado=Math.sign(X.p.E)||0;
  const resp=()=>{const ans=o=>{
    if(o.f==="l"){const vv=ger==="B"?opv[o.id]:o.v,alvo=th(o)*(escada==="pessimista"?1+(gain-1)*.5:1)+(ger==="B"?15:10)*G();let bi=0;vv.forEach((x,i)=>{if(Math.abs(x-alvo)<Math.abs(vv[bi]-alvo))bi=i});return bi-2}
    if(o.f==="c"){if(ger==="B"){const t=th(o)+20*G(),m=mid[o.id],dir=Math.sign(o.vb-o.va),z=(t-m)*dir;return Math.abs(z)<8?0:z>0?2:-2}
      const t=th(o)+8*G(),da=Math.abs(t-o.va),db=Math.abs(t-o.vb);return Math.abs(da-db)<6?0:da<db?-2:2}
    const marcas=o.m.filter(g=>g!=="eco");
    if(marcas.length){if(X.g&&marcas.includes(X.g))return gain<.8?1:2;if(o.k!=="D")return gain<.8?-1:-2;
      if(!marcas.some(g=>LADO[g]===lado))return gain<.8?-1:-2;const c=Math.min(0,gain*2*ax.D/100);return Math.max(-2,Math.min(2,Math.round(c+.35*G())))*o.d}
    const t=th(o);
    // A: concordância proporcional à posição no eixo; B: ponto ideal com localização oculta (moderada 0, radical 45)
    const a=ger==="B"?gain*2*Math.tanh((o.d*t-(loc[o.id]||0))/35):gain*2*t/100*o.d;
    return Math.max(-2,Math.min(2,Math.round(a+.35*G())))};
   // gerador A devolve v=c*d (c=a*d); B já devolve a concordância bruta
   if(typeof escolha==="undefined")globalThis.escolha=o=>o.f==="l"||o.f==="c";st=fresh(mode);st.seen=st.bs.map((_,j)=>j);
   for(const id of st.base){if(gated(ITEMS[id])&&!gateOK(id)){st.ans[id]="g";continue}st.ans[id]=ans(ITEMS[id]);st.tm[id]=4000}
   let res=compute(st.ans);const dois=r=>r.two!==undefined?r.two:(r.margin<5&&!!r.ranked[1]);if((res.two!==undefined?res.two:res.ranked[1]&&res.margin<6)&&mode!=="deep"&&tbUseful(res)){const t=pickTb(res);if(t.length){st.tb=t;t.forEach(id=>st.ans[id]=ans(ITEMS[id]));res=compute(st.ans)}}
   return {top:res.ranked[0].n,seg:res.ranked[1]?.n||null,two:dois(res),P1:res.P1??null,conf:{firme:"alta",moderado:"media",dividido:"baixa"}[res.conf]||res.conf,s:res.s,gam:res.gam,elig:IDEO.filter(o=>o.g&&res.ext[o.g]>=GATE).map(o=>o.n),ext:res.ext}};
  const a=resp(),b=resp();out.push({esperada:X.n,nivel,a,b});
 }}
 return out})
