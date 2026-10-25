// Compartilhar: imagem em forma de urna em quatro formatos (story 9:16, retrato 4:5, quadrado 1:1 e paisagem 16:9),
// tema claro ou escuro, com QR code pro link de comparação; atalhos pros aplicativos e cópia de link e texto.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
// ---------- imagem pra compartilhar (1080x1920)
let shareData=null,shareFile=null,shareUrl=null;
function wrapText(x,text,px,py,maxW,lh){const w=text.split(" ");let line="",lines=[];for(const s of w){const t=line?line+" "+s:s;if(x.measureText(t).width>maxW&&line){lines.push(line);line=s}else line=t}lines.push(line);lines.forEach((l,i)=>x.fillText(l,px,py+i*lh));return lines.length}
// opções escolhidas na janela de compartilhar
const shOp={formato:"story",tema:"claro",cand:true,ext:true};
// formatos: tamanho em pixels e onde cada um funciona melhor
const FORMATOS={
  story:{w:1080,h:1920,nome:"Story 9:16",uso:"Stories do Instagram, Facebook e WhatsApp (status), TikTok e Reels"},
  retrato:{w:1080,h:1350,nome:"Retrato 4:5",uso:"Feed do Instagram e do Facebook (ocupa mais espaço na tela)"},
  quadrado:{w:1080,h:1080,nome:"Quadrado 1:1",uso:"Feed do Instagram, Threads, WhatsApp e grupos"},
  paisagem:{w:1600,h:900,nome:"Paisagem 16:9",uso:"X (Twitter), Telegram e Facebook no computador"}};
// biblioteca do QR code (MIT, em js/vendor) só é carregada quando a janela abre
let qrPronto=null;
function carregarQR(){if(window.qrcode)return Promise.resolve(true);if(qrPronto)return qrPronto;
  qrPronto=new Promise(r=>{const sc=document.createElement("script");sc.src="/js/vendor/qrcode.js";sc.onload=()=>r(!!window.qrcode);sc.onerror=()=>r(false);document.head.append(sc)});return qrPronto}
function desenharQR(x,texto,X,Y,T,fundo,tinta){if(!window.qrcode)return false;try{const q=qrcode(0,"M");q.addData(texto);q.make();const n=q.getModuleCount(),m=4,lado=T/(n+2*m);
  x.fillStyle=fundo;x.fillRect(X,Y,T,T);x.fillStyle=tinta;for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))x.fillRect(X+(c+m)*lado,Y+(r+m)*lado,Math.ceil(lado),Math.ceil(lado));return true}catch(e){return false}}
