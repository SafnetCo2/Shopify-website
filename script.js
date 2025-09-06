// Hamburger menu toggle
const menuToggle = document.getElementById('mobile-menu');
const nav = document.getElementById('navbar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// Product Data
const products = [
    { id: 1, name: "T-Shirt", price: 25, img: "https://via.placeholder.com/250x200?text=T-Shirt" },
    { id: 2, name: "Sneakers", price: 60, img: "https://via.placeholder.com/250x200?text=Sneakers" },
    { id: 3, name: "Cap", price: 15, img: "https://via.placeholder.com/250x200?text=Cap" },
    { id: 4, name: "Backpack", price: 40, img: "https://via.placeholder.com/250x200?text=Backpack" },
    { id: 5, name: "Jacket", price: 80, img: "https://via.placeholder.com/250x200?text=Jacket" },
    { id: 6, name: "Watch", price: 120, img: "https://via.placeholder.com/250x200?text=Watch" }
];

// Cart functionality using localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render products on shop page
function renderProducts() {
    const container = document.getElementById('product-list');
    if (!container) return;
    container.innerHTML = '';
    products.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <div class="price">$${p.price}</div>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
        container.appendChild(div);
    });
}

// Add to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
    updateCart();
}

// Render cart on cart page
function updateCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotal.innerText = '0';
        return;
    }

    cartContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.innerHTML = `${item.name} - $${item.price} <button onclick="removeItem(${index})">Remove</button>`;
        cartContainer.appendChild(div);
        total += item.price;
    });
    cartTotal.innerText = total;
}

// Remove item from cart
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Checkout
function checkout() {
    if (cart.length === 0) { alert("Your cart is empty!"); return; }
    alert(`Thank you for your purchase! Total: $${cart.reduce((acc, item) => acc + item.price, 0)}`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

// Initialize
renderProducts();
updateCart();

