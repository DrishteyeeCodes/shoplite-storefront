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
    image: "../images/tote-bag.jpeg",
  },
  {
    id: 2,
    title: "Ceramic Coffee Mug",
    category: "Home",
    price: 16.5,
    image: "../images/mug.jpeg",
  },
  {
    id: 3,
    title: "Wireless Headphones",
    category: "Electronics",
    price: 89.0,
    image: "../images/headphones.jpeg",
  },
  {
    id: 4,
    title: "Desk Lamp",
    category: "Home",
    price: 42.0,
    image: "../images/table-lamp.jpeg",
  },
  {
    id: 5,
    title: "Notebook Set",
    category: "Stationery",
    price: 14.25,
    image: "../images/Journals.jpeg",
  },
  {
    id: 6,
    title: "Running Shoes",
    category: "Apparel",
    price: 72.0,
    image: "../images/running-shoes.jpeg",
  },
  {
    id: 7,
    title: "Water Bottle",
    category: "Outdoors",
    price: 18.75,
    image: "../images/water-bottle.jpeg",
  },
  {
    id: 8,
    title: "Bluetooth Speaker",
    category: "Electronics",
    price: 54.99,
    image: "../images/bluetooth-speakers.jpeg",
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