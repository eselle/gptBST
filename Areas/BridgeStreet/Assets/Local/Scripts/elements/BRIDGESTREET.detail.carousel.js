(function () {

    var propertyDetailCarousel = {

        init: function () {

            if (DOMUtils.isUndefined(document.getElementsByClassName('product-detail-carousel')[0])) return;


            var mySwiper = new Swiper('.c-horizontal', {

                direction: 'horizontal',

                slidesPerView: "auto",

                autoHeight: true,

                centeredSlides: true,

                spaceBetween: 1,

                loop: true,

                speed: 500,

                initialSlide: 0,

                slideToClickedSlide: false,

                nextButton: '.c-next',

                prevButton: '.c-prev',

                onInit : function (e) {

                    window.setTimeout(function() {

                        console.log('resizing swiper after 500ms');
                        
                        e.onResize();

                    }, 300);

                }

            });

        }

    }

    module.exports = propertyDetailCarousel || window.propertyDetailCarousel;

})();