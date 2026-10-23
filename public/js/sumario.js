// Páginas de documento (termos, metodologia, perguntas frequentes): o sumário marca a seção que está sendo lida.
(function(){var links=[].slice.call(document.querySelectorAll(".sumario a"));if(!("IntersectionObserver"in window))return;
  var mapa={};links.forEach(function(a){mapa[a.getAttribute("href").slice(1)]=a});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.removeAttribute("aria-current")});var a=mapa[e.target.id];if(a)a.setAttribute("aria-current","true")}})},{rootMargin:"-80px 0px -70% 0px"});
  document.querySelectorAll(".texto section").forEach(function(s){io.observe(s)})})();
