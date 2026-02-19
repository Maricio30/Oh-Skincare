import { showCartToast } from "./ui.js";


async function loadProducts() {
  const res = await fetch("data/products.json");
  if (!res.ok) throw new Error("No se pudo cargar data/products.json");
  return res.json();
}

const formatPEN = (n) => "S/ " + Number(n).toFixed(2);

function getIdFromQuery(){
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function pickRelated(all, current, n=3){
  const sameCat = all.filter(p => p.id !== current.id && p.category && p.category === current.category);
  const others = all.filter(p => p.id !== current.id && (!current.category || p.category !== current.category));
  return [...sameCat, ...others].slice(0, n);
}

function renderDetail(container, p){
  document.title = `${p.name} | OH Skincare`;
  const crumb = document.getElementById("crumbName");
  if (crumb) crumb.textContent = p.name;

  const desc = p.description || "Producto seleccionado para complementar tu rutina diaria.";
  const usage = p.usage || "Aplicar según indicaciones. Si tienes piel sensible, consulta antes de usar.";
  const size = p.size || "Contenido estándar";
  const benefits = p.benefits || ["Aporta a tu rutina", "Textura agradable", "Ideal para cuidado diario"];

  container.innerHTML = `
    <div class="pd card">
      <div class="pd__media">
        <img src="${p.img}" alt="${p.name}">
      </div>

      <div class="pd__info">
        <div class="pd__top">
          <h1 class="pd__title">${p.name}</h1>
          ${p.category ? `<span class="chip">${p.category}</span>` : ""}
        </div>

        <p class="pd__price">${formatPEN(p.price)}</p>
        <p class="muted">${desc}</p>

        <div class="pd__meta">
          <div class="pd__metaItem">
            <strong>Presentación</strong>
            <span class="muted">${size}</span>
          </div>
          <div class="pd__metaItem">
            <strong>Uso</strong>
            <span class="muted">${usage}</span>
          </div>
        </div>

        <div class="pd__benefits">
          <strong>Beneficios</strong>
          <ul>
            ${benefits.map(b => `<li>${b}</li>`).join("")}
          </ul>
        </div>

        <div class="pd__actions">
          <button class="btn btn--primary" id="addBtn">Agregar al carrito</button>
          <a class="btn btn--ghost" href="carrito.html">Ir al carrito</a>
        </div>

        <div class="pd__safe muted">
          Envíanos mensaje si necesitas ayuda para elegir tu rutina.
        </div>
      </div>
    </div>
  `;
}

function renderRelated(grid, items){
  grid.innerHTML = items.map(p => `
    <article class="card product">
      <a class="product__link" href="producto.html?id=${encodeURIComponent(p.id)}">
        <img src="${p.img}" alt="${p.name}" class="product__img">
      </a>
      <div class="product__body">
        <div class="product__top">
          <h3 class="product__title">${p.name}</h3>
          ${p.category ? `<span class="chip">${p.category}</span>` : ""}
        </div>
        <p class="product__price">${formatPEN(p.price)}</p>
        <a class="btn btn--ghost" href="producto.html?id=${encodeURIComponent(p.id)}">Ver detalle</a>
      </div>
    </article>
  `).join("");
}

function mountStickyBuy(p, onAdd){
  // Solo en móvil
  if (window.matchMedia("(min-width: 901px)").matches) return;

  document.body.classList.add("has-sticky-buy");

  const el = document.createElement("div");
  el.className = "sticky-buy";
  el.innerHTML = `
    <div class="sticky-buy__inner">
      <div class="sticky-buy__price">
        <span class="muted" style="font-size:12px;font-weight:900;">Precio</span>
        <strong>${formatPEN(p.price)}</strong>
      </div>
      <button class="btn btn--primary sticky-buy__btn" id="stickyAdd">Agregar</button>
    </div>
  `;
  document.body.appendChild(el);

  el.querySelector("#stickyAdd").addEventListener("click", () => {
    onAdd();
    const b = el.querySelector("#stickyAdd");
    b.textContent = "Agregado ✓";
    setTimeout(() => (b.textContent = "Agregar"), 900);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const id = getIdFromQuery();
  const detail = document.getElementById("productDetail");
  const relatedGrid = document.getElementById("relatedGrid");

  if (!detail) return;

  const all = await loadProducts();
  const p = all.find(x => x.id === id) || all[0];

  renderDetail(detail, p);

  const onAdd = () => {
  addToCart(p, 1);
  showCartToast(`${p.name} fue agregado al carrito.`);
};

  document.getElementById("addBtn")?.addEventListener("click", () => {
    onAdd();
    const btn = document.getElementById("addBtn");
    if (btn) {
      btn.textContent = "Agregado ✓";
      setTimeout(() => (btn.textContent = "Agregar al carrito"), 1000);
    }
  });

  mountStickyBuy(p, onAdd);

  if (relatedGrid) {
    const related = pickRelated(all, p, 3);
    renderRelated(relatedGrid, related);
  }
});
