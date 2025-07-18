let slider_main = new Swiper('.mainscreen__swiper', {  
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
    loop: true,
    autoplay: true,
    // Dots
    pagination: {
        el: '.swiper-main__dots',
        clickable: true,
    },
    //arrows
    navigation: {
        nextEl: '.swiper-main__next',
        prevEl: '.swiper-main__prev',
    },
 /*    
    breakpoints: {
        320: {
            slidesPerView: 1,
            spaceBetween: 0,
            autoHeight: true,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        992: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
        1268: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
    }, */

});


