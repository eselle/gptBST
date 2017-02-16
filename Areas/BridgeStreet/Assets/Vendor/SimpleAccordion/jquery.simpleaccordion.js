/*
* Simple Accordion Copyright (c) 2016 Daniel Nedelcu
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

var SimpleAccordion = {

	EVENT_CLICK: "click",

	defaults:{},
    
    VERSION: '1.0.0',

    AUTHOR: 'Daniel Nedelcu'
};

(function($){

	$.fn.SimpleAccordion = function( options ) {

		return this.each( function() {		

			 var _options = $.extend({}, $.fn.SimpleAccordion.defaults, options);

			 var _element = jQuery(this);

			 var _listContainer = _element.find('ul');

			 var _initialHeight = _listContainer.attr('data-line-value');


			 var maxHeight = function(elems){

			    return Math.max.apply(null, elems.map(function ()
			    {

			        return $(this).outerHeight(true);

			    }).get());

			};				 

			 var _listHeight = maxHeight(_listContainer.find('.p-ammeneties-item')) || 40;

			 var _finalHeight = _initialHeight * _listHeight;

			 var _totalItems = 0;

			 var toggle = 0;

			 var _methods = {

			 	initialize : function() {

		            var anchor = _listContainer.find('.p-ammeneties-item');

		            _totalItems = anchor.length;

		            [].forEach.call(anchor, function(anchor, index) {

		               	anchor.style.height = _listHeight + "px";

		            }); 

			 		_element.find('.accordion-toggle').on(SimpleAccordion.EVENT_CLICK, _methods.onClick);

			 		jQuery(window).on("resize", this.onResize);

			 		jQuery(window).trigger("resize");

			 	},

			 	onClick : function(e) {

			 		e.preventDefault();

			 		if( toggle === 0 ) {

			 			_methods.setHeight("auto");

			 			jQuery(this).addClass("collapsed");
			 		}

			 		if( toggle === 1 ) {

			 			_methods.setHeight(_finalHeight + "px");

			 			jQuery(this).removeClass("collapsed");

			 		}

		   			toggle = (toggle == 0 ? 1 : 0);

			 	},

			 	setHeight : function (height) {

					_listContainer.css('height', height);

			 	},		 	

			 	onResize : function () {

			 		if(window.innerWidth < 768) {

			 			if(_totalItems < 2) {

			 				_element.find('.accordion-toggle').css('display', 'none')

			 			} else {
							
							_element.find('.accordion-toggle').css('display', 'block')

			 			}

			 		} else if (window.innerWidth > 768 && window.innerWidth < 992){

			 			if(_totalItems < 4) {

			 				_element.find('.accordion-toggle').css('display', 'none')

			 			} else {

			 				_element.find('.accordion-toggle').css('display', 'block')

			 			}
			 		} else if (window.innerWidth > 991) {

			 			if(_totalItems < 5) {

			 				_element.find('.accordion-toggle').css('display', 'none')

			 			} else {

			 				_element.find('.accordion-toggle').css('display', 'block')

			 			}

			 		}
			 	}			
	     		 	
			 };

			 _methods.setHeight(_finalHeight + "px");

	        _methods.initialize();

        });
	}

	$.fn.SimpleAccordion.defaults = SimpleAccordion.defaults;

}(jQuery));