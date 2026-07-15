/* =========================================================
   storage.js
   Thin wrapper around localStorage. All persistence for the
   app funnels through here so the rest of the code never
   talks to `localStorage` directly.
   ========================================================= */

const STORAGE_KEY = "shoplite_wishlists_v1";
const CART_STORAGE_KEY = "shoplite_cart_v1";

/**
 * Read the raw wishlists array from localStorage.
 * Returns an empty array if nothing is stored yet or the
 * stored data is corrupted.
 * @returns {Array}
 */
export function loadWishlists() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse wishlists from localStorage:", err);
    return [];
  }
}

/**
 * Persist the full wishlists array to localStorage.
 * @param {Array} wishlists
 */
export function saveWishlists(wishlists) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlists));
  } catch (err) {
    console.error("Failed to save wishlists to localStorage:", err);
  }
}

/**
 * Read the raw cart array from localStorage.
 * Returns an empty array (empty cart) if nothing is stored yet
 * or the stored data is corrupted.
 * @returns {Array<{productId: number, quantity: number}>}
 */
export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse cart from localStorage:", err);
    return [];
  }
}

/**
 * Persist the full cart array to localStorage.
 * @param {Array<{productId: number, quantity: number}>} cartItems
 */
export function saveCart(cartItems) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (err) {
    console.error("Failed to save cart to localStorage:", err);
  }
}
