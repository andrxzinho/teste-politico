# Dados e privacidade

O texto completo pro público está em `public/termos.html`. Este documento resume o que o código faz.

## Participação

- É opcional. A pessoa escolhe antes de começar; quem não participa faz o teste normalmente e nada é enviado.
- Exige marcar a concordância com os termos.
- Participar exige confirmar "Tenho 18 anos ou mais", no início e no envio depois do resultado. Quem informa ter menos de
  18 anos faz o teste, mas nada é enviado. O servidor não aceita faixas abaixo de 18.

## O que é enviado (só de quem participa)

Ideologia, posição nos eixos em faixas, termômetro dos extremos, resposta a cada frase, quais explicações foram abertas,
semente da ordem das frases (um número sorteado no aparelho, desde a versão 4 do cálculo), tempo em faixas, confiança, se houve desempate, número de contradições, versão do cálculo, modo (e de qual modo veio, se continuou),
autoidentificação política se respondida, e faixa de idade e estado só se informados.

## O que nunca é enviado

Nome, e-mail, IP, navegador, localização e a compatibilidade com presidentes e partidos.

## O que fica só no aparelho

Progresso do teste, histórico de resultados, código de comparação de amigos e a preferência de som.

## Proteções

- O código de envio é aleatório, gerado no aparelho, e só serve pra evitar duplicatas.
- O painel esconde cruzamentos com menos de 5 pessoas e exporta planilhas sem identificadores.
- Dados de teste ficam separados dos reais.

## Fim do estudo

O estudo termina em 31 de dezembro de 2027 (`FIM_ESTUDO` em `servidor/comum.mjs`). A partir desse dia, o servidor
responde que a coleta está desligada (o convite pra participar some do site) e a tarefa diária `/api/backup` apaga todos
os resultados e avisos, reais e de teste, e todos os backups, sem guardar cópia. Isso acontece sozinho, sem ninguém
precisar fazer nada.

## Se o projeto for oficializado

Os dados são anônimos desde o envio, mas antes de divulgar em larga escala ou publicar análises vale revisar os termos com
alguém que conheça a LGPD, definir um prazo de guarda dos dados e indicar um contato pra dúvidas.
