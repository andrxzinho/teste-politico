# Segurança e privacidade

O teste recebe respostas sobre opinião política, que são dado pessoal sensível pela LGPD. Por isso, falhas de
segurança ou de privacidade são tratadas com prioridade.

## Como relatar

**Não abra um aviso (issue) público** para falhas de segurança ou de privacidade.

Use o relato privado do GitHub: aba **Security** do repositório → **Report a vulnerability**
(<https://github.com/andrxzinho/teste-politico/security/advisories/new>). Só o responsável pelo projeto vê o relato.

Inclua, se possível:

- o que acontece e onde (página, rota da API, arquivo);
- passos para reproduzir;
- o impacto que você imagina (por exemplo: ligar uma resposta a uma pessoa, ler dados do estudo, enviar dados falsos).

Você recebe uma resposta assim que possível. Correções são registradas no [histórico de versões](CHANGELOG.md),
com crédito para quem relatou, se quiser.

## O que está no escopo

- O site https://testepolitico.vercel.app e as funções em `api/` e `servidor/`.
- O esquema do banco em `supabase/esquema.sql`.
- Qualquer divergência entre o que a [política de privacidade](https://testepolitico.vercel.app/termos.html)
  afirma e o que o código faz de fato.

## Regras para testar

- Não envie resultados falsos ao estudo real nem faça testes de carga ou força bruta contra produção.
- Para testar o servidor, rode localmente com `BANCO=memoria` (veja o README).
- Não tente acessar dados de outras pessoas.
