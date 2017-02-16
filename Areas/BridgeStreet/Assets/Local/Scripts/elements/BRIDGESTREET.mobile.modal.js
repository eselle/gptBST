(function () {
    var $window = $(window);
    var mobilemodal = {

        init : function () {

            if ($('.remodal').length == 0) return;     

            /*
             *  Setting REMODAL modal/mobile search settings
            */  

            window.REMODAL_GLOBALS = {

              NAMESPACE: 'modal',

              DEFAULTS: {

                hashTracking: false

              }

            };

            var inst = jQuery('[data-remodal-id=modal]').remodal();


            jQuery('#MobileSearch').on("click", function() {

                inst.open();

            })    

            /*
             *  Handle modal close when in tablet+ mode
            */  

            $window.on('resize', DOMUtils.throttle(500, function () {

                if ($window.width() > 768) {

	                if (jQuery('body').hasClass('remodal-is-opened')) {

	                    inst.close();
	                }
	            }
                

            }))

            $window.trigger('resize');                         

        }           
    }

    module.exports = mobilemodal || window.mobilemodal;

})();

