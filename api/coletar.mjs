// Rota /api/coletar no Vercel: só repassa o pedido pra servidor/rotas/coletar.mjs.
import rota from "../servidor/rotas/coletar.mjs";
export const GET = (req) => rota(req);
export const POST = (req) => rota(req);
