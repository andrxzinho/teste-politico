// Painel: só entrega números agregados, e só pra quem tem a credencial.
// A credencial é criada no primeiro acesso e guardada só como hash (scrypt com sal).
// Se a variável PAINEL_SENHA existir nas configurações do projeto, ela vale no lugar.
import { ITENS } from "../motor.mjs";
import { banco } from "../banco.mjs";
import { createHash, timingSafeEqual, scryptSync, randomBytes } from "node:crypto";
import { IDEOLOGIAS, EIXOS, EXTREMOS, IDS, META, NAO_PONTUA, TEMPOS, IDADES, ESPECTROS, CONFIANCAS, hoje, registros, eventos, contagem, emitirSessao, encerrarSessoes, passouDoLimite, SESSAO_HORAS, SEM_CACHE } from "../comum.mjs";

const CRED = "config/credencial", PESOS = "config/pesos";
const MIN_GRUPO = 5;      // grupos com menos de 5 pessoas aparecem como "<5", pra ninguém ser reconhecido
const MIN_PESOS = 300;    // participantes dos modos Padrão e Aprofundado necessários pra calcular pesos
const CONCORDANCIA_MIN = 0.7; // pesos só valem se duas metades dos dados derem correlações parecidas pra cada frase
const h = (s) => createHash("sha256").update(String(s)).digest();
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const VAL = { a: -2, b: -1, c: 0, d: 1, e: 2 };

async function credencial() {
  if (process.env.PAINEL_SENHA) return { env: process.env.PAINEL_SENHA };
  return await banco.lerConfig(CRED);
}
function confere(senha, c) {
  if (c.env) return timingSafeEqual(h(senha), h(c.env));
  return timingSafeEqual(scryptSync(String(senha), Buffer.from(c.salt, "base64"), 32), Buffer.from(c.hash, "base64"));
}
async function autorizado(req) {
  const c = await credencial();
  if (!c) return new Response("Crie a credencial no painel primeiro.", { status: 503 });
  const auth = req.headers.get("authorization") || "";
  const enviada = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!enviada || !confere(enviada, c)) { await espera(1200); return new Response("Credencial inválida", { status: 401 }); }
  return null;
}
const conta = (o, k) => { o[k] = (o[k] || 0) + 1; };
const media = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
const mediana = (a) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const suprime = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v < MIN_GRUPO ? "<5" : v]));

// qualidade: coerência de cada eixo (alfa de Cronbach) e o quanto cada frase acompanha o próprio eixo
const NOME_MODO = { r: "essencial", c: "padrao", a: "aprofundado" };
const correlacao = (x, y) => { const mx = media(x), my = media(y); let sxy = 0, sx = 0, sy = 0; x.forEach((v, i) => { sxy += (v - mx) * (y[i] - my); sx += (v - mx) ** 2; sy += (y[i] - my) ** 2; }); return sx && sy ? sxy / Math.sqrt(sx * sy) : 0; };
// resultados de versões antigas (antes dos três modos): só contados, guardados como número na configuração
const legadoDe = async (conj) => ((await banco.lerConfig("config/legado")) || {})[conj] || 0;
function qualidade(rs) {
  // modos Padrão (c) e Aprofundado (a) juntos, nas frases que os dois têm (nível 1 e 2); frases só do Aprofundado ficam pra depois
  const full = rs.filter((r) => r.m === "c" || r.m === "a"), res = {};
  for (const k of EIXOS) {
    const itens = IDS.filter((id) => META[id][0] === k && id[0] !== "P" && !NAO_PONTUA.includes(id) && ITENS[id].lv <= 2);
    const mat = [];
    for (const r of full) {
      const ys = itens.map((id) => { const ch = r.r[IDS.indexOf(id)]; return ch in VAL ? VAL[ch] * META[id][1] : null; });
      const ok = ys.filter((v) => v !== null);
      if (ok.length < itens.length * 0.8) continue;
      const m = media(ok); mat.push(ys.map((v) => (v === null ? m : v)));
    }
    const n = mat.length;
    if (n < 10) { res[k] = { n, alfa: null, itens: [] }; continue; }
    const varr = (a) => { const m = media(a); return a.reduce((s, x) => s + (x - m) ** 2, 0) / (a.length - 1 || 1); };
    const tot = mat.map((row) => row.reduce((a, b) => a + b, 0));
    const vi = itens.map((_, j) => varr(mat.map((row) => row[j]))), vt = varr(tot), K = itens.length;
    const alfa = vt ? (K / (K - 1)) * (1 - vi.reduce((a, b) => a + b, 0) / vt) : null;
    const corr = (x, y) => { const mx = media(x), my = media(y); let sxy = 0, sx = 0, sy = 0; x.forEach((v, i) => { sxy += (v - mx) * (y[i] - my); sx += (v - mx) ** 2; sy += (y[i] - my) ** 2; }); return sx && sy ? sxy / Math.sqrt(sx * sy) : 0; };
    res[k] = { n, alfa: alfa === null ? null : Math.round(alfa * 100) / 100,
      itens: itens.map((id, j) => ({ id, r: Math.round(corr(mat.map((row) => row[j]), tot.map((t, i) => t - mat[i][j])) * 100) / 100 })) };
  }
  return res;
}

