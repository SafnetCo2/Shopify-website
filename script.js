/* ==========================
   Products & Cart Setup
========================== */
const products = [
    {
        id: 1, name: "T-Shirt", price: 25,
        img: "https://images.unsplash.com/photo-1643881080002-afdc695936e0?q=80&w=409&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: 2, name: "Sneakers", price: 60,
        img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c25lYWtlcnN8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 3, name: "Cap", price: 15,
        img: "https://images.unsplash.com/photo-1466992133056-ae8de8e22809?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FwfGVufDB8fDB8fHww"
    },
    {
        id: 4, name: "Backpack", price: 40,
        img: "https://images.unsplash.com/photo-1514524865930-188150490d83?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmFjayUyMHBhY2t8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 5, name: "Jacket", price: 80,
        img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8amFja2V0fGVufDB8fDB8fHww"
    },
    {
        id: 6, name: "Watch", price: 120,
        img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8d2F0Y2h8ZW58MHx8MHx8fDA%3D"
    },
    {
        id: 6, name: "Jewerly", price: 120,
        img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
            {
        id: 6, name: "women shoes", price: 120,
                img: "https://images.unsplash.com/photo-1534653299134-96a171b61581?w=280&dpr=1&h=760&auto=format&fit=crop&q=60&ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzU3MjM2NDM1fA&ixlib=rb-4.1.0"
            },
                
        
            
];

// Only declare cart once
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/* ==========================
   Render Products
========================== */
function renderProducts() {
    const container = document.getElementById('product-list');
    if (!container) return;
    container.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">$${product.price}</div>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(div);
    });
}

/* ==========================
   Cart Functions
========================== */
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
    showAddAlert(`${product.name} added to cart!`);
}

function changeQuantity(index, delta) {
    cart[index].quantity = Math.max(1, (cart[index].quantity || 1) + delta);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

/* ==========================
   Render Cart
========================== */
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const vat = subtotal * 0.16;
    const discount = subtotal * 0.1;
    const total = subtotal + vat - discount;

    const card = document.createElement('div');
    card.className = 'cart-card';

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'cart-table-wrapper';
    tableWrapper.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${cart.map((item, i) => `
                    <tr>
                        <td data-label="Item">${item.name}</td>
                        <td data-label="Qty">${item.quantity}</td>
                        <td data-label="Price">$${item.price.toFixed(2)}</td>
                        <td data-label="Total">$${(item.price * item.quantity).toFixed(2)}</td>
                        <td data-label="Actions">
                            <button onclick="changeQuantity(${i}, -1)">-</button>
                            <button onclick="changeQuantity(${i}, 1)">+</button>
                            <button onclick="removeItem(${i})">Remove</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    card.appendChild(tableWrapper);

    card.innerHTML += `
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <p>VAT (16%): $${vat.toFixed(2)}</p>
        <p>Discount (10%): -$${discount.toFixed(2)}</p>
        <h4>Total: $${total.toFixed(2)}</h4>

        <div class="cart-payment">
            <h3>Select Payment Method</h3>
            <form id="payment-form">
                <label><input type="radio" name="payment" value="mpesa" required> M-Pesa</label>
                <label><input type="radio" name="payment" value="card"> Card</label>
                <label><input type="radio" name="payment" value="mobile"> Mobile Payment</label>
                <label><input type="radio" name="payment" value="cash"> Cash</label>
                <button type="submit">Proceed</button>
            </form>
            <div id="selected-payment"></div>
        </div>

        <button onclick="checkout()">Print & Complete</button>
    `;

    cartContainer.appendChild(card);

    const paymentForm = document.getElementById('payment-form');
    const selectedPayment = document.getElementById('selected-payment');
    if (paymentForm && selectedPayment) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const method = document.querySelector('input[name="payment"]:checked')?.value;
            if (!method) return;
            selectedPayment.textContent = `You selected: ${method.toUpperCase()}`;
        });
    }
}

/* ==========================
   Checkout & Print
========================== */
function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    if (!paymentMethod) return alert("Please select a payment method!");

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const vat = subtotal * 0.16;
    const discount = subtotal * 0.1;
    const total = subtotal + vat - discount;

    const printHTML = `
        <html>
        <head>
            <title>Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2,h3,h4{text-align:center; margin:5px 0;}
                table{width:100%;border-collapse:collapse;margin-top:15px; table-layout:auto;}
                th,td{padding:8px;border:1px solid #ccc;text-align:left; white-space: nowrap;}
                th{background-color:#f5f5f5;}
                .total{font-weight:bold;}
            </style>
        </head>
        <body>
            <h2>Demo Shopify Store</h2>
            <p style="text-align:center;">123 Demo Street, Nairobi | +254 700 000 000</p>
            <p>Date: ${new Date().toLocaleDateString()} | Time: ${new Date().toLocaleTimeString()}</p>
            <table>
                <thead>
                    <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                </thead>
                <tbody>
                    ${cart.map(item => {
        const qty = item.quantity || 1;
        return `<tr>
                            <td>${item.name}</td>
                            <td>${qty}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${(item.price * qty).toFixed(2)}</td>
                        </tr>`;
    }).join('')}
                </tbody>
            </table>
            <p class="total">Subtotal: $${subtotal.toFixed(2)}</p>
            <p class="total">VAT (16%): $${vat.toFixed(2)}</p>
            <p class="total">Discount (10%): -$${discount.toFixed(2)}</p>
            <h3>Total Paid: $${total.toFixed(2)}</h3>
            <p>Payment Method: ${paymentMethod.toUpperCase()}</p>
            <p style="text-align:center;">Thank you for your purchase!</p>
        </body>
        </html>
    `;

    const printWindow = window.open('', '', 'width=700,height=700');
    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

/* ==========================
   Live Cart Count
========================== */
function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    if (!countEl) return;
    countEl.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

/* ==========================
   Alert / Toast
========================== */
function showAddAlert(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'add-alert';
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.classList.add('fade-out');
        setTimeout(() => alertDiv.remove(), 500);
    }, 2000);
}

/* ==========================
   Mobile Menu Toggle
========================== */
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('mobile-menu');
    const nav = document.getElementById('navbar');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
});







/* ==========================
   Init
========================== */
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    updateCartCount();
});

/* ==========================
   Chatbot Setup
========================== */
const chatbotHeader = document.getElementById('chatbot-header');
const chatbotBody = document.getElementById('chatbot-body');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInput = document.getElementById('chatbot-input');
const chatbotSend = document.getElementById('chatbot-send');

// Toggle chatbot
chatbotHeader.addEventListener('click', () => {
    chatbotBody.style.display = chatbotBody.style.display === 'flex' ? 'none' : 'flex';
});

// Send message
chatbotSend.addEventListener('click', sendMessage);
chatbotInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = chatbotInput.value.trim();
    if (!message) return;

    // User message
    const userMsg = document.createElement('div');
    userMsg.textContent = message;
    userMsg.classList.add('user');
    chatbotMessages.appendChild(userMsg);

    chatbotInput.value = '';
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Bot reply
    setTimeout(() => {
        const botMsg = document.createElement('div');
        botMsg.textContent = getBotReply(message);
        chatbotMessages.appendChild(botMsg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 500);
}

// Basic bot replies
function getBotReply(message) {
    message = message.toLowerCase();
    if (message.includes('hello') || message.includes('hi')) return 'Hello! How can I help you today?';
    if (message.includes('price')) return 'Our products start from $25. Which one are you interested in?';
    if (message.includes('payment')) return 'You can pay via M-Pesa, card, mobile payment, or cash.';
    return 'I\'m here to assist you with your orders!';
}
