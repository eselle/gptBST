(function () {

    var accorodion = {

        init : function () {

        	if (DOMUtils.isUndefined(document.getElementsByClassName('p-accordion')[0])) return;
			
     			var accToggleBtn = jQuery('.accordion-toggle');

     			var accItems = jQuery('.p-accordion');

     			jQuery('.p-accordion').SimpleAccordion();
   			
        }

    }

    module.exports = accorodion || window.accorodion;

})();
