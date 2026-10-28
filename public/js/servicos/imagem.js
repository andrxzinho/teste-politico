// Compartilhar: imagem em forma de urna em quatro formatos (story 9:16, retrato 4:5, quadrado 1:1 e paisagem 16:9), no
// tema do site, com QR code pro link de comparação; janela com WhatsApp, Instagram, X e cópia do texto.
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
  x.fillStyle=K.GRAF;x.font=`700 26px ${F}`;x.fillText("TESTE POLÍTICO",110,bx.y+70);x.textAlign="right";x.fillText("MODO "+String(d.modo).toUpperCase(),970,bx.y+70);x.textAlign="left";
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
  // presidente e partido mais perto: uma linha cada, só se couber no visor
  if(op.cand)[["pres","PRESIDENTE"],["part","PARTIDO"]].forEach(([k,rot])=>{const c0=(d.cand[k]||[])[0];if(!c0||y+48>limite)return;
    x.fillStyle=K.TINTA;x.font=`700 24px ${F}`;x.fillText(rot,L,y);x.font=`400 24px ${F}`;x.fillStyle=K.GRAF;
    let nm=`Mais perto: ${c0.n}`;while(x.measureText(nm).width>W-380&&nm.length>4)nm=nm.slice(0,-2)+"…";
    x.fillText(nm,L+170,y);x.textAlign="right";x.fillStyle=K.VERDE2;x.font=`700 23px ${F}`;x.fillText(matchLab(c0.match),L+W,y);x.textAlign="left";y+=46});
  const aviso=op.cand?"Compatibilidade estimada pelo que cada um fez. Não é recomendação de voto.":"Resultado aproximado do teste. Não é recomendação de voto.";
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
  x.fillStyle=K.GRAF;x.font=`700 24px ${F}`;x.fillText("TESTE POLÍTICO",90,90);x.textAlign="right";x.fillText("MODO "+String(d.modo).toUpperCase(),1510,90);x.textAlign="left";
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
  if(op.cand&&d.cand.pres&&d.cand.pres.length){const c0=d.cand.pres[0];x.fillStyle=K.TINTA;x.font=`700 22px ${F}`;x.fillText("PRESIDENTE MAIS PERTO",L,y+10);x.font=`400 22px ${F}`;x.fillStyle=K.GRAF;x.fillText(`${c0.n}: ${matchLab(c0.match).toLowerCase()}`,L+320,y+10)}
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
function textoCompartilhar(){return `Meu resultado no Teste Político: ${perfilCompartilhar()}. O teste mede seis eixos, mostra o grau de confiança do resultado e não recomenda voto. Faça o seu e compare com o meu: ${myLink()}`}
function textoImagem(){return `Meu resultado no Teste Político: ${perfilCompartilhar()}. Faça o seu e compare com o meu: ${myLink()}`}
async function prepareShare(){shareFile=null;if(shareUrl){URL.revokeObjectURL(shareUrl);shareUrl=null}
  try{const blob=await buildImage({...shareData,link:myLink()},shOp);if(!blob)return false;shareFile=new File([blob],`resultado-teste-politico-${shOp.formato}.png`,{type:"image/png"});shareUrl=URL.createObjectURL(blob);
    $("shImg").src=shareUrl;$("shImg").dataset.formato=shOp.formato;$("shSave").href=shareUrl;$("shSave").download=shareFile.name;return true}catch(e){console.error(e);return false}}
const shareSheet=$("shareSheet");
// a imagem segue o tema do site (o escolhido no menu ou, sem escolha, o do aparelho)
const temaSite=()=>{const t=document.documentElement.dataset.theme;return t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches)?"escuro":"claro"};
const notaFormato=()=>{const f=FORMATOS[shOp.formato];$("shNote").textContent=`${f.nome}: ${f.uso}.`};
async function mostrarImagem(){
  $("shNote").textContent="";$("shImg").classList.add("hidden");$("shLoad").classList.remove("hidden");$("shSave").classList.add("hidden");
  const ok=await prepareShare();$("shLoad").classList.add("hidden");
  if(!ok){$("shNote").textContent="Não deu pra gerar a imagem agora. Feche e tente de novo.";return}
  $("shImg").classList.remove("hidden");$("shSave").classList.remove("hidden");notaFormato()}
