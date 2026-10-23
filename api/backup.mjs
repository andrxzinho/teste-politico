// Rota /api/backup no Vercel: só repassa o pedido pra servidor/rotas/backup.mjs.
import rota from "../servidor/rotas/backup.mjs";
export const GET = (req) => rota(req);
