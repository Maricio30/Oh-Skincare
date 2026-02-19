export function showCartToast(message = "Producto agregado al carrito.") {
  const toast = document.getElementById("cartToast");
  const closeBtn = document.getElementById("cartToastClose");
  const continueBtn = document.getElementById("cartToastContinue");
  const text = document.getElementById("cartToastText");

  if (!toast || !closeBtn || !continueBtn || !text) return;

  text.textContent = message;
  toast.hidden = false;
  document.body.classList.add("no-scroll");

  const close = () => {
    toast.hidden = true;
    document.body.classList.remove("no-scroll");
    cleanup();
  };

  const onBgClick = (e) => {
    if (e.target === toast) close();
  };

  const onEsc = (e) => {
    if (e.key === "Escape") close();
  };

  function cleanup(){
    toast.removeEventListener("click", onBgClick);
    document.removeEventListener("keydown", onEsc);
    closeBtn.removeEventListener("click", close);
    continueBtn.removeEventListener("click", close);
  }

  toast.addEventListener("click", onBgClick);
  document.addEventListener("keydown", onEsc);
  closeBtn.addEventListener("click", close);
  continueBtn.addEventListener("click", close);
}
