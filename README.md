# ShopLite — MVP E-Commerce Storefront

A lightweight e-commerce storefront demo built with **only HTML, CSS, and vanilla JavaScript** (ES6 modules). No frameworks, no build step, no dependencies.

## ✨ Features

- **Product storefront** — 8 sample products displayed in a responsive grid (image, name, price, category).
- **Shopping cart** — a familiar "Cart" button in the header (with a live item-count badge) opens a slide-in drawer from the right, just like a typical shopping site:
  - Starts empty, with a clear empty-cart message and a "Browse Products" shortcut.
  - Add products from any product card; increase/decrease quantity or remove items right in the drawer.
  - Shows a running total and has "Clear Cart" / "Checkout" actions (checkout is simulated for this MVP — it empties the cart and shows a confirmation toast).
- **Multiple wishlists** — create, view, and delete wishlists; add/remove products from any wishlist.
- **Wishlist merging** — select two existing wishlists and merge them into a brand-new wishlist:
  - Original wishlists are left untouched.
  - Duplicate products (by ID) are automatically de-duplicated.
  - You're prompted for a name for the merged wishlist.
  - Merging a wishlist with itself is blocked.
  - Empty wishlists are handled gracefully.
- **Persistence** — everything is saved to `localStorage`, so your wishlists survive page reloads.
- **Toast notifications** for every action (added, removed, created, deleted, merged, errors).
- **Empty states** for the sidebar (no wishlists yet) and merge section (fewer than 2 wishlists).
- **Responsive layout** — the wishlist sidebar collapses into a slide-in panel on smaller screens.

## 📁 Project Structure

```
/
│── index.html
│── css/
│     └── style.css
│── js/
│     ├── data.js       # static product catalog
│     ├── storage.js    # localStorage read/write wrapper
│     ├── wishlist.js   # wishlist business logic (CRUD + merge)
│     ├── cart.js        # cart business logic (add/remove/qty/total)
│     ├── ui.js         # all DOM rendering / presentation
│     └── app.js        # entry point — wires everything together
│── assets/
│     └── images/       # (placeholder — sample products use hosted images)
│── README.md
```

The code is deliberately split so that:
- **`data.js`** only knows about product data.
- **`storage.js`** only knows about `localStorage`.
- **`wishlist.js`** only knows business rules (create/delete/merge) — no DOM code.
- **`ui.js`** only knows how to render HTML and read simple input — no business rules.
- **`app.js`** is the glue: it listens for events and calls the other modules.

## ▶️ Running Locally (VS Code + Live Server)

1. Open this folder in VS Code.
2. Install the **Live Server** extension if you don't already have it.
3. Right-click `index.html` → **"Open with Live Server"**.
4. The app opens in your browser at something like `http://127.0.0.1:5500`.

> Because the app uses ES6 `<script type="module">`, it must be served over `http://` (via Live Server or any static server) — opening `index.html` directly via `file://` will fail in most browsers due to CORS restrictions on modules.

## 🚀 Deploying to GitHub Pages

1. Push this project to a GitHub repository (keep the same folder structure).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose your branch (e.g. `main`) and the `/ (root)` folder, then save.
5. GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/`.

No build step or configuration changes are needed — the project runs exactly as-is.

## 🧠 How Merging Works

1. Create at least two wishlists and add a few products to each.
2. Scroll to the **Merge Wishlists** section.
3. Pick **Wishlist A** and **Wishlist B** from the dropdowns.
4. Click **Merge Wishlists** and enter a name when prompted.
5. A brand-new wishlist appears in the sidebar containing the union of both lists' products (no duplicates), while the two originals remain unchanged.

## 🛠️ Tech Notes

- Product images are loaded from `https://placehold.co` placeholder image URLs — replace `data.js`'s `image` fields with your own paths (e.g. `assets/images/product1.jpg`) if you'd like to use local images.
- All wishlist state lives under the `shoplite_wishlists_v1` key in `localStorage`. Clearing your browser storage will reset wishlists back to empty.
- No external libraries or CDNs are required for the app to function.
