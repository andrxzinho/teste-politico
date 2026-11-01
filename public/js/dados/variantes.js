// Correntes (variantes) dentro de cada uma das 21 ideologias: nome, descrição curta e posição típica nos eixos
// (E, A, C, N, D, na mesma escala de IDEO). Não entram no cálculo da ideologia: o resultado mostra as correntes mais
// parecidas com a pessoa, por distância nos eixos, e cada página de ideologia lista as suas. Movimentos com nome de
// político vivo ficam de fora, dos dois lados.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
const VARIANTES={
"Comunista":[
 {n:"Marxismo-leninismo",d:"Partido de vanguarda, Estado socialista e economia planificada, na linha de Lênin.",p:{E:-95,A:65,C:-15,N:10,D:75}},
 {n:"Trotskismo",d:"Revolução permanente e internacional, com crítica à burocracia do regime soviético.",p:{E:-95,A:40,C:-35,N:-40,D:60}},
 {n:"Maoísmo",d:"Revolução a partir do campo e luta de classes contínua, inspirada em Mao Tsé-tung.",p:{E:-90,A:70,C:-10,N:35,D:80}},
 {n:"Comunismo de conselhos",d:"Poder direto dos trabalhadores em conselhos, contra o partido único e o Estado centralizado.",p:{E:-90,A:-30,C:-40,N:-30,D:40}}],
"Anarquista":[
 {n:"Anarcocomunismo",d:"Fim do Estado e da propriedade privada, com os bens distribuídos conforme a necessidade (Kropotkin).",p:{E:-90,A:-85,C:-55,N:-50,D:25}},
 {n:"Anarcossindicalismo",d:"Sindicatos como base da luta e da organização da sociedade sem Estado.",p:{E:-85,A:-75,C:-45,N:-45,D:25}},
 {n:"Anarquismo individualista",d:"Autonomia de cada pessoa acima de qualquer autoridade, inclusive a do Estado.",p:{E:-40,A:-95,C:-60,N:-50,D:15}},
 {n:"Ecoanarquismo",d:"Comunidades pequenas e autônomas, em harmonia com a natureza, sem Estado.",p:{E:-75,A:-80,C:-60,N:-65,D:20}}],
"Extrema esquerda":[
 {n:"Esquerda revolucionária",d:"Revolução para substituir o capitalismo, com as eleições vistas só como tática.",p:{E:-80,A:20,C:-50,N:-10,D:50}},
 {n:"Guevarismo",d:"Luta armada e guerrilha como caminho para a revolução, inspirado em Che Guevara.",p:{E:-85,A:35,C:-30,N:20,D:60}},
 {n:"Esquerda anti-imperialista",d:"Prioridade à luta contra os Estados Unidos e as potências ocidentais, apoiando governos que as enfrentam.",p:{E:-70,A:30,C:-30,N:40,D:30}},
 {n:"Populismo de esquerda radical",d:"O povo contra as elites, aceitando passar por cima de instituições para fazer reformas rápidas.",p:{E:-60,A:10,C:-45,N:10,D:25}}],
"Socialista democrático":[
 {n:"Ecossocialismo",d:"Socialismo com prioridade à crise climática e à proteção da natureza.",p:{E:-70,A:-20,C:-55,N:-45,D:-65}},
 {n:"Socialismo de mercado",d:"Empresas públicas ou dos próprios trabalhadores competindo num mercado.",p:{E:-50,A:-10,C:-35,N:-20,D:-65}},
 {n:"Socialismo cristão",d:"Socialismo inspirado no cristianismo e na opção pelos pobres, como na Teologia da Libertação.",p:{E:-65,A:0,C:-5,N:-15,D:-65}},
 {n:"Socialismo sindical",d:"Sindicatos fortes e trabalhadores participando das decisões das empresas.",p:{E:-70,A:0,C:-30,N:0,D:-65}}],
"Social-democrata":[
 {n:"Social-democracia nórdica",d:"Bem-estar social amplo, impostos altos e acordos entre sindicatos e empresas.",p:{E:-40,A:-5,C:-35,N:-25,D:-65}},
 {n:"Terceira Via",d:"Mercado e responsabilidade fiscal combinados com políticas sociais (Blair, Giddens).",p:{E:-10,A:5,C:-25,N:-25,D:-65}},
 {n:"Trabalhismo",d:"Direitos trabalhistas e proteção social, na tradição de Vargas e do antigo PTB.",p:{E:-45,A:10,C:-5,N:20,D:-65}},
 {n:"Social-democracia keynesiana",d:"Gasto público pra manter o emprego e o crescimento nos momentos de crise.",p:{E:-40,A:0,C:-20,N:-5,D:-65}}],
"Esquerda progressista":[
 {n:"Progressismo de direitos civis",d:"Igualdade de raça, gênero e orientação sexual no centro da política, com ações afirmativas.",p:{E:-35,A:-45,C:-75,N:-40,D:-65}},
 {n:"Feminismo socialista",d:"Une a luta contra a desigualdade entre homens e mulheres à crítica ao capitalismo.",p:{E:-55,A:-40,C:-75,N:-35,D:-65}},
 {n:"Antiproibicionismo",d:"Fim da guerra às drogas e menos prisão, com foco em saúde e redução de danos.",p:{E:-30,A:-75,C:-60,N:-30,D:-65}},
 {n:"Esquerda decolonial",d:"Crítica à herança colonial e defesa de povos indígenas, quilombolas e do Sul global.",p:{E:-50,A:-40,C:-70,N:-55,D:-65}}],
"Ecologista":[
 {n:"Ambientalismo de mercado",d:"Proteção ambiental com regras, incentivos e tecnologia limpa, sem romper com o mercado.",p:{E:-10,A:0,C:-25,N:-50,D:-65}},
 {n:"Decrescimento",d:"Reduzir a produção e o consumo nos países ricos pra caber nos limites do planeta.",p:{E:-55,A:-20,C:-50,N:-80,D:-65}},
 {n:"Socioambientalismo",d:"Defesa da floresta junto com os direitos de indígenas e comunidades tradicionais (Chico Mendes).",p:{E:-45,A:-20,C:-50,N:-70,D:-65}},
 {n:"Ecologia profunda",d:"A natureza tem valor em si mesma, além do uso que os humanos fazem dela.",p:{E:-35,A:-10,C:-35,N:-90,D:-65}}],
"Esquerda conservadora":[
 {n:"Socialismo cristão conservador",d:"Economia de esquerda com moral religiosa tradicional.",p:{E:-45,A:30,C:65,N:20,D:-65}},
 {n:"Comunitarismo trabalhista",d:"Família, comunidade e trabalho, com crítica ao mercado sem limites e à globalização.",p:{E:-40,A:30,C:45,N:35,D:-65}},
 {n:"Esquerda nacional-popular",d:"Defesa dos trabalhadores e da soberania nacional, com valores tradicionais.",p:{E:-55,A:40,C:35,N:50,D:-65}},
 {n:"Esquerda evangélica",d:"Defesa dos mais pobres com os valores das igrejas evangélicas sobre família e costumes.",p:{E:-45,A:35,C:60,N:25,D:-65}}],
"Nacional-desenvolvimentista":[
 {n:"Desenvolvimentismo cepalino",d:"Industrializar com apoio do Estado pra deixar de depender da exportação de matérias-primas (Prebisch, Furtado).",p:{E:-50,A:20,C:0,N:45,D:-65}},
 {n:"Varguismo",d:"Estado forte conduzindo a industrialização e os direitos trabalhistas, como na era Vargas.",p:{E:-45,A:45,C:15,N:55,D:-60}},
 {n:"Novo desenvolvimentismo",d:"Câmbio competitivo, juros baixos e política industrial pra crescer (Bresser-Pereira).",p:{E:-30,A:15,C:-5,N:40,D:-65}},
 {n:"Nacionalismo econômico estratégico",d:"Estatais em setores estratégicos e grandes obras com foco em segurança nacional.",p:{E:-35,A:55,C:25,N:65,D:-45}}],
"Centrista":[
 {n:"Centro pragmático",d:"Escolhe caso a caso o que funciona, sem seguir uma doutrina.",p:{E:0,A:0,C:0,N:0,D:-65}},
 {n:"Centro-esquerda moderado",d:"Reformas sociais graduais com cuidado com as contas públicas.",p:{E:-15,A:-5,C:-15,N:-10,D:-65}},
 {n:"Centro-direita moderado",d:"Mercado e responsabilidade fiscal, com mudanças lentas nos costumes.",p:{E:15,A:10,C:15,N:5,D:-65}},
 {n:"Centro tecnocrático",d:"Decisões baseadas em dados e em técnicos, com instituições fortes.",p:{E:10,A:10,C:-5,N:-15,D:-65}}],
"Social-liberal":[
 {n:"Liberalismo igualitário",d:"Liberdade individual com redistribuição pra garantir oportunidades iguais (Rawls).",p:{E:0,A:-20,C:-35,N:-30,D:-65}},
 {n:"Ordoliberalismo",d:"Mercado com regras firmes e um Estado que impede monopólios, como na Alemanha do pós-guerra.",p:{E:25,A:5,C:-10,N:-20,D:-65}},
 {n:"Liberalismo cosmopolita",d:"Liberdades civis amplas, cooperação internacional e Estado social moderado.",p:{E:15,A:-30,C:-40,N:-45,D:-65}},
 {n:"Novo liberalismo",d:"O Estado garante saúde, educação e renda mínima pra que todos sejam livres de fato (Hobhouse).",p:{E:5,A:-15,C:-25,N:-25,D:-65}}],
"Democracia cristã":[
 {n:"Economia social de mercado",d:"Mercado com rede de proteção social, inspirada na Alemanha do pós-guerra.",p:{E:15,A:20,C:40,N:5,D:-65}},
 {n:"Doutrina social da Igreja",d:"Dignidade humana, bem comum e justiça social a partir do ensino católico.",p:{E:-15,A:25,C:60,N:5,D:-65}},
 {n:"Personalismo",d:"A pessoa e as suas comunidades (família, trabalho) no centro da política (Mounier, Maritain).",p:{E:-5,A:15,C:50,N:0,D:-65}},
 {n:"Democracia cristã conservadora",d:"Valores cristãos tradicionais e ordem, com economia mais aberta.",p:{E:20,A:35,C:70,N:20,D:-65}}],
"Liberal progressista":[
 {n:"Liberalismo globalista",d:"Mercado aberto e integrado ao mundo, com pautas de diversidade.",p:{E:55,A:-30,C:-45,N:-40,D:-65}},
 {n:"Libertarianismo de coração aberto",d:"Ampla liberdade econômica e pessoal, com atenção aos mais pobres.",p:{E:60,A:-55,C:-45,N:-30,D:-65}},
 {n:"Liberalismo da abundância",d:"Menos burocracia pra construir moradia, energia e tecnologia, com abertura nos costumes.",p:{E:40,A:-25,C:-40,N:-35,D:-65}},
 {n:"Liberalismo de fronteiras abertas",d:"Livre comércio, imigração aberta e direitos individuais em escala global.",p:{E:45,A:-40,C:-55,N:-60,D:-65}}],
"Liberal clássico":[
 {n:"Liberalismo lockeano",d:"Direitos naturais à vida, à liberdade e à propriedade, com governo limitado.",p:{E:40,A:-20,C:5,N:-5,D:-65}},
 {n:"Monetarismo",d:"Moeda estável e mercado livre como base da prosperidade (Friedman).",p:{E:55,A:-10,C:0,N:-15,D:-65}},
 {n:"Liberalismo constitucional",d:"Separação de poderes, Estado de direito e limites ao governo escritos na Constituição.",p:{E:25,A:0,C:0,N:0,D:-65}},
 {n:"Liberalismo econômico brasileiro",d:"Privatizações, abertura comercial e reforma do Estado (Roberto Campos).",p:{E:50,A:-5,C:10,N:-5,D:-65}}],
"Libertário":[
 {n:"Minarquismo",d:"Estado mínimo, só com polícia, justiça e defesa.",p:{E:80,A:-60,C:-15,N:-10,D:-65}},
 {n:"Escola austríaca",d:"Mercado livre, moeda sem controle do governo e crítica ao planejamento (Mises, Hayek).",p:{E:85,A:-50,C:-5,N:-15,D:-65}},
 {n:"Paleolibertarianismo",d:"Estado mínimo com valores tradicionais e desconfiança da globalização.",p:{E:80,A:-40,C:40,N:20,D:-65}},
 {n:"Libertarianismo civil",d:"Liberdades pessoais acima de tudo: drogas, armas, expressão e privacidade.",p:{E:55,A:-80,C:-40,N:-20,D:-65}}],
"Anarcocapitalista":[
 {n:"Anarcocapitalismo rothbardiano",d:"Sociedade sem Estado baseada na propriedade privada e na não agressão (Rothbard).",p:{E:100,A:-85,C:10,N:-10,D:10}},
 {n:"Agorismo",d:"Construir uma economia paralela fora do controle do Estado.",p:{E:95,A:-90,C:-15,N:-30,D:20}},
 {n:"Criptoanarquismo",d:"Criptografia e moedas digitais pra escapar do controle do Estado.",p:{E:90,A:-90,C:-20,N:-40,D:10}},
 {n:"Hoppeanismo",d:"Ordem sem Estado, com comunidades privadas e valores tradicionais (Hoppe).",p:{E:95,A:-60,C:45,N:25,D:20}}],
"Liberal-conservador":[
 {n:"Conservadorismo fiscal",d:"Contas públicas equilibradas, impostos baixos e Estado menor.",p:{E:55,A:10,C:25,N:5,D:-65}},
 {n:"Thatcherismo",d:"Livre mercado, privatizações e firmeza em segurança e valores (Thatcher, Reagan).",p:{E:60,A:30,C:40,N:20,D:-65}},
 {n:"Fusionismo",d:"Une liberdade econômica e valores morais tradicionais (Frank Meyer).",p:{E:50,A:20,C:50,N:15,D:-65}},
 {n:"Centro-direita liberal",d:"Reformas pró-mercado com mudanças graduais nos costumes.",p:{E:35,A:10,C:25,N:0,D:-65}}],
"Conservador":[
 {n:"Conservadorismo burkeano",d:"Mudanças lentas, respeito às instituições e à experiência acumulada (Burke).",p:{E:25,A:30,C:50,N:20,D:-65}},
 {n:"Conservadorismo cristão",d:"Família, vida desde a concepção e fé cristã como base da política.",p:{E:15,A:35,C:80,N:25,D:-65}},
 {n:"Tradicionalismo",d:"Volta a valores e hierarquias antigas, com desconfiança da modernidade.",p:{E:5,A:45,C:85,N:40,D:-55}},
 {n:"Conservadorismo da segurança pública",d:"Prioridade ao combate ao crime, com penas mais duras e polícia forte.",p:{E:30,A:60,C:50,N:30,D:-65}}],
"Direita nacional-conservadora":[
 {n:"Soberanismo",d:"Soberania nacional acima de acordos e organismos internacionais.",p:{E:25,A:45,C:55,N:80,D:-65}},
 {n:"Populismo de direita",d:"O povo contra as elites e a imprensa, com líder forte e valores tradicionais.",p:{E:20,A:55,C:60,N:60,D:-50}},
 {n:"Nacional-conservadorismo cristão",d:"Nação e fé cristã juntas como base da identidade e da política.",p:{E:30,A:50,C:80,N:55,D:-65}},
 {n:"Direita militarista",d:"Forças Armadas fortes e com papel de destaque na segurança e na vida política.",p:{E:30,A:75,C:55,N:65,D:-45}}],
"Extrema direita":[
 {n:"Intervencionismo militar",d:"Defende que as Forças Armadas assumam o poder.",p:{E:35,A:85,C:70,N:75,D:70}},
 {n:"Etnonacionalismo",d:"Nação definida pela origem étnica, com rejeição à imigração.",p:{E:25,A:70,C:75,N:95,D:50}},
 {n:"Tradicionalismo radical",d:"Rejeita a democracia liberal e defende uma ordem religiosa e hierárquica.",p:{E:20,A:75,C:95,N:70,D:50}},
 {n:"Direita antissistema radical",d:"Desconfia das eleições e do Judiciário e aceita romper as regras pra tirar o \"sistema\" do poder.",p:{E:40,A:65,C:70,N:70,D:35}}],
"Fascista":[
 {n:"Fascismo italiano",d:"Estado total, partido único e corporações, como na Itália de Mussolini.",p:{E:20,A:90,C:55,N:95,D:90}},
 {n:"Integralismo",d:"Versão brasileira dos anos 1930: \"Deus, pátria e família\", com Estado corporativo (Plínio Salgado).",p:{E:10,A:85,C:80,N:90,D:80}},
 {n:"Nacional-socialismo",d:"Racismo de Estado e totalitarismo da Alemanha nazista.",p:{E:15,A:95,C:70,N:100,D:95}},
 {n:"Falangismo",d:"Fascismo católico e nacionalista da Espanha de Franco.",p:{E:15,A:90,C:85,N:90,D:85}}]};
