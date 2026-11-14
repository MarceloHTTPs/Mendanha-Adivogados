/* =========================================================
   Mendanha Advogados — script.js
   Interações do site (sem bibliotecas externas)
   ========================================================= */
(function () {
  "use strict";

  /* Link do WhatsApp do escritório (o mesmo da bio do Instagram) */
  var LINK_WHATSAPP = "https://wa.me/message/4RAAFVGWKLFQA1";

  /* Preferências do visitante */
  var mouseFino = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  var reduzirMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* Avisa o CSS que o JavaScript está ativo */
  document.documentElement.classList.remove("sem-js");

  /* ---------- 1. Cabeçalho muda de cor ao rolar a página ---------- */
  var cabecalho = document.querySelector(".cabecalho");
  var barraProgresso = document.createElement("div");
  barraProgresso.className = "barra-progresso";
  document.body.appendChild(barraProgresso);

  function aoRolar() {
    if (cabecalho) cabecalho.classList.toggle("rolado", window.scrollY > 40);
    var altura = document.documentElement.scrollHeight - window.innerHeight;
    barraProgresso.style.transform =
      "scaleX(" + (altura > 0 ? window.scrollY / altura : 0) + ")";
  }
  window.addEventListener(
    "scroll",
    function () {
      requestAnimationFrame(aoRolar);
    },
    { passive: true },
  );
  aoRolar();

  /* ---------- 2. Menu do celular ---------- */
  var botaoMenu = document.querySelector(".botao-menu");
  function fecharMenu() {
    document.body.classList.remove("menu-aberto");
    if (botaoMenu) {
      botaoMenu.setAttribute("aria-expanded", "false");
      botaoMenu.setAttribute("aria-label", "Abrir menu");
    }
  }
  if (botaoMenu) {
    botaoMenu.addEventListener("click", function () {
      var aberto = document.body.classList.toggle("menu-aberto");
      botaoMenu.setAttribute("aria-expanded", String(aberto));
      botaoMenu.setAttribute(
        "aria-label",
        aberto ? "Fechar menu" : "Abrir menu",
      );
    });
    document.querySelectorAll(".menu a").forEach(function (link) {
      link.addEventListener("click", fecharMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") fecharMenu();
    });
  }

  /* ---------- 3. Destaca no menu a seção que está na tela ---------- */
  var linksMenu = document.querySelectorAll('.menu a[href^="#"]:not(.botao)');
  if ("IntersectionObserver" in window && linksMenu.length) {
    var observadorSecoes = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          linksMenu.forEach(function (link) {
            link.classList.toggle(
              "ativo",
              link.getAttribute("href") === "#" + entrada.target.id,
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    linksMenu.forEach(function (link) {
      var secao = document.querySelector(link.getAttribute("href"));
      if (secao) observadorSecoes.observe(secao);
    });
  }

  /* ---------- 4. Elementos aparecem suavemente ao rolar ---------- */
  var elementosRevelar = document.querySelectorAll(".revelar");
  if ("IntersectionObserver" in window) {
    var observadorRevelar = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visivel");
            observadorRevelar.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    elementosRevelar.forEach(function (el) {
      observadorRevelar.observe(el);
    });
  } else {
    elementosRevelar.forEach(function (el) {
      el.classList.add("visivel");
    });
  }

  /* ---------- 5. Números que contam de 0 até o valor ---------- */
  function animarContador(el) {
    var valorFinal = parseFloat(el.getAttribute("data-contador"));
    var casasDecimais = (el.getAttribute("data-contador").split(".")[1] || "")
      .length;
    var sufixo = el.getAttribute("data-sufixo") || "";
    var formatar = function (n) {
      return n.toFixed(casasDecimais).replace(".", ",") + sufixo;
    };
    if (reduzirMovimento) {
      el.textContent = formatar(valorFinal);
      return;
    }
    var inicio = null;
    function quadro(tempo) {
      if (!inicio) inicio = tempo;
      var progresso = Math.min((tempo - inicio) / 1600, 1);
      var suavizado = 1 - Math.pow(1 - progresso, 3);
      el.textContent = formatar(valorFinal * suavizado);
      if (progresso < 1) requestAnimationFrame(quadro);
    }
    requestAnimationFrame(quadro);
  }
  var contadores = document.querySelectorAll("[data-contador]");
  if ("IntersectionObserver" in window) {
    var observadorContador = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (entrada.isIntersecting) {
            animarContador(entrada.target);
            observadorContador.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    contadores.forEach(function (c) {
      observadorContador.observe(c);
    });
  }

  /* ---------- 6. Efeitos de mouse (só em computador) ---------- */
  if (mouseFino && !reduzirMovimento) {
    /* Luz dourada que acompanha o mouse no topo */
    document.querySelectorAll(".topo").forEach(function (topo) {
      topo.addEventListener("pointermove", function (e) {
        var r = topo.getBoundingClientRect();
        topo.style.setProperty("--mouse-x", e.clientX - r.left + "px");
        topo.style.setProperty("--mouse-y", e.clientY - r.top + "px");
      });
    });
    /* Brilho dourado que nasce no ponto onde o mouse entra no card */
    document
      .querySelectorAll(".diferencial, .area-linha")
      .forEach(function (card) {
        card.addEventListener("pointerenter", function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty("--pos-x", e.clientX - r.left + "px");
          card.style.setProperty("--pos-y", e.clientY - r.top + "px");
        });
      });
    /* Inclinação 3D suave nos cards da equipe */
    document.querySelectorAll(".membro").forEach(function (membro) {
      var cartao = membro.querySelector(".membro-cartao");
      if (!cartao) return;
      membro.addEventListener("pointermove", function (e) {
        var r = membro.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        cartao.style.transform =
          "rotateY(" + x * 8 + "deg) rotateX(" + -y * 8 + "deg)";
      });
      membro.addEventListener("pointerleave", function () {
        cartao.style.transform = "";
      });
    });
    /* Botão "magnético" que segue levemente o cursor */
    document.querySelectorAll(".magnetico").forEach(function (botao) {
      botao.addEventListener("pointermove", function (e) {
        var r = botao.getBoundingClientRect();
        botao.style.transform =
          "translate(" +
          (e.clientX - r.left - r.width / 2) * 0.18 +
          "px," +
          (e.clientY - r.top - r.height / 2) * 0.3 +
          "px)";
      });
      botao.addEventListener("pointerleave", function () {
        botao.style.transform = "";
      });
    });
  }

  /* ---------- 7. Carrossel contínuo da equipe ---------- */
  /* Os cards passam devagar e sem fim; ao passar o mouse, o carrossel freia suavemente. */
  document.querySelectorAll("[data-carrossel]").forEach(function (carrossel) {
    var trilho = carrossel.querySelector(".carrossel-trilho");
    if (!trilho || reduzirMovimento) return;
    var cards = trilho.children;
    var cardsOriginais =
      trilho.querySelectorAll(".membro:not([aria-hidden])").length ||
      cards.length;
    var VELOCIDADE = 28; /* pixels por segundo: aumente para passar mais rápido */
    var posicao = 0,
      velocidade = VELOCIDADE,
      velocidadeAlvo = VELOCIDADE;
    var ultimoQuadro = null,
      naTela = true,
      larguraGrupo = 0;

    function medir() {
      var espaco = parseFloat(getComputedStyle(trilho).columnGap) || 0;
      larguraGrupo = 0;
      for (var i = 0; i < cardsOriginais && i < cards.length; i++)
        larguraGrupo += cards[i].getBoundingClientRect().width + espaco;
    }
    medir();
    window.addEventListener("resize", medir);

    carrossel.addEventListener("pointerenter", function () {
      velocidadeAlvo = 0;
    });
    carrossel.addEventListener("pointerleave", function () {
      velocidadeAlvo = VELOCIDADE;
    });
    carrossel.addEventListener("focusin", function () {
      velocidadeAlvo = 0;
    });
    carrossel.addEventListener("focusout", function () {
      velocidadeAlvo = VELOCIDADE;
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        naTela = e[0].isIntersecting;
      }).observe(carrossel);
    }

    function animar(tempo) {
      if (ultimoQuadro === null) ultimoQuadro = tempo;
      var dt = Math.min((tempo - ultimoQuadro) / 1000, 0.05);
      ultimoQuadro = tempo;
      velocidade +=
        (velocidadeAlvo - velocidade) *
        Math.min(dt * 2.2, 1); /* acelera e freia com suavidade */
      if (naTela && !document.hidden && larguraGrupo) {
        posicao -= velocidade * dt;
        if (-posicao >= larguraGrupo)
          posicao += larguraGrupo; /* emenda invisível: volta ao primeiro */
        trilho.style.transform =
          "translate3d(" + posicao.toFixed(2) + "px,0,0)";
      }
      requestAnimationFrame(animar);
    }
    requestAnimationFrame(animar);
  });

  /* ---------- 8. Áreas de atuação: abre a área quando o link aponta para ela ---------- */
  function abrirAreaDoEndereco() {
    var alvo = location.hash && document.querySelector(location.hash);
    if (alvo && alvo.tagName === "DETAILS") alvo.open = true;
  }
  window.addEventListener("hashchange", abrirAreaDoEndereco);
  abrirAreaDoEndereco();

  /* ---------- 9. Mapa do Google (carrega perto da tela; o desenho fica por baixo) ---------- */
  document.querySelectorAll("[data-mapa]").forEach(function (caixaMapa) {
    var dentroDeMoldura = false;
    try {
      dentroDeMoldura = window.self !== window.top;
    } catch (e) {
      dentroDeMoldura = true;
    }
    if (dentroDeMoldura)
      return; /* em prévias incorporadas o Google bloqueia o mapa */
    function carregarMapa() {
      if (caixaMapa.querySelector("iframe")) return;
      var iframe = document.createElement("iframe");
      iframe.src = caixaMapa.getAttribute("data-mapa");
      iframe.title = caixaMapa.getAttribute("data-titulo") || "Mapa";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.allowFullscreen = true;
      iframe.addEventListener("load", function () {
        caixaMapa.classList.add("carregado");
      });
      caixaMapa.insertBefore(iframe, caixaMapa.firstChild.nextSibling);
    }
    if ("IntersectionObserver" in window) {
      var observadorMapa = new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            carregarMapa();
            observadorMapa.disconnect();
          }
        },
        { rootMargin: "300px" },
      );
      observadorMapa.observe(caixaMapa);
    } else {
      carregarMapa();
    }
  });

  /* ---------- 10. Formulário de contato → WhatsApp ---------- */
  var formulario = document.getElementById("formulario-contato");
  if (formulario) {
    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var dados = new FormData(formulario);
      var status = formulario.querySelector(".formulario-status");
      var nome = (dados.get("nome") || "").trim();
      var telefone = (dados.get("telefone") || "").trim();
      var mensagem = (dados.get("mensagem") || "").trim();
      if (!nome || !telefone || !mensagem) {
        status.textContent = "Por favor, preencha nome, telefone e mensagem.";
        return;
      }

      var texto =
        "Olá! Meu nome é " +
        nome +
        ".\n" +
        "Assunto: " +
        (dados.get("area") || "Não informado") +
        "\n" +
        "Telefone: " +
        telefone +
        "\n" +
        (dados.get("email") ? "E-mail: " + dados.get("email") + "\n" : "") +
        "\n" +
        mensagem;

      var abrirWhatsApp = function () {
        window.open(LINK_WHATSAPP, "_blank", "noopener");
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(
          function () {
            status.textContent =
              "Mensagem copiada! No WhatsApp, é só colar e enviar.";
            abrirWhatsApp();
          },
          function () {
            status.textContent = "Abrindo o WhatsApp…";
            abrirWhatsApp();
          },
        );
      } else {
        status.textContent = "Abrindo o WhatsApp…";
        abrirWhatsApp();
      }
    });
  }

  /* ---------- 11. Ano atual no rodapé ---------- */
  document.querySelectorAll("[data-ano]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
