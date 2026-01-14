// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Add to cart function
function addToCart(id, title, price, img) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            title: title,
            price: price,
            img: img,
            quantity: 1
        });
    }
    
    saveCart(cart);
    updateCartCount();
    alert(`${title} ajouté au panier!`);
}

// Remove from cart
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    updateCartCount();
    displayCart();
}

// Display cart (for panier.html)
function displayCart() {
    const cart = getCart();
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (!cartItemsDiv) return;
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart"><h3>Votre panier est vide</h3><p><a href="index.html">Retourner aux produits</a></p></div>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItemsDiv.innerHTML = `
        ${cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.img}" alt="${item.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>Quantité: ${item.quantity} × ${item.price} DH</p>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <strong>${item.price * item.quantity} DH</strong>
                    <br>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Retirer</button>
                </div>
            </div>
        `).join('')}
        <div class="cart-total">Total: ${total} DH</div>
    `;
}

// Handle checkout form
function handleCheckout(e) {
    e.preventDefault();
    
    const name = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let message = `🛍️ *Nouvelle Commande DNparfums*%0A%0A`;
    message += `👤 *Client:* ${name}%0A`;
    message += `📞 *Téléphone:* ${phone}%0A`;
    if (email) message += `📧 *Email:* ${email}%0A`;
    message += `📍 *Adresse:* ${address}, ${city}%0A%0A`;
    message += `🎁 *Produits:*%0A`;
    
    cart.forEach(item => {
        message += `• ${item.title} × ${item.quantity} = ${item.price * item.quantity} DH%0A`;
    });
    
    message += `%0A💰 *Total: ${total} DH*`;
    
    const whatsappUrl = `https://wa.me/212680458194?text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart
    localStorage.removeItem('cart');
    updateCartCount();
    alert('Commande envoyée! Vous allez être redirigé vers WhatsApp.');
    e.target.reset();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // If on panier.html, display cart
    if (document.getElementById('cartItems')) {
        displayCart();
        
        // Add form submit handler
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckout);
        }
    }
});