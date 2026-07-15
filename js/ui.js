/* =========================================================
   ui.js
   All DOM manipulation lives here. This module knows how to
   render products, wishlists, toasts, and empty states, but
   it has no idea *how* wishlists are stored or merged — it
   only calls back into app.js via the callback functions it
   is given. This keeps UI and business logic decoupled.
   ========================================================= */

// ----- Cached DOM references -----
const productGridEl = document.getElementById("productGrid");
const wishlistListEl = document.getElementById("wishlistList");
const sidebarEmptyStateEl = document.getElementById("sidebarEmptyState");
const mergeSelectA = document.getElementById("mergeSelectA");
const mergeSelectB = document.getElementById("mergeSelectB");
const mergeEmptyStateEl = document.getElementById("mergeEmptyState");
const mergeBtn = document.getElementById("mergeBtn");
const toastContainer = document.getElementById("toastContainer");
const wishlistSidebar = document.getElementById("wishlistSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartBadge = document.getElementById("cartBadge");
const cartItemListEl = document.getElementById("cartItemList");
const cartEmptyStateEl = document.getElementById("cartEmptyState");
const cartFooterEl = document.getElementById("cartFooter");
const cartTotalEl = document.getElementById("cartTotal");

/**
 * Format a price as USD currency.
 * @param {number} price
 * @returns {string}
 */
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

/**
 * Escape a string for safe insertion into HTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------------------------------------------------
   Toast notifications
--------------------------------------------------------- */

/**
 * Show a temporary toast notification.
 * @param {string} message
 * @param {"success"|"error"|"info"} [type="info"]
 */
export function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Remove from DOM after the CSS animation finishes (2.5s delay + 0.25s fade)
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* ---------------------------------------------------------
   Product grid
--------------------------------------------------------- */

/**
 * Render the product grid.
 * @param {Array} products - list of Product objects
 * @param {Array} wishlists - list of Wishlist objects (for the per-card select)
 * @param {(productId: number, wishlistId: string) => void} onAddToWishlist
 * @param {(productId: number) => void} onAddToCart
 */
export function renderProductGrid(products, wishlists, onAddToWishlist, onAddToCart) {
  productGridEl.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const wishlistOptions = wishlists
      .map((w) => `<option value="${w.id}">${escapeHtml(w.name)}</option>`)
      .join("");

    card.innerHTML = `
      <img class="product-image" src="${product.image}" alt="${escapeHtml(product.title)}" loading="lazy" />
      <div class="product-info">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <h3 class="product-title">${escapeHtml(product.title)}</h3>
        <span class="product-price">${formatPrice(product.price)}</span>
      </div>
      <div class="product-actions">
        <button class="btn btn-primary add-to-cart-btn">🛒 Add to Cart</button>
        ${
          wishlists.length > 0
            ? `<select class="wishlist-select" aria-label="Choose wishlist">${wishlistOptions}</select>
               <button class="btn btn-secondary add-to-wishlist-btn">♡ Add to Wishlist</button>`
            : `<button class="btn btn-secondary add-to-wishlist-btn" disabled>Create a wishlist to save this</button>`
        }
      </div>
    `;

    const cartBtn = card.querySelector(".add-to-cart-btn");
    cartBtn.addEventListener("click", () => onAddToCart(product.id));

    const addBtn = card.querySelector(".add-to-wishlist-btn");
    const select = card.querySelector(".wishlist-select");

    if (addBtn && select) {
      addBtn.addEventListener("click", () => {
        onAddToWishlist(product.id, select.value);
      });
    }

    productGridEl.appendChild(card);
  });
}

/* ---------------------------------------------------------
   Wishlist sidebar
--------------------------------------------------------- */

/**
 * Render the wishlist sidebar list.
 * @param {Array} wishlists
 * @param {(id: number) => Object|undefined} getProductById
 * @param {{
 *   onRemoveProduct: (wishlistId: string, productId: number) => void,
 *   onDeleteWishlist: (wishlistId: string) => void
 * }} callbacks
 */
export function renderWishlistSidebar(wishlists, getProductById, callbacks) {
  wishlistListEl.innerHTML = "";

  if (wishlists.length === 0) {
    sidebarEmptyStateEl.classList.remove("hidden");
    return;
  }
  sidebarEmptyStateEl.classList.add("hidden");

  wishlists.forEach((wishlist) => {
    const card = document.createElement("div");
    card.className = "wishlist-card";

    const productItems = wishlist.products
      .map((productId) => {
        const product = getProductById(productId);
        const name = product ? product.title : "Unknown product";
        return `
          <li class="wishlist-product-item" data-product-id="${productId}">
            <span class="name">${escapeHtml(name)}</span>
            <button class="btn btn-icon remove-product-btn" title="Remove" aria-label="Remove product">✕</button>
          </li>
        `;
      })
      .join("");

    card.innerHTML = `
      <div class="wishlist-card-header">
        <h3>${escapeHtml(wishlist.name)}</h3>
        <span class="wishlist-count">${wishlist.products.length} item${wishlist.products.length === 1 ? "" : "s"}</span>
      </div>
      ${
        wishlist.products.length > 0
          ? `<ul class="wishlist-products">${productItems}</ul>`
          : `<p class="muted">No products yet.</p>`
      }
      <div class="wishlist-card-footer">
        <button class="btn btn-danger btn-small delete-wishlist-btn">Delete Wishlist</button>
      </div>
    `;

    card
      .querySelector(".delete-wishlist-btn")
      .addEventListener("click", () => callbacks.onDeleteWishlist(wishlist.id));

    card.querySelectorAll(".remove-product-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const li = e.target.closest(".wishlist-product-item");
        const productId = Number(li.dataset.productId);
        callbacks.onRemoveProduct(wishlist.id, productId);
      });
    });

    wishlistListEl.appendChild(card);
  });
}

