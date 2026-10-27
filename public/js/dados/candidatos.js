// Presidentes desde 1985 (CAND.pres) e partidos (CAND.part), com posição estimada em Economia, Liberdade × Ordem, Costumes
// e Brasil × Mundo (p, de -100 a 100). Presidentes: estimada pelo que cada um fez no governo, com o mesmo critério pra todos
// (st = anos de mandato). Partidos: s é a nota na escala ideológica de cientistas políticos (0 = esquerda, 10 = direita).
// Os candidatos da eleição de 2026 saíram depois do 2º turno; estão no histórico do repositório.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
const CAND = {
 pres:{label:"Presidentes",quem:"Presidente",list:[
  {n:"José Sarney",st:"1985–1990",p:[-15,10,25,35],b:"Primeiro presidente civil depois do regime militar, pelo PMDB, eleito como vice de Tancredo Neves. Lançou o Plano Cruzado, que congelou preços, declarou moratória da dívida externa em 1987 e governou durante a Assembleia Constituinte, que aprovou a Constituição de 1988."},
  {n:"Fernando Collor",st:"1990–1992",p:[35,20,20,-30],b:"Eleito pelo PRN na primeira eleição direta depois do regime militar. Abriu a economia às importações, começou o programa de privatizações e bloqueou o dinheiro das cadernetas de poupança no Plano Collor. Renunciou durante o processo de impeachment, em 1992."},
  {n:"Itamar Franco",st:"1992–1994",p:[0,5,10,30],b:"Vice de Collor, assumiu depois da renúncia. Lançou o Plano Real, que acabou com a hiperinflação. Continuou parte das privatizações, como a da CSN e a da Embraer, mas com discurso nacionalista e de defesa das estatais estratégicas."},
  {n:"Fernando Henrique Cardoso",st:"1995–2002",p:[35,0,-10,-35],b:"Dois mandatos pelo PSDB. Consolidou o Plano Real, privatizou estatais como a Vale e o sistema Telebras, criou a Lei de Responsabilidade Fiscal e programas de transferência de renda como o Bolsa Escola."},
  {n:"Lula",st:"2003–2010 e desde 2023",p:[-45,5,-25,10],b:"Pelo PT, reeleito em 2026. Criou o Bolsa Família e ampliou os gastos sociais e o crédito de bancos públicos. No governo atual, criou o arcabouço fiscal, regra que limita o aumento dos gastos, e a isenção do Imposto de Renda até R$ 5 mil, com imposto mínimo pra rendas altas."},
  {n:"Dilma Rousseff",st:"2011–2016",p:[-50,10,-15,25],b:"Pelo PT. Ampliou a presença do Estado na economia, com controle dos preços de energia e combustíveis, desoneração de impostos de setores escolhidos e crédito de bancos públicos, além de regras de conteúdo nacional na indústria. Sofreu impeachment em 2016."},
  {n:"Michel Temer",st:"2016–2018",p:[50,35,20,-10],b:"Pelo MDB, vice de Dilma, assumiu depois do impeachment. Aprovou o teto de gastos, a reforma trabalhista e a reforma do ensino médio, e decretou a intervenção federal na segurança do Rio de Janeiro."},
  {n:"Jair Bolsonaro",st:"2019–2022",p:[45,75,85,40],b:"Eleito pelo PSL e depois filiado ao PL. Aprovou a reforma da Previdência e a autonomia do Banco Central, privatizou a Eletrobras, facilitou o acesso a armas e defendeu pautas conservadoras nos costumes e o discurso de soberania sobre a Amazônia."}
 ], extra:"Todos os presidentes desde a volta da democracia, em 1985. Tancredo Neves foi eleito, mas morreu antes de tomar posse e está em Pensadores e figuras históricas."},
 part:{label:"Partidos", list:[
  {n:"PSTU",p:[-92,-10,-65,-15],s:0.51},{n:"PCO",p:[-90,-40,-15,40],s:0.55},{n:"PCB",p:[-90,30,-45,40],s:0.69},{n:"PSOL",p:[-70,-35,-80,-30],s:1.41},
  {n:"UP",p:[-85,20,-65,35],s:1.63},{n:"PCdoB",p:[-60,15,-45,30],s:1.78},{n:"PT",p:[-45,5,-30,10],s:2.68},{n:"PSB",p:[-25,5,-25,0],s:3.59},
  {n:"Rede",p:[-25,-15,-30,-50],s:3.69},{n:"PDT",p:[-30,10,-15,35],s:3.86},{n:"PV",p:[-15,-15,-30,-45],s:4.12},{n:"Solidariedade",p:[10,20,15,10],s:6.01},
  {n:"Cidadania",p:[10,-10,-15,-10],s:6.17},{n:"Avante",p:[25,25,30,10],s:6.47},{n:"MDB",p:[30,25,25,5],s:6.50},{n:"PSDB",p:[40,20,10,-15],s:6.76},
  {n:"PSD",p:[40,30,30,10],s:6.94},{n:"Democrata",p:[35,40,25,20],s:7.29},{n:"Podemos",p:[45,40,40,15],s:7.44},{n:"PRTB",p:[45,65,70,45],s:7.49},
  {n:"Agir",p:[45,55,55,30],s:7.55},{n:"PP",p:[55,55,55,20],s:8.15},{n:"DC",p:[35,50,70,35],s:8.21},{n:"Republicanos",p:[50,60,75,25],s:8.33},
  {n:"União Brasil",p:[60,55,55,20],s:8.49},{n:"Novo",p:[85,25,35,-20],s:8.67},{n:"PL",p:[55,75,85,40],s:8.80},{n:"Missão",p:[65,75,30,15],s:null}
 ], extra:"Na eleição pra deputado federal e estadual, as vagas são divididas primeiro entre os partidos e federações, de acordo com os votos de cada um."}
};
// compatibilidade: concordância eixo a eixo (Economia, Liberdade × Ordem, Costumes, Brasil × Mundo), com curva que separa bem quem está longe
const CAXK=["E","A","C","N"], CW={E:2,A:.9,C:1.2,N:.5};
function candMatch(s,p,imp){let a=0,t=0;CAXK.forEach((k,i)=>{const w=CW[k]*((imp&&imp[k])||1);a+=w*Math.max(0,1-Math.abs(s[k]-p[i])/100);t+=w});
  let m=100*Math.pow(a/t,1.6);
  // lados opostos na economia: a compatibilidade cai aos poucos, sem corte brusco
  if(Math.sign(s.E)!==Math.sign(p[0])){const mn=Math.min(Math.abs(s.E),Math.abs(p[0]));m*=1-.4*Math.max(0,Math.min(1,(mn-15)/20))}
  return Math.round(m)}
const AXK=["E","A","C","N","D"];
function agree(u,p,w){let s=0,t=0;AXK.forEach((k,i)=>{s+=w[i]*Math.max(0,1-Math.abs(u[k]-p[i])/100);t+=w[i]});return Math.round(100*Math.pow(s/t,1.6))}

