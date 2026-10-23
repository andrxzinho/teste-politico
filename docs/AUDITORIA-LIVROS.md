# Auditoria bibliográfica das leituras recomendadas

Arquivo auditado: `public/js/dados/leituras.js` (constante `LEITURAS`), com apoio de `ferramentas/creditos-imagens.json` (chave `livros`).
Data: 23 de outubro de 2026. Nenhum arquivo do repositório foi alterado.

## Resumo

- **Itens revisados:** 168 (21 ideologias × 8), que correspondem a **162 obras únicas**. As 6 repetições são: *Anarquia, Estado e utopia* (3 vezes), *Leviatã* (2), *A grande transformação* (2), *Sobre a liberdade* (2) e *Uma teoria da justiça* (2).
- **Manter:** 145 obras. Dessas, cerca de 30 levam uma **nota**: texto que nasceu como artigo ou ensaio mas já saiu como livro avulso, edição brasileira não confirmada, ou ajuste a fazer só nos créditos.
- **Corrigir título, ano ou forma de citar** em `leituras.js`: 11 obras.
- **Corrigir só a justificativa** (redação apresenta tese contestada como fato, ou exagera o que o livro faz): 3 obras.
- **Substituir:** 3 obras (texto avulso sem edição própria encontrada: *Sobre a autoridade*, *Manifesto de Outubro*, *Manifesto dos intelectuais fascistas*).
- **Remover sem substituto:** nenhuma.
- **Correções em `creditos-imagens.json`** (não mudam o site, mas a edição citada está errada ou incompleta): 6, listadas na seção própria.

### Limitações (leia antes de usar)

1. **Nenhum link foi aberto.** WebFetch e curl não funcionam neste ambiente. Todo URL abaixo foi **encontrado num resultado de busca e não aberto**. Pela regra 5 do projeto, ainda falta validar cada um com uma requisição real antes de publicar.
2. As buscas devolvem um resumo automático dos resultados, não a página inteira. Quando o resumo e a página podem divergir, deixei isso escrito.
3. Obras muito conhecidas e sem dúvida razoável (por exemplo: *O capital*, *A riqueza das nações*, *Leviatã*) foram mantidas **sem busca nova**. A coluna "fonte" diz "não buscado". Título, autor e ano batem com o consenso bibliográfico, mas nesta rodada não foram reconferidos.
4. Os ISBNs que vêm de `creditos-imagens.json` foram aproveitados como estão. Só marquei "confirmado" quando uma busca mostrou o mesmo número.
5. **Buscas sem resultado conclusivo**, marcadas "não confirmado": edição brasileira de *Quem somos nós?* (Huntington), *A rebelião das elites* (Lasch), *A nova classe* (Djilas), *O personalismo* (Mounier), *A crise de legitimação no capitalismo tardio* (Habermas, título e editora), *A decadência do Ocidente* (Spengler), *Psicologia das multidões* (Le Bon, edição brasileira), *Factfulness* (ISBN brasileiro), *Tempo comprado* (ISBN), *A terceira via* (ISBN da Record), *O preço da desigualdade* (edição brasileira), *Liberalismo* de Hobhouse (editora), *Carta da prisão de Birmingham* (editora e ISBN) e *As engrenagens da liberdade* (D. Friedman, editora).

Legenda da coluna "link": **[B]** = encontrado na busca, não aberto. "—" = nenhum link proposto (nenhum foi visto em busca).

---

## Os 10 problemas mais importantes

1. **"Por que não sou um conservador" (Hayek) não é livro.** É o posfácio de *Os fundamentos da liberdade* (1960). Confirmado. Proposta: citar o livro e mencionar o posfácio.
2. **"Sobre ser conservador" (Oakeshott) é um ensaio.** Foi conferência em 1956 e saiu em livro na coletânea *Rationalism in Politics* (1962). Existe edição brasileira com o título *Conservadorismo* (2016, ISBN 9788592649081), que reúne "Ser conservador" e outros dois ensaios. Proposta: citar esse livro.
3. **"Sobre a autoridade" (Engels) é um artigo curto** (escrito em 1872, publicado no *Almanacco Repubblicano* para 1874, que circulou em dezembro de 1873). No Brasil só aparece dentro de coletâneas (*Obras escolhidas*, Vitória, 1961). **Substituir.**
4. **"Manifesto dos intelectuais fascistas" (1925) é um texto de jornal** assinado por cerca de 250 pessoas e redigido por Gentile. Não é livro. **Substituir** por *Origini e dottrina del fascismo*, de Gentile (1929).
5. **"Manifesto de Outubro" (Plínio Salgado, 1932) é um manifesto curto** sem edição avulsa encontrada. **Substituir** (proposta: Hélgio Trindade, *Integralismo: o fascismo brasileiro na década de 30*, 1974) ou manter assumindo explicitamente que é um documento e não um livro.
6. **"O extremo centro" (Tariq Ali) não tem edição brasileira encontrada.** Pela própria regra do arquivo, deveria aparecer com o título original: *The Extreme Centre: A Warning* (Verso, 2015).
7. **"A controvérsia do planejamento na economia brasileira": o ano 1945 é o do debate, não o do livro.** O debate foi em 1944–1945 e a coletânea saiu pelo Ipea/Inpes em 1977 (3ª ed. em 2010, ISBN 978-85-7811-044-4).
8. **"Crítica da filosofia do direito de Hegel: introdução" (Marx) é um artigo de revista** (*Anais Franco-Alemães*, 1844). No Brasil circula dentro do volume *Crítica da filosofia do direito de Hegel* (Boitempo, 1ª ed. 2005). Proposta: citar o volume.
9. **Anos errados:** *O Estado e a revolução* saiu em 1918 (foi escrito em 1917). *Reforma ou revolução?* é de 1899, não 1900 (1900 é a data da tradução inglesa). *O ambientalista cético* saiu em dinamarquês em 1998. *Considerações sobre a França* aparece como 1796 na maioria das fontes.
10. **Desequilíbrios de critério entre ideologias.** (a) Nos extremos de direita (Direita radical, Fascista), toda justificativa de "favor" começa com "Fonte histórica:". Em Comunista e Esquerda radical, os textos equivalentes (Lênin, Che, Fanon) não levam esse rótulo. (b) "Contra" de Liberal clássico e de Conservador só traz críticas de um mesmo lado (esquerda/progressista). (c) "Contra" de Direita nacional-conservadora associa a corrente ao autoritarismo com dois livros (Levitsky/Ziblatt e Snyder), enquanto correntes não extremas da esquerda não recebem tratamento equivalente. Detalhes na seção "Equilíbrio".

Também merece atenção: *Prebisch* (o texto saiu num documento da Cepal e no Brasil está numa coletânea; ver item) e *Quem somos nós?* (nenhuma tradução brasileira encontrada).

---

## Avaliação item a item

Colunas: **#** · **Título atual** · **Autor** · **Ano atual** · **Veredito** · **Problema** · **Proposta** · **Link proposto** · **Fonte da busca** (URL do resultado que sustenta a informação).

