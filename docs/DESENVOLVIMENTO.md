# Desenvolvimento

## Regras de ouro

1. **Frases novas só no fim de `DATA.EXTRA`.** Nunca reordene nem apague frases: a ordem é a chave dos dados gravados.
2. **Depois de mudar frases ou o motor, rode** `node ferramentas/gerar_listas.mjs`. Ele atualiza as listas do servidor e
   gera `servidor/motor.mjs`.
3. **Mudou o significado dos dados** (cálculo, formato do envio)? Avalie subir a versão dos dados (`r6` → `r7`) pra não
   misturar resultados antigos e novos no painel.
4. **Mudança só visual** deve deixar os resultados idênticos. Confira com a mesma simulação antes e depois.

## Tarefas comuns

- **Mudar o texto de uma frase:** edite o campo em `DATA` (`public/js/dados/frases.js`). Mudar o sentido de uma frase é, na prática, uma
  frase nova: acrescente outra no fim e tire a antiga dos modos (`lv` acima de 3 não aparece em nenhum modo).
- **Acrescentar frases:** acrescente no fim de `DATA.EXTRA`, com todos os campos (veja Arquitetura).
- **Páginas de ideologias e perguntas frequentes:** depois de mudar `js/dados/ideologias.js` ou as perguntas em
  `ferramentas/gerar_paginas.mjs`, rode `npm run paginas`. Isso também gera as páginas Sobre (`/sobre/`) e de erro
  (`404.html`), o sitemap e os dados estruturados (JSON-LD) das páginas de ideologia.
- **Imagens de compartilhamento das ideologias** (`public/img/og/<nome>.png`, 1200×630): depois de mudar nome, família,
  resumo ou posição de uma ideologia, rode `node ferramentas/gerar_imagens_compartilhar.mjs`.
- **Rodapé:** a data de "Atualizado em" fica em `ATUALIZADO` (`public/js/navegacao.js`) e precisa ser a da entrada mais
  recente do `CHANGELOG.md` (o teste de páginas confere).
- **security.txt** (`public/.well-known/security.txt`): renove o `Expires` antes de vencer (o teste avisa 30 dias antes).
- **Cache:** fonte guardada por 1 ano; fotos, capas e imagens de compartilhamento por 7 dias (com atualização em segundo
  plano); ícones por 30 dias; HTML, JS e CSS sempre conferidos (`vercel.json`). Uma imagem trocada pode levar até 7 dias
  pra aparecer pra quem já visitou; se precisar que apareça na hora, dê outro nome ao arquivo.
- **Perfis das ideologias:** posição de cada ideologia nos eixos em `public/js/dados/ideologias.js` e nos 15 subtemas
  em `public/js/dados/frases.js`. Mudar perfis é mudança metodológica: proponha antes, com simulação (veja `CONTRIBUTING.md`).
- **Presidentes e partidos:** `public/js/dados/candidatos.js` (`CAND.pres` e `CAND.part`). Cada lista vira uma aba na seção
  do resultado. A cada novo presidente, acrescente-o no fim de `CAND.pres`, com a posição estimada pelo que fez no governo.
- **Ver o site no computador:** `npm run local` serve `public/` em http://127.0.0.1:8080 (sem as funções do servidor;
  o site entra em modo teste e nada é enviado).

## Variáveis de ambiente (Vercel)

Veja `.env.example`. As principais:

| Variável | Efeito |
|---|---|
| `SUPABASE_URL`, `SUPABASE_CHAVE_SITE` | Banco do estudo (obrigatórias em produção). `SUPABASE_CHAVE_SITE` é uma chave secreta criada só pro site, guardada como Sensitive e só em Production |
| `LIMITE_SEGREDO` | Segredo do limite de pedidos por visitante, fora do banco (Sensitive, só em Production). Sem ela, o servidor usa um segredo guardado no banco |
| `CRON_SECRET` | Protege a tarefa diária de backup |
| `PAINEL_SENHA` | Senha do painel, com 16 caracteres ou mais (mais curta, é ignorada). Sem ela, o painel pede pra criar uma credencial no primeiro acesso |
| `COLETA_INICIO` | Data (AAAA-MM-DD) a partir da qual os resultados reais entram nas estatísticas |

