(function () {

    var nearby = {

        init : function () {

            if (DOMUtils.isUndefined(document.getElementsByClassName('nearby-container')[0])) return;
                
                this.map;

                this.bounds = new google.maps.LatLngBounds();

                this.markers = [];

                // defines the off state market object
                this.newMarkerImage = DOMUtils.newMarkerImage();

                // defines the on state market object
                this.markerImageHover = DOMUtils.markerImageHover();


                // Builds the google map and gets coordinates
                var mapDiv = jQuery("#nearby-map");
                
                var coords = { lat: parseFloat(mapDiv.attr('data-lat')), lng: parseFloat(mapDiv.attr('data-lon')) };

                this.map = new google.maps.Map(document.getElementById('nearby-map'), {
                    
                    scrollwheel : false,
                    
                    center: coords,

                    zoom: parseInt(mapDiv.attr('data-zoom'))

                });


                var service = new google.maps.places.PlacesService(this.map);
                
                service.nearbySearch({

                    location: coords,

                    radius: parseInt(mapDiv.attr('data-radius')),

                    type: [mapDiv.attr('data-search-type')]

                }, this.callback);

        },

        callback : function(results, status) {

            if (status === google.maps.places.PlacesServiceStatus.OK) {
                
                for (var i = 0; i < results.length; i++) {

                    // Retrieve only the first 5 nearby locations
                    if (i === 5) { break; }

                    // Creates a marker for each location
                    nearby.createMarker(results[i]);

                }
              
                nearby.map.fitBounds(nearby.bounds);

            }

            // Mouse over effect for listing
            jQuery('.nearby-list-item').on("mouseover", function(i) {               
                
                nearby.markers[jQuery(this).index()].setIcon(nearby.markerImageHover);

            })
            
            // Mouse out effect for listing
            jQuery('.nearby-list-item').on("mouseout", function(i) {               
                
                nearby.markers[jQuery(this).index()].setIcon(nearby.newMarkerImage);

            })

            // Click through          
            jQuery('.nearby-list-item').on("click", function(i) {               
                
                var domainConst = "https://www.google.com/maps/search/";
                
                window.location.href = domainConst + results[ jQuery(this).index() ].name;                

            })

            // Instantiates star rating functinality
            jQuery('.star-rating').raty({

                readOnly : true,

                half  : true,

                score : function() {

                    return jQuery(this).attr('data-rating')
                },

                path : '/Areas/BridgeStreet/Assets/Local/Images/'

            });

        },

        createMarker : function(place) {

            var placeLoc = place.geometry.location;

            var marker = new google.maps.Marker({

                map: nearby.map,

                position: place.geometry.location,

                icon: nearby.newMarkerImage, 

                animation: google.maps.Animation.DROP
            });    

            nearby.bounds.extend(place.geometry.location);           

            google.maps.event.addListener(marker, 'mouseover', function() {
               
                marker.setIcon(nearby.markerImageHover);

            });

            google.maps.event.addListener(marker, 'mouseout', function() {
               
               marker.setIcon(nearby.newMarkerImage);

            });

            nearby.markers.push(marker);

            jQuery(".nearby-list ul").append("<li class='nearby-list-item'><div class='location-name'>"+place.name+"</div><div class='location-address'>"+place.vicinity+"</div><div class='star-rating' data-rating='"+place.rating+"'></div></li>");
        }        


    }

    module.exports = nearby || window.nearby;

})();