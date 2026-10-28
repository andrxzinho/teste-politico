# Auditoria metodológica do teste político

Data: 23/10/2026. Escopo: `public/js/dados/frases.js`, `ideologias.js`, `candidatos.js`, `pensadores.js`, `public/js/nucleo/*`,
`public/js/telas/resultado.js`, `extras.js`, `janelas.js`, `candidatos.js`, `pensadores.js`, `perguntas.js`, `public/index.html`,
`public/metodologia.html`, `public/perguntas-frequentes/index.html`, `README.md`, `docs/METODOLOGIA.md`, `testes/`.

## Situação: versão 4 do cálculo (28 de outubro de 2026)

Aprovado pelo responsável pelo projeto. Simulação antes e depois em `docs/METODOLOGIA.md`, seção 10.

- **M6 (Instituições):** no Essencial, S1 (bancos e empresários) entrou no lugar de S2 (imprensa); no Padrão e no
  Aprofundado entraram Z21 (Lava Jato) e Z22 (Banco Central), duas desconfianças mais comuns na esquerda. O eixo não
  entra na escolha da ideologia.
- **M9 (ordem):** a ordem das frases dentro de cada bloco é sorteada por pessoa, com uma semente gravada no envio do
  estudo. Efeito colateral (B3): a maior sequência de respostas iguais, que desconta a consistência, passa a depender
  da ordem de cada pessoa.
- **M5 (desempate do Aprofundado):** em vez de um banco novo, o Aprofundado deixou de ter desempate. Numa simulação com
  504 respondentes, ele terminava "entre duas" em 2 a 5% dos casos e só tinha uma pergunta útil 2 vezes.
- **A5 (meio ambiente):** subtema próprio (`N.amb`), fora da média de Brasil × Mundo, com posição típica de cada
  ideologia; a soberania do Ecologista foi de −95 pra −70. Os eixos parecidos continuam (depende de dados).
- **Proposta 4 da seção 6.6 (calibração):** temperatura T = 1,5. Refeita com o cálculo da versão 3, a calibração já era
  boa com perfis errados em 20 pontos; o excesso de confiança aparece com 35 pontos. T = 1,5 é o meio-termo.
- **B4:** E22 (desconto do plano de saúde no IR) passou de "Estado e mercado" pra "Impostos".

## Situação: versão 2 do cálculo (23 de outubro de 2026)

O responsável pelo projeto autorizou as correções. Simulação antes e depois em `testes/ajuda/comparar_simulacao.mjs`;
resumo em `docs/METODOLOGIA.md`, seção 10.

**Aplicado:**

- **C2 (não diferenciação):** com 60% ou mais de meio-termo nas frases de concordância, ou concordando (ou discordando)
  de quase tudo, a confiança não passa de média; com 80% ou mais de meio-termo, ou média bruta de 1 ou mais, é baixa. Os
  quatro padrões uniformes da seção 6.3 agora saem com confiança baixa nos três modos.
- **A1 e A7 (eixo Democracia e nome "radical"):** a Extrema esquerda e a Extrema direita (antes "radical") só disputam com
  concordância média de pelo menos 0,35 nas frases de ruptura do próprio lado ou sem lado. Os casos da seção 6.4 com
  meio-termo em D deixaram de virar "radical" (Esquerda → Social-democrata; Conservador-nacional → Conservador). As
  páginas antigas redirecionam pros endereços novos.
- **A2 (simetria):** os pares agora têm o mesmo texto com o lado trocado (Z1 × Z2, A25 × A26). D20/D21 foram reescritas
  (item 3 da seção 8) e Y1/Y2 saíram dos modos.
- **A3 (pares):** C17 × C18 no lugar de C17 × Y3; N1 × N18 e D0 × D17 saíram.
- **A6 e reescritas da seção 8:** itens 1 a 17, 19 a 21, 24 e 25 viraram frases novas (Z1 a Z20, no fim de `DATA.EXTRA`),
  e as antigas saíram dos modos (`lv` 9). S9 perdeu o "porque estão podres" (o sentido não muda). A27 (epidemia) saiu da
  média do eixo e aparece entre os temas fora dos eixos (item 18). C20 saiu dos modos (item 16).
- **M2 (marcadores):** D1 sem marcador; D3 com comunismo e fascismo; D2 com comunismo e anarquismo.
- **M3:** "Nenhuma chega perto" e "Nenhuma das duas" contam como resposta, não como falta de opinião.
- **M10:** metade ou mais sem opinião dá confiança baixa (`<=`).
- **Textos da seção 7.3:** probabilidade × semelhança, índice dos extremos, compatibilidade sem "%", faixa sem "80% de
  chance", FAQ "O teste é confiável?" e o aviso de não diferenciação.

**Testado e não adotado:** baixar o limite do desempate (M4) de 20 pra 15. O acerto simulado caiu no Essencial (94,2% →
93,1%) e quase não mudou nos outros modos.

**Não aplicado (precisa de dados reais ou de mudar a quantidade de perguntas):** A4 (circularidade das simulações), A5
(eixos parecidos e meio ambiente dentro de Brasil × Mundo), M1 (subtemas do Essencial com uma frase só: o responsável
decidiu manter as quantidades), M5 (banco de desempate do Aprofundado), M6 (equilíbrio do eixo Instituições), M9 (ordem
das frases por pessoa), B3 e B4, e as propostas 2 a 4 da seção 6.6. Ficam em `docs/PENDENCIAS.md`.

O texto abaixo é a auditoria original, mantida como registro.

**Como os números foram obtidos.** Todo número abaixo vem de leitura direta do código/dados ou de script executado. Os
scripts rodaram em Node 22, com o núcleo do site carregado num `vm` (o mesmo jeito do novo `testes/perfis.test.mjs`). O
recálculo manual (seção 6) usa uma reimplementação independente escrita a partir do texto do código, carregando só os
dados (`frases.js`, `ideologias.js`), sem chamar `Motor.calcular` nem `compute`. Os scripts de apoio ficaram fora do
repositório, na pasta temporária da sessão.

**O que não foi alterado.** Nenhuma frase, peso, eixo, ideologia ou cálculo. A varredura ortográfica/gramatical das 225
frases (textos, explicações, argumentos e opções) não encontrou erro puramente ortográfico que justificasse correção;
portanto **nenhuma correção foi aplicada**. Tudo o que está abaixo é proposta.

---

## 1. Sumário executivo

O cálculo faz o que a documentação diz (os três recálculos independentes batem com a implementação até a 14ª casa
decimal), e o teste tem cuidados acima da média: escolhas forçadas pra corrigir estilo, pares de consistência, simetria
partidária, filtro dos extremos, avisos de limite nas simulações. Os problemas sérios não estão na aritmética. Estão em
**o que a aritmética mede, como o resultado é rotulado e quanto ele promete**:

1. **[Crítico] A probabilidade do modelo é mostrada como se fosse proximidade.** No resumo, o bloco "Ideologias mais
   próximas" mostra `Centrista 98%`. Esse número é a probabilidade posterior do modelo, não semelhança. Na sanfona, o mesmo
   número vem descrito como "Semelhança entre as suas posições nos eixos e a posição típica de cada ideologia". Em 73 de
   200 perfis aleatórios (modo Padrão), a ideologia com maior probabilidade não é a mais parecida pela métrica de
   semelhança que a mesma página usa em "Mais distante de você" e em "Você disse que se identifica como...". Num deles, a
   página mostra "Esquerda radical 97%" e a semelhança com Esquerda radical é 33% ("Baixa").
2. **[Crítico] Quem responde tudo no meio sai "Centrista" com 99 a 100% e confiança alta, nos três modos.** Quem discorda
   de tudo recebe confiança alta no Essencial (consistência 85). Quem concorda com tudo recebe "Centrista 98%" com
   confiança média no Essencial. O rótulo Centrista funciona como ralo pra falta de opinião e pra respostas automáticas.
3. **[Alto] Ficar no meio-termo nas frases de democracia vira "Esquerda radical 97%" ou "Direita radical 67–79%", com
   confiança alta.** Isso vale pra quem já está perto dessas ideologias nos outros eixos, e a descrição diz que a pessoa
   "aceita caminhos fora das regras democráticas". Todas as tradições democráticas ficam em D = −65 e as "radicais" em
   +35/+45, então o ponto de corte fica perto de −15. Além disso, na ciência política "radical" não é sinônimo de
   antidemocrático.
4. **[Alto] Os pares de simetria partidária não são simétricos.** D20 (presidente de esquerda) e Y1 (de direita) têm
   textos diferentes ("aceitável" × "legítimo", premissas diferentes), assim como A25 e Y2. As versões espelhadas exatas
   (D21, A26) existem, mas estão no nível 9 e nunca aparecem. O resultado atribui ao viés partidário uma diferença que
   pode vir só da redação.
