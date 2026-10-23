// Armazenamento dos dados do estudo. Em produção: Postgres no Supabase, acessado só pelas funções do servidor pela API
// REST (PostgREST) com a chave secreta; o navegador nunca fala com o banco. Nos testes (BANCO=memoria): tudo em memória.
// As tabelas estão em supabase/esquema.sql.
const MEMORIA = process.env.BANCO === "memoria";

// ---------- Supabase (PostgREST)
const URL_BASE = () => (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
// SUPABASE_CHAVE_SITE: chave secreta criada só pro site (tem prioridade). As outras duas são as que a integração
// do Supabase com o Vercel cria e pode trocar sozinha; ficam como alternativa.
const CHAVE = () => process.env.SUPABASE_CHAVE_SITE || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
function configurado() { if (!URL_BASE() || !CHAVE()) throw new Error("Banco não configurado: faltam SUPABASE_URL e a chave secreta nas variáveis do projeto."); }
async function rest(caminho, { metodo = "GET", corpo, prefer, contar } = {}) {
  configurado();
  const h = { apikey: CHAVE(), "content-type": "application/json" };
  // chaves antigas (service_role) são JWT e também vão no Authorization; as novas (sb_secret_...) só no apikey
  if (CHAVE().startsWith("eyJ")) h.authorization = "Bearer " + CHAVE();
  const p = [prefer, contar ? "count=exact" : null].filter(Boolean).join(",");
  if (p) h.prefer = p;
  const r = await fetch(`${URL_BASE()}/rest/v1/${caminho}`, { method: metodo, headers: h, body: corpo === undefined ? undefined : JSON.stringify(corpo) });
  if (!r.ok) throw new Error(`Banco respondeu ${r.status} em ${metodo} ${caminho.split("?")[0]}: ${(await r.text()).slice(0, 200)}`);
  const total = contar ? Number((r.headers.get("content-range") || "").split("/")[1]) : undefined;
  const texto = metodo === "HEAD" ? "" : await r.text();
  return { dados: texto ? JSON.parse(texto) : null, total };
}
// lê todas as linhas, de 1000 em 1000 (limite padrão do PostgREST)
async function tudo(caminho) {
  const out = [];
  for (let ini = 0; ; ini += 1000) { const { dados } = await rest(`${caminho}&limit=1000&offset=${ini}`); out.push(...dados); if (dados.length < 1000) return out; }
}
const periodo = (de, ate) => (de ? `&dia=gte.${de}` : "") + (ate ? `&dia=lte.${ate}` : "");

// ---------- memória (testes)
const M = globalThis.__bancoMemoria || (globalThis.__bancoMemoria = { resultados: [], eventos: [], config: new Map(), desafios: new Map(), limites: new Map(), backups: new Map() });
const naFaixa = (dia, de, ate) => (!de || dia >= de) && (!ate || dia <= ate);

// ---------- interface usada pelas rotas
export const banco = {
  // grava um resultado; devolve { repetido: true } se aquela chave já existia (reenvio do mesmo resultado)
  async inserirResultado(conjunto, dia, chave, dados) {
    if (MEMORIA) { if (M.resultados.some((r) => r.conjunto === conjunto && r.chave === chave)) return { repetido: true }; M.resultados.push({ conjunto, dia, chave, dados }); return { repetido: false }; }
    const { dados: d } = await rest("resultados?on_conflict=conjunto,chave", { metodo: "POST", corpo: [{ conjunto, dia, chave, dados }], prefer: "return=representation,resolution=ignore-duplicates" });
    return { repetido: !d || d.length === 0 };
  },
  async inserirEvento(conjunto, dia, tipo, modo, pos, n = 1) {
    if (MEMORIA) { M.eventos.push({ conjunto, dia, tipo, modo, pos, n }); return; }
    await rest("eventos", { metodo: "POST", corpo: [{ conjunto, dia, tipo, modo, pos, n }], prefer: "return=minimal" });
  },
  // [{ ...dados, dia }]
  async resultados(conjunto, de, ate) {
    if (MEMORIA) return M.resultados.filter((r) => r.conjunto === conjunto && naFaixa(r.dia, de, ate)).map((r) => ({ ...r.dados, dia: r.dia }));
    return (await tudo(`resultados?select=dia,dados&conjunto=eq.${conjunto}${periodo(de, ate)}&order=id`)).map((r) => ({ ...r.dados, dia: r.dia }));
  },
  // [{ dia, tipo, modo, pos, n }]
  async eventos(conjunto, de, ate) {
    if (MEMORIA) return M.eventos.filter((e) => e.conjunto === conjunto && naFaixa(e.dia, de, ate)).map(({ conjunto: _, ...e }) => e);
    return await tudo(`eventos?select=dia,tipo,modo,pos,n&conjunto=eq.${conjunto}${periodo(de, ate)}&order=id`);
  },
  // pessoas: quem continuou num modo maior tem um segundo registro (com "de") que não conta de novo
  async contarPessoas(conjunto) {
    if (MEMORIA) return M.resultados.filter((r) => r.conjunto === conjunto && !r.dados.de).length;
    return (await rest(`resultados?select=id&conjunto=eq.${conjunto}&dados->>de=is.null&limit=1`, { contar: true })).total || 0;
  },
  async apagarConjunto(conjunto) {
    if (MEMORIA) { const n = M.resultados.filter((r) => r.conjunto === conjunto).length + M.eventos.filter((e) => e.conjunto === conjunto).length;
      M.resultados = M.resultados.filter((r) => r.conjunto !== conjunto); M.eventos = M.eventos.filter((e) => e.conjunto !== conjunto); return n; }
    const a = await rest(`resultados?conjunto=eq.${conjunto}`, { metodo: "DELETE", prefer: "return=minimal", contar: true });
    const b = await rest(`eventos?conjunto=eq.${conjunto}`, { metodo: "DELETE", prefer: "return=minimal", contar: true });
    if (conjunto === "real") await rest("desafios_usados?marca=neq.", { metodo: "DELETE", prefer: "return=minimal" });
    return (a.total || 0) + (b.total || 0);
  },
  // usado só na migração: apaga os avisos de início e saída de um conjunto pra regravar a partir da exportação
  async apagarEventos(conjunto) {
    if (MEMORIA) { M.eventos = M.eventos.filter((e) => e.conjunto !== conjunto); return; }
    await rest(`eventos?conjunto=eq.${conjunto}`, { metodo: "DELETE", prefer: "return=minimal" });
  },
  // configuração (segredos, credencial do painel, pesos): valores JSON por chave
  async lerConfig(chave) {
    if (MEMORIA) return M.config.has(chave) ? JSON.parse(M.config.get(chave)) : null;
    const { dados } = await rest(`config?select=valor&chave=eq.${encodeURIComponent(chave)}`); return dados.length ? dados[0].valor : null;
  },
  async gravarConfig(chave, valor) {
    if (MEMORIA) { M.config.set(chave, JSON.stringify(valor)); return; }
    await rest("config?on_conflict=chave", { metodo: "POST", corpo: [{ chave, valor, atualizado: new Date().toISOString() }], prefer: "return=minimal,resolution=merge-duplicates" });
  },
  // grava só se a chave não existir; devolve true se gravou
  async gravarConfigSeNovo(chave, valor) {
    if (MEMORIA) { if (M.config.has(chave)) return false; M.config.set(chave, JSON.stringify(valor)); return true; }
    const { dados } = await rest("config?on_conflict=chave", { metodo: "POST", corpo: [{ chave, valor }], prefer: "return=representation,resolution=ignore-duplicates" });
    return !!dados && dados.length > 0;
  },
  async apagarConfig(chave) {
    if (MEMORIA) { M.config.delete(chave); return; }
    await rest(`config?chave=eq.${encodeURIComponent(chave)}`, { metodo: "DELETE", prefer: "return=minimal" });
  },
  // cada desafio anti-robô vale pra um envio: marca o desafio com o código do envio e devolve o código já marcado
  async marcarDesafio(marca, envio) {
    if (MEMORIA) { if (!M.desafios.has(marca)) M.desafios.set(marca, envio); return M.desafios.get(marca); }
    await rest("desafios_usados?on_conflict=marca", { metodo: "POST", corpo: [{ marca, envio }], prefer: "return=minimal,resolution=ignore-duplicates" });
    const { dados } = await rest(`desafios_usados?select=envio&marca=eq.${marca}`); return dados[0]?.envio ?? null;
  },
  // limite de pedidos: soma 1 na janela daquele visitante e devolve o total da janela
  async contarPedido(chave, janela) {
    if (MEMORIA) { const k = `${chave}|${janela}`; M.limites.set(k, (M.limites.get(k) || 0) + 1); return M.limites.get(k); }
    const { dados } = await rest("rpc/contar_pedido", { metodo: "POST", corpo: { p_chave: chave, p_janela: janela } }); return Number(dados);
  },
  async gravarBackup(dia, conteudo) {
    if (MEMORIA) { M.backups.set(dia, conteudo); return; }
    await rest("backups?on_conflict=dia", { metodo: "POST", corpo: [{ dia, conteudo }], prefer: "return=minimal,resolution=merge-duplicates" });
  },
  async listarBackups() {
    if (MEMORIA) return [...M.backups.keys()].sort().reverse();
    return (await rest("backups?select=dia&order=dia.desc")).dados.map((b) => b.dia);
  },
  async lerBackup(dia) {
    if (MEMORIA) return M.backups.get(dia) ?? null;
    const { dados } = await rest(`backups?select=conteudo&dia=eq.${dia}`); return dados.length ? dados[0].conteudo : null;
  },
  // faxina diária: mantém 7 backups, desafios de até 8 dias e as janelas de limite da última hora
  async faxina(agora = Date.now()) {
    const manter = (await this.listarBackups()).slice(7), limiteDesafio = new Date(agora - 8 * 864e5).toISOString(), janela = Math.floor(agora / 60e3) - 60;
    if (MEMORIA) { manter.forEach((d) => M.backups.delete(d)); for (const k of M.limites.keys()) if (Number(k.split("|")[1]) < janela) M.limites.delete(k); return; }
    for (const d of manter) await rest(`backups?dia=eq.${d}`, { metodo: "DELETE", prefer: "return=minimal" });
    await rest(`desafios_usados?criado=lt.${limiteDesafio}`, { metodo: "DELETE", prefer: "return=minimal" });
    await rest(`limites?janela=lt.${janela}`, { metodo: "DELETE", prefer: "return=minimal" });
  },
};
