// Partidos (CAND.part) com posição estimada nos eixos e a nota na escala ideológica de cientistas políticos (s, de 0 a 10).
// Os candidatos da eleição de 2026 saíram depois do 2º turno; estão no histórico do repositório.
// Parte do site carregada em ordem por index.html; os arquivos compartilham o mesmo escopo.
const CAND = {
 part:{label:"Partidos", list:[
  {n:"PSTU",p:[-92,-10,-65,-15],s:0.51},{n:"PCO",p:[-90,-40,-15,40],s:0.55},{n:"PCB",p:[-90,30,-45,40],s:0.69},{n:"PSOL",p:[-70,-35,-80,-30],s:1.41},
  {n:"UP",p:[-85,20,-65,35],s:1.63},{n:"PCdoB",p:[-60,15,-45,30],s:1.78},{n:"PT",p:[-45,5,-30,10],s:2.68},{n:"PSB",p:[-25,5,-25,0],s:3.59},
  {n:"Rede",p:[-25,-15,-30,-50],s:3.69},{n:"PDT",p:[-30,10,-15,35],s:3.86},{n:"PV",p:[-15,-15,-30,-45],s:4.12},{n:"Solidariedade",p:[10,20,15,10],s:6.01},
  {n:"Cidadania",p:[10,-10,-15,-10],s:6.17},{n:"Avante",p:[25,25,30,10],s:6.47},{n:"MDB",p:[30,25,25,5],s:6.50},{n:"PSDB",p:[40,20,10,-15],s:6.76},
  {n:"PSD",p:[40,30,30,10],s:6.94},{n:"Democrata",p:[35,40,25,20],s:7.29},{n:"Podemos",p:[45,40,40,15],s:7.44},{n:"PRTB",p:[45,65,70,45],s:7.49},
  {n:"Agir",p:[45,55,55,30],s:7.55},{n:"PP",p:[55,55,55,20],s:8.15},{n:"DC",p:[35,50,70,35],s:8.21},{n:"Republicanos",p:[50,60,75,25],s:8.33},
  {n:"União Brasil",p:[60,55,55,20],s:8.49},{n:"Novo",p:[85,25,35,-20],s:8.67},{n:"PL",p:[55,75,85,40],s:8.80},{n:"Missão",p:[65,75,30,15],s:null}
 ], extra:"Na eleição pra deputado federal e estadual, as vagas são divididas primeiro entre os partidos e federações, de acordo com os votos de cada um."}
};
// compatibilidade: concordância eixo a eixo (Economia, Liberdade × Ordem, Costumes, Brasil × Mundo), com curva que separa bem quem está longe
const CAXK=["E","A","C","N"], CW={E:2,A:.9,C:1.2,N:.5};
function candMatch(s,p,imp){let a=0,t=0;CAXK.forEach((k,i)=>{const w=CW[k]*((imp&&imp[k])||1);a+=w*Math.max(0,1-Math.abs(s[k]-p[i])/100);t+=w});
  let m=100*Math.pow(a/t,1.6);
  // lados opostos na economia: a compatibilidade cai aos poucos, sem corte brusco
  if(Math.sign(s.E)!==Math.sign(p[0])){const mn=Math.min(Math.abs(s.E),Math.abs(p[0]));m*=1-.4*Math.max(0,Math.min(1,(mn-15)/20))}
  return Math.round(m)}
const AXK=["E","A","C","N","D"];
function agree(u,p,w){let s=0,t=0;AXK.forEach((k,i)=>{s+=w[i]*Math.max(0,1-Math.abs(u[k]-p[i])/100);t+=w[i]});return Math.round(100*Math.pow(s/t,1.6))}

