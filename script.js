/* =========================================================
   Mendanha Advogados — script.js
   Interações simples do site (sem bibliotecas externas)
   ========================================================= */
(function () {
  "use strict";

  var reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.remove("sem-js");

  /* ---------- 1. Sombra leve no cabeçalho ao rolar ---------- */
  var cabecalho = document.querySelector(".cabecalho");
  window.addEventListener("scroll", function () {
    if (cabecalho) cabecalho.classList.toggle("rolado", window.scrollY > 10);
  }, { passive: true });

  /* ---------- 2. Menu do celular ---------- */
  var botaoMenu = document.querySelector(".botao-menu");
  function fecharMenu() {
    document.body.classList.remove("menu-aberto");
    if (botaoMenu) botaoMenu.setAttribute("aria-expanded", "false");
  }
  if (botaoMenu) {
    botaoMenu.addEventListener("click", function () {
      var aberto = document.body.classList.toggle("menu-aberto");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
    });
    document.querySelectorAll(".menu a").forEach(function (link) { link.addEventListener("click", fecharMenu); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharMenu(); });
  }

  /* ---------- 3. Elementos aparecem suavemente ao rolar ---------- */
  var elementos = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window && !reduzirMovimento) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) { entrada.target.classList.add("visivel"); observador.unobserve(entrada.target); }
      });
    }, { threshold: 0.1 });
    elementos.forEach(function (el) { observador.observe(el); });
  } else {
    elementos.forEach(function (el) { el.classList.add("visivel"); });
  }

  /* ---------- 4. Carrossel da equipe: passa devagar e sem fim ---------- */
  document.querySelectorAll("[data-carrossel]").forEach(function (carrossel) {
    var trilho = carrossel.querySelector(".carrossel-trilho");
    if (!trilho || reduzirMovimento) return;
    var originais = trilho.querySelectorAll(".membro:not([aria-hidden])").length;
    var VELOCIDADE = 25; /* pixels por segundo */
    var posicao = 0, velocidade = VELOCIDADE, alvo = VELOCIDADE, anterior = null, largura = 0;

    function medir() {
      var espaco = parseFloat(getComputedStyle(trilho).columnGap) || 0;
      largura = 0;
      for (var i = 0; i < originais; i++) largura += trilho.children[i].getBoundingClientRect().width + espaco;
    }
    medir();
    window.addEventListener("resize", medir);
    carrossel.addEventListener("pointerenter", function () { alvo = 0; });   /* para ao passar o mouse */
    carrossel.addEventListener("pointerleave", function () { alvo = VELOCIDADE; });

    function animar(tempo) {
      if (anterior === null) anterior = tempo;
      var dt = Math.min((tempo - anterior) / 1000, 0.05);
      anterior = tempo;
      velocidade += (alvo - velocidade) * Math.min(dt * 3, 1);
      posicao -= velocidade * dt;
      if (-posicao >= largura) posicao += largura;   /* volta ao primeiro sem pulo */
      trilho.style.transform = "translate3d(" + posicao.toFixed(2) + "px,0,0)";
      requestAnimationFrame(animar);
    }
    requestAnimationFrame(animar);
  });

  /* ---------- 5. Áreas de atuação: abre a área indicada no endereço ---------- */
  function abrirArea() {
    var alvo = location.hash && document.querySelector(location.hash);
    if (alvo && alvo.tagName === "DETAILS") alvo.open = true;
  }
  window.addEventListener("hashchange", abrirArea);
  abrirArea();

  /* ---------- 6. Mapa do Google: carrega quando chega perto da tela ---------- */
  document.querySelectorAll("[data-mapa]").forEach(function (caixa) {
    var emMoldura = false;
    try { emMoldura = window.self !== window.top; } catch (e) { emMoldura = true; }
    if (emMoldura) return; /* em prévias incorporadas o Google bloqueia o mapa; fica o aviso com link */
    function carregar() {
      var iframe = document.createElement("iframe");
      iframe.src = caixa.getAttribute("data-mapa");
      iframe.title = "Mapa: localização do escritório";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      caixa.appendChild(iframe);
    }
    if ("IntersectionObserver" in window) {
      var obs = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { carregar(); obs.disconnect(); } }, { rootMargin: "300px" });
      obs.observe(caixa);
    } else { carregar(); }
  });

  /* ---------- 7. Ano atual no rodapé ---------- */
  document.querySelectorAll("[data-ano]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