5. **[Alto] Pares de consistência acusam contradição em posições coerentes.** C17 × Y3 está marcado como "espelho", mas
   quem é contra qualquer cota discorda das duas frases sem se contradizer. N1 × N18 está marcado como "contra", mas dá
   pra acolher imigrantes e achar que imigração em massa pressiona a cultura. A metodologia ainda cita o par C17 × C18,
   que não está mais em uso.
6. **[Alto] As simulações são circulares e a probabilidade é mal calibrada fora delas.** Os respondentes simulados são
   gerados a partir dos mesmos perfis usados pra classificar. Num experimento em que só os perfis "verdadeiros" dos
   simulados foram perturbados (desvio de 20 pontos por subtema, cálculo intacto), o acerto no Essencial caiu de 91% pra
   78%, e a probabilidade média da 1ª ideologia continuou em 86%. Os números de acerto publicados diferem em quatro
   lugares.
7. **[Alto] Os eixos A, C e N medem quase a mesma coisa no próprio modelo.** Nas posições típicas das 17 ideologias não
   extremas, as correlações entre eles ficam entre 0,82 e 0,84. O eixo A mistura temas em que a esquerda brasileira pende
   pra "ordem" (fechamento na epidemia, remoção de desinformação, crime de ódio) com temas em que pende pra "liberdade"
   (drogas, polícia). O meio ambiente entra em Brasil × Mundo, então ser ecologista exige ser "global".
8. **[Médio-alto] O Essencial tem subtemas de uma frase só, e várias frases dentro do mesmo subtema puxam pro mesmo lado.**
   E.est e E.trab têm uma frase de concordância cada, e cada uma vale 1/3 do eixo econômico. C.rel tem 0 frases à
   esquerda e 2 à direita. D.reg tem 4 × 0 e D.rup tem 0 × 5. Quem concorda com tudo e pula as escolhas fica em E = +25
   e C.rel = +50. O equilíbrio anunciado vale pro eixo, não pro subtema, e o cálculo tira a média por subtema.
9. **[Médio] Algumas frases marcadoras de extremos estão atribuídas a um extremo só ou ao errado.** D1 (intervenção
   militar) conta como fascismo. D3 (partido único) conta só como comunismo. D2 (revolução violenta) conta só como
   anarquismo. No Aprofundado, quem marca "concordo totalmente" em tudo recebe o destaque "Afinidade forte com comunismo:
   50%", só por causa de duas frases do eixo Democracia.
10. **[Médio] Os números do site não batem entre si.** O site diz "65/135/210 perguntas", mas o código dá 62–70, 128–139
    e 205–216, sem contar o desempate. A FAQ diz que os 6 eixos têm subtemas, e Instituições não tem nenhum. O reteste do
    Essencial aparece como 92, 93 e 94,8. O Aprofundado é chamado de "o mais preciso", mas as próprias simulações dão
    97,6% contra 97,8% do Padrão. O desempate "de 5 a 6 perguntas" faz no máximo 4 no Aprofundado e nunca acontece entre
    os dois pares mais confundidos.

---

## 2. Problemas classificados

Legenda: **C** crítico, **A** alto, **M** médio, **B** baixo. "Evidência" aponta o arquivo ou o resultado de execução.

### 2.1 Críticos

| # | Problema | Evidência | Proposta |
|---|---|---|---|
| C1 | Probabilidade posterior exibida como "%" sob "Ideologias mais próximas" e descrita como "Semelhança" | `extras.js` `montarResumo` (`p=Math.round(o.prob*100)`, título "Ideologias mais próximas"); `index.html` linha 194 ("Semelhança entre as suas posições..."), com barras de `o.match` = probabilidade | Seção 7 |
| C2 | Responder tudo no meio dá "Centrista" com 99–100% e confiança alta; discordar de tudo dá confiança alta no Essencial | Seção 6.3 e `perfis.test.mjs` (propriedades pendentes) | Regra de não diferenciação (seção 6.6) e texto específico pro Centrista |

### 2.2 Altos

| # | Problema | Evidência | Proposta |
|---|---|---|---|
| A1 | Meio-termo no eixo D vira "radical" com confiança alta | Seção 6.4: esquerda com D=0 → Esquerda radical 97,0% (Essencial) e 97,6% (Padrão); conservador-nacional com D=0 → Direita radical 67,2% e 79,2% | Pôr as tradições democráticas em D ≈ −40 (ou estimar com dados), separar "radical" de "extrema", só aplicar o rótulo antidemocrático com concordância explícita com ruptura (como no GATE dos extremos) |
| A2 | Pares de simetria com redação diferente (D20/Y1, A25/Y2); espelhos exatos D21/A26 no nível 9 | `frases.js`; `PAIRS` | Usar D20/D21 e A25/A26 como pares, sorteando qual aparece primeiro |
| A3 | Pares de consistência que não são opostos lógicos: C17×Y3 ("espelho"), N1×N18 ("contra") | `PAIRS`; seção 3 | C17×C18 como espelho; tirar N1×N18 dos pares "contra" (N19×N20 já cobre imigração) |
| A4 | Simulação circular; probabilidade mal calibrada se os perfis estiverem errados; números de acerto diferentes em 4 lugares | Seção 6.7, seção 9 | Seção 7.3 (textos) e 10 (limitações) |
| A5 | A, C e N quase colineares no modelo; vazamento partidário no eixo A; meio ambiente dentro de N | Seção 5 | Subtema/eixo próprio pra meio ambiente; separar "punitivismo" de "regulação de discurso"; análise fatorial com os dados |
| A6 | N22 (liderar a integração sul-americana) pontuado como "global", quando é agenda nacional-desenvolvimentista | `frases.js` N22 d=−1 | Reescrever (seção 8) ou tirar do eixo N |
| A7 | Descrições de Esquerda radical e Direita radical dizem que a pessoa "aceita caminhos fora das regras democráticas" | `ideologias.js` | Renomear pra "extrema-esquerda/extrema-direita não democrática" ou reescrever as descrições |

### 2.3 Médios

| # | Problema | Evidência | Proposta |
|---|---|---|---|
| M1 | Subtemas com 1 frase e frases de um lado só dentro do subtema (Essencial) | Seção 4 | Pelo menos 2 frases por subtema, uma pra cada lado |
| M2 | Marcadores de extremos mal atribuídos (D1→fas, D3→só com, D2→só anq) | `frases.js` | D1 sem marcador (ou marcador de "autoritarismo militar"); D3 com com+fas; D2 com com+anq |
| M3 | "Nenhuma das duas" (contraste) e "Nenhuma chega perto" (escolha) contam como "não tenho opinião" | `calculo.js` (`noop++` pra qualquer valor não numérico) | Contar à parte; não descontar consistência nem confiança |
| M4 | O desempate nunca acontece entre os pares mais confundidos (Conservador × Democracia cristã: diferença ponderada máxima 16,5; Conservador × Direita nacional-conservadora: 18,0; o limite é 20) | `tbUseful` em `perguntas.js` | Usar a distância por subtema (PERFIS) ou baixar o limite |
| M5 | Desempate no Aprofundado: só há candidatos pros eixos E (P0, P2) e D (P12, P14) | `pickTb`; os itens de nível 9 do `Q` nunca entram, porque `Q[k]` não tem o campo `k` | Banco de desempate próprio pro Aprofundado |
| M6 | Eixo Instituições (S) mede sobretudo desconfiança de instituições que a direita critica (S0, S2, S4, S5) contra uma de esquerda (S1) | `frases.js` | Equilibrar: Banco Central, agronegócio/Congresso, Lava Jato, mídia alternativa |
| M7 | Termômetro dos extremos e compatibilidade mostrados em "%" (índices, não probabilidades) | `resultado.js` `renderExtremos`; `extras.js` ("Compatibilidade alta (72%)"); `pensadores.js` ("Alta (72%)") | Seção 7 |
| M8 | Explicações neutras (`e`) que tomam partido: D20/Y1 ("desequilibra os poderes", "concentra poder"); X35 (argumento progressista como "os dados mostram", conservador como opinião) | `frases.js` | Seção 8 |
| M9 | Ordem das frases igual pra todo mundo (semente fixa 20261101/20261104) | `estado.js` `order` | Embaralhar por pessoa dentro do bloco; gravar a ordem |
| M10 | A metodologia diz "pular metade ou mais dá confiança baixa", mas o código usa `respondeu < 0,5` (exatamente metade dá média) | `calculo.js`; `perfis.test.mjs` (pendente) | Alinhar texto ou código (`<=`) |
| M11 | Item A23 (armas) aparece no resultado como "1: Comprar uma arma..." porque `solo` vale `1` e `resultado.js` imprime `${o.solo}: ${o.t}` | `frases.js` A23; `resultado.js` linha 156 | `solo:"Armas"` (proposta: mexe em dado, não foi aplicada) |
| M12 | Frases de dois assuntos (double-barreled) e com efeito de enquadramento | Seção 3 | Seção 8 |

### 2.4 Baixos

