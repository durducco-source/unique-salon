/* ==========================================================================
   UNIQUE Salon — interactions & motion
   GSAP + ScrollTrigger + Lenis (CDN). Everything degrades gracefully:
   without the libraries the page is fully readable and usable.
   ========================================================================== */
(() => {
  "use strict";

  const cfg = window.UNIQUE_CONFIG || {};
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  let lenis = null;

  // Always start the experience from the hero (unless a #section was requested)
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (!location.hash) window.scrollTo(0, 0);

  /* ---------- WhatsApp links ---------- */
  const waUrl = (msg) =>
    `https://wa.me/${cfg.whatsapp || "34663091030"}?text=${encodeURIComponent(msg || cfg.whatsappMessage || "Hola UNIQUE ✨ Me gustaría reservar una cita.")}`;
  $$(".js-wa").forEach((a) => { a.href = waUrl(a.dataset.msg); });

  /* ---------- Year ---------- */
  $$("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Opening hours (Europe/Madrid) ---------- */
  (function openingHours() {
    const hours = cfg.hours;
    if (!hours) return;
    let day, minutes;
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Madrid", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      const get = (t) => parts.find((p) => p.type === t).value;
      day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get("weekday")];
      minutes = (parseInt(get("hour"), 10) % 24) * 60 + parseInt(get("minute"), 10);
    } catch (e) {
      const d = new Date(); day = d.getDay(); minutes = d.getHours() * 60 + d.getMinutes();
    }
    const toMin = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
    const today = hours[day];
    const open = !!today && minutes >= toMin(today[0]) && minutes < toMin(today[1]);
    const row = $(`.hours tr[data-day="${day}"]`);
    if (row) row.classList.add("is-today");
    const badge = $("[data-open-state]");
    if (badge) {
      badge.textContent = open ? "Abierto ahora" : "Cerrado ahora";
      badge.classList.add("is-ready");
      badge.classList.toggle("is-open", open);
    }
  })();

  /* ---------- Smooth scroll (Lenis) ---------- */
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 });
    window.uniqueLenis = lenis;
    if (hasGsap) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add((t) => lenis.raf(t * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  const scrollToTarget = (target) => {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  /* ---------- Mobile menu ---------- */
  const burger = $(".burger");
  const menu = $("#menu");
  const setMenu = (open) => {
    root.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.setAttribute("aria-hidden", String(!open));
    if (lenis) open ? lenis.stop() : lenis.start();
    else document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setMenu(!root.classList.contains("menu-open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && root.classList.contains("menu-open")) setMenu(false); });

  /* ---------- Anchor links ---------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2 && id !== "#") return;
      const target = id === "#" || id === "#top" ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      if (root.classList.contains("menu-open")) setMenu(false);
      scrollToTarget(target);
    });
  });

  /* ---------- Header state + mobile booking bar ---------- */
  const header = $(".header");
  const mbar = $(".mbar");
  const book = $("#reservar");
  let lastY = window.scrollY;
  let bookVisible = false;
  if ("IntersectionObserver" in window && book) {
    new IntersectionObserver((entries) => {
      bookVisible = entries[0].isIntersecting;
      onScroll();
    }, { threshold: 0.25 }).observe(book);
  }
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (!root.classList.contains("menu-open")) {
      if (goingDown && y > window.innerHeight * 0.9) header.classList.add("is-hidden");
      if (goingUp) header.classList.remove("is-hidden");
    }
    if (goingDown || goingUp) lastY = y;
    mbar.classList.toggle("is-visible", y > window.innerHeight * 0.7 && !bookVisible);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link ---------- */
  if ("IntersectionObserver" in window) {
    const links = $$(".nav a");
    const map = new Map(links.map((l) => [l.getAttribute("href").slice(1), l]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const link = map.get(en.target.id);
        if (link && en.isIntersecting) {
          links.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- Reviews slider ---------- */
  (function reviews() {
    const slides = $$(".review");
    if (!slides.length) return;
    const count = $(".reviews__count b");
    let i = 0, timer;
    const show = (n) => {
      slides[i].classList.remove("is-active");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("is-active");
      if (count) count.textContent = String(i + 1).padStart(2, "0");
    };
    const auto = () => { clearInterval(timer); if (!reduceMotion) timer = setInterval(() => show(i + 1), 7000); };
    $(".rv-next").addEventListener("click", () => { show(i + 1); auto(); });
    $(".rv-prev").addEventListener("click", () => { show(i - 1); auto(); });
    const slider = $(".reviews__slider");
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", auto);
    auto();
  })();

  /* ---------- Lightbox ---------- */
  (function lightbox() {
    const items = $$(".g-item");
    const box = $(".lightbox");
    if (!items.length || !box) return;
    const img = $("img", box);
    const cap = $("figcaption", box);
    let idx = 0, lastFocus = null, touchX = null;
    const render = () => {
      const a = items[idx];
      const thumb = $("img", a);
      img.src = a.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      cap.textContent = a.dataset.caption || "";
    };
    const open = (n) => {
      idx = n; lastFocus = document.activeElement; render();
      box.hidden = false; if (lenis) lenis.stop(); document.body.style.overflow = "hidden";
      $(".lightbox__close", box).focus();
    };
    const close = () => {
      box.hidden = true; if (lenis) lenis.start(); document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    const step = (d) => { idx = (idx + d + items.length) % items.length; render(); };
    items.forEach((a, n) => a.addEventListener("click", (e) => { e.preventDefault(); open(n); }));
    $(".lightbox__close", box).addEventListener("click", close);
    $(".lightbox__prev", box).addEventListener("click", () => step(-1));
    $(".lightbox__next", box).addEventListener("click", () => step(1));
    box.addEventListener("click", (e) => { if (e.target === box) close(); });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
    box.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      touchX = null;
    });
  })();

  /* ---------- Services: floating image preview (desktop) ---------- */
  (function servicePreview() {
    const prev = $(".svc-preview");
    if (!prev || !finePointer) return;
    const pimg = $("img", prev);
    let x = 0, y = 0, cx = 0, cy = 0, running = false;
    const loop = () => {
      cx += (x - cx) * 0.14; cy += (y - cy) * 0.14;
      prev.style.translate = `${cx - 120}px ${cy - 160}px`;
      if (running) requestAnimationFrame(loop);
    };
    $$(".svc").forEach((row) => {
      row.addEventListener("mouseenter", (e) => {
        pimg.src = row.dataset.img; x = cx = e.clientX + 40; y = cy = e.clientY;
        prev.classList.add("is-on");
        if (!running) { running = true; requestAnimationFrame(loop); }
      });
      row.addEventListener("mousemove", (e) => { x = e.clientX + 150; y = e.clientY; });
      row.addEventListener("mouseleave", () => { prev.classList.remove("is-on"); running = false; });
    });
  })();

  /* ---------- Custom cursor (desktop) ---------- */
  (function cursor() {
    if (!finePointer || reduceMotion) return;
    const c = $(".cursor");
    root.classList.add("has-cursor");
    let x = -100, y = -100, cx = -100, cy = -100;
    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      c.style.translate = `${cx}px ${cy}px`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.addEventListener("mouseover", (e) => {
      const t = e.target;
      c.classList.toggle("is-view", !!t.closest(".g-item, .nail-card"));
      c.classList.toggle("is-link", !t.closest(".g-item, .nail-card") && !!t.closest("a, button"));
    });
    document.addEventListener("mouseleave", () => { x = y = -100; });
  })();

  /* ---------- Magnetic booking button ---------- */
  (function magnetic() {
    if (!finePointer || reduceMotion) return;
    $$(".magnetic").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  })();

  /* ---------- Mobile nails carousel progress ---------- */
  const nailsTrack = $(".nails__track");
  const nailsBar = $(".nails__progress i");
  const nativeNailsProgress = () => {
    const max = nailsTrack.scrollWidth - nailsTrack.clientWidth;
    nailsBar.style.transform = `scaleX(${max > 0 ? nailsTrack.scrollLeft / max : 0})`;
  };
  nailsTrack.addEventListener("scroll", nativeNailsProgress, { passive: true });

  /* ======================================================================
     MOTION (GSAP)
     ====================================================================== */
  const loader = $(".loader");
  const hideLoader = () => root.classList.add("no-loader");

  if (!hasGsap || reduceMotion) {
    hideLoader();
    return;
  }

  const gsap = window.gsap;
  const ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });

  /* --- Split helpers --- */
  $$(".display .line, .book__title .line").forEach((line) => {
    line.style.overflow = "hidden";
    line.style.paddingBottom = ".06em";
    line.innerHTML = `<span class="line-in" style="display:inline-block">${line.innerHTML}</span>`;
  });
  $$(".js-words").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
  });

  /* --- Hero intro (after loader) --- */
  const heroIntro = () => {
    const tl = gsap.timeline();
    tl.from(".hero .ch", { yPercent: 110, duration: 1.4, stagger: 0.07 }, 0)
      .from(".hero__img--main", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, 0)
      .from(".hero__img--main img", { scale: 1.35, duration: 2.2 }, 0)
      .from(".hero__img--a, .hero__img--b", { autoAlpha: 0, y: 80, duration: 1.6, stagger: 0.15 }, 0.5)
      .from(".hero__salon, .hero__top > *", { autoAlpha: 0, y: 16, duration: 1, stagger: 0.08 }, 0.7)
      .from(".hero .reveal-up", { autoAlpha: 0, y: 30, duration: 1.1, stagger: 0.1 }, 0.8);
    return tl;
  };

  let seen = false;
  try { seen = sessionStorage.getItem("unique_seen") === "1"; sessionStorage.setItem("unique_seen", "1"); } catch (e) { /* storage unavailable */ }

  if (seen || !loader) {
    hideLoader();
    heroIntro();
  } else {
    if (lenis) lenis.stop();
    const tl = gsap.timeline({
      onComplete: () => { hideLoader(); if (lenis) lenis.start(); }
    });
    tl.from(".loader__word span", { yPercent: 110, duration: 1, stagger: 0.06 })
      .from(".loader__sub", { autoAlpha: 0, y: 10, duration: .8 }, 0.4)
      .to(".loader__line i", { scaleX: 1, duration: 1.1, ease: "power2.inOut" }, 0.2)
      .to(".loader__inner", { autoAlpha: 0, y: -20, duration: .6, ease: "power2.in" }, "+=0.15")
      .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.2")
      .add(heroIntro(), "-=0.75");
  }

  /* --- Hero: scroll parallax & fade --- */
  const heroST = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
  $$(".hero [data-speed]").forEach((el) => {
    gsap.to(el, { yPercent: parseFloat(el.dataset.speed) * 100, ease: "none", scrollTrigger: heroST });
  });
  gsap.to(".hero__title", { yPercent: -18, autoAlpha: 0.15, ease: "none", scrollTrigger: heroST });
  gsap.to(".hero__img--main img", { scale: 1.12, ease: "none", scrollTrigger: heroST });

  /* --- Hero: subtle mouse drift --- */
  if (finePointer) {
    const drift = $$(".hero__img img").map((img, i) => ({
      x: gsap.quickTo(img, "x", { duration: 1.4, ease: "power3.out" }),
      y: gsap.quickTo(img, "y", { duration: 1.4, ease: "power3.out" }),
      k: [10, -18, 22][i] || 12
    }));
    $(".hero").addEventListener("mousemove", (e) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      drift.forEach((d) => { d.x(nx * d.k); d.y(ny * d.k); });
    });
  }

  /* --- Line reveals for headings --- */
  $$(".display, .book__title").forEach((h) => {
    gsap.from($$(".line-in", h), {
      yPercent: 110, duration: 1.3, stagger: 0.1,
      scrollTrigger: { trigger: h, start: "top 85%" }
    });
  });

  /* --- Word-by-word reading reveal --- */
  $$(".js-words").forEach((el) => {
    gsap.fromTo($$(".w", el), { opacity: 0.14 }, {
      opacity: 1, ease: "none", stagger: 0.1,
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true }
    });
  });

  /* --- Generic fade-up (outside hero) --- */
  $$(".reveal-up").filter((el) => !el.closest(".hero")).forEach((el) => {
    gsap.from(el, { autoAlpha: 0, y: 40, duration: 1.2, scrollTrigger: { trigger: el, start: "top 90%" } });
  });
  gsap.utils.toArray(".svc, .pillar, .makeup__looks li, .loc-block, .footer__col").forEach((el) => {
    gsap.from(el, { autoAlpha: 0, y: 36, duration: 1.1, scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  /* --- Image reveals (curtain + zoom-out) --- */
  $$(".reveal-img").forEach((wrap) => {
    const img = $("img, iframe", wrap);
    const tl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: "top 85%" } });
    tl.from(wrap, { clipPath: "inset(100% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" });
    if (img && img.tagName === "IMG" && !img.hasAttribute("data-parallax")) tl.from(img, { scale: 1.3, duration: 2 }, 0);
  });

  /* --- Parallax images --- */
  $$("[data-parallax]").forEach((img) => {
    gsap.fromTo(img, { yPercent: -10 }, {
      yPercent: 0, ease: "none",
      scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
    });
  });
  gsap.fromTo(".makeup__img--small", { yPercent: 25 }, {
    yPercent: -10, ease: "none",
    scrollTrigger: { trigger: ".makeup", start: "top bottom", end: "bottom top", scrub: true }
  });
  gsap.fromTo(".exp__media img", { scale: 1.2 }, {
    scale: 1, ease: "none",
    scrollTrigger: { trigger: ".exp", start: "top bottom", end: "bottom top", scrub: true }
  });

  /* --- Gallery: staggered entrance --- */
  ST.batch(".g-item", {
    start: "top 92%",
    onEnter: (els) => gsap.from(els, { autoAlpha: 0, y: 70, scale: 0.96, duration: 1.3, stagger: 0.12, overwrite: true }),
    once: true
  });

  /* --- Instagram stack fans out --- */
  gsap.from(".st", {
    x: 0, y: 0, rotation: (i) => [14, 6, -3, -9, -15][i] || 0,
    ease: "none",
    scrollTrigger: { trigger: ".insta", start: "top 85%", end: "center 55%", scrub: 1 }
  });

  /* --- Booking section --- */
  gsap.from(".book__steps li", { autoAlpha: 0, y: 20, stagger: 0.12, scrollTrigger: { trigger: ".book__steps", start: "top 90%" } });
  gsap.from(".book__btn", { scale: 0.6, autoAlpha: 0, duration: 1.4, ease: "elastic.out(1, 0.6)", scrollTrigger: { trigger: ".book__btn", start: "top 92%" } });
  gsap.fromTo(".book__bg img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".book", start: "top bottom", end: "bottom top", scrub: true } });

  /* --- Footer giant word --- */
  gsap.from(".footer__word", { yPercent: 40, autoAlpha: 0, duration: 1.6, scrollTrigger: { trigger: ".footer__word", start: "top 95%" } });

  /* --- Nails: pinned horizontal scroll on desktop --- */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 900px)", () => {
    const section = $(".nails");
    section.classList.add("is-pinned");
    nailsTrack.scrollLeft = 0;
    const distance = () => Math.max(0, nailsTrack.scrollWidth - window.innerWidth);
    const tween = gsap.to(nailsTrack, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: ".nails__pin",
        start: "top top",
        end: () => "+=" + distance(),
        pin: true,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => { nailsBar.style.transform = `scaleX(${self.progress})`; }
      }
    });
    $$(".nail-card img").forEach((img) => {
      gsap.fromTo(img, { scale: 1.18 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: img.closest(".nail-card"), containerAnimation: tween, start: "left right", end: "center center", scrub: true }
      });
    });
    return () => { section.classList.remove("is-pinned"); gsap.set(nailsTrack, { clearProps: "transform" }); };
  });
  mm.add("(max-width: 899px)", () => {
    gsap.from(".nail-card", { autoAlpha: 0, x: 60, stagger: 0.08, duration: 1.2, scrollTrigger: { trigger: ".nails", start: "top 75%" } });
  });

  /* Refresh once fonts & images are ready so pin distances are exact */
  window.addEventListener("load", () => ST.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ST.refresh());
})();
