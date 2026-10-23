# Metodologia

Este documento explica como as respostas viram um resultado. A versão para o público está em
`public/metodologia.html`; aqui estão os detalhes técnicos e os parâmetros.

## 1. Eixos

| Código | Eixo | Polo − | Polo + | Subtemas |
|---|---|---|---|---|
| E | Economia | Mais Estado | Mais mercado | impostos e benefícios, trabalho, Estado e mercado |
| A | Liberdade × Ordem | Mais liberdade | Mais ordem | polícia e punição, escolhas pessoais, vigilância e internet |
| C | Costumes | Progressista | Conservador | família e gênero, religião, diversidade |
| N | Brasil × Mundo | Global | Nacional | comércio, soberania e clima, imigração e cultura |
| D | Democracia | Mais compromisso democrático | Aceita ruptura | regras, ruptura, oposição |
| S | Instituições | Confia | Desconfia | (sem subtemas) |

Cada eixo vai de −100 a +100. O eixo Instituições aparece no resultado, mas não entra na escolha da ideologia, porque a
desconfiança existe em todos os lados. Armas ficam fora dos eixos: no Brasil o tema não se encaixa em nenhum deles, e a
resposta aparece à parte.

## 2. Tipos de pergunta

| Tipo | Como funciona | Uso no cálculo |
|---|---|---|
| Concordância | 5 opções, de "concordo totalmente" a "discordo totalmente" (−2 a +2), mais "não tenho opinião" | média do subtema |
| Dilema | duas alternativas com custo; 5 opções entre elas | média do subtema |
| Escolha forçada | 5 frases ordenadas; a pessoa escolhe a mais próxima | âncora de posição e fator de estilo |
| Contraste | duas frases, cada uma típica de uma ideologia vizinha; "as duas" ou "nenhuma" | evidência na classificação |
| Frases dos extremos | definem comunismo, anarquismo, fascismo, anarcocapitalismo e ecologismo | filtro e evidência |

Em cada eixo, as frases de concordância puxam em número parecido pra cada lado, pra que quem tende a concordar com tudo
não caia sempre no mesmo lado. Pares de frases opostas ficam separados (uma no bloco do tema, outra no bloco final).
Nas perguntas de escolha e contraste, metade das pessoas vê as opções em ordem invertida.

## 3. Modos

| Modo | Nível | Frases (varia com o filtro dos extremos) | Escolhas forçadas | Contrastes |
|---|---|---|---|---|
| Essencial | 1 | 62 a 70 | 8 | 10 |
| Padrão | 2 | 128 a 139 | 16 | 10 |
| Aprofundado | 3 | 205 a 216 | 16 | 24 |

Cada frase tem um nível (`lv`); um modo mostra todas as frases de nível igual ou menor. O Aprofundado acrescenta frases
graduadas (uma moderada e uma radical de cada lado por subtema) e o banco de desempate.

## 4. Cálculo dos eixos (`public/js/nucleo/motor.js`)

O mesmo cálculo roda no site e no servidor (`servidor/motor.mjs` é gerado a partir dele por `npm run listas`), então os
dois sempre calculam igual.

1. **Média por subtema:** respostas de concordância × direção da frase × 50, com margem de erro
   `max(35, desvio) / √n`. Pesos por frase entram aqui quando existirem (ver seção 9).
2. **Âncoras:** só as escolhas forçadas. Margem de 32 para escolha de subtema e 42 para escolha do eixo inteiro (aplicada
   a cada subtema do eixo). Contrastes **não** são âncoras: só dizem de que lado do ponto médio a pessoa está.
3. **Fator de estilo γ:** inclinação de "âncora ≈ γ × média". Limitado a [0,8; 1,3], ou [0,6; 1,6] com 8 ou mais âncoras,
   e encolhido pra 1 com pouca informação: `γ = 1 + den/(den + 5000) × (γ₀ − 1)`.
4. **Posição do subtema:** média × γ combinada com as âncoras, cada uma pesando pela sua precisão. A margem da média inclui
   um erro de estilo de 30% da própria média, que não diminui com mais frases.
5. **Eixo:** média dos subtemas, todos com o mesmo peso. Faixa provável: ±1,28 × margem, mínimo de 6. O fator 1,28
   corresponderia a 80% numa distribuição normal, mas a margem é heurística (piso de 35, erro de estilo de 30%) e a
   cobertura real da faixa nunca foi medida; por isso o site não fala em "80% de chance".

"Não tenho opinião" fica fora da conta. "Depende / meio-termo" conta como posição do meio.

## 5. Escolha da ideologia

- **Perfis por subtema:** cada ideologia tem uma posição típica em cada um dos 15 subtemas, baseada em teoria política.
  Como é uma hipótese ainda não conferida com dados reais, o cálculo usa o perfil pela metade (λ = 0,5), a meio caminho
  entre o subtema e a posição da ideologia no eixo.
- **Probabilidade:** em cada subtema, a distância entre a pessoa e o perfil é medida em relação à margem da pessoa mais a
  variação natural dentro da tradição (τ = 25). Somam-se as evidências dos contrastes (logística, inclinação 1,5) e das
  frases dos extremos (a ideologia extrema espera +1,5, todas as outras −1,5; σ = 0,8).
- **Filtros:** um extremo só entra na disputa se a adesão às suas frases, combinada com a posição nos eixos, chegar a 50.
  Concordar em média ("concordo") já vale 2/3 da adesão. O ecologismo usa três frases sobre floresta e clima.