| # | Problema | Evidência |
|---|---|---|
| B1 | Itens mortos: E28, A26, C18, D21 e D23 (nível 9, nunca mostrados); P0, P2, P12 e P14 só no desempate | `order`, `pickTb` |
| B2 | `docs/METODOLOGIA.md` cita `public/motor.js`; o arquivo está em `public/js/nucleo/motor.js` | leitura |
| B3 | A consistência depende da ordem das frases: as frases de simetria vão pro fim por sorteio (`Math.random`), e isso muda a maior sequência de respostas iguais. Em 300 vetores com 85% de meio-termo, 1 mudou de nota | script |
| B4 | E22 (dedução de plano de saúde no IR) está em E.est; o tema é imposto (E.imp) | `frases.js` |
| B5 | "A faixa mostra onde você deve estar com 80% de chance" (`metodologia.html`): a faixa é ±1,28 × um erro padrão heurístico (piso de 35, erro de estilo de 30% da média), nunca calibrado | `motor.js` |

---

## 3. Perguntas e alternativas, uma a uma

Lidas as 225 frases (106 de concordância e 6 dilemas no `Q`, 15 no `POOL`, 4 + 12 escolhas forçadas, 24 contrastes e 58
de concordância no `EXTRA`). As frases sem problema identificado não aparecem na tabela. Categorias: **DB** = dois
assuntos na mesma frase; **DS** = desejabilidade social/efeito teto; **VZ** = vazamento pra outro eixo; **AMB** =
ambiguidade; **ENQ** = enquadramento/carga emocional; **DIR** = direção discutível; **PAR** = leitura partidária no
contexto brasileiro.

### Economia (E)

| id | Problema | Sev. |
|---|---|---|
| E30 | ENQ/PAR: "como foi feito com a Eletrobras" amarra a resposta à avaliação do governo que privatizou | M |
| E6 | DB: junta um juízo ("regras demais") com uma tese causal ("atrapalham a criação de empregos") | M |
| E10 | DS: dividir terras improdutivas já está na Constituição (a própria explicação diz isso); concordar é endossar o status quo, e a frase separa pouco | M |
| E19 / E29 | ENQ assimétrico: E19 dá moldura positiva ao status quo ("deixando empresas e trabalhadores negociarem"); o "custo" de E29 ("contratar mais gente") é lido como benefício | M |
| Y4 | DB/ENQ: traz a justificativa embutida ("essencial demais pra depender de lucro"); E27, o par, traz só garantias ("contrato e metas fiscalizadas") | M |
| E2 | AMB: "bem acima" sem número | B |
| E16 | DB: conclusão + razão ("porque o governo tira à força"); quem aceita a conclusão sem a razão fica sem resposta | B |
| E22 | Subtema trocado (é imposto) | B |
| E23 | Premissa factual + proposta na mesma frase (o custo explícito é bom) | B |
| E25 | O custo ("juros mais altos") é apresentado como certo; a relação é discutida na literatura | B |

### Liberdade × Ordem (A)

| id | Problema | Sev. |
|---|---|---|
| A25 / Y2 | Par de simetria com redação diferente ("movimento de esquerda" × "apoiadores de um político de direita"; "em vez de desbloquear à força" × "mesmo que a liberação demore mais"). Apoiadores de político lembram os bloqueios pós-eleição de 2022 | A |
| A27 | VZ/PAR: depois da covid, fechar comércio na epidemia é posição da esquerda; conta como "ordem" e puxa a esquerda pro centro do eixo | M |
| A22 | PAR: remover desinformação sem ordem judicial é bandeira da esquerda (STF, PL das Fake News); conta como "ordem" | M |
| A20 / A21 | PAR: liberdade pra falas ofensivas virou bandeira da direita, e crime de ódio a da esquerda. O par mede bem a tensão, mas cada frase sozinha mistura posição partidária com o eixo | M |
| A10 | Juízo empírico ("são boas pra segurança"), não proposta | M |
| A12 | Item clássico de autoritarismo (criação dos filhos); mede traço de personalidade e vaza pra Costumes | M |
| A23 | `solo:1` vira "1:" no resultado (M11) | M |
| A1 | DS: "nunca... sem ordem de um juiz" descreve a lei atual; efeito teto provável | B |
| A24 | DS em geral, mas no Brasil ("direitos humanos pra humanos direitos") separa bem; manter | B |

### Costumes (C)

| id | Problema | Sev. |
|---|---|---|
| Y3 | Usada como "espelho" de C17, mas não é a negação dela (A3) | A |
| C20 | VZ: demitir por comentário envolve liberdade de expressão (A) e a liberdade do empregador (E). Um libertário pode concordar ("a empresa pode demitir") e ser contado como progressista | M |
| C24 | VZ: meta obrigatória de mulheres na chefia é também regulação de empresa; liberais progressistas tendem a discordar por motivo econômico | M |
| C21 | VZ: o marco temporal é conflito fundiário (agro, E/N) mais do que diversidade | M |
| C11 | AMB: "papéis naturais" pode ser lido como diferença biológica ou como divisão prescrita de tarefas | M |
| C15 | DB e espantalho: "ultrapassada" + "deveria deixar de ser o modelo"; quase ninguém concorda, então separa pouco | M |
| C16 | Longa e com condicional e negação ("continuar podendo ser punida"); carga de leitura alta | M |
| C14 | Concordância quase nula esperada, então informa pouco; pontuada em C.fam, pesa muito em quem concorda | B |
| C22 | Subtema div, mas o tema é família/educação sexual | B |

### Brasil × Mundo (N)

| id | Problema | Sev. |
|---|---|---|
| N22 | DIR: integração sul-americana liderada pelo Brasil, com financiamento a vizinhos, é agenda nacional-desenvolvimentista (e lembra os empréstimos do BNDES). Pontuar "concordo" como global coloca desenvolvimentistas no lado errado | A |
| N1 | DS/AMB: "bem recebidos" é vago e desejável; "imigrantes e refugiados" são dois públicos | M |
| N1 × N18 | Marcado como "contra", mas os dois são compatíveis (A3) | A |
| N4 | VZ: gasto militar puxa pro eixo A (ordem) | M |
| N14, N16, N17, K10, K11, X41, X43 | VZ: meio ambiente dentro de "soberania"; ecologista e "global" viram a mesma coisa (seção 5) | M |
| N13 | DS: "negociar em vez de retaliar" é a opção desejável | B |
| N17 | Leitura regional (Amazonas e Rondônia apoiam a BR-319 de forma suprapartidária) | B |

### Democracia (D)

| id | Problema | Sev. |
|---|---|---|
| D20 / Y1 | Par de simetria com redação diferente (A2). Além disso, governar por medida provisória é constitucional; concordar não é, por si, aceitar ruptura | A |
| D15 | Confunde legalismo com compromisso democrático: quem defende desobediência civil (ocupações) cai pro lado "menos democrático" | M |
| D19 | PAR: a inelegibilidade de Bolsonaro (2023) é o caso mais lembrado; mede obediência a decisão judicial, que não é a mesma coisa que compromisso com a democracia | M |
| D17 | ENQ: "Rapidez ou democracia?" já opõe os dois; opção desejável óbvia | M |
| D1 | Marcador `fas`: golpe militar não é fascismo (ditadura de 1964 ≠ fascismo) | M |
| D3 | Marcador só `com`: partido único também é fascista | M |
| D2 | Marcador só `anq`: revolução violenta é central no marxismo-leninismo | M |
| D0, D10, D12, D14 | DS/efeito teto; com D.reg 4 × 0 no Essencial, quem concorda com tudo ganha −50 nesse subtema | B |

### Instituições (S)

| id | Problema | Sev. |
|---|---|---|
| S0, S2, S4, S5 | PAR: desconfiança de STF, imprensa, pesquisas e urnas é sobretudo da direita pós-2022; só S1 é desconfiança típica da esquerda. O eixo é apresentado como transversal, mas a composição é assimétrica | M |
| S9 | ENQ: "porque estão podres" | M |
| S10 | DS: concordância quase consensual; separa pouco | B |

### Escolhas forçadas (L)

| id | Problema | Sev. |
|---|---|---|
| L0 | Sem opção de centro (já documentado); o meio vale −20 | M |
| L1 | −40 junta controle da polícia e vigilância; −75 junta poder da polícia e drogas | M |
| L2 | −75 junta "escolha de cada um" (liberal) com "o Estado deveria promover ativamente" (intervencionista) | M |
| L3 | −35 junta comércio, imigração e acordos | M |
| L10 | A opção do meio ("o governo não deveria promover nenhum modelo") é uma posição liberal, não intermediária | M |
| L12 | A opção do meio ("políticas iguais pra todos") é, na prática, contra cotas; 0 e +75 ficam próximos em conteúdo | M |
| L5, L6, L2 | O meio é "depende de cada caso", que mistura posição moderada com falta de posição | B |

### Contrastes (K)

