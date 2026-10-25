// Gera as páginas públicas estáticas a partir dos dados do teste (fonte única: public/js/dados/ideologias.js):
//   /ideologias/ (lista com filtro), /ideologias/<nome>/ (uma por ideologia), /perguntas-frequentes/,
//   além de sitemap.xml e robots.txt. Rode da raiz do projeto: npm run paginas
import fs from "node:fs";
import vm from "node:vm";

const SITE = "https://testepolitico.vercel.app";
const REPO = "https://github.com/andrxzinho/teste-politico";
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync("public/js/dados/ideologias.js", "utf8") + ";" + fs.readFileSync("public/js/dados/leituras.js", "utf8") + ";globalThis.D={AX,IDEO,IDEO_GRUPOS,IDEO_RESUMO,LEITURAS};", ctx);
const { AX, IDEO, IDEO_GRUPOS, IDEO_RESUMO, LEITURAS } = ctx.D;
const EXTREMOS = ["Comunista", "Anarquista", "Anarcocapitalista", "Fascista", "Extrema direita", "Extrema esquerda"];
const anoObra = (a) => (a < 0 ? `c. ${-a} a.C.` : String(a));
// edição citada e link conferido de cada livro, como no resultado (linhaEdicao em public/js/telas/extras.js)
const edicao = (x) => (x ? `<p class="livro-ed">${x.ed ? `<span>${esc(x.ed)}</span>` : ""}${x.link ? `<a href="${esc(x.link)}" target="_blank" rel="noopener">${esc(x.onde)}</a>` : ""}</p>` : "");
const livros = (l) => l.map(([t, a, ano, d, x]) => `<div class="livro"><b>${esc(t)}</b><small>${esc(a)}, ${anoObra(ano)}</small><p>${esc(d)}</p>${edicao(x)}</div>`).join("");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const slug = (n) => n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const grupoDe = (n) => (IDEO_GRUPOS.find(([, l]) => l.includes(n)) || ["Outras"])[0];
const EIXOS = ["E", "A", "C", "N", "D"];
// mesmas faixas do resultado (band em public/js/nucleo/calculo.js), pra página e resultado darem o mesmo nome à mesma posição
function rotulo(v, k) {
  if (v <= -40) return AX[k].left;
  if (v <= -12) return `${AX[k].left} (moderado)`;
  if (v < 12) return "Centro";
  if (v < 40) return `${AX[k].right} (moderado)`;
  return AX[k].right;
}
// o que separa uma ideologia de uma vizinha: os eixos com diferença de 15 pontos ou mais, do maior pro menor
const DIFERE = { E: ["mais à esquerda na economia", "mais à direita na economia"], A: ["dá mais peso à liberdade", "dá mais peso à ordem"], D: ["com mais compromisso democrático", "aceita mais rupturas com a democracia"] };
function diferenca(o, v) {
  const ds = EIXOS.map((k) => [k, (o.p[k] ?? 0) - (v.p[k] ?? 0)]).filter(([, d]) => Math.abs(d) >= 15).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 2);
  if (!ds.length) return "posições típicas muito parecidas. O teste separa as duas só em poucos subtemas.";
  // nos costumes e no Brasil × Mundo, quando as duas estão do mesmo lado, "menos progressista" diz melhor que "mais conservadora"
  const ADJ = { C: ["progressista", "conservadora", "nos costumes"], N: ["aberta à cooperação com o mundo", "nacionalista", ""] };
  const t = ds.map(([k, d]) => {
    if (!ADJ[k]) return DIFERE[k][d < 0 ? 0 : 1];
    const [esq, dir, onde] = ADJ[k], x = o.p[k] ?? 0, fim = onde ? " " + onde : "";
    return (d < 0 ? (x >= 12 ? `menos ${dir}` : `mais ${esq}`) : (x <= -12 ? `menos ${esq}` : `mais ${dir}`)) + fim;
  });
  return t.join("; ") + ".";
}
const dist = (a, b) => Math.hypot(...EIXOS.map((k) => (a.p[k] ?? 0) - (b.p[k] ?? 0)));

