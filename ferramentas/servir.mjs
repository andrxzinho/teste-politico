// Abre o site no seu computador, sem instalar nada além do Node: npm run local (ou PORTA=3000 npm run local).
// Serve só a pasta public/. As rotas do servidor (/api/*) não rodam aqui: o teste funciona todo, mas nada é enviado
// pro estudo (o site entra em modo teste fora do endereço oficial).
import { servidorEstatico } from "../testes/ajuda/ambiente.mjs";

const s = await servidorEstatico("public", Number(process.env.PORTA) || 8080);
console.log(`Site rodando em ${s.url}  (Ctrl+C pra parar)`);
