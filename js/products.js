import { addToCart } from "./cart.js";

async function loadProducts() {
  const res = await fetch("data/products.json");
  if (!res.ok) throw new Error("No se pudo cargar data/products.json");
  return res.json();
}

const formatPEN = (n) => "S/ " + Number(n).toFixed(2);

function uniqueCategories(products){
  const set = new Set(products.map(p => p.category));
  return ["Todas", ...Array.from(set).sort()];
}

function renderProducts(grid, products){
  grid.innerHTML = products.map(p => `
    <article class="card product">
      <img src="${p.img}" alt="${p.name}" class="product__img">
      <div class="product__body">
        <div class="product__top">
          <h3 class="product__title">${p.name}</h3>
          <span class="chip">${p.category}</span>
        </div>
        <p class="product__price">${formatPEN(p.price)}</p>
        <button class="btn btn--primary" data-add="${p.id}">Agregar al carrito</button>
      </div>
    </article>
  `).join("");
}

function applyFilters(all, q, cat, maxPrice){
  const query = q.trim().toLowerCase();
  return all.filter(p => {
    const okQ = !query || p.name.toLowerCase().includes(query);
    const okCat = (cat === "Todas" || cat === "" || p.category === cat);
    const okPrice = Number(p.price) <= Number(maxPrice);
    return okQ && okCat && okPrice;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  const inputQ = document.getElementById("q");
  const selectCat = document.getElementById("cat");
  const rangePrice = document.getElementById("price");
  const priceLabel = document.getElementById("priceLabel");
  const clearBtn = document.getElementById("clearFilters");

  const all = await loadProducts();

  // set up category select
  selectCat.innerHTML = uniqueCategories(all).map(c => `<option>${c}</option>`).join("");

  // set up price range based on data
  const maxP = Math.max(...all.map(p => Number(p.price)));
  rangePrice.max = String(Math.ceil(maxP / 10) * 10);
  rangePrice.value = rangePrice.max;
  priceLabel.textContent = formatPEN(rangePrice.value);

  function refresh(){
    priceLabel.textContent = formatPEN(rangePrice.value);
    const filtered = applyFilters(all, inputQ.value, selectCat.value, rangePrice.value);
    renderProducts(grid, filtered);
  }

  inputQ.addEventListener("input", refresh);
  selectCat.addEventListener("change", refresh);
  rangePrice.addEventListener("input", refresh);

  clearBtn?.addEventListener("click", () => {
    inputQ.value = "";
    selectCat.value = "Todas";
    rangePrice.value = rangePrice.max;
    refresh();
  });

  // add to cart
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add]");
    if (!btn) return;

    const id = btn.getAttribute("data-add");
    const p = all.find(x => x.id === id);
    addToCart(p, 1);

    btn.textContent = "Agregado ✓";
    setTimeout(() => (btn.textContent = "Agregar al carrito"), 900);
  });

  refresh();
});
