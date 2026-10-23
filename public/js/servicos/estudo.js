// Envio anônimo pro estudo e prova anti-robô.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- estudo (coleta anônima)
function evt(tipo,extra={}){if(!st.study.ok||st.study.minor)return;const b=JSON.stringify({v:6,tipo,modo:st.mode,sessao:SESSAO?SESSAO.token:undefined,...extra});
  try{if(tipo==="saida"&&navigator.sendBeacon){navigator.sendBeacon("/api/coletar",new Blob([b],{type:"text/plain"}));return}
    fetch("/api/coletar",{method:"POST",headers:{"content-type":"application/json"},body:b,keepalive:true}).catch(()=>{})}catch(e){}}
addEventListener("pagehide",()=>{if(!$("quiz").classList.contains("hidden")&&!st.done)evt("saida",{pos:st.cur+1})});
function studyPayload(){
  const {s,ext,ranked,margin,inc}=R,r10=v=>Math.round(v/10)*10,b20=v=>Math.max(-100,Math.min(100,Math.round(v/20)*20));
  const code=v=>v===undefined||v===null||v==="g"?"_":v==="x"||v==="n"?"x":"abcde"[v+2];
  const min=(Date.now()-(st.study.t0||Date.now()))/60000,tempo=min<5?"<5":min<10?"5-10":min<15?"10-15":min<20?"15-20":min<30?"20-30":"30+";
  return {v:6,calculo:2,tipo:"resultado",sessao:SESSAO?SESSAO.token:undefined,modo:st.mode,de:st.study.de||undefined,ideologia:ranked[0].n,eixos:Object.fromEntries(AXK6.map(k=>[k,b20(s[k])])),
    extremos:Object.fromEntries(["com","anq","fas","anc"].map(g=>[g,R.extAsked[g]?r10(ext[g]):null])),tempo,respostas:CANON.map(id=>code(st.ans[id])).join(""),
    explicacoes:st.study.exp.slice(0,CANON.length),idade:st.study.idade||null,uf:st.study.uf||null,
    autoid:{espectro:st.si.esp||null,ideologia:st.si.ide||null},confianca:R.conf,desempate:st.tb.length>0,inconsistencias:inc.length,envio:st.study.id||(st.study.id=novoId()),inicio:!!st.study.ini};
}
async function setupStats(){
  const blk=$("statsBlock"),msg=$("statsMsg"),btn=$("statsBtn");blk.classList.add("hidden");btn.classList.add("hidden");
  if(!(await coleta)||st.study.minor)return;
  blk.classList.remove("hidden");
  if(R&&R.respondeu<INSUFICIENTE){msg.textContent="Com tão poucas respostas, este resultado não foi enviado pro estudo.";btn.classList.add("hidden");return}
  if(st.study.sent){msg.textContent="Seu resultado anônimo já foi enviado pro estudo. Obrigado por participar!";return}
  if(st.study.ok){await sendStats();return}
  msg.textContent="Você fez o teste sem participar do estudo. Se mudar de ideia, dá pra enviar seu resultado anônimo agora, de acordo com os termos de uso e privacidade.";
  btn.textContent="Participar e enviar";btn.classList.remove("hidden");btn.onclick=()=>{st.study.ok=true;save();sendStats()};
}
async function sendStats(){const msg=$("statsMsg"),btn=$("statsBtn");btn.classList.add("hidden");msg.textContent="Enviando seu resultado anônimo pro estudo...";
  try{if(!st.study.id){st.study.id=novoId();save()}
    const D=st.study.desafio;if(!D||Date.now()-D.t>6*864e5)await pegarDesafio();
    const D2=st.study.desafio;if(!D2)throw new Error("desafio");
    const falta=(D2.espera||30)*1000+2000-(Date.now()-D2.t);if(falta>0)await new Promise(r=>setTimeout(r,falta));
    const prova=await provar();
    const r=await fetch("/api/coletar",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({...studyPayload(),prova})});
    if(r.status===429){const j=await r.json().catch(()=>({}));st.study.desafio=null;st.study.prova=null;save();throw new Error(j.motivo||"desafio")}if(r.status===403&&SESSAO){sairTeste();msg.textContent="A sessão de teste expirou ou foi encerrada, então este resultado não foi enviado. Abra o modo de teste de novo pelo painel.";return}
    if(!r.ok)throw new Error(r.status);
    st.study.sent=true;save();msg.textContent="Seu resultado anônimo foi enviado pro estudo. Obrigado por participar!"}
  catch(e){msg.textContent="Não deu pra enviar seu resultado agora. Confira a sua conexão e tente de novo.";btn.textContent="Tentar de novo";btn.onclick=sendStats;btn.classList.remove("hidden")}}

// ---------- desafio contra envios automáticos (ver conferirProva no servidor)
const SHA_K=new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
function sha256(bytes){const l=bytes.length,n=((l+9+63)>>6)<<6,m=new Uint8Array(n);m.set(bytes);m[l]=0x80;const bits=l*8;m[n-4]=bits>>>24;m[n-3]=bits>>>16;m[n-2]=bits>>>8;m[n-1]=bits;
  const H=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]),W=new Uint32Array(64);
  for(let o=0;o<n;o+=64){for(let i=0;i<16;i++)W[i]=m[o+i*4]<<24|m[o+i*4+1]<<16|m[o+i*4+2]<<8|m[o+i*4+3];
    for(let i=16;i<64;i++){const a=W[i-15],b=W[i-2];W[i]=((a>>>7|a<<25)^(a>>>18|a<<14)^(a>>>3))+W[i-7]+((b>>>17|b<<15)^(b>>>19|b<<13)^(b>>>10))+W[i-16]}
    let [a,b,c,d,e,f,g,h]=H;
    for(let i=0;i<64;i++){const t1=h+((e>>>6|e<<26)^(e>>>11|e<<21)^(e>>>25|e<<7))+(e&f^~e&g)+SHA_K[i]+W[i]|0,t2=((a>>>2|a<<30)^(a>>>13|a<<19)^(a>>>22|a<<10))+(a&b^a&c^b&c)|0;h=g;g=f;f=e;e=d+t1|0;d=c;c=b;b=a;a=t1+t2|0}
    H[0]+=a;H[1]+=b;H[2]+=c;H[3]+=d;H[4]+=e;H[5]+=f;H[6]+=g;H[7]+=h}
  return H}
const zerosH=H=>{let z=0;for(const w of H){if(w===0){z+=32;continue}return z+Math.clz32(w)}return z};
async function pegarDesafio(){try{const r=await fetch("/api/coletar?desafio",{cache:"no-store"});if(!r.ok)return;const j=await r.json();st.study.desafio={d:j.desafio,bits:j.bits,espera:j.espera,t:Date.now()};st.study.prova=null;save()}catch(e){}}
async function provar(){const D=st.study.desafio;if(!D)return null;if(st.study.prova&&st.study.prova.d===D.d)return st.study.prova;
  const enc=new TextEncoder(),pre=`${D.d}:${st.study.id}:`;let i=0;
  for(;;){for(let j=0;j<4000;j++,i++){const n=i.toString(36);if(zerosH(sha256(enc.encode(pre+n)))>=D.bits){st.study.prova={d:D.d,n};save();return st.study.prova}}await new Promise(r=>setTimeout(r,0))}}

