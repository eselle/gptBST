var BSTopSearchGuestSelector = require('./BRIDGESTREET.topsearch.guest.selector.js');
var BSgloballocationsearch = require('./BRIDGESTREET.global.search.location.js');
var BSTopSearchLocation = require('./BRIDGESTREET.topsearch.location.js');
var BSTopSearchDaterange = require('./BRIDGESTREET.topsearch.daterange.js');
var DateFormat = require('../utils/BRIDGESTREET.date.format.js');

(function () {
    var $window = $(window);

    var topSearch = {
        init: function (model, onModelUpdateCallback, onSearchCallback) {
            var self = this;
            this.model = model;
            this.onModelUpdateCallback = onModelUpdateCallback;
            this.onSearchCallback = onSearchCallback;

            this.dateRange = BSTopSearchDaterange.init({date: {
                arrival: this.getParameterFromQueryString('ArrivalDate'),
                departure: this.getParameterFromQueryString('DepartureDate')
            }});

            this.locationSearch = BSTopSearchLocation.init({
                location: {
                    lat: this.getParameterFromQueryString('Latitude'),
                    lng: this.getParameterFromQueryString('Longitude'),
                    place: this.getParameterFromQueryString('Place')
                }
            });

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

            $('.property-types-checkbox').on('click', function (event) {
                var val = Number($(this).val());

                if (!self.model.attributes.filters.PropertyTypes) {
                    self.model.attributes.filters.PropertyTypes = [];
                }

                if ($(this).is(':checked')) {
                    if (!_.contains(self.model.attributes.filters.PropertyTypes, val)) {
                        self.model.attributes.filters.PropertyTypes.push(val);
                    }
                } else {
                    self.model.attributes.filters.PropertyTypes = _.filter(self.model.attributes.filters.PropertyTypes, function (propertyType) {
                        return propertyType !== val;
                    });
                }

                self.model.attributes.filters.Attributes = [];
                self.onModelUpdateCallback(self.model);
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