function pagina({ caminho, titulo, descricao, corpo, scripts = [], doc = false }) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${SITE}${caminho}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:image" content="${SITE}/og-urna.png">
<meta property="og:locale" content="pt_BR">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#2B2A27">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/css/fontes.css">
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/componentes.css">
<link rel="stylesheet" href="/css/movimento.css">
${doc ? `<link rel="stylesheet" href="/css/documento.css">
` : ""}<script src="/js/navegacao.js"></script>
<style>body{margin:0;background:var(--corpo);color:var(--tinta);font-family:var(--font);-webkit-font-smoothing:antialiased}*,*::before,*::after{box-sizing:border-box}a{color:inherit;text-underline-offset:3px}</style>
</head>
<body>
<a class="pular" href="#conteudo">Pular pro conteúdo</a>
<header id="site-cab"></header>
<main id="conteudo" class="${doc ? "legal" : "pagina"}">
${corpo}
</main>
<footer id="site-rod"></footer>
${scripts.map((s) => `<script src="${s}"></script>`).join("\n")}
</body>
</html>
`;
}
const gravar = (arq, html) => { fs.mkdirSync(arq.replace(/\/[^/]+$/, ""), { recursive: true }); fs.writeFileSync(arq, html); };
const urls = ["/", "/metodologia.html", "/termos.html"];

// lista das ideologias
{
  const filtros = [["todas", "Todas"], ...IDEO_GRUPOS.map(([g]) => [slug(g), g])].map(([k, t], i) => `<button type="button" data-grupo="${k}" aria-pressed="${i === 0}">${esc(t)}</button>`).join("");
  const cartoes = IDEO_GRUPOS.flatMap(([g, l]) => l.map((n) => `<a class="cartao" data-grupo="${slug(g)}" href="/ideologias/${slug(n)}/"><span><b>${esc(n)}</b><small>${esc(IDEO_RESUMO[n])}</small></span></a>`)).join("\n");
  gravar("public/ideologias/index.html", pagina({
    caminho: "/ideologias/", titulo: "As 21 ideologias do teste político",
    descricao: "O que defende cada uma das 21 tradições políticas usadas no teste, do centro aos extremos, e onde cada uma fica nos eixos.",
    scripts: ["/js/paginas/ideologias.js"],
    corpo: `<h1 class="titulo-pagina">As 21 ideologias</h1>
<p class="intro-pagina">As tradições políticas que o teste compara com as suas respostas. Toque numa pra ver o que ela defende, onde fica em cada eixo e quais são as vizinhas (as mais parecidas com ela).</p>
<div class="filtros" role="group" aria-label="Filtrar por família">${filtros}</div>
<p class="contagem" aria-live="polite">${IDEO.length} ideologias</p>
<div class="lista-ideo">
${cartoes}
</div>`,
  }));
  urls.push("/ideologias/");
}

// uma página por ideologia
for (const o of IDEO) {
  const n = o.n, g = grupoDe(n);
  const viz = IDEO.filter((x) => x.n !== n).sort((a, b) => dist(o, a) - dist(o, b)).slice(0, 3);
  const eixos = EIXOS.map((k) => `<div class="eixo-tipico"><div class="topo"><b>${esc(AX[k].name)}</b><span>${esc(rotulo(o.p[k] ?? 0, k))}</span></div><div class="trilho"><i style="left:${((o.p[k] ?? 0) + 100) / 2}%"></i></div><div class="pontas"><span>${esc(AX[k].left)}</span><span>${esc(AX[k].right)}</span></div></div>`).join("\n");
  gravar(`public/ideologias/${slug(n)}/index.html`, pagina({
    caminho: `/ideologias/${slug(n)}/`, titulo: `${n}: o que defende | Teste político`,
    descricao: `${IDEO_RESUMO[n]} Veja onde fica em cada eixo e as ideologias vizinhas.`,
    corpo: `<div class="pagina-estreita">
