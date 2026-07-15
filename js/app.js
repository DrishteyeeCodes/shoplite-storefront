/* =========================================================
   app.js
   Application entry point. Wires together data.js, wishlist.js
   (business logic) and ui.js (rendering), and owns the event
   listeners for user interactions. Nothing here talks to
   localStorage directly, and nothing here builds HTML directly
   — both are delegated to their respective modules.
   ========================================================= */

import { PRODUCTS, getProductById } from "./data.js";
import {
  getWishlists,
  createWishlist,
  deleteWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  mergeWishlists,
} from "./wishlist.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  getCartCount,
  getCartTotal,
} from "./cart.js";
import {
  renderProductGrid,
  renderWishlistSidebar,
  renderMergeSelectors,
  getMergeSelection,
  showToast,
  openSidebar,
  closeSidebar,
  openCart,
  closeCart,
  renderCartBadge,
  renderCartDrawer,
  promptForText,
  confirmAction,
} from "./ui.js";

/* ---------------------------------------------------------
   Central re-render: called after any state-changing action
   so every part of the UI stays in sync with wishlist.js.
--------------------------------------------------------- */
function refreshUI() {
  const wishlists = getWishlists();
  const cartItems = getCart();

  renderProductGrid(PRODUCTS, wishlists, handleAddToWishlist, handleAddToCart);
  renderWishlistSidebar(wishlists, getProductById, {
    onRemoveProduct: handleRemoveProduct,
    onDeleteWishlist: handleDeleteWishlist,
  });
  renderMergeSelectors(wishlists);

  renderCartBadge(getCartCount());
  renderCartDrawer(
    cartItems,
    getProductById,
    {
      onIncrease: handleCartIncrease,
      onDecrease: handleCartDecrease,
      onRemove: handleCartRemove,
    },
    getCartTotal()
  );
}

/* ---------------------------------------------------------
   Event handlers (business-logic side effects + toasts)
--------------------------------------------------------- */

/**
 * Handle "Add to Wishlist" click on a product card.
 * @param {number} productId
 * @param {string} wishlistId
 */
function handleAddToWishlist(productId, wishlistId) {
  if (!wishlistId) {
    showToast("Create a wishlist first.", "error");
    return;
  }

  try {
    addProductToWishlist(wishlistId, productId);
    const wishlist = getWishlists().find((w) => w.id === wishlistId);
    showToast(`Added to "${wishlist?.name ?? "wishlist"}"`, "success");
    refreshUI();
  } catch (err) {
    showToast(err.message, "error");
  }
}

/**
 * Handle removing a product from a specific wishlist.
 * @param {string} wishlistId
 * @param {number} productId
 */
function handleRemoveProduct(wishlistId, productId) {
  try {
    removeProductFromWishlist(wishlistId, productId);
    showToast("Product removed.", "info");
    refreshUI();
  } catch (err) {
    showToast(err.message, "error");
  }
}

/**
 * Handle deleting a whole wishlist (with confirmation).
 * @param {string} wishlistId
 */
function handleDeleteWishlist(wishlistId) {
  const wishlist = getWishlists().find((w) => w.id === wishlistId);
  const name = wishlist ? wishlist.name : "this wishlist";

  if (!confirmAction(`Delete "${name}"? This cannot be undone.`)) {
    return;
  }

  deleteWishlist(wishlistId);
  showToast(`Deleted "${name}".`, "info");
  refreshUI();
}

/**
 * Handle "Add to Cart" click on a product card.
 * @param {number} productId
 */
function handleAddToCart(productId) {
  const product = getProductById(productId);
  addToCart(productId, 1);
  showToast(`"${product?.title ?? "Item"}" added to cart.`, "success");
  refreshUI();
}

/**
 * Increase a cart line item's quantity by 1.
 * @param {number} productId
 */
function handleCartIncrease(productId) {
  const item = getCart().find((i) => i.productId === productId);
  updateQuantity(productId, (item?.quantity ?? 0) + 1);
  refreshUI();
}

/**
 * Decrease a cart line item's quantity by 1 (removes it at 0).
 * @param {number} productId
 */
