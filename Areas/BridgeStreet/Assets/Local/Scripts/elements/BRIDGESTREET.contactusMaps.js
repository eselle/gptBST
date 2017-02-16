(function () {
    var ContactUsMaps = {
        init: function () {
            // Builds the google map and gets coordinates
            var mapDiv = jQuery(".address-map"),
                coords = {};

            mapDiv.each(function () {
                var currentMap = $(this);
                    id = document.getElementById(currentMap.attr('id')),
                    coords = { lat: parseFloat(currentMap.attr('data-lat')), lng: parseFloat(currentMap.attr('data-lon')) };

                this.map = new google.maps.Map(id, {

                    center: coords,

                    zoom: parseInt(currentMap.attr('data-zoom'))

                });

                ContactUsMaps.createMarker(this.map, coords);
            });
        },

        createMarker: function (map, coords) {
            var newMarkerImage = DOMUtils.newMarkerImage();

            var marker = new google.maps.Marker({

                map: map,

                position: coords,

                icon: newMarkerImage,

                animation: google.maps.Animation.DROP
            });
        }
    }

    module.exports = ContactUsMaps || window.ContactUsMaps;
})();