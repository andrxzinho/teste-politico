// Pesos das frases, calculados no painel a partir das respostas reais. Sem pesos, todas valem 1.
import { banco } from "../banco.mjs";
export default async () => {
  const p = await banco.lerConfig("config/pesos");
  return Response.json({ pesos: p?.pesos || {} }, { headers: { "cache-control": "public, max-age=300, s-maxage=300" } });
};
