var BSGlobalDateRange = require('./BRIDGESTREET.global.search.daterange.js');

(function () {

    var globallocationsearch = {
        lat: null,
        lng: null,
        place: null,
        id: null,
        init: function (search) {
            var scope = this;
            if (search.location != null) {
                scope.lat = search.location.lat;
                scope.lng = search.location.lng;
                scope.id = search.location.id;
                scope.place = search.location.place;
            }

            if (!$("#searchKeywordsMobile, #searchKeywords").length) return;

            scope.cityOptions = {
                types: []
            };

            var $mobileSearch = $('#searchKeywordsMobile');
            var $desktopSearch = $('#searchKeywords');
            var $topFilterSearch = $('#topSearchKeywords');

            $mobileSearch.val(scope.place);
            $desktopSearch.val(scope.place);
            $topFilterSearch.val(scope.place);

            var mobileSearchCity = document.getElementById('searchKeywordsMobile');
            var desktopSearchCity = document.getElementById('searchKeywords');

            setTimeout(function () {
                var topFilterSearchCity = document.getElementById('topSearchKeywords');
                var topFilterSearchCityAuto = new google.maps.places.Autocomplete(topFilterSearchCity, scope.cityOptions);

                google.maps.event.addListener(topFilterSearchCityAuto, 'place_changed', function () {

                    var place = topFilterSearchCityAuto.getPlace();

                    scope.id = place.id;
                    scope.lat = place.geometry.location.lat();
                    scope.lng = place.geometry.location.lng();
                    scope.place = $topFilterSearch.val();

                    $topFilterSearch.val(scope.place);
                    console.log('SHOW TOP FILTER');
                    BSGlobalDateRange.show();
                    return false;
                });

            }, 500);

            var mobileSearchCityAuto = new google.maps.places.Autocomplete(mobileSearchCity, scope.cityOptions);
            var desktopSearchCityAuto = new google.maps.places.Autocomplete(desktopSearchCity, scope.cityOptions);

            google.maps.event.addListener(mobileSearchCityAuto, 'place_changed', function () {

                var place = mobileSearchCityAuto.getPlace();

                scope.id = place.id;
                scope.lat = place.geometry.location.lat();
                scope.lng = place.geometry.location.lng();
                scope.place = $mobileSearch.val();

                $desktopSearch.val(scope.place);

                BSGlobalDateRange.show();
                return false;
            });

            google.maps.event.addListener(desktopSearchCityAuto, 'place_changed', function () {

                var place = desktopSearchCityAuto.getPlace();

                scope.id = place.id;
                scope.lat = place.geometry.location.lat();
                scope.lng = place.geometry.location.lng();
                scope.place = $desktopSearch.val();

                $mobileSearch.val(scope.place);
                console.log('SHOW');
                BSGlobalDateRange.show();
                return false;
            });

            $("#searchKeywordsMobile, #searchKeywords").keyup(function (e) {
                if (DOMUtils.is_mobile() && e.which == 13 && jQuery('.pac-container:visible').length)
                    return false;

                scope.place = $(this).val();
                var index = $(this).attr('id') == "searchKeywordsMobile" ? 0 : 1;
                $("#searchKeywords").val(scope.place);
                $("#searchKeywordsMobile").val(scope.place);

                scope.findLocationMatch(index, false);
            });
            
            scope.initListeners();
            return scope;
        },

        get: function () {
            return this.scope.id;
        },
        findLocationMatch: function (pacContainerIndex, completeQuery) {
            var scope = this;

            var $autocompleteDomScope = $($('.pac-container')[pacContainerIndex]);
            var textMatch = $(".pac-item:first .pac-item-query", $autocompleteDomScope).text();
            var firstResult = $(".pac-item:first", $autocompleteDomScope).text();

            // insert space after matched text if 
            var autocomplete = firstResult.replace(textMatch, '');
            if (/[A-Z]/.test(autocomplete[0])) {
                firstResult = firstResult.replace(textMatch, textMatch + ' ');
            }

            var dfd = jQuery.Deferred();

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ "address": firstResult }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var place = results[0];

                    scope.id = place.id;
                    scope.lat = place.geometry.location.lat();
                    scope.lng = place.geometry.location.lng();
                    scope.place = firstResult;
                    
                    if (completeQuery) {
                        $(".pac-container").hide();
                        $("#searchKeywords").val(scope.place);
                        $("#searchKeywordsMobile").val(scope.place);
                        $("#topSearchKeywords").val(scope.place);
                    }
                    else {
                        $autocompleteDomScope.show();
                        $(".pac-container .pac-item:first").addClass("pac-selected");
                    }

                    dfd.resolve("hurray");
                }
            });
            return dfd.promise();
        },

        initListeners: function () {
            //desktop only
            $(window).on('resize', { self: this }, this.resizeBrowser);
        },

        resizeBrowser: function () {
            DOMUtils.fitToPlaceholder("searchKeywords");
        }
    }

    module.exports = globallocationsearch || window.globallocationsearch;

})();

