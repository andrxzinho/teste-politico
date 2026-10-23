// Coisas usadas pelas rotas do servidor. As listas de frases são geradas a partir dos dados do teste
// (ferramentas/gerar_listas.mjs): se as frases mudarem, gere de novo.
import { banco } from "./banco.mjs";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const IDEOLOGIAS = ["Comunista", "Anarquista", "Esquerda radical", "Socialista democrático", "Social-democrata", "Esquerda progressista", "Ecologista", "Esquerda conservadora", "Nacional-desenvolvimentista", "Centrista", "Social-liberal", "Democracia cristã", "Liberal progressista", "Liberal clássico", "Libertário", "Anarcocapitalista", "Liberal-conservador", "Conservador", "Direita nacional-conservadora", "Direita radical", "Fascista"];
export const EIXOS = ["E","A","C","N","D","S"];
export const EXTREMOS = ["com","anq","fas","anc"];
// ids das frases na ordem fixa: eixo + posição (ex.: E0, S9) e depois as de desempate (P0 a P14)
export const IDS = ["E0","E30","E2","E22","E23","E24","E6","E31","E8","E10","E11","E12","E13","E14","E15","E16","E17","E18","E19","E20","E25","E26","E27","E28","E29","A19","A1","A27","A20","A4","A5","A22","A23","A8","A9","A10","A28","A12","A13","A14","A15","A16","A17","A18","A24","A25","A26","A21","C0","C16","C2","C22","C23","C17","C6","C24","C8","C19","C10","C11","C20","C14","C15","C21","C18","N15","N1","N2","N16","N4","N21","N6","N17","N22","N9","N11","N18","N13","N14","N19","N20","D0","D1","D2","D3","D4","D5","D18","D7","D9","D10","D11","D12","D14","D15","D16","D17","D19","D20","D21","D22","D23","S0","S1","S2","S10","S4","S5","S6","S7","S8","S9","P0","P1","P2","P3","P4","P5","P6","P7","P8","P9","P10","P11","P12","P13","P14","L0","L1","L2","L3","L4","L5","L6","L7","L8","L9","L10","L11","L12","L13","L14","L15","K0","K1","K2","K3","K4","K5","K6","K7","K8","K9","K10","K11","K12","K13","K14","K15","K16","K17","K18","K19","K20","K21","K22","K23","X1","X2","X3","X4","X5","X6","X7","X8","X9","X10","X11","X12","X13","X14","X15","X16","X17","X18","X19","X20","X21","X22","X23","X24","X25","X26","X27","X28","X29","X30","X31","X32","X33","X34","X35","X36","X37","X38","X39","X40","X41","X42","X43","X44","X45","X46","X47","X48","X49","X50","X51","X52","X53","X54","Y1","Y2","Y3","Y4"];
// eixo e direção de cada frase (usado nos indicadores de qualidade)
export const META = {"E0":["E",-1],"E30":["E",1],"E2":["E",-1],"E22":["E",-1],"E23":["E",1],"E24":["E",-1],"E6":["E",1],"E31":["E",-1],"E8":["E",1],"E10":["E",-1],"E11":["E",1],"E12":["E",-1],"E13":["E",-1],"E14":["E",-1],"E15":["E",-1],"E16":["E",1],"E17":["E",1],"E18":["E",1],"E19":["E",1],"E20":["E",-1],"E25":["E",-1],"E26":["E",1],"E27":["E",1],"E28":["E",-1],"E29":["E",-1],"A19":["A",-1],"A1":["A",-1],"A27":["A",1],"A20":["A",-1],"A4":["A",1],"A5":["A",-1],"A22":["A",1],"A23":["A",1],"A8":["A",1],"A9":["A",-1],"A10":["A",1],"A28":["A",-1],"A12":["A",1],"A13":["A",-1],"A14":["A",1],"A15":["A",-1],"A16":["A",-1],"A17":["A",1],"A18":["A",-1],"A24":["A",-1],"A25":["A",-1],"A26":["A",-1],"A21":["A",1],"C0":["C",-1],"C16":["C",1],"C2":["C",1],"C22":["C",-1],"C23":["C",1],"C17":["C",-1],"C6":["C",1],"C24":["C",-1],"C8":["C",-1],"C19":["C",1],"C10":["C",-1],"C11":["C",1],"C20":["C",-1],"C14":["C",1],"C15":["C",-1],"C21":["C",1],"C18":["C",1],"N15":["N",1],"N1":["N",-1],"N2":["N",1],"N16":["N",-1],"N4":["N",1],"N21":["N",-1],"N6":["N",1],"N17":["N",1],"N22":["N",-1],"N9":["N",1],"N11":["N",1],"N18":["N",1],"N13":["N",-1],"N14":["N",-1],"N19":["N",-1],"N20":["N",1],"D0":["D",-1],"D1":["D",1],"D2":["D",1],"D3":["D",1],"D4":["D",-1],"D5":["D",-1],"D18":["D",1],"D7":["D",1],"D9":["D",1],"D10":["D",-1],"D11":["D",1],"D12":["D",-1],"D14":["D",-1],"D15":["D",-1],"D16":["D",1],"D17":["D",1],"D19":["D",-1],"D20":["D",1],"D21":["D",1],"D22":["D",1],"D23":["D",1],"S0":["S",1],"S1":["S",1],"S2":["S",1],"S10":["S",1],"S4":["S",-1],"S5":["S",-1],"S6":["S",-1],"S7":["S",-1],"S8":["S",-1],"S9":["S",1],"P0":["E",-1],"P1":["E",1],"P2":["E",-1],"P3":["A",1],"P4":["A",-1],"P5":["A",1],"P6":["C",1],"P7":["C",-1],"P8":["C",1],"P9":["N",-1],"P10":["N",1],"P11":["N",-1],"P12":["D",1],"P13":["D",-1],"P14":["D",1],"L0":["E",1],"L1":["A",1],"L2":["C",1],"L3":["N",1],"L4":["E",1],"L5":["E",1],"L6":["E",1],"L7":["A",1],"L8":["A",1],"L9":["A",1],"L10":["C",1],"L11":["C",1],"L12":["C",1],"L13":["N",1],"L14":["N",1],"L15":["N",1],"K0":["N",1],"K1":["N",1],"K2":["E",1],"K3":["A",1],"K4":["A",1],"K5":["E",1],"K6":["C",1],"K7":["E",1],"K8":["E",1],"K9":["E",1],"K10":["N",1],"K11":["N",1],"K12":["D",1],"K13":["E",1],"K14":["D",1],"K15":["A",1],"K16":["A",1],"K17":["E",1],"K18":["E",1],"K19":["A",1],"K20":["A",1],"K21":["C",1],"K22":["C",1],"K23":["E",1],"X1":["E",-1],"X2":["E",-1],"X3":["E",1],"X4":["E",1],"X5":["E",-1],"X6":["E",-1],"X7":["E",1],"X8":["E",1],"X9":["E",-1],"X10":["E",-1],"X11":["E",1],"X12":["E",1],"X13":["A",-1],"X14":["A",-1],"X15":["A",1],"X16":["A",1],"X17":["A",-1],"X18":["A",-1],"X19":["A",1],"X20":["A",1],"X21":["A",-1],"X22":["A",-1],"X23":["A",1],"X24":["A",1],"X25":["C",-1],"X26":["C",-1],"X27":["C",1],"X28":["C",1],"X29":["C",-1],"X30":["C",-1],"X31":["C",1],"X32":["C",1],"X33":["C",-1],"X34":["C",-1],"X35":["C",1],"X36":["C",1],"X37":["N",-1],"X38":["N",-1],"X39":["N",1],"X40":["N",1],"X41":["N",-1],"X42":["N",-1],"X43":["N",1],"X44":["N",1],"X45":["N",-1],"X46":["N",-1],"X47":["N",1],"X48":["N",1],"X49":["D",1],"X50":["D",-1],"X51":["D",1],"X52":["D",-1],"X53":["D",1],"X54":["D",-1],"Y1":["D",1],"Y2":["A",-1],"Y3":["C",1],"Y4":["E",-1]};
// frases que não entram na média do eixo (marcadores de extremos fora do eixo Democracia e temas avulsos)
export const NAO_PONTUA = ["E13","E14","E15","E16","E17","E18","E20","A23","A15","A16","A18","N11","L0","L1","L2","L3","L4","L5","L6","L7","L8","L9","L10","L11","L12","L13","L14","L15","K0","K1","K2","K3","K4","K5","K6","K7","K8","K9","K10","K11","K12","K13","K14","K15","K16","K17","K18","K19","K20","K21","K22","K23"];
// perguntas de escolha forçada: eixo e posição de cada opção (usadas na correção do estilo de resposta)
export const ESCADAS = {"L0":["E",[-85,-50,-20,25,65]],"L1":["A",[-75,-40,0,40,80]],"L2":["C",[-75,-40,0,40,80]],"L3":["N",[-75,-35,0,40,80]]};
export const TEMPOS = ["<5","5-10","10-15","15-20","20-30","30+"];
export const IDADES = ["18-24","25-34","35-44","45-59","60+"];
export const UFS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO","Exterior"];
export const ESPECTROS = ["Esquerda","Centro-esquerda","Centro","Centro-direita","Direita","Não me identifico com nenhum"];
export const CONFIANCAS = ["alta","media","baixa"];
export const hoje = () => new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10); // dia no horário de Brasília
// Publicação oficial = dados reais; versões de pré-visualização e localhost = área de teste.
// No Vercel, VERCEL_ENV diz qual é qual; fora dele (testes locais), vale o endereço: rascunhos com "--" e localhost são teste.
// No site oficial, a área de teste só é usada com uma sessão de teste aberta pelo painel (ver abaixo).
export const ehProducao = (req) => {
  const h = new URL(req.url).hostname; if (h === "localhost" || h.startsWith("127.")) return false;
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === "production";
  return !h.includes("--");
};
export const SEM_CACHE = { "cache-control": "no-store" };