function agrega(rs, eventos, legado) {
  const porIdeologia = Object.fromEntries(IDEOLOGIAS.map((n) => [n, 0]));
  const eixos = Object.fromEntries(EIXOS.map((k) => [k, {}])), vals = Object.fromEntries(EIXOS.map((k) => [k, []]));
  const ext = Object.fromEntries(EXTREMOS.map((k) => [k, { soma: 0, forte: 0, n: 0 }]));
  const perguntas = IDS.map((id) => ({ id, a: 0, b: 0, c: 0, d: 0, e: 0, x: 0, apresentada: 0, abertas: 0 }));
  const porDia = {}, porModo = { essencial: 0, padrao: 0, aprofundado: 0 }, tempo = Object.fromEntries(TEMPOS.map((t) => [t, 0]));
  const idade = Object.fromEntries([...IDADES, "Não informou"].map((t) => [t, 0])), uf = {}, bussola = {}, cruz = {};
  const confianca = Object.fromEntries(CONFIANCAS.map((c) => [c, 0])), espectro = Object.fromEntries([...ESPECTROS, "Não informou"].map((e) => [e, 0]));
  const autoMat = {}, espE = {}; let comInicio = 0, comDemografia = 0, desempates = 0, incs = [], autoN = 0, autoAcerto = 0;
  for (const r of rs) {
    const nome = IDEOLOGIAS[r.i]; if (!nome) continue;
    porIdeologia[nome]++; conta(porDia, r.dia); porModo[NOME_MODO[r.m] || "padrao"]++; conta(tempo, r.t);
    EIXOS.forEach((k, j) => { conta(eixos[k], r.ax[j]); vals[k].push(r.ax[j]); });
    conta(bussola, `${r.ax[0]},${r.ax[1]}`);
    EXTREMOS.forEach((k, j) => { const v = r.ex[j]; if (v === null || v === undefined) return; ext[k].n++; ext[k].soma += v; if (v >= 50) ext[k].forte++; });
    if (r.ci !== false) comInicio++;
    [...(r.r || "")].forEach((ch, j) => { const p = perguntas[j]; if (!p || ch === "_") return; p.apresentada++; p[ch]++; });
    (r.x || []).forEach((id) => { const j = IDS.indexOf(id); if (j >= 0) perguntas[j].abertas++; });
    conta(idade, r.id || "Não informou"); conta(uf, r.uf || "Não informou"); if (r.id || r.uf) comDemografia++;
    if (r.id) { cruz[r.id] = cruz[r.id] || {}; conta(cruz[r.id], nome); }
    conta(confianca, r.cf); if (r.tb) desempates++; incs.push(r.inc || 0);
    conta(espectro, r.se || "Não informou");
    if (r.se && ESPECTROS.indexOf(r.se) < 5) { espE[r.se] = espE[r.se] || []; espE[r.se].push(r.ax[0]); }
    if (r.si !== null && r.si !== undefined && IDEOLOGIAS[r.si]) { autoN++; if (r.si === r.i) autoAcerto++; const s = IDEOLOGIAS[r.si]; autoMat[s] = autoMat[s] || {}; conta(autoMat[s], nome); }
  }
  const n = rs.length;
  const cruzamento = {}; for (const [f, o] of Object.entries(cruz)) { const t = Object.values(o).reduce((a, b) => a + b, 0); cruzamento[f] = t < MIN_GRUPO ? null : suprime(o); }
  const autoid = {}; for (const [s, o] of Object.entries(autoMat)) { const t = Object.values(o).reduce((a, b) => a + b, 0); autoid[s] = t < MIN_GRUPO ? null : suprime(o); }
  const espectroEconomia = Object.fromEntries(Object.entries(espE).map(([e, a]) => [e, a.length < MIN_GRUPO ? null : Math.round(media(a))]));
  // funil: quem começou, quem saiu (por trecho do teste) e quem terminou
  // conclusões que tiveram o aviso de início (quem só aceitou participar no fim não tem início registrado)
  const funil = { inicios: 0, saidas: {}, conclusoes: n, conclusoesComInicio: comInicio };
  for (const e of eventos) { if (e.tipo === "inicio") funil.inicios += e.n; else if (e.tipo === "saida") { const b = Math.floor((e.pos - 1) / 10) * 10 + 1; funil.saidas[`${b}-${b + 9}`] = (funil.saidas[`${b}-${b + 9}`] || 0) + e.n; } }
  return {
    total: n, hoje: porDia[hoje()] || 0, porModo, porDia, porIdeologia, tempo, idade, uf, comDemografia, cruzamento,
    eixos, medias: Object.fromEntries(EIXOS.map((k) => [k, Math.round(media(vals[k]))])), medianas: Object.fromEntries(EIXOS.map((k) => [k, mediana(vals[k])])),
    bussola, extremos: Object.fromEntries(EXTREMOS.map((k) => [k, { media: ext[k].n ? Math.round(ext[k].soma / ext[k].n) : 0, forte: ext[k].forte, n: ext[k].n }])),
    perguntas, confianca, desempates, inconsistenciaMedia: Math.round(media(incs) * 10) / 10,
    espectro, espectroEconomia, autoid, autoN, autoAcerto, funil, legado, minimoGrupo: MIN_GRUPO, geradoEm: new Date().toISOString(),
  };
}

function csv(rs) {
  // exportação anônima: sem dia, idade e estado, em ordem embaralhada
  const cab = ["modo","veio_de","ideologia",...EIXOS.map((k) => "eixo_" + k),...EXTREMOS.map((k) => "extremo_" + k),"tempo","confianca","desempate","contradicoes","autoid_espectro","autoid_ideologia","respostas_" + IDS.join("|"),"explicacoes_abertas"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const linhas = rs.map((r) => [NOME_MODO[r.m] || "padrao", r.de ? NOME_MODO[r.de] : "", IDEOLOGIAS[r.i], ...r.ax, ...r.ex, r.t, r.cf, r.tb ? "sim" : "nao", r.inc, r.se, r.si != null ? IDEOLOGIAS[r.si] : "", r.r, (r.x || []).join(" ")].map(esc).join(","));
  for (let i = linhas.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [linhas[i], linhas[j]] = [linhas[j], linhas[i]]; }
  return "\ufeff" + [cab.map(esc).join(","), ...linhas].join("\n");
}

export default async (req) => {
  // limita tentativas: no máximo 30 pedidos por minuto por visitante
  if (await passouDoLimite(req, "painel")) return new Response("Muitas tentativas. Espere um minuto.", { status: 429, headers: SEM_CACHE });
  const url = new URL(req.url), q = url.searchParams;
  if (req.method === "GET" && q.has("estado")) return Response.json({ configurado: !!(await credencial()) }, { headers: SEM_CACHE });

  if (req.method === "POST") {
    // os pedidos do painel são pequenos (a maior coisa é a credencial nova, de até 200 caracteres)
    const texto = await req.text();
    if (texto.length > 2000) return new Response("Pedido grande demais", { status: 413 });
    let b; try { b = JSON.parse(texto); } catch { return new Response("JSON inválido", { status: 400 }); }
    if (b?.criar !== undefined) {
      if (process.env.PAINEL_SENHA) return new Response("A credencial está definida nas configurações do projeto.", { status: 409 });
      if (typeof b.criar !== "string" || b.criar.length < 16 || b.criar.length > 200) return new Response("A credencial precisa ter de 16 a 200 caracteres.", { status: 400 });
      const sal = randomBytes(16);
      const gravou = await banco.gravarConfigSeNovo(CRED, { salt: sal.toString("base64"), hash: scryptSync(b.criar, sal, 32).toString("base64") });
      if (!gravou) return new Response("A credencial já foi criada.", { status: 409 });
      return Response.json({ ok: true }, { headers: SEM_CACHE });
    }
    const erro = await autorizado(req); if (erro) return erro;
    if (b?.acao === "sessao-teste") return Response.json({ ok: true, ...(await emitirSessao()), horas: SESSAO_HORAS }, { headers: SEM_CACHE });
    if (b?.acao === "encerrar-sessoes") { await encerrarSessoes(); return Response.json({ ok: true }, { headers: SEM_CACHE }); }
    if (b?.acao === "formatar") {
      if (!["real","teste"].includes(b.conjunto) || b.confirmacao !== "APAGAR") return new Response("Confirmação inválida", { status: 400 });
      const apagados = await banco.apagarConjunto(b.conjunto);
      const leg = (await banco.lerConfig("config/legado")) || {}; if (leg[b.conjunto]) { delete leg[b.conjunto]; await banco.gravarConfig("config/legado", leg); }
      return Response.json({ ok: true, apagados }, { headers: SEM_CACHE });
    }
    if (b?.acao === "pesos") {
      if (!b.aplicar) { await banco.apagarConfig(PESOS); return Response.json({ ok: true, removidos: true }, { headers: SEM_CACHE }); }
      const rs = await registros("real"), cheios = rs.filter((r) => r.m === "c" || r.m === "a"), nFull = cheios.length;
      if (nFull < MIN_PESOS) return new Response(`Ainda faltam ${MIN_PESOS - nFull} participantes dos modos Padrão ou Aprofundado pra calcular os pesos.`, { status: 409 });
      // validação cruzada: as correlações de cada frase precisam ser parecidas nas duas metades dos dados
      const q1 = qualidade(cheios.filter((_, i) => i % 2 === 0)), q2 = qualidade(cheios.filter((_, i) => i % 2 === 1)), instaveis = [];
      for (const k of EIXOS) { const a = q1[k].itens.map((x) => x.r), b2 = q2[k].itens.map((x) => x.r); if (a.length > 2 && correlacao(a, b2) < CONCORDANCIA_MIN) instaveis.push(k); }
      if (instaveis.length) return new Response(`As duas metades dos dados ainda discordam nos eixos ${instaveis.join(", ")}. Espere mais participantes antes de aplicar pesos.`, { status: 409 });
      const ql = qualidade(cheios), pesos = {};
      for (const k of EIXOS) for (const it of ql[k].itens) pesos[it.id] = Math.max(0.5, Math.min(1.5, Math.round((0.5 + 2 * Math.max(0, it.r)) * 100) / 100));
      await banco.gravarConfig(PESOS, { pesos, n: nFull, em: new Date().toISOString() });
      return Response.json({ ok: true, n: nFull }, { headers: SEM_CACHE });
    }
    return new Response("Ação desconhecida", { status: 400 });
  }

  if (req.method !== "GET") return new Response("Método não permitido", { status: 405 });
  const erro = await autorizado(req); if (erro) return erro;
  if (q.has("contagem")) return Response.json({ real: await contagem("real"), teste: await contagem("teste") }, { headers: SEM_CACHE });
  // backups: o painel continua usando nomes "AAAA-MM-DD.json"
  if (q.has("backups")) return Response.json({ backups: (await banco.listarBackups()).map((d) => `${d}.json`) }, { headers: SEM_CACHE });
  if (q.has("backup")) {
    const k = q.get("backup"); if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(k)) return new Response("Backup inválido", { status: 400 });
    const v = await banco.lerBackup(k.slice(0, 10)); if (v === null) return new Response("Não encontrado", { status: 404 });
    return new Response(JSON.stringify(v), { headers: { ...SEM_CACHE, "content-type": "application/json", "content-disposition": `attachment; filename="backup-${k}"` } });
  }
  const conj = q.get("exportar") || q.get("conjunto") || "real";
  if (!["real","teste"].includes(conj)) return new Response("Conjunto inválido", { status: 400 });
  const de = /^\d{4}-\d{2}-\d{2}$/.test(q.get("de") || "") ? q.get("de") : null, ate = /^\d{4}-\d{2}-\d{2}$/.test(q.get("ate") || "") ? q.get("ate") : null;
  const rs = await registros(conj, de, ate);
  if (q.has("exportar")) return new Response(csv(rs), { headers: { ...SEM_CACHE, "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="teste-politico-${conj}.csv"` } });
  const evs = await eventos(conj, de, ate);
  const legado = await legadoDe(conj);
  const pesos = await banco.lerConfig(PESOS);
  return Response.json({ ...agrega(rs, evs, legado), qualidade: qualidade(rs), pesos: pesos ? { n: pesos.n, em: pesos.em, pesos: pesos.pesos } : null, minPesos: MIN_PESOS },
    { headers: SEM_CACHE });
};
