(function () {
    var $window = $(window);

    var topSearch = {
        init: function (model, onModelUpdate) {
            var $city = $('#searchKeywords');

            this.initGuestDropdown();
            this.model = model;
            this.updateModel = onModelUpdate;
            this.initialized = true;
        },

        initGuestDropdown: function () {
            this.topSearchGuestsNode = $('#topsearch-guests');
            this.bedroomTypeNode = this.topSearchGuestsNode.find('.bedroom-type');
            this.numberOfGuestsNode = this.topSearchGuestsNode.find('#topsearch-number_of_guests');
            this.spinnerNodes = this.topSearchGuestsNode.find('.custom-drop-down .spinner input');
            this.spinnerAdults = this.topSearchGuestsNode.find('#spinner-adults');
            this.spinnerChildren = this.topSearchGuestsNode.find('#spinner-children');

            this.bedroomTypeNode.on('change', (function () {
                this.onRoomTypeChange(this.bedroomTypeNode.val());
            }).bind(this));

            this.topSearchGuestsNode.find('.custom-drop-down').on('click', function (event) {
                event.stopPropagation();
            });

            this.spinnerNodes.spinner({
                min: 0,
                max: 20,
                step: 1,
                alignment: 'horizontal',
                icons: {
                    left: "fa fa-minus",
                    right: "fa fa-plus"
                },
                spin: (function (event, ui) {
                    this.updateBedroomType(event, ui);
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

        updateBedroomType: function (event, ui) {
            var people;
            var requiredMinRooms;
            var roomType;

            if (ui && event) {
                $(event.target).val(ui.value);
            }

            roomType = this.bedroomTypeNode.val();
            people = this.spinnerAdults.spinner('value') + this.spinnerChildren.spinner('value');
            requiredMinRooms = people <= 2 ? 1 : Math.floor(people / 2);

            if (requiredMinRooms > roomType) {
                if (requiredMinRooms > 5) {
                    requiredMinRooms = 5;
                }
            }
            roomType = requiredMinRooms;

            this.numberOfGuestsNode.val(people + ' Guests');
            this.bedroomTypeNode.val(roomType);
            this.onRoomTypeChange(roomType)
        },

        onRoomTypeChange: function (currentRoomType) {
            var roomTypeModel = [];

            _.each(this.model.attributes.Size.RoomTypes, function(roomType) {
                if (roomType.Value === currentRoomType.toString()) {
                    roomType.Selected = true;
                } else {
                    roomType.Selected = false;
                }

                roomTypeModel.push(roomType);
            });

            this.model.attributes.Size.RoomTypes = roomTypeModel;
            this.updateModel(this.model);
        }
    };

    module.exports = topSearch || window.topSearch;
})();

