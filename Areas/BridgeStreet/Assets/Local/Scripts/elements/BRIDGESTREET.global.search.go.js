var CalendarUtil = require('../utils/BRIDGESTREET.calendarcontrol.js');
var DateFormat = require('../utils/BRIDGESTREET.date.format.js');
var BSgloballocationsearch = require('./BRIDGESTREET.global.search.location.js');
var BSglobalguests = require('./BRIDGESTREET.global.search.guests.js');
var BSglobaldaterange = require('./BRIDGESTREET.global.search.daterange.js');

var globalgosearch = (function (app, parent, dateFormat, guests, document) {


    var search = {
        location: null,
        date: null,
        guests: null
    };
    return {
        init: function () {
            var self = this;

            if (!$('.btn-search').length) return;

            this.populateSearchControls();

            jQuery('#searchbox-form .btn-search').on("click", this._issueSearch);
            jQuery('.mobileSearchButton').on("click", this._issueSearch);

            setTimeout(function () {
                jQuery('#top-search-box .topsearchbox__button-wrapper').on("click", self._issueSearch);
            }, 500);
        },

        _issueSearch: function (evt) {
            console.log('issueSearch');
            console.dir(search);
            var locationInputID = '';

            if (DOMUtils.is_mobile() || DOMUtils.is_tablet()) {
                locationInputID = '#searchKeywordsMobile';
            } else {
                console.log('has topsearch', $('#topsearch-guests').length);
                if ($('#topsearch-guests').length) {
                    locationInputID = '#topSearchKeywords';
                } else {
                    locationInputID = '#searchKeywords';
                }
            }
            console.log('locationInputID', locationInputID);
            // var locationInputID = (DOMUtils.is_mobile() || DOMUtils.is_tablet()) ? '#searchKeywordsMobile' : '#searchKeywords';

            var searchTerm = $(locationInputID).val().trim();
            if (searchTerm == '') {

                $(locationInputID + ', i.fa.fa-map-marker.form-control-icon').addClass('highlight');
                setTimeout(function () {
                    $(locationInputID + ', i.fa.fa-map-marker.form-control-icon').removeClass('highlight');
                }, 600);

            } else {

                $(locationInputID).attr("data-remodal-action", "confirm");
                
                var searchUrl = "/Search?Latitude=" + search.location.lat +
                                "&Longitude=" + search.location.lng +
                                "&ArrivalDate=" + DateFormat(search.date.arrival, "yyyy-mm-dd") +
                                "&DepartureDate=" + DateFormat(search.date.departure, "yyyy-mm-dd") +
                                "&Adults=" + search.guests.adults +
                                "&Children=" + search.guests.children +
                                "&RoomType=" + search.guests.roomType +
                                "&Place=" + search.location.place;

                document.location.href = searchUrl;
                console.log(search);
            }
        },

        populateSearchControls: function () {
            var arrival = '';
            var departure = '';

            var a = location.search.replace(/^\?/, '').split('&');
            for (var i = 0; i < a.length; i++) {
                if (a[i].indexOf('Place=') > -1) {
                    if (search.location == null)
                        search.location = {};
                    search.location.place = decodeURI(a[i].replace("Place=", ''));
                }
                else if (a[i].indexOf('Latitude=') > -1) {
                    if (search.location == null)
                        search.location = {};
                    search.location.lat = Number(a[i].replace("Latitude=", ''));
                }
                else if (a[i].indexOf('Longitude=') > -1) {
                    if (search.location == null)
                        search.location = {};
                    search.location.lng = Number(a[i].replace("Longitude=", ''));
                }
                else if (a[i].indexOf('ArrivalDate=') > -1) {
                    arrival = a[i].replace("ArrivalDate=", '');
                }
                else if (a[i].indexOf('DepartureDate=') > -1) {
                    departure = a[i].replace("DepartureDate=", '');
                }
                else if (a[i].indexOf('Adults=') > -1) {
                    if (search.guests == null)
                        search.guests = {};
                    search.guests.adults = Number(a[i].replace("Adults=", ''));
                }
                else if (a[i].indexOf('Children=') > -1) {
                    if (search.guests == null)
                        search.guests = {};
                    search.guests.children = Number(a[i].replace("Children=", ''));
                }
                else if (a[i].indexOf('RoomType=') > -1) {
                    if (search.guests == null)
                        search.guests = {};
                    search.guests.roomType = Number(a[i].replace("RoomType=", ''));
                }
            }

            if (arrival != "" && departure != "") {
                var arrDate = new Date(arrival);
                var depDate = new Date(departure);

                arrDate.setDate(arrDate.getDate() + 1);
                depDate.setDate(depDate.getDate() + 1);

                search.date = {
                    arrival: arrDate,
                    departure: depDate
                };
            }

            search.date = BSglobaldaterange.init(search);
            search.guests = BSglobalguests.init(search);
            search.location = BSgloballocationsearch.init(search);

            // when clicking on one of the non-location search controls, auto complete place if it hasn't been already
            $('#check_in_date, #check_in_date_mobile, .bedroom-type, #Adults, #Children, .dropdown-toggle').click(function () {

                if ($('#searchKeywordsMobile').val() != search.location.place) {
                    $('#searchKeywordsMobile').val(search.location.place);
                }
                if ($('#searchKeywords').val() != search.location.place) {
                    $('#searchKeywords').val(search.location.place);
                }
            });

        },

        _fromUrlDate: function (dateStr) {
            var bits = dateStr.split('-');
            return bits[1] + "/" + bits[2] + "/" + bits[0];
        }


    }

})(globalgosearch || {}, CalendarUtil, DateFormat, BSglobalguests, document);

module.exports = globalgosearch || window.globalgosearch;
