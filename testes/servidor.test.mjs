// Servidor: coleta, painel, planilha, limite de pedidos e backup, com o banco em memória (BANCO=memoria em servidor/banco.mjs).
// Os envios são gerados no navegador pelo próprio código do site, como faria uma pessoa de verdade.
import { createHash, randomUUID } from "node:crypto";
import { servidorEstatico, navegador, verificador, executandoDireto } from "./ajuda/ambiente.mjs";

const GERAR = `(async(modo,lado)=>{st=fresh(modo);st.seen=st.bs.map((_,j)=>j);st.study.ok=true;
  const r=o=>o.f==='l'?lado:o.f==='c'?((o.va<o.vb)===(lado<0)?-2:2):extreme(o)?-2:Math.max(-2,Math.min(2,Math.round(lado*1.3*o.d)));
  for(const id of st.base){if(gated(ITEMS[id])&&!gateOK(id)){st.ans[id]='g';continue}st.ans[id]=r(ITEMS[id])}R=compute(st.ans);return JSON.parse(JSON.stringify(studyPayload()))})`;
const CONTINUAR = `(()=>{st=fresh('quick');st.seen=st.bs.map((_,j)=>j);st.study.ok=true;const r=o=>o.f==='l'?1:o.f==='c'?2:extreme(o)?-2:Math.max(-2,Math.min(2,Math.round(o.d)));
  for(const id of st.base){if(gated(ITEMS[id])&&!gateOK(id)){st.ans[id]='g';continue}st.ans[id]=r(ITEMS[id])}R=compute(st.ans);const p1=JSON.parse(JSON.stringify(studyPayload()));st.study.sent=true;
  aprofundar();for(const id of seq().slice(st.cur)){if(gated(ITEMS[id])&&!gateOK(id)){st.ans[id]='g';continue}st.ans[id]=r(ITEMS[id])}R=compute(st.ans);return [p1,JSON.parse(JSON.stringify(studyPayload()))]})()`;

