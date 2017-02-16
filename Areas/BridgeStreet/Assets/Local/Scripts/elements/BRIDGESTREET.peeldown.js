(function () {
    var $window = $(window);
    var peeldown = {

        init : function () {

            if ($('.pull-down').length == 0) return;
            
            $window.on('resize', this._onResize);

            $window.trigger('resize');
            
        },

        _onResize : function () {

            var v = 0;

            var currentHeight = jQuery('.pull-down-wrapper').outerHeight();

            jQuery('.pull-down-button').add('.close-btn').on("click", function() {

                currentHeight = jQuery('.pull-down-wrapper').outerHeight();

                v = (v == 0 ? 1 : 0);

                if( v === 0 ) jQuery('.p-d-container').css("margin-top", -currentHeight + 'px');
                
                if( v === 1 ) jQuery('.p-d-container').css("margin-top", "0");
      
            })

            jQuery('.p-d-container').css("margin-top", -currentHeight + 'px');

        }

    }

    module.exports = peeldown || window.peeldown;

})();

