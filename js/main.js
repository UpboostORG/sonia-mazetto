/* Sonia Mazetto — interações e animações */

(function () {
  "use strict";

  /* Header: fio inferior surge ao rolar */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* Menu móvel */
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    });
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Barra de progresso de scroll */
  if (!reduced) {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    let ticking = false;
    const updateBar = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = pct + "%";
      ticking = false;
    };
    updateBar();
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(updateBar); ticking = true; }
    }, { passive: true });
  }

  /* Contador animado */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const dur = 1500;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* Prepara os números para contagem (preserva prefixo/sufixo) */
  document.querySelectorAll(".stat .num, .fb-num").forEach((el) => {
    const m = el.textContent.trim().match(/^([^\d]*)(\d+)(.*)$/);
    if (!m) return;
    el.dataset.prefix = m[1];
    el.dataset.count = m[2];
    el.dataset.suffix = m[3];
    if (!reduced) el.textContent = m[1] + "0" + m[3];
  });
  const triggerCount = (el) => {
    const nums = el.matches("[data-count]") ? [el] : el.querySelectorAll("[data-count]");
    nums.forEach(animateCount);
  };

  /* Revelação ao rolar (com escalonamento por grade) */
  const autoSelector = [
    ".section-head", ".course-card", ".about-copy",
    ".service-card", ".coral-col", ".coral-note", ".pull-quote",
    ".talk", ".talks-photos figure", ".project-card", ".media-card",
    ".article-card", ".featured-article", ".contact-copy",
    ".stat", ".tl-item", ".persona", ".module", ".step", ".format-card",
    ".faq", ".cta-band", ".credentials", ".check-list", ".course-topics",
    ".hero-chips", ".gallery figure", ".figure-band", ".quote-feature",
    ".track-card", ".price-card", ".plans-lead-copy"
  ].join(", ");
  document.querySelectorAll(autoSelector).forEach((el) => el.classList.add("reveal"));

  /* Fotos grandes revelam com "wipe" + zoom */
  document
    .querySelectorAll(".about-photo, .editorial-photo, .course-photo, .contact-photo")
    .forEach((el) => el.classList.add("img-reveal"));

  /* Escalonamento suave para filhos de grades */
  const grids = document.querySelectorAll(
    ".service-grid, .article-grid, .media-cards, .project-grid, .persona-grid, " +
    ".format-grid, .steps, .stat-row, .gallery, .talk-list, .module-list, " +
    ".credentials, .check-list, .hero-chips"
  );
  grids.forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => {
      if (child.classList.contains("reveal")) {
        child.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 70}ms`);
      }
    });
  });

  const all = Array.from(document.querySelectorAll(".reveal, .img-reveal"));

  if (reduced || !("IntersectionObserver" in window) || location.hash) {
    /* chegando por âncora (#secao), revela tudo de imediato —
       o salto do navegador não pode aterrissar em conteúdo oculto */
    all.forEach((el) => { el.classList.add("is-visible"); triggerCount(el); });
  } else {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            triggerCount(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    all.forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.92) {
        el.classList.add("is-visible");
        triggerCount(el);
      } else {
        io.observe(el);
      }
    });
  }

  /* Formulário de contato → abre o WhatsApp com a mensagem pronta */
  const form = document.getElementById("wa-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = (form.nome.value || "").trim();
      const assunto = form.assunto.value || "";
      const msg = (form.mensagem.value || "").trim();
      let text = "Olá, Sonia!";
      if (nome) text += ` Meu nome é ${nome}.`;
      text += ` Assunto: ${assunto}.`;
      if (msg) text += ` ${msg}`;
      const url = "https://wa.me/556599826370?text=" + encodeURIComponent(text);
      window.open(url, "_blank", "noopener");
    });
  }

  /* Modal de credenciais (chips do hero) */
  const CREDS = {
    fono: {
      kicker: "Formação clínica",
      title: "Fonoaudióloga",
      text: "Especializada em Motricidade Orofacial, Sonia começou onde a comunicação nasce: a clínica. É a base científica do método — voz, respiração e articulação tratadas como fenômenos do corpo.",
      link: "sobre.html#formacao", label: "Ver a trajetória completa",
    },
    mestre: {
      kicker: "Formação acadêmica",
      title: "Mestre em Ciências da Saúde",
      text: "O rigor da pesquisa aplicado à comunicação humana. Método e evidência sustentam cada treinamento, mentoria e palestra.",
      link: "sobre.html#formacao", label: "Ver a trajetória completa",
    },
    pnl: {
      kicker: "Comportamento",
      title: "Master em PNL",
      text: "Programação Neurolinguística: como os padrões de linguagem organizam o pensamento — e como usá-los para construir conexão, confiança e influência.",
      link: "sobre.html#formacao", label: "Ver a trajetória completa",
    },
    psi: {
      kicker: "Profundidade",
      title: "Psicanalista",
      text: "A escuta do que a técnica sozinha não alcança: a história, os silêncios e as razões pelas quais cada pessoa fala como fala.",
      link: "sobre.html#formacao", label: "Ver a trajetória completa",
    },
    escritora: {
      kicker: "Palavra escrita",
      title: "Escritora",
      text: "Colunista semanal na imprensa de Mato Grosso e no LinkedIn — ideias sobre comunicação, comportamento e potencial humano, publicadas toda semana.",
      link: "artigos.html", label: "Ler os artigos",
    },
  };

  const credTriggers = document.querySelectorAll("[data-cred]");
  if (credTriggers.length) {
    const overlay = document.createElement("div");
    overlay.className = "cred-overlay";
    overlay.hidden = true;
    overlay.innerHTML =
      '<div class="cred-modal" role="dialog" aria-modal="true" aria-labelledby="cred-title">' +
      '<button type="button" class="cred-close" aria-label="Fechar">×</button>' +
      '<p class="cred-kicker"></p><h3 id="cred-title"></h3>' +
      '<p class="cred-text"></p><a class="btn cred-link" href="#"></a></div>';
    document.body.appendChild(overlay);

    let lastTrigger = null;
    const open = (key, trigger) => {
      const c = CREDS[key];
      if (!c) return;
      overlay.querySelector(".cred-kicker").textContent = c.kicker;
      overlay.querySelector("#cred-title").textContent = c.title;
      overlay.querySelector(".cred-text").textContent = c.text;
      const link = overlay.querySelector(".cred-link");
      link.href = c.link;
      link.textContent = c.label;
      lastTrigger = trigger;
      overlay.hidden = false;
      requestAnimationFrame(() => overlay.classList.add("is-open"));
      document.body.style.overflow = "hidden";
      overlay.querySelector(".cred-close").focus();
    };
    const close = () => {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(() => { overlay.hidden = true; }, 300);
      if (lastTrigger) lastTrigger.focus();
    };

    credTriggers.forEach((btn) =>
      btn.addEventListener("click", () => open(btn.dataset.cred, btn))
    );
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay || e.target.closest(".cred-close")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.hidden) close();
    });
  }

  /* Ano corrente no rodapé */
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
