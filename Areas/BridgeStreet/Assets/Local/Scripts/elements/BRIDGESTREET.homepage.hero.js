var DateFormat = require('../utils/BRIDGESTREET.date.format.js');
var BSgloballocationsearch = require('./BRIDGESTREET.global.search.location.js');
var BSglobalguests = require('./BRIDGESTREET.global.search.guests.js');
var BSglobaldaterange = require('./BRIDGESTREET.global.search.daterange.js');

(function () {
    var homepagehero = {
        init: function () {
            this.searchData = {
                location: null,
                date: null,
                guests: null
            };
            this.searchButton = $('.homepage-hero__form-submit-button');
            this.locationInput = $('#searchKeywords');

            if (this.searchButton.length) {
                this.populateSearchData();
                this.initializeForm();

                this.searchButton.on('click', this.search.bind(this));
            }
        },

        search: function (e) {
            // TODO: mobile code
            e.preventDefault();
            var locationInputValue = '';

            if (this.locationInput.length) {
                locationInputValue = this.locationInput.val().trim();
            }

            if (locationInputValue) {
                // $(locationInputID).attr("data-remodal-action", "confirm"); TODO: mobile modal confirm

                var searchUrl = "/Search?Latitude=" + this.searchData.location.lat +
                    "&Longitude=" + this.searchData.location.lng +
                    "&ArrivalDate=" + DateFormat(this.searchData.date.arrival, "yyyy-mm-dd") +
                    "&DepartureDate=" + DateFormat(this.searchData.date.departure, "yyyy-mm-dd") +
                    "&Adults=" + this.searchData.guests.adults +
                    "&Children=" + this.searchData.guests.children +
                    "&RoomType=" + this.searchData.guests.roomType +
                    "&Place=" + this.searchData.location.place;

                document.location.href = searchUrl;
            } else {
                // form error handling????
            }
        },

        populateSearchData: function () {
            var keys = {
                adults: 'Adults',
                arrival: 'ArrivalDate',
                children: 'Children',
                departure: 'DepartureDate',
                latitude: 'Latitude',
                longitude: 'Longitude',
                place: 'Place',
                room: 'RoomType'

            };
            var arrival;
            var departure;

            var queryStringParameters = location.search.replace(/^\?/, '').split('&');

            queryStringParameters.forEach(function(parameter) {
                var equalSignIndex = parameter.indexOf('=');
                var slicedParameter = (equalSignIndex !== -1) ? parameter.slice(0, equalSignIndex) : '';
                var value = (equalSignIndex !== -1) ? parameter.replace(slicedParameter + '=', '') : '';

                if (slicedParameter && value) {
                    if ([keys.latitude, keys.longitude, keys.place].indexOf(slicedParameter) !== -1) {
                        if (!this.searchData.location) {
                            this.searchData.location = {};
                        }
                    }

                    if ([keys.arrival, keys.departure].indexOf(slicedParameter) !== -1) {
                        if (!this.searchData.date) {
                            this.searchData.date = {};
                        }
                    }

                    if ([keys.adults, keys.children, keys.room].indexOf(slicedParameter) !== -1) {
                        if (!this.searchData.guests) {
                            this.searchData.guests = {};
                        }
                    }

                    switch (slicedParameter) {
                        case keys.place:
                            this.searchData.location.place = decodeURI(value);
                            break;
                        case keys.latitude:
                            this.searchData.location.lat = Number(value);
                            break;
                        case keys.longitude:
                            this.searchData.location.lng = Number(value);
                            break;
                        case keys.arrival:
                            arrival = new Date(value);
                            arrival.setDate(arrival.getDate() + 1);
                            this.searchData.date.arrival = arrival;
                            break;
                        case keys.departure:
                            departure = new Date(value);
                            departure.setDate(departure.getDate() + 1);
                            this.searchData.date.departure = departure;
                            break;
                        case keys.adults:
                            this.searchData.guests.adults = Number(value);
                            break;
                        case keys.children:
                            this.searchData.guests.children = Number(value);
                            break;
                        case keys.room:
                            this.searchData.guests.roomType = Number(value);
                            break;
                    }
                }
            }, this);
        },

        initializeForm: function () {
            this.searchData.date = BSglobaldaterange.init(this.searchData);
            this.searchData.guests = BSglobalguests.init(this.searchData);
            this.searchData.location = BSgloballocationsearch.init(this.searchData);
        }
    };

    module.exports = homepagehero || window.homepagehero;
})();