// --- CHECKOUT PAGE LOGIC ---
function getCart() {
    return JSON.parse(localStorage.getItem('vividCart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('vividCart', JSON.stringify(cart));
    renderCheckoutPage();
}

function renderCheckoutPage() {
    const cart = getCart();
    const listEl = document.getElementById('checkout-bag-list');
    const totalEl = document.getElementById('checkout-total');
    const hiddenDetails = document.getElementById('hidden-order-details');
    const hiddenTotal = document.getElementById('hidden-order-total');

    if (!listEl || !totalEl) return;

    if (cart.length === 0) {
        listEl.innerHTML = `
            <div class="empty-bag-box">
                <p class="empty-cart">Your studio bag is currently empty.</p>
                <a href="portfolio.html" class="paint-link small-btn">Explore Gallery</a>
            </div>
        `;
        totalEl.innerText = '$0.00';
        if (hiddenDetails) hiddenDetails.value = '';
        if (hiddenTotal) hiddenTotal.value = '$0.00';
        return;
    }

    let total = 0;
    let textSummary = [];
    listEl.innerHTML = '';

    cart.forEach((item, index) => {
        const itemPrice = Number(item.price) || 0;
        total += itemPrice;
        textSummary.push(`${index + 1}. ${item.title} ($${itemPrice.toFixed(2)}) - ${item.description || 'No notes'}`);

        const card = document.createElement('div');
        card.className = 'bag-item-card';
        card.innerHTML = `
            <div class="bag-item-info">
                <h5>${item.title}</h5>
                <p class="bag-item-desc">${item.description || 'Standard Studio Order'}</p>
            </div>
            <div class="bag-item-actions">
                <span class="bag-item-price">$${itemPrice.toFixed(2)}</span>
                <button type="button" class="remove-item" onclick="removeCheckoutItem(${index})" title="Remove item">&times;</button>
            </div>
        `;
        listEl.appendChild(card);
    });

    totalEl.innerText = `$${total.toFixed(2)}`;
    if (hiddenDetails) hiddenDetails.value = textSummary.join('\n');
    if (hiddenTotal) hiddenTotal.value = `$${total.toFixed(2)}`;
}

window.removeCheckoutItem = function(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
};

const clearBagBtn = document.getElementById('clear-bag-btn');
if (clearBagBtn) {
    clearBagBtn.onclick = () => {
        if (getCart().length === 0) return;
        localStorage.removeItem('vividCart');
        renderCheckoutPage();
    };
}

// --- FINAL ORDER SUBMISSION ---
const finalCheckoutForm = document.getElementById('final-checkout-form');
if (finalCheckoutForm) {
    finalCheckoutForm.onsubmit = async (e) => {
        e.preventDefault();
        const cart = getCart();

        if (cart.length === 0) {
            alert("Your studio bag is empty! Add a commission or print before submitting.");
            return;
        }

        const btn = document.getElementById('submit-order-btn');
        btn.innerText = "Sending Order...";

        try {
            const response = await fetch(e.target.action, {
                method: 'POST',
                body: new FormData(e.target),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                localStorage.removeItem('vividCart');
                renderCheckoutPage();
                document.getElementById('order-form-container').innerHTML = `
                    <div style="text-align: center; padding: 25px 10px;">
                        <h3 style="font-family: 'Cinzel', serif; margin-bottom: 12px; text-shadow: 0 0 12px var(--accent-purple);">
                            Order Manifested!
                        </h3>
                        <p style="font-size: 1rem; color: #cbd5e1;">
                            Thank you! Your order details have been sent to the studio. Watch your email for your invoice and next steps.
                        </p>
                        <a href="index.html" class="paint-link" style="margin-top: 15px;">Return to Studio</a>
                    </div>
                `;
            } else {
                btn.innerText = "Error - Try Again";
            }
        } catch (err) {
            btn.innerText = "Send Order to Studio ✨";
            alert("Could not send order. Please check your internet connection.");
        }
    };
}

renderCheckoutPage();
