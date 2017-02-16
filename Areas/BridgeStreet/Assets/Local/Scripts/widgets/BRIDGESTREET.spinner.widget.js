(function () {

    var SpinnerWidget = {

    	_currentTotal : null,

        init : function () {

            /*
             *  Initializes jQuery UI Spinner
            */

            if (DOMUtils.isUndefined(document.getElementsByClassName('spinner')[0])) return;

            var spinner = jQuery('.trip-detail-spinner').spinner({ 

                min: 0, 

                max: 20,

                step: 1,

                alignment: 'horizontal',

                icons: {
                       
                  left: "fa fa-minus",   
                      
                  right: "fa fa-plus"

                }              

            })

            .parent()

            .find('.ui-spinner-up')

            .find('span')

            .empty()

            .end()

            .parent()

            .find('.ui-spinner-down')

            .find('span')

            .empty()                  

		}

    }

    module.exports = SpinnerWidget || window.SpinnerWidget;

})();
