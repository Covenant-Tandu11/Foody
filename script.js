document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // HAMBURGER MENU
    // ============================================
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle('mobile-menu-active');
            hamburger.classList.toggle('active');
            hamburger.innerHTML = mobileMenu.classList.contains('mobile-menu-active') 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
        });
    }
    
    // ============================================
    // GENERATE FOOD CARDS
    // ============================================
    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const products = await response.json();
            console.log('✅ Products loaded:', products);
            renderProducts(products);
        } catch (error) {
            console.error('❌ Error loading products:', error);
        }
    }
    
    function renderProducts(products) {
        const cardList = document.querySelector('.card-list');
        cardList.innerHTML = '';
        
        products.forEach(product => {
            const cardHTML = `
                <div class="order-card" data-category="${product.category}" data-id="${product.id}">
                    <div class="card-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <h4>${product.name}</h4>
                    <h4 class="price">${product.price}</h4>
                    <a href="#" class="btn add-to-cart">
                        <i class="fa-solid fa-cart-shopping"></i>
                    </a>
                </div>
            `;
            cardList.insertAdjacentHTML('beforeend', cardHTML);
        });
    }
    
    loadProducts();
});

/// ============================================
//CATEGORY FILTERING
// ============================================
const categoryButtons = document.querySelectorAll('.category');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.getAttribute('data-category');
        filterProducts(category);
    });
});


function filterProducts(category) {
    const cards = document.querySelectorAll('.order-card');
    
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
};

const cartIcon = document.getElementById('cartIcon');
const cartTab = document.getElementById('cartTab');
const closeBtn = document.getElementById('closeCart');

if (cartIcon && cartTab) {
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartTab.classList.add('cart-tab-active');
        console.log('🛒 Cart opened!');
    });

    if(closeBtn){
        closeBtn.addEventListener('click', () => {
            cartTab.classList.remove('cart-tab-active');
            console.log('❌ Cart closed!');
        })
    }

     document.addEventListener('click', (event) => {
        // Check if click is OUTSIDE cart AND cart is open
        if (cartTab.classList.contains('cart-tab-active') && 
            !cartTab.contains(event.target) && 
            !cartIcon.contains(event.target)) {
            
            cartTab.classList.remove('cart-tab-active');
            console.log('👆 Cart closed by clicking outside');
        }
    });
}

