(function () {
    var $window = $(window);

    var searchlisting = {

        searchListing: null,

        init: function () {

            if (DOMUtils.isUndefined(document.getElementsByClassName('split-pane')[0])) return;

            // Initializesplit pane component

            this.getFiltersHeight();

            this.contentHeight = 0;

            this.contentHeight = window.innerHeight - this.getFiltersHeight();

            jQuery('.results-list-map').height(this.contentHeight);

            this.searchListing = jQuery('.results-list-map');

            this.initListeners();

            this.oldState = null;

            this.wasMobile = false;

        },

        getFiltersHeight: function () {

            this.contentHeight = 0;

            this.desktopSearthHeight = jQuery('.desktop-search').outerHeight();

            this.resultsFilterHeight = jQuery('.results-filter').outerHeight();

            this.stateSliderHeight = jQuery('.state-slider-container').outerHeight();

            this.offsetHeight = this.desktopSearthHeight + this.stateSliderHeight + this.resultsFilterHeight;

            return this.offsetHeight;

        },


        getFiltersHeightMobile: function () {

            this.contentHeight = 0;

            this.headerHeight = jQuery('header').outerHeight();

            this.desktopSearthHeight = jQuery('.desktop-search').outerHeight();

            this.stateSliderHeight = jQuery('.state-slider-container').outerHeight();

            this.offsetHeight = this.headerHeight + this.desktopSearthHeight + this.stateSliderHeight + this.resultsFilterHeight;

            return this.offsetHeight;

        },


        initListeners: function () {

			var myElement = document.getElementById('left-component');

            $window.on('resize', {self:this}, this.resizeBrowser);

        },

        resizeBrowser: function (event) {

            if (!DOMUtils.isUndefined(event.data)) {

                var self = event.data.self;

                self.contentHeight = window.innerHeight - self.getFiltersHeight();

                if (!DOMUtils.is_mobile()) {

	            	jQuery('body').css('overflow', 'hidden');

                    jQuery('.results-list-map').height(self.contentHeight);

                    jQuery('.collapse-panel-wrapper').outerHeight(self.contentHeight - self.stateSliderHeight);

                    jQuery('.collapse-panel-wrapper').css('overflow-y', 'scroll');


                    if( window.innerWidth > 768 && window.innerWidth < 992) {

                        // var slider = jQuery('.price-range-slider');
                        //
                        // slider.css('width', '50%');

                    }

                    if( window.innerWidth > 991) {
                        //
                        // var screenWidth = window.innerWidth;
                        //
                        // var sizeWidth = jQuery('.size-section').outerWidth();
                        //
                        // var viewWidth = jQuery('.view-section').outerWidth();
                        //
                        // var slider = jQuery('.price-range-slider');
                        //
                        // var totalWidth = sizeWidth + viewWidth;
                        //
                        // slider.css('width', (screenWidth - totalWidth) - 1);
                    }

                } else {

                    jQuery('.collapse-panel-wrapper').css('height', 'auto');

                    jQuery('.collapse-panel-wrapper').css('overflow-y', 'hidden');

                    jQuery('body').css('overflow', 'auto');

                    // var slider = jQuery('.price-range-slider');
                    //
                    // slider.css('width', '100%');

	            }

            }

        }
    };

    module.exports = searchlisting || window.searchlisting;

})();

