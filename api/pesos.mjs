// Rota /api/pesos no Vercel: só repassa o pedido pra servidor/rotas/pesos.mjs.
import rota from "../servidor/rotas/pesos.mjs";
export const GET = (req) => rota(req);
