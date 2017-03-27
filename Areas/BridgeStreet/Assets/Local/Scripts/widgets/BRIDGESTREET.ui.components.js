var BSsplitscreen = require('../elements/BRIDGESTREET.split.screen.js');
(function ($window) {

    var uiComponents = {

        init: function () {

        },

        initSticky: function () {

        	if (DOMUtils.is_mobile()) {

				jQuery('#MobileSearch').stickUp();

                if (!DOMUtils.isNull(document.getElementById('Sticky'))) {

					jQuery("[data-sticky_column]").trigger("sticky_kit:detach");

				}

			} else {

				if (!DOMUtils.isUndefined(document.getElementsByClassName('sticky-header')[0])) {
		
					jQuery('.sticky-header').stick_in_parent({
                        bottoming: false
					});

				}

			}
        },

        initRangeSliderComponent: function (filter) {

        	if (DOMUtils.isNull(document.getElementById('RangeSlider'))) return false;
				
				var rSlider = document.getElementById('RangeSlider');

	            var price = filter.model.attributes.Price;

	            if (price == null || price.Max == price.Min)

	                price = { Min: 0, Max: 1000, RangeMax: 1000 };

           		if (DOMUtils.isUndefined(rSlider.noUiSlider)) {

					noUiSlider.create(rSlider, {

                    	start: [price.Min, price.Max],

							connect: true,

							tooltips: true,

							range: {

		                        'min': Math.floor(0),

		                        'max': Math.floor(price.RangeMax)

							},

							format: wNumb({

								decimals: 0,

								mark: '.',

								thousand: ',',

								prefix: ''

							})

						});

	                rSlider.noUiSlider.on('end', function (values, handle) {
	                    filter.applyFilter(this);
	                });

				}

				jQuery('.selectpicker').selectpicker();
					
        },

        iniSearchPageStateSliderComponent: function () {

        	if (DOMUtils.isNull(document.getElementById('StateSlider'))) return false;

	        	window.stateSlider = document.getElementById('StateSlider');

				noUiSlider.create(stateSlider, {

					start: 50,

					connect: 'lower',

					animate: false,

					step: 50,

					cssPrefix: 'noUiState-',

					range: {

						'min': 0,

						'max': 100

					},

					format: wNumb({

						decimals: 0

					})					

				});  

            stateSlider.noUiSlider.on('change', function (values) {

            	jQuery(".PropertyPodSearchMapview").html("");
           	
                switch (Math.round(values)) {
                    case 0:

							window.currentSplitState = "left";

							jQuery('#grid').removeClass("split-view").addClass('list-view');

							BSsplitscreen.setState(0, BSsplitscreen.setListView);

							break;

                    case 50:

							window.currentSplitState = "center";

							jQuery('#grid').removeClass("list-view").addClass('split-view');

							BSsplitscreen.setState(1, BSsplitscreen.setSplitView);

							break;

                    case 100:

							window.currentSplitState = "right";

							BSsplitscreen.setState(2, BSsplitscreen.setMapView);
							

							break;							
					}
				});				

        },

        getFiltersHeight: function () {

			this.contentHeight = 0;

        	this.desktopSearthHeight = jQuery('.desktop-search').outerHeight();
        	
        	this.resultsFilterHeight = jQuery('.results-filter').outerHeight();	
        	       	
        	this.offsetHeight =  this.desktopSearthHeight + this.resultsFilterHeight;

        	return this.offsetHeight;			

        },        

        initSearchPageUIComponents: function () {
        	
        	var self = this;

			if (DOMUtils.isUndefined(document.getElementsByClassName('results-filter')[0])) return false;
			
				jQuery('.cancel-btn').on("click", function () {

					jQuery('.collapse-panel').collapse('hide');

				})				

				jQuery('#CollapseExample').on('hidden.bs.collapse', function () {
					
					jQuery('.results-list-map-wrapper').css('visibility', 'visible');
					
					jQuery('.results-list-map-wrapper').css('overflow', 'visible');

					jQuery('.pane-slider').show();
					
				})

				jQuery('#CollapseExample').on('shown.bs.collapse', function () {
					
					jQuery('.results-list-map-wrapper').css('visibility', 'hidden');
					
					jQuery('.results-list-map-wrapper').css('overflow', 'hidden');

					if (!DOMUtils.is_mobile()) {

						jQuery('.pane-slider').hide();

		            	self.contentHeight = window.innerHeight - self.getFiltersHeight();

		            	jQuery('.results-list-map').height(self.contentHeight); 


		            	jQuery('.collapse-panel-wrapper').outerHeight(self.contentHeight);
								
					}
				})				

				var toggle = 0;

            jQuery('.filters-edit-btn').on('click', function () {

					toggle = (toggle == 0 ? 1 : 0);

                if (toggle == 0) {

						jQuery('#top-filter').removeClass('active');

					} else {

						jQuery('#top-filter').addClass('active');

					}

            })

            if (!DOMUtils.isUndefined(document.getElementsByClassName('p-accordion')[0])) {
                var accToggleBtn = jQuery('.accordion-toggle');

                var accItems = jQuery('.p-accordion');

                jQuery('.p-accordion').SimpleAccordion();
            }

            

        },

        initSVGAnimation: function () {

        	if (DOMUtils.isUndefined(document.getElementsByClassName('img-svg')[0])) return false;

			var trigger = new ScrollTrigger({

			      toggle: {

			        visible: 'visibleClass',

			        hidden: 'hiddenClass'

			      },

			      once: true

			    }, document.body, window);


			var watchSVG,
			    bedSVG,
			    deviceSVG,
                bathtubSVG,
			    svgArray = [];

			var intervalSVG;

			this.intervalIndex = 0;

			this.atEnd = false;

            var callback = function (scrollLeft, scrollTop, width, height) {
                watchSVG = new Vivus('svg-animate-stopwatch', { start: "manual", duration: 60 });
                bedSVG = new Vivus('svg-animate-bed', { start: "manual", duration: 60 });
                deviceSVG = new Vivus('svg-animate-device', { start: "manual", duration: 60 });
                bathtubSVG = new Vivus('svg-animate-bathtub', { start: "manual", duration: 60 });

				svgArray.push(watchSVG, bedSVG, deviceSVG, bathtubSVG);

				intervalSVG = setInterval(fadeInSVG, 500);
				trigger.detach(callback);
			};

			trigger.attach(callback);

			function fadeInSVG(index) {

				var num = uiComponents.isAtEnd();

                if (DOMUtils.isNumber(num)) {

                    if (num - 1 < svgArray.length) {

						svgArray[num - 1].stop().reset().play();

					} else {

						uiComponents.atEnd = true;

						clearInterval(intervalSVG);
					}
				}

			}

        },

        isAtEnd: function () {
			
            return this.atEnd ? this.intervalIndex = 0 : ++this.intervalIndex;
		
		},        

        initViewportAnimations: function () {

			var trigger = new ScrollTrigger({

			      toggle: {

			        visible: 'visibleClass',

			        hidden: 'hiddenClass'

			      },

			      offet: {

			        x: 0,

			        y: 20

			      },

			      addHeight: true,

			      once: true

			    }, document.body, window);

            var callback = function (scrollLeft, scrollTop, width, height) {

			    trigger.detach(callback);
			  };


			trigger.attach(callback);

		}

    }

    module.exports = uiComponents || window.uiComponents;

})();

