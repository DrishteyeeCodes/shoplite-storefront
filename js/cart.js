/* =========================================================
   cart.js
   Business logic for the shopping cart: add, remove, update
   quantity, clear, and derived totals. No DOM code lives
   here — mirrors the separation used in wishlist.js.
   ========================================================= */

import { loadCart, saveCart } from "./storage.js";
import { getProductById } from "./data.js";

/**
 * @typedef {Object} CartItem
 * @property {number} productId
 * @property {number} quantity
 */

/** In-memory cache of the cart, kept in sync with localStorage. */
let cart = loadCart();

/** Persist the in-memory cart to localStorage. */
function persist() {
  saveCart(cart);
}

/**
 * Get the current cart (a shallow copy, so callers can't
 * mutate internal state directly).
 * @returns {CartItem[]}
 */
export function getCart() {
  return cart.map((item) => ({ ...item }));
}

/**
 * Add a product to the cart. If it's already in the cart,
 * its quantity is incremented instead of creating a duplicate row.
 * @param {number} productId
 * @param {number} [quantity=1]
 */
export function addToCart(productId, quantity = 1) {
  const existing = cart.find((item) => item.productId === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  persist();
}

/**
 * Remove a product from the cart entirely.
 * @param {number} productId
 */
export function removeFromCart(productId) {
  cart = cart.filter((item) => item.productId !== productId);
  persist();
}

/**
 * Set the exact quantity for a product already in the cart.
 * Removes the item if the new quantity is 0 or less.
 * @param {number} productId
 * @param {number} quantity
 */
export function updateQuantity(productId, quantity) {
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity = quantity;
    persist();
  }
}

/** Empty the cart completely. */
export function clearCart() {
  cart = [];
  persist();
}

/**
 * Total number of individual items in the cart (sum of quantities),
 * used for the header cart badge.
 * @returns {number}
 */
export function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Total price of everything currently in the cart.
 * @returns {number}
 */
export function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}