## Testes

```bash
npm ci
npx playwright install chromium   # uma vez; ou CHROMIUM_PATH=/caminho/do/chrome
BANCO=memoria npm test
```

| Comando | O que verifica |
|---|---|
| `npm run test:logica` | A mesma simulação (21 ideologias × 3 estilos × reteste, dois geradores, sorteio fixado) dá os mesmos resultados de `testes/referencia/logica.json` (números comparados com 12 algarismos significativos, pra ignorar diferenças de 1e-16 entre versões do Chromium), e o acerto de cada modo não cai abaixo de 85% |
| `npm run test:perfis` | Perfis sintéticos no núcleo (sem navegador): propriedades que as regras do código declaram. Defeitos conhecidos aparecem como PENDENTE e não contam como falha |
| `npm run test:numeros` | Os números publicados na metodologia, nas perguntas frequentes, na página inicial e no README batem com o código (perguntas por modo, ideologias, `CALIB`) |
| `npm run test:cliques` | Todos os botões e links de cada tela, no celular e no computador |
| `npm run test:interface` | Os 3 modos no navegador: teclas, número da pergunta, FIM, as 11 seções do resultado completo, perto e longe de cada ideologia, onde você difere da sua, gráfico da evolução, imagem, códigos de comparação, retomar, aviso ao trocar de modo e nada rolando pros lados em 320 e 1280 px, claro e escuro |
| `npm run test:paginas` | As 21 páginas de ideologia e a de comparar existem e funcionam, nenhum link interno quebrado, menu (abrir, Esc, tecla numerada), tema salvo entre páginas, filtro da lista e nada rolando pros lados em 320, 768 e 1280 px |
| `npm run test:acessibilidade` | axe-core (WCAG 2.1 A e AA) no início, consentimento, pergunta, resultado, páginas de ideologia, perguntas frequentes e metodologia, nos dois temas |
| `npm run test:servidor` | Envios gerados pelo site, continuação de modo, envio de página antiga (versão 3), recusa de dados inválidos e adulterados, senha do painel, contas do painel, planilha (com a semente da ordem e a versão do cálculo) e compactação |

Se uma mudança na lógica for **intencional**, rode `npm run test:atualizar`, revise a diferença da referência no git e
explique a mudança no histórico. Mudanças só visuais nunca devem alterar a referência.

**Links dos livros:** `npm run links` abre todos os links de `public/js/dados/leituras.js` (o de compra e o informativo).
Falha só quando um link sumiu (404, 410 ou endereço inexistente); lojas e a Wikipédia às vezes recusam robôs, e isso
aparece como aviso. O GitHub Actions roda essa conferência no dia 3 de cada mês (`.github/workflows/links.yml`) e
também dá pra rodar pela aba Actions; se falhar, o GitHub avisa o dono do repositório por e-mail.

## Publicação

O projeto do Vercel está ligado ao GitHub:

1. Trabalhe numa branch e abra um pull request. O Vercel cria uma prévia (Preview) com endereço próprio; os envios
   dela vão pro conjunto de teste.
2. O GitHub Actions roda `npm audit`, confere se as páginas geradas e as listas do servidor estão em dia e roda
   `npm test` em cada pull request.
3. Ao juntar na `main`, o Vercel publica em produção automaticamente.
4. Confira o endereço oficial sem participar do estudo, pra não misturar testes com dados reais.

O endereço antigo (testepolitico.netlify.app) só redireciona pro Vercel (`ferramentas/redirecionamento-netlify/`).

A imagem `og.png` fica guardada em cache pelas redes sociais. Se mudar a imagem, mude também o nome do arquivo
(e o `og:image` em `index.html`) pra forçar a atualização.
