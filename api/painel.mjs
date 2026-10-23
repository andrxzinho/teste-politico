// Rota /api/painel no Vercel: só repassa o pedido pra servidor/rotas/painel.mjs.
import rota from "../servidor/rotas/painel.mjs";
export const GET = (req) => rota(req);
export const POST = (req) => rota(req);
