var BSsplitscreen = require('./BRIDGESTREET.split.screen.js');

(function () {
    var $window = $(window);
    var mapview = {

        center: { 'lat': 0, 'lng': 0 },
        init: function () {

            if ($('.map-view').length == 0) return;

            // Google map marker styles/states
            this.marker_path = "M19.2,0C8.7,0,0.1,8.3,0,18.5c0,4.2,1.3,8,3.7,11.1l15,18.4l15.4-18.4c2.4-3.1,3.9-6.9,3.9-11.1C38.1,8.3,29.7,0,19.2,0z   M19,26.2c-4,0-7.2-3.2-7.2-7.2s3.2-7.2,7.2-7.2s7.2,3.2,7.2,7.2S23,26.2,19,26.2z";
            this.poi_marker_path = "M24,0A24,24,0,1,0,48,24,24,24,0,0,0,24,0Zm0,37.58A13.58,13.58,0,1,1,37.58,24,13.58,13.58,0,0,1,24,37.58Z";

            // Google map marker off state
            this.markerImage = {
                path: this.marker_path,
                fillColor: "#002244",
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
                scale: 0.75,
                anchor: new google.maps.Point(19, 47)
            };


            // Google map marker hover state
            this.markerImageHover = {
                path: this.marker_path,
                fillColor: "#FF6600",
                fillOpacity: 1,
                strokeColor: '',
                strokeWeight: 0,
                scale: 0.75,
                anchor: new google.maps.Point(19, 47)
            };

            // Google map marker disabled state
            this.markerImageDisabled = {
                path: this.marker_path,
                fillColor: "#002244",
                fillOpacity: .2,
                strokeColor: '#fff',
                strokeWeight: 2,
                scale: 0.75,
                anchor: new google.maps.Point(19, 47)
            };
            this.markerImageDisabledHover = {
                path: this.marker_path,
                fillColor: "#FF6600",
                fillOpacity: .2,
                strokeColor: '',
                strokeWeight: 0,
                scale: 0.75,
                anchor: new google.maps.Point(19, 47)
            };
            var scope = this;

            // Google map wrapper class
            this.map = new GMaps({
                el: '.map-view',
                zoomControl: true,
                zoomControlOpt: {
                    style: 'DEFAULT',
                    position: 'LEFT_TOP'
                },
                panControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                overviewMapControl: false
            });

            // initialize split screen functionality
            BSsplitscreen.init($window);

            // Refresh map and adjust position based on view states
            jQuery('div.split-pane').on("dividerupdate", function () {

                var lat = "";
                var lng = "";

                if (location.search.indexOf("Latitude=") > -1 && location.search.indexOf("Longitude=") > -1) {
                    var formValueParams = location.search.replace('?', '').split('&');
                    for (i = 0; i < formValueParams.length; i++) {
                        var kvp = formValueParams[i].split('=');
                        switch (kvp[0].toLowerCase()) {
                            case "latitude":
                                lat = kvp[1];
                                break;
                            case "longitude":
                                lng = kvp[1];
                                break;
                        }
                    }
                }

                scope.map.refresh();
                scope.map.fitZoom();

                if (lat != "" && lng != "") {
                    scope.drawEmptyMap(lat, lng);
                }

            });

            this.initListeners();

        },
        disableMarker: function (prop) {
            var scope = this;

            var result = _.find(scope.map.markers, function (item) {
                if (item.PropertyId == prop.PropertyId)
                    return item;
            });
            result.enabled = false;
            result.setIcon(scope.markerImageDisabled);
        },
        enableMarker: function (prop) {
            var scope = this;

            var result = _.find(scope.map.markers, function (item) {
                if (item.PropertyId == prop.PropertyId)
                    return item;
            });

            result.enabled = true;
            result.setIcon(scope.markerImage);
        },
        drawMarkers: function (obj, clear) {

            var scope = this;
            if (clear) {
                this.map.removeMarkers();
                this.markers_data = [];
            }
            if (obj == undefined || obj.length == 0) return;
            if (DOMUtils.isUndefined(this.map)) return;

            for (var i = 0; i < obj.length; i++) {

                var item = obj[i];

                if (item.Lat != 0 && item.Long != 0) {

                    this.markers_data.push({
                        lat: item.Lat,
                        lng: item.Long,
                        item: item,
                        enabled: true,
                        PropertyId: item.PropertyId,
                        icon: this.markerImage,
                        animation: google.maps.Animation.DROP,
                        mouseover: function (e) {
                            if (this.enabled) {
                                this.setIcon(scope.markerImageHover);
                            } else {
                                this.setIcon(scope.markerImageDisabledHover);
                            }
                            scope.renderPodMapView(this.item);
                        },
                        mouseout: function () {
                            if (this.enabled) {
                                this.setIcon(scope.markerImage);

                                //var $scrollElem = $("#" + this.item.PropertyId);
                                //$('.property-pod-wrapper', $scrollElem).removeClass('highlight');

                            } else {
                                this.setIcon(scope.markerImageDisabled);
                            }
                        },
                        click: function (e) {
                            //console.log('clicked pod: ' + this.item.Name + ' ' + this.item.Lat + ", " + this.item.Long + " " + this.item.DistanceFromPoint + " miles away; exact match? " + this.item.IsExactMatch);
                            scope.renderPodMapView(this.item);

                            //var $scrollElem = $("#" + this.item.PropertyId);
                            //$('#grid').animate({
                            //    scrollTop: $scrollElem.offset().top
                            //}, 1000);

                            //$('.property-pod-wrapper', $scrollElem).addClass('highlight');
                        }
                    });

                } else {
                    this.markers_data.push({
                        lat: 0,
                        lng: 0,
                        icon: this.markerImage,
                        animation: google.maps.Animation.DROP,
                        click: function (event) { },
                        mouseover: function (e) {
                            this.setIcon(scope.markerImageHover);
                        },
                        mouseout: function () {
                            this.setIcon(scope.markerImage);
                        }
                    });
                }
            }

            jQuery('.property-pod').each(function (i) {
                jQuery(this).on('mouseenter', function () {
                    var PropertyId = jQuery(this).attr('id');

                    var result = _.find(scope.map.markers, function (item) {
                        if (item.PropertyId == PropertyId)
                            return item;
                    });

                    if (result.enabled) {
                        result.setIcon(scope.markerImageHover);
                    } else {
                        result.setIcon(scope.markerImageDisabledHover);
                    }
                });

                jQuery(this).on('mouseleave', function () {
                    var PropertyId = jQuery(this).attr('id');
                    var result = _.find(scope.map.markers, function (item) {
                        if (item.PropertyId == PropertyId)
                            return item;
                    });
                    if (result.enabled) {
                        result.setIcon(scope.markerImage);
                    } else {
                        result.setIcon(scope.markerImageDisabled);
                    }
                });
            });

            this.map.addMarkers(this.markers_data);

        },
        zoomInOn: function (properties) {

            var bounds = new google.maps.LatLngBounds();
            var center = new google.maps.LatLng(this.center.lat, this.center.lng);
            bounds.extend(center);

            for (var i = 0; i < properties.length; i++) {
                var m = properties[i];
                if (m.Lat != undefined && m.Long != undefined && (i < 5 || m.DistanceFromPoint < 20)) {
                    var marker = new google.maps.LatLng(m.Lat, m.Long);
                    bounds.extend(marker);
                }
            }
            this.map.fitBounds(bounds);
        },

        renderPodMapView: function (obj) {

            var scope = this;

            if (window.currentSplitState == "right") {

                if (!_.isUndefined(obj)) {

                    var propertyCardMarkup =
                                    '<div class="property-pod-map col-xs-12">' +
                                        '<div class="property-card-close">' +
                                            '<i class="fa fa-close"></i>' +
                                        '</div>' +
                                        '<a class="property-pod-wrapper" href="<%= obj.URL %>">' +
                                            '<div class="property-pod-image-wrapper img-pod-animated">' +
                                                '<img class="img-responsive img-animated" src="<%= obj.Image %>">' +

                                            '</div>' +
                                            '<div class="property-pod-description-wrapper">' +
                                                '<h3><%= obj.Name %></h3>' +
                                                '<h6><%= obj.Address1 %> <%= obj.City %></h6>' +
                                                '<div class="property-pod-cta-wrapper col-xs-6 col-sm-12 col-md-6">' +
                                                    '<div class="col-xs-12 col-sm-6"">' +
                                                        '<span class="btn">VIEW</span>' +
                                                    '</div>' +
                                                    '<div class="price-point">' +
                                                        '<%  if (obj.MinRate != "0" ){ %>' +
                                                            '<span>Rates from</span>' +
                                                            '<h3>' +
                                                                '<%= obj.CurrencyCode %><%= obj.MinRate %>' +
                                                                '<%  if (obj.IsRealTimeBookable ){ %>' +
                                                                    '<i class="fa fa-bolt"></i>         ' +
                                                                '<% } %>' +
                                                            '</h3>' +
                                                        '<% } %>' +
                                                        '<%  if (obj.MinRate == "0" ){ %>' +
                                                            '<span>Rates available<br />upon request</span>' +
                                                        '<% } %>' +
                                                    '</div>' +
                                                '</div>' +
                                                '<%  if (!obj.IsExactMatch ){ %>' +
                                                    '<div class="property-pod-disclaimer col-xs-12">' +
                                                        'This property matches part of your search criteria.' +
                                                        '<%  if (obj.IsPartialDateMatch ){ %>' +
                                                        'This property is unavailable for the selected dates.' +
                                                        '<% } %>' +
                                                    '</div>' +
                                                '<% } %>' +
                                            '</div>' +
                                        '</a>' +
                                '</div>';

                    var template = _.template(propertyCardMarkup);
                    obj.URL = obj.URL + location.search + "&PropertyId=" + obj.PropertyId;

                    $("#PropertyPodSearchMapview").html(template({ obj: obj }));

                    $('.property-card-close').on("click", function () {
                        $("#PropertyPodSearchMapview").html("");
                    });

                } else {

                    $('.property-card-close').off();

                    $(".PropertyPodSearchMapview").remove();
                }

            }

        },

        drawEmptyMap: function (lat, lng) {
            this.center = { 'lat': Number(lat), 'lng': Number(lng) };
            this.map.setCenter(this.center.lat, this.center.lng);
        },

        initListeners: function () {

            var scope = this;

            var myElement = document.getElementById('right-component');

            jQuery('.map-view-button').on("click", function () {

                window.currentSplitState = "right";

                window.stateSlider.noUiSlider.set(100);

                jQuery('#grid').removeClass("list-view").addClass('split-view');

                BSsplitscreen.setState(2, BSsplitscreen.setMapView);

                jQuery(".PropertyPodSearchMapview").html("");

            })

            jQuery('.list-view-button').on("click", function () {

                window.currentSplitState = "left";

                window.stateSlider.noUiSlider.set(0);

                jQuery('#grid').removeClass("split-view").addClass('list-view');

                jQuery("#PropertyPodSearchMapview").html("");

                BSsplitscreen.setState(0, BSsplitscreen.setListView);

                jQuery(".PropertyPodSearchMapview").html("");

            })


            // Initialize browser resize listener

            $window.on('resize', { self: this }, this.resizeBrowser);

        },

        resizeBrowser: function (event) {

            if (!DOMUtils.isUndefined(event.data)) {

                var self = event.data.self;

                self.map.refresh();

            }

        }

    }

    module.exports = mapview || window.mapview;

})();

