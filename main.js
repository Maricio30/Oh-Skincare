// ==========================
//  MENÚ MÓVIL + OVERLAY
// ==========================
const toggle = document.querySelector(".nav__toggle");
const nav = document.querySelector(".nav");
const overlay = document.querySelector(".nav-overlay");

function openNav() {
  if (!nav || !toggle) return;
  nav.classList.add("is-open");
  toggle.setAttribute("aria-expanded", "true");

  if (overlay) overlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeNav() {
  if (!nav || !toggle) return;
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");

  if (overlay) overlay.hidden = true;
  document.body.style.overflow = "";
}

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    isOpen ? closeNav() : openNav();
  });

  // cerrar al tocar un link
  document.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  // cerrar al tocar el overlay
  overlay?.addEventListener("click", closeNav);
}

// ==========================
//  CARRUSEL: BOTONES (← →)
// ==========================
document.querySelectorAll(".carousel-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.target;
    const dir = Number(btn.dataset.dir);
    const carousel = document.getElementById(id);
    if (!carousel) return;

    const item =
      carousel.querySelector(".carousel__item, .ad__item") ||
      carousel.firstElementChild;

    const styles = getComputedStyle(carousel);
    const gap = parseFloat(styles.gap || styles.columnGap || "16") || 16;
    const step = item ? item.getBoundingClientRect().width + gap : 320;

    carousel.scrollBy({ left: dir * step, behavior: "smooth" });
  });
});

// ==========================
//  CARRUSEL: DRAG (MOUSE)
// ==========================
document.querySelectorAll(".carousel").forEach((carousel) => {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  carousel.style.cursor = "grab";

  carousel.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = "grabbing";
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    carousel.style.cursor = "grab";
  });

  carousel.addEventListener("mouseleave", () => {
    isDown = false;
    carousel.style.cursor = "grab";
  });

  carousel.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const walk = (e.pageX - startX) * 1.2;
    carousel.scrollLeft = scrollLeft - walk;
  });
});

// ==========================
//  AUTOPLAY PRO (LOOP SUAVE)
//  Solo en .carousel[data-autoplay="true"]
// ==========================
(function () {
  const reduceMotion = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  )?.matches;
  if (reduceMotion) return;

  function setupLoopAutoplay(carousel, intervalMs = 2800) {
    const children = Array.from(carousel.children);
    if (children.length < 2) return;

    // duplicamos para loop infinito
    children.forEach((el) => carousel.appendChild(el.cloneNode(true)));

    let paused = false;

    const getGap = () => {
      const styles = getComputedStyle(carousel);
      const gap = parseFloat(styles.gap || styles.columnGap || "16");
      return Number.isFinite(gap) ? gap : 16;
    };

    const getStep = () => {
      const item =
        carousel.querySelector(".carousel__item, .ad__item") ||
        carousel.firstElementChild;
      if (!item) return 320;
      return item.getBoundingClientRect().width + getGap();
    };

    const getOriginalWidth = () => carousel.scrollWidth / 2;

    const tick = () => {
      if (paused) return;

      const step = getStep();
      const originalWidth = getOriginalWidth();

      carousel.scrollBy({ left: step, behavior: "smooth" });

      setTimeout(() => {
        if (carousel.scrollLeft >= originalWidth) {
          carousel.scrollLeft -= originalWidth;
        }
      }, 350);
    };

    const timer = setInterval(tick, intervalMs);

    const pause = () => (paused = true);
    const resume = () => (paused = false);

    carousel.addEventListener("mouseenter", pause);
    carousel.addEventListener("mouseleave", resume);

    carousel.addEventListener("touchstart", pause, { passive: true });
    carousel.addEventListener("touchend", resume, { passive: true });

    let userScrollTimeout = null;
    carousel.addEventListener("scroll", () => {
      pause();
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(resume, 1200);
    });

    // si un día necesitas detenerlo:
    // clearInterval(timer);
  }

  document
    .querySelectorAll('.carousel[data-autoplay="true"]')
    .forEach((carousel) => setupLoopAutoplay(carousel, 3200)); // 3200 más elegante
})();
