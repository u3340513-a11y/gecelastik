/**
 * Gece Mobil Lastikçi 7/24 — main.js v2.0
 *
 * Modüller:
 *  - Mobil menü aç/kapat
 *  - Header scroll efekti
 *  - Scroll-reveal animasyonları (IntersectionObserver)
 *  - Sayaç animasyonu
 *  - Footer yıl güncelleme
 */

(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Yardımcı fonksiyonlar
  --------------------------------------------------------------- */

  /**
   * Sayıyı animasyonlu olarak hedefe doğru say.
   * @param {HTMLElement} el   - Sayacı içeren element
   * @param {number}      end  - Hedef sayı
   * @param {number}      dur  - Animasyon süresi (ms)
   */
  function animateCounter(el, end, dur) {
    var start = 0;
    var startTime = null;
    var suffix = el.dataset.suffix || "";

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / dur, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * end);
      el.textContent = current.toLocaleString("tr-TR") + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = end.toLocaleString("tr-TR") + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------
     Footer yıl güncelleme
  --------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------
     Mobil menü aç/kapat
  --------------------------------------------------------------- */
  var hamburger = document.getElementById("hamburgerBtn");
  var navLinks  = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Menü linkine tıklanınca kapat
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

    // ESC tuşu ile kapat
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.focus();
      }
    });
  }

  /* ---------------------------------------------------------------
     Header scroll efekti
  --------------------------------------------------------------- */
  var siteHeader = document.getElementById("siteHeader");

  if (siteHeader) {
    var lastScrollY = 0;
    var ticking = false;

    function onScroll() {
      lastScrollY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(function () {
          if (lastScrollY > 60) {
            siteHeader.classList.add("scrolled");
          } else {
            siteHeader.classList.remove("scrolled");
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
     Scroll-reveal (IntersectionObserver)
  --------------------------------------------------------------- */
  function initReveal() {
    var selectors = ".reveal, .reveal-left, .reveal-right";
    var revealEls = document.querySelectorAll(selectors);

    if (!revealEls.length) return;

    // prefers-reduced-motion kontrolü
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealEls.forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     Sayaç animasyonu (stat kartları)
  --------------------------------------------------------------- */
  function initCounters() {
    var counterEls = document.querySelectorAll(".stat-number[data-count]");
    if (!counterEls.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el  = entry.target;
            var end = parseInt(el.dataset.count, 10);
            animateCounter(el, end, 1600);
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     Başlangıç
  --------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initReveal();
    initCounters();
  });
})();
