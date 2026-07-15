/* =========================================================
   data.js
   Static product catalog for the storefront.
   ========================================================= */

export const PRODUCTS = [
  {
    id: 1,
    title: "Canvas Tote Bag",
    category: "Accessories",
    price: 24.99,
    image: "https://placehold.co/600x400?text=Canvas+Tote+Bag",
  },
  {
    id: 2,
    title: "Ceramic Coffee Mug",
    category: "Home",
    price: 16.5,
    image: "https://placehold.co/600x400?text=Ceramic+Coffee+Mug",
  },
  {
    id: 3,
    title: "Wireless Headphones",
    category: "Electronics",
    price: 89.0,
    image: "https://placehold.co/600x400?text=Wireless+Headphones",
  },
  {
    id: 4,
    title: "Desk Lamp",
    category: "Home",
    price: 42.0,
    image: "https://placehold.co/600x400?text=Desk+Lamp",
  },
  {
    id: 5,
    title: "Notebook Set",
    category: "Stationery",
    price: 14.25,
    image: "https://placehold.co/600x400?text=Notebook+Set",
  },
  {
    id: 6,
    title: "Running Shoes",
    category: "Apparel",
    price: 72.0,
    image: "https://placehold.co/600x400?text=Running+Shoes",
  },
  {
    id: 7,
    title: "Water Bottle",
    category: "Outdoors",
    price: 18.75,
    image: "https://placehold.co/600x400?text=Water+Bottle",
  },
  {
    id: 8,
    title: "Bluetooth Speaker",
    category: "Electronics",
    price: 54.99,
    image: "https://placehold.co/600x400?text=Bluetooth+Speaker",
  },
];

/**
 * Look up a product by id.
 * @param {number} id
 * @returns {Object|undefined}
 */
export function getProductById(id) {
  return PRODUCTS.find((product) => product.id === id);
}