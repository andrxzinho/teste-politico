// Fotos de pessoas e capas de livros. As imagens ficam em /img/p (pessoas) e /img/l (livros), geradas por
// ferramentas/gerar_imagens.mjs, que também escreve IMAGENS (public/js/dados/imagens.js) e a página de créditos.
// Sem imagem disponível, aparece um retrato ou uma capa tipográfica no estilo do site.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
const slugFoto=s=>String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const semPartido=n=>String(n).replace(/\s*\(.*\)\s*$/,"");
function fotoPessoa(nome,tam=""){
  const s=slugFoto(semPartido(nome));
  if(typeof IMAGENS!=="undefined"&&IMAGENS.p.includes(s)){const i=document.createElement("img");i.className="foto"+(tam?" "+tam:"");i.src=`/img/p/${s}.webp`;i.alt="";i.loading="lazy";i.decoding="async";i.width=56;i.height=56;return i}
  const ini=semPartido(nome).replace(/^(Dra?\.|Dom)\s+/,"").split(/\s+/).filter(p=>p.length>2||/^[A-ZÁ-Ú]/.test(p)).map(p=>p[0]).slice(0,2).join("").toUpperCase();
  const e=el("span","foto foto-ini"+(tam?" "+tam:""),ini);e.setAttribute("aria-hidden","true");return e;
}
function capaLivro(t,a){
  const s=slugFoto(t+" "+a).slice(0,70);
  if(typeof IMAGENS!=="undefined"&&IMAGENS.l.includes(s)){const i=document.createElement("img");i.className="capa";i.src=`/img/l/${s}.webp`;i.alt="";i.loading="lazy";i.decoding="async";i.width=60;i.height=90;return i}
  const c=el("span","capa capa-tipo");c.setAttribute("aria-hidden","true");c.append(el("b",null,t),el("small",null,a.split(" e ")[0]));return c;
}