<nav class="trilha" aria-label="Você está em"><a href="/ideologias/">Ideologias</a> / ${esc(n)}</nav>
<div class="visor-pagina"><span class="familia">Família: ${esc(g)}</span><h1>${esc(n)}</h1><p>${esc(IDEO_RESUMO[n])}</p></div>
<h2 class="rotulo-secao">Posição típica nos eixos</h2>
<div class="eixos-tipicos">
${eixos}
</div>
<p class="intro-pagina" style="margin-top:.6rem;font-size:.88rem">É onde ficaria alguém típico dessa tradição. O teste usa esse ponto como referência. Pessoas da mesma ideologia ficam espalhadas em volta dele.</p>
<h2 class="rotulo-secao">Pra entender por dentro</h2>
<p class="intro-pagina" style="font-size:.9rem;margin-bottom:.6rem">${EXTREMOS.includes(n) ? `Fontes históricas e textos de referência de ${esc(n)}, pra entender o que essa tradição defendeu. Não é recomendação.` : `Obras que ajudam a entender ${esc(n)} como os próprios defensores a entendem.`}</p>
<div class="livros">${livros(LEITURAS[n].favor)}</div>
<h2 class="rotulo-secao">Pra entender as críticas</h2>
<p class="intro-pagina" style="font-size:.9rem;margin-bottom:.6rem">As críticas mais fortes, vindas de lados diferentes. Conhecer o melhor argumento contrário ajuda a pensar melhor sobre o seu.</p>
<div class="livros">${livros(LEITURAS[n].contra)}</div>
<h2 class="rotulo-secao">Ideologias vizinhas</h2>
<div class="vizinhas">${viz.map((v) => `<a href="/ideologias/${slug(v.n)}/">${esc(v.n)}</a>`).join("")}</div>
<ul class="lista-pagina diferencas">${viz.map((v) => `<li>Comparada com <b>${esc(v.n)}</b>: ${esc(diferenca(o, v))}</li>`).join("")}</ul>
<div class="acoes-pagina"><a class="ok" href="/?ideologia=${slug(n)}">Comparar com o meu resultado</a><a class="branco" href="/#modos">Fazer o teste</a></div>
</div>`,
  }));
  urls.push(`/ideologias/${slug(n)}/`);
}

// perguntas frequentes: agrupadas por tema, no mesmo formato dos termos e da metodologia (sumário lateral fixo)
const FAQ = [
  ["resultado", "Sobre o resultado", [
    ["O que quer dizer a porcentagem ao lado de cada ideologia?", ["É a chance de cada ideologia dentro do modelo do teste, comparando as 21 entre si. Todas juntas somam 100%.", "Ela não mostra o quanto você concorda com a ideologia. Pra ver o quanto as suas posições se parecem com uma ideologia, use \"Comparar com uma ideologia\" no resultado completo."]],
    ["O que significa confiança alta, média ou baixa?", ["Ela mostra o quanto o resultado ficou claro, dentro das regras do teste. Não diz se o teste acertou sobre você, porque isso ainda não foi conferido com pessoas reais.", "A confiança junta três coisas: o quanto a primeira ideologia ficou à frente das outras, a precisão da sua posição nos eixos (que depende de quantas frases você respondeu) e a coerência das suas respostas.", "Quem responde quase tudo no meio-termo, ou concorda (ou discorda) de quase tudo, não recebe confiança alta."]],
    ["Por que apareceram duas ideologias?", ["Quando a segunda ideologia tem pelo menos 60% da chance da primeira, o teste mostra as duas. Isso pode acontecer porque você está entre as duas tradições, ou porque o teste tem poucas frases que separam as duas. Às vezes ele faz algumas perguntas extras pra desempatar."]],
    ["Respondi quase tudo no meio-termo e deu Centrista. Isso quer dizer o quê?", ["Pode ser que você seja moderado de verdade. Ou pode ser que ainda não tenha opinião formada sobre muitos temas. O teste não consegue saber qual das duas.", "Por isso o resultado avisa que o rótulo diz pouco, e a confiança fica baixa. Olhe os eixos pra ver onde você pendeu pra algum lado."]],
    ["Por que o resultado pode mudar se eu refizer?", ["Algumas coisas deixam o resultado menos firme: muitas respostas no meio, muitos \"Não tenho opinião\" e os modos mais curtos. Além disso, quando duas ideologias estão próximas, mudar de ideia em poucas frases já pode trocar o resultado."]],
    ["Por que comunismo, fascismo e outros extremos quase nunca aparecem?", ["Os quatro extremos (comunismo, anarquismo, fascismo e anarcocapitalismo) só entram na disputa se você concordar com as frases que definem cada um. Estar longe do centro nos eixos não basta.", "O termômetro dos extremos mostra um índice de 0 a 100. Ele não é uma probabilidade (chance)."]],
    ["A compatibilidade com candidatos é recomendação de voto?", ["Não. Ela compara a sua posição com uma estimativa da posição de cada candidato, feita a partir do que cada um fez publicamente. As duas posições têm margem de erro. Por isso, diferenças pequenas não querem dizer muito."]],
  ]],
  ["teste", "Sobre o teste", [
    ["O teste é confiável?", ["Ainda não se sabe com pessoas reais. O cálculo foi testado com pessoas simuladas pelo computador, criadas a partir das posições típicas das 21 ideologias. Nessas simulações, no modo Padrão, a ideologia certa aparece em primeiro em cerca de 96 de cada 100 casos.", "Mas essas pessoas simuladas foram criadas com as mesmas posições que o teste usa pra classificar. Quando essas posições foram alteradas em cerca de 20 pontos, o acerto caiu pra cerca de 8 em 10 no Essencial. Com pessoas reais, o acerto deve ser menor. O resultado é uma aproximação, não um diagnóstico."]],
    ["O teste é científico?", ["Ele usa técnicas da psicometria, a área que estuda como medir opiniões e traços de personalidade com questionários. Por exemplo: perguntas de escolha pra corrigir o jeito de responder, e pares de frases pra medir a coerência.", "Mas ainda não foi conferido com um grupo grande de pessoas reais. Isso depende dos dados do estudo."]],
    ["Quanto tempo leva?", ["Essencial: de 62 a 70 perguntas, uns 9 minutos. Padrão: de 128 a 139, uns 18 minutos. Aprofundado: de 205 a 216, uns 30 minutos. Os tempos são estimativas.", "O número de perguntas varia porque algumas frases só aparecem pra quem já está perto de um extremo.", "Dá pra pausar e continuar depois no mesmo aparelho. E quem termina um modo menor pode seguir pro próximo sem repetir nada."]],
    ["Qual modo devo escolher?", ["O Essencial dá uma ideia geral. O Padrão mede cada tema com mais detalhe e confere melhor se as suas respostas combinam entre si. O Aprofundado tem mais frases em cada tema, mas, nas simulações, não acerta a ideologia mais que o Padrão."]],
    ["O que são os 6 eixos?", ["Eixos são os grandes temas em que o teste coloca você, cada um com duas pontas opostas. São seis: Economia (mais Estado ou mais mercado), Liberdade × Ordem, Costumes, Brasil × Mundo, Democracia e Instituições (confiança no sistema).", "Os cinco primeiros são divididos em subtemas (assuntos menores dentro do tema). Instituições não tem subtemas e não entra na escolha da ideologia. O resultado mostra a sua posição em cada eixo e a faixa provável, que é o trecho onde ela provavelmente está."]],
    ["Quem decidiu onde fica cada ideologia?", ["O autor do projeto, a partir da teoria política. As posições estão publicadas no código e na página de cada ideologia, e serão revisadas com os dados do estudo. A auditoria publicada no repositório (uma revisão do método) aponta os pontos mais discutíveis."]],
  ]],
  ["dados", "Dados e privacidade", [
    ["Meus dados são enviados?", ["Só se você aceitar participar do estudo. E nada que identifique você é enviado: nunca vão nome, e-mail, IP (o endereço da sua conexão) ou localização. Quem informa ter menos de 18 anos faz o teste, mas nada é enviado.", "Dá pra fazer o teste inteiro sem participar. Os detalhes estão nos termos de uso e privacidade."]],
    ["Posso comparar com amigos?", ["Sim. No resumo do resultado, o bloco \"Compartilhar e comparar\" mostra o seu link de comparação. Quem abrir o link faz o teste e, no fim, vê os dois resultados lado a lado. Se alguém já mandou um link pra você, é só colar no mesmo bloco.", "O link leva só a sua ideologia, o modo e a sua posição nos eixos. Ele não leva a sua resposta em cada frase. A comparação acontece no aparelho, sem enviar nada."]],
  ]],
  ["projeto", "Sobre o projeto", [
    ["Quem fez o teste?", ["Projeto independente e sem fins lucrativos. Sem ligação com partidos, candidatos, governos ou a Justiça Eleitoral. O visual só se inspira na urna eletrônica, sem símbolos oficiais. Não é recomendação de voto."]],
    ["Posso ver o código?", ["Sim. O código-fonte (as instruções que fazem o site funcionar) está publicado no GitHub, inclusive as frases, o cálculo e os testes. Veja a página Código-fonte público."]],
    ["Achei uma frase enviesada ou um erro. Como aviso?", ["Abra um aviso (uma \"issue\") no repositório do projeto no GitHub. Explique o problema e, se puder, mande a fonte. Falhas de segurança ou de privacidade não devem ser abertas em público: use o canal indicado no arquivo SECURITY.md."]],
  ]],
];
gravar("public/perguntas-frequentes/index.html", pagina({
  caminho: "/perguntas-frequentes/", titulo: "Perguntas frequentes | Teste político", doc: true, scripts: ["/js/sumario.js"],
  descricao: "Como o teste político funciona, o que significam a porcentagem e a confiança, quanto tempo leva, o que acontece com os seus dados e mais.",
  corpo: `<div class="legal-cab">
