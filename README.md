<img width="1915" height="902" alt="Screenshot 2026-02-03 232151" src="https://github.com/user-attachments/assets/7160d1d4-6e4a-4a42-b05a-d3f56d4f866f" />


# 🦈 Shark Café | Mobile-First Ordering Website

A **calm-but-vibey**, mobile-first fast-food ordering website built with **pure HTML, CSS, and JavaScript**.  
Designed to feel like a real product - not a demo, not CRUD.

> Browse the menu → add items → see totals live → send your order via WhatsApp.
---
## 🔗 Live Demo
>You can view the live website here: [Live Demo Link](https://wanadebotman.github.io/Shark-Cafe/)
---

## ✨ Key Features

- 📱 **Mobile-first design**
  - Built for phones first, then scaled up
  - Custom mobile dock navigation
  - Touch-friendly interactions and spacing

- 🛒 **Interactive Menu & Ordering**
  - Add/remove items with live quantity updates
  - Instant subtotal & total calculation
  - Delivery option added as a real order line item
  - Auto-incrementing order numbers

- 💬 **WhatsApp Order Integration**
  - Pre-filled WhatsApp message with:
    - Order number
    - Customer name
    - Items & quantities
    - Delivery status

- 🎨 **Premium UI / UX**
  - Custom typography (Fraunces + Instrument Sans)
  - Dark, atmospheric colour system
  - Smooth micro-animations on taps & clicks
  - Scroll-reveal animations (respects reduced-motion)

- 🧠 **Thoughtful Design Decisions**
  - No frameworks, no libraries, no bloat
  - Clean state management (not CRUD tables)
  - Clear hierarchy & intent-driven layout
  - Designed to feel like a real café product

---

## 🧱 Tech Stack

- **HTML5** — semantic, accessible structure  
- **CSS3** — modern layout, animations, mobile polish  
- **JavaScript (Vanilla)** — state, logic, interactions  
- **Local assets only** — no external image dependencies  

---

## 📂 Project Structure

shark-cafe/
├── index.html
├── style.css
├── script.js
├── thumbnails/
│ ├── beef-burger.jpg
│ ├── chicken-burger.jpg
│ ├── chicken-wrap.jpg
│ ├── fries.jpg
│ ├── loaded-fries.jpg
│ ├── wings.jpg
│ ├── ribs.jpg
│ ├── milkshake.jpg
│ └── soda.jpg
└── README.md

---

## 🚀 How to Use / Customize

No setup required.

1. Download or clone the repo
2. Open `index.html` in your browser
3. Customize 
4. Done ✅

---

## ⚙️ Configuration

In `script.js`, update these values to your real café details:

```js
const WHATSAPP_NUMBER = "27XXXXXXXXX"; // digits only
const CALL_NUMBER = "+27XXXXXXXXX";
const DELIVERY_FEE = 25; // ZAR