// ---------- leitura dos dados
export const noPeriodo = (dia, de, ate) => (!de || dia >= de) && (!ate || dia <= ate);
export const registros = async (conj, de, ate) => maisCompleto(await banco.resultados(conj, de, ate));
export const eventos = (conj, de, ate) => banco.eventos(conj, de, ate);
export const contagem = (conj) => banco.contarPessoas(conj);
// Quem continuou de um modo menor pra um maior tem dois registros com o mesmo código de envio: conta só o mais completo.
const ORDEM_MODO = { r: 1, c: 2, a: 3 };
export function maisCompleto(rs) {
  const melhor = new Map(), sem = [];
  for (const r of rs) { if (!r.env) { sem.push(r); continue; } const o = melhor.get(r.env); if (!o || ORDEM_MODO[r.m] > ORDEM_MODO[o.m]) melhor.set(r.env, r); }
  return [...sem, ...melhor.values()];
}

// Limite de pedidos por visitante: o endereço vira um código (hash com um segredo), nunca é guardado como está.
export async function passouDoLimite(req, rota, porMinuto = 30) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || req.headers.get("x-real-ip") || "desconhecido";
  const seg = await segredo(true, "config/segredo-limite");
  const chave = createHmac("sha256", seg).update(`${rota}|${ip}`).digest("base64url").slice(0, 22);
  return (await banco.contarPedido(chave, Math.floor(Date.now() / 60e3))) > porMinuto;
}

// Sessões de teste: códigos assinados (HMAC-SHA256) emitidos só pelo painel, com validade de 12 horas.
// O segredo fica guardado no armazenamento do site; apagá-lo encerra todas as sessões já emitidas.
const SEGREDO = "config/segredo-teste";
export const SESSAO_HORAS = 12;
async function segredo(criar, chave = SEGREDO) {
  let s = await banco.lerConfig(chave);
  if (!s && criar) { await banco.gravarConfigSeNovo(chave, randomBytes(32).toString("base64")); s = await banco.lerConfig(chave); }
  return s;
}
export async function emitirSessao() {
  const seg = await segredo(true), exp = Date.now() + SESSAO_HORAS * 3600e3;
  const corpo = Buffer.from(JSON.stringify({ exp, n: randomBytes(9).toString("base64url") })).toString("base64url");
  return { token: `${corpo}.${createHmac("sha256", seg).update(corpo).digest("base64url")}`, exp };
}
export async function sessaoValida(token) {
  if (typeof token !== "string" || token.length > 300) return false;
  const [corpo, sig] = token.split(".");
  if (!corpo || !sig) return false;
  const seg = await segredo(false);
  if (!seg) return false;
  const esperado = createHmac("sha256", seg).update(corpo).digest(), recebido = Buffer.from(sig, "base64url");
  if (recebido.length !== esperado.length || !timingSafeEqual(recebido, esperado)) return false;
  try { const { exp } = JSON.parse(Buffer.from(corpo, "base64url").toString()); return Number.isFinite(exp) && exp > Date.now(); } catch { return false; }
}
export const encerrarSessoes = () => banco.apagarConfig(SEGREDO);

