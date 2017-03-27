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
            this.searchButtonMobile = $('.mobileSearchButton');
            this.locationInput = $('#searchKeywords');
            this.locationInputMobile = $('#searchKeywordsMobile');

            if (this.searchButton.length || this.searchButtonMobile.length) {
                this.populateSearchData();
                this.initializeForm();
            }

            if (this.searchButton.length) {
                this.searchButton.on('click', this.search.bind(this));
                $('.guest-fg__done-button').on('click', this.handleGuestDoneButtonClick.bind(this));
            }

            if (this.searchButtonMobile.length) {
                this.searchButtonMobile.on('click', this.search.bind(this));
            }
        },

        search: function (e) {
            e.preventDefault();
            var locationInput;
            var locationInputValue = '';
            var isMobile = $(e.target).is(this.searchButtonMobile);

            // Desktop/Tablet button triggered
            if ($(e.target).is(this.searchButton)) {
                locationInput = this.locationInput;
                locationInputValue = this.locationInput.val().trim();
            }

            // Mobile button triggered
            if (isMobile) {
                locationInput = this.locationInputMobile;
                locationInputValue = this.locationInputMobile.val().trim();

            }

            if (locationInput && locationInputValue) {
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
                locationInput.focus();
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
        },

        handleGuestDoneButtonClick: function (e) {
            e.preventDefault();
            // Due legacy code issues.. this is the guest dropdown instance....
            if (this.searchData.guests) {
                this.searchData.guests.updateRelatedControls();
            }
        }
    };

    module.exports = homepagehero || window.homepagehero;
})();