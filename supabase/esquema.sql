-- Banco do teste político (Supabase / Postgres). Rode uma vez num projeto novo; pode rodar de novo sem estragar nada.
-- Só as funções do servidor (com a chave secreta) acessam estas tabelas. O acesso público fica bloqueado:
-- RLS ligado e nenhuma regra de acesso, e os papéis anon/authenticated sem permissão nenhuma.

-- resultados anônimos de quem aceitou participar do estudo (formato compacto, igual ao enviado pelo site)
create table if not exists resultados (
  id bigint generated always as identity primary key,
  conjunto text not null check (conjunto in ('real', 'teste')),
  dia date not null,                    -- só o dia, no horário de Brasília; nunca a hora
  chave text not null,                  -- código aleatório do envio (repetir o envio não duplica)
  dados jsonb not null,
  criado timestamptz not null default now(),
  unique (conjunto, chave)
);
create index if not exists resultados_conjunto_dia on resultados (conjunto, dia);

-- avisos de início e saída do teste (só contagem, sem nenhum dado da pessoa)
create table if not exists eventos (
  id bigint generated always as identity primary key,
  conjunto text not null check (conjunto in ('real', 'teste')),
  dia date not null,
  tipo text not null check (tipo in ('inicio', 'saida')),
  modo text not null check (modo in ('r', 'c', 'a')),
  pos integer not null default 0 check (pos between 0 and 400),
  n integer not null default 1 check (n > 0)
);
create index if not exists eventos_conjunto_dia on eventos (conjunto, dia);

-- configuração: segredos das assinaturas, credencial do painel (só o hash), pesos calibrados, contagens antigas
create table if not exists config (
  chave text primary key,
  valor jsonb not null,
  atualizado timestamptz not null default now()
);

-- desafios anti-robô já usados (cada um vale pra um envio); apagados depois de 8 dias
create table if not exists desafios_usados (
  marca text primary key,
  envio text not null,
  criado timestamptz not null default now()
);

-- limite de pedidos por visitante (chave = hash do endereço, sem guardar o endereço), por minuto
create table if not exists limites (
  chave text not null,
  janela bigint not null,
  n integer not null default 0,
  primary key (chave, janela)
);
create or replace function contar_pedido(p_chave text, p_janela bigint) returns integer
language sql security invoker set search_path = public as $$
  insert into limites (chave, janela, n) values (p_chave, p_janela, 1)
  on conflict (chave, janela) do update set n = limites.n + 1
  returning n;
$$;

-- cópias diárias dos dados reais (últimos 7 dias); o plano grátis do Supabase não faz backup sozinho
create table if not exists backups (
  dia date primary key,
  conteudo jsonb not null,
  criado timestamptz not null default now()
);

-- fecha tudo pro público
alter table resultados enable row level security;
alter table eventos enable row level security;
alter table config enable row level security;
alter table desafios_usados enable row level security;
alter table limites enable row level security;
alter table backups enable row level security;
revoke all on resultados, eventos, config, desafios_usados, limites, backups from anon, authenticated;
revoke all on function contar_pedido(text, bigint) from public, anon, authenticated;
grant execute on function contar_pedido(text, bigint) to service_role;
-- tabelas criadas no futuro também nascem fechadas (sem isto, o Supabase dá acesso automático a anon/authenticated)
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
-- (funções novas precisam de grant explícito pra service_role, como contar_pedido acima)
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;
