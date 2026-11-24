// --- 1. GUIDE LABELS & BUBBLE LAUNCHERS ---
function dismissGuides() {
    document.querySelectorAll('.guide-label').forEach(label => {
        label.classList.add('guide-hidden');
    });
}

document.querySelectorAll('.guide-label').forEach(label => {
    label.addEventListener('click', dismissGuides);
});

window.addEventListener('mousedown', (e) => {
    if (!e.target.closest('.guide-label')) dismissGuides();
});

const inquiryLauncher = document.getElementById('inquiry-launcher');
const commissionLauncher = document.getElementById('commission-launcher');
const checkoutLauncher = document.getElementById('checkout-launcher');

const inquiryWin = document.getElementById('inquiry-window');
const commissionWin = document.getElementById('commission-window');
const checkoutWin = document.getElementById('checkout-window');

function closeAllPopups(exceptWin) {
    [inquiryWin, commissionWin, checkoutWin].forEach(win => {
        if (win && win !== exceptWin) win.classList.remove('active');
    });
}

if (inquiryLauncher && inquiryWin) {
    inquiryLauncher.onclick = () => {
        dismissGuides();
        closeAllPopups(inquiryWin);
        inquiryWin.classList.toggle('active');
    };
}

if (commissionLauncher && commissionWin) {
    commissionLauncher.onclick = () => {
        dismissGuides();
        closeAllPopups(commissionWin);
        commissionWin.classList.toggle('active');
    };
}

if (checkoutLauncher && checkoutWin) {
    checkoutLauncher.onclick = () => {
        dismissGuides();
        closeAllPopups(checkoutWin);
        checkoutWin.classList.toggle('active');
    };
}

const closeInquiry = document.getElementById('close-inquiry');
const closeCommission = document.getElementById('close-commission');
const closeCheckout = document.getElementById('close-checkout');

if (closeInquiry && inquiryWin) closeInquiry.onclick = () => inquiryWin.classList.remove('active');
if (closeCommission && commissionWin) closeCommission.onclick = () => commissionWin.classList.remove('active');
if (closeCheckout && checkoutWin) closeCheckout.onclick = () => checkoutWin.classList.remove('active');

// --- 2. ARTIST INQUIRY FORM ---
const inquiryForm = document.getElementById('inquiry-form');
if (inquiryForm) {
    inquiryForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = document.getElementById('crow-btn');
        btn.innerText = "Sending...";
        try {
            const response = await fetch(e.target.action, {
                method: 'POST',
                body: new FormData(e.target),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                document.getElementById('inquiry-content').innerHTML = "<h3 style='text-align:center; font-family:Cinzel;'>The Crow has flown!</h3>";
                setTimeout(() => inquiryWin.classList.remove('active'), 2500);
            } else {
                btn.innerText = "Error - Try Again";
            }
        } catch (err) {
            btn.innerText = "Send Crow";
            alert("Could not send inquiry. Please check your connection.");
        }
    };
}

// --- 3. COMMISSION TO VIVIDCART (VIVIDSTROKES.HTML) ---
const addToBagBtn = document.getElementById('add-to-bag-btn');
if (addToBagBtn) {
    addToBagBtn.onclick = () => {
        const select = document.getElementById('com-type');
        const type = select.value;
        const price = parseFloat(select.options[select.selectedIndex].getAttribute('data-price'));
        const desc = document.getElementById('com-desc').value.trim();

        if (!desc) return alert("Please describe your vision.");

        let cart = JSON.parse(localStorage.getItem('vividCart')) || [];
        cart.push({
            title: `Commission: ${type}`,
            price: price,
            description: desc
        });
        localStorage.setItem('vividCart', JSON.stringify(cart));

        document.getElementById('commission-content').innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h3 style="font-family:Cinzel;">Manifested!</h3>
                <p>$${price.toFixed(2)} added to Bag.</p>
            </div>`;
        setTimeout(() => window.location.href = 'checkout.html', 1500);
    };
}

// --- 4. WATERCOLOR CANVAS BACKGROUND ANIMATION ---
const canvas = document.getElementById('watercolor-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let points = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        points.push({
            x: e.clientX,
            y: e.clientY,
            size: 20,
            opacity: 0.35,
            color: '147, 51, 234'
        });
    });

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        points.forEach((p) => {
            ctx.beginPath();
            let grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
            grad.addColorStop(0, `rgba(${p.color}, ${p.opacity})`);
            grad.addColorStop(1, 'rgba(5, 5, 5, 0)');
            ctx.fillStyle = grad;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.opacity -= 0.003;
            p.size += 0.45;
        });

        points = points.filter(p => p.opacity > 0);
        requestAnimationFrame(draw);
    }

    draw();
}
