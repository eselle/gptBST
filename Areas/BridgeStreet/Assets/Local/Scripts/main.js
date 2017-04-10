"use strict"

window.Utils = window.Utils || {};
var $window = $(window);
var BridgeStreet = {};
window.currentSplitState = "center";

var DOMUtils = require('./utils/DOMUtils');
var BSuicomponents = require('./widgets/BRIDGESTREET.ui.components.js');
var BSspinnerwidget = require('./widgets/BRIDGESTREET.spinner.widget');
var BSnavigation = require('./elements/BRIDGESTREET.navigation.js');
var BSpeeldown = require('./elements/BRIDGESTREET.peeldown.js');
var BShomepagehero = require('./elements/BRIDGESTREET.homepage.hero.js');
var BSstatisticspod = require('./elements/BRIDGESTREET.statistics.pod.js');
var BSfeaturedpod = require('./elements/BRIDGESTREET.featured.pod.js');
var BSsearchfilter = require('./elements/BRIDGESTREET.search.filter.js');
var BSsearchlisting = require('./elements/BRIDGESTREET.search.listing.js');
var BSmapview = require('./elements/BRIDGESTREET.mapview.js');
var BSglobalsearch = require('./elements/BRIDGESTREET.global.search.go.js');
var BSmobilemodal = require('./elements/BRIDGESTREET.mobile.modal.js');
var BSnearby = require('./elements/BRIDGESTREET.nearby.js');
var BSdetailcarousel = require('./elements/BRIDGESTREET.detail.carousel.js');
var BSaccordionlist = require('./elements/BRIDGESTREET.accordion.list.js');
var BStripdetails = require('./elements/BRIDGESTREET.detail.yourtrip.js');
var BSrelatedproperties = require('./elements/BRIDGESTREET.detail.related.properties.js');
var BSbookingflow = require('./elements/BRIDGESTREET.bookingflow.js');
var BScontactusform = require('./elements/BRIDGESTREET.contactusform.js');
var BScontactusMaps = require('./elements/BRIDGESTREET.contactusMaps.js');
var BSpartnercontactusform = require('./elements/BRIDGESTREET.partnercontactusform.js');
var BSallLocations = require('./elements/BRIDGESTREET.alllocations.js');
var BSVideoSlider = require('./elements/BRIDGESTREET.video.slider.js');

(function ($window, window, document, jQuery, app) {

    BridgeStreet = {

        initGlobal: function () {

            /*
             *  An easy-to-use library for eliminating the 300ms delay between a physical
             *  tap and the firing of a click event on mobile browsers.
            */

            //FastClick.attach(document.body); 

            /*
             *  jQuery UI and Bootstrap use 'button'. Need to create a noConflict
            */
            var bootstrapButton = $.fn.button.noConflict();

            BSnavigation.init($window);


            BSglobalsearch.init($window);

            /*
             *  Initializes the peeldown functionality
            */

            BSpeeldown.init($window);

            /*
             *  Intializing REMODAL modal/mobile search functionality
            */

            BSmobilemodal.init($window);

            /*
             *  Intializing Spinner widgets
            */

            BSspinnerwidget.init($window);

            /*
             *  Intializing Sticky functionality on
            */

            BSuicomponents.initSticky($window);

            
            /*
             *  Intializing Search Page state slider component
            */

            BSuicomponents.iniSearchPageStateSliderComponent($window);

            /*
             *  Intializing SVG animation
            */

            BSuicomponents.initSVGAnimation($window);

            /*
             *  Intializing Viewport animations..if any
            */

            BSuicomponents.initViewportAnimations($window);


        },

        /*
          *  Intializing homepage hero functionality
         */

        initHomepageHero: function () {

            BShomepagehero.init();

        },

        /*
          *  Intializing statistsics component functionality
         */

        initStatistics: function () {

            BSstatisticspod.init();

        },

        /*
          *  Intializing search results page functionality
         */

        initSearchResults: function () {

            if ($('#filter-container').length == 0) return false;
          
          $.when(BSsearchfilter.init()).then(

              function (status) {
                  console.log("filter rendering succeeded; " + status);
                             
                  BSsearchlisting.init();
                  BSmapview.init();

                  $('.p-accordion').SimpleAccordion();

                  BSuicomponents.initSearchPageUIComponents();
              },
              function (status) {
                  console.log("filter rendering failed; " + status);
              },
              function (status) {
                  console.log("filter rendering is done; " + status);
              }
            );

        },

        /*
         *  Homepage 4 column featured property pods. Slight functionality change depending on browser size.
        */

        initFeaturedPod: function () {

            BSfeaturedpod.init();

        },


        /*
          *  Intializing property detail page carousel functionality
         */

        initDetailCarousel: function () {

            BSdetailcarousel.init();
        },

        /*
          *  Intializing accordion functionality
         */
        initAccordionList: function () {

            BSaccordionlist.init();

        },
        /*
          *  Intializing trip details functionality
         */
        initTripDetails: function () {

            if ($('#your-trip').length == 0) return false;
            
            $.when(BStripdetails.init()).then(

                function (status) {
                    console.log("your trip rendering succeeded; " + status);
                },
                function (status) {
                    console.log("your trip rendering failed; " + status);
                },
                function (status) {
                    console.log("your trip rendering is done; " + status);
                }
              );
            
        },
        initRelatedProperties: function () {

            if ($('#related-properties').length == 0) return false;

            BSrelatedproperties.init();
            
        },
        /*
          *  Intializingnearby functionality
         */
        initNearby: function () {

            BSnearby.init();

        },
        initBookingFlow : function () {

            if ($("#booking-form").length) {

                BSbookingflow.Init();

                return;

            }

            if ($("#request-form").length) {

                BSbookingflow.InitRequest();

                return;

            }

        },

        initContactUsForm : function() {
            if ($("#panel-contact-us-form").length) {
                BScontactusform.init();
            }
        },

        initContactUsFormMaps: function () {
            if ($("#contactUsMaps").length) {
                BScontactusMaps.init();
            }
        },

        initPartnerContactUsForm: function () {

            if ($("#partner-contact-us-form").length) {
                BSpartnercontactusform.init();
            }
        },

        initAllLocations : function () {
            if ($(".locations-page").length) {
                BSallLocations.init();
            }
        },


        initVideoSlider : function ($window) {

            BSVideoSlider.init($window);

        }        
    }

})(window, document, jQuery, window.Utils);

jQuery( document ).ready( function (jQuery) {

    "use strict";

    BridgeStreet.initHomepageHero($window);

    BridgeStreet.initStatistics($window);

    BridgeStreet.initFeaturedPod($window);

    BridgeStreet.initSearchResults($window);

    BridgeStreet.initDetailCarousel($window);

    BridgeStreet.initAccordionList($window);

    BridgeStreet.initTripDetails($window);

    BridgeStreet.initRelatedProperties($window);

    BridgeStreet.initNearby($window);

    BridgeStreet.initGlobal($window);

    BridgeStreet.initBookingFlow($window);

    BridgeStreet.initContactUsForm($window);

    BridgeStreet.initContactUsFormMaps($window);

    BridgeStreet.initPartnerContactUsForm($window);

    BridgeStreet.initAllLocations($window);

    BridgeStreet.initVideoSlider();

    //Look for a hash and scroll to the id if it exist on the page
    DOMUtils.scrollPageToId();

});