var BSTopSearchGuestSelector = require('./BRIDGESTREET.topsearch.guest.selector.js');
var BSgloballocationsearch = require('./BRIDGESTREET.global.search.location.js');
var BSTopSearchDaterange = require('./BRIDGESTREET.topsearch.daterange.js');
var DateFormat = require('../utils/BRIDGESTREET.date.format.js');

(function () {
    var $window = $(window);

    var topSearch = {
        init: function (model, onModelUpdateCallback, onSearchCallback) {
            this.model = model;
            this.onModelUpdateCallback = onModelUpdateCallback;
            this.onSearchCallback = onSearchCallback;

            console.log(this.model, this.getParameterFromQueryString('ArrivalDate'), this.getParameterFromQueryString('DepartureDate'));
            this.dateRange = BSTopSearchDaterange.init({date: {
                arrival: this.getParameterFromQueryString('ArrivalDate'),
                departure: this.getParameterFromQueryString('DepartureDate')
            }});
            this.locationSearch = BSgloballocationsearch.init({location: null}); // TODO: update this logic
            BSTopSearchGuestSelector.init(this.model, this.updateModel.bind(this));

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
        getParameterFromQueryString: function(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }
    };

    module.exports = topSearch || window.topSearch;
})();
