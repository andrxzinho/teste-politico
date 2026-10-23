// Eixos (AX), as 21 ideologias (IDEO) com posição típica e descrição, e parâmetros dos extremos.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
const AX = {
  E:{name:"Economia", left:"Esquerda", right:"Direita"},
  A:{name:"Liberdade × Ordem", left:"Mais liberdade", right:"Mais ordem"},
  C:{name:"Costumes", left:"Progressista", right:"Conservador"},
  N:{name:"Brasil × Mundo", left:"Global", right:"Nacionalista"},
  D:{name:"Democracia", left:"Mais compromisso democrático", right:"Menos compromisso democrático"},
  S:{name:"Instituições", left:"Confia no sistema", right:"Anti-sistema"}
};
const IDEO = [
 {n:"Comunista", g:"com", p:{E:-90,A:55,C:-20,N:10,D:70}, d:"Suas respostas batem com as ideias centrais do comunismo: fim da propriedade privada das empresas, economia planejada pelo Estado e o poder nas mãos de um partido dos trabalhadores. Exemplos históricos são a União Soviética, Cuba e a China de Mao."},
 {n:"Anarquista", g:"anq", p:{E:-80,A:-85,C:-60,N:-50,D:20}, d:"Suas respostas batem com as ideias centrais do anarquismo: uma sociedade sem Estado e sem patrões, organizada em comunidades, cooperativas e associações livres. Ele rejeita tanto o capitalismo quanto os governos fortes, inclusive os socialistas. Um exemplo histórico são as coletividades da Catalunha durante a Guerra Civil Espanhola."},
 {n:"Extrema esquerda", rup:"e", p:{E:-70,A:10,C:-55,N:-10,D:35}, d:"Você defende mudanças profundas na economia e nos costumes e concordou com frases que aceitam romper as regras democráticas pra chegar lá, como uma revolução ou um governo que passe por cima do Congresso."},
 {n:"Socialista democrático", p:{E:-65,A:-15,C:-45,N:-25,D:-65}, d:"Você quer reduzir bastante a desigualdade, com mais setores da economia nas mãos do público ou dos trabalhadores, mas pelo caminho das eleições e com respeito às regras democráticas."},
 {n:"Social-democrata", p:{E:-35,A:0,C:-25,N:-20,D:-65}, d:"Você aceita a economia de mercado, mas quer um Estado forte em saúde, educação e proteção social, pago com impostos maiores pra quem ganha mais, como nos países nórdicos."},
 {n:"Esquerda progressista", p:{E:-40,A:-50,C:-65,N:-40,D:-65}, d:"Você combina a preocupação com a desigualdade com muita liberdade individual e costumes abertos, com atenção especial aos direitos de mulheres, negros, pessoas LGBT e outras minorias."},
 {n:"Ecologista", g:"eco", p:{E:-30,A:-15,C:-40,N:-75,D:-65}, d:"Sua prioridade é o meio ambiente: proteger as florestas e enfrentar a crise do clima, com cooperação entre países, mesmo que isso limite o crescimento econômico."},
 {n:"Esquerda conservadora", p:{E:-50,A:35,C:50,N:30,D:-65}, d:"Você quer um Estado forte pra proteger os trabalhadores e reduzir a desigualdade, mas valoriza a família, a religião e a tradição nos costumes, e a ordem na segurança."},
 {n:"Nacional-desenvolvimentista", p:{E:-45,A:30,C:5,N:50,D:-65}, d:"Você apoia um Estado que conduz a economia, investe em setores estratégicos e protege a indústria nacional, com os interesses do país em primeiro lugar no comércio com o mundo. Nos costumes, não tem uma posição forte."},
 {n:"Centrista", p:{E:0,A:0,C:0,N:0,D:-65}, d:"Você fica perto do meio na economia e nos costumes: aceita o mercado junto com algumas políticas sociais, prefere mudanças graduais e negociadas e avalia cada tema separadamente, sem seguir um lado fixo. O teste também chega aqui quando quase todas as respostas ficam no meio-termo, por moderação ou por falta de opinião formada."},
 {n:"Social-liberal", p:{E:15,A:-20,C:-30,N:-30,D:-65}, d:"Você aceita o mercado e quer as contas públicas em ordem, mas apoia políticas sociais pra quem mais precisa, direitos individuais e costumes abertos."},
 {n:"Democracia cristã", p:{E:5,A:25,C:55,N:10,D:-65}, d:"Você parte de valores cristãos, com a família e a solidariedade no centro, e combina preocupação social com moderação na economia. É a tradição de partidos inspirados na doutrina social da Igreja, como a democracia cristã alemã e a italiana."},
 {n:"Liberal progressista", p:{E:50,A:-40,C:-50,N:-30,D:-65}, d:"Você defende mercado livre e menos impostos, junto com costumes abertos e muita liberdade individual, e apoia mudanças nos costumes, como direitos iguais pra casais do mesmo sexo."},
 {n:"Liberal clássico", p:{E:35,A:-20,C:-5,N:-10,D:-65}, d:"Você defende mercado livre, liberdades individuais e um Estado limitado, que garante a lei e os contratos, sem tomar partido forte nos costumes."},
 {n:"Libertário", p:{E:70,A:-60,C:-20,N:-10,D:-65}, d:"Você quer o mínimo de governo possível, na economia e na vida pessoal. O Estado cuidaria só do básico, como segurança, justiça e defesa."},
 {n:"Anarcocapitalista", g:"anc", p:{E:95,A:-85,C:0,N:-20,D:10}, d:"Suas respostas batem com as ideias centrais do anarcocapitalismo: o fim do Estado, com todos os serviços, inclusive polícia e justiça, oferecidos por empresas que concorrem entre si. Ele combina o mercado sem limites com liberdade total na vida pessoal. Nenhum país se organizou assim; as referências são autores como Murray Rothbard e David Friedman."},
 {n:"Liberal-conservador", p:{E:45,A:15,C:40,N:10,D:-65}, d:"Você defende mercado livre e pouco governo na economia, mas valoriza as tradições, a família e a ordem nos costumes."},
 {n:"Conservador", p:{E:20,A:35,C:60,N:30,D:-65}, d:"Você valoriza tradição, família, religião e ordem, prefere que as mudanças aconteçam devagar e aceita o mercado com algum papel do Estado."},
 {n:"Direita nacional-conservadora", p:{E:30,A:50,C:65,N:60,D:-65}, d:"Você combina valores tradicionais, ordem e segurança com os interesses do país em primeiro lugar, no comércio, nas fronteiras e na política externa, dentro das regras democráticas."},
 {n:"Extrema direita", rup:"d", p:{E:35,A:70,C:80,N:75,D:45}, d:"Você combina nacionalismo forte, costumes muito conservadores e governo duro, e concordou com frases que aceitam romper as regras democráticas pra chegar lá, como uma intervenção militar ou calar a oposição."},
 {n:"Fascista", g:"fas", p:{E:0,A:90,C:60,N:95,D:85}, d:"Suas respostas batem com as ideias centrais do fascismo: a nação acima de tudo, um líder forte sem limites e o fim da oposição e da democracia. O exemplo histórico principal é a Itália de Mussolini."}
];
const EXT = {
 com:{n:"Comunismo", d:"Fim da propriedade privada das empresas, economia planejada e partido único dos trabalhadores."},
 anq:{n:"Anarquismo", d:"Fim do Estado e do capitalismo, com a sociedade organizada em comunidades."},
 fas:{n:"Fascismo", d:"Nação acima do indivíduo, líder sem limites, fim da oposição e da democracia."},
 anc:{n:"Anarcocapitalismo", d:"Fim do Estado, com tudo, inclusive polícia e justiça, feito por empresas privadas."}
};
// eixos que definem cada perfil com frases-chave (o ecologismo não é extremo, mas também precisa delas)
const EXTP={com:{E:-90,D:70},anq:{E:-80,A:-85},fas:{A:90,N:95,D:85},anc:{E:95,A:-85},eco:{N:-75}};
const GATE = 50;
// O eixo Democracia só separa as tradições democráticas (todas em -65) das que aceitam ruptura.
// Ele não decide entre, por exemplo, Conservador e Liberal-conservador: isso ficava a cargo de posições típicas
// diferentes no eixo D, que embutiam a ideia de que algumas tradições de direita seriam menos democráticas.
const IW=[1.1,1,.8,.6,1];
const AXTXT={
 E:{l:"Você tende a achar que o governo deve agir pra reduzir desigualdade, com mais serviços públicos e mais imposto pra quem tem mais.",c:"Você mistura ideias: aceita o mercado, mas também quer o governo atuando em algumas áreas.",r:"Você tende a confiar mais no mercado e na iniciativa privada, com menos impostos e menos governo na economia."},
 A:{l:"Você valoriza bastante a liberdade individual e desconfia de dar muito poder ao governo e à polícia.",c:"Você busca equilíbrio entre a liberdade das pessoas e a ordem pública.",r:"Você dá bastante peso a ordem, segurança e autoridade, mesmo que isso limite algumas liberdades."},
 C:{l:"Você tende a apoiar mudanças nos costumes e mais espaço pra grupos e estilos de vida diferentes.",c:"Você é moderado nos costumes: aceita algumas mudanças, mas valoriza certas tradições.",r:"Você tende a valorizar tradições, família e religião como base da sociedade."},
 N:{l:"Você é mais aberto a cooperação internacional, imigração e acordos globais.",c:"Você equilibra os interesses do país com abertura ao mundo.",r:"Você prioriza a soberania e os interesses do Brasil acima de acordos e organizações de fora."},
 D:{l:"Você tem um compromisso forte com eleições, oposição livre e limites ao poder, mesmo quando isso não favorece o seu lado.",c:"Você apoia a democracia, mas aceitaria exceções em algumas situações.",r:"Você aceita, em algumas situações, romper com regras democráticas, como eleições e oposição livre, pra alcançar um objetivo político."},
 S:{l:"Você confia, em geral, nas instituições do país, como Justiça, eleições e partidos, mesmo vendo problemas nelas.",c:"Você confia em algumas instituições e desconfia de outras.",r:"Você desconfia das instituições e acha que o sistema serve mais a quem está no poder do que ao povo."}
};