<p class="legal-rotulo">Ajuda</p>
<h1>Perguntas frequentes</h1>
<ul class="legal-datas"><li><b>Última atualização:</b> 25 de outubro de 2026</li></ul>
</div>
<div class="legal-corpo">
<nav class="sumario" aria-labelledby="sumario-t">
<h2 id="sumario-t">Nesta página</h2>
<ol>
${FAQ.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("\n")}
</ol>
</nav>
<div class="texto">
${FAQ.map(([id, t, ps]) => `<section id="${id}">
<h2>${esc(t)}</h2>
${ps.map(([p, rs]) => `<h3>${esc(p)}</h3>\n${rs.map((r) => `<p>${esc(r)}</p>`).join("\n")}`).join("\n")}
</section>`).join("\n")}
<p class="legal-fim">Não achou a resposta? Veja a <a href="/metodologia.html">metodologia</a>, os <a href="/termos.html">termos de uso e privacidade</a> ou abra um aviso no <a href="${REPO}/issues" rel="noopener">repositório do projeto</a>.</p>
</div>
</div>`,
}));
urls.push("/perguntas-frequentes/");

// créditos das fotos e capas (licenças livres do Wikimedia Commons e capas do Open Library)
const CRED = fs.existsSync("ferramentas/creditos-imagens.json") ? JSON.parse(fs.readFileSync("ferramentas/creditos-imagens.json", "utf8")) : { pessoas: {}, livros: {} };
const temImg = (d, k) => fs.existsSync(`public/img/${d}/${k}.webp`);
const linhasP = Object.entries(CRED.pessoas).filter(([k]) => temImg("p", k)).sort((a, b) => a[1].n.localeCompare(b[1].n, "pt"))
  .map(([k, c]) => `<li><b>${esc(c.n)}</b>: ${esc(c.autor)}, licença ${esc(c.licenca)}. <a href="${esc(c.fonte)}" rel="noopener">Fonte</a></li>`).join("\n");
const linhasL = Object.entries(CRED.livros).filter(([k]) => temImg("l", k)).sort((a, b) => a[1].t.localeCompare(b[1].t, "pt"))
  .map(([k, c]) => {
    const ed = c.edicao ? ` Edição: ${esc(c.edicao)}${c.isbn ? `, ISBN ${esc(c.isbn)}` : ""}.` : c.titulo_ol && !c.fonte ? "" : "";
    const lic = c.licenca ? ` Licença: ${esc(c.licenca)}.` : "";
    const fonte = c.ol ? `<a href="${esc(c.ol)}" rel="noopener">Open Library</a>` : `<a href="${esc(c.fonte)}" rel="noopener">Imagem</a>`;
    return `<li><b>${esc(c.t)}</b> (${esc(c.a)}).${ed}${lic} ${fonte}</li>`;
  }).join("\n");
gravar("public/creditos/index.html", pagina({
  caminho: "/creditos/", titulo: "Créditos das imagens | Teste político",
  descricao: "Autores e licenças das fotos e capas usadas no teste político.",
  corpo: `<div class="pagina-estreita">