function handleCartDecrease(productId) {
  const item = getCart().find((i) => i.productId === productId);
  updateQuantity(productId, (item?.quantity ?? 1) - 1);
  refreshUI();
}

/**
 * Remove a line item from the cart entirely.
 * @param {number} productId
 */
function handleCartRemove(productId) {
  removeFromCart(productId);
  showToast("Removed from cart.", "info");
  refreshUI();
}

/** Handle the "Clear Cart" button inside the cart drawer. */
function handleClearCart() {
  if (getCart().length === 0) return;

  if (!confirmAction("Remove all items from your cart?")) return;

  clearCart();
  showToast("Cart cleared.", "info");
  refreshUI();
}

/**
 * Handle the "Checkout" button. This MVP has no real payment
 * flow, so it simply simulates a successful order and empties
 * the cart.
 */
function handleCheckout() {
  if (getCart().length === 0) {
    showToast("Your cart is empty.", "error");
    return;
  }

  clearCart();
  closeCart();
  showToast("Order placed! Thanks for shopping with ShopLite.", "success");
  refreshUI();
}

/**
 * Handle the "Create wishlist" form submission.
 * @param {SubmitEvent} e
 */
function handleCreateWishlistSubmit(e) {
  e.preventDefault();
  const input = document.getElementById("newWishlistName");
  const name = input.value.trim();

  if (!name) {
    showToast("Please enter a wishlist name.", "error");
    return;
  }

  try {
    createWishlist(name);
    input.value = "";
    showToast(`Wishlist "${name}" created.`, "success");
    refreshUI();
  } catch (err) {
    showToast(err.message, "error");
  }
}

/**
 * Handle the "Merge Wishlists" button click.
 * Prompts the user for a name for the merged wishlist, then
 * delegates the actual merge logic to wishlist.js.
 */
function handleMergeClick() {
  const { idA, idB } = getMergeSelection();

  if (!idA || !idB) {
    showToast("Select two wishlists to merge.", "error");
    return;
  }

  if (idA === idB) {
    showToast("Please choose two different wishlists.", "error");
    return;
  }

  const mergedName = promptForText("Name for the merged wishlist:", "Merged Wishlist");

  // User cancelled the prompt.
  if (mergedName === null) return;

  try {
    const merged = mergeWishlists(idA, idB, mergedName);
    showToast(`Created merged wishlist "${merged.name}".`, "success");
    refreshUI();
  } catch (err) {
    showToast(err.message, "error");
  }
}

/* ---------------------------------------------------------
   Sidebar toggle wiring (mobile-friendly show/hide)
--------------------------------------------------------- */
function setupSidebarToggle() {
  const toggleBtn = document.getElementById("toggleSidebarBtn");
  const closeBtn = document.getElementById("closeSidebarBtn");
  const overlay = document.getElementById("sidebarOverlay");

  toggleBtn.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);
}

/**
 * Wire up opening/closing the cart drawer, plus the
 * empty-state "Browse Products" shortcut which just closes
 * the drawer so the user lands back on the product grid.
 */
function setupCartToggle() {
  const toggleBtn = document.getElementById("toggleCartBtn");
  const closeBtn = document.getElementById("closeCartBtn");
  const overlay = document.getElementById("cartOverlay");
  const browseBtn = document.getElementById("cartEmptyBrowseBtn");
  const clearBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");

  toggleBtn.addEventListener("click", openCart);
  closeBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  browseBtn.addEventListener("click", closeCart);
  clearBtn.addEventListener("click", handleClearCart);
  checkoutBtn.addEventListener("click", handleCheckout);
}

/* ---------------------------------------------------------
   Bootstrap the app once the DOM is ready.
--------------------------------------------------------- */
function init() {
  document
    .getElementById("createWishlistForm")
    .addEventListener("submit", handleCreateWishlistSubmit);

  document.getElementById("mergeBtn").addEventListener("click", handleMergeClick);

  setupSidebarToggle();
  setupCartToggle();
  refreshUI();
}

document.addEventListener("DOMContentLoaded", init);