// Posições (E, A, C, N) de -100 a 100, pelo que cada um fez (governo, mandatos, votações, alianças) e pela
// classificação ideológica dos partidos feita por cientistas políticos em 2022 (Bolognesi, Ribeiro, Codato e Silva, 2025).
// s = nota do partido nessa escala (0 = esquerda, 10 = direita). pe = posição estimada só pelo partido.
// Grupos de ideologias (usados na janela de ideologias e nas páginas públicas)
const IDEO_GRUPOS=[["Esquerda",["Extrema esquerda","Socialista democrático","Social-democrata","Esquerda progressista","Ecologista","Esquerda conservadora","Nacional-desenvolvimentista"]],
  ["Centro",["Centrista","Social-liberal","Democracia cristã"]],
  ["Direita",["Liberal progressista","Liberal clássico","Libertário","Liberal-conservador","Conservador","Direita nacional-conservadora","Extrema direita"]],
  ["Extremos",["Comunista","Anarquista","Anarcocapitalista","Fascista"]]];
// Resumo neutro de cada ideologia, em terceira pessoa (páginas públicas). O campo d de IDEO fala com quem fez o teste.
const IDEO_RESUMO={"Extrema esquerda": "Defende mudanças profundas na economia e na sociedade e aceita romper com as regras democráticas atuais pra alcançá-las.", "Socialista democrático": "Defende mudanças econômicas profundas, com mais setores sob controle público, pelo caminho das eleições e da democracia.", "Social-democrata": "Defende a economia de mercado com um Estado forte em saúde, educação e proteção social, pago com impostos maiores pra quem ganha mais.", "Esquerda progressista": "Une a defesa da igualdade à liberdade individual e a costumes abertos, com atenção aos direitos de minorias.", "Ecologista": "Coloca o meio ambiente e o clima como prioridade, mesmo quando isso limita o crescimento econômico.", "Esquerda conservadora": "Defende um Estado forte na economia e na proteção dos trabalhadores, junto com valores tradicionais nos costumes.", "Nacional-desenvolvimentista": "Defende que o Estado conduza a economia, invista em setores estratégicos e proteja a indústria nacional.", "Centrista": "Fica perto do meio na economia e nos costumes, prefere mudanças graduais e negociadas e avalia cada tema separadamente, sem um lado fixo.", "Social-liberal": "Combina mercado e contas públicas em ordem com políticas sociais e costumes abertos.", "Democracia cristã": "Parte de valores cristãos, com a família e a preocupação social no centro, sem posições extremas na economia.", "Liberal progressista": "Defende o mercado livre e a liberdade nos costumes, com pouca interferência do Estado na vida pessoal.", "Liberal clássico": "Defende o mercado livre, o Estado limitado e as liberdades individuais.", "Libertário": "Quer o mínimo de governo possível, tanto na economia quanto na vida pessoal.", "Liberal-conservador": "Combina o mercado livre com valores tradicionais nos costumes.", "Conservador": "Valoriza a tradição, a família, a religião e a ordem, e prefere mudanças lentas.", "Direita nacional-conservadora": "Une valores tradicionais e ordem à defesa do país em primeiro lugar, inclusive no comércio e na imigração.", "Extrema direita": "Defende nacionalismo forte e governo duro contra o crime e a oposição, aceitando rupturas com as regras democráticas.", "Comunista": "Defende o fim da propriedade privada das empresas, a economia planejada pelo Estado e o governo de um partido único dos trabalhadores.", "Anarquista": "Defende o fim do Estado e do capitalismo, com a sociedade organizada em comunidades livres e autogeridas.", "Anarcocapitalista": "Defende o fim do Estado, com todos os serviços, inclusive polícia e justiça, oferecidos pelo mercado.", "Fascista": "Coloca a nação acima do indivíduo e defende um líder sem limites, sem oposição e sem democracia."};
