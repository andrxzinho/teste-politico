// Uma vez por dia (tarefa agendada do Vercel): guarda uma cópia dos dados reais e faz a faxina (backups além de 7 dias,
// desafios anti-robô vencidos e janelas antigas do limite de pedidos). A consulta diária também mantém o banco
// do plano grátis ativo. Só a tarefa agendada chama esta rota: o Vercel manda CRON_SECRET no cabeçalho.
import { timingSafeEqual, createHash } from "node:crypto";
import { banco } from "../banco.mjs";
import { hoje, registros, eventos, SEM_CACHE } from "../comum.mjs";
const h = (s) => createHash("sha256").update(String(s)).digest();
export default async (req) => {
  const seg = process.env.CRON_SECRET, auth = req.headers.get("authorization") || "";
  if (!seg || !timingSafeEqual(h(auth), h("Bearer " + seg))) return new Response("Não autorizado", { status: 401 });
  const rs = await registros("real"), evs = await eventos("real");
  await banco.gravarBackup(hoje(), { gerado: new Date().toISOString(), registros: rs, eventos: evs });
  await banco.faxina();
  return Response.json({ ok: true, resultados: rs.length, eventos: evs.length }, { headers: SEM_CACHE });
};
