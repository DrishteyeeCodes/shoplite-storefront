/* =========================================================
   wishlist.js
   Business logic for wishlist CRUD and merging.
   ========================================================= */

import { loadWishlists, saveWishlists } from "./storage.js";

let wishlists = loadWishlists();

function persist() {
  saveWishlists(wishlists);
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `wishlist_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeName(name) {
  return String(name ?? "").trim();
}

function getWishlistOrThrow(wishlistId) {
  const wishlist = wishlists.find((item) => item.id === wishlistId);

  if (!wishlist) {
    throw new Error("Wishlist not found.");
  }

  return wishlist;
}

export function getWishlists() {
  return wishlists.map((wishlist) => ({
    ...wishlist,
    products: [...wishlist.products],
  }));
}

export function createWishlist(name) {
  const trimmedName = normalizeName(name);

  if (!trimmedName) {
    throw new Error("Wishlist name is required.");
  }

  const exists = wishlists.some(
    (wishlist) => wishlist.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (exists) {
    throw new Error("A wishlist with that name already exists.");
  }

  const wishlist = {
    id: createId(),
    name: trimmedName,
    products: [],
  };

  wishlists.push(wishlist);
  persist();
  return { ...wishlist, products: [] };
}

export function deleteWishlist(wishlistId) {
  const beforeCount = wishlists.length;
  wishlists = wishlists.filter((wishlist) => wishlist.id !== wishlistId);

  if (wishlists.length === beforeCount) {
    throw new Error("Wishlist not found.");
  }

  persist();
}

export function addProductToWishlist(wishlistId, productId) {
  const wishlist = getWishlistOrThrow(wishlistId);

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
    persist();
  }
}

export function removeProductFromWishlist(wishlistId, productId) {
  const wishlist = getWishlistOrThrow(wishlistId);
  const nextProducts = wishlist.products.filter((id) => id !== productId);

  if (nextProducts.length === wishlist.products.length) {
    throw new Error("Product not found in that wishlist.");
  }

  wishlist.products = nextProducts;
  persist();
}

export function mergeWishlists(wishlistIdA, wishlistIdB, mergedName) {
  if (wishlistIdA === wishlistIdB) {
    throw new Error("Choose two different wishlists.");
  }

  const wishlistA = getWishlistOrThrow(wishlistIdA);
  const wishlistB = getWishlistOrThrow(wishlistIdB);
  const name = normalizeName(mergedName) || "Merged Wishlist";
  const products = [...new Set([...wishlistA.products, ...wishlistB.products])];

  const mergedWishlist = {
    id: createId(),
    name,
    products,
  };

  wishlists.push(mergedWishlist);
  persist();

  return {
    ...mergedWishlist,
    products: [...mergedWishlist.products],
  };
}