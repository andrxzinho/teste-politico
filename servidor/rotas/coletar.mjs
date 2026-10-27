// Recebe o resultado anônimo de quem aceitou participar do estudo, e os avisos de início e de saída do teste.
// Não existe nome, IP, navegador nem horário: só o dia e respostas em faixas, numa chave com nome aleatório.
import Motor, { ITENS } from "../motor.mjs";
import { banco } from "../banco.mjs";
import { FRASES_NOVAS_V2, IDEOLOGIAS, EIXOS, EXTREMOS, IDS, TEMPOS, IDADES, UFS, ESPECTROS, CONFIANCAS, hoje, estudoEncerrado, ehProducao, sessaoValida, emitirDesafio, conferirProva, passouDoLimite, SEM_CACHE } from "../comum.mjs";

const inicio = () => process.env.COLETA_INICIO || "2026-10-01";
const nul = (v, lista) => v === null || v === undefined || lista.includes(v);
const VAL = { a: -2, b: -1, c: 0, d: 1, e: 2 };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
// Recalcula cada eixo a partir das respostas com o mesmo motor do site (servidor/motor.mjs, gerado de
// public/js/nucleo/motor.js). Serve pra recusar envios com eixos inventados que não batem com as respostas.
function eixosDasRespostas(resp, pesos) {
  const A = {};
  IDS.forEach((id, j) => { const ch = resp[j]; if (ch in VAL) A[id] = VAL[ch]; else if (ch === "x") A[id] = "x"; });
  const r = Motor.calcular(A, ITENS, IDS, pesos);
  return EIXOS.map((k) => r.raw[k]);
}

export default async (req) => {
  // no máximo 30 pedidos por minuto por visitante
  if (await passouDoLimite(req, "coletar")) return Response.json({ ok: false, motivo: "Muitos envios seguidos. Espere um minuto." }, { status: 429, headers: SEM_CACHE });
  const ativo = hoje() >= inicio() && !estudoEncerrado();
  if (req.method === "GET" && new URL(req.url).searchParams.has("desafio")) return Response.json(await emitirDesafio(), { headers: SEM_CACHE });
  if (req.method === "GET") {
    const sessao = await sessaoValida(req.headers.get("x-sessao-teste"));
    return Response.json({ ativo, teste: !ehProducao(req) || sessao, sessao }, { headers: SEM_CACHE });
  }
  if (req.method !== "POST") return new Response("Método não permitido", { status: 405 });
  if (!ativo) return Response.json({ ok: false, motivo: estudoEncerrado() ? "O estudo terminou." : "A coleta ainda não começou." }, { status: 403 });
  // o site só envia do próprio endereço: recusa envios disparados por páginas de outros sites no navegador de quem as visita
  // (os avisos de início e saída não têm prova anti-robô). Pedidos sem esse cabeçalho (navegadores antigos) continuam valendo.
  const site = req.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return new Response("Origem não permitida", { status: 403 });

  const texto = await req.text();
  if (texto.length > 8000) return new Response("Envio grande demais", { status: 413 });
  let b; try { b = JSON.parse(texto); } catch { return new Response("JSON inválido", { status: 400 }); }
  if (b?.v !== 6) return new Response("Versão inválida", { status: 400 });
  // modos: r = Essencial, c = Padrão, a = Aprofundado (as letras r e c vêm das versões anteriores)
  // Object.hasOwn: nomes como "constructor" ou "__proto__" não podem passar por modo válido
  const MODO = { quick: "r", full: "c", deep: "a" }, modo = typeof b.modo === "string" && Object.hasOwn(MODO, b.modo) ? MODO[b.modo] : null;
  if (!modo) return new Response("Dados inválidos", { status: 400 });
  // área de teste: só com uma sessão de teste válida (aberta pelo painel) ou fora do endereço oficial
  const temSessao = b.sessao !== undefined && b.sessao !== null;
  if (temSessao && !(await sessaoValida(b.sessao)))
    return Response.json({ ok: false, motivo: "A sessão de teste expirou ou foi encerrada. Abra o modo de teste de novo pelo painel." }, { status: 403, headers: SEM_CACHE });
  const conj = temSessao || !ehProducao(req) ? "teste" : "real";

  // avisos de início e saída: só contam, sem nenhum dado da pessoa
  if (b.tipo === "inicio" || b.tipo === "saida") {
    const pos = b.tipo === "saida" ? b.pos : 0;
    if (!Number.isInteger(pos) || pos < 0 || pos > 400) return new Response("Dados inválidos", { status: 400 });
    await banco.inserirEvento(conj, hoje(), b.tipo, modo, pos);
    return Response.json({ ok: true }, { headers: SEM_CACHE });
  }
  if (b.tipo !== "resultado") return new Response("Tipo inválido", { status: 400 });
  // páginas abertas antes da versão 2 do cálculo ainda mandam os nomes antigos e a lista de frases sem as 20 novas
  const ANTIGOS = { "Esquerda radical": "Extrema esquerda", "Direita radical": "Extrema direita" };
  if (Object.hasOwn(ANTIGOS, b.ideologia)) b.ideologia = ANTIGOS[b.ideologia];
  if (b.autoid && Object.hasOwn(ANTIGOS, b.autoid.ideologia)) b.autoid.ideologia = ANTIGOS[b.autoid.ideologia];
  if (typeof b.respostas === "string" && b.respostas.length === IDS.length - FRASES_NOVAS_V2) b.respostas += "_".repeat(FRASES_NOVAS_V2);

  const i = IDEOLOGIAS.indexOf(b.ideologia);
  const ax = EIXOS.map((k) => b.eixos?.[k]);
  const ex = EXTREMOS.map((k) => (b.extremos?.[k] === undefined ? null : b.extremos[k]));
  const expl = Array.isArray(b.explicacoes) ? [...new Set(b.explicacoes)] : null;
  const valido = i >= 0 &&
    ax.every((v) => Number.isInteger(v) && v >= -100 && v <= 100 && v % 20 === 0) &&
    ex.every((v) => v === null || (Number.isInteger(v) && v >= 0 && v <= 100 && v % 10 === 0)) &&
    TEMPOS.includes(b.tempo) &&
    typeof b.respostas === "string" && b.respostas.length === IDS.length && /^[abcdex_]+$/.test(b.respostas) && /[abcde]/.test(b.respostas) &&
    expl && expl.length <= IDS.length && expl.every((id) => IDS.includes(id)) &&
    nul(b.idade, IDADES) && nul(b.uf, UFS) &&
    nul(b.autoid?.espectro, ESPECTROS) && nul(b.autoid?.ideologia, IDEOLOGIAS) &&
    CONFIANCAS.includes(b.confianca) && typeof b.desempate === "boolean" &&
    Number.isInteger(b.inconsistencias) && b.inconsistencias >= 0 && b.inconsistencias <= 20 &&
    typeof b.envio === "string" && UUID.test(b.envio) &&
    (b.inicio === undefined || typeof b.inicio === "boolean") &&
    // quem continuou de um modo menor manda de qual modo veio, e esse modo precisa ser menor que o atual
    (b.de === undefined || b.de === null || (typeof b.de === "string" && Object.hasOwn(MODO, b.de) && ["quick", "full", "deep"].indexOf(b.de) < ["quick", "full", "deep"].indexOf(b.modo)));
  if (!valido) return new Response("Dados inválidos", { status: 400 });
  const motivo = await conferirProva(b.prova, b.envio);
  if (motivo) return Response.json({ ok: false, motivo }, { status: 429, headers: SEM_CACHE });
  // os eixos enviados precisam bater com as respostas (margem pro arredondamento em faixas de 20 e pra pesos desatualizados)
  const pesos = (await banco.lerConfig("config/pesos"))?.pesos || {};
  const calc = eixosDasRespostas(b.respostas, pesos);
  if (ax.some((v, j) => Math.abs(v - calc[j]) > 30)) return new Response("Os eixos não batem com as respostas", { status: 422 });

  const reg = { m: modo, i, ax, ex, t: b.tempo, r: b.respostas, x: expl, id: b.idade ?? null, uf: b.uf ?? null,
    se: b.autoid?.espectro ?? null, si: b.autoid?.ideologia ? IDEOLOGIAS.indexOf(b.autoid.ideologia) : null,
    cf: b.confianca, tb: b.desempate, inc: b.inconsistencias, ci: b.inicio ?? null, env: b.envio, de: b.de ? MODO[b.de] : null,
    // versão do cálculo que classificou o resultado (2 = com o filtro das extremas e as frases reescritas em 23/10/2026)
    cv: [2, 3].includes(b.calculo) ? b.calculo : 1 };
  // o código do envio é aleatório e gerado no aparelho: se a pessoa reenviar (conexão caiu no meio), não duplica.
  // Quem continua num modo maior grava um segundo registro com o mesmo código; o painel conta só o mais completo.
  const chave = b.de ? `${b.envio}~${modo}` : b.envio;
  const { repetido } = await banco.inserirResultado(conj, hoje(), chave, reg);
  return Response.json({ ok: true, conjunto: conj, repetido }, { headers: SEM_CACHE });
};
