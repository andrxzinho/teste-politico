# Arquitetura

Site estático (HTML, CSS e JavaScript puro, sem framework e sem etapa de build) com quatro funções no Vercel
(`api/`, região São Paulo) e banco Postgres no Supabase (São Paulo). Todo o cálculo do resultado roda no navegador;
o servidor só recebe os envios de quem aceita participar do estudo.

## Site (`public/`)

| Arquivo | Papel |
|---|---|
| `index.html` | Todas as telas (abertura, consentimento, perguntas, desempate, importância, FIM, resultado, janelas) |
| `css/urna.css` | Estilo |
| `js/nucleo/motor.js` | Cálculo dos eixos (ver Metodologia, seção 4). O mesmo arquivo roda no servidor |
| `js/dados/frases.js`, `ideologias.js`, `candidatos.js` | Dados: frases (`DATA`), ideologias (`IDEO`), candidatos (`CAND`) |
| `js/nucleo/base.js`, `estado.js`, `calculo.js` | Montagem da lista de frases, estado do teste, classificação e confiança |
| `js/telas/*.js` | Perguntas, início, resultado, candidatos, comparação, janelas, visor da urna |
| `js/servicos/estudo.js`, `imagem.js` | Envio pro estudo e imagem de compartilhar |
| `js/principal.js` | Abertura e ligação dos botões |
| `painel.html`, `js/painel.js` | Painel administrativo |

**Navegação e páginas.** `js/navegacao.js` é carregado no `<head>` de todas as páginas públicas: aplica o tema escolhido
(salvo no aparelho) antes de desenhar a página e monta o cabeçalho, o menu (teclas numeradas de 1 a 6, Esc fecha, foco
preso no menu) e o rodapé a partir de uma única lista de páginas. As páginas de ideologias e de perguntas frequentes são
HTML estático gerado por `ferramentas/gerar_paginas.mjs` a partir de `js/dados/ideologias.js` (`IDEO`, `IDEO_GRUPOS`,
`IDEO_RESUMO`), junto com `sitemap.xml` e `robots.txt`.

Os arquivos de `js/` são scripts comuns, carregados em ordem por `index.html`, e compartilham o mesmo escopo. A ordem
importa: dados, depois núcleo, depois telas e serviços, e `principal.js` por último.
| `metodologia.html`, `termos.html` | Páginas de texto |
| `og.png` | Imagem de prévia do link (1200 × 630) |

O estado do teste fica no `localStorage` do aparelho: progresso, histórico de resultados, código de um amigo e a
preferência de som. Nada disso sai do aparelho.

## Formato das frases (`DATA` em `js/dados/frases.js`)

| Campo | Significado |
|---|---|
| `id` | Identificador estável (ex.: `E12`, `X3`, `L5`, `K0`) |
| `k`, `s` | Eixo e subtema |
| `d` | Direção: +1 se concordar puxa pro polo +, −1 se puxa pro polo − |
| `f` | Formato: concordância, `d` dilema, `l` escolha forçada, `c` contraste |
| `lv` | Nível: 1 Essencial, 2 Padrão, 3 Aprofundado |
| `m` | Marcadoras de extremos ou ecologismo (`com`, `anq`, `fas`, `anc`, `eco`); `mi` inverte |
| `t`, `e`, `ex`, `c`, `dd` | Frase, explicação, exemplo, argumento de quem concorda, de quem discorda |
| `a`, `b`, `va`, `vb` | Contraste: as duas frases e a posição de cada uma no subtema |
| `o`, `v` | Escolha forçada: as cinco opções e a posição de cada uma |
| `nm`, `lt` | Fora da média do eixo; frase que vai pro bloco final |

`CANON` é a ordem fixa de todas as frases nos dados gravados: `Q` (por eixo), depois `POOL`, `LAD` e `EXTRA`.
**Frases novas sempre entram no fim de `EXTRA`**, pra posição das frases já gravadas nunca mudar.

## Servidor (`api/` e `servidor/`)

| Função | Rota | Papel |
|---|---|---|
| `coletar.mjs` | `/api/coletar` | Recebe resultados e avisos de início e saída; emite desafios anti-robô |
| `painel.mjs` | `/api/painel` | Painel: login, números, planilha, pesos, formatação, sessões de teste |
| `pesos.mjs` | `/api/pesos` | Entrega os pesos por frase pro site (hoje vazios) |
| `backup.mjs` | agendada (diária) | Compacta os dias fechados e faz cópia de segurança |

`api/*.mjs` são só a porta de entrada do Vercel; a lógica fica em `servidor/rotas/*.mjs`.
`servidor/comum.mjs` guarda as listas compartilhadas (IDs, ideologias, faixas), o limite de pedidos e as sessões de teste.
`servidor/banco.mjs` fala com o Supabase pela API REST com a chave secreta (só no servidor) ou, com `BANCO=memoria`,
guarda tudo em memória pros testes. `servidor/motor.mjs` é **gerado** a partir de `public/js/nucleo/motor.js` por
`ferramentas/gerar_listas.mjs`; não edite à mão.

### Envio de um resultado

1. O site pede um desafio (`GET /api/coletar?desafio`) e resolve uma prova de trabalho leve (16 bits, menos de 1 segundo).
2. Envia o resultado (`POST`, versão 6) com o código de envio aleatório e a prova.
3. O servidor valida formato e tamanho, confere a prova (cada desafio vale uma vez), **recalcula os eixos com o mesmo
   motor** e recusa o envio se os eixos informados não baterem (tolerância de 30 pontos).
4. Grava o registro. O código de envio evita duplicatas se a conexão cair.

Respostas são gravadas como texto, um caractere por frase na ordem de `CANON`: `a` a `e` = −2 a +2, `x` = sem opinião,
`_` = não mostrada.

### Armazenamento (Supabase)

Tabelas em `supabase/esquema.sql`, com RLS ligado e sem acesso pras chaves públicas (anon/authenticated):

| Tabela | Conteúdo |
|---|---|
| `resultados` | Um resultado por envio (`conjunto`, `dia`, `chave` única, `dados` em JSON) |
| `eventos` | Avisos de início e saída, contados por dia, modo e posição |
| `config` | Credencial do painel (hash scrypt), pesos, segredos dos desafios e das sessões de teste, contagem legada |
| `desafios_usados` | Desafios anti-robô já usados (cada um vale uma vez) |
| `limites` | Contagem de pedidos por minuto, por código do IP (HMAC); limpa todo dia |
| `backups` | Cópia diária (últimos 7 dias), feita pela tarefa agendada `/api/backup` |

`conjunto` é `real` ou `teste`. Envios de fora do endereço oficial ou de uma sessão de teste vão pra `teste`.
Os dados da versão anterior, que ficavam no Netlify Blobs, foram importados pro Supabase na migração de outubro de 2026.

## Painel

Mostra participantes, conclusão, modos, confiança, ideologias, eixos, funil de abandono, qualidade das frases (alfa de
Cronbach), autoidentificação × resultado e a lista de frases. Exporta planilha (CSV) sem código de envio, IP ou data
exata. Grupos com menos de 5 pessoas aparecem como "<5" nos cruzamentos. Permite abrir uma sessão de teste (12 horas)
pra testar o site sem misturar com os dados reais.

## Segurança

- Cabeçalhos em `vercel.json`: política de conteúdo que só aceita scripts do próprio site, `X-Frame-Options`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e `Strict-Transport-Security`.
- Funções com limite de pedidos por minuto por visitante, contado com um código (HMAC) do endereço IP.
- Nenhum texto digitado por alguém é inserido como HTML.
- O painel não é indexado por buscadores e não é guardado em cache.
