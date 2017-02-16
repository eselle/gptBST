(function () {

    var factory = (function() {

        return  {

    		incrementGuest : function(currentValue, index) {

    			var scope = this;

    			var _currentTotal = 0;

    	        _.each(jQuery('.spinner-incredment input'), function(a, b) {

    	        	_currentTotal += (Number( jQuery(a).val() )) ;

    	        });			

                return _currentTotal;
    		}

        }

    })();

    module.exports = factory || window.factory;

})();