// Desafio contra envios automáticos: o servidor entrega um desafio assinado; o aparelho precisa achar um número que,
// junto com o desafio e o código do envio, gere um SHA-256 começando com DESAFIO_BITS bits zero (menos de 1 segundo
// num celular). O resultado só é aceito de 30 segundos a 7 dias depois do desafio, e cada desafio vale pra um envio só.
export const DESAFIO_BITS = 16;
const DESAFIO_MIN = 30e3, DESAFIO_MAX = 7 * 864e5;
export async function emitirDesafio() {
  const seg = await segredo(true, "config/segredo-desafio");
  const corpo = Buffer.from(JSON.stringify({ t: Date.now(), n: randomBytes(9).toString("base64url") })).toString("base64url");
  return { desafio: `${corpo}.${createHmac("sha256", seg).update(corpo).digest("base64url")}`, bits: DESAFIO_BITS, espera: DESAFIO_MIN / 1000 };
}
const zeros = (buf) => { let z = 0; for (const b of buf) { if (b === 0) { z += 8; continue; } z += Math.clz32(b) - 24; break; } return z; };
// devolve null se a prova vale, ou o motivo da recusa
export async function conferirProva(prova, envio) {
  if (!prova || typeof prova.d !== "string" || prova.d.length > 300 || typeof prova.n !== "string" || !/^[0-9a-z]{1,16}$/.test(prova.n)) return "Prova ausente. Recarregue a página e envie de novo.";
  const [corpo, sig] = prova.d.split("."), seg = await segredo(false, "config/segredo-desafio");
  if (!corpo || !sig || !seg) return "Desafio inválido.";
  const esperado = createHmac("sha256", seg).update(corpo).digest(), recebido = Buffer.from(sig, "base64url");
  if (recebido.length !== esperado.length || !timingSafeEqual(recebido, esperado)) return "Desafio inválido.";
  let t; try { t = JSON.parse(Buffer.from(corpo, "base64url").toString()).t; } catch { return "Desafio inválido."; }
  const idade = Date.now() - t;
  if (!Number.isFinite(idade) || idade < DESAFIO_MIN) return "Envio rápido demais.";
  if (idade > DESAFIO_MAX) return "Desafio vencido. Recarregue a página e envie de novo.";
  if (zeros(createHash("sha256").update(`${prova.d}:${envio}:${prova.n}`).digest()) < DESAFIO_BITS) return "Prova inválida.";
  // cada desafio vale pra um envio só (reenviar o mesmo resultado continua permitido)
  const marca = createHash("sha256").update(prova.d).digest("hex").slice(0, 32);
  if ((await banco.marcarDesafio(marca, envio)) !== envio) return "Este desafio já foi usado.";
  return null;
}
