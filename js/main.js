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
  document.querySelectorAll(".stat .num").forEach((el) => {
    const m = el.textContent.trim().match(/^([^\d]*)(\d+)(.*)$/);
    if (!m) return;
    el.dataset.prefix = m[1];
    el.dataset.count = m[2];
    el.dataset.suffix = m[3];
    if (!reduced) el.textContent = m[1] + "0" + m[3];
  });
  const triggerCount = (el) => {
    const num = el.matches(".num") ? el : el.querySelector(".num[data-count]");
    if (num) animateCount(num);
  };

  /* Revelação ao rolar (com escalonamento por grade) */
  const autoSelector = [
    ".section-head", ".course-card", ".about-copy",
    ".service-card", ".coral-col", ".coral-note", ".pull-quote",
    ".talk", ".talks-photos figure", ".project-card", ".media-card",
    ".article-card", ".featured-article", ".contact-copy",
    ".stat", ".tl-item", ".persona", ".module", ".step", ".format-card",
    ".faq", ".cta-band", ".credentials", ".check-list", ".course-topics",
    ".hero-chips", ".gallery figure"
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

  if (reduced || !("IntersectionObserver" in window)) {
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

  /* Ano corrente no rodapé */
  const ano = document.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
