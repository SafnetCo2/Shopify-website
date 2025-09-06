/* ==========================
   Products & Cart Setup
========================== */
const products = [
    { id: 1, name: "T-Shirt", price: 25, img: "https://via.placeholder.com/250x200?text=T-Shirt" },
    { id: 2, name: "Sneakers", price: 60, img: "https://via.placeholder.com/250x200?text=Sneakers" },
    { id: 3, name: "Cap", price: 15, img: "https://via.placeholder.com/250x200?text=Cap" },
    { id: 4, name: "Backpack", price: 40, img: "https://via.placeholder.com/250x200?text=Backpack" },
    { id: 5, name: "Jacket", price: 80, img: "https://via.placeholder.com/250x200?text=Jacket" },
    { id: 6, name: "Watch", price: 120, img: "https://via.placeholder.com/250x200?text=Watch" }
];

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

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const vat = subtotal * 0.16;
    const discount = subtotal * 0.1;
    const total = subtotal + vat - discount;

    alert(`Checkout Total: $${total.toFixed(2)}\nPayment handled separately`);
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

    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    countEl.textContent = totalItems;
}

/* ==========================
   Render Cart (Single Card)
========================== */
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    if (!paymentMethod) {
        alert("Please select a payment method!");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const vat = subtotal * 0.16;
    const discount = subtotal * 0.1;
    const total = subtotal + vat - discount;

    // Generate HTML for print
    let printHTML = `
        <html>
        <head>
            <title>Receipt</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                h2, h3, h4 { text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                th, td { padding: 8px; border: 1px solid #ccc; text-align: left; }
                .total { font-weight: bold; margin-top: 10px; }
            </style>
        </head>
        <body>
            <h2>Demo Shopify Store</h2>
            <p style="text-align:center;">123 Demo Street, Nairobi | +254 700 000 000</p>
            <p style="text-align:center;">Date: ${new Date().toLocaleDateString()} Time: ${new Date().toLocaleTimeString()}</p>
            <h3>Receipt #: ${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
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

    // Clear cart after printing
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}








/* ==========================
   Mobile Menu Toggle
========================== */
const menuToggle = document.getElementById('mobile-menu');
const nav = document.getElementById('navbar');
if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('active'));
}

/* ==========================
   Init
========================== */
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    renderCart();
    updateCartCount();

    const paymentForm = document.getElementById('payment-form');
    const selectedPayment = document.getElementById('selected-payment');

    if (paymentForm && selectedPayment) {
        paymentForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
            if (!paymentMethod) return;
            selectedPayment.textContent = `You selected: ${paymentMethod.toUpperCase()}`;
        });
    }
});