// janela de compartilhar: o formato da imagem (proporção) e os quatro jeitos de compartilhar
async function abrirImagem(formato){if(formato&&formato!==shOp.formato){shOp.formato=formato;shareFile=null}
  const tema=temaSite();if(tema!==shOp.tema){shOp.tema=tema;shareFile=null}
  shareSheet.querySelectorAll("button[data-formato]").forEach(o=>o.setAttribute("aria-pressed",String(o.dataset.formato===shOp.formato)));$("shAviso").textContent="";
  if(typeof shareSheet.showModal==="function")shareSheet.showModal();else shareSheet.setAttribute("open","");
  if(!shareFile)await mostrarImagem();else{$("shImg").classList.remove("hidden");$("shSave").classList.remove("hidden");notaFormato()}}
shareSheet.querySelectorAll("button[data-formato]").forEach(b=>b.onclick=()=>{if(b.dataset.formato===shOp.formato&&shareFile)return;shOp.formato=b.dataset.formato;
  shareSheet.querySelectorAll("button[data-formato]").forEach(o=>o.setAttribute("aria-pressed",String(o===b)));mostrarImagem()});
$("abrirPartilha").onclick=()=>abrirImagem();
async function copiar(t){try{await navigator.clipboard.writeText(t);return true}catch(e){const a=document.createElement("textarea");a.value=t;document.body.append(a);a.select();let ok=false;try{ok=document.execCommand("copy")}catch(_){}a.remove();return ok}}
const aviso=t=>{$("shAviso").textContent=t};
function baixarImagem(){if(!shareUrl)return;const a=document.createElement("a");a.href=shareUrl;a.download=shareFile?shareFile.name:"resultado-teste-politico.png";document.body.append(a);a.click();a.remove()}
// WhatsApp e X recebem o texto com o link (que mostra a prévia do resultado). O Instagram não aceita link vindo de outro
// site, então recebe a imagem no formato escolhido: no celular pela lista de aplicativos do sistema; no computador, a imagem
// é baixada e o Instagram abre numa aba nova. Os endereços abrem direto no clique (sem esperar nada antes), pra o
// navegador não bloquear a aba nova.
const REDES={
  whatsapp:()=>{window.open("https://wa.me/?text="+encodeURIComponent(textoCompartilhar()),"_blank","noopener");aviso("Abrindo o WhatsApp com o texto e o seu link de comparação.")},
  x:()=>{const u=myLink();window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(textoCompartilhar().replace(u,"").trim())}&url=${encodeURIComponent(u)}`,"_blank","noopener");aviso("Abrindo o X com o texto e o seu link de comparação.")},
  instagram:()=>{if(!shareFile){aviso("Espere a imagem ficar pronta e toque de novo.");return}
    copiar(myLink());
    if(navigator.canShare&&navigator.canShare({files:[shareFile]})){navigator.share({files:[shareFile],text:textoImagem()}).catch(()=>{});
      aviso("Escolha o Instagram na lista (pro story: Instagram, depois Stories). O link de comparação foi copiado, se quiser colar como adesivo de link.");return}
    window.open("https://www.instagram.com/","_blank","noopener");baixarImagem();
    aviso("A imagem foi baixada e o Instagram abriu numa aba nova. O link de comparação foi copiado, pra colar na legenda.")},
  texto:async()=>{aviso(await copiar(textoCompartilhar())?"Texto copiado, com o link pra comparar. É só colar onde quiser.":"Não deu pra copiar. Tente de novo.")}};
shareSheet.querySelectorAll("[data-rede]").forEach(b=>b.onclick=()=>REDES[b.dataset.rede]());
$("shClose").onclick=()=>closeDlg(shareSheet);shareSheet.addEventListener("click",e=>{if(e.target===shareSheet)closeDlg(shareSheet)});
