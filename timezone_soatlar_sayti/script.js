const imagePool = [
  "photo-1524805444758-089113d48a6d",
  "photo-1508685096489-7aacd43bd3b1",
  "photo-1523170335258-f5ed11844a49",
  "photo-1524592094714-0f0654e20314",
  "photo-1539874754764-5a96559165b0",
  "photo-1522312346375-d1a52e2b99b3",
  "photo-1547996160-81dfa63595aa",
  "photo-1523275335684-37898b6baf30",
  "photo-1434056886845-dac89ffe9b56",
  "photo-1526045431048-f857369 ವಿಷಯ",
];
// Use a curated set of real watch photographs; the list repeats with different crops for the 1000 demo items.
const photos = [
  "photo-1524805444758-089113d48a6d",
  "photo-1508685096489-7aacd43bd3b1",
  "photo-1523170335258-f5ed11844a49",
  "photo-1524592094714-0f0654e20314",
  "photo-1539874754764-5a96559165b0",
  "photo-1522312346375-d1a52e2b99b3",
  "photo-1547996160-81dfa63595aa",
  "photo-1523275335684-37898b6baf30",
  "photo-1434056886845-dac89ffe9b56",
  "photo-1526045431048-f857369",
];
const brands = [
  "AUREL",
  "NOVA",
  "CHRONO",
  "VANTAGE",
  "ELITE",
  "ORION",
  "MOMENT",
  "ATLAS",
  "LUMEN",
  "TEMPO",
];
const styles = [
  "Classic",
  "Heritage",
  "Urban",
  "Prestige",
  "Minimal",
  "Sport",
  "Royal",
  "Elegance",
  "Aero",
  "Prime",
];
const categories = ["Erkaklar", "Ayollar", "Sport", "Klassik"];
const products = Array.from({ length: 1000 }, (_, i) => {
  const brand = brands[i % brands.length],
    style = styles[Math.floor(i / 10) % styles.length];
  const category = categories[i % 4],
    price = 350000 + ((i * 7919) % 4650000);
  return {
    id: i + 1,
    name: `${brand} ${style} ${String(i + 1).padStart(3, "0")}`,
    category,
    price,
    oldPrice: i % 4 === 0 ? Math.round(price * 1.18) : null,
    photo: photos[i % photos.length],
    badge: i % 9 === 0 ? "YANGI" : i % 7 === 0 ? "TOP" : "",
  };
});
const money = (n) => new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
let activeCategory = "Barchasi",
  visible = 12,
  cart = JSON.parse(localStorage.getItem("timezone-cart") || "[]");
const grid = document.getElementById("productGrid"),
  count = document.getElementById("resultCount");
function filtered() {
  let list = products.filter(
    (p) =>
      (activeCategory === "Barchasi" || p.category === activeCategory) &&
      p.name
        .toLowerCase()
        .includes(document.getElementById("searchInput").value.toLowerCase()),
  );
  const sort = document.getElementById("sortSelect").value;
  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
  return list;
}
function render() {
  const list = filtered();
  count.textContent = list.length.toLocaleString("uz-UZ") + " ta mahsulot";
  const shown = list.slice(0, visible);
  grid.innerHTML = shown
    .map(
      (p) => `<article class="product-card">
  <div class="product-image"><img loading="lazy" src="https://images.unsplash.com/${p.photo}?auto=format&fit=crop&w=600&q=75" alt="${p.name}">${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}<button class="wish" data-wish="${p.id}" aria-label="Sevimlilarga qo'shish">♡</button></div>
  <div class="product-info"><div class="product-category">${p.category}</div><h3>${p.name}</h3><div class="product-meta"><div><span class="price">${money(p.price)}</span>${p.oldPrice ? `<span class="old-price">${money(p.oldPrice)}</span>` : ""}</div><span class="rating">★ 4.${(p.id % 5) + 5}</span></div><button class="add-btn" data-add="${p.id}">Savatchaga qo'shish +</button></div>
 </article>`,
    )
    .join("");
  document.getElementById("shownCount").textContent = shown.length;
  document.getElementById("loadMore").style.display =
    visible >= list.length ? "none" : "block";
}
function saveCart() {
  localStorage.setItem("timezone-cart", JSON.stringify(cart));
  renderCart();
}
function renderCart() {
  const totalQty = cart.reduce((s, x) => s + x.qty, 0),
    total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  document.getElementById("cartCount").textContent = totalQty;
  document.getElementById("drawerCount").textContent = `(${totalQty})`;
  document.getElementById("cartTotal").textContent = money(total);
  const area = document.getElementById("cartItems");
  area.innerHTML = cart.length
    ? cart
        .map(
          (x) =>
            `<div class="cart-row"><img src="https://images.unsplash.com/${x.photo}?auto=format&fit=crop&w=150&q=70" alt=""><div><h4>${x.name}</h4><p>${money(x.price)}</p><div class="qty"><button data-qty="${x.id}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${x.id}" data-delta="1">+</button></div></div><button class="remove" data-remove="${x.id}">✕</button></div>`,
        )
        .join("")
    : `<div class="empty-cart">Savatchangiz hozircha bo'sh.<br><span>Yoqtirgan soatingizni tanlang.</span></div>`;
}
function toast() {
  const t = document.getElementById("toast");
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 1800);
}
grid.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    const p = products[+add.dataset.add - 1],
      found = cart.find((x) => x.id === p.id);
    found ? found.qty++ : cart.push({ ...p, qty: 1 });
    saveCart();
    toast();
  }
  const wish = e.target.closest("[data-wish]");
  if (wish) {
    wish.classList.toggle("liked");
    wish.textContent = wish.classList.contains("liked") ? "♥" : "♡";
  }
});
document.getElementById("cartItems").addEventListener("click", (e) => {
  const q = e.target.closest("[data-qty]");
  const r = e.target.closest("[data-remove]");
  if (q) {
    const item = cart.find((x) => x.id === +q.dataset.qty);
    item.qty += +q.dataset.delta;
    if (item.qty <= 0) cart = cart.filter((x) => x.id !== item.id);
    saveCart();
  }
  if (r) {
    cart = cart.filter((x) => x.id !== +r.dataset.remove);
    saveCart();
  }
});
document.getElementById("categories").addEventListener("click", (e) => {
  const b = e.target.closest("[data-category]");
  if (!b) return;
  activeCategory = b.dataset.category;
  document
    .querySelectorAll(".cat")
    .forEach((x) => x.classList.toggle("active", x === b));
  visible = 12;
  render();
});
document.getElementById("searchInput").addEventListener("input", () => {
  visible = 12;
  render();
});
document.getElementById("sortSelect").addEventListener("change", render);
document.getElementById("loadMore").addEventListener("click", () => {
  visible += 12;
  render();
});
const drawer = document.getElementById("cartDrawer"),
  overlay = document.getElementById("overlay");
function openCart() {
  drawer.classList.add("open");
  overlay.classList.add("show");
}
function closeCart() {
  drawer.classList.remove("open");
  overlay.classList.remove("show");
}
document.getElementById("cartToggle").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) {
    toast();
    return;
  }
  alert(
    "Rahmat! Bu demo do'kon. Buyurtma rasmiylashtirish backend va to'lov tizimi ulangandan so'ng ishlaydi.",
  );
});
document
  .getElementById("menuToggle")
  .addEventListener("click", () =>
    document.getElementById("nav").classList.toggle("open"),
  );
document
  .querySelectorAll(".nav a")
  .forEach((a) =>
    a.addEventListener("click", () =>
      document.getElementById("nav").classList.remove("open"),
    ),
  );
document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchInput").focus();
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
});
render();
renderCart();