<h1 class="titulo-pagina">Créditos das imagens</h1>
<p class="intro-pagina">As fotos de pessoas vêm do Wikimedia Commons, em domínio público ou com licença livre (Creative Commons). As fotos oficiais de candidatura vêm do Portal de Dados Abertos do TSE (licença CC BY). Todas foram recortadas e reduzidas.</p>
<p class="intro-pagina">As capas de livros mostram a edição brasileira sempre que possível. Elas vêm do Open Library, de catálogos de livrarias (pelo ISBN, o número de cada edição) e, pra obras antigas, do Wikimedia Commons. As capas servem só pra identificar as obras, e os direitos são das editoras. Quando não há imagem, o site mostra as iniciais ou uma capa feita só com texto.</p>
<h2 class="rotulo-secao">Fotos de pessoas</h2>
<ul class="creditos">${linhasP}</ul>
<h2 class="rotulo-secao">Capas de livros</h2>
<ul class="creditos">${linhasL}</ul>
<p class="intro-pagina">Encontrou uma imagem com crédito errado ou que não deveria estar aqui? Abra um aviso no <a href="${REPO}/issues" rel="noopener">repositório do projeto</a> e ela é corrigida ou removida.</p>
</div>`,
}));
urls.push("/creditos/");

// código-fonte público: o que está no repositório, onde fica cada parte, como conferir e o que a licença permite
const ARQ = (caminho, texto) => `<li><a href="${REPO}/blob/main/${caminho}" rel="noopener"><code>${esc(caminho)}</code></a>: ${texto}</li>`;
gravar("public/codigo-aberto/index.html", pagina({
  caminho: "/codigo-aberto/", titulo: "Código-fonte público | Teste político", doc: true, scripts: ["/js/sumario.js"],
  descricao: "Todo o código do teste político está publicado no GitHub: as frases, o cálculo, os dados das ideologias e candidatos, o servidor do estudo e os testes.",
  corpo: `<div class="legal-cab">
