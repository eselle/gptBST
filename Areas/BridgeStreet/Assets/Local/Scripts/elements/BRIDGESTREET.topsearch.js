var BSTopSearchGuestSelector = require('./BRIDGESTREET.topsearch.guest.selector.js');
var BSgloballocationsearch = require('./BRIDGESTREET.global.search.location.js');
var BSglobaldaterange = require('./BRIDGESTREET.global.search.daterange.js');
var DateFormat = require('../utils/BRIDGESTREET.date.format.js');

(function () {
    var $window = $(window);

    var topSearch = {
        init: function (model, onModelUpdateCallback, onSearchCallback) {
            this.model = model;
            this.onModelUpdateCallback = onModelUpdateCallback;
            this.onSearchCallback = onSearchCallback;

            //TODO: remove previous listeners
            if ($('#topsearch-guests').length) {
                this.dateRange = BSglobaldaterange.init({date: null});
                this.locationSearch = BSgloballocationsearch.init({location: null}); // TODO: update this logic
                BSTopSearchGuestSelector.init(this.model, this.updateModel.bind(this));
                this.changeHeader();
            }

            $('.topsearchbox #topsearch-search_button').on('click', (function(event) {
                event.preventDefault();
                this.updateModel(this.model);
                this.onSearchCallback();
            }).bind(this));

            $('#FilterAmeneties').on('click', (function(event) {
                event.stopPropagation();
            }));

            $('.more-filters-dropdown__buttons-cancel').on('click', function(event) {
                $('.dropdown.open .dropdown-toggle').dropdown('toggle');
            });

            $('.more-filters-dropdown__buttons-apply').on('click', function(event) {
                $('.dropdown.open .dropdown-toggle').dropdown('toggle');
            });
        },

        updateModel: function (model) {
            model.attributes.ArrivalDate = DateFormat(this.dateRange.arrival, "yyyy-mm-dd");
            model.attributes.DepartureDate = DateFormat(this.dateRange.departure, "yyyy-mm-dd");
            model.attributes.Latitude = this.locationSearch.lat;
            model.attributes.Longitude = this.locationSearch.lng;
            model.attributes.Place = this.locationSearch.place;

            this.model = model;
            this.onModelUpdateCallback(model);
        },

        changeHeader: function () {
            $('#searchbox-form > .form-container').hide();
            $('#searchbox-form > .btn-search').hide();
            $('.logo-container').append('<div class="slogan-site"><div class="content-slogan">Every Stay Guaranteed</div></div>');
        }
    };

    module.exports = topSearch || window.topSearch;
})();
