# Pendências

Lista do que já foi identificado e ainda não foi feito. Atualize ao concluir cada item (e registre no CHANGELOG).
Última revisão: 23 de outubro de 2026.

## Decisões que dependem do responsável pelo projeto

- [ ] **Achados de segurança e privacidade em aberto.** Estão num relatório privado, fora do repositório, com o
      responsável pelo projeto. Um deles exige SQL no banco de produção (apaga uma coluna) e só pode ser feito com
      confirmação explícita. Não descreva esses achados em arquivos públicos.
- [ ] **Variáveis de ambiente no Vercel:** as chaves já estão como *Sensitive* e só em Production, e o site usa a chave
      própria `SUPABASE_CHAVE_SITE`. Falta decidir se remove as que o código não usa (criadas pela integração) e tirar as
      cópias de `CRON_SECRET` e `COLETA_INICIO` dos ambientes Preview e Development.
- [x] **Propostas da auditoria da metodologia:** versão 2 do cálculo (23/10/2026). O que foi aplicado está no topo de
      `docs/AUDITORIA-METODOLOGIA.md`.
- [ ] **Metodologia, o que ficou de fora:** subtemas do Essencial com uma frase só (exige mudar a quantidade de
      perguntas), banco de desempate do Aprofundado, equilíbrio do eixo Instituições, ordem das frases por pessoa e,
      com dados reais, dimensionalidade dos eixos e calibração da probabilidade.

## Auditoria pedida em 23/10/2026 (ainda não concluída)

- [x] **Livros:** correções da auditoria aplicadas e um link conferido em cada obra, no resultado e nas páginas das
      ideologias (23/10/2026). Detalhes no topo de `docs/AUDITORIA-LIVROS.md`.
- [ ] **Livros, equilíbrio das listas:** trocar uma crítica de Liberal clássico/contra, de Conservador/contra e de Direita
      nacional-conservadora/contra por críticas de outro campo, um dos dois Pinker e uma repetição em
      Anarcocapitalista/contra. Nenhum título substituto foi conferido ainda.
- [ ] **Livros, Oakeshott:** confirmar a edição brasileira de *Conservadorismo* (ISBN 9788592649081), que reúne o ensaio
      "Ser conservador", e trocar o item *Sobre ser conservador*, que hoje aparece sem link.
- [x] **Metodologia e Perguntas frequentes** com índice lateral fixo (`css/documento.css` + `js/sumario.js`). Feito em
      23/10/2026.
- [x] **Página Código-fonte público** reorganizada (arquivos, como rodar, testes, licença). Feito em 23/10/2026.
- [x] **Compartilhar e comparar** num bloco só no resultado (23/10/2026).
- [x] **Tema claro:** teclas brancas com contorno pelo token `--branco-borda`. Feito em 23/10/2026.
- [x] **Consistência de números** entre páginas e código, com o teste `testes/numeros.test.mjs`. Feito em 23/10/2026.
      Os tempos (9/18/30 min) continuam estimativas: medir a mediana real no painel.
- [x] **Resultado:** probabilidade e semelhança com nomes diferentes. Feito em 23/10/2026. Os eixos que aproximam ou
      afastam já aparecem em "Comparar com uma ideologia"; nas páginas das ideologias entrou o que separa cada vizinha.
- [x] **Quantidade de perguntas:** decidido em 23/10/2026 pelo responsável: **manter as quantidades atuais**. Reavaliar
      só com dados reais.

## Depois, com dados reais ou com a eleição

- [ ] Ferramenta pra simular conjuntos diferentes de perguntas por modo, antes de qualquer mudança na quantidade.
- [ ] Com pelo menos 500 respostas reais: análise fatorial, IRT, recalibrar os perfis e a temperatura da probabilidade.
- [ ] Medir no painel a mediana de tempo e o ponto de abandono de cada modo (os 9, 18 e 30 minutos são estimativas).
- [ ] Atualizar os candidatos depois da eleição de 2026.
