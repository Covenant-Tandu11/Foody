document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // 🌍 GLOBAL VARIABLES
    // ============================================
    let products = [];  // Store all products from JSON
    let cart = [];      // Store cart items
    
    // Select cart elements (used in multiple steps)
    const cartTab = document.getElementById('cartTab');
    const cartIcon = document.querySelector('.cart-icon');
    const closeBtn = document.querySelector('.close-btn');
    
    // ============================================
    // HAMBURGER MENU TOGGLE
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
        
        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('mobile-menu-active');
                hamburger.classList.remove('active');
                hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }
    
    // ============================================
    // GENERATE FOOD CARDS FROM JSON
    // ============================================
    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            products = await response.json(); // Store in global variable
            console.log('✅ Products loaded:', products);
            renderProducts(products);
        } catch (error) {
            console.error('❌ Error loading products:', error);
        }
    }
    
    function renderProducts(products) {
        const cardList = document.querySelector('.card-list');
        if (!cardList) return;
        
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
        
        console.log('✅ Products rendered to page');
    }
    
    // ============================================
    // CATEGORY FILTERING
    // ============================================
    const categoryButtons = document.querySelectorAll('.category');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all, add to clicked
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
        
        console.log(`✅ Filtered by category: ${category}`);
    }
    
    // ============================================
    //  OPEN/CLOSE CART TAB
    // ============================================
    if (cartIcon && cartTab) {
        // Open cart
        cartIcon.addEventListener('click', (event) => {
            event.preventDefault();
            cartTab.classList.add('cart-tab-active');
            console.log('🛒 Cart opened!');
        });
        
        // Close cart with close button
        if (closeBtn) {
            closeBtn.addEventListener('click', (event) => {
                event.preventDefault();
                cartTab.classList.remove('cart-tab-active');
                console.log('❌ Cart closed!');
            });
        }
        
        // Close cart when clicking outside
        document.addEventListener('click', (event) => {
            if (cartTab.classList.contains('cart-tab-active') && 
                !cartTab.contains(event.target) && 
                !cartIcon.contains(event.target)) {
                
                cartTab.classList.remove('cart-tab-active');
                console.log('👆 Cart closed by clicking outside');
            }
        });
    }
    
    // ============================================
    // ADD TO CART FUNCTIONALITY
    // ============================================
    
    // Load cart from localStorage
    function loadCartFromStorage() {
        const savedCart = localStorage.getItem('foodyCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartCount();
            console.log('📦 Cart loaded from storage:', cart);
        }
    }
    
    // Save cart to localStorage
    function saveCartToStorage() {
        localStorage.setItem('foodyCart', JSON.stringify(cart));
        console.log('💾 Cart saved to storage');
    }
    
    // Update cart count badge
    function updateCartCount() {
        const cartValue = document.querySelector('.cart-value');
        if (cartValue) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartValue.textContent = totalItems;
        }
    }
    
    // Add item to cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            console.error('❌ Product not found:', productId);
            return;
        }
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            console.log(`➕ Increased quantity: ${product.name}`);
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
            console.log(`🛒 Added to cart: ${product.name}`);
        }
        
        saveCartToStorage();
        updateCartCount();
        renderCartItems();
        
        // Auto-open cart to show user
        if (cartTab) {
            cartTab.classList.add('cart-tab-active');
        }
    }
    
    // Render cart items in cart tab
    function renderCartItems() {
        const cartList = document.querySelector('.cart-list');
        if (!cartList) return;
        
        cartList.innerHTML = '';
        
        // Empty cart message
        if (cart.length === 0) {
            cartList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #808080;">
                    <i class="fa-solid fa-cart-arrow-down" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }
        
        // Build all cart items HTML
        let cartItemsHTML = '';
        
        cart.forEach(item => {
            const itemTotal = calculateItemTotal(item);
            
            cartItemsHTML += `
                <div class="item" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div>
                        <h4>${item.name}</h4>
                        <h4 class="item-total">${itemTotal}</h4>
                    </div>
                    <div class="quantity-items">
                        <a href="#" class="quantity decrease-qty">
                            <i class="fa-solid fa-minus"></i>
                        </a>
                        <h4 class="quantity-value">${item.quantity}</h4>
                        <a href="#" class="quantity increase-qty">
                            <i class="fa-solid fa-plus"></i>
                        </a>
                    </div>
                </div>
            `;
        });
        
        // Insert all items at once
        cartList.insertAdjacentHTML('beforeend', cartItemsHTML);
        
        updateCartTotal();
        console.log('🛒 Cart items rendered');
    }
    
    // Calculate item total (price × quantity)
    function calculateItemTotal(item) {
        const price = parseFloat(item.price.replace('$', ''));
        const total = price * item.quantity;
        return `$${total.toFixed(2)}`;
    }
    
    // Update cart total
    function updateCartTotal() {
        const cartTotal = document.querySelector('.cart-total');
        if (!cartTotal) return;
        
        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return sum + (price * item.quantity);
        }, 0);
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Handle quantity +/- buttons
    function handleQuantityChange(event) {
        event.preventDefault();
        
        const quantityBtn = event.target.closest('.quantity');
        if (!quantityBtn) return;
        
        const itemElement = quantityBtn.closest('.item');
        const productId = parseInt(itemElement.getAttribute('data-id'));
        
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;
        
        if (quantityBtn.classList.contains('increase-qty')) {
            cartItem.quantity += 1;
        } else if (quantityBtn.classList.contains('decrease-qty')) {
            cartItem.quantity -= 1;
            
            // Remove item if quantity reaches 0
            if (cartItem.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        }
        
        saveCartToStorage();
        updateCartCount();
        renderCartItems();
    }
    
    // Event delegation: Handle add-to-cart and quantity clicks
    document.addEventListener('click', (event) => {
        // Add to cart button
        const addToCartBtn = event.target.closest('.add-to-cart');
        if (addToCartBtn) {
            event.preventDefault();
            const card = addToCartBtn.closest('.order-card');
            const productId = parseInt(card.getAttribute('data-id'));
            addToCart(productId);
        }
        
        // Quantity buttons
        const quantityBtn = event.target.closest('.quantity');
        if (quantityBtn) {
            handleQuantityChange(event);
        }
    });
    
    // ============================================
    // 🚀 INITIALIZE: Load products and cart
    // ============================================
    loadProducts();           // Load food cards from JSON
    loadCartFromStorage();    // Load saved cart
    renderCartItems();        // Render cart items

    // ============================================
// TESTIMONIAL SLIDER
// ============================================


const reviewCards = document.querySelectorAll('.review-card');
const prevBtn = document.querySelector('.arrow.prev');
const nextBtn = document.querySelector('.arrow.next');
const testimonialContainer = document.querySelector('.testimonial-right');

//TRACK current slide index
let currentSlide = 0;
let slideInterval;

//  Show a specific slide by index
    function showSlide(index) {
        // Handle wrap-around (loop back to start/end)
        if (index >= reviewCards.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = reviewCards.length - 1;
        } else {
            currentSlide = index;
        }
        
        // Hide all cards, show only current
        reviewCards.forEach((card, i) => {
            if (i === currentSlide) {
                card.classList.add('current');
            } else {
                card.classList.remove('current');
            }
        });
        
        console.log(`⭐ Showing testimonial ${currentSlide + 1} of ${reviewCards.length}`);
    }

    //  Go to next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
        resetInterval(); // Reset auto-advance timer
    }

    // Go to previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
        resetInterval(); // Reset auto-advance timer
    }

    //  Start auto-advance (every 5 seconds)
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 5000ms = 5 seconds
    }

    //  Reset auto-advance timer
    function resetInterval() {
        clearInterval(slideInterval);
        startAutoSlide();
    }

    //Pause auto-advance (when user hovers)
    function pauseAutoSlide() {
        clearInterval(slideInterval);
    }

    // 9️⃣ ADD event listeners to buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
        });
    }

    // 🔟 PAUSE on hover, RESUME when mouse leaves
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', pauseAutoSlide);
        testimonialContainer.addEventListener('mouseleave', startAutoSlide);
    }

    // 🅰️ INITIALIZE: Show first slide and start auto-advance
    if (reviewCards.length > 0) {
        showSlide(0);      // Show first testimonial
        startAutoSlide();  // Start auto-advance
        console.log('⭐ Testimonial slider initialized!');
    }

    
});