### 1. Esquerda radical

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | O Estado e a revolução | Vladimir Lênin | 1917 | **corrigir** | Escrito em agosto–setembro de 1917; 1ª edição em 1918. | Ano **1918** (ou "1917, publicado em 1918"). BR: Boitempo, 2017, ISBN 9788575595749 (créditos). | https://en.wikipedia.org/wiki/The_State_and_Revolution [B] | https://www.marxists.org/archive/lenin/works/1917/staterev/ ; https://en.wikipedia.org/wiki/The_State_and_Revolution |
| F2 | Os condenados da terra | Frantz Fanon | 1961 | manter | — | ISBN 9786559790845 (créditos, não reconferido) | — | não buscado |
| F3 | Pedagogia do oprimido | Paulo Freire | 1968 | manter (nota) | Manuscrito concluído no Chile em 1968. As fontes divergem sobre a 1ª edição impressa (espanhol em 1968 ou 1970; inglês em 1970). No Brasil saiu só em 1974 (Paz e Terra), por causa da censura. | Manter 1968 com a nota "concluído em 1968" ou trocar por 1970 (1ª edição em inglês, documentada). ISBN 9788577531646 (créditos). | https://revistas.pucsp.br/index.php/curriculum/article/view/39341 [B] | https://revistas.pucsp.br/index.php/curriculum/article/view/39341 ; https://www.skoob.com.br/book/11655568 |
| F4 | A guerra de guerrilhas | Ernesto Che Guevara | 1960 | manter | Edição brasileira não levantada. | Título original *La guerra de guerrillas* (créditos/OL). | https://openlibrary.org/works/OL63448W (créditos; não aberto) | não buscado |
| C1 | O homem revoltado | Albert Camus | 1951 | manter | — | OL nos créditos. | https://openlibrary.org/works/OL34944158W (créditos) | não buscado |
| C2 | A sociedade aberta e seus inimigos | Karl Popper | 1945 | manter | — | Itatiaia, ISBN 9788531900587 (créditos) | — | não buscado |
| C3 | Sobre a violência | Hannah Arendt | 1970 | manter | — | ISBN 9788520007891 (créditos) | — | não buscado |
| C4 | O ópio dos intelectuais | Raymond Aron | 1955 | manter | — | Vide, 2024, ISBN 9788595072343 (créditos) | — | não buscado |

### 2. Socialista democrático

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Como ser anticapitalista no século XXI? | Erik Olin Wright | 2019 | manter | — | Boitempo, 2019, ISBN 9788575597309 (créditos) | — | não buscado |
| F2 | Capital e ideologia | Thomas Piketty | 2019 | manter | — | BR: Intrínseca, 2020, ISBN 9788551006153 (uma única listagem de loja; confirmar) | https://www.touchelivros.com.br/capital-e-ideologia/ (loja) [B] | https://en.wikipedia.org/wiki/Capital_and_Ideology ; https://www.casasbahia.com.br/capital-e-ideologia/p/1560027775 |
| F3 | A ditadura do proletariado | Karl Kautsky | 1918 | manter | Edição brasileira confirmada. | Trad. Eduardo Sucupira Filho, Livraria Editora Ciências Humanas, São Paulo, 1979 (ISBN não encontrado). | https://www.marxists.org/portugues/kautsky/1918/mes/ditadura.htm [B] | idem |
| F4 | O Estado na sociedade capitalista | Ralph Miliband | 1969 | manter | Edição brasileira confirmada. | Zahar, Rio de Janeiro, 1972 (ISBN não encontrado). Original *The State in Capitalist Society* (1969). | — | https://www.marxists.org/portugues/poulantzas/1976/mes/40.pdf ; https://www.ifch.unicamp.br/criticamarxista/arquivos_biblioteca/nota10ralph.pdf |
| C1 | O cálculo econômico sob o socialismo | Ludwig von Mises | 1920 | manter (nota) | Originalmente um artigo acadêmico (1920). No Brasil saiu como livro avulso. | Manter. ISBN 9788581190075 (créditos). | — | não buscado |
| C2 | A revolução proletária e o renegado Kautsky | Vladimir Lênin | 1918 | manter | Sem ISBN brasileiro nos créditos. | Texto em português no marxists.org. | https://www.marxists.org/portugues/lenin/1918/renegado/cap01.htm [B] | idem |
| C3 | Capitalismo, socialismo e democracia | Joseph Schumpeter | 1942 | manter | — | Unesp, 2017, ISBN 9788539306916 (créditos) | — | não buscado |
| C4 | Os intelectuais e a sociedade | Thomas Sowell | 2010 | manter | Copyright de 2009, lançado em 5 de janeiro de 2010. As duas datas aparecem. | Manter 2010. ISBN 9788580330182 (créditos). | https://en.wikipedia.org/wiki/Intellectuals_and_Society [B] | idem ; https://search.icpl.org/Record/1346251 |

### 3. Social-democrata

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Socialismo evolucionário | Eduard Bernstein | 1899 | manter | — | Zahar, 1997, ISBN 9788571104037 (créditos) | — | não buscado |
| F2 | O mal ronda a terra | Tony Judt | 2010 | manter | — | Objetiva, 2011, ISBN 9788539002207 (créditos) | — | não buscado |
| F3 | Cidadania, classe social e status | T. H. Marshall | 1950 | manter | — | Créditos: Unesp, ISBN 9786557110386 (título da edição: "Cidadania e classe social"). Conferir qual título usar. | — | não buscado |
| F4 | The Three Worlds of Welfare Capitalism | Gøsta Esping-Andersen | 1990 | **corrigir justificativa** | Nenhuma edição brasileira em livro encontrada, então o título original está correto. A justificativa ("mostra como o nórdico reduz desigualdades") vende como defesa um livro que é sobretudo uma tipologia comparativa. | Sugestão: "Compara três tipos de Estado de bem-estar (liberal, conservador e social-democrata) e seus efeitos sobre desigualdade e mercado de trabalho." | https://search.worldcat.org/title/930601033 [B] | https://www.hksyu.edu.hk/catalog/991001727069707546 (Polity, 1990) |
| C1 | O caminho da servidão | Friedrich Hayek | 1944 | manter | — | ISBN 9788562816024 (créditos) | — | não buscado |
| C2 | Reforma ou revolução? | Rosa Luxemburgo | 1900 | **corrigir** | Folheto alemão de 1899 (artigos de 1898–1899; 2ª ed. revista em 1908). 1900 é a data da tradução inglesa. | Ano **1899**. Expressão Popular, ISBN 9788577433742 (créditos). | https://en.wikipedia.org/wiki/Social_Reform_or_Revolution%3F [B] | idem ; https://www.marxists.org/deutsch/archiv/luxemburg/1899/sozrefrev/index.htm |
| C3 | The Calculus of Consent | James Buchanan e Gordon Tullock | 1962 | manter | Nenhuma edição em português encontrada; título original correto. | University of Michigan Press, 1962. | https://about.libertyfund.org/books/the-calculus-of-consent/ [B] | idem ; https://library.usi.edu/record/36059 |
| C4 | Tempo comprado | Wolfgang Streeck | 2013 | manter | ISBN brasileiro não confirmado (busca sem resultado). | Original *Gekaufte Zeit* (2013). | — | busca sem resultado |

### 4. Esquerda progressista

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Uma teoria da justiça | John Rawls | 1971 | manter | Repetida em Libertário/contra. | Martins Fontes, ISBN 9788580632675 (créditos) | — | não buscado |
| F2 | Pequeno manual antirracista | Djamila Ribeiro | 2019 | manter | — | Companhia das Letras, ISBN 9788535932874 (créditos) | — | não buscado |
| F3 | Ensinando a transgredir | bell hooks | 1994 | manter | — | WMF, ISBN 9788546906826 (créditos) | — | não buscado |
| F4 | Justiça interrompida | Nancy Fraser | 1997 | manter | — | Boitempo, 2022, ISBN 9786557171264 (créditos) | — | não buscado |
| C1 | Tolos, fraudes e militantes | Roger Scruton | 2015 | manter | — | Record, 2018, ISBN 9788501113023 (créditos) | — | não buscado |
| C2 | O progressista de ontem e o do amanhã | Mark Lilla | 2017 | manter | — | Companhia das Letras, ISBN 9788535931549 (créditos) | — | não buscado |
| C3 | A loucura das massas | Douglas Murray | 2019 | manter | — | Record, 2021, ISBN 9788501118578 (créditos) | — | não buscado |
| C4 | Armadilha da identidade | Asad Haider | 2018 | manter | — | Veneta, ISBN 9788595712867 (créditos) | — | não buscado |

