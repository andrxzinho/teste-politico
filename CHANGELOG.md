# Histórico de versões

## Repositório novo e limpeza (23 de outubro de 2026)
- Repositório recriado do zero, com o projeto atual num commit único.
- README reescrito: sumário, destaques, privacidade, tecnologias e imagem de abertura nos temas claro e escuro.
- Removidos scripts e documentos que não eram mais usados: geradores antigos das frases, cópias dos perfis em Python,
  ferramenta de migração do Netlify (migração concluída), configuração antiga do Netlify, gerador de prévias em arquivo
  único, anotações das versões antigas, o relatório da revisão de outubro (o que faltava foi pra `docs/PENDENCIAS.md`) e o
  plano de quantidade de perguntas (decisão registrada abaixo).
- Ferramentas de teste atualizadas (Playwright 1.64 e ações do GitHub Actions).

## Resultado mais honesto, metodologia com índice e repositório organizado (23 de outubro de 2026)
- Resultado: o bloco do resumo virou "Ideologias que melhor explicam suas respostas", com a explicação de que a
  porcentagem é a chance dentro do modelo, não o quanto a pessoa concorda. A sanfona "Ideologias mais parecidas" virou
  "Ideologias mais prováveis" e a legenda deixou de chamar a probabilidade de semelhança. Termômetro dos extremos em
  "índice de 0 a 100"; compatibilidade com candidatos e pensadores sem porcentagem (só alta, média, baixa).
- Quem responde quase tudo no meio-termo e recebe Centrista vê um aviso de que o rótulo diz pouco. Textos da confiança,
  das simulações e do "entre duas ideologias" deixam claro o que não sabem. Nenhum cálculo mudou (referência da lógica
  idêntica).
- Metodologia e perguntas frequentes reescritas no formato dos termos, com sumário lateral fixo que marca a seção na
  tela, números conferidos no código (62–70, 128–139 e 205–216 perguntas; acerto simulado de `CALIB`), tabela do que
  significa cada número e seção de limites conhecidos. O Aprofundado deixou de ser chamado de "o mais preciso".
- Página do código-fonte reorganizada: onde fica cada parte, como rodar no computador, testes e licença.
- Páginas das ideologias: o que separa cada uma das vizinhas e os mesmos nomes de faixa do resultado; descrição do
  Centrista sem confundir ideologia com padrão de resposta.
- Tema claro: botões brancos ganharam contorno (token `--branco-borda`), inclusive o "Ver no GitHub".
- Comparar com amigos: aviso quando o link está incompleto e quando os dois fizeram modos diferentes.
- Repositório: `.env.example` (estava sendo ignorado), `npm run local`, modelo de pull request, Dependabot, CI com
  `npm audit` e conferência das páginas geradas, teste novo `testes/numeros.test.mjs`, README e documentação revistos. Avaliada a quantidade
  de perguntas por modo: decidido manter as quantidades atuais.

## Imagens completas, termos novos e código-fonte público
- Fotos de todas as 73 pessoas (as 12 que faltavam vêm das fotos oficiais de candidatura do Portal de Dados Abertos
  do TSE) e capas reais de 156 dos 162 livros, de preferência da edição brasileira, todas conferidas uma a uma;
  33 capas erradas ou em outra língua foram trocadas. Página de créditos mostra edição e ISBN.
- Compartilhar: miniaturas reais de cada formato, Instagram e TikTok abrem uma janela explicando como publicar,
  sem LinkedIn e Bluesky, "Copiar texto" alinhado com os outros botões e textos de compartilhamento reescritos.
- Ícone do site (favicon, ícone do iPhone e do Android).
- Página /codigo-aberto/ e chamada na abertura: o que está publicado e o que a licença PolyForm Strict permite.
- Termos de uso e política de privacidade reescritos: sumário fixo, seções numeradas, tabela de dados coletados,
  operadores (Supabase, Vercel, Google Fonts), base legal pela LGPD, direitos, propriedade intelectual e contato.

## Migração pro Vercel + Supabase e ajustes do resultado
- Servidor no Vercel (api/ e servidor/), dados no Supabase (supabase/esquema.sql), banco fechado pro público,
  limite de pedidos com o endereço transformado em código, backup diário pela tarefa agendada. Dados do Netlify
  importados e conferidos. Termos de privacidade atualizados.
- Som: ligar o som (tecla do teste ou menu, em qualquer página) toca o som de confirmação da urna.
- Resultado: sem o menu de três traços, e a tecla do cabeçalho vira "Refazer teste".
- Teste pela metade: "Descartar e começar do zero" ao lado de "Continuar de onde parei".
- Resumo reorganizado: eixos, ideologias, destaques (2º turno com foto dos dois), pensadores e figuras históricas,
  leituras com capa, compartilhar e comparar com amigos (agora num lugar só). No completo, "Por que deu esse
  resultado" vem logo depois do perfil.
- Compartilhar: imagem em 4 formatos (story 9:16, retrato 4:5, quadrado 1:1, paisagem 16:9), cada um com o uso
  ideal, e atalhos pra WhatsApp, X, Facebook, Threads, Telegram, LinkedIn, Bluesky e Instagram.