async function buildImage(d,op=shOp){
  // urna desenhada (inspiração, sem símbolos oficiais): visor com o resumo do resultado e, no story, o QR code "compare comigo"
  if(op.formato==="paisagem")return desenharPaisagem(d,op);
  const F='"Arimo",Arial,sans-serif',story=op.formato==="story",esc=op.tema==="escuro",FMT=FORMATOS[op.formato]||FORMATOS.story;
  try{await Promise.all(["700 100px","700 30px","400 26px"].map(f=>document.fonts.load(f+' "Arimo"')))}catch(e){}
  const qr=await carregarQR();
  const W0=1080,H0=FMT.h,alto=H0>=1350,c=document.createElement("canvas");c.width=W0;c.height=H0;const x=c.getContext("2d");
  const K=esc?{FUNDO:"#121211",CORPO:"#1F1E1B",SOMBRA:"#000000",VISOR:"#2A2F29",MOLD:"#0E0E0D",TINTA:"#E9EDE4",GRAF:"#A9AEA3",LINHA:"#3E443C",GRADE:"#313730",TECLADO:"#121211",VERDE:"#3BB86A",VERDE2:"#3BB86A"}
    :{FUNDO:"#2B2A27",CORPO:"#E3DED1",SOMBRA:"#A9A496",VISOR:"#F3F5EF",MOLD:"#3A3935",TINTA:"#151513",GRAF:"#5E5A50",LINHA:"#D3D6CC",GRADE:"#E8EBE2",TECLADO:"#2B2A27",VERDE:"#2FA35A",VERDE2:"#1E6E3B"};
  const rr=(X,Y,W,H,R,fill)=>{x.beginPath();x.roundRect?x.roundRect(X,Y,W,H,R):x.rect(X,Y,W,H);x.fillStyle=fill;x.fill()};
  const tecla=(X,Y,W,H,cor,sombra,txt,tc,fs)=>{rr(X,Y+6,W,H,8,sombra);rr(X,Y,W,H,8,cor);if(txt){x.fillStyle=tc;x.font=`700 ${fs}px ${F}`;x.textAlign="center";x.fillText(txt,X+W/2,Y+H/2+fs*.36);x.textAlign="left"}};
  x.fillStyle=K.FUNDO;x.fillRect(0,0,W0,H0);
  const bx=story?{y:80,h:1740}:{y:30,h:H0-50};
  rr(60,bx.y+16,960,bx.h,46,K.SOMBRA);rr(60,bx.y,960,bx.h,46,K.CORPO);
  x.fillStyle=K.GRAF;x.font=`700 26px ${F}`;x.fillText("TESTE POLÍTICO 2026",110,bx.y+70);x.textAlign="right";x.fillText("MODO "+String(d.modo).toUpperCase(),970,bx.y+70);x.textAlign="left";
  const vis=story?{y:180,h:1060}:{y:110,h:H0-280};
  rr(100,vis.y,880,vis.h,30,K.MOLD);rr(126,vis.y+26,828,vis.h-52,12,K.VISOR);
  const L=166,W=748;let y=vis.y+88;
  x.fillStyle=K.GRAF;x.font=`700 24px ${F}`;x.fillText("MEU RESULTADO",L,y);
  const TT=d.two?`${d.top.n} / ${d.ranked[1].n}`:d.top.n;let size=story?96:alto?92:72;
  for(;size>44;size-=4){x.font=`700 ${size}px ${F}`;const ws=TT.split(" ");if(ws.some(s=>x.measureText(s).width>W))continue;let l="",n=1;for(const s of ws){const t=l?l+" "+s:s;if(x.measureText(t).width>W&&l){n++;l=s}else l=t}if(n<=(story&&d.two?3:2))break}
  x.fillStyle=K.TINTA;const nl=wrapText(x,TT,L,y+size*1.02,W,size*1.02);y+=size*1.02*nl+(story?64:46);
  const nivel=/alta/i.test(d.conf)?3:/média|entre/i.test(d.conf)?2:1;
  x.font=`700 26px ${F}`;x.fillText("CONFIANÇA",L,y);for(let k=0;k<3;k++){x.fillStyle=k<nivel?K.VERDE2:K.LINHA;x.fillRect(L+168+k*44,y-20,38,20)}
  x.fillStyle=K.TINTA;x.fillText(d.conf.replace(/^Confiança /,"").replace(/^./,m=>m.toUpperCase()),L+310,y);y+=50;
  x.fillStyle=K.GRAF;x.font=`400 26px ${F}`;y+=wrapText(x,`Também perto de ${d.ranked.slice(d.two?2:1,d.two?4:3).map(o=>o.n).join(" e ")}.`,L,y,W,36)*36+26;
  // bússola e eixos
  const S=story||alto?262:196,cx=L,cy=y;x.fillStyle=K.GRADE;x.fillRect(cx,cy,S,S);x.strokeStyle=K.LINHA;x.lineWidth=2;x.strokeRect(cx,cy,S,S);x.lineWidth=1.5;for(let i=1;i<6;i++){const p=i*S/6;x.beginPath();x.moveTo(cx+p,cy);x.lineTo(cx+p,cy+S);x.moveTo(cx,cy+p);x.lineTo(cx+S,cy+p);x.stroke()}
  x.strokeStyle=K.TINTA;x.lineWidth=3;x.beginPath();x.moveTo(cx+S/2,cy);x.lineTo(cx+S/2,cy+S);x.moveTo(cx,cy+S/2);x.lineTo(cx+S,cy+S/2);x.stroke();
  x.fillStyle=K.GRAF;x.font=`400 20px ${F}`;x.textAlign="center";x.fillText("Mais ordem",cx+S/2,cy-10);x.fillText("Mais liberdade",cx+S/2,cy+S+28);x.textAlign="left";
  {const px=cx+S/2+d.s.E/100*(S/2-16),py=cy+S/2-d.s.A/100*(S/2-16);x.fillStyle=K.TINTA;x.fillRect(px-17,py-17,34,34);x.fillStyle=K.VERDE;x.fillRect(px-13,py-13,26,26)}
  let ay=cy+30;const ax=cx+S+36,aw=L+W-ax;for(const k of AXK6){x.font=`700 22px ${F}`;x.fillStyle=K.TINTA;const nm=AX[k].name+": ";x.fillText(nm,ax,ay);const w0=x.measureText(nm).width;x.font=`400 22px ${F}`;x.fillStyle=K.GRAF;let bd=band(d.s[k],k).toLowerCase();while(x.measureText(bd).width>aw-w0&&bd.length>4)bd=bd.slice(0,-2)+"…";x.fillText(bd,ax+w0,ay);ay+=story||alto?41:31}
  y=cy+S+(story||alto?72:66);
  // nada pode passar do visor: se não couber, a seção fica de fora em vez de sobrepor texto
  const limite=vis.y+vis.h-34;
  if((op.ext||op.cand)&&y<limite){x.strokeStyle=K.LINHA;x.lineWidth=2;x.beginPath();x.moveTo(L,y-24);x.lineTo(L+W,y-24);x.stroke()}
  if(op.ext&&y<limite){const ex=Object.entries(d.ext).filter(([g])=>EXT[g]&&(!d.extAsked||d.extAsked[g])).sort((p,q)=>q[1]-p[1]);
    x.fillStyle=K.TINTA;x.font=`700 24px ${F}`;x.fillText("EXTREMOS",L,y);x.font=`400 24px ${F}`;x.fillStyle=K.GRAF;
    x.fillText(!ex.length?"Frases dos extremos não perguntadas":ex[0][1]>=GATE?`${EXT[ex[0][0]].n}: ${ex[0][1]} de 100`:"Nenhum chega a 50 de 100",L+170,y);y+=46}
  if(op.cand&&y+48<limite){x.fillStyle=K.TINTA;x.font=`700 24px ${F}`;x.fillText("MAIS COMPATÍVEIS",L,y);y+=10;
    const linhas=story||alto?[["pres","Presidente, 2º turno"],["gov","Governador SP"],["sen","Senado SP"],["part","Partido"]]:[["pres","Presidente, 2º turno"]];
    linhas.forEach(([k,l])=>{if(y+38>limite)return;const c0=k==="pres"?(d.cand.pres.find(c=>c.st==="2º turno")||d.cand.pres[0]):d.cand[k][0];y+=38;x.fillStyle=K.GRAF;x.font=`400 22px ${F}`;x.fillText(l,L,y);
      x.fillStyle=K.TINTA;x.font=`700 23px ${F}`;let nm=c0.n;while(x.measureText(nm).width>W-380&&nm.length>4)nm=nm.slice(0,-2)+"…";x.fillText(nm,L+250,y);x.textAlign="right";x.fillStyle=K.VERDE2;x.fillText(matchLab(c0.match),L+W,y);x.textAlign="left"})}
  const aviso=op.cand?"Compatibilidade estimada pelo histórico de cada um. Não é recomendação de voto.":"Resultado aproximado do teste. Não é recomendação de voto.";
  x.fillStyle=K.GRAF;x.font=`400 20px ${F}`;x.textAlign="center";x.fillText(aviso,540,vis.y+vis.h+(story?44:34));x.textAlign="left";
  const link=d.link||("https://"+SITE+"/");
  if(story){
    // teclado: QR code "compare comigo" à esquerda, explicação e as três teclas à direita
    rr(100,1300,880,450,26,K.TECLADO);
    const temQR=qr&&desenharQR(x,link,140,1335,300,"#FFFFFF","#151513");
    if(temQR){x.fillStyle="#F5F5F0";x.font=`700 30px ${F}`;x.fillText("COMPARE COMIGO",480,1385);x.font=`400 24px ${F}`;x.fillStyle="#CFCBC0";wrapText(x,"Aponte a câmera pro código, faça o teste e veja os nossos resultados lado a lado.",480,1430,460,34)}
    else{const dig=["1","2","3","4","5","6","7","8","9","","0",""];dig.forEach((t,i)=>{if(!t)return;tecla(140+(i%3)*270,1325+Math.floor(i/3)*70,240,54,"#1A1A18","#000",t,"#F5F5F0",30)})}
    const kx=temQR?480:140,kw=temQR?140:250,gap=temQR?18:20;[["BRANCO","#F4F4EF","#A9A69C"],["CORRIGE","#E8732C","#9C4A16"],["CONFIRMA","#2FA35A","#1B6A39"]].forEach(([t,cor,sb],i)=>tecla(kx+i*(kw+gap),temQR?1610:1650,kw,64,cor,sb,t,"#151513",temQR?19:24));
    x.fillStyle=K.TINTA;x.font=`700 30px ${F}`;x.textAlign="center";x.fillText("Faça o teste: "+SITE,540,1794);x.textAlign="left";
  }else{
    x.fillStyle=K.TINTA;x.font=`700 30px ${F}`;x.fillText("Faça o teste e compare comigo",110,H0-80);x.font=`400 24px ${F}`;x.fillStyle=K.GRAF;x.fillText(SITE,110,H0-46);
    if(qr)desenharQR(x,link,872,H0-118,92,"#FFFFFF","#151513");
  }
  return await new Promise(r=>c.toBlob(r,"image/png"));
}
// paisagem 16:9 (1600 × 900): visor largo com o resultado à esquerda, bússola e eixos à direita, QR no canto
async function desenharPaisagem(d,op){
  const F='"Arimo",Arial,sans-serif',esc=op.tema==="escuro";
  try{await Promise.all(["700 100px","700 30px","400 26px"].map(f=>document.fonts.load(f+' "Arimo"')))}catch(e){}
  const qr=await carregarQR(),W0=1600,H0=900,c=document.createElement("canvas");c.width=W0;c.height=H0;const x=c.getContext("2d");
  const K=esc?{FUNDO:"#121211",CORPO:"#1F1E1B",SOMBRA:"#000000",VISOR:"#2A2F29",MOLD:"#0E0E0D",TINTA:"#E9EDE4",GRAF:"#A9AEA3",LINHA:"#3E443C",GRADE:"#313730",VERDE:"#3BB86A",VERDE2:"#3BB86A"}
    :{FUNDO:"#2B2A27",CORPO:"#E3DED1",SOMBRA:"#A9A496",VISOR:"#F3F5EF",MOLD:"#3A3935",TINTA:"#151513",GRAF:"#5E5A50",LINHA:"#D3D6CC",GRADE:"#E8EBE2",VERDE:"#2FA35A",VERDE2:"#1E6E3B"};
  const rr=(X,Y,W,H,R,fill)=>{x.beginPath();x.roundRect?x.roundRect(X,Y,W,H,R):x.rect(X,Y,W,H);x.fillStyle=fill;x.fill()};
  x.fillStyle=K.FUNDO;x.fillRect(0,0,W0,H0);rr(40,46,1520,820,40,K.SOMBRA);rr(40,30,1520,820,40,K.CORPO);
  x.fillStyle=K.GRAF;x.font=`700 24px ${F}`;x.fillText("TESTE POLÍTICO 2026",90,90);x.textAlign="right";x.fillText("MODO "+String(d.modo).toUpperCase(),1510,90);x.textAlign="left";
  rr(80,120,1440,600,26,K.MOLD);rr(102,142,1396,556,10,K.VISOR);
  const L=142,W=760;let y=200;
  x.fillStyle=K.GRAF;x.font=`700 22px ${F}`;x.fillText("MEU RESULTADO",L,y);
  const TT=d.two?`${d.top.n} / ${d.ranked[1].n}`:d.top.n;let size=84;
  for(;size>40;size-=4){x.font=`700 ${size}px ${F}`;const ws=TT.split(" ");if(ws.some(s=>x.measureText(s).width>W))continue;let l="",n=1;for(const s of ws){const t=l?l+" "+s:s;if(x.measureText(t).width>W&&l){n++;l=s}else l=t}if(n<=2)break}
  x.fillStyle=K.TINTA;y+=wrapText(x,TT,L,y+size,W,size)*size+50;
  const nivel=/alta/i.test(d.conf)?3:/média|entre/i.test(d.conf)?2:1;
  x.font=`700 24px ${F}`;x.fillText("CONFIANÇA",L,y);for(let k=0;k<3;k++){x.fillStyle=k<nivel?K.VERDE2:K.LINHA;x.fillRect(L+158+k*40,y-19,34,19)}
  x.fillStyle=K.TINTA;x.fillText(d.conf.replace(/^Confiança /,"").replace(/^./,m=>m.toUpperCase()),L+290,y);y+=48;
  x.fillStyle=K.GRAF;x.font=`400 24px ${F}`;y+=wrapText(x,`Também perto de ${d.ranked.slice(d.two?2:1,d.two?4:3).map(o=>o.n).join(" e ")}.`,L,y,W,34)*34+18;
  if(op.cand){const c0=d.cand.pres.find(c=>c.st==="2º turno")||d.cand.pres[0];x.fillStyle=K.TINTA;x.font=`700 22px ${F}`;x.fillText("PRESIDENTE, 2º TURNO",L,y+10);x.font=`400 22px ${F}`;x.fillStyle=K.GRAF;x.fillText(`${c0.n}: ${matchLab(c0.match).toLowerCase()}`,L+290,y+10)}
  const S=250,cx=960,cy=200;x.fillStyle=K.GRADE;x.fillRect(cx,cy,S,S);x.strokeStyle=K.LINHA;x.lineWidth=2;x.strokeRect(cx,cy,S,S);x.lineWidth=1.5;for(let i=1;i<6;i++){const p=i*S/6;x.beginPath();x.moveTo(cx+p,cy);x.lineTo(cx+p,cy+S);x.moveTo(cx,cy+p);x.lineTo(cx+S,cy+p);x.stroke()}
  x.strokeStyle=K.TINTA;x.lineWidth=3;x.beginPath();x.moveTo(cx+S/2,cy);x.lineTo(cx+S/2,cy+S);x.moveTo(cx,cy+S/2);x.lineTo(cx+S,cy+S/2);x.stroke();
  x.fillStyle=K.GRAF;x.font=`400 18px ${F}`;x.textAlign="center";x.fillText("Mais ordem",cx+S/2,cy-10);x.fillText("Mais liberdade",cx+S/2,cy+S+26);x.textAlign="left";
  {const px=cx+S/2+d.s.E/100*(S/2-16),py=cy+S/2-d.s.A/100*(S/2-16);x.fillStyle=K.TINTA;x.fillRect(px-16,py-16,32,32);x.fillStyle=K.VERDE;x.fillRect(px-12,py-12,24,24)}
  let ay=cy+S+70;const ax=cx-0,aw=1460-ax;for(const k of AXK6){x.font=`700 20px ${F}`;x.fillStyle=K.TINTA;const nm=AX[k].name+": ";x.fillText(nm,ax,ay);const w0=x.measureText(nm).width;x.font=`400 20px ${F}`;x.fillStyle=K.GRAF;let bd=band(d.s[k],k).toLowerCase();while(x.measureText(bd).width>aw-w0&&bd.length>4)bd=bd.slice(0,-2)+"…";x.fillText(bd,ax+w0,ay);ay+=29}
  const link=d.link||("https://"+SITE+"/");
  x.fillStyle=K.TINTA;x.font=`700 30px ${F}`;x.fillText("Faça o teste e compare comigo",90,790);x.font=`400 22px ${F}`;x.fillStyle=K.GRAF;x.fillText(SITE+"  ·  Não é recomendação de voto.",90,826);
  if(qr)desenharQR(x,link,1400,738,104,"#FFFFFF","#151513");
  return await new Promise(r=>c.toBlob(r,"image/png"));
}
// textos de compartilhar: o do link (aplicativos e "Copiar texto") e o que acompanha a imagem
function perfilCompartilhar(){return shareData.two?`entre ${shareData.top.n} e ${shareData.ranked[1].n}`:shareData.top.n}
function textoCompartilhar(){return `Meu resultado no Teste Político 2026: ${perfilCompartilhar()}. O teste mede seis eixos, mostra o grau de confiança do resultado e não recomenda voto. Faça o seu e compare com o meu: ${myLink()}`}
function textoImagem(){return `Meu resultado no Teste Político 2026: ${perfilCompartilhar()}. Faça o seu e compare com o meu: ${myLink()}`}
async function prepareShare(){shareFile=null;if(shareUrl){URL.revokeObjectURL(shareUrl);shareUrl=null}
  try{const blob=await buildImage({...shareData,link:myLink()},shOp);if(!blob)return false;shareFile=new File([blob],`resultado-teste-politico-${shOp.formato}.png`,{type:"image/png"});shareUrl=URL.createObjectURL(blob);
    $("shImg").src=shareUrl;$("shImg").dataset.formato=shOp.formato;$("shSave").href=shareUrl;$("shSave").download=shareFile.name;return true}catch(e){console.error(e);return false}}
