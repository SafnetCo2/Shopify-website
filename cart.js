/* ==========================
   Cart Management
========================== */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/* Generate Receipt Number */
function generateReceiptNumber() {
    return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}

/* Render Cart as Single POS Card */
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    if (!cartContainer || !cartTotalEl) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalEl.textContent = '0';
        return;
    }

    let subtotal = 0;
    cartContainer.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'cart-receipt-card';
    let content = `<h3>Demo Shopify Store</h3>
                   <p>123 Demo Street, Nairobi | +254 700 000 000</p>
                   <p>Date: ${new Date().toLocaleDateString()} Time: ${new Date().toLocaleTimeString()}</p>
                   <p>Receipt #: ${generateReceiptNumber()}</p>
                   <table>`;

    cart.forEach((item, index) => {
        if (!item.quantity) item.quantity = 1;
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        content += `<tr>
                        <td>${item.name} x${item.quantity}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>$${itemTotal.toFixed(2)}</td>
                        <td>
                            <button onclick="changeQuantity(${index}, -1)">-</button>
                            <button onclick="changeQuantity(${index}, 1)">+</button>
                            <button onclick="removeItem(${index})">Remove</button>
                        </td>
                    </tr>`;
    });

    const vat = subtotal * 0.16;
    const discount = subtotal * 0.1;
    const total = subtotal + vat - discount;

    content += `</table>
                <p>Subtotal: $${subtotal.toFixed(2)}</p>
                <p>VAT (16%): $${vat.toFixed(2)}</p>
                <p>Discount (10%): -$${discount.toFixed(2)}</p>
                <h4>Total: $${total.toFixed(2)}</h4>
                <button onclick="checkout()">Pay Now</button>`;

    card.innerHTML = content;
    cartContainer.appendChild(card);
    cartTotalEl.textContent = total.toFixed(2);
}

/* Change Quantity */
function changeQuantity(index, delta) {
    cart[index].quantity = Math.max(1, (cart[index].quantity || 1) + delta);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

/* Remove Item */
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

/* Checkout / Payment */
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const vat = subtotal * 0.16;
    const discount = subtotal * 0.1;
    const total = subtotal + vat - discount;

    const paymentMethod = prompt("Enter payment method (Cash, Card, Mobile):", "Cash");
    if (!paymentMethod) return;

    // Generate HTML receipt
    let receiptHTML = `
    <html>
    <head>
        <title>Receipt</title>
        <style>
            body { font-family: monospace; padding: 20px; }
            h2, h3, h4 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            td, th { padding: 5px; text-align: left; }
            .total { font-weight: bold; margin-top: 10px; }
        </style>
    </head>
    <body>
        <h2>Demo Shopify Store</h2>
        <p style="text-align:center;">123 Demo Street, Nairobi | +254 700 000 000</p>
        <p style="text-align:center;">Date: ${new Date().toLocaleDateString()} Time: ${new Date().toLocaleTimeString()}</p>
        <p style="text-align:center;">Receipt #: ${generateReceiptNumber()}</p>
        <table>
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
            </tr>`;

    cart.forEach(item => {
        const qty = item.quantity || 1;
        const itemTotal = item.price * qty;
        receiptHTML += `<tr>
                            <td>${item.name}</td>
                            <td>${qty}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${itemTotal.toFixed(2)}</td>
                        </tr>`;
    });

    receiptHTML += `</table>
        <p class="total">Subtotal: $${subtotal.toFixed(2)}</p>
        <p class="total">VAT (16%): $${vat.toFixed(2)}</p>
        <p class="total">Discount (10%): -$${discount.toFixed(2)}</p>
        <h3>Total Paid: $${total.toFixed(2)}</h3>
        <p>Payment Method: ${paymentMethod}</p>
        <p style="text-align:center;">Thank you for your purchase!</p>
    </body>
    </html>`;

    // Open print window
    const printWindow = window.open('', '', 'width=600,height=700');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

/* Initialize Cart on Page Load */
document.addEventListener('DOMContentLoaded', renderCart)