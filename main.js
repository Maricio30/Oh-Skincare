// ===== MENÚ MÓVIL =====
const toggle = document.querySelector(".nav__toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== CARRUSEL (BOTONES) =====
document.querySelectorAll(".carousel-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.target;
    const dir = Number(btn.dataset.dir);
    const carousel = document.getElementById(id);
    if (!carousel) return;

    // scroll dinámico según el ancho del item (mejor que 320 fijo)
    const item = carousel.querySelector(".carousel__item");
    const step = item ? item.getBoundingClientRect().width + 16 : 320;

    carousel.scrollBy({ left: dir * step, behavior: "smooth" });
  });
});

document.querySelectorAll('[data-target="adCarousel"]').length
document.getElementById("adCarousel")

document.querySelectorAll(".carousel").forEach(carousel => {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  carousel.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = "grabbing";
  });

  carousel.addEventListener("mouseleave", () => {
    isDown = false;
    carousel.style.cursor = "grab";
  });

  carousel.addEventListener("mouseup", () => {
    isDown = false;
    carousel.style.cursor = "grab";
  });

  carousel.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.2; // velocidad
    carousel.scrollLeft = scrollLeft - walk;
  });

  // cursor por defecto
  carousel.style.cursor = "grab";
});





// ===== AUTOPLAY PARA CARRUSELES =====
function setupCarouselAutoplay(carousel, intervalMs = 2800) {
  let timer = null;

  const getStep = () => {
    // busca un item típico (galería o antes/después)
    const item = carousel.querySelector(".carousel__item, .ad__item");
    if (!item) return 320;
    const styles = getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap || styles.gap || "16") || 16;
    return item.getBoundingClientRect().width + gap;
  };

  const tick = () => {
    const step = getStep();
    const max = carousel.scrollWidth - carousel.clientWidth;

    // si llegó al final, vuelve al inicio
    if (carousel.scrollLeft >= max - 2) {
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      carousel.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  const start = () => {
    stop();
    timer = setInterval(tick, intervalMs);
  };

  const stop = () => {
    if (timer) clearInterval(timer);
    timer = null;
  };

  // Pausar si el usuario interactúa
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);

  carousel.addEventListener("touchstart", stop, { passive: true });
  carousel.addEventListener("touchend", start, { passive: true });

  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  // iniciar
  start();
}

// Activa autoplay en todos los carruseles
document.querySelectorAll(".carousel").forEach(c => setupCarouselAutoplay(c, 2800));

setupCarouselAutoplay(c, 4000);






// ===== AUTOPLAY PRO (LOOP INFINITO SIN SALTO) =====
(function () {
  // Respeta "reduced motion"
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduceMotion) return;

  function setupLoopAutoplay(carousel, { intervalMs = 2800 } = {}) {
    const items = Array.from(carousel.children);
    if (items.length < 2) return;

    // Clona todos los items para crear loop infinito
    items.forEach((item) => carousel.appendChild(item.cloneNode(true)));

    let timer = null;
    let paused = false;

    const getGap = () => {
      const styles = getComputedStyle(carousel);
      const gap = parseFloat(styles.gap || styles.columnGap || "16");
      return Number.isFinite(gap) ? gap : 16;
    };

    const getStep = () => {
      const item = carousel.querySelector(".carousel__item, .ad__item") || carousel.firstElementChild;
      if (!item) return 320;
      return item.getBoundingClientRect().width + getGap();
    };

    const getOriginalWidth = () => {
      // El ancho original es la suma de la mitad de scrollWidth (porque duplicamos)
      return carousel.scrollWidth / 2;
    };

    const tick = () => {
      if (paused) return;

      const step = getStep();
      const originalWidth = getOriginalWidth();

      carousel.scrollBy({ left: step, behavior: "smooth" });

      // Si ya entramos a la mitad clonada, regresamos sin animación
      // (No se nota porque el contenido es igual)
      window.setTimeout(() => {
        if (carousel.scrollLeft >= originalWidth) {
          carousel.scrollLeft -= originalWidth;
        }
      }, 350);
    };

    const start = () => {
      stop();
      timer = setInterval(tick, intervalMs);
    };

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    // Pausas profesionales (hover, touch, focus)
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };

    carousel.addEventListener("mouseenter", pause);
    carousel.addEventListener("mouseleave", resume);

    carousel.addEventListener("touchstart", pause, { passive: true });
    carousel.addEventListener("touchend", resume, { passive: true });

    carousel.addEventListener("focusin", pause);
    carousel.addEventListener("focusout", resume);

    // Mejor UX: si el usuario scrollea manualmente, pausa un poquito y luego sigue
    let userScrollTimeout = null;
    carousel.addEventListener("scroll", () => {
      pause();
      clearTimeout(userScrollTimeout);
      userScrollTimeout = setTimeout(() => resume(), 1200);
    });

    start();
  }

  document.querySelectorAll('.carousel[data-autoplay="true"]').forEach((carousel) => {
    setupLoopAutoplay(carousel, { intervalMs: 2800 }); // cambia a 4000 si lo quieres más elegante
  });
})();







