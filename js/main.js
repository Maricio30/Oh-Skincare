function initNav() {
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  const overlay = document.getElementById("navOverlay");

  if (!navToggle || !nav || !overlay) return;

  // iOS-friendly scroll lock
  const lockScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.dataset.scrollY = String(y);
    document.body.classList.add("no-scroll");

    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  };

  const unlockScroll = () => {
    const y = Number(document.body.dataset.scrollY || "0");
    document.body.classList.remove("no-scroll");

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    delete document.body.dataset.scrollY;

    window.scrollTo(0, y);
  };

  const openNav = () => {
    nav.classList.add("is-open");
    overlay.hidden = false;
    navToggle.setAttribute("aria-expanded", "true");
    lockScroll();
  };

  const closeNav = () => {
    nav.classList.remove("is-open");
    overlay.hidden = true;
    navToggle.setAttribute("aria-expanded", "false");
    unlockScroll();
  };

  navToggle.addEventListener("click", () => {
    nav.classList.contains("is-open") ? closeNav() : openNav();
  });

  overlay.addEventListener("click", closeNav);
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeNav());

  // Safety: si pasa a desktop con el menú abierto, cerrarlo
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && nav.classList.contains("is-open")) closeNav();
  });
}

document.addEventListener("partials:loaded", initNav);
