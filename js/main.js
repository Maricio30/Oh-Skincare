function initNav() {
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  const overlay = document.getElementById("navOverlay");

  if (!navToggle || !nav || !overlay) return;

  const openNav = () => {
    nav.classList.add("is-open");
    overlay.hidden = false;
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  };

  const closeNav = () => {
    nav.classList.remove("is-open");
    overlay.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };

  navToggle.addEventListener("click", () => {
    nav.classList.contains("is-open") ? closeNav() : openNav();
  });

  overlay.addEventListener("click", closeNav);
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeNav());
}

// ✅ Cuando terminen de cargarse header/footer:
document.addEventListener("partials:loaded", initNav);
