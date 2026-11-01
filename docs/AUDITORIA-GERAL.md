# Auditoria geral (1º de novembro de 2026)

Revisão do projeto inteiro: GitHub, Vercel, Supabase, código, cálculo, conteúdo de cada página (com os fatos
conferidos), facilidade de leitura, design, acessibilidade, testes, livros, compartilhamento e documentação.

Gravidade: **grave** (risco aos dados do estudo ou informação errada pra quem usa), **média** (algo quebrado ou
enganoso em alguns casos), **pequena** (detalhe, texto ou organização).

## Resumo

| Área | Situação | O que foi corrigido |
| --- | --- | --- |
| GitHub | Saudável. Só existe a `main`; os rascunhos antigos já tinham sido apagados ao juntar | Código de conduta; descrição da PR 6 com os links consertados |
| Vercel | Saudável. Funções em São Paulo, cabeçalhos de segurança, variáveis Sensitive e só em Production | Publicação pulada quando só mudam documentos, testes ou ferramentas |
| Supabase (só leitura) | Saudável. Proteção por linha ligada, nada aberto pro público, backup diário funcionando | Backup passou a guardar a cópia fiel de cada registro |
| Código | 1 grave, 9 médias, várias pequenas | Todas as graves e médias corrigidas |
| Cálculo | Sem erros; resultados reais e simulados conferidos | Escala 6x1 atualizada (ver abaixo) |
| Conteúdo e fatos | 94 fatos conferidos, 85 certos, 9 desatualizados ou imprecisos | Os 9 corrigidos |
| Leitura fácil | Bom no geral; frases longas e palavras técnicas em alguns pontos | Explicações, argumentos e textos das páginas revisados |
| Design | Sem problemas em 150 combinações de tela, tema e página | Nada a corrigir |
| Acessibilidade | 0 problemas em 17 telas e páginas, nos dois temas | Teste automático ampliado pra todas as páginas |
| Testes | 8 grupos passando | Testes novos pros pontos corrigidos |
| Livros | 162 com capa e link | "Vozes de Bolso" com a grafia certa |
| Compartilhamento e buscadores | Metodologia e termos sem imagem de compartilhamento | Corrigido, com descrições mais curtas |
| Documentação | Algumas datas e números desatualizados | Atualizados |

## Código

- **Grave: resultado inventado aceito pelo servidor.** O servidor conferia os eixos com as respostas, mas não a
  ideologia. Agora a ideologia enviada precisa estar entre as 8 mais perto dos eixos calculados das respostas. Nos
  resultados reais, a ideologia mostrada nunca passou da 5ª mais perto; nas simulações, da 4ª.
- **Média: limite de pedidos e operadoras de celular.** Muita gente sai pelo mesmo endereço na rede de celular. A
  consulta feita a cada página aberta ganhou um limite próprio, mais alto (240 por minuto); os envios continuam com 30.
- **Média: falha do banco derrubava o site.** Se o banco cair, o limite de pedidos deixa passar e registra o erro.
- **Média: tentativas de senha no painel.** Além do limite por endereço, há um limite geral de tentativas por minuto.
- **Média: backup incompleto.** O backup diário guardava só o registro mais completo de cada pessoa. Agora guarda todos
  os registros, com a chave e a data, pra dar pra restaurar tudo.
- **Média: corrigir respostas depois de continuar de modo.** As frases do modo anterior não apareciam na lista pra
  corrigir. Agora aparecem num grupo próprio.
- **Média: pesos das frases chegando depois do resultado.** Quem abria o site com o resultado salvo podia ver um cálculo
  feito antes dos pesos chegarem. O resultado é refeito quando eles chegam (com espera máxima de 1,5 segundo).
- **Média: dados salvos no aparelho.** Dados antigos ou corrompidos no navegador podiam travar o teste. Agora são
  conferidos ao abrir, e os nomes antigos de ideologia são convertidos.
- **Média: imagem de compartilhar.** Trocar de formato rápido podia mostrar a imagem errada. Corrigido.
- **Pequenas:** aviso de saída mandado uma vez só por posição; link quebrado no endereço não trava mais o menu; a
  rolagem até "Compartilhar" só acontece pra quem veio de um link de comparação; código e estilos sem uso retirados.

## Conteúdo e fatos

- **Escala 6x1.** A emenda à Constituição de outubro de 2026 acabou com a escala 6x1: dois dias de folga por semana a
  partir de 15 de dezembro de 2026, com 42 horas, e 40 horas a partir de dezembro de 2027. As duas frases antigas
  (E19 e Z9) falavam do assunto como proposta; elas saíram do teste e entraram duas novas no lugar (Z23, voltar a
  permitir; Z24, manter o fim). As respostas antigas continuam valendo, e páginas abertas antes da mudança continuam
  sendo aceitas pelo servidor. Na simulação, o acerto não mudou.
- **Cotas (C17 e C18):** os quilombolas entraram na reserva em 2023, não em 2012.
- **Banco Central (Z22):** a diretoria não pode ser demitida *livremente* (há casos previstos em lei).
- **Licença-paternidade (X25):** só a última etapa (20 dias em 2029) depende da meta fiscal.
- **Mercosul–União Europeia (N21):** o Parlamento Europeu pediu um parecer à Justiça europeia antes de votar.
- **Páginas:** termos falavam em "candidatos" (agora presidentes e partidos); a metodologia dizia que o Padrão compara
  12 pares (são 10, mais 2 de simetria); o experimento com posições erradas era de uma versão antiga do cálculo; a FAQ
  dizia "cerca de 96 em 100" (são 95); o envio pro estudo levava "meio minuto" (leva alguns segundos).
- **Termos (versão 3.6):** o código do envio liga a continuação de um modo ao anterior, então o texto que dizia "nenhum
  identificador que ligue um envio a outro" foi corrigido; entrou o prazo de 8 dias do desafio anti-robô e o prazo real
  das contagens do limite de pedidos.
- **Correntes:** explicadas na FAQ e na metodologia, e o arquivo delas (`variantes.js`) entrou nas listas de arquivos.

## Leitura fácil

- Textos que ficam fora das frases do teste: argumentos a favor e contra mais diretos (X10, D5, C6, X38), explicação
  longa dividida (E0), "para" virou "pra" nas explicações, introdução das leituras mais clara e rótulos dos subtemas
  iguais em todo o site ("Impostos e benefícios", "Vigilância e internet").
- Ficaram pra revisão dos livros (que o responsável já quer fazer): cerca de 20 descrições de leituras com frases longas.
- **Não mudado de propósito:** o texto das próprias frases do teste (campo `t`). Mudar no meio do estudo deixaria as
  respostas de antes e de depois incomparáveis. A auditoria achou 25 frases que dá pra simplificar; elas ficam como
  pendência pra depois do estudo ou entre ciclos de coleta.

## O que depende do responsável

- Tirar o tópico `eleicoes-2026` do repositório (GitHub, Settings, Topics).
- Opcional: proteger a `main` e ligar as conferências de publicação no Vercel.
- Domínio próprio, se quiser.
- Fusão PSDB–Podemos: ainda não confirmada pelo TSE; os dois partidos continuam no teste até a confirmação.
- Decidir quando reescrever as 25 frases do teste mais difíceis de ler.