| id | Problema | Sev. |
|---|---|---|
| K6 | As duas frases não estão na mesma dimensão; a b ("defender os direitos das minorias é parte essencial...") é um valor que quase todos aceitam | M |
| K2 | A b junta família, igreja e trabalho (C + E) | M |
| K16 | Conceito econômico (Estado mínimo × ancap) colocado em A.pol | M |
| K21 | A b junta famílias (esfera privada) e escolas (política pública) | M |
| K15 | Coordenadas pouco intuitivas (direitos individuais em +40); só o ponto médio (65) importa, mas dificulta revisar | B |
| K4 | A a ("proibidas, sem prender quem só usa") já é o status quo (Lei 11.343/2006 e STF, 2024, pra maconha) | B |

### Itens do Aprofundado (X)

X2 e X32 são extremos e pontuam como itens comuns (sem marcador). X35 tem a assimetria de argumentos citada em M8. X44
(armas nucleares) vaza pra militarismo. X50 tem leitura partidária (urnas, 2022). Os demais não apresentaram problema
além dos gerais.

### Argumentos `c` e `dd`

O tamanho médio dos argumentos pra cada polo é equilibrado: 95 contra 93 caracteres no geral; E 101/105, A 97/92,
C 93/85, N 90/92, D 94/90, S 98/85. Todas as frases de concordância e dilema têm `e`, `c` e `dd`. A assimetria está no
tipo de argumento, não no tamanho: X35 (dados × opinião), E6 ("conquistados com muita luta") e N1 ("de braços abertos",
na explicação).

### Frases quase repetidas (Jaccard ≥ 0,3 entre palavras)

A25/A26 e D20/D21 (0,87; espelhos não usados), C17/C18 (0,57), E27/E28 (0,42), N19/N20 (0,40), C18/X36 (0,38), C0/C14,
P1/X12 (0,33), D21/Y1 (0,32), E19/E29, A4/X16 (0,30). Entre as que aparecem juntas no mesmo modo, P1/X12 (gestão privada
de escolas/hospitais × escolas/universidades) e A4/X16 (pena de morte × prisão perpétua) são redundantes no Aprofundado.

---

## 4. Distribuição entre os polos

Só frases que entram na média (`sc`: concordância e dilema, sem marcadores de extremos fora do eixo D). Contado em
`order(modo)`. Polo − = esquerda/liberdade/progressista/global/mais democrático/confia; polo + = o oposto.

| Eixo | Essencial − / + | Padrão − / + | Aprofundado − / + |
|---|---|---|---|
| E | 3 / 3 | 9 / 10 | 16 / 15 |
| A | 3 / 3 | 10 / 9 | 17 / 17 |
| C | 4 / 5 | 8 / 9 | 15 / 17 |
| N | 3 / 4 | 7 / 8 | 15 / 15 |
| D | 6 / 6 | 10 / 11 | 12 / 15 |
| S | 2 / 2 | 5 / 5 | 5 / 5 |

**Por subtema no Essencial** (−/+): E.imp 3/1, E.est 0/1, E.trab 0/1; A.pol 1/2, A.lib 2/0, A.vig 0/1; C.rel 0/2,
C.fam 2/2, C.div 2/1; N.com 1/1, N.cul 1/1, N.sob 1/2; D.reg 4/0, D.opo 2/1, D.rup 0/5.

**Por subtema no Padrão:** E.trab 3/2, E.imp 3/3, E.est 3/5; A.pol 3/4, A.lib 6/2, A.vig 1/3; C.fam 4/3, C.rel 0/3,
C.div 4/3; N.com 2/1, N.sob 3/4, N.cul 2/3; D.opo 3/1, D.reg 6/1, D.rup 1/9.

**Leitura.** No eixo, a regra "número parecido pra cada lado" é cumprida (diferença máxima de 3, no D do Aprofundado).
Só que a posição é a **média dos subtemas**, e dentro deles há desequilíbrio forte (C.rel 0/3 no Padrão; A.lib 6/2;
D.rup 1/9). A concordância automática não se cancela no subtema. Medido: quem concorda com tudo e pula as escolhas fica,
no Essencial, em E = +25 (E.est e E.trab = +50 cada), C.rel = +50 e A.vig = +50. No Padrão, C.rel = +50. Os subtemas
aparecem na tela ("Eixos e subtemas") e entram na classificação.

Frases dos extremos (fora da média, só como marcadoras): 8 no Essencial, 11 no Padrão e no Aprofundado. Comunismo e
anarquismo têm marcadores no E; anarcocapitalismo, no E e no A; fascismo, só N11 fora do eixo D. Quem chega a
fascismo depende sobretudo de D1, D7 e D16, que estão no eixo Democracia e aparecem pra todo mundo.

---

## 5. Eixos

| Eixo | Polos (código) | Mede o que diz? | Vazamentos principais |
|---|---|---|---|
| E Economia | Esquerda / Direita (`AX`); "Mais Estado / Mais mercado" (`METODOLOGIA.md`) | Em geral sim; bom equilíbrio de temas (fiscal, trabalho, estatais) | E11 (voucher) com Educação; C21 e E10 com a terra |
| A Liberdade × Ordem | Mais liberdade / Mais ordem | Parcialmente: mistura punitivismo (direita = ordem), regulação de discurso e saúde pública (esquerda = ordem) e drogas | A27, A22, A21, X24 (esquerda → ordem); A20 (direita → liberdade); A12 (personalidade) |
| C Costumes | Progressista / Conservador | Sim, com itens fortes (aborto, casamento, trans, cotas) | C20 (A/E), C24 (E), C21 (E/N) |
| N Brasil × Mundo | Global / Nacionalista | Mistura 4 coisas: comércio, organismos internacionais, imigração/identidade e **meio ambiente** | Meio ambiente (7 itens + 2 contrastes + L14); N4 e X44 (militarismo) |
| D Democracia | Mais / Menos compromisso democrático | Parcialmente: frases de ruptura e de efeito teto, mais legalismo (D15) e obediência à Justiça (D19) | D15, D19, D20/Y1 (medida provisória é constitucional) |
| S Instituições | Confia / Anti-sistema | Mede sobretudo desconfiança de direita pós-2022 | S0, S2, S4, S5 |

**Correlações estruturais (posições típicas `IDEO.p`).** Sem extremos (n = 17): r(A,C) = 0,83; r(A,N) = 0,82;
r(C,N) = 0,84; r(E,C) = 0,37; r(E,A) = −0,08. Com as 21: 0,71, 0,82 e 0,83. Nos perfis por subtema: r(A.pol, A.lib) =
0,93; r(A.lib, A.vig) = 0,90; r(N.sob, N.cul) = 0,86. **O espaço de ideologias do próprio modelo é, na prática,
bidimensional:** economia mais um fator "GAL-TAN" que junta A, C e N. Consequência: na classificação, a mesma informação
entra três vezes (A, C e N com o mesmo sinal), e a probabilidade fica concentrada demais (seção 6.7). Ter seis eixos
na tela sugere seis dimensões independentes, e o modelo não sustenta isso.

**Quantos eixos de fato pesam.** São 6 na tela. A classificação usa 15 subtemas de **5** eixos (S fica fora). Os
candidatos usam **4** (E, A, C, N). Pensadores, "comparar com ideologia" e "mais distante" usam **5** (E, A, C, N, D). O
tema Armas (A23) fica fora de tudo. Só a página de metodologia explica essa diferença.

**Limitações do modelo de eixos.**
- O eixo D não distingue entre as 16 tradições democráticas (todas em −65). A informação dele só serve pra separar
  "radicais" e extremos, e por isso cria o efeito A1.
- Os subtemas pesam igual no eixo, sem importar quantas frases têm: no Essencial, a Petrobras (E30) sozinha decide 1/3 da
  economia antes das âncoras.
- O sinal das frases (`d`) é atribuído pelo autor. Não há estimativa empírica de carga nem de localização (o próprio
  `METODOLOGIA.md` lista IRT como próximo passo).

---

## 6. Algoritmo

### 6.1 Como funciona (verificado no código)

1. Resposta v ∈ {−2…2} vira x = v · d · 50. "Não tenho opinião" (`"x"`) e frase não liberada (`"g"`) ficam fora; "meio-termo"
   (0) entra como posição 0.
2. Em cada subtema: média m, erro = max(35, desvio) / √n; peso por frase vindo do servidor (1 por padrão).
3. Âncoras: escolhas forçadas, com erro 32 (subtema) ou 42 (eixo inteiro, aplicada a cada subtema do eixo).
4. Fator de estilo γ: inclinação "âncora ≈ γ × média", limitada a [0,8; 1,3] (ou [0,6; 1,6] com 8+ âncoras) e encolhida:
   γ = 1 + den/(den + 5000) · (γ₀ − 1), só com nA ≥ 3 e den ≥ 1200.