- Fotos de candidatos e pensadores (licença livre, Wikimedia Commons) e capas de livros (Open Library), com
  iniciais ou capa tipográfica quando não há imagem; página /creditos/ com autor e licença de cada uma.

## Pensadores e figuras históricas
- Nova seção no resultado com 41 pessoas já falecidas (19 pensadores clássicos e 22 figuras históricas brasileiras),
  posicionadas nos 5 eixos com justificativa. Mostra as 3 mais parecidas, a mais parecida entre brasileiros e entre
  clássicos, a mais distante e a lista completa; o resumo destaca a mais parecida. Eixos sem posição (temas de outra
  época) contam meia semelhança. Testes conferem os dados e a calibração com as posições típicas das ideologias.

## Glossário nas frases
- 56 termos técnicos (STF, CLT, BNDES, medidas provisórias, Margem Equatorial...) ficam sublinhados nas frases;
  ao tocar, a definição curta e neutra aparece logo abaixo, dentro do visor. Dados em public/js/dados/glossario.js;
  testes conferem que o texto da frase não muda e que todo termo aparece em alguma frase.

## Corrigir respostas no resultado
- "Corrigir respostas" (no resumo e em Precisão e observações): lista das frases respondidas por bloco; troca a
  resposta, confirma e o resultado recalcula, avisando se a ideologia mais próxima mudou. Cancelar não muda nada.
  O histórico é atualizado em vez de ganhar um item novo; o que já foi enviado pro estudo continua igual.

## Movimento, índice do resultado e ideologia mais distante
- Novo padrão de movimento (public/css/movimento.css): frases entram pelo lado da direção (avançar ou voltar),
  tecla escolhida pulsa, barra de progresso em trechos por bloco que pulsam ao terminar; no resultado, entrada em
  cascata, confiança acendendo, ponto da bússola saindo do centro, marcas dos eixos e barras crescendo, porcentagens
  contando; blocos aparecem ao rolar (com segurança se a animação falhar); gavetas abrem suave; menu em cascata;
  cartões reagem ao mouse; troca suave entre páginas. Tudo desligado com "reduzir movimento".
- "Mais distante de você" no resumo e nas ideologias parecidas.
- Computador largo (1360 px ou mais): índice lateral fixo no resultado, marcando a seção na tela; barra de leitura no topo.
- Correção: "Comparar com amigo" ficava espremido ao lado do visor do resultado no computador.

## Página inicial mais limpa
- Abertura só com o essencial: visor com o mapa, os 3 modos, uma linha de anonimato e "Como funciona". Atalhos,
  perguntas frequentes e as janelas de eixos, ideologias e desempate saíram (estão no menu e na metodologia).
- Computador: cabeçalho só com "Fazer o teste" e o menu; título em 2 linhas; modos e "Como funciona" lado a lado
  com o visor, cabendo em uma tela. Resultado de amigo ocupa a largura toda acima.
- O "?" do mapa voltou a passear sem parar; pausa com a aba em segundo plano ou fora da tela e fica parado com
  "reduzir movimento". Testes novos conferem a abertura enxuta e a animação.

## Ajustes no resultado
- Código de comparação no resumo do resultado, com "Copiar link" e "Comparar com um código".
- Compartilhar: só a escolha de tema claro ou escuro (imagem sempre em story, com todas as informações).

## Resultado em resumo, compartilhamento e perguntas menos repetidas
- Correção: a janela de "Confiança alta" quebrava (dados de precisão incompletos desde a etapa C). Novo teste clica
  em todos os botões, gavetas, abas e janelas, no celular e no computador.
- Resultado começa num resumo (eixos, 3 ideologias, destaques, 8 leituras); "Ver resultado completo" abre as 12
  seções; o PDF sai sempre completo. Testes conferem o conteúdo de cada parte e acusam nomes repetidos entre arquivos.
- Compartilhar: story ou quadrado, tema claro ou escuro, opção de esconder candidatos e extremos, QR code "compare
  comigo", WhatsApp, copiar link e copiar texto.
- Leituras: 4 obras por dentro e 4 críticas pra cada ideologia (168 no total).
- Perguntas: 4 frases de pares quase idênticos reescritas (mesmo eixo, subtema, direção e nível; antigas fora dos
  modos), 9 opções de escolhas e contrastes que copiavam frases reescritas, enunciados variados (24 contrastes e 16
  escolhas). Precisão: Essencial 95,2%, Padrão 97,8%, Aprofundado 97,6%.

## Sons da urna recriados
- Som de confirmação (tela de FIM) recriado por síntese a partir de medições do som da urna: tom puro alternando entre
  ~2,2 kHz e ~2,3 kHz a cada 100 ms, por 0,7 s (medido: 0,69 s e 2.247 Hz de média, contra 0,71 s e 2.248 Hz).
  Nenhuma gravação é usada.
- "Toc" mecânico curto ao tocar nas teclas de resposta. Sons continuam desligados por padrão.

## Etapa D: auditoria final
- Acessibilidade (axe-core, WCAG 2.1 AA): nome do site e chave de som com nome igual ao texto visível, número da
  pergunta legível por leitor de tela, abas declaradas como abas, contraste dos selos e da resposta marcada no escuro.
  Teste de acessibilidade incluído em `npm test`.
- Lógica: cálculo simétrico confirmado com respostas espelhadas; confiança calibrada (alta: 96–99% de acerto; média:
  67–75%); mensagem de respostas insuficientes passou a usar a mesma contagem do cálculo (antes podia prometer um
  mínimo que não bastava).
- Limites documentados: diferença de acerto entre esquerda e direita no Essencial e opções da escolha forçada da
  economia sem centro.
- Textos antigos sobre "app.js" corrigidos; verificação de gramática do texto novo; desempenho medido (início em
  2,9 s num celular simples com 4G lenta).

## Etapa C: funcionalidades novas e decisões da auditoria
- Eixos equilibrados em todos os modos (no máximo 2 frases de diferença entre os lados): trocas de nível no Essencial
  e no Padrão; P0, P2, P12 e P14 saem do Aprofundado (continuam no banco de desempate); D23 sai de todos os modos.
  Simulações (504 por modo e gerador): acerto Essencial 95,0%, Padrão 98,2%, Aprofundado 98,8%, todos um pouco
  melhores que antes. Modos: cerca de 65, 135 e 210 perguntas.
- "Pergunta" pra cada tela e contagem; "frase" pro conteúdo avaliado.
- Respostas insuficientes: com opinião em menos de 20% das perguntas, o teste não dá rótulo, explica e não envia
  ao estudo.
- Comparar com qualquer ideologia, eixo por eixo e subtema por subtema, com a faixa provável.
- Tensões e posições incomuns, comparadas com as 21 tradições.
- Leituras: 2 obras a favor e 2 críticas (de lados diferentes quando possível) pra cada uma das 21 ideologias, no
  resultado e nas páginas de ideologia.
- Relatório em PDF pela impressão do navegador (todas as seções abertas, sem navegação).
- Link de comparação mostra o resultado de quem mandou antes mesmo de fazer o teste; páginas de ideologia têm
  "Comparar com o meu resultado".

## Etapa B2: acabamento do teste e do resultado 
- Perguntas no formato da urna no computador e no tablet deitado: visor à esquerda, teclado de respostas à direita.
- Transição ao trocar de tela; gavetas do resultado entram em sequência (desligado pra quem pede menos movimento).
- Aviso claro se algo quebrar (as respostas ficam salvas, com tecla pra recarregar); imagem de compartilhar com estado
  de carregamento e mensagem se não puder ser gerada (antes falhava calada).
- Tablet com mais largura no início e no resultado; bússola com tamanho limitado; teclas clareiam ao passar o mouse.

## Etapa B1: navegação e páginas 
- Cabeçalho e rodapé em todas as páginas; menu em forma de teclado numerado, com som e tema (automático, claro, escuro).
- Páginas novas: as 21 ideologias (lista com filtro e uma página por ideologia, com resumo, posição típica e vizinhas)
  e perguntas frequentes; `sitemap.xml` e `robots.txt`.
- Início com "Como funciona", atalhos e perguntas frequentes; computador com visor e modos lado a lado e resultado em
  duas colunas. Metodologia e termos na mesma moldura.
- Código: app.js dividido por responsabilidade, estilo em arquivos próprios, testes no repositório (npm test).

## Atualização pós-1º turno (7/10/2026)
- Candidatos com a situação de cada um: Flávio Bolsonaro (PL) e Lula (PT) no 2º turno de 25/10; Tarcísio de Freitas
  reeleito governador de SP; Guilherme Derrite (PP) e André do Prado (PL) eleitos senadores por SP (fontes: TSE, TRE-SP).
- Nova linha "No 2º turno, você está mais perto de..." e selos de situação; imagem de compartilhar mostra o 2º turno.
- Todos os candidatos continuam na lista pra comparação. Nenhuma regra de cálculo mudou.

## Identidade "urna eletrônica" e auditoria
- Visual inspirado na urna (sem símbolos oficiais): visor, teclas com relevo, número da pergunta em caixas, tela de FIM e
  som opcional.
- Imagem de compartilhar e prévia do link em forma de urna.
- Auditoria completa: empate total desfeito pela ideologia mais próxima do centro, aviso antes de apagar um teste em
  andamento, correções de layout no celular, acessibilidade (toque de 44 px) e revisão de português.

## Versão 6: três modos
- Essencial, Padrão e Aprofundado, um dentro do outro, com continuação sem repetir respostas.
- Cálculo único compartilhado entre site e servidor; perfis por subtema; classificação probabilística; contrastes
  entre ideologias vizinhas; indicador de confiança; dados gravados na versão 6.

## Versão 5
- Painel redesenhado, sessões de teste seguras, prova anti-robô, recálculo dos eixos no servidor, compactação diária.
- Primeiras perguntas de escolha forçada e correção do estilo de resposta; filtro dos extremos revisado.

## Versões anteriores
- Versão 4: auditoria e reformulação das frases e do cálculo.
- Versões 1 a 3: primeiras versões públicas.
