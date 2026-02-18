const CART_KEY = "oh_cart_v1";

export function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.qty += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty });
  saveCart(cart);
}

export function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
}

export function setQty(id, qty) {
  const cart = getCart().map(i => i.id === id ? { ...i, qty } : i).filter(i => i.qty > 0);
  saveCart(cart);
}

export function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function cartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

export function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if (!badge) return;
  const count = cartCount();
  badge.hidden = count === 0;
  badge.textContent = String(count);
}

// Actualiza el badge siempre que cargue la página
document.addEventListener("DOMContentLoaded", updateCartBadge);

document.addEventListener("DOMContentLoaded", updateCartBadge);
document.addEventListener("partials:loaded", updateCartBadge);