5. Subtema: média ponderada pela precisão de clamp(m·γ) (erro √((erro·γ)² + (0,3·m·γ)²)) e das âncoras.
6. Eixo: média simples dos subtemas; erro = √Σerro² / n; faixa = ±max(6; 1,28·erro).
7. Classificação: pra cada ideologia, logL = −Σ (v − μ)² / (2(erro² + 25²)) nos 15 subtemas, com
   μ = p_eixo + 0,5·(perfil − p_eixo); mais os contrastes (logística, inclinação 1,5; "as duas" = −z²/2); mais os
   marcadores (média esperada +1,5 pro próprio extremo, −1,5 pros outros; σ = 0,8).
8. Filtro: ideologias com `g` só disputam se ext[g] ≥ 50, com ext = 100 · min(1, média⁺/1,5) · (0,35 + 0,65 · encaixe).
9. Probabilidade = softmax entre as que disputam (prior uniforme implícito). Ordem: probabilidade e, no empate,
   distância ao "centro democrático". "Entre duas" quando P2 ≥ 0,6 · P1.
10. Consistência = 100 − 12·contradições − 8·(pares fracos, se ≥ 3) − 4·tensões − 15·(sequência ≥ 12) − 20·(mediana
    < 1,8 s) − 10·(sem opinião > 25%). Confiança: alta se P1 ≥ 0,6, consistência ≥ 70 e precisão não baixa; média se
    P1 ≥ 0,35 e consistência ≥ 50; rebaixada por "não tenho opinião".

### 6.2 Recálculo independente (3 casos)

Respostas geradas de forma determinística (concordância = arredonda(ganho · 2 · alvo/100 · d)) e passadas às duas
implementações.

| Caso | Modo, respondidas | Implementação | Recálculo | Diferença máx. |
|---|---|---|---|---|
| 1. Centro-esquerda, só concordância (escolhas e contrastes em branco) | Essencial, 47 | s = {E −50, A 0, C −50, N 0, D −50, S 0}; γ = 1; Social-democrata 53,76%, Socialista democrático 43,05%, Centrista 1,41% | idem | eixo 0; prob. 1,4·10⁻¹⁹ |
| 2. Liberal-conservador, estilo suave (ganho 0,6), com escolhas e contrastes | Padrão, 131 | s = {E 38, A 0, C 8, N 0, D −40, S 0}; γ = 0,8; Liberal clássico 65,33%, Liberal-conservador 27,79%, Centrista 6,68% | idem | erro padrão 8,9·10⁻¹⁶; prob. 0 |
| 3. Comunista que concorda totalmente com as frases do comunismo | Aprofundado, 209 | s = {E −83, A 41, C −4, N 0, D 42, S 42}; γ = 0,8364; Comunista 100%; ext = {com 89, anq 33, fas 40} | idem | eixo 1,4·10⁻¹⁴; prob. 1,6·10⁻³⁴ |

Nos três casos batem: ordem completa do ranking, posições arredondadas, faixas, ext e número de ideologias que
disputam (16, 16 e 17).

**Conta à mão (caso 1, eixo E).** E.imp: 4 frases, todas x = −50 → desvio 0 → piso 35 → 35/√4 = 17,5; erro de estilo
0,3 × 50 = 15; erro = √(17,5² + 15²) = 23,05. E.est e E.trab: 1 frase cada → √(35² + 15²) = 38,08. Eixo = −50;
erro = √(23,05² + 38,08² + 38,08²)/3 = 19,53; faixa ±1,28 × 19,53 = ±25 → [−75, −25]. Igual ao código.

**Duas observações do caso 3.** (a) Um comunista simulado recebe "Fascismo 40%" no termômetro, porque concorda com
frases do eixo D marcadas como fascistas (D1, D7, D16). O gerador é simples, mas o efeito aponta pro problema M2.
(b) A = +41 e o anarquismo fica em 33%.

### 6.3 Respostas uniformes (executado)

Escolhas e contrastes na opção do meio.

| Padrão de resposta | Essencial | Padrão | Aprofundado |
|---|---|---|---|
| Tudo "Concordo" | Centrista 98,4%; conf. média; consistência 61 | Centrista 99,4%; baixa; 5 | Centrista 100%; baixa; 5 |
| Tudo "Concordo totalmente" | Centrista 93,0%; baixa; 49 | Centrista 98,7%; baixa; 0 | Centrista 100%; baixa; 0; **ext.com = 50 → "Afinidade forte com comunismo: 50%"** |
| Tudo "Discordo" | Centrista 99,1%; **alta**; 85 | Centrista 99,6%; média; 61 | Centrista 100%; média; 61 |
| Tudo "Meio-termo" | Centrista 99,1%; **alta**; 85 | Centrista 99,6%; **alta**; 85 | Centrista 100%; **alta**; 85 |
| Tudo "Não tenho opinião" | 16 empatadas a 6,3%; "respostas insuficientes" | idem | idem |

Os avisos de estilo ("mesma resposta em muitas frases seguidas") aparecem em todos os casos uniformes. Mas o rótulo
continua "Centrista 99%" com chip de confiança alta.

### 6.4 Sensibilidade ao eixo Democracia (executado)

Mesmo perfil nos outros eixos; só muda a resposta às frases de democracia.

| Perfil (E, A, C, N) | Respostas no eixo D | Essencial | Padrão |
|---|---|---|---|
| Conservador-nacional (30, 50, 65, 60) | "Concordo"/"Discordo" democráticos (D ≈ −44 a −49) | Dir. nac.-conservadora 85,9% | 91,7% |
| | "Meio-termo" em tudo (D = 0) | **Direita radical 67,2%**, alta | **79,2%**, alta |
| Esquerda (−60, −10, −50, −20) | democráticos (D ≈ −43 a −47) | Socialista democrático 58,0% | Social-democrata 60,8% |
| | "Meio-termo" (D = 0) | **Esquerda radical 97,0%**, alta | **97,6%**, alta |
| Centro, liberal progressista, liberal-conservador, conservador | "Meio-termo" (D = 0) | rótulo inalterado | inalterado |

A punição pelo meio-termo democrático só atinge quem tem vizinho "radical": esquerda de costumes progressistas e direita
nacional-conservadora. Liberais e centristas no mesmo D ficam onde estavam. Dois perfis com a mesma ambivalência
democrática são tratados de forma diferente.

### 6.5 Outros pontos do algoritmo

- **Determinismo.** Posição e probabilidades são determinísticas (300 vetores aleatórios, duas sementes: 0 diferenças). A
  consistência depende da ordem (B3).
- **Desempate.** `two` usa a razão P2/P1 ≥ 0,6. O desempate em si (M4, M5): nunca dispara pra Conservador × Democracia
  cristã nem pra Conservador × Dir. nacional-conservadora. No Aprofundado, só tem frases de E e D.
- **Prior.** Uniforme entre as que disputam. Não há base de frequência; o Centrista, sozinho na origem, absorve todo
  perfil perto do zero.
- **Independência.** Os 15 subtemas entram como evidências independentes, mas A, C e N são quase colineares. Isso infla
  a confiança (P1 médio de 0,89 a 0,93 nas simulações).
- **Escala de "match".** `match = round(prob·100)`; o rótulo "Muito provável" começa em 50%.
- **Incompletos.** Com 20% de respostas e o resto "não tenho opinião", a confiança é baixa e a faixa fica mais larga
  (testado). Se as frases ficam sem resposta (`undefined`, teste abandonado), elas nem contam no denominador (`asked`);
  a interface não mostra resultado nesse estado, mas `compute` não protege.
- **Entradas fora da escala.** Valor 7 em todas as frases: posição limitada a ±100, sem NaN (testado).

### 6.6 Propostas pro algoritmo (sem implementar)

1. **Indicador de não diferenciação.** Proporção de "meio-termo" ou desvio padrão das respostas cruas. Acima de um
   limite (por exemplo, ≥ 60% de meio-termo), confiança no máximo média, com o texto "suas respostas não diferenciaram
   os temas".
2. **Aquiescência medida, não só inferida.** Índice = média de v sem o sinal de d em pares balanceados. Com |índice| alto,
   ajustar ou avisar.
3. **Corrigir a dimensionalidade.** Ponderar A, C e N pela correlação, ou classificar num espaço de 2 a 3 fatores (com dados).
4. **Temperatura/calibração.** Dividir logL por um fator T > 1 estimado em dados reais (ou nas simulações com perfis
   perturbados) pra que P1 ≈ taxa de acerto.
5. **Eixo D como filtro, não como distância.** Rotular "radical" só com concordância explícita com frases de ruptura
   (como o GATE dos extremos), em vez de por distância a −65.

### 6.7 Simulações: circularidade e calibração (experimento executado)

`testes/simulacao.js` gera respondentes a partir de `IDEO.p` (gerador A) ou de `PERFIS` com erro de ±10 (gerador B) e
classifica com os mesmos `IDEO`/`PERFIS`. O acerto mede se o cálculo inverte o próprio gerador, não se as frases medem
ideologia. Teste de sensibilidade: o gerador B com os perfis **verdadeiros** dos simulados perturbados (desvio de 20 e de
35 por subtema), e o cálculo do site intacto. 252 respondentes por linha, 4 por célula, semente 2026.

| Modo | Gerador | Perturbação | Acerto | Certa entre 2 | Reteste | Recebem conf. alta | Acerto entre os de conf. alta | P1 médio |
|---|---|---|---|---|---|---|---|---|
| Essencial | A | 0 | 97,2% | 99,6% | 96,0% | 96,0% | 98,3% | 0,890 |
| Essencial | B | 0 | 90,9% | 99,6% | 91,7% | 93,7% | 93,2% | 0,891 |
| Essencial | B | 20 | 78,2% | 96,4% | 88,1% | 92,1% | 81,5% | 0,862 |
| Essencial | B | 35 | 66,3% | 92,1% | 82,1% | 84,9% | 66,4% | 0,820 |
| Padrão | A | 0 | 98,8% | 100% | 99,2% | 96,8% | 100% | 0,927 |
| Padrão | B | 0 | 94,4% | 100% | 94,4% | 93,7% | 95,3% | 0,909 |
| Padrão | B | 20 | 85,7% | 99,2% | 89,3% | 91,3% | 87,8% | 0,873 |
| Padrão | B | 35 | 73,0% | 94,0% | 84,1% | 86,1% | 75,1% | 0,837 |

Com perfis teóricos errados em 20 pontos (plausível pra perfis definidos por teoria), a probabilidade média da 1ª
continua em 86–87%, o acerto real fica em 78–86%, e mais de 90% recebem "confiança alta". **A probabilidade exibida é
excessivamente confiante quando o modelo está errado**, e o chip de confiança quase não reage. Isso não invalida as
simulações como teste de software. Invalida usá-las como evidência de acerto ("acerta cerca de 98 em cada 100").

---

## 7. Comunicação dos números

### 7.1 Onde cada número aparece

| Lugar | O que é | Como aparece | Problema |
|---|---|---|---|
| Resumo, "Ideologias mais próximas" (`extras.js`) | probabilidade posterior | "Centrista 98%", barra | Lida como "98% próximo" ou "98% centrista". **Crítico** |
| Sanfona "Ideologias mais parecidas" (`index.html`, `resultado.js`) | probabilidade posterior | "Muito provável", barra com a probabilidade; legenda "Semelhança entre as suas posições..." | **A legenda descreve outra métrica** |
| "Mais distante de você" | semelhança `agree` (5 eixos) | texto | Métrica diferente da do ranking logo acima |
| "Você disse que se identifica como X" | semelhança `agree` | "semelhança alta/média" | Pode contradizer o ranking (73/200 perfis aleatórios com a 1ª diferente) |
| Termômetro dos extremos | índice ext (adesão × encaixe) | "Comunismo 53%", "a partir de 50%, afinidade forte" | Índice composto em "%"; com um único marcador, sobe por 2 frases |
| Candidatos, 2º turno | semelhança `candMatch` (curva ^1,6, peso E = 2, penalidade de lado oposto) | "Compatibilidade alta (72%)" | "%" sugere probabilidade/percentual de concordância; a curva transforma 50% de proximidade linear em 33% |
| Pensadores | semelhança | "Alta (72%)" | Idem |
| Faixa dos eixos | ±1,28 × erro heurístico | "onde você deve estar com 80% de chance" | Cobertura não calibrada |
| Chip de confiança | regra P1/consistência/precisão | "Confiança alta" | Com tudo no meio, é alta (6.3) |
| Janelas "Como os modos foram testados", FAQ | acerto em simulação | "acerta cerca de 98 em cada 100 simulados" | Circular; o texto da janela avisa, a FAQ "O teste é confiável?" responde com esse número |

### 7.2 Afirmações de validade

- **FAQ, "O teste é confiável?":** responde com "acerta cerca de 98 em cada 100 simulados". A ressalva vem depois, mas
  a pergunta é sobre confiabilidade com pessoas, e a evidência é de autoconsistência.
- **FAQ, "O teste é científico?":** resposta honesta ("ainda não foi validado"). Manter.
- **Metodologia:** "Ninguém foi classificado do lado oposto ao seu" é verdade só nos simulados, gerados do mesmo modelo.
- **FAQ, "Por que apareceram duas ideologias?":** "você está de fato entre as duas tradições". Afirmação forte demais:
  o empate pode vir de ruído ou de frases mal posicionadas.
- **index.html:** "Aprofundado — O mais preciso: separa melhor ideologias parecidas". Os números do próprio `CALIB` dizem
  97,6% contra 97,8% do Padrão.
- Não há uso de "imparcial", "validado" ou "científico" como afirmação positiva nas páginas lidas. O tom geral é
  cuidadoso. Os problemas estão nos números com "%".

### 7.3 Propostas de texto

1. **Resumo:** trocar "Ideologias mais próximas: Centrista 98%" por "**Ideologia que melhor explica suas respostas**",
   com rótulo qualitativo ("muito provável, segundo o modelo") e a porcentagem só no detalhe, com a frase: "Probabilidade
   calculada pelo modelo do teste, supondo que as 21 posições típicas estejam certas. Não é o quanto você concorda com
   essa ideologia."
2. **Sanfona:** a legenda vira "Probabilidade de cada ideologia segundo o modelo (ver metodologia). Para ver o quanto suas
   posições se parecem com cada uma, use 'Comparar com uma ideologia'." Ou mostrar as duas colunas: "Probabilidade" e
   "Semelhança".
3. **Unificar ou separar com nomes diferentes.** "Provável" pra posterior, "Parecida" pra semelhança. Nunca "%" na
   semelhança; usar "alta/média/baixa" ou uma barra sem número.
4. **Termômetro:** "Adesão às frases que definem o extremo (índice de 0 a 100, não é probabilidade)". Mostrar quantas
   frases sustentam o índice ("baseado em 2 frases").
5. **Candidatos/pensadores:** tirar o "(72%)". Escrever "Proximidade alta nas posições estimadas". Explicar a curva e o
   peso dobrado da economia.
6. **Confiança:** com perfil não diferenciado (6.6, item 1), "Seu resultado ficou no centro porque suas respostas foram
   quase todas neutras. Isso pode ser moderação ou falta de opinião formada; o rótulo Centrista aqui é fraco."
7. **FAQ "O teste é confiável?":** começar pelo que não se sabe: "Ainda não sabemos com pessoas reais. Com respondentes
   simulados criados a partir do próprio modelo, o cálculo recupera a ideologia de origem em X de 100 casos; se as
   posições típicas estiverem erradas em ~20 pontos, isso cai pra cerca de 8 em 10 no Essencial."
8. **Faixa:** "faixa provável (estimativa aproximada)", sem "80% de chance".

---

## 8. Propostas de reescrita de frases

Formato: atual → proposta → por quê → efeito esperado. Nenhuma foi aplicada.

1. **Y1 (simetria)** — atual: "Se um presidente de direita não consegue aprovar seus projetos no Congresso, é legítimo
   que ele passe a governar por medidas provisórias e decretos." → proposta: usar D21 (texto idêntico a D20 com "direita")
   como par de D20 e aposentar Y1. Por quê: a diferença de resposta precisa vir só do lado político. Efeito: o aviso de
   simetria passa a medir viés partidário; espera-se menos avisos falsos.
2. **Y2 (simetria)** → usar A26 como par de A25. Mesmo motivo e efeito.
3. **D20/D21 (conteúdo)** — atual: "...passa a governar com decretos e medidas provisórias pra contornar um Congresso que
   bloqueia suas propostas. Isso é aceitável." → proposta: "...passa a reeditar medidas provisórias rejeitadas pelo
   Congresso e a governar por decreto em temas que a Constituição reserva a lei. Isso é aceitável." Por quê: medida
   provisória é instrumento constitucional; a frase atual pune quem só aceita o uso normal. Efeito: D.rup mede ruptura,
   não presidencialismo forte.
4. **Y3 / par C17** — trocar o espelho C17×Y3 por C17×C18 (espelho lógico). Y3 continua como frase própria (cota social
   × racial) em C.div. Efeito: some a contradição falsa de quem é contra todas as cotas.
5. **N1 × N18** — tirar do tipo "contra" ou trocar N1 por N19 ("continuar recebendo os venezuelanos") × N20 (já espelho).
   Efeito: menos contradições falsas.
6. **N22** — atual: "O Brasil deveria liderar a integração da América do Sul, mesmo que isso custe dinheiro..." → proposta:
   "Decisões sobre comércio e fronteiras do Brasil deveriam ser tomadas em conjunto com os países do Mercosul, mesmo que o
   Brasil precise ceder em alguns pontos." (d = −1). Por quê: a versão atual é agenda de liderança nacional; a proposta mede
   cessão de soberania. Efeito: nacional-desenvolvimentistas deixam de ser puxados pro polo global.
