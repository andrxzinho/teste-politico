// Candidatos e partidos de 2026 (CAND) com posição estimada e situação depois do 2º turno (t2: disputou o 2º turno).
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
const CAND = {
 pres:{label:"Presidente", list:[
  {n:"Lula (PT)",st:"Eleito",t2:1,p:[-45,5,-25,10],s:2.68,b:"Reeleito presidente no 2º turno de 2026, com 51,79% dos votos válidos. Presidente desde 2023 e de 2003 a 2010. No governo atual, criou o arcabouço fiscal, regra que limita o aumento dos gastos. Também sancionou a isenção do Imposto de Renda até R$ 5 mil, com imposto mínimo pra rendas altas, ampliou o Bolsa Família e aumentou o IOF (imposto sobre operações financeiras)."},
  {n:"Flávio Bolsonaro (PL)",st:"2º turno",t2:1,p:[50,75,85,40],s:8.80,b:"Senador pelo Rio de Janeiro desde 2019 e filho de Jair Bolsonaro. Apoia as pautas do governo do pai, como facilitar o acesso a armas, penas mais duras e valores conservadores, e propõe cortar impostos e reduzir a estrutura do governo."},
  {n:"Romeu Zema (Novo)",st:"Fora do 2º turno",p:[80,30,40,-10],s:8.67,b:"Governou Minas Gerais de 2019 a 2026. Propôs privatizar estatais como Cemig e Copasa e fez do corte de gastos sua principal bandeira."},
  {n:"Ronaldo Caiado (PSD)",st:"Fora do 2º turno",p:[45,80,60,25],s:6.94,b:"Governou Goiás de 2019 a 2026, com a segurança pública como principal bandeira. Antes, foi deputado e senador ligado ao setor rural, passando por DEM e União Brasil."},
  {n:"Renan Santos (Missão)",st:"Fora do 2º turno",p:[65,75,30,15],s:null,b:"Fundador do MBL, movimento que organizou protestos pelo impeachment de Dilma. Nunca teve mandato. Propõe um ajuste rígido nas contas do governo e penas mais duras contra facções."},
  {n:"Augusto Cury (Avante)",st:"Fora do 2º turno",p:[30,20,35,5],s:6.47,b:"Psiquiatra e escritor, disputa sua primeira eleição. Lançou a candidatura em evento com Tarcísio, Ricardo Nunes e André do Prado, e se define como “mente capitalista e coração social”."},
  {n:"Wilson Grassi (Democrata)",st:"Fora do 2º turno",p:[35,40,25,20],s:7.29,b:"Veterinário e empresário. Propõe um imposto único sobre movimentações bancárias e políticas pra causa animal. O Democrata é o antigo PMB."},
  {n:"Clariana Barão (DC)",st:"Fora do 2º turno",p:[35,50,70,35],s:8.21,pe:1,b:"Disputa uma eleição pela primeira vez. Assumiu a candidatura depois que a Democracia Cristã não conseguiu lançar Aldo Rebelo nem Joaquim Barbosa."},
  {n:"Samara Martins (UP)",st:"Fora do 2º turno",p:[-85,20,-65,35],s:1.63,b:"Dentista e vice-presidente nacional da UP, partido que se define como marxista-leninista e defende devolver ao governo o controle de empresas estratégicas."},
  {n:"Edmilson Costa (PCB)",st:"Fora do 2º turno",p:[-90,30,-45,40],s:0.69,b:"Economista e secretário-geral do PCB. O programa registrado no TSE é revolucionário e anticapitalista. Propõe jornada de 30 horas e a volta de empresas privatizadas pro controle do governo."},
  {n:"Hertz Dias (PSTU)",st:"Fora do 2º turno",p:[-92,-10,-65,-15],s:0.51,b:"Professor e militante do PSTU, partido trotskista que defende uma revolução socialista."},
  {n:"Rui Costa Pimenta (PCO)",st:"Fora do 2º turno",p:[-90,-40,-15,40],s:0.55,b:"Presidente do PCO, partido trotskista que defende uma revolução operária e costuma criticar a censura e as pautas identitárias."}
 ], extra:"Eleição encerrada: Lula (PT) foi reeleito no 2º turno, em 25 de outubro, com 51,79% dos votos válidos, contra 48,21% de Flávio Bolsonaro (PL). No 1º turno, Flávio teve 47,03% e Lula, 45,16%. Os outros 10 candidatos continuam aqui pra comparação."},
 gov:{label:"Governador", list:[
  {n:"Tarcísio de Freitas (Republicanos)",st:"Eleito",p:[60,75,55,15],s:8.33,b:"Governador de SP desde 2023 e ministro da Infraestrutura de 2019 a 2022. Privatizou a Sabesp, criou o programa de escolas cívico-militares e priorizou operações policiais contra o crime organizado."},
  {n:"Fernando Haddad (PT)",st:"Não eleito",p:[-35,-5,-35,0],s:2.68,b:"Ministro da Fazenda de 2023 a 2026 e prefeito de SP de 2013 a 2016. Na Fazenda, criou o arcabouço fiscal (regra que limita o aumento dos gastos) e conduziu a reforma tributária. Na prefeitura, ampliou ciclovias e corredores de ônibus."},
  {n:"Vera Lúcia (PSTU)",st:"Não eleito",p:[-92,-10,-65,-15],s:0.51,pe:1,b:"Socióloga e dirigente do PSTU."},
  {n:"Carlos Machado (PCB)",st:"Não eleito",p:[-90,30,-45,40],s:0.69,pe:1,b:"Historiador e professor."},
  {n:"Izadora Dias (PCO)",st:"Não eleito",p:[-90,-40,-15,40],s:0.55,pe:1,b:"Estudante de letras."},
  {n:"Vivian Mendes (UP)",st:"Não eleito",p:[-85,20,-65,35],s:1.63,pe:1,b:"Comunicadora."}
 ], extra:"Eleição encerrada: Tarcísio de Freitas (Republicanos) foi reeleito no 1º turno, com 62,65% dos votos válidos. Os demais candidatos continuam aqui pra comparação."},
 sen:{label:"Senado", list:[
  {n:"Guilherme Derrite (PP)",st:"Eleito",p:[50,90,70,35],s:8.15,b:"Deputado federal e ex-secretário da Segurança Pública de SP no governo Tarcísio. Ex-policial da Rota, atua principalmente na área de segurança e defende penas mais duras."},
  {n:"André do Prado (PL)",st:"Eleito",p:[50,70,75,35],s:8.80,b:"Presidente da Assembleia Legislativa de SP, onde coordenou a base de apoio do governo Tarcísio. É aliado da família Bolsonaro."},
  {n:"Simone Tebet (PSB)",st:"Não eleito",p:[10,15,5,-10],s:3.59,b:"Senadora pelo MDB de 2015 a 2023, votou a favor do teto de gastos e da reforma trabalhista. Depois foi ministra do Planejamento no governo Lula."},
  {n:"Marina Silva (Rede)",st:"Não eleito",p:[-25,-10,-10,-55],s:3.69,b:"Ministra do Meio Ambiente nos governos Lula, com atuação em clima e desmatamento. Evangélica, já defendeu que temas como aborto fossem decididos em plebiscito."},
  {n:"Soninha Francine (Cidadania)",st:"Não eleito",p:[5,-25,-35,-15],s:6.17,b:"Jornalista e ex-vereadora de SP. Foi do PT e depois secretária na gestão Doria. Defende posições liberais em costumes, como sobre drogas."},
  {n:"Geraldo Rufino (Podemos)",st:"Não eleito",p:[45,40,40,15],s:7.44,pe:1,b:"Empresário, escritor e palestrante."},
  {n:"Guto Schiavetto (Missão)",st:"Não eleito",p:[65,75,30,15],s:null,pe:1,b:"Integrante do MBL em Limeira."},
  {n:"William Teixeira (Agir)",st:"Não eleito",p:[45,55,55,30],s:7.55,pe:1,b:"Profissional de relações públicas."},
  {n:"Dra. Eliana Ferreira (PSTU)",st:"Não eleito",p:[-92,-10,-65,-15],s:0.51,pe:1,b:"Advogada."},
  {n:"Weller Gonçalves (PSTU)",st:"Não eleito",p:[-92,-10,-65,-15],s:0.51,pe:1,b:"Presidente do Sindicato dos Metalúrgicos de São José dos Campos."},
  {n:"Ednelson Cesaretti (PCO)",st:"Não eleito",p:[-90,-40,-15,40],s:0.55,pe:1,b:"Professor da rede municipal de São Paulo."},
  {n:"Maíra de Souza (UP)",st:"Não eleito",p:[-85,20,-65,35],s:1.63,pe:1,b:"Professora da rede pública."},
  {n:"Marcio Alves (UP)",st:"Não eleito",p:[-85,20,-65,35],s:1.63,pe:1,b:"Integrante de movimentos sociais."},
  {n:"Petter Maahs (PCB)",st:"Não eleito",p:[-90,30,-45,40],s:0.69,pe:1,b:"Professor e diretor de escola em Cubatão."}
 ], extra:"Eleição encerrada: Guilherme Derrite (PP) e André do Prado (PL) foram eleitos pras duas vagas de São Paulo. Os demais candidatos continuam aqui pra comparação."},
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

