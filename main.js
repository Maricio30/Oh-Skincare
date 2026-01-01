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