7. **D15** — atual: "Movimentos sociais devem respeitar a lei, mesmo quando a causa é justa." → proposta: mover pra A.lib
   (ordem) ou trocar por "Um governo deveria poder proibir manifestações de grupos que ele considera ameaça à ordem." (D.opo,
   d = +1). Por quê: desobediência civil não é falta de compromisso democrático. Efeito: menos esquerda moderada empurrada
   pra "menos democrático".
8. **D19** — atual: "Se a Justiça Eleitoral tornar inelegível um candidato que você apoia, ele deve ficar fora da eleição,
   mesmo que você ache a decisão injusta." → proposta: "Se a Justiça Eleitoral tornar inelegível um candidato que você
   apoia, o partido dele deveria cumprir a decisão e recorrer pelos meios legais, em vez de chamar protestos contra o
   tribunal." Por quê: separa discordar da decisão de desrespeitar a instituição. Efeito: menos leitura partidária.
9. **A10** — atual: "Câmeras com reconhecimento facial espalhadas pela cidade são boas pra segurança." → proposta: "A
   prefeitura deveria instalar câmeras com reconhecimento facial em toda a cidade, mesmo que isso registre por onde todo
   mundo anda." (d = +1). Por quê: transforma juízo empírico em proposta com custo. Efeito: maior separação em A.vig.
10. **E6** — atual: "As leis trabalhistas (CLT) têm regras demais e atrapalham a criação de empregos." → proposta: "As
    empresas deveriam poder negociar com cada empregado férias, jornada e 13º, mesmo que isso reduza direitos previstos
    na CLT." Por quê: tira o duplo juízo e põe custo explícito. Efeito: menos concordância "de senso comum".
11. **E30** — atual: "...privatizada, como foi feito com a Eletrobras." → proposta: "A Petrobras deveria ser privatizada,
    mesmo que o governo perca o poder de influenciar o preço dos combustíveis." Por quê: tira a pista partidária e põe custo.
12. **E29** — atual: "...mesmo que alguns comércios precisem contratar mais gente." → proposta: "...mesmo que isso aumente
    custos e preços no comércio." Por quê: o custo atual é lido como benefício. Efeito: equilibra com E19.
13. **Y4** — atual: "Saneamento é essencial demais pra depender de lucro: água e esgoto deveriam ficar com empresas do
    governo." → proposta: "Água e esgoto deveriam ficar com empresas do governo, mesmo que isso atrase investimentos por
    falta de dinheiro público." Por quê: tira a justificativa embutida e põe custo, como em E27.
14. **C11** — atual: "Homens e mulheres têm papéis naturais diferentes dentro da família." → proposta: "Numa família, o
    ideal é que o homem seja o principal provedor e a mulher cuide principalmente da casa e dos filhos." Por quê: tira a
    ambiguidade biológico × prescritivo.
15. **C15** — atual: "A família tradicional é uma instituição ultrapassada que deveria deixar de ser o modelo da
    sociedade." → proposta: "O governo deveria tratar igualmente, em todas as políticas, qualquer arranjo familiar, sem
    dar preferência ao casal com filhos." Por quê: tira o espantalho e o duplo juízo. Efeito: variância real no polo
    progressista (hoje quase todos discordam).
16. **C20** — atual: "...A empresa agiu certo." → proposta: mover pra A.lib, ou reescrever pra C: "Comentários
    preconceituosos nas redes deveriam ser crime, mesmo quando feitos em perfil pessoal." Por quê: a versão atual mistura
    liberdade do empregador e de expressão.
17. **C24** — mover pra E.trab ou reescrever: "O governo deveria criar incentivos para empresas que promovem mulheres a
    cargos de chefia." Por quê: menos vazamento econômico.
18. **A27** — manter, mas classificar num subtema "saúde pública" separado de A.lib (ou excluir da média do eixo, como
    Armas). Por quê: sinal partidário invertido.
19. **D17** — atual: "Rapidez ou democracia?" com "mesmo que menos democrático" → proposta: "Um governo que decide rápido,
    mesmo que precise reduzir consultas ao Congresso" × "Um governo que negocia tudo com o Congresso, mesmo que demore".
    Por quê: tira o rótulo desejável da opção B.
20. **S9** — tirar "porque estão podres".
21. **N1** — atual: "Imigrantes e refugiados deveriam ser bem recebidos no Brasil." → proposta: "O Brasil deveria
    facilitar a autorização de trabalho para imigrantes, mesmo em setores com desemprego alto." Por quê: tira a
    desejabilidade e o duplo público.
22. **Marcadores:** D1 sem `fas` (ou com um marcador novo de "autoritarismo militar"); D3 com `com` + `fas`; D2 com
    `com` + `anq`. Efeito: o termômetro deixa de associar golpe militar a fascismo e partido único só ao comunismo.