/* ---------------------------------------------------------
   Merge section
--------------------------------------------------------- */

/**
 * Populate the two merge <select> dropdowns with the current
 * wishlists, and toggle the merge empty-state / button.
 * @param {Array} wishlists
 */
export function renderMergeSelectors(wishlists) {
  const buildOptions = () =>
    wishlists
      .map((w) => `<option value="${w.id}">${escapeHtml(w.name)} (${w.products.length})</option>`)
      .join("");

  const hasEnough = wishlists.length >= 2;

  mergeSelectA.innerHTML = buildOptions();
  mergeSelectB.innerHTML = buildOptions();

  // Default select B to the second wishlist so it isn't
  // pre-selected identical to A when possible.
  if (wishlists.length >= 2) {
    mergeSelectB.selectedIndex = 1;
  }

  mergeEmptyStateEl.classList.toggle("hidden", hasEnough);
  mergeSelectA.parentElement.parentElement.classList.toggle("hidden", !hasEnough);
  mergeBtn.disabled = !hasEnough;
}

/**
 * Read the two currently selected wishlist ids from the merge dropdowns.
 * @returns {{idA: string, idB: string}}
 */
export function getMergeSelection() {
  return {
    idA: mergeSelectA.value,
    idB: mergeSelectB.value,
  };
}

/* ---------------------------------------------------------
   Sidebar open/close (mobile-friendly)
--------------------------------------------------------- */

export function openSidebar() {
  wishlistSidebar.classList.add("open");
  sidebarOverlay.classList.remove("hidden");
}

export function closeSidebar() {
  wishlistSidebar.classList.remove("open");
  sidebarOverlay.classList.add("hidden");
}

/* ---------------------------------------------------------
   Cart drawer (slides in from the right on any screen size)
--------------------------------------------------------- */

export function openCart() {
  cartDrawer.classList.add("open");
  cartOverlay.classList.remove("hidden");
}

export function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.add("hidden");
}

/**
 * Update the small numeric badge on the header's Cart button.
 * @param {number} count
 */
export function renderCartBadge(count) {
  cartBadge.textContent = String(count);
  cartBadge.classList.toggle("hidden", count === 0);
}

/**
 * Render the cart drawer contents: either the empty state, or
 * the list of line items plus a running total.
 * @param {Array<{productId: number, quantity: number}>} cartItems
 * @param {(id: number) => Object|undefined} getProductById
 * @param {{
 *   onIncrease: (productId: number) => void,
 *   onDecrease: (productId: number) => void,
 *   onRemove: (productId: number) => void
 * }} callbacks
 * @param {number} total
 */
export function renderCartDrawer(cartItems, getProductById, callbacks, total) {
  cartItemListEl.innerHTML = "";

  if (cartItems.length === 0) {
    cartEmptyStateEl.classList.remove("hidden");
    cartFooterEl.classList.add("hidden");
    return;
  }

  cartEmptyStateEl.classList.add("hidden");
  cartFooterEl.classList.remove("hidden");

  cartItems.forEach((item) => {
    const product = getProductById(item.productId);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img class="cart-item-image" src="${product.image}" alt="${escapeHtml(product.title)}" />
      <div class="cart-item-info">
        <span class="cart-item-title">${escapeHtml(product.title)}</span>
        <span class="cart-item-price">${formatPrice(product.price)}</span>
        <div class="cart-item-qty">
          <button class="btn btn-icon qty-decrease-btn" aria-label="Decrease quantity">−</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="btn btn-icon qty-increase-btn" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="btn btn-icon remove-cart-item-btn" aria-label="Remove from cart">✕</button>
    `;

    row
      .querySelector(".qty-decrease-btn")
      .addEventListener("click", () => callbacks.onDecrease(item.productId));
    row
      .querySelector(".qty-increase-btn")
      .addEventListener("click", () => callbacks.onIncrease(item.productId));
    row
      .querySelector(".remove-cart-item-btn")
      .addEventListener("click", () => callbacks.onRemove(item.productId));

    cartItemListEl.appendChild(row);
  });

  cartTotalEl.textContent = formatPrice(total);
}

/**
 * Simple browser-native prompt wrapper, kept here so app.js
 * never touches `window.prompt` directly (easier to swap out
 * for a custom modal later without touching business logic).
 * @param {string} message
 * @param {string} [defaultValue=""]
 * @returns {string|null}
 */
export function promptForText(message, defaultValue = "") {
  return window.prompt(message, defaultValue);
}

/**
 * Simple browser-native confirm wrapper.
 * @param {string} message
 * @returns {boolean}
 */
export function confirmAction(message) {
  return window.confirm(message);
}
