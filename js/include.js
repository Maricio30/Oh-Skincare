async function includePartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar ${url}`);
  el.innerHTML = await res.text();
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await includePartial("#siteHeaderMount", "partials/header.html");
    await includePartial("#siteFooterMount", "partials/footer.html");

    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    // ✅ Aviso global: “ya existe header/footer en el DOM”
    document.dispatchEvent(new Event("partials:loaded"));
  } catch (e) {
    console.error(e);
  }
});