23. **A23:** `solo:"Armas"`. Efeito: corrige o "1:" exibido.
24. **L2 (−75), L1 (−40), L3 (−35):** separar em uma ideia por opção (por exemplo, L2 −75: "O Estado deveria promover
    ativamente a diversidade de famílias e identidades de gênero.").
25. **L10 / L12 (opção do meio):** L12 0 → "Cotas e políticas para grupos discriminados são aceitáveis, mas deveriam
    ser revistas e ter prazo"; L10 0 → "O governo deveria reconhecer todos os arranjos, mas incentivar o casamento".
    Por quê: o meio passa a ser intermediário de verdade.

---

## 9. Consistência dos números no site

| Item | Código (executado) | Textos |
|---|---|---|
| Perguntas, Essencial | 62–70 (+0 a 5 de desempate); 52 concordância, 8 escolhas, 10 contrastes | index.html "65 perguntas"; README, FAQ e metodologia "cerca de 65"; METODOLOGIA.md "62 a 70" (**correto**) |
| Padrão | 128–139 (+0 a 6); 107 concordância, 6 dilemas, 16 escolhas, 10 contrastes | "135"/"cerca de 135"; METODOLOGIA.md "128 a 139" |
| Aprofundado | 205–216 (+0 a 4); 170, 6, 16, 24 | "210"/"cerca de 210"; METODOLOGIA.md "205 a 216" |
| Tempo | não medido no código (o tempo por frase é gravado, mas nenhuma média é publicada) | 9 / 18 / 30 min (≈ 8,3 / 8,0 / 8,6 s por frase); sem fonte |
| Ideologias | 21 (`IDEO`) | 21 em todas as páginas ✔ |
| Eixos | 6 na tela; 5 na classificação; 4 nos candidatos; 5 em pensadores | "6 eixos" (index, FAQ, metodologia, README); FAQ: "**Cada eixo é dividido em subtemas**" ✘ (S não tem) |
| Subtemas | 15 na classificação + A.arm (fora) | "15 subtemas" (METODOLOGIA.md) ✔ |
| Pares comparáveis | Essencial 3 sem filtro (E16 só aparece pra quem está à direita na economia → em geral 2); Padrão/Aprofundado 12 (11 sem E16) | metodologia "só 3 pares"; resultado.js "O modo Padrão compara cerca de 11" ✔ |
| Exemplo de par espelho | C17 × **Y3** | metodologia: "as cotas raciais deveriam continuar" e "deveriam acabar" (**C18, não usado**) ✘ |
| Acerto (simulação) Ess./Pad./Apr. | `CALIB`: 95,2 / 97,8 / 97,6 | metodologia.html 94 / 98 / 98; METODOLOGIA.md 95 / 98 / **99**; FAQ Padrão "98" |
| Reteste Ess./Pad./Apr. | `CALIB`: 94,8 / 97,8 / 97,8 | metodologia.html 93 / 97 / 98; METODOLOGIA.md 93 / 98 / 98; FAQ "92 … 98" ✘ |
| "O mais preciso" (Aprofundado) | acerto 97,6% < Padrão 97,8% | index.html ✘ |
| Desempate | ≥ 1 eixo com diferença ponderada ≥ 20 e meia-faixa ≥ 12; Aprofundado ≤ 4 frases | "de 5 a 6 perguntas extras" ✘ no Aprofundado |
| Confiança com "metade sem opinião" | `respondeu < 0,5` → exatamente metade dá média | "Quem pula metade das frases ou mais tem confiança baixa" ✘ |
| Arquivo do motor | `public/js/nucleo/motor.js` | METODOLOGIA.md "`public/motor.js`" ✘ |

---

## 10. As 21 ideologias

Posições em (E, A, C, N, D). "Vizinha" = menor distância RMS por subtema, com λ = 0,5 (o que a classificação usa).
Abaixo de ~25 (o τ), a separação depende de poucas frases.

| Ideologia | Posição | Vizinha (RMS) | Avaliação |
|---|---|---|---|
| Comunista | −90, 55, −20, 10, 70 | Esquerda radical (34,4) | A descrição cita URSS, Cuba e China de Mao; ok como definição histórica. N = +10 contradiz Marx na lista de pensadores (N = −40); escolher entre internacionalismo e anti-imperialismo nacionalista |
| Anarquista | −80, −85, −60, −50, 20 | Esquerda progressista (46,1) | D = +20 trata anarquistas como menos democráticos; o anarquismo rejeita o Estado, não necessariamente a democracia direta. Discutível |
| Esquerda radical | −70, 10, −55, −10, 35 | Comunista (34,4) | **Problemática (A1, A7):** "radical" = antidemocrática; no Brasil o termo é aplicado a partidos eleitorais |
| Socialista democrático | −65, −15, −45, −25, −65 | Social-democrata (17,9) | Ok; perto demais da social-democracia |
| Social-democrata | −35, 0, −25, −20, −65 | Socialista democrático (17,9) | Ok ("como nos países nórdicos") |
| Esquerda progressista | −40, −50, −65, −40, −65 | Socialista democrático (22,5) | A = −50 conflita com o perfil A.vig = −30 e com a agenda de regulação de plataformas; ok |
| Ecologista | −30, −15, −40, −75, −65 | Esquerda progressista (24,8) | Ecologia = global (N = −75); o filtro exige N perto de −75. Ecossocialismo e soberania amazônica de esquerda ficam de fora |
| Esquerda conservadora | −50, 35, 50, 30, −65 | Nacional-desenvolvimentista (23,3) | Boa inclusão pro Brasil (lulismo popular, esquerda evangélica) |
| Nacional-desenvolvimentista | −45, 30, 5, 50, −65 | Esquerda conservadora (23,3) | Ok; absorve o trabalhismo (Vargas/Brizola) sem nomeá-lo |
| Centrista | 0, 0, 0, 0, −65 | Liberal clássico (19,6) | **Problemática (C2):** a descrição fala do padrão de resposta ("ficaram equilibradas"), não de ideologia; vira destino de quem não diferencia |
| Social-liberal | 15, −20, −30, −30, −65 | Liberal clássico (17,5) | Ok |
| Democracia cristã | 5, 25, 55, 10, −65 | **Conservador (12,9)** | Quase indistinguível; o desempate nunca dispara (M4). A doutrina social cristã se opõe à pena de morte e defende migrantes; o perfil A.pol = 30 não reflete isso |
| Liberal progressista | 50, −40, −50, −30, −65 | Social-liberal (20,3) | Ok; no grupo "Direita" |
| Liberal clássico | 35, −20, −5, −10, −65 | Social-liberal (17,5) | E = 35 é menos pró-mercado que Liberal-conservador (45) e Liberal progressista (50); incoerente com "mercado livre" |
| Libertário | 70, −60, −20, −10, −65 | Liberal progressista (21,9) | Ok |
| Anarcocapitalista | 95, −85, 0, −20, 10 | Libertário (39,6) | D = +10: a mesma objeção do anarquismo |
| Liberal-conservador | 45, 15, 40, 10, −65 | Conservador (19,6) | Ok |
| Conservador | 20, 35, 60, 30, −65 | Democracia cristã (12,9) | Ok; trio confundido (já documentado) |
| Direita nacional-conservadora | 30, 50, 65, 60, −65 | Conservador (16,0) | Desempate nunca dispara com Conservador (18,0 < 20). Separada da Direita radical sobretudo por D (6.4) |
| Direita radical | 35, 70, 80, 75, 45 | Fascista (28,9) | **Problemática (A1, A7):** na literatura (Mudde), direita radical aceita eleições e se opõe à democracia liberal; "extrema direita" rejeita a democracia. A descrição usa a segunda definição com o primeiro nome |
| Fascista | 0, 90, 60, 95, 85 | Direita radical (28,9) | Ok; podia citar o integralismo (Plínio Salgado está nos pensadores). Marcadores misturam golpe militar com fascismo (M2) |

**Duplicações práticas.** Três aglomerados com distância RMS < 20: {Democracia cristã, Conservador, Dir.
nacional-conservadora}, {Socialista democrático, Social-democrata} e {Social-liberal, Liberal clássico, Centrista}.
Juntar ou criar frases que separem.

**Correntes ausentes relevantes no Brasil.**
- **Direita autoritária/militarista** (saudosismo do regime de 1964, intervencionismo militar): hoje cai em Fascista ou
  Direita radical por causa de D1.
- **Trabalhismo** (PDT, Vargas/Brizola): diluído em Nacional-desenvolvimentista.
- **Conservadorismo evangélico de mercado** ("teologia da prosperidade"): entre Conservador e Liberal-conservador, com
  A.lib alto.
- **Esquerda cristã/católica social** (CEBs): progressista na economia, dividida nos costumes; diferente da Esquerda
  conservadora.
- **Liberalismo de centro tucano/social-democracia brasileira** (PSDB): cai entre Social-liberal e Social-democrata.

O que fazer depende de dado: sem amostra, acrescentar rótulos piora a confusão.

---

## 11. Testes com perfis sintéticos (`testes/perfis.test.mjs`)

Roda sem navegador (núcleo num `vm`), com `verificador` e `executandoDireto` como os demais. Comando pedido:
`node -e "import('./testes/perfis.test.mjs').then(...)"` → **269 verificações ok, 0 falhas, 7 pendentes**.

Perfis: moderado, radical, extremo (fascista que concorda com as marcadoras), centrista puro, misto (costumes divididos
por subtema), intervencionista + conservador, liberal econômico + progressista, contraditório, uniforme (tudo
"concordo", tudo "discordo", tudo "meio-termo"), tudo "não tenho opinião", incompleto (20%), metade sem opinião, valores
extremos (tudo no polo e entrada fora da escala). Os três modos.

Propriedades conferidas (todas declaradas pelas regras do código): números finitos; soma das probabilidades = 1;
probabilidades em [0, 1] e ordenadas; posição em [−100, 100] e dentro da própria faixa; nenhuma ideologia com filtro
disputa sem passar do GATE; extremo não disputa sem frase respondida; determinismo (duas chamadas e outro sorteio);
quem rejeita as marcadoras do fascismo não recebe Fascista; espelhar as respostas espelha posição e erro (sem escolhas
e contrastes); sinais coerentes nos perfis cruzados; o radical fica mais longe do centro que o moderado; avisos de
estilo nos uniformes; "não tenho opinião" em tudo → insuficiente, empate e duas ideologias; incompleto → confiança
baixa e faixa mais larga; contradições descontam 12 pontos cada; simetria partidária detectada; limites com valores
extremos.

**Pendentes (falham hoje, documentados, não contam como falha):**
1. Tudo "discordo" no Essencial: confiança alta, consistência 85 (C2).
2–4. Tudo "meio-termo" nos 3 modos: confiança alta, Centrista 99–100% (C2).
5–7. Exatamente metade "não tenho opinião" nos 3 modos: confiança média, e a metodologia diz baixa (M10).

O teste não afirma validade: um perfil sintético cair onde se espera mostra que o cálculo segue as próprias regras, não
que as frases medem ideologia. Ele não foi incluído em `testes/rodar.mjs`; pra isso, basta acrescentar
`["perfis", testarPerfis]` à lista.

---

## 12. Limitações do modelo (resumo)

1. **Sem validação empírica.** As posições das frases (`d`), das escolhas (`v`), dos contrastes (`va`/`vb`), das ideologias
   (`p`) e dos perfis por subtema são decisões do autor. Nenhuma carga fatorial, localização de item ou confiabilidade
   (α, ω, teste-reteste real) foi estimada.
2. **Simulações circulares.** Medem a inversão do próprio gerador. Com erro teórico de 20 pontos, o acerto cai 13
   pontos no Essencial, e a confiança exibida quase não muda (6.7).
3. **Dimensionalidade.** A, C e N são quase colineares nos protótipos, e a classificação conta essa informação três vezes.
4. **Posterior com prior uniforme e verossimilhança independente.** Não representa a chance de a pessoa "ser" daquela
   ideologia. É a plausibilidade relativa dentro de um modelo com 21 protótipos fixos.
5. **Eixo D binário na prática.** Funciona como filtro "democrático × radical", mas é tratado como distância contínua (A1).
6. **Estilo de resposta.** O fator γ corrige a força das respostas, não a aquiescência; o meio-termo sistemático vira
   centrismo confiante.
7. **Contexto temporal.** Várias frases dependem de 2022–2026 (urnas, inelegibilidade, bloqueios, X/STF, 6x1). A leitura
   delas muda com o ciclo político, e o eixo pode se deslocar sem que a pessoa mude.
8. **Amostra do estudo.** Os pesos do servidor usam correlação item-resto em quem escolhe participar (amostra
   autosselecionada), o que reforça o fator dominante de cada eixo.

**Próximos passos com dados reais (em ordem):** (1) análise fatorial exploratória e confirmatória por eixo, com as
frases de sinal partidário invertido marcadas; (2) IRT de ponto ideal pra localizar frases e escolhas; (3) estimar `p`
e `PERFIS` a partir de autoidentificação e voto, com validação cruzada; (4) calibrar a temperatura da probabilidade
pra que P1 ≈ taxa de acerto; (5) só então publicar acerto "com pessoas reais".
