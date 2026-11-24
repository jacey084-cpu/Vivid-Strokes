// --- 1. GALLERY LOGIC ---
async function loadGallery() {
    try {
        const response = await fetch('art.json');
        if (!response.ok) throw new Error("Could not find or load art.json");
        const artData = await response.json();

        const grid = document.getElementById('portfolio-grid');
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('full-image');
        const captionText = document.getElementById('modal-caption');

        if (!grid) return;
        grid.innerHTML = '';

        artData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'art-card glass-card';
            card.id = item.id;

            card.innerHTML = `
                <div class="art-image-container">
                    <img src="${item.image}" alt="${item.title}" class="clickable-img">
                </div>
                <div class="art-info">
                    <span class="category-tag">${item.category}</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>
            `;

            card.addEventListener('click', () => {
                modal.style.display = "flex";
                modalImg.src = item.image;
                captionText.innerHTML = `
                    <span class="category-tag">${item.category}</span>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <button class="paint-link small-btn" style="margin-top: 12px;" onclick="orderSpecificArt('${item.title.replace(/'/g, "\\'")}')">
                        🛒 Add Print of "${item.title}" ($15)
                    </button>
                `;
            });

            grid.appendChild(card);
        });

        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.onclick = () => modal.style.display = "none";
        }

        window.addEventListener('click', (event) => {
            if (event.target === modal) modal.style.display = "none";
        });

    } catch (error) {
        console.error("Error loading gallery:", error);
        const grid = document.getElementById('portfolio-grid');
        if (grid) grid.innerHTML = "<p>Failed to load gallery items.</p>";
    }
}

loadGallery();

// --- 2. VIVIDCART BAG SYNC (LOCALSTORAGE) ---
function getVividCart() {
    return JSON.parse(localStorage.getItem('vividCart')) || [];
}

function saveVividCart(cart) {
    localStorage.setItem('vividCart', JSON.stringify(cart));
    renderPortfolioCart();
}

function renderPortfolioCart() {
    const cart = getVividCart();
    const cartList = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const totalEl = document.getElementById('cart-total');

    if (!cartList || !badge || !totalEl) return;

    badge.innerText = cart.length;
    badge.style.display = cart.length > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="empty-cart">Your studio bag is empty.</p>';
        totalEl.innerText = '$0.00';
        return;
    }

    let total = 0;
    cartList.innerHTML = '';
    cart.forEach((item, index) => {
        total += Number(item.price);
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <span>${item.title} ($${Number(item.price).toFixed(2)})</span>
            <button type="button" class="remove-item" onclick="removePortfolioItem(${index})">&times;</button>
        `;
        cartList.appendChild(row);
    });

    totalEl.innerText = `$${total.toFixed(2)}`;
}

window.removePortfolioItem = function(index) {
    const cart = getVividCart();
    cart.splice(index, 1);
    saveVividCart(cart);
};

window.orderSpecificArt = function(title) {
    document.getElementById('image-modal').style.display = "none";
    const cart = getVividCart();
    cart.push({ title: `Print: ${title}`, price: 15, description: "Gallery Print" });
    saveVividCart(cart);
    const checkoutWin = document.getElementById('checkout-window');
    if (checkoutWin) checkoutWin.classList.add('active');
};

const addItemBtn = document.getElementById('add-item-btn');
if (addItemBtn) {
    addItemBtn.onclick = () => {
        const selector = document.getElementById('item-selector');
        const [name, price] = selector.value.split('|');
        const cart = getVividCart();
        cart.push({ title: `Commission: ${name}`, price: parseFloat(price), description: "Ordered from Portfolio" });
        saveVividCart(cart);
    };
}

renderPortfolioCart();