<p class="legal-rotulo">Transparência</p>
<h1>Código-fonte público</h1>
<ul class="legal-datas"><li><b>Repositório:</b> <a href="${REPO}" rel="noopener">github.com/andrxzinho/teste-politico</a></li><li><b>Licença:</b> PolyForm Strict 1.0.0</li></ul>
</div>
<div class="resumo-legal">
<h2>Em resumo</h2>
<ul>
<li>Tudo o que decide o seu resultado está publicado: as frases, a direção de cada uma, o cálculo e as posições das ideologias.</li>
<li>O cálculo roda inteiro no seu navegador. O servidor só recebe o resultado de quem aceita participar do estudo.</li>
<li>Qualquer pessoa pode baixar o código, rodar o teste no próprio computador e conferir os testes automáticos.</li>
</ul>
<div class="acoes-pagina acoes-pagina-linha"><a class="ok" href="${REPO}" rel="noopener">Ver o código no GitHub</a><a class="branco" href="/metodologia.html">Ler a metodologia</a></div>
</div>
<div class="legal-corpo">
<nav class="sumario" aria-labelledby="sumario-t">
<h2 id="sumario-t">Nesta página</h2>
<ol>
<li><a href="#porque">Por que publicar</a></li>
<li><a href="#onde">Onde fica cada parte</a></li>
<li><a href="#como">Como o site é feito</a></li>
<li><a href="#rodar">Rodar no seu computador</a></li>
<li><a href="#testes">Testes automáticos</a></li>
<li><a href="#licenca">O que a licença permite</a></li>
<li><a href="#contribuir">Como contribuir</a></li>
</ol>
</nav>
<div class="texto">
<section id="porque">
<h2>Por que publicar</h2>
<p>Um teste político pede confiança: você conta o que pensa e recebe um rótulo. Se o cálculo ficasse escondido, não daria pra saber se alguma frase ou peso favorece um lado.</p>
<p>Com o código publicado, qualquer pessoa pode conferir como cada resposta vira uma posição nos eixos. E pode apontar erros ou favorecimentos a um lado.</p>
<p>A auditoria mais recente do método (uma revisão com os problemas conhecidos e as propostas de correção) também está publicada: <a href="${REPO}/blob/main/docs/AUDITORIA-METODOLOGIA.md" rel="noopener">auditoria da metodologia</a>.</p>
</section>
<section id="onde">
<h2>Onde fica cada parte</h2>
<h3>O que decide o resultado</h3>
<ul>
${ARQ("public/js/dados/frases.js", "todas as frases, a direção e o eixo de cada uma, os pares de coerência e os perfis das ideologias por subtema.")}
${ARQ("public/js/nucleo/motor.js", "como as respostas viram posição nos eixos, com a margem de erro.")}
${ARQ("public/js/nucleo/calculo.js", "a chance de cada ideologia, o filtro dos extremos, a confiança e a consistência.")}
${ARQ("public/js/dados/ideologias.js", "as 21 ideologias, a posição típica de cada uma e as descrições.")}
</ul>
<h3>O que aparece ao lado do resultado</h3>
<ul>
${ARQ("public/js/dados/candidatos.js", "a posição estimada de cada candidato e partido, e a conta da compatibilidade.")}
${ARQ("public/js/dados/pensadores.js", "pensadores e figuras históricas, com a justificativa de cada posição.")}
${ARQ("public/js/dados/leituras.js", "as leituras recomendadas pra cada ideologia, a favor e contra.")}
</ul>
<h3>O estudo</h3>
<ul>
${ARQ("servidor/rotas/coletar.mjs", "o que o servidor aceita de quem participa do estudo e o que recusa.")}
${ARQ("supabase/esquema.sql", "as tabelas do banco e as permissões.")}
${ARQ("docs/DADOS-E-PRIVACIDADE.md", "o que é coletado, o que nunca é e por quê.")}
</ul>
</section>
<section id="como">
<h2>Como o site é feito</h2>
<ul>
<li><b>Site:</b> feito em HTML, CSS e JavaScript puros, sem framework (pacote pronto de código) e sem etapa de montagem. O que está na pasta <code>public/</code> é exatamente o que vai pro ar.</li>
<li><b>Servidor:</b> funções do Vercel em São Paulo. Elas só recebem os envios do estudo e mostram o painel do responsável.</li>
<li><b>Banco de dados:</b> Postgres no Supabase, em São Paulo. Só o servidor tem acesso.</li>
<li><b>Publicação:</b> cada mudança aprovada no repositório é publicada automaticamente pelo Vercel.</li>
</ul>
<p>Os detalhes estão em <a href="${REPO}/blob/main/docs/ARQUITETURA.md" rel="noopener">docs/ARQUITETURA.md</a>.</p>
</section>
<section id="rodar">
<h2>Rodar no seu computador</h2>
<p>Precisa do Node.js 20 ou mais recente e do Git.</p>
<pre class="codigo" tabindex="0"><code>git clone ${REPO}.git
cd teste-politico
npm ci
npm run local</code></pre>
<p>O site abre em <code>http://127.0.0.1:8080</code>. Fora do endereço oficial, ele entra em modo de teste, e nada é enviado pro estudo.</p>
</section>
<section id="testes">
<h2>Testes automáticos</h2>
<p>A cada mudança, o GitHub roda os testes abaixo. O resultado de cada rodada fica público na aba <a href="${REPO}/actions" rel="noopener">Actions</a> do repositório.</p>
<ul>
<li><b>Lógica:</b> uma simulação fixa precisa dar exatamente os mesmos resultados de antes. Se o cálculo mudar sem querer, o teste falha.</li>
<li><b>Perfis simulados:</b> respostas criadas pelo computador (moderadas, extremas, contraditórias, incompletas) conferem se o cálculo segue as próprias regras. Os casos que hoje não funcionam como deveriam ficam marcados como pendentes.</li>
<li><b>Telas, páginas e cliques:</b> os três modos do começo ao fim e todos os botões e links. Tudo no celular e no computador, nos temas claro e escuro.</li>
<li><b>Acessibilidade:</b> a ferramenta axe-core confere se o site pode ser usado por pessoas com deficiência, pelas regras WCAG 2.1, níveis A e AA.</li>
<li><b>Servidor:</b> aceita envios válidos, recusa dados inválidos ou adulterados e confere o painel.</li>
</ul>
<p>Esses testes conferem se o código faz o que promete. Eles não mostram se o teste acerta a ideologia de pessoas reais. Isso depende de dados que ainda não existem.</p>
<pre class="codigo" tabindex="0"><code>npx playwright install chromium
BANCO=memoria npm test</code></pre>
</section>
<section id="licenca">
<h2>O que a licença permite</h2>
<p>O código usa a licença <a href="https://polyformproject.org/licenses/strict/1.0.0" rel="noopener">PolyForm Strict 1.0.0</a>. Ela permite ler, baixar e rodar o código sem fins comerciais: estudo, pesquisa, ensino ou uso pessoal. Isso vale também pra escolas, universidades, órgãos públicos e organizações sem fins lucrativos.</p>
<p>Ela não permite usar o código pra ganhar dinheiro, publicar cópias nem criar versões modificadas. Assim, não circulam testes parecidos, com o nome ou a aparência deste, mas com cálculos alterados.</p>
<p>Por isso, ele é um código-fonte público, e não "código aberto" no sentido estrito da definição da Open Source Initiative (a organização que define o termo).</p>
<p>Fotos e capas de livros pertencem aos seus autores e editoras. As licenças estão na página de <a href="/creditos/">créditos</a>.</p>
</section>
<section id="contribuir">
<h2>Como contribuir</h2>
<p>Achou uma frase enviesada, um erro no cálculo, uma posição de candidato mal justificada ou um problema no site? Abra um aviso (uma "issue") no repositório. Explique o problema e, se possível, mande a fonte. Há modelos prontos pra problemas no site e pra frases ou dados.</p>
<p>Falhas de segurança ou de privacidade não devem ser abertas em público: use o canal indicado no arquivo <a href="${REPO}/blob/main/SECURITY.md" rel="noopener">SECURITY.md</a>.</p>
<div class="acoes-pagina"><a class="ok" href="${REPO}/issues/new/choose" rel="noopener">Abrir um aviso</a></div>
</section>
</div>
</div>`,
}));
urls.push("/codigo-aberto/");

fs.writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync("public/robots.txt", `User-agent: *\nDisallow: /painel\nDisallow: /api/\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`${urls.length - 3} páginas geradas, sitemap.xml e robots.txt`);