### 5. Ecologista

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Primavera silenciosa | Rachel Carson | 1962 | manter | — | ISBN 9788575552353 (créditos) | — | não buscado |
| F2 | Ideias para adiar o fim do mundo | Ailton Krenak | 2019 | manter | — | — | — | não buscado |
| F3 | O princípio responsabilidade | Hans Jonas | 1979 | manter | Edição brasileira confirmada; ISBN não encontrado. | Trad. Marijane Lisboa e Luiz Barros Montez, Contraponto / Ed. PUC-Rio, 2006. | — | https://bdjur.stj.jus.br/server/api/core/bitstreams/5b8c1850-fb98-44c1-8fbe-592cfd2d520a/content |
| F4 | Economia donut | Kate Raworth | 2017 | manter | — | — | — | não buscado |
| C1 | O ambientalista cético | Bjørn Lomborg | 2001 | **corrigir** | 1ª publicação em dinamarquês (*Verdens sande tilstand*) em 1998; a edição inglesa é de 2001. | Ano **1998** (ou "1998; ed. inglesa 2001"). BR: Elsevier (Campus), 2002, ISBN 9788535210583 (Goodreads). | https://en.wikipedia.org/wiki/The_Skeptical_Environmentalist [B] | idem ; https://www.goodreads.com/work/editions/1178741-the-skeptical-environmentalist-measuring-the-real-state-of-the-world |
| C2 | Apocalipse nunca | Michael Shellenberger | 2020 | manter | — | LVM, 2021, ISBN 9786586029390 (créditos) | — | não buscado |
| C3 | The Ultimate Resource | Julian Simon | 1981 | manter | Nenhuma edição em português encontrada; título original correto. | Edição revista: *The Ultimate Resource 2* (Princeton). | https://press.princeton.edu/books/paperback/9780691003818/the-ultimate-resource-2 [B] | idem |
| C4 | Factfulness | Hans Rosling | 2018 | manter | ISBN da edição brasileira não confirmado. | — | — | busca sem resultado BR |

### 6. Esquerda conservadora

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | A rebelião das elites e a traição da democracia | Christopher Lasch | 1995 | manter (nota) | Original de 1995 confirmado (W. W. Norton). **Edição brasileira com esse título não confirmada** em duas buscas. | Se não for confirmada, usar *The Revolt of the Elites and the Betrayal of Democracy*. | — | https://cclib.ucsd.edu/Library/details.aspx?ID=4200 |
| F2 | O que há de errado com o mundo | G. K. Chesterton | 1910 | manter | — | Ecclesiae, 2013, ISBN 9788563160287 (créditos) | — | não buscado |
| F3 | Escritos corsários | Pier Paolo Pasolini | 1975 | manter | — | Editora 34, 2020, ISBN 9788573267525 (créditos) | — | não buscado |
| F4 | Justiça: o que é fazer a coisa certa | Michael Sandel | 2009 | manter | — | — | — | não buscado |
| C1 | Sobre a liberdade | John Stuart Mill | 1859 | manter | Repetida em Liberal progressista. | ISBN 9788582850466 (créditos) | — | não buscado |
| C2 | Capitalismo e liberdade | Milton Friedman | 1962 | manter | — | Intrínseca, 2023, ISBN 9786555603927 (créditos) | — | não buscado |
| C3 | A virtude do egoísmo | Ayn Rand | 1964 | manter | — | LVM, 2022, ISBN 9786550520243 (créditos) | — | não buscado |
| C4 | Deus, um delírio | Richard Dawkins | 2006 | manter | — | Companhia das Letras, ISBN 9788535910704 (créditos) | — | não buscado |

### 7. Nacional-desenvolvimentista

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Formação econômica do Brasil | Celso Furtado | 1959 | manter | — | — | — | não buscado |
| F2 | Chutando a escada | Ha-Joon Chang | 2002 | manter | — | Unesp, 2004, ISBN 9788571395244 (créditos) | — | não buscado |
| F3 | O desenvolvimento econômico da América Latina e alguns de seus principais problemas | Raúl Prebisch | 1949 | **corrigir (forma de citar)** | É um documento da Cepal (E/CN.12/89, 14 de maio de 1949), não um livro próprio. Segundo uma das fontes, o título original nem tem "algunos". No Brasil está numa coletânea. | Manter o texto e indicar onde lê-lo: "em *O manifesto latino-americano e outros ensaios*, Contraponto / Centro Celso Furtado, 2011, ISBN 9788578660413". Ou trocar o item pela coletânea. | https://repositorio.cepal.org/entities/publication/52cebe3b-470b-4bb2-a7cc-49552192a760/full [B] | idem ; https://www.martinsfontespaulista.com.br/manifesto-latino-americano-e-outros-ensaios--o-704884/p ; https://editais.ufrr.br/editais/arquivo/1276/indicacao-de-leitura-para-a-prova-de-epi.pdf |
| F4 | O Estado empreendedor | Mariana Mazzucato | 2013 | manter | — | Portfolio-Penguin, 2014, ISBN 9788582850039. Subtítulo: "desmascarando o mito do setor público x setor privado". | https://www.companhiadasletras.com.br/livro/9788582850039/o-estado-empreendedor [B] | idem |
| C1 | A controvérsia do planejamento na economia brasileira | Eugênio Gudin e Roberto Simonsen | 1945 | **corrigir** | O debate foi em 1944–1945; o livro é uma coletânea organizada pelo Ipea/Inpes em **1977**. | Ano **1977** (justificativa: "debate de 1944–45"). 3ª ed. Ipea, 2010, ISBN 978-85-7811-044-4 (bate com os créditos). Autoria: Roberto Simonsen e Eugênio Gudin. | https://repositorio.ipea.gov.br/bitstream/11058/13737/1/a_controversia_do_planejamento_na_economia_brasileira.pdf [B] | idem ; https://revistas.ufg.br/reoeste/article/view/37695 |
| C2 | A lanterna na popa | Roberto Campos | 1994 | manter | — | Topbooks, ISBN 9788574752853 (créditos) | — | não buscado |
| C3 | Belíndia 2.0 | Edmar Bacha | 2012 | manter (nota) | Livro existe (Prêmio Jabuti 2013). Ano e editora (Civilização Brasileira, grupo Record) não confirmados diretamente. A descrição da editora fala de "trajetória econômica" e "temas desafiadores", então convém conferir se "críticas ao protecionismo e ao desenvolvimentismo" descreve bem o livro. | Título completo: *Belíndia 2.0: fábulas e ensaios sobre o país dos contrastes*. ISBN 9788520011461 (créditos). | https://www.record.com.br/en/products/belindia-2-0-fabulas-e-ensaios-sobre-o-pais-dos-contrastes [B] | idem |
| C4 | Por que o Brasil cresce pouco? | Marcos Mendes | 2014 | manter | — | Subtítulo: "desigualdade, democracia e baixo crescimento no país do futuro". Elsevier/Campus, 2014. ISBN 9788535278606 (créditos). | — | https://ojsrevista.furb.br/ojs/index.php/rbdr/article/download/6562/3583/20882 |

### 8. Centrista

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | A terceira via | Anthony Giddens | 1998 | manter (corrigir créditos) | O título está certo, mas **os créditos apontam outro livro**: ISBN 9788571397439 = *O debate global sobre a terceira via* (Unesp, 2007). Não encontrei esse livro na busca, mas o título registrado nos próprios créditos já mostra a diferença. | Edição certa: *A terceira via: reflexões sobre o impasse político atual e o futuro da social-democracia*, Record (5ª ed., 2005, no catálogo da PUC-SP). ISBN não confirmado. Trocar a capa. | https://buscaintegrada.pucsp.br/vufind/Record/246753 [B] | idem |
| F2 | A mente moralista | Jonathan Haidt | 2012 | manter | — | Alta Cult, 2020, ISBN 9788550813905 (créditos) | — | não buscado |
| F3 | Ética a Nicômaco | Aristóteles | -340 | manter (nota) | Data aproximada. A ligação com o "centrismo" político é por analogia (meio-termo entre vícios), não programática. | Exibir "c. 340 a.C.". | — | não buscado |
| F4 | Quatro ensaios sobre a liberdade | Isaiah Berlin | 1969 | manter | Edição brasileira não levantada. | — | — | não buscado |
| C1 | Sobre o político | Chantal Mouffe | 2005 | manter | — | WMF, ISBN 9788578279462 (créditos) | — | não buscado |
| C2 | Carta da prisão de Birmingham | Martin Luther King Jr. | 1963 | manter (nota) | É uma carta (abril de 1963), mas há edição avulsa brasileira recente: *Carta da prisão de Birmingham – um testemunho atemporal de fé, coragem e luta pelos direitos civis* (2026). Editora e ISBN não confirmados na busca; os créditos dizem Thomas Nelson Brasil, ISBN 9786552177117. | Manter. | https://www.martinsfontespaulista.com.br/carta-da-prisao-de-birmingham-–-um-testemunho-atemporal-de-fe--coragem-e-luta-pelos-direitos-civis-1204516/p (loja) [B] | idem |
| C3 | O extremo centro | Tariq Ali | 2015 | **corrigir** | Nenhuma edição brasileira encontrada. O cabeçalho do próprio arquivo manda usar o título original nesse caso. | ***The Extreme Centre: A Warning*** (Verso, 2015). | https://en.wikipedia.org/wiki/The_Extreme_Centre [B] | idem ; https://www.versobooks.com/products/171-the-extreme-centre |
| C4 | The Conscience of a Conservative | Barry Goldwater | 1960 | manter (nota) | Publicado em 1960 (Victor Publishing) em nome de Goldwater, mas escrito em grande parte por L. Brent Bozell Jr. | Opcional: "Barry Goldwater (com L. Brent Bozell Jr.)". | https://en.wikipedia.org/wiki/The_Conscience_of_a_Conservative [B] | idem ; https://www.gutenberg.org/etext/74319 |

### 9. Social-liberal

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Desenvolvimento como liberdade | Amartya Sen | 1999 | manter | — | ISBN 9788571649781 (créditos) | — | não buscado |
| F2 | A teoria geral do emprego, do juro e da moeda | John Maynard Keynes | 1936 | manter | — | Saraiva, ISBN 9788502180352 (créditos) | — | não buscado |
| F3 | Liberalismo | Leonard Hobhouse | 1911 | manter (nota) | Tradução brasileira confirmada (Rodrigo Jungmann, ISBN 9788556623256). A editora Jaguatirica, citada nos créditos, não apareceu na busca. Há também tradução acadêmica na revista *Princípios* (UFRN, 2022). | Manter. | https://www.periodicos.ufrn.br/principios/article/view/28868 [B] | https://www.martinsfontespaulista.com.br/liberalismo-1129693/p ; idem |
| F4 | A virtude soberana | Ronald Dworkin | 2000 | manter | — | WMF, ISBN 9788578274023 (créditos) | — | não buscado |
| C1 | Os fundamentos da liberdade | Friedrich Hayek | 1960 | manter | Os créditos usam só o OL inglês. | BR: trad. Anna Maria Capovilla e José Ítalo Stelle, Visão, São Paulo, 1983. | — | https://www.jornalopcao.com.br/opcao-cultural/destarte/fundamentos-da-liberdade-2-148138/ |
| C2 | A doutrina do choque | Naomi Klein | 2007 | manter | — | Nova Fronteira, 2008, ISBN 9788520920718 | https://www.skoob.com.br/book/60245 [B] | idem ; https://www.touchelivros.com.br/a-doutrina-do-choque/ |
| C3 | Liberalismo | Ludwig von Mises | 1927 | manter | — | LVM, 2010, ISBN 9788562816154 (créditos) | — | não buscado |
| C4 | O neoliberalismo: história e implicações | David Harvey | 2005 | manter | — | Loyola, ISBN 9788515035366 (créditos) | — | não buscado |

### 10. Democracia cristã

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Rerum Novarum | Papa Leão XIII | 1891 | manter (nota) | Encíclica, não livro, mas publicada em volume avulso (Paulinas). | Paulinas, ISBN 9788535613001 (créditos) | — | não buscado |
| F2 | O homem e o Estado | Jacques Maritain | 1951 | manter | Original em inglês de 1951 confirmado. Tradução de Alceu Amoroso Lima, Agir (4ª ed. 1966). Ano da 1ª edição brasileira não confirmado. | — | — | https://seer.sis.puc-campinas.edu.br/reflexao/article/download/11705/9086/40693 ; https://www.jfpe.jus.br/biblioteca/ (PDF da busca) |
| F3 | Mater et Magistra | Papa João XXIII | 1961 | manter (nota) | Encíclica com volume avulso (Paulinas). | ISBN 9788535613018 (créditos) | — | não buscado |
| F4 | O personalismo | Emmanuel Mounier | 1949 | manter (nota) | Original *Le personnalisme* (1949) confirmado. **Edição em português não confirmada** (só aparece em citações acadêmicas). | — | — | https://www.infopedia.pt/artigos/$emmanuel-mounier |
| C1 | O liberalismo político | John Rawls | 1993 | manter | — | WMF, ISBN 9788578273828 (créditos) | — | não buscado |
| C2 | Deus não é grande | Christopher Hitchens | 2007 | manter | — | Globo, ISBN 9788525059123 (créditos) | — | não buscado |
| C3 | Crítica da filosofia do direito de Hegel: introdução | Karl Marx | 1844 | **corrigir** | A "Introdução" é um artigo publicado nos *Anais Franco-Alemães* (fevereiro de 1844), não um livro. No Brasil está no volume Boitempo junto com o manuscrito de 1843. | Título ***Crítica da filosofia do direito de Hegel*** (Boitempo, 1ª ed. 2005, trad. Rubens Enderle e Leonardo de Deus), com a justificativa "inclui a introdução de 1844, onde Marx chama a religião de 'ópio do povo'". Ano: 1844 (introdução) ou 1843–44. Os créditos dizem "Boitempo, 2010", ISBN 9788575591512, que deve ser uma reimpressão; conferir. | https://blogdaboitempo.com.br/wp-content/uploads/2021/04/24-marx-critica-da-filosofia-do-direito-de-hegel-introducao-1844.pdf [B] | idem ; https://www.skoob.com.br/book/581220 ; https://www.marxists.org/portugues/dicionario/verbetes/d/deutsch-franz_jahrb.htm |
| C4 | O anticristo | Friedrich Nietzsche | 1895 | manter | Escrito em 1888, publicado em 1895; o ano atual está certo. | ISBN 9788525417916 (créditos) | — | não buscado |

### 11. Liberal progressista

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | O novo Iluminismo | Steven Pinker | 2018 | manter | Dois livros do mesmo autor na mesma lista "favor". | Considerar trocar um dos dois Pinker (ver Equilíbrio). | — | não buscado |
| F2 | Sobre a liberdade | John Stuart Mill | 1859 | manter | Repetida. | — | — | não buscado |
| F3 | Os anjos bons da nossa natureza | Steven Pinker | 2011 | **corrigir justificativa** | "Mostra com dados a queda da violência" apresenta como fato uma tese debatida (a tendência de longo prazo e o tratamento de guerras raras são contestados na literatura). | "Argumenta, com séries históricas, que a violência caiu ao longo da história e atribui isso à razão e às instituições liberais." | — | não buscado (ajuste de redação) |
| F4 | Progresso: dez razões para acreditar no futuro | Johan Norberg | 2016 | manter | — | Record, 2017, ISBN 9788501109156 (créditos) | — | não buscado |
| C1 | A tirania do mérito | Michael Sandel | 2020 | manter | — | — | — | não buscado |
| C2 | Por que o liberalismo fracassou? | Patrick Deneen | 2018 | manter | — | Âyiné, ISBN 9788592649593 (créditos) | — | não buscado |
| C3 | Depois da virtude | Alasdair MacIntyre | 1981 | manter | — | Vide, 2021, ISBN 9786587138275 (créditos) | — | não buscado |
| C4 | A cultura do narcisismo | Christopher Lasch | 1979 | manter | — | Fósforo, 2023, ISBN 9786584568358 (créditos) | — | não buscado |

### 12. Liberal clássico

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | A riqueza das nações | Adam Smith | 1776 | manter | — | Vide, 2023, ISBN 9788595071858 (créditos) | — | não buscado |
| F2 | A lei | Frédéric Bastiat | 1850 | manter (nota) | Originalmente um panfleto, publicado em volume avulso. | LVM, ISBN 9788593751554 (créditos) | — | não buscado |
| F3 | Segundo tratado sobre o governo | John Locke | 1689 | manter | A folha de rosto traz 1690, mas a obra circulou em dezembro de 1689; as duas datas são usadas. | Edipro, 2014, ISBN 9788572838412 (créditos) | — | não buscado |
| F4 | A democracia na América | Alexis de Tocqueville | 1835 | manter | 1835 é o vol. 1 (o vol. 2 é de 1840). | ISBN 9788533611511 (créditos) | — | não buscado |
| C1 | A grande transformação | Karl Polanyi | 1944 | manter | Repetida em Anarcocapitalista. | ISBN 9786556390109 (créditos) | — | não buscado |
| C2 | O capital no século XXI | Thomas Piketty | 2013 | **corrigir justificativa** | "Mostra com dados que, sem intervenção, a riqueza tende a se concentrar" trata como fato demonstrado uma tese (r > g) que é debatida entre economistas. | "Argumenta, com séries históricas de renda e patrimônio, que sem intervenção a riqueza tende a se concentrar." | — | não buscado (ajuste de redação) |
| C3 | A sociedade afluente | John Kenneth Galbraith | 1958 | manter | — | Pioneira, 1987, ISBN 9788522199617 (créditos) | — | não buscado |
| C4 | O preço da desigualdade | Joseph Stiglitz | 2012 | manter (nota) | Só encontrei a edição **portuguesa** (Bertrand, Lisboa, 2013, ISBN 9789722525589). Edição brasileira não confirmada. | — | — | https://www.touchelivros.com.br/o-preco-da-desigualdade/ ; https://ihu.unisinos.br/noticias/549013-o-preco-da-desigualdade- |

### 13. Libertário

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Anarquia, Estado e utopia | Robert Nozick | 1974 | manter | Aparece 3 vezes no total. | WMF, ISBN 9788578274504 (créditos) | — | não buscado |
| F2 | Livre para escolher | Milton e Rose Friedman | 1980 | manter | — | Record, 2015, ISBN 9788501103666 (créditos) | — | não buscado |
| F3 | A revolta de Atlas | Ayn Rand | 1957 | manter | — | — | — | não buscado |
| F4 | A desobediência civil | Henry David Thoreau | 1849 | manter (nota) | Ensaio de 1849 (como "Resistance to Civil Government"), hoje publicado em volume avulso; é um clássico reconhecido. | ISBN 9788563560513 (créditos) | — | não buscado |
| C1 | O que o dinheiro não compra | Michael Sandel | 2012 | manter | — | Civilização Brasileira, ISBN 9788520011485 (créditos) | — | não buscado |
| C2 | A política da prudência | Russell Kirk | 1993 | manter | — | É Realizações, 2013, ISBN 9788580331448 (créditos) | — | não buscado |
| C3 | Uma teoria da justiça | John Rawls | 1971 | manter | Repetida. | — | — | não buscado |
| C4 | Self-Ownership, Freedom, and Equality | G. A. Cohen | 1995 | manter | Sem edição brasileira conhecida; título original correto. | — | — | não buscado |

### 14. Liberal-conservador

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Reflexões sobre a revolução na França | Edmund Burke | 1790 | manter | — | Vide, 2017, ISBN 9788595070073 (créditos) | — | não buscado |
| F2 | Como ser um conservador | Roger Scruton | 2014 | manter | — | — | — | não buscado |
| F3 | Conflito de visões | Thomas Sowell | 1987 | manter | — | É Realizações, 2012, ISBN 9788580330717 (créditos) | — | não buscado |
| F4 | O liberalismo: antigo e moderno | José Guilherme Merquior | 1991 | manter | — | — | — | não buscado |
| C1 | Por que não sou um conservador | Friedrich Hayek | 1960 | **corrigir** | **Confirmado: é o posfácio** de *The Constitution of Liberty* (1960), não um livro. Existe reedição avulsa em inglês (CIS, Austrália), mas não encontrei edição avulsa em português. | Citar ***Os fundamentos da liberdade*** (Visão, 1983) com a justificativa "no posfácio 'Por que não sou um conservador'…". Como esse livro já está em Social-liberal/contra, uma alternativa é mover o posfácio pra Conservador/contra (ver Equilíbrio). | https://www.cis.org.au/app/uploads/2015/07/op41.pdf [B] | https://www.cis.org.au/?p=20056 ; https://www.jornalopcao.com.br/opcao-cultural/destarte/fundamentos-da-liberdade-2-148138/ |
| C2 | Nas ruínas do neoliberalismo | Wendy Brown | 2019 | manter | — | — | — | não buscado |
| C3 | A crise de legitimação no capitalismo tardio | Jürgen Habermas | 1973 | manter (nota) | Original de 1973 confirmado. Título e editora no Brasil não confirmados: uma fonte cita "Problemas de legitimação no capitalismo tardio" (1978), outras usam o título atual. | Conferir no catálogo da Biblioteca Nacional. | — | https://periodicos.ufes.br/sinais/article/view/18456/12472 |
| C4 | 23 coisas que não nos contaram sobre o capitalismo | Ha-Joon Chang | 2010 | manter | — | Cultrix, 2013, ISBN 9788531612206 (créditos) | — | não buscado |

### 15. Conservador

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | A mentalidade conservadora | Russell Kirk | 1953 | manter | — | É Realizações, 2020, ISBN 9786586217230 (créditos) | — | não buscado |
| F2 | Sobre ser conservador | Michael Oakeshott | 1956 | **corrigir** | **Confirmado: ensaio** (conferência de 1956, depois reunida em *Rationalism in Politics*, Methuen, 1962). Há edição brasileira em livro com o título *Conservadorismo* (2016, 194 p.), que reúne "O racionalismo na política", "As massas na democracia representativa" e "Ser conservador". | Título ***Conservadorismo*** (inclui "Ser conservador"), ano **1962** (coletânea) ou "1956 (ensaio)". ISBN **9788592649081**. Editora não confirmada; o prefixo 85-92649 é o mesmo do ISBN da Âyiné nos créditos (Deneen), o que **sugere** Âyiné. | https://www.martinsfontespaulista.com.br/conservadorismo-820334/p (loja) [B] | idem ; https://www.goodreads.com/book/show/33539000 ; https://plato.stanford.edu/archives/Win2023/entries/oakeshott/ |
| F3 | Ortodoxia | G. K. Chesterton | 1908 | manter | — | ISBN 9788573255058 (créditos) | — | não buscado |
| F4 | Considerações sobre a França | Joseph de Maistre | 1797 | **corrigir** | A Wikipédia e a maioria das fontes dão **1796** (Lausanne). Algumas edições trazem 1797. | Ano **1796**. Créditos: Resistência Cultural, 2025, ISBN 9786599442025. | https://en.wikipedia.org/wiki/Considerations_on_France [B] | idem |
| C1 | A retórica da intransigência | Albert O. Hirschman | 1991 | manter | — | Companhia das Letras, 2019, ISBN 9788535932362 (créditos) | — | não buscado |
| C2 | O segundo sexo | Simone de Beauvoir | 1949 | manter | — | Nova Fronteira, 2009, ISBN 9788520922835 (créditos) | — | não buscado |
| C3 | Os direitos do homem | Thomas Paine | 1791 | manter | 1791 é a parte I (a parte II é de 1792). | Vozes, 2019, ISBN 9788532660374 (créditos) | — | não buscado |
| C4 | História da sexualidade I: a vontade de saber | Michel Foucault | 1976 | manter | — | Paz e Terra, 2020, ISBN 9788577534500 (créditos) | — | não buscado |

### 16. Direita nacional-conservadora

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | The Virtue of Nationalism | Yoram Hazony | 2018 | manter | Nenhuma edição brasileira encontrada; título original correto. | Basic Books, 2018. | https://en.wikipedia.org/wiki/The_Virtue_of_Nationalism [B] | idem |
| F2 | O mínimo que você precisa saber para não ser um idiota | Olavo de Carvalho | 2013 | manter | Coletânea de artigos organizada como livro; a justificativa já diz isso. | — | — | não buscado |
| F3 | Populações meridionais do Brasil | Oliveira Vianna | 1920 | manter | **Refutado o apontamento anterior: é livro.** O 1º volume saiu em 1920, editado por Monteiro Lobato. Há edições da Câmara (1981) e do Senado (2005). | Manter. | https://revistas.ufg.br/teoria/article/view/28282 [B] | https://www.e-publicacoes.uerj.br/index.php/intellectus/article/view/74002 ; https://revistas.ufg.br/teoria/article/view/28282 |
| F4 | Quem somos nós? | Samuel Huntington | 2004 | **corrigir** | Três buscas não encontraram tradução brasileira (só a espanhola *¿Quiénes somos?* e a francesa *Qui sommes-nous?*). A Objetiva publicou outro livro dele (*O choque de civilizações*). | Usar ***Who Are We? The Challenges to America's National Identity*** (Simon & Schuster, 2004), a menos que alguém confirme a edição brasileira. | — | https://www.lecturalia.com/libro/81875/quienes-somos-los-desafios-a-la-identidad-nacional-estadounidense ; https://bibliotheques-numeriques.defense.gouv.fr/impression/document/49267f06-8278-4ce7-921f-d64a6f492d3f |
| C1 | Como as democracias morrem | Steven Levitsky e Daniel Ziblatt | 2018 | manter | Ver Equilíbrio (associação com autoritarismo). | Zahar, 2018, ISBN 9788537818008 (créditos) | — | não buscado |
| C2 | Comunidades imaginadas | Benedict Anderson | 1983 | manter | — | ISBN 9788535911886 (créditos) | — | não buscado |
| C3 | Identidade e violência | Amartya Sen | 2006 | manter | — | Iluminuras, 2015, ISBN 9788573214703 (créditos) | — | não buscado |
| C4 | Sobre a tirania | Timothy Snyder | 2017 | manter | Ver Equilíbrio. | Companhia das Letras, 2017, ISBN 9788535929188 (créditos) | — | não buscado |

### 17. Direita radical

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | O conceito do político | Carl Schmitt | 1932 | manter (corrigir créditos) | O livro é de 1932 (houve uma versão em artigo em 1927, que esta busca não confirmou). **Os créditos usam uma edição portuguesa** (Edições 70, ISBN 9789724418247, prefixo 972 = Portugal). | Edição brasileira: trad. Álvaro Valls, Vozes, Petrópolis, 1992 (ISBN não encontrado). | — | https://seer.ufrgs.br/index.php/ppgdir/article/download/35141/29871/194510 |
| F2 | A decadência do Ocidente | Oswald Spengler | 1918 | manter (nota) | Vol. 1 de 1918, vol. 2 de 1922 (confirmado). Edição brasileira não confirmada. | — | — | https://www.polifemo.com/libros/la-decadencia-de-occidente-i-bosquejo-de-una-morfologia-de-la-historia-universal/117598/ |
| F3 | Tempestades de aço | Ernst Jünger | 1920 | manter | — | Carambaia, 2024, ISBN 9786554610629 (créditos) | — | não buscado |
| F4 | Psicologia das multidões | Gustave Le Bon | 1895 | manter (nota) | Existe tradução em português com esse título (Delraux, Portugal, 1980). Edição brasileira não confirmada. | — | — | https://ribac.cimac.pt/Record/bma_830/Description |
| C1 | O fascismo eterno | Umberto Eco | 1995 | manter | Nasceu como conferência e artigo (1995), mas há livro avulso brasileiro. | Record, 2018, trad. Eliana Aguiar, 64 p., ISBN **9788501116154** (os créditos só têm o OL inglês). | https://www.record.com.br/en/products/o-fascismo-eterno [B] | idem ; https://literaturabrasileira.ufsc.br/documentos/?id=235466 |
| C2 | Como funciona o fascismo | Jason Stanley | 2018 | manter | — | L&PM, 2018, ISBN 9788525438201 (créditos) | — | não buscado |
| C3 | Estudos sobre a personalidade autoritária | Theodor Adorno e outros | 1950 | manter | — | Unesp, 2019, ISBN 9788539308156 (créditos) | — | não buscado |
| C4 | LTI: a linguagem do Terceiro Reich | Victor Klemperer | 1947 | manter | — | Contraponto, 2009, ISBN 9788578660161 (confere com os créditos) | https://www.skoob.com.br/book/57235 [B] | idem ; https://periodicos.ufmg.br/index.php/maaravi/article/view/23878 |

### 18. Comunista

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Manifesto do Partido Comunista | Karl Marx e Friedrich Engels | 1848 | manter | Manifesto, mas publicado como folheto avulso desde 1848 e reconhecido como livro. | ISBN 9788585934231 (créditos) | — | não buscado |
| F2 | O capital | Karl Marx | 1867 | manter | 1867 é o livro I. | ISBN 9788575595534 (créditos) | — | não buscado |
| F3 | O imperialismo, fase superior do capitalismo | Vladimir Lênin | 1917 | manter | — | Centauro, 2002, ISBN 9788588208407 (créditos) | — | não buscado |
| F4 | A origem da família, da propriedade privada e do Estado | Friedrich Engels | 1884 | manter | — | BestBolso, 2014, ISBN 9788577992317 (créditos) | — | não buscado |
| C1 | A revolução dos bichos | George Orwell | 1945 | manter | — | ISBN 9788535909555 (créditos) | — | não buscado |
| C2 | Arquipélago Gulag | Alexander Soljenítsin | 1973 | manter | 1973 é o vol. 1. | Carambaia, 2019, ISBN 9788569002666 (créditos) | — | não buscado |
| C3 | O zero e o infinito | Arthur Koestler | 1940 | manter | — | Amarilys, 2013, ISBN 9788520435946 (créditos) | — | não buscado |
| C4 | A nova classe | Milovan Djilas | 1957 | manter (nota) | Ano 1957 confirmado (ed. francesa da Plon e espanhola da Edhasa, 1957). Edição brasileira não confirmada. | — | — | https://opac.amsab.be/Record/300009808 ; https://www.marxists.org/portugues/brendel/1958/01/40.htm |

### 19. Anarquista

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Ajuda mútua | Piotr Kropotkin | 1902 | manter | — | ***Ajuda mútua: um fator de evolução***, trad. Waldyr Azevedo Jr., A Senhora Editora, São Sebastião, 2009, ISBN 978-85-88549-05-0 (visto num PDF da ficha; confirmar) | https://www.marxists.org/portugues/kropotkin/1902/mes/90.pdf [B] | idem |
| F2 | O que é a propriedade? | Pierre-Joseph Proudhon | 1840 | manter | — | Martins Fontes, 1997, 248 p. (listagem de loja; ISBN não encontrado) | — | https://www.touchelivros.com.br/o-que-e-a-propriedade/ |
| F3 | Deus e o Estado | Mikhail Bakunin | 1882 | manter | Obra póstuma (1882), compilada a partir de um manuscrito; está publicada como livro. | Hedra, 2011, ISBN 9788577152391 (créditos) | — | não buscado |
| F4 | A anarquia | Errico Malatesta | 1891 | manter | — | Trad. Plínio Augusto Coelho, Imaginário (com Nu-Sol), série "Escritos anarquistas", 84 p., ISBN 978-85-85362-43-0 (ano não informado) | https://www.rebal.info/vufind/Record/cira.14828/Description [B] | idem |
| C1 | Sobre a autoridade | Friedrich Engels | 1872 | **substituir** | **Confirmado: artigo** de poucas páginas, escrito em 1872 e publicado no *Almanacco Repubblicano per l'anno 1874* (que saiu em dezembro de 1873). No Brasil aparece só em coletânea (*Obras escolhidas*, Vitória, 1961, v. 2). | Ver seção de substituições. Se preferirem manter, corrigir o ano para 1873/1874 e indicar a coletânea. | https://www.marxists.org/portugues/marx/1873/03/autoridade-pt.htm [B] | idem ; https://www.marxists.org/portugues/marx/escolhidas/vitoria.htm ; https://theanarchistlibrary.org/library/judgesabo-read-on-authority |
| C2 | Leviatã | Thomas Hobbes | 1651 | manter | Repetido em Anarcocapitalista. | ISBN 9788544000014 (créditos) | — | não buscado |
| C3 | Miséria da filosofia | Karl Marx | 1847 | manter | — | ISBN 9788572327312 (créditos) | — | não buscado |
| C4 | Anarquia, Estado e utopia | Robert Nozick | 1974 | manter | Repetido. | — | — | não buscado |

### 20. Anarcocapitalista

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | Por uma nova liberdade | Murray Rothbard | 1973 | manter | **Título brasileiro confirmado.** Nos créditos, a editora deve ser corrigida. | ***Por uma nova liberdade: o manifesto libertário***, Instituto Ludwig von Mises Brasil, 2013, ISBN 978-85-8119-060-0 (os créditos dizem "LVM Editora, 2013"; a LVM aparece no e-book de 2017). | https://en.wikipedia.org/wiki/For_a_New_Liberty [B] | idem ; https://www.skoob.com.br/book/809722 |
| F2 | Democracia, o deus que falhou | Hans-Hermann Hoppe | 2001 | manter | — | LVM, 2014, ISBN 9788581190792 (créditos) | — | não buscado |
| F3 | The Machinery of Freedom | David Friedman | 1973 | manter (nota) | Existe tradução em português, *As engrenagens da liberdade: guia para um capitalismo radical* (bibliografia da Wikiberal), mas editora e ano não foram confirmados. | Se confirmada, usar o título em português. | https://wikiberal.org/wiki/David_Friedman_(bibliographie) [B] | idem |
| F4 | Da produção de segurança | Gustave de Molinari | 1849 | manter (nota) | Artigo do *Journal des Économistes* (fevereiro de 1849), mas está publicado em livro avulso no Brasil e é o texto clássico da corrente. | LVM, 2014, ISBN 9788581190839 (créditos) | https://coppetinstitute.org/?p=136 [B] | idem |
| C1 | Anarquia, Estado e utopia | Robert Nozick | 1974 | manter | Terceira aparição; ver Equilíbrio. | — | — | não buscado |
| C2 | Dívida: os primeiros 5.000 anos | David Graeber | 2011 | manter | — | Três Estrelas, 2016, ISBN 9788568493144 (créditos) | — | não buscado |
| C3 | Leviatã | Thomas Hobbes | 1651 | manter | Repetido. | — | — | não buscado |
| C4 | A grande transformação | Karl Polanyi | 1944 | manter | Repetido. | — | — | não buscado |

### 21. Fascista

| # | Título atual | Autor | Ano | Veredito | Problema | Proposta | Link | Fonte da busca |
|---|---|---|---|---|---|---|---|---|
| F1 | A doutrina do fascismo | Benito Mussolini e Giovanni Gentile | 1932 | manter | **Refutado o apontamento anterior (parcialmente).** Saiu primeiro como verbete da *Enciclopedia Italiana* (vol. 14, 1932), mas no mesmo ano virou livro (Treves, Milão, 1932). Gentile escreveu a 1ª parte e Mussolini a 2ª; a autoria dupla está correta. Há edição brasileira. | Nova Fronteira, 2019, junto com *Fascismo: o que é e como combatê-lo*, de Trótski, prefácio de Alberto da Costa e Silva, 104 p., ISBN 9788520944103 (Skoob). Vale avisar que a edição brasileira traz uma crítica junto. | https://en.wikipedia.org/wiki/The_Doctrine_of_Fascism [B] | idem ; https://www.skoob.com.br/book/863009 ; https://www.goodreads.com/book/show/45732967 |
| F2 | Manifesto de Outubro | Plínio Salgado | 1932 | **substituir** | Manifesto de lançamento da AIB (7 de outubro de 1932), lido publicamente. É documento curto; não achei edição avulsa em livro. | Ver substituições. | — | https://www.historiadomundo.com.br/idade-contemporanea/a-simbologia-do-integralismo.htm ; https://revista.uniabeu.edu.br/index.php/reconcavo/article/download/265/pdf_119 |
| F3 | Manifesto dos intelectuais fascistas | Giovanni Gentile | 1925 | **substituir** | **Confirmado: texto de jornal** (21 de abril de 1925), redigido por Gentile e assinado por cerca de 250 intelectuais. Não é livro; sem edição brasileira. | Ver substituições. | https://en.wikipedia.org/wiki/Manifesto_of_the_Fascist_Intellectuals [B] | idem ; https://www.studenti.it/manifesto-intellettuali-fascisti-e-antimanifesto-spiegazione-principi-confronto.html |
| F4 | O Estado moderno | Miguel Reale | 1934 | manter | **Refutado o apontamento anterior: é livro.** José Olympio, Rio de Janeiro, 1934, com quatro ensaios. Reeditado em *Obras políticas: primeira fase (1931–1937)*, UnB, 1983. | Título completo: ***O Estado moderno: liberalismo, fascismo, integralismo***. | https://periodicos.ufpe.br/revistas/politicahoje/article/view/231710 [B] | idem ; https://revistas.usp.br/rfdsp/article/download/65372/67977/86424 |
| C1 | Origens do totalitarismo | Hannah Arendt | 1951 | manter | — | ISBN 9788571640658 (créditos) | — | não buscado |
| C2 | É isto um homem? | Primo Levi | 1947 | manter | — | Rocco, ISBN 9788532503466 (créditos) | — | não buscado |
| C3 | A anatomia do fascismo | Robert Paxton | 2004 | manter | — | Paz e Terra, 2008, ISBN 9788577530144 (créditos) | — | não buscado |
| C4 | M, o filho do século | Antonio Scurati | 2018 | manter | — | Intrínseca, 2019, trad. Marcello Lino, ISBN **9788551006078** (os créditos só têm o OL italiano) | — | https://dblit.ufsc.br/documentos/?id=229477 ; https://www.touchelivros.com.br/m-o-filho-do-seculo/ |

---

## Equilíbrio (critério 5)

**Critério desigual entre extremos (o mais importante).** O comentário no topo de `leituras.js` diz que nos extremos "favor" traz fontes históricas. Na prática:
- Em Direita radical e Fascista, as 8 justificativas de "favor" começam com "Fonte histórica:".
- Em Comunista e Esquerda radical, nenhuma tem esse rótulo. Por exemplo, Che: "Manual que defende a luta armada…"; Lênin: "Defende que o Estado capitalista…".
- Proposta: adotar a mesma convenção nos quatro extremos (rotular os quatro, ou nenhum).

**"Contra" vindo de um lado só:**
- **Liberal clássico/contra:** Polanyi, Piketty, Galbraith e Stiglitz são todos críticas pela esquerda, e três tratam basicamente do mesmo tema (desigualdade e regulação). Falta uma crítica conservadora ou comunitarista. Sugestão: trocar Galbraith ou Stiglitz por *Por que o liberalismo fracassou?* (Deneen, já usado em outra lista) ou *A política da prudência* (Kirk).
- **Conservador/contra:** Hirschman, Beauvoir, Paine e Foucault são todos de matriz progressista ou radical. Falta a crítica liberal de mercado. O candidato natural é o posfácio de Hayek ("Por que não sou um conservador", via *Os fundamentos da liberdade*), que hoje está em Liberal-conservador, onde o alvo do texto (o conservador puro) fica menos claro.
- **Ecologista/contra:** os quatro vêm do mesmo campo (otimismo tecnológico e pró-crescimento). Pela regra "de lados diferentes", caberia uma crítica pela esquerda ao ambientalismo de mercado. Não busquei um título específico, então nenhuma sugestão aqui foi verificada.
- **Direita nacional-conservadora/contra:** dois dos quatro (*Como as democracias morrem* e *Sobre a tirania*) enquadram a corrente como ameaça autoritária. Nenhuma corrente não extrema da esquerda recebe esse tipo de "contra". Sugestão: trocar um deles por uma crítica de conteúdo, como uma crítica liberal de mercado ao protecionismo ou ao nacionalismo econômico, ou uma crítica cosmopolita. Nenhum título foi verificado.

**Repetições que diminuem a variedade:** Nozick aparece 3 vezes. Anarcocapitalista/contra tem 3 obras repetidas de outras listas (Nozick, Hobbes, Polanyi), e Anarquista/contra tem outras 2 (Hobbes, Nozick). Em Liberal progressista/favor há dois livros de Pinker. Sugestão: trocar um Pinker e uma das repetições em Anarcocapitalista.

**Acesso desigual em português:**
- Ficam sem edição brasileira (título em inglês) sobretudo obras da direita e do liberalismo: Hazony, Goldwater, Huntington (se não confirmar), D. Friedman, Buchanan/Tullock, Julian Simon. Do lado progressista e de esquerda: Esping-Andersen, G. A. Cohen e Tariq Ali.
- Fascista/favor junta textos curtos e difíceis de achar (2 manifestos), enquanto Comunista/favor tem 4 livros clássicos com edição brasileira. Parte disso reflete a realidade editorial e não precisa ser "corrigida" à força. Mas as duas trocas propostas abaixo reduzem a diferença.

**Redação que trata tese contestada como fato:** "Mostra com dados" aparece em Piketty, Pinker (*Anjos bons*) e Rosling. Para Piketty e Pinker proponho "argumenta, com dados/séries históricas". Rosling ("muitas coisas melhoram") é menos controverso e pode ficar. Pra manter a regra de neutralidade do `CONTRIBUTING.md`, vale usar "mostra" só pra resultado consensual e "argumenta" pra tese em disputa, igualmente nos dois lados. Exemplos do outro lado que também merecem revisão de tom: "Chutando a escada: Mostra que…" e "O Estado empreendedor: Mostra que…".

**Observações menores sobre justificativas:**
- *Ética a Nicômaco* em Centrista: o "meio-termo" de Aristóteles é ético, não um programa político. A justificativa está correta, mas a ligação é por analogia.
- *Belíndia 2.0*: conferir se "reúne críticas… ao protecionismo e ao desenvolvimentismo" é fiel. A descrição da editora é mais ampla.
- *A controvérsia do planejamento*: como livro, é um debate com os dois lados, não só uma crítica. A justificativa atual já explica isso, o que é bom.

---

## Propostas de substituição (itens a substituir)

| Item atual | Proposta | Autor | Ano | Por quê / dados | Link (status) | Fonte da busca |
|---|---|---|---|---|---|---|
| Anarquista/contra: *Sobre a autoridade* (Engels) | ***Anarchism and Socialism*** (*Anarquismo e socialismo*) | G. V. Plekhanov | 1894 | Crítica marxista ao anarquismo publicada como brochura própria (alemão, 1894; ed. inglesa 1895). O título em português circula (dicionário do marxists.org), mas **não confirmei uma edição brasileira**: usar o título original até confirmar. Alternativa sem custo: deixar só *Miséria da filosofia* como crítica marxista e trazer uma crítica de outro campo. | https://gutenberg.org/cache/epub/30506/pg30506-images.html [B] | idem ; https://www.marxists.org/archive/plekhanov/1895/anarch/preface.htm ; https://www.marxists.org/portugues/dicionario/verbetes/p/plekhanov.htm |
| Fascista/favor: *Manifesto dos intelectuais fascistas* (Gentile) | ***Origini e dottrina del fascismo*** | Giovanni Gentile | 1929 | Livro de Gentile em que ele expõe a doutrina (2ª ed. 1929, a partir do ensaio *L'essenza del fascismo*, 1928; 3ª ed. 1934). Tradução inglesa *Origins and Doctrine of Fascism* (Transaction, 2002, trad. A. James Gregor). Sem edição brasileira conhecida. Obs.: as fontes não fecham se a 1ª edição é de 1928 ou 1929. | https://eld.bl.uk/catalog/018422583 [B] | https://www.goodreads.com/work/editions/340087-origins-and-doctrine-of-fascism-with-selections-from-other-works ; https://lib.ecu.edu/catalog-preview/catalog/886530 ; https://prestatest.bazzacco.net/libri/440687-origini-e-dottrina-del-fascismo-9788885574434.html |
| Fascista/favor: *Manifesto de Outubro* (Plínio Salgado) | ***Integralismo: o fascismo brasileiro na década de 30*** | Hélgio Trindade | 1974 | Estudo clássico da Ação Integralista Brasileira (Difel, São Paulo, 1974, 388 p.; 2ª ed. Difel/UFRGS, 1979), traduzido da tese do autor (Paris I, 1971). É uma **análise**, não uma fonte doutrinária; o cabeçalho de `leituras.js` admite "fontes históricas e análises" nos extremos. Se preferirem uma fonte primária, o *Estado moderno* de Reale já cumpre esse papel na lista. Não usei o título *O que é o integralismo* (Salgado) porque a busca só confirmou uma palestra com esse nome, não um livro. | https://www.scielo.br/j/rae/a/3gyNF765nj8nsRtD5vVnYGn/ [B] | idem ; https://ojs.uel.br/revistas/uel/index.php/antiteses/article/view/16788 |

## Correções em `ferramentas/creditos-imagens.json` (só créditos e capas)

1. **A terceira via (Giddens):** o ISBN 9788571397439 corresponde a *O debate global sobre a terceira via* (Unesp, 2007), outro livro. A capa provavelmente está errada. Edição certa: Record (ISBN não confirmado).
2. **O conceito do político (Schmitt):** a edição Edições 70 (ISBN 972…) é portuguesa. A brasileira é da Vozes, 1992.
3. **Por uma nova liberdade (Rothbard):** a editora da edição impressa de 2013 é o Instituto Ludwig von Mises Brasil, não a LVM Editora.
4. **A doutrina do fascismo:** o campo `titulo_ed` está truncado ("A Doutrina Benito Mussolini e Fascismo o Que é e Como Combatê-lo"). A edição reúne Mussolini e Trótski.
5. **Crítica da filosofia do direito de Hegel:** os créditos dizem "Boitempo, 2010". A 1ª edição é de 2005; conferir se 2010 é a reimpressão.
6. **ISBNs brasileiros que podem entrar no lugar do OL estrangeiro:** *O ambientalista cético* 9788535210583; *O fascismo eterno* 9788501116154; *M, o filho do século* 9788551006078; *O Estado empreendedor* 9788582850039; *A doutrina do choque* 9788520920718; *A anarquia* 978-85-85362-43-0; *Ajuda mútua* 978-85-88549-05-0; *Capital e ideologia* 9788551006153 (fonte única); *Conservadorismo* (Oakeshott) 9788592649081.
