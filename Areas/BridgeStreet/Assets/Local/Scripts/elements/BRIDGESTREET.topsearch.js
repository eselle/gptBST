(function () {
    var $window = $(window);

    var topSearch = {
        init: function (model) {
            var $city = $('#searchKeywords');

            this.initGuestDropdown();
            this.model = model;
            this.initialized = true;
        },

        initGuestDropdown: function () {

            $('#topsearch-guests .bedroom-type').on('change', function () {
                //$('.bedroom-type').val(scope.roomType);
            });

            $('#topsearch-guests .custom-drop-down').on('click', function (event) {
                event.stopPropagation();
            });

            $('#topsearch-guests .custom-drop-down .spinner input').spinner({
                min: 0,
                max: 20,
                step: 1,
                alignment: 'horizontal',
                icons: {
                    left: "fa fa-minus",
                    right: "fa fa-plus"
                },
                spin: (function (event, ui) {
                    this.updateRelatedControls(ui, this);
                }).bind(this)
            })
                .parent()
                .find('.ui-spinner-up')
                .find('span')
                .empty()
                .end()
                .parent()
                .find('.ui-spinner-down')
                .find('span')
                .empty();
        },

        updateRelatedControls: function (ui, caller) {
            var bedroomTypeElement = $('#topsearch-guests .bedroom-type');
            var adults;
            var children;
            var roomType;

            if (ui && caller) {
                var callerID = jQuery(caller).attr('id');
                $('input.ui-spinner-input[id=' + callerID + ']').val(ui.value);
            }

            adults = $('#topsearch-guests #Adults').spinner("value");
            children = $('#topsearch-guests #Children').spinner("value");
            roomType = bedroomTypeElement.val();


            var people = adults + children;
            var requiredMinRooms = people <= 2 ? 0 : Math.floor(people / 2);

            if (requiredMinRooms > roomType) {
                if (requiredMinRooms > 5) {
                    requiredMinRooms = 5;
                }
                roomType = requiredMinRooms;
            }

            $('#topsearch-guest #number_of_guests').val(people + ' Guests');
            bedroomTypeElement.val(roomType);
        }
    };

    module.exports = topSearch || window.topSearch;
})();