- **Rótulo duplo:** quando a segunda ideologia tem pelo menos 60% da probabilidade da primeira.
- **Desempate:** nesse caso, se algum eixo que separa as duas tiver diferença ponderada de 20 ou mais entre as posições
  típicas e meia-largura de faixa de 12 ou mais, o teste faz até 5 (Essencial) ou 6 perguntas extras desses eixos. No
  Aprofundado podem ser menos (só há frases de desempate livres pros eixos E e D). Pros pares mais confundidos
  (Conservador × Democracia cristã, Conservador × Direita nacional-conservadora), a diferença ponderada fica abaixo de 20
  e o desempate não dispara (ver `docs/AUDITORIA-METODOLOGIA.md`, M4 e M5).
- **Empate total** (por exemplo, sem nenhuma resposta): vence a ideologia mais próxima do centro democrático.

## 6. Confiança

- **Alta:** probabilidade da primeira ≥ 60%, consistência ≥ 70 e precisão dos eixos não baixa.
- **Média:** probabilidade ≥ 35% e consistência ≥ 50.
- **Baixa:** nos demais casos.

Quem dá opinião em menos da metade das perguntas tem confiança baixa (no código, `respondeu < 0,5`: exatamente metade
ainda pode dar média); com opinião em menos de três quartos, no máximo média.
Com opinião em menos de 20% das perguntas, o teste não mostra uma ideologia ("Respostas insuficientes").

## 7. Consistência

A nota (0 a 100) desconta: pares de frases opostas respondidas pros dois lados, tendência a concordar com tudo, tensões
entre temas, 12 ou mais respostas iguais seguidas (só nas frases de concordância), tempo muito curto por frase e excesso
de "não tenho opinião". Pares de simetria (a mesma situação com lados políticos trocados) medem viés partidário.

## 8. Candidatos

A compatibilidade compara a posição da pessoa nos eixos com uma estimativa da posição de cada candidato, feita a partir do
histórico público de cada um, com pesos pela importância que a pessoa dá a cada tema. É uma estimativa com margem de erro
e não é recomendação de voto. A lista de candidatos precisa ser revisada a cada eleição.

## 9. Pesos por frase

Todas as frases valem 1. Com pelo menos 300 participantes dos modos Padrão ou Aprofundado, o painel calcula pesos de 0,5 a
1,5 pela correlação de cada frase com o próprio eixo. Os pesos só são aplicados se as correlações de duas metades dos
dados concordarem (r ≥ 0,7).

## 10. Simulações

O cálculo foi testado com respondentes simulados das 21 ideologias, com três estilos (cauteloso, típico e forte) e reteste,
usando dois geradores:

- **A:** posição por eixo, concordância linear.
- **B:** perfil por subtema com erro fixo da teoria (±10), variação individual (±12), frases com localização oculta (ponto
  ideal), posições reais das frases de contraste e das opções de escolha diferentes das supostas e escolhas mais ruidosas.

| Modo | Acerto | Certa entre as 2 primeiras | Mesma ideologia no reteste |
|---|---|---|---|
| Essencial | 95,2% | 99,6% | 94,8% |
| Padrão | 97,8% | 99,8% | 97,8% |
| Aprofundado | 97,6% | 99,8% | 97,8% |

Média dos dois geradores, 1.008 respondentes por modo. A fonte é `CALIB` em `public/js/telas/janelas.js`, que é o que o
site exibe; `testes/paginas.test.mjs` confere que a metodologia pública mostra esses mesmos números arredondados.

**Sensibilidade (experimento da auditoria):** com os perfis "verdadeiros" dos simulados perturbados em 20 pontos por
subtema e o cálculo intacto, o acerto cai pra 78% (Essencial) e 86% (Padrão), e a probabilidade média da 1ª ideologia
continua acima de 0,86. Ou seja, a probabilidade exibida é confiante demais quando os perfis teóricos estão errados.

## 11. Limites

- As simulações partem dos perfis teóricos (são circulares): medem o funcionamento do cálculo, não o quanto as frases
  captam o que pessoas reais pensam. Com pessoas reais, o acerto deve ser menor.
- Problemas conhecidos e propostas de correção estão em `docs/AUDITORIA-METODOLOGIA.md` (nenhuma foi aplicada ao cálculo).
- Respondentes simulados são coerentes; na prática, confiança média e baixa serão mais comuns.
- O grupo conservador (Conservador, Democracia cristã e Direita nacional-conservadora) é o que mais se confunde. No
  Essencial, isso faz o acerto de quem é de direita (cerca de 89%) ficar abaixo do de quem é de esquerda (cerca de 98%),
  porque do lado direito há três tradições muito próximas e poucas perguntas pra separá-las. A certa aparece entre as
  duas primeiras em 99% dos casos. No Padrão e no Aprofundado a diferença some. Subir uma escolha forçada de impostos
  pro Essencial foi testado e não ajudou.
- A escolha forçada da economia (L0) tem três opções à esquerda e duas à direita, sem uma opção de centro: quem escolhe
  a do meio por moderação é posicionado na centro-esquerda (-20). O cálculo é simétrico (testado com respostas
  espelhadas); a assimetria está no conteúdo das opções, e corrigi-la exige reescrever e recalibrar com dados reais.
- Próximo passo com dados reais (500 a 1.000 pessoas): calibrar a posição de cada frase (IRT de ponto ideal) e as escolhas
  forçadas (IRT thurstoniano), com validação cruzada.
