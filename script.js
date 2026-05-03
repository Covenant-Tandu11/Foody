// ============================================
// HAMBURGER MENU TOGGLE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if(hamburger && mobileMenu){
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();

            mobileMenu.classList.toggle('mobile-menu-active');
            hamburger.classList.toggle('active');

            if(mobileMenu.classList.contains('mobile-menu-active')){
                hamburger.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            }else{
                hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>'
            }
        });

        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('mobile-menu-active');
                hamburger.classList.remove('active');
                hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    };
})