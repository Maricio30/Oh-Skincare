import { showCartToast } from "./ui.js";

async function loadProducts() {
  const res = await fetch("data/products.json");
  if (!res.ok) throw new Error("No se pudo cargar data/products.json");
  return res.json();
}

const formatPEN = (n) => "S/ " + Number(n).toFixed(2);

function uniqueCategories(products){
  const set = new Set(products.map(p => p.category).filter(Boolean));
  return ["Todas", ...Array.from(set).sort()];
}

function sortProducts(list, sortKey){
  const arr = [...list];
  switch (sortKey) {
    case "price-asc": return arr.sort((a,b) => Number(a.price) - Number(b.price));
    case "price-desc": return arr.sort((a,b) => Number(b.price) - Number(a.price));
    case "name-asc": return arr.sort((a,b) => a.name.localeCompare(b.name, "es"));
    case "name-desc": return arr.sort((a,b) => b.name.localeCompare(a.name, "es"));
    case "reco":
    default:
      // recomendados: respeta orden del JSON
      return arr;
  }
}

function applyFilters(all, q, cat, maxPrice){
  const query = q.trim().toLowerCase();
  return all.filter(p => {
    const okQ = !query || p.name.toLowerCase().includes(query);
    const okCat = (cat === "Todas" || cat === "" || !cat) ? true : (p.category === cat);
    const okPrice = Number(p.price) <= Number(maxPrice);
    return okQ && okCat && okPrice;
  });
}

function renderProducts(grid, products){
  grid.innerHTML = products.map(p => `
    <article class="card product">
      <a class="product__link" href="producto.html?id=${encodeURIComponent(p.id)}" aria-label="Ver ${p.name}">
        <img src="${p.img}" alt="${p.name}" class="product__img">
      </a>

      <div class="product__body">
        <div class="product__top">
          <h3 class="product__title">${p.name}</h3>
          ${p.category ? `<span class="chip">${p.category}</span>` : ""}
        </div>

        <p class="product__price">${formatPEN(p.price)}</p>

        <div class="product__actions">
          <a class="btn btn--ghost" href="producto.html?id=${encodeURIComponent(p.id)}">Ver detalle</a>
          <button class="btn btn--primary" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const inputQ = document.getElementById("q");
  const selectCat = document.getElementById("cat");
  const rangePrice = document.getElementById("price");
  const priceLabel = document.getElementById("priceLabel");
  const clearBtn = document.getElementById("clearFilters");
  const sortSel = document.getElementById("sort");

  const all = await loadProducts();

  // categorías
  if (selectCat) {
    selectCat.innerHTML = uniqueCategories(all).map(c => `<option>${c}</option>`).join("");
  }

  // precio máximo según data
  const maxP = Math.max(...all.map(p => Number(p.price)));
  if (rangePrice) {
    rangePrice.max = String(Math.ceil(maxP / 10) * 10);
    rangePrice.value = rangePrice.max;
  }
  const updatePriceLabel = () => {
    if (priceLabel && rangePrice) priceLabel.textContent = formatPEN(rangePrice.value);
  };
  updatePriceLabel();

  function refresh(){
    updatePriceLabel();
    const q = inputQ ? inputQ.value : "";
    const cat = selectCat ? selectCat.value : "Todas";
    const maxPrice = rangePrice ? rangePrice.value : maxP;
    const sortKey = sortSel ? sortSel.value : "reco";

    const filtered = applyFilters(all, q, cat, maxPrice);
    const sorted = sortProducts(filtered, sortKey);
    renderProducts(grid, sorted);
  }

  inputQ?.addEventListener("input", refresh);
  selectCat?.addEventListener("change", refresh);
  rangePrice?.addEventListener("input", refresh);
  sortSel?.addEventListener("change", refresh);

  clearBtn?.addEventListener("click", () => {
    if (inputQ) inputQ.value = "";
    if (selectCat) selectCat.value = "Todas";
    if (rangePrice) rangePrice.value = rangePrice.max;
    if (sortSel) sortSel.value = "reco";
    refresh();
  });

  // add to cart
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;
    const id = btn.getAttribute("data-add");
    const p = all.find(x => x.id === id);
    if (!p) return;


    addToCart(p, 1);
    showCartToast(`${p.name} fue agregado al carrito.`);
    btn.textContent = "Agregado ✓";
    setTimeout(() => (btn.textContent = "Agregar"), 900);
  });

  refresh();
});
