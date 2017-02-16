var BSIncrement = require('../utils/increment.js');

(function () {

    var globalguests = {
        adults: 1, 
        children: 0, 
        roomType: 1,
        init: function (search) {
            var arr = [];
            var scope = this;
            if (search.guests != null) {
                scope.adults = search.guests.adults;
                scope.children = search.guests.children;
                scope.roomType = search.guests.roomType;
            }

            if ($('.alt-header')) this.initListeners();

            var spinner = jQuery('.mega-dropdown-menu .spinner input').spinner({
                min: 0,
                max: 20,
                step: 1,
                alignment: 'horizontal',
                icons: {
                    left: "fa fa-minus",
                    right: "fa fa-plus"
                },
                spin: function (event, ui) {
                    scope.updateRelatedControls(ui, this);
                }
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

            var spinner = jQuery('.remodal-wrapper .spinner input').spinner({
                min: 0,
                max: 20,
                step: 1,
                alignment: 'horizontal',
                icons: {
                    left: "fa fa-minus",
                    right: "fa fa-plus"
                },
                spin: function (event, ui) {
                    scope.updateRelatedControls(ui, this);
                }
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
            

            $('.bedroom-type').on('change', function () {
                scope.roomType = $(this).val();
                $('.bedroom-type').val(scope.roomType);
            });

            jQuery('.custom-drop-down').on('click', function (event) {
                var events = jQuery._data(document, 'events') || {
            };

                events = events.click ||[];

                for (var i = 0; i < events.length; i++) {
                    if (events[i].selector) {

                        if (jQuery(event.target).is(events[i].selector)) {
                            events[i].handler.call(event.target, event);
                    }

                        jQuery(event.target).parents(events[i].selector).each(function () {
                            if (events[i].selector != '[data-toggle="dropdown"]') {
                                events[i].handler.call(this, event);
                        }
                    });
                }
            }

                event.stopPropagation();
            });


            $('input.ui-spinner-input[id=Adults]').val(scope.adults);
            $('input.ui-spinner-input[id=Children]').val(scope.children);
            $('.bedroom-type').val(scope.roomType);

            return scope;
        },
        updateRelatedControls: function (ui, caller) {
            var scope = this;

            var callerID = jQuery(caller).attr('id');
            $('input.ui-spinner-input[id=' + callerID + ']').val(ui.value);
            
            scope.adults = $('#Adults').spinner("value");
            scope.children = $('#Children').spinner("value");
            scope.roomType = $('.bedroom-type').val();            
            
            var people = scope.adults +scope.children;
            var requiredMinRooms = people <= 2 ? 0 : Math.floor(people / 2);

            if (requiredMinRooms > scope.roomType) {
                if (requiredMinRooms > 5) {
                    requiredMinRooms = 5;
                }
                scope.roomType = requiredMinRooms;
            }

            $('#number_of_guests').val(people + ' Guests');
            $('.bedroom-type').val(scope.roomType);
        },
        show: function () {
            jQuery('.searchbox-guests').addClass('open');
            jQuery('.dropdown-toggle').attr('aria-expanded', 'true');
        },

        initListeners: function () {
            var scope = this;
            $(window).on('resize', this.resizeBrowser);
        },

        resizeBrowser: function () {
            DOMUtils.fitToPlaceholder("number_of_guests");
        }
    }

    module.exports = globalguests || window.globalguests;

})();
