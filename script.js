const WHATSAPP_NUMBER = "27000000000"; 
const CALL_NUMBER = "+27000000000";

const DELIVERY_FEE = 25; // ZAR
let deliveryOn = false;    

const menuItems = [
  // Burgers
  {
    id: "burger_beef",
    category: "burgers",
    name: "Beef Smash Burger",
    desc: "Double smash, melted cheese, caramelised onions.",
    price: 69,
    img: "thumbnails/beef-burger.jpg",
    alt: "A juicy beef burger with melted cheese",
    tag: "Popular"
  },
  {
    id: "burger_chicken",
    category: "burgers",
    name: "Chicken Burger",
    desc: "Crispy chicken, pickles, creamy Shark sauce.",
    price: 59,
    img: "thumbnails/chicken-burger.jpg",
    alt: "A crispy chicken burger with sauce",
    tag: "Crispy"
  },

  // Wraps
  {
    id: "wrap_chicken",
    category: "wraps",
    name: "Chicken Wrap",
    desc: "Saucy chicken, fresh slaw, soft wrap — no mess.",
    price: 55,
    img: "thumbnails/chicken-wrap.jpg",
    alt: "A chicken wrap cut open showing filling",
    tag: "Quick"
  },

  // Sides
  {
    id: "side_fries",
    category: "sides",
    name: "Fries",
    desc: "Golden fries, crisp edges.",
    price: 25,
    img: "thumbnails/fries.jpg",
    alt: "Golden crispy fries",
    tag: "Classic"
  },
  {
    id: "side_loaded",
    category: "sides",
    name: "Loaded Fries",
    desc: "Cheese, sauce, crispy bits — the upgrade.",
    price: 40,
    img: "thumbnails/loaded-fries.jpg",
    alt: "Loaded fries topped with sauce and cheese",
    tag: "Loaded"
  },
  {
    id: "side_wings",
    category: "sides",
    name: "Crispy Wings (6)",
    desc: "Crunchy, juicy, dunk-ready.",
    price: 65,
    img: "thumbnails/wings.jpg",
    alt: "Crispy chicken wings with dipping sauce",
    tag: "Sauce"
  },
  {
    id: "side_ribs",
    category: "sides",
    name: "BBQ Ribs",
    desc: "Sticky glaze, charred edges, serious flavour.",
    price: 99,
    img: "thumbnails/ribs.jpg",
    alt: "BBQ ribs glazed and ready to eat",
    tag: "Premium"
  },

  // Drinks
  {
    id: "drink_soda",
    category: "drinks",
    name: "Ice-Cold Soda",
    desc: "Classic fizzy favourites. Served cold.",
    price: 18,
    img: "thumbnails/soda.jpg",
    alt: "Ice-cold bottled soda",
    tag: "Fizzy"
  },

  // Sweet
  {
    id: "sweet_milkshake",
    category: "sweet",
    name: "Milkshake",
    desc: "Thick, cold, sweet finish.",
    price: 45,
    img: "thumbnails/milkshake.jpg",
    alt: "A thick milkshake",
    fit: "contain",
    tag: "Sweet"
  }
];

// State
const order = new Map(); // id -> qty
let activeFilter = "all";

// DOM
const menuGrid = document.getElementById("menuGrid");
const orderList = document.getElementById("orderList");
const orderCount = document.getElementById("orderCount");
const formError = document.getElementById("formError");
const clientNameInput = document.getElementById("clientName");
const orderForm = document.getElementById("orderForm");
const subtotalValue = document.getElementById("subtotalValue");
const totalValue = document.getElementById("totalValue");

const deliveryToggle = document.getElementById("deliveryToggle");
const deliveryFields = document.getElementById("deliveryFields");
const deliveryAddress = document.getElementById("deliveryAddress");
const deliveryRow = document.getElementById("deliveryRow");
const deliveryValue = document.getElementById("deliveryValue");
const deliveryFeeLabel = document.getElementById("deliveryFeeLabel");

