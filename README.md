# 🛍️ ShopLite – Wishlist-Enabled E-Commerce Storefront

ShopLite is a lightweight e-commerce storefront built using **HTML, CSS, and Vanilla JavaScript (ES6 Modules)**. It demonstrates core frontend functionality such as shopping carts, multiple wishlists, wishlist merging, and local persistence—without relying on any frameworks or backend services.

---

## ✨ Features

### 🛒 Shopping Experience
- Responsive product catalog with real product images
- Add products to cart
- Update quantities or remove items
- Live cart badge
- Cart drawer with total price
- Simulated checkout flow

### ❤️ Wishlist Management
- Create multiple wishlists
- Add or remove products from any wishlist
- Delete wishlists
- Persistent storage using `localStorage`

### 🔀 Wishlist Merge
- Merge any two existing wishlists
- Creates a brand-new wishlist
- Automatically removes duplicate products
- Original wishlists remain unchanged

### 💾 Local Persistence
- Cart data
- Wishlists
- Wishlist contents

All stored automatically using browser `localStorage`.

### 🎨 Modern UI
- Responsive layout
- Real product images
- Smooth hover animations
- Rounded cards and buttons
- Slide-in Cart and Wishlist panels
- Toast notifications
- Empty state screens

---

# 📂 Project Structure

```
/
│── index.html
│── style.css
│── images/
│     ├── bluetooth-speakers.jpeg
│     ├── headphones.jpeg
│     ├── mug.jpeg
│     ├── running-shoes.jpeg
│     ├── table-lamp.jpeg
│     ├── tote-bag.jpeg
│     └── water-bottle.jpeg
│
└── js/
      ├── app.js
      ├── cart.js
      ├── data.js
      ├── storage.js
      ├── ui.js
      └── wishlist.js
```

---

# 🚀 Running the Project

1. Clone the repository

```bash
git clone https://github.com/DrishteyeeCodes/shoplite-storefront.git
```

2. Open the project in VS Code

3. Start **Live Server**

4. Open

```
index.html
```

The application runs completely in the browser.

---

# 🧠 Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (ES6 Modules)
- Local Storage API

---

# 📌 Highlights

- Framework-free implementation
- Modular JavaScript architecture
- Responsive shopping UI
- Persistent cart and wishlist data
- Efficient wishlist merge using product ID deduplication

---

## 📄 License

This project was built as part of a frontend engineering assignment and is intended for educational and demonstration purposes.
