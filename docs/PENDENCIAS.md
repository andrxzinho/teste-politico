# Pendências

Lista do que já foi identificado e ainda não foi feito. Atualize ao concluir cada item (e registre no CHANGELOG).
Última revisão: 28 de outubro de 2026.

## Decisões que dependem do responsável pelo projeto

- [x] **Segurança e privacidade:** correções no código no ar desde 25/10/2026; SQL rodado no Supabase, chave própria
      nova do site, chaves antigas (legacy) desativadas e senha do banco trocada (27/10/2026).
- [ ] **Não desinstalar a integração Supabase–Vercel:** o projeto do Supabase foi criado pelo Vercel, e desinstalar a
      integração apaga a organização inteira do Supabase, com o banco e os backups (que ficam no mesmo banco). As
      variáveis que ela cria no Vercel (SUPABASE_SECRET_KEY, POSTGRES_* e outras) não são usadas pelo site.
- [x] **Variáveis de ambiente no Vercel:** só as cinco que o site usa, todas Sensitive e só em Production (23/10/2026).
- [x] **Textos conferidos com fonte atual** (27/10/2026): licença-paternidade (X25, Lei 15.371/2026), marco temporal
      (C21, decisão do STF de dezembro de 2025 e PEC 48 na Câmara) e acordo Mercosul–União Europeia (N21, assinado em
      janeiro de 2026 e em vigor provisório desde maio). Conferir de novo se o acordo ou a PEC avançarem.
- [x] **Prazo de guarda dos dados:** exclusão automática em 31/12/2027: a coleta para e a tarefa diária apaga os dados
      e os backups (27/10/2026). Ver `docs/DADOS-E-PRIVACIDADE.md`.
- [ ] **E-mail de contato:** ainda não existe. Quando houver, pôr no rodapé, na página Sobre, nos termos (seção 16), no
      `SECURITY.md` e no `security.txt`. Até lá, o contato é pelos avisos do GitHub e pelo relato privado.
- [ ] **security.txt:** renovar a data de validade (`Expires`) até 27 de outubro de 2027.
- [ ] **Backup fora do Supabase:** baixar pelo painel, de tempos em tempos, uma cópia dos dados pra guardar fora do projeto.
- [x] **Respostas ao acaso:** deixaram de sair como "Centrista, confiança alta" (cálculo, versão 3, 25/10/2026).
- [x] **Linguagem simples** no site inteiro, menos nos termos de uso (25/10/2026).
- [x] **Candidatos depois do 2º turno** atualizados (26/10/2026) e retirados em 27/10/2026, com o "2026" do nome.
- [x] **Presidentes desde 1985** no resultado, no lugar dos candidatos, com foto (27/10/2026).
- [x] **Propostas da auditoria da metodologia:** versão 2 do cálculo (23/10/2026). O que foi aplicado está no topo de
      `docs/AUDITORIA-METODOLOGIA.md`.
- [ ] **Metodologia, o que ficou de fora:** subtemas do Essencial com uma frase só (exige mudar a quantidade de
      perguntas), banco de desempate do Aprofundado, equilíbrio do eixo Instituições, ordem das frases por pessoa e,
      com dados reais, dimensionalidade dos eixos e calibração da probabilidade.

## Auditoria pedida em 23/10/2026

- [x] **Livros:** correções da auditoria aplicadas e um link conferido em cada obra, no resultado e nas páginas das
      ideologias (23/10/2026). Detalhes no topo de `docs/AUDITORIA-LIVROS.md`.
- [x] **Livros, equilíbrio das listas** (27/10/2026): Scruton no lugar de Stiglitz (Liberal clássico/contra), Mill no
      lugar de Foucault (Conservador/contra), Mises no lugar de Snyder (Direita nacional-conservadora/contra), Fukuyama no
      lugar de um dos Pinker (Liberal progressista) e Olson no lugar da repetição de Polanyi (Anarcocapitalista/contra).
- [x] **Livros, Oakeshott** (27/10/2026): *Conservadorismo* (Âyiné, 2020), que reúne "Ser conservador", com link.
- [x] **Capas:** oito das onze que faltavam (27/10/2026). Continuam sem capa *A terceira via* (Giddens, Record, 1998),
      *Populações meridionais do Brasil* (Oliveira Vianna, 1938) e *O Estado moderno* (Miguel Reale, 1934).
- [x] **Links informativos dos livros** (27/10/2026).
- [ ] **Sete livros só com link de loja:** O que há de errado com o mundo (Chesterton, Ecclesiae: site bloqueia acesso
      automático), O que é conservadorismo (Scruton) e A política da prudência (Kirk), da É Realizações (site fora do ar
      na conferência), A terceira via (Giddens), Quatro ensaios sobre a liberdade (Berlin), O homem e o Estado (Maritain)
      e O Estado moderno (Reale), que não têm página de editora nem artigo na Wikipédia.
- [x] **Metodologia e Perguntas frequentes** com índice lateral fixo (`css/documento.css` + `js/sumario.js`). Feito em
      23/10/2026.
- [x] **Página Código-fonte público** reorganizada (arquivos, como rodar, testes, licença). Feito em 23/10/2026.
- [x] **Compartilhar e comparar** num bloco só no resultado (23/10/2026).
- [x] **Tema claro:** teclas brancas com contorno pelo token `--branco-borda`. Feito em 23/10/2026.
- [x] **Consistência de números** entre páginas e código, com o teste `testes/numeros.test.mjs`. Feito em 23/10/2026.
      Os tempos (9/18/30 min) continuam estimativas: medir a mediana real no painel.
- [x] **Resultado:** probabilidade e semelhança com nomes diferentes. Feito em 23/10/2026. Os eixos que aproximam ou
      afastam já aparecem em "Comparar com uma ideologia"; nas páginas das ideologias entrou o que separa cada vizinha.
- [x] **Funções novas** (28/10/2026): perto e longe de cada ideologia no resumo, "Onde você difere da sua ideologia",
      gráfico da evolução nos resultados anteriores e a página `/ideologias/comparar/`.
- [x] **Quantidade de perguntas:** decidido em 23/10/2026 pelo responsável: **manter as quantidades atuais**. Reavaliar
      só com dados reais.

## Depois, com dados reais ou com a eleição

- [ ] Ferramenta pra simular conjuntos diferentes de perguntas por modo, antes de qualquer mudança na quantidade.
- [ ] Com pelo menos 500 respostas reais: análise fatorial, IRT, recalibrar os perfis e a temperatura da probabilidade.
- [ ] Medir no painel a mediana de tempo e o ponto de abandono de cada modo (os 9, 18 e 30 minutos são estimativas).
- [x] Candidatos de 2026 retirados depois da eleição; ficam os partidos (27/10/2026).