const shareSheet=$("shareSheet");
async function mostrarImagem(){
  $("shNote").textContent="Gerando a imagem...";$("shImg").classList.add("hidden");$("shLoad").classList.remove("hidden");$("shSave").classList.add("hidden");$("shShare").classList.add("hidden");
  const ok=await prepareShare();$("shLoad").classList.add("hidden");
  if(!ok){$("shNote").textContent="Não deu pra gerar a imagem agora. Feche e tente de novo.";return}
  $("shImg").classList.remove("hidden");$("shSave").classList.remove("hidden");
  const can=navigator.canShare&&navigator.canShare({files:[shareFile]});$("shShare").classList.toggle("hidden",!can);
  const f=FORMATOS[shOp.formato];$("shNote").textContent=`${f.nome}: ${f.uso}.`+(can?" Em \"Compartilhar imagem\", escolha o aplicativo (pro story do Instagram: Instagram, depois Stories).":" Se o botão de salvar não funcionar, toque e segure na imagem.")}
// abre a janela da imagem já no formato escolhido
async function abrirImagem(formato){if(formato&&formato!==shOp.formato){shOp.formato=formato;shareFile=null}
  shareSheet.querySelectorAll("[data-formato]").forEach(o=>o.setAttribute("aria-pressed",String(o.dataset.formato===shOp.formato)));
  if(typeof shareSheet.showModal==="function")shareSheet.showModal();else shareSheet.setAttribute("open","");
  $("shZap").href="https://wa.me/?text="+encodeURIComponent(textoCompartilhar());$("shAviso").textContent="";
  if(!shareFile)await mostrarImagem();else{$("shImg").classList.remove("hidden");$("shSave").classList.remove("hidden")}}
// opções: refazem a imagem
// única opção da imagem: tema claro ou escuro (formato story, com todas as informações)
shareSheet.querySelectorAll("[data-tema]").forEach(b=>b.onclick=()=>{shOp.tema=b.dataset.tema;shareSheet.querySelectorAll("[data-tema]").forEach(o=>o.setAttribute("aria-pressed",String(o===b)));mostrarImagem()});
shareSheet.querySelectorAll("[data-formato]").forEach(b=>b.onclick=()=>{shOp.formato=b.dataset.formato;shareSheet.querySelectorAll("[data-formato]").forEach(o=>o.setAttribute("aria-pressed",String(o===b)));mostrarImagem()});

// bloco "Compartilhar e comparar" do resumo: os aplicativos que levam o link e os formatos da imagem (cada um diz onde funciona melhor)
const APPS=[
  ["WhatsApp",(t,u)=>`https://wa.me/?text=${encodeURIComponent(t)}`],
  ["X (Twitter)",(t,u)=>`https://twitter.com/intent/tweet?text=${encodeURIComponent(t.replace(u,"").trim())}&url=${encodeURIComponent(u)}`],
  ["Facebook",(t,u)=>`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`],
  ["Threads",(t,u)=>`https://www.threads.net/intent/post?text=${encodeURIComponent(t)}`],
  ["Telegram",(t,u)=>`https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t.replace(u,"").trim())}`]];
// Instagram e TikTok não aceitam link pronto: abrem uma janela explicando e publicam a imagem em story
const REDES_IMAGEM={
  instagram:{n:"Instagram",site:"https://www.instagram.com/",onde:"nos Stories"},
  tiktok:{n:"TikTok",site:"https://www.tiktok.com/upload",onde:"como foto ou story"}};
let miniaturasFeitas=false;
function montarPartilha(){
  const box=$("partilhaOut");box.innerHTML="";miniaturasFeitas=false;
  box.append(el("p","rotulo","Mandar por um aplicativo"));
  const apps=el("div","apps");const t=textoCompartilhar(),u=myLink();
  APPS.forEach(([n,f])=>{const a=el("a","secondary app",n);a.href=f(t,u);a.target="_blank";a.rel="noopener";apps.append(a)});
  Object.entries(REDES_IMAGEM).forEach(([k,r])=>{const b=el("button","secondary app",r.n);b.type="button";b.dataset.rede=k;b.setAttribute("aria-haspopup","dialog");b.onclick=()=>abrirRede(k);apps.append(b)});
  const bt=el("button","secondary app app-copiar","Copiar texto");bt.type="button";
  bt.onclick=async()=>{try{await navigator.clipboard.writeText(textoCompartilhar());bt.textContent="Texto copiado"}catch(e){bt.textContent="Não deu pra copiar"}setTimeout(()=>bt.textContent="Copiar texto",2000)};
  apps.append(bt);box.append(apps);
  box.append(el("p","rotulo","Ou publicar a imagem do resultado"));
  const fs=el("div","formatos");
  Object.entries(FORMATOS).forEach(([k,f])=>{const b=el("button","formato");b.type="button";b.dataset.f=k;
    const m=el("span","formato-molde");m.style.aspectRatio=`${f.w} / ${f.h}`;m.setAttribute("aria-hidden","true");
    const tx=el("span","formato-txt");tx.append(el("b",null,f.nome),el("small",null,f.uso));b.append(m,tx);b.onclick=()=>abrirImagem(k);fs.append(b)});
  box.append(fs);
  // miniaturas: a imagem de verdade de cada formato, desenhada em segundo plano quando o bloco aparece
  const fazer=()=>{if(miniaturasFeitas)return;miniaturasFeitas=true;desenharMiniaturas(fs)};
  if("IntersectionObserver"in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();fazer()}},{rootMargin:"300px"});io.observe(fs)}else fazer();
}
async function desenharMiniaturas(fs){
  for(const b of fs.querySelectorAll(".formato")){const k=b.dataset.f,m=b.querySelector(".formato-molde");
    try{const blob=await buildImage({...shareData,link:myLink()},{...shOp,formato:k,tema:"claro"});if(!blob)continue;
      const i=document.createElement("img");i.alt="";i.src=URL.createObjectURL(blob);i.onload=()=>m.classList.add("pronta");m.append(i)}catch(e){}}
}
const redeSheet=$("redeSheet");
function abrirRede(k){const r=REDES_IMAGEM[k],celular=matchMedia("(pointer:coarse)").matches;redeSheet.dataset.rede=k;
  $("redeTitle").textContent=`Compartilhar no ${r.n}`;
  $("redeTexto").textContent=`O ${r.n} não aceita link pronto vindo de outro site, então o jeito é publicar a imagem do resultado ${r.onde}.`;
  $("redeComo").textContent=celular?`Ao continuar, o celular abre a lista de aplicativos com a imagem já pronta: escolha ${r.n}. Depois, se quiser, cole o link de comparação (ele é copiado junto) como texto ou adesivo de link.`
    :`Ao continuar, a imagem é baixada no seu computador e o ${r.n} abre numa aba nova pra você publicar. O link de comparação é copiado, pra você colar na legenda ou na bio.`;
  $("redeIr").textContent=celular?`Continuar no ${r.n}`:`Baixar imagem e abrir o ${r.n}`;
  if(typeof redeSheet.showModal==="function")redeSheet.showModal();else redeSheet.setAttribute("open","")}
$("redeIr").onclick=async()=>{const r=REDES_IMAGEM[redeSheet.dataset.rede];closeDlg(redeSheet);await publicarImagem(r)};
$("redeCancelar").onclick=$("redeClose").onclick=()=>closeDlg(redeSheet);redeSheet.addEventListener("click",e=>{if(e.target===redeSheet)closeDlg(redeSheet)});
// no celular, o compartilhar do sistema (com a imagem em story); no computador, baixa a imagem e abre o site da rede
async function publicarImagem(r){
  shOp.formato="story";shareFile=null;await prepareShare();
  try{await navigator.clipboard.writeText(myLink())}catch(e){}
  if(shareFile&&navigator.canShare&&navigator.canShare({files:[shareFile]})){try{await navigator.share({files:[shareFile],text:textoImagem()});return}catch(e){if(e&&e.name==="AbortError")return}}
  if(shareUrl){const a=document.createElement("a");a.href=shareUrl;a.download=shareFile?shareFile.name:"resultado-teste-politico.png";document.body.append(a);a.click();a.remove()}
  window.open(r.site,"_blank","noopener");
}
$("shShare").onclick=async()=>{try{await navigator.share({files:[shareFile],text:textoImagem(),title:"Meu resultado no Teste Político 2026"})}catch(e){}};
async function copiar(t,msg){try{await navigator.clipboard.writeText(t)}catch(e){const a=document.createElement("textarea");a.value=t;document.body.append(a);a.select();try{document.execCommand("copy")}catch(_){}a.remove()}$("shAviso").textContent=msg}
$("shLink").onclick=()=>copiar(myLink(),"Link de comparação copiado.");
$("shTexto").onclick=()=>copiar(textoImagem(),"Texto copiado, com o link pra comparar.");
$("shClose").onclick=()=>closeDlg(shareSheet);shareSheet.addEventListener("click",e=>{if(e.target===shareSheet)closeDlg(shareSheet)});
