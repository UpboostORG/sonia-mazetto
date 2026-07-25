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

  /* Revelação ao rolar (com escalonamento por grade) */
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const autoSelector = [
    ".section-head", ".course-card", ".about-photo", ".about-copy",
    ".service-card", ".coral-col", ".coral-note", ".pull-quote",
    ".talk", ".talks-photos figure", ".project-card", ".media-card",
    ".article-card", ".featured-article", ".contact-copy", ".contact-photo"
  ].join(", ");
  document.querySelectorAll(autoSelector).forEach((el) => el.classList.add("reveal"));

  /* Escalonamento suave para filhos de grades */
  const grids = document.querySelectorAll(
    ".service-grid, .article-grid, .media-cards, .project-grid, .persona-grid, " +
    ".format-grid, .steps, .stat-row, .gallery, .talk-list, .module-list"
  );
  grids.forEach((grid) => {
    Array.from(grid.children).forEach((child, i) => {
      if (child.classList.contains("reveal") || child.matches(autoSelector)) {
        child.style.setProperty("--reveal-delay", `${Math.min(i, 6) * 75}ms`);
      }
    });
  });

  const all = Array.from(document.querySelectorAll(".reveal"));

  if (reduced || !("IntersectionObserver" in window)) {
    all.forEach((el) => el.classList.add("is-visible"));
  } else {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    all.forEach((el) => {
      // conteúdo já visível no carregamento aparece de imediato
      if (el.getBoundingClientRect().top < vh * 0.92) {
        el.classList.add("is-visible");
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
