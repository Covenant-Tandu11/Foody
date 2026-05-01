const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');

cartIcon.addEventListener('click', ()=>cartTab.classList.add('cart-tab-active'));
closeBtn.addEventListener('click', ()=> cartTab.classList.remove('cart-tab-active'));

let productList = [];

const showCards = () =>{

    productList.forEach(product =>{

        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
    <div class="card-image">
        <img src="${product.image}" alt="${product.name}">
    </div>
    <h4>${product.name}</h4>
    <h4 class="price">${product.price}</h4>
    <a href="#" class="btn card-btn">
        <i class="fa-solid fa-cart-shopping"></i>
    </a>
`;
        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector('.card-btn');
        cardBtn.addEventListener('click', (e)=>{
            e.preventDefault();
            addToCart();
        });
    });
}

const addToCart = () =>{
    const cartItem = document.createElement('div');
    cartItem.classList.add('item');

    cartItem 

}

const initApp = () => {

    fetch('products.json').then
    (response => response.json()).then
    (data =>{
        productList = data;
        showCards();
    })
}

initApp();