export async function testarServidor() {
  const v = verificador("Servidor");
  // 1. envios gerados pelo site
  const s = await servidorEstatico(), b = await navegador(), pg = await b.newPage();
  await pg.goto(s.url + "/index.html");
  const normais = [];
  for (const m of ["quick", "full", "deep"]) for (const lado of [-1, 1]) normais.push(await pg.evaluate(`${GERAR}('${m}',${lado})`));
  const continuacao = await pg.evaluate(CONTINUAR);
  await b.close(); await s.fechar();

  // 2. rotas do servidor, com o banco em memória
  process.env.BANCO = "memoria"; process.env.COLETA_INICIO = "2026-01-01"; process.env.PAINEL_SENHA = "senha-de-teste-123456"; process.env.CRON_SECRET = "segredo-do-agendamento";
  delete process.env.VERCEL_ENV;
  const coletar = (await import("../servidor/rotas/coletar.mjs")).default, painel = (await import("../servidor/rotas/painel.mjs")).default, backup = (await import("../servidor/rotas/backup.mjs")).default;
  const { registros, contagem } = await import("../servidor/comum.mjs"), { banco } = await import("../servidor/banco.mjs");
  const U = "https://testepolitico.vercel.app/api/coletar", agora = Date.now; let desloc = 0; Date.now = () => agora() + desloc;
  const zeros = (buf) => { let z = 0; for (const x of buf) { if (!x) { z += 8; continue; } return z + Math.clz32(x) - 24; } return z; };
  const provar = (d, e, bits) => { for (let i = 0; ; i++) { const n = i.toString(36); if (zeros(createHash("sha256").update(`${d}:${e}:${n}`).digest()) >= bits) return { d, n }; } };
  const enviar = async (p, d0) => { desloc = 0; const d = d0 || (await (await coletar(new Request(U + "?desafio"))).json()); desloc = 31e3; const r = await coletar(new Request(U, { method: "POST", body: JSON.stringify({ ...p, prova: provar(d.desafio, p.envio, d.bits) }) })); return [r.status, d]; };

  for (const p of normais) v.confere((await enviar(p))[0] === 200, `envio legítimo (${p.modo}) recusado`);
  const [s1, d1] = await enviar(continuacao[0]); const [s2] = await enviar(continuacao[1], d1);
  v.confere(s1 === 200 && s2 === 200, "continuação de modo recusada");

  const base = normais[2], bruto = async (body) => (await coletar(new Request(U, { method: "POST", body }))).status;
  const invalidos = { "JSON quebrado": "{nao é json", "texto enorme": JSON.stringify({ ...base, envio: randomUUID(), explicacoes: Array(20000).fill("A1") }), "respostas de tamanho errado": JSON.stringify({ ...base, envio: randomUUID(), respostas: "abc" }), "modo inexistente": JSON.stringify({ ...base, envio: randomUUID(), modo: "turbo" }), "ideologia inexistente": JSON.stringify({ ...base, envio: randomUUID(), ideologia: "<script>" }), "idade inválida": JSON.stringify({ ...base, envio: randomUUID(), idade: "menor de 18" }), "sem prova anti-robô": JSON.stringify({ ...base, envio: randomUUID() }), "versão antiga": JSON.stringify({ ...base, v: 5, envio: randomUUID() }) };
  for (const [nome, body] of Object.entries(invalidos)) v.confere((await bruto(body)) >= 400, `${nome} deveria ser recusado`);
  const adulterado = { ...base, envio: randomUUID(), eixos: { ...base.eixos, E: 100, C: 100 } };
  v.confere((await enviar(adulterado))[0] === 422, "eixos adulterados deveriam ser recusados (422)");
  // página aberta antes da versão 2 do cálculo: o nome antigo da ideologia continua aceito, gravado com o nome novo
  const antigo = { ...base, envio: randomUUID(), ideologia: "Esquerda radical" };
  v.confere((await enviar(antigo))[0] === 200, "envio com o nome antigo de uma ideologia deveria ser aceito");

  // 3. painel
  // PAINEL_SENHA curta demais (menos de 16 caracteres) é ignorada
  const senhaBoa = process.env.PAINEL_SENHA; process.env.PAINEL_SENHA = "curta";
  v.confere((await (await painel(new Request("https://testepolitico.vercel.app/api/painel?estado"))).json()).configurado === false, "PAINEL_SENHA curta deveria ser ignorada");
  process.env.PAINEL_SENHA = senhaBoa;
  const H = (senha) => ({ authorization: "Bearer " + senha }), P = "https://testepolitico.vercel.app/api/painel";
  v.confere((await painel(new Request(P + "?conjunto=real", { headers: H("errada") }))).status === 401, "senha errada deveria dar 401");
  const d = await (await painel(new Request(P + "?conjunto=real", { headers: H(process.env.PAINEL_SENHA) }))).json();
  v.confere(d.total === 8, `painel deveria contar 8 pessoas, contando o envio com o nome antigo (deu ${d.total})`);
  v.confere(JSON.stringify(d.porModo) === JSON.stringify({ essencial: 2, padrao: 4, aprofundado: 2 }), `contagem por modo errada: ${JSON.stringify(d.porModo)}`);
  const csv = await (await painel(new Request(P + "?exportar=real", { headers: H(process.env.PAINEL_SENHA) }))).text();
  const cab = csv.split("\n")[0];
  v.confere(csv.trim().split("\n").length - 1 === 8, "planilha deveria ter 8 linhas");
  v.confere(!/envio|"env"|"ip"|"dia"|"data"/i.test(cab), "planilha não pode ter código de envio, IP ou data");

  v.confere((await contagem("real")) === 8, "contagem de pessoas deveria ser 8 (a continuação não conta de novo)");

  // 4. backup diário: só com o segredo do agendamento; guarda os dados reais e aparece no painel
  v.confere((await backup(new Request("https://testepolitico.vercel.app/api/backup"))).status === 401, "backup sem o segredo deveria ser recusado");
  const rb = await backup(new Request("https://testepolitico.vercel.app/api/backup", { headers: { authorization: "Bearer " + process.env.CRON_SECRET } }));
  v.confere(rb.status === 200 && (await rb.json()).resultados === 8, "backup deveria guardar as 8 pessoas");
  const lista = await (await painel(new Request(P + "?backups", { headers: H(process.env.PAINEL_SENHA) }))).json();
  v.confere(lista.backups.length === 1 && /^\d{4}-\d{2}-\d{2}\.json$/.test(lista.backups[0]), "painel deveria listar o backup");
  const bk = await (await painel(new Request(P + "?backup=" + lista.backups[0], { headers: H(process.env.PAINEL_SENHA) }))).json();
  v.confere(bk.registros.length === (await registros("real")).length, "backup baixado deveria ter os mesmos registros");

  // 5. limite de pedidos: o 31º pedido no mesmo minuto, do mesmo endereço, é recusado
  Date.now = agora; let ult = 0;
  for (let i = 0; i < 31; i++) ult = (await coletar(new Request(U, { headers: { "x-forwarded-for": "203.0.113.9" } }))).status;
  v.confere(ult === 429, `o 31º pedido seguido deveria ser recusado (deu ${ult})`);
  v.confere((await coletar(new Request(U, { headers: { "x-forwarded-for": "203.0.113.10" } }))).status === 200, "outro visitante não deveria ser afetado pelo limite");

  // 6. desafio anti-robô usado duas vezes pra envios diferentes é recusado
  globalThis.__bancoMemoria.limites.clear(); // zera o limite de pedidos do passo anterior
  Date.now = () => agora() + desloc;
  const outro = { ...normais[0], envio: randomUUID() }, dup = { ...normais[1], envio: randomUUID() };
  const [s3, d3] = await enviar(outro); const [s4] = await enviar(dup, d3);
  v.confere(s3 === 200 && s4 === 429, `o mesmo desafio não deveria valer pra dois envios diferentes (${s3}, ${s4})`);
  // 6. fim do estudo: a coleta para e a tarefa diária apaga todos os dados e backups
  process.env.FIM_ESTUDO = "2000-01-01";
  const g = await (await coletar(new Request(U, { headers: { "x-forwarded-for": "203.0.113.50" } }))).json();
  v.confere(g.ativo === false, "depois do fim do estudo a coleta deveria estar desligada");
  const fim = await backup(new Request("https://testepolitico.vercel.app/api/backup", { headers: { authorization: "Bearer " + process.env.CRON_SECRET } }));
  const jf = await fim.json();
  v.confere(fim.status === 200 && jf.encerrado === true && jf.apagados > 0, "a tarefa diária deveria apagar os dados no fim do estudo");
  v.confere((await registros("real")).length === 0 && (await registros("teste")).length === 0, "no fim do estudo não pode sobrar nenhum resultado");
  const lf = await (await painel(new Request(P + "?backups", { headers: H(process.env.PAINEL_SENHA) }))).json();
  v.confere(lf.backups.length === 0, "no fim do estudo não pode sobrar nenhum backup");
  delete process.env.FIM_ESTUDO;
  Date.now = agora;
  return v.fim();
}
if (executandoDireto(import.meta.url)) process.exitCode = (await testarServidor()) ? 1 : 0;