const callLinkTop = document.getElementById("callLinkTop");
const callLinkInline = document.getElementById("callLinkInline");
const stickyCall = document.getElementById("stickyCall");

callLinkTop.href = `tel:${CALL_NUMBER}`;
callLinkInline.href = `tel:${CALL_NUMBER}`;
stickyCall.href = `tel:${CALL_NUMBER}`;


// ====== Micro-interactions (ripple + press) ======
function attachClickFX(selector){
  document.querySelectorAll(selector).forEach(el => {
    el.addEventListener("pointerdown", (e) => {
      // press feedback
      el.classList.add("press");
      // ripple
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.15;
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${(e.clientX ?? (rect.left + rect.width/2)) - rect.left}px`;
      ripple.style.top  = `${(e.clientY ?? (rect.top + rect.height/2)) - rect.top}px`;
      el.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove(), { once:true });
    }, { passive:true });

    const clearPress = () => el.classList.remove("press");
    el.addEventListener("pointerup", clearPress, { passive:true });
    el.addEventListener("pointercancel", clearPress, { passive:true });
    el.addEventListener("pointerleave", clearPress, { passive:true });
  });
}

// Modal
const successModal = document.getElementById("successModal");
const modalOrderNum = document.getElementById("modalOrderNum");
let lastFocusEl = null;

// Toast
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");
let toastTimer = null;

function showToast(msg){
  if(!toast || !toastText) return;
  toastText.textContent = msg;
  toast.hidden = false;
  toast.classList.remove("is-show");
  // reflow
  void toast.offsetWidth;
  toast.classList.add("is-show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-show");
    window.setTimeout(() => { toast.hidden = true; }, 180);
  }, 1400);
}



// ====== Image skeletons (premium loading) ======
function wireImageSkeletons(scope=document){
  scope.querySelectorAll("img.img-skel").forEach(img=>{
    if(img.dataset.skelWired) return;
    img.dataset.skelWired="1";
    // if already loaded (cache), remove immediately
    if(img.complete && img.naturalWidth > 0){
      img.classList.add("is-loaded");
      return;
    }
    img.addEventListener("load", ()=> img.classList.add("is-loaded"), { once:true });
    img.addEventListener("error", ()=> img.classList.add("is-loaded"), { once:true });
  });
}

function moneyZar(n){
  return `R${Number(n).toFixed(0)}`;
}

function nextOrderNumber(){
  const key = "sc_order_seq";
  const raw = localStorage.getItem(key);
  const current = Number.parseInt(raw || "0", 10);
  const next = Number.isFinite(current) ? current + 1 : 1;
  localStorage.setItem(key, String(next));
  return `SC-${String(next).padStart(3, "0")}`;
}

function getQty(id){ return order.get(id) || 0; }

function setQty(id, qty){
  if(qty <= 0) order.delete(id);
  else order.set(id, qty);

  renderMenu();
  renderOrder();
}

function addOne(id){
  const before = getQty(id);
  setQty(id, before + 1);
  const item = menuItems.find(i => i.id === id);
  if(item) showToast(`Added to order: ${item.name}`);
}
function removeOne(id){
  const before = getQty(id);
  setQty(id, before - 1);
  const item = menuItems.find(i => i.id === id);
  if(item && before > 0) showToast(`Removed: ${item.name}`);
}

// Filters
document.querySelectorAll(".pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    renderMenu();
  });
});

function renderMenu(){
  const items = menuItems.filter(i => activeFilter === "all" ? true : i.category === activeFilter);

  menuGrid.innerHTML = items.map(item => {
    const qty = getQty(item.id);
    return `
      <article class="card" aria-label="${item.name}" ${item.fit ? `data-fit="${item.fit}"` : ""}>
        <div class="card-media">
          <img class="img-skel" loading="lazy" decoding="async" src="${item.img}" alt="${item.alt}" />
          <span class="badge">${item.tag}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-desc">${item.desc}</p>
          <div class="card-row">
            <span class="price">${moneyZar(item.price)}</span>
            <div class="qty" aria-label="Quantity controls for ${item.name}">
              <button type="button" data-action="dec" data-id="${item.id}" aria-label="Decrease ${item.name}">−</button>
              <span aria-live="polite">${qty}</span>
              <button type="button" data-action="inc" data-id="${item.id}" aria-label="Increase ${item.name}">+</button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  wireImageSkeletons(menuGrid);

  menuGrid.querySelectorAll("button[data-action]").forEach(btn => {
    const id = btn.dataset.id;
    btn.addEventListener("click", () => {
      btn.dataset.action === "inc" ? addOne(id) : removeOne(id);
    });
  });
}

  // click fx for dynamic controls
  attachClickFX('.qty button, .card button, .pill');


function computeTotals(){
  let subtotal = 0;
  let count = 0;

  for(const [id, qty] of order.entries()){
    const item = menuItems.find(i => i.id === id);
    if(!item) continue;
    subtotal += item.price * qty;
    count += qty;
  }

  const delivery = deliveryOn ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  return { subtotal, delivery, total, count };
}

function renderOrder(){
  const entries = Array.from(order.entries());
  const { subtotal, delivery, total, count } = computeTotals();

  orderCount.textContent = `${count} item${count === 1 ? "" : "s"}`;
  subtotalValue.textContent = moneyZar(subtotal);
  totalValue.textContent = moneyZar(total);

  if(deliveryRow && deliveryValue){
    if(deliveryOn){
      deliveryRow.hidden = false;
      deliveryValue.textContent = moneyZar(delivery);
    }else{
      deliveryRow.hidden = true;
      deliveryValue.textContent = moneyZar(0);
    }
  }

  const hint = document.getElementById("orderHint");

  // Build list (items + delivery line if enabled)
  const itemLines = entries.map(([id, qty]) => {
    const item = menuItems.find(i => i.id === id);
    if(!item) return "";
    const lineTotal = item.price * qty;
    return `
      <li class="order-item">
        <span class="name">${item.name}</span>
        <span class="qty">x${qty} • ${moneyZar(lineTotal)}</span>
      </li>
    `;
  }).join("");

  const deliveryLine = deliveryOn ? `
    <li class="order-item order-item--delivery">
      <span class="name">Delivery</span>
      <span class="qty">${moneyZar(DELIVERY_FEE)}</span>
    </li>
  ` : "";

  orderList.innerHTML = `${itemLines}${deliveryLine}`;

  if(count === 0){
    hint.textContent = deliveryOn
      ? "Delivery is on — now add items from the menu above."
      : "Add items from the menu above.";
    return;
  }

  hint.textContent = "Ready when you are — we’ll open WhatsApp with your order.";
}

function buildWhatsAppMessage({ orderNumber, clientName }){
  const lines = [];
  lines.push("Hello Shark Café 👋", "");
  lines.push(`Order Number: #${orderNumber}`);
  lines.push(`Name: ${clientName}`, "");
  lines.push(`Delivery: ${deliveryOn ? "Yes" : "No"}`);
  if(deliveryOn){
    const addr = (document.getElementById("deliveryAddress")?.value || "").trim();
    if(addr) lines.push(`Address: ${addr}`);
    lines.push(`Delivery Fee: ${moneyZar(DELIVERY_FEE)}`);
  }
  const { total } = computeTotals();
  lines.push(`Total: ${moneyZar(total)}`, "");
  lines.push("Order:");

  for(const [id, qty] of order.entries()){
    const item = menuItems.find(i => i.id === id);
    if(item) lines.push(`- ${item.name} x${qty}`);
  }

  lines.push("", "Thank you!");
  return lines.join("\n");
}

function openWhatsApp(message){
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  const url = `${base}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function setError(msg){ formError.textContent = msg || ""; }

// Delivery toggle
if(deliveryFeeLabel) deliveryFeeLabel.textContent = `+ ${moneyZar(DELIVERY_FEE)}`;

function setDelivery(on){
  deliveryOn = !!on;
  if(deliveryToggle){
    deliveryToggle.setAttribute("aria-pressed", deliveryOn ? "true" : "false");
    deliveryToggle.classList.toggle("is-on", deliveryOn);
  }
  if(deliveryFields) deliveryFields.hidden = !deliveryOn;
  if(deliveryOn){
    showToast(`Delivery added (+${moneyZar(DELIVERY_FEE)})`);
  }else{
    showToast("Delivery removed");
  }
  renderOrder();
}

if(deliveryToggle){
  deliveryToggle.addEventListener("click", () => {
    setDelivery(!deliveryOn);
    if(deliveryOn && deliveryAddress) deliveryAddress.focus();
  });
}

// Modal helpers
function openModal(orderNumber){
  lastFocusEl = document.activeElement;
  modalOrderNum.textContent = `#${orderNumber}`;

  successModal.classList.add("is-open");
  successModal.setAttribute("aria-hidden", "false");

  // focus close button for accessibility
  const closeBtn = successModal.querySelector("[data-close]");
  if(closeBtn) closeBtn.focus();

  document.body.style.overflow = "hidden";
}

function closeModal(){
  successModal.classList.remove("is-open");
  successModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if(lastFocusEl && typeof lastFocusEl.focus === "function") lastFocusEl.focus();
}

successModal.addEventListener("click", (e) => {
  const close = e.target.closest("[data-close]");
  if(close) closeModal();
});

document.addEventListener("keydown", (e) => {
  if(e.key === "Escape" && successModal.classList.contains("is-open")){
    closeModal();
  }
});

// Submit
orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  setError("");

  const name = (clientNameInput.value || "").trim();
  const { count } = computeTotals();

  if(!name){
    setError("Please enter your name.");
    clientNameInput.focus();
    return;
  }
  if(count === 0){
    setError("Please add at least 1 item from the menu.");
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if(deliveryOn){
    const addr = (deliveryAddress?.value || "").trim();
    if(!addr){
      setError("Please enter a delivery address, or turn off delivery.");
      deliveryAddress?.focus();
      return;
    }
  }

  const orderNumber = nextOrderNumber();
  const message = buildWhatsAppMessage({ orderNumber, clientName: name });

  // 1) Open WhatsApp
  openWhatsApp(message);

  // 2) Show success modal (with order number)
  openModal(orderNumber);

  // Clear basket for next order
  order.clear();
  setDelivery(false);
  if(deliveryAddress) deliveryAddress.value = "";
  renderMenu();
  renderOrder();
});

// ====== Mobile Dock Active Highlight ======
const dockItems = Array.from(document.querySelectorAll(".dock-item"));

// Home dock should always scroll to true top (mobile UX)
const homeDock = document.querySelector('.dock-item[data-dock="home"]');
if(homeDock){
  homeDock.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setDockActive("home");
  });
}

const sectionEls = Array.from(document.querySelectorAll("[data-section]"));

function setDockActive(key){
  dockItems.forEach(a => a.classList.toggle("is-active", a.dataset.dock === key));
}

const observer = new IntersectionObserver((entries) => {
  // pick the most visible entry
  const visible = entries
    .filter(en => en.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];

  if(!visible) return;
  setDockActive(visible.target.dataset.section);
}, { threshold: [0.2, 0.35, 0.5, 0.65] });

sectionEls.forEach(s => observer.observe(s));


// ====== Reveal on scroll ======
const revealEls = Array.from(document.querySelectorAll(".reveal"));
if(revealEls.length){
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add("is-in");
        revealObs.unobserve(en.target);
      }
    });
  }, { threshold: 0.18 });
  revealEls.forEach(el => revealObs.observe(el));
}


// Initial render
attachClickFX('.btn, .pill, .dock-item, .icon-link, .chip, .sticky-btn');
renderMenu();
renderOrder();
wireImageSkeletons(document);