(function () {
    var $window = $(window);

    var topSearchGuestSelector = {
        init: function (model, onModelUpdate) {
            this.model = model;
            this.updateModel = onModelUpdate;
            //TODO: remove previous listeners
            this.initGuestDropdown();

            var qsAdults = decodeURI(window.location.search).match(/Adults=([^&]*)+/);
            var qsChildren = decodeURI(window.location.search).match(/Children=([^&]*)+/);

            if (qsAdults) {
                this.model.attributes.Adults = parseInt(qsAdults[1]);
            }

            if (qsChildren) {
                this.model.attributes.Children = parseInt(qsChildren[1]);
            }

            if (qsAdults || qsChildren) {
                this.setModelAttributesToDOMElements();
            }
        },

        setModelAttributesToDOMElements: function () {
            var adults = this.model.attributes.Adults;
            var children = this.model.attributes.Children;

            this.spinnerAdults.spinner('value',  adults);
            this.spinnerChildren.spinner('value',  children);
            this.updateBedroomType();
        },

        initGuestDropdown: function () {
            this.topSearchGuestsNode = $('#topsearch-guests');
            this.bedroomTypeNode = this.topSearchGuestsNode.find('.bedroom-type');
            this.numberOfGuestsNode = this.topSearchGuestsNode.find('#topsearch-number_of_guests');
            this.dropdownNode = this.topSearchGuestsNode.find('.dropdown-toggle');
            this.spinnerNodes = this.topSearchGuestsNode.find('.custom-drop-down .spinner input');
            this.spinnerAdults = this.topSearchGuestsNode.find('#spinner-adults');
            this.spinnerChildren = this.topSearchGuestsNode.find('#spinner-children');
            this.doneButton = this.topSearchGuestsNode.find('.done-button');

            this.bedroomTypeNode.on('change', (function () {
                this.onRoomTypeChange(this.bedroomTypeNode.val());
            }).bind(this));

            this.topSearchGuestsNode.find('.custom-drop-down').on('click', function (event) {
                event.stopPropagation();
            });

            this.doneButton.on('click', (function (event) {
                event.preventDefault();
                this.dropdownNode.dropdown('toggle');
            }).bind(this));

            this.dropdownNode.parent().on('hide.bs.dropdown', (function(event) {
                this.updateBedroomType();
            }).bind(this));

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
            var adults = this.spinnerAdults.spinner('value');
            var children = this.spinnerChildren.spinner('value');
            var people;
            var requiredMinRooms;
            var roomType;

            if (ui && event) {
                $(event.target).val(ui.value);
            }

            this.model.attributes.Adults = adults;
            this.model.attributes.Children = children;

            roomType = this.bedroomTypeNode.val();
            people = adults + children;
            requiredMinRooms = people <= 2 ? 1 : Math.floor(people / 2);

            if (requiredMinRooms > roomType) {
                if (requiredMinRooms > 5) {
                    requiredMinRooms = 5;
                }
            }
            roomType = requiredMinRooms;

            this.setGuestsValueToInput(people);
            
            this.bedroomTypeNode.val(roomType);
            this.onRoomTypeChange(roomType)
        },

        setGuestsValueToInput: function (numberOfGuests) {
            if (numberOfGuests > 1) {
                this.numberOfGuestsNode.val(numberOfGuests + ' Guests');
            } else {
                this.numberOfGuestsNode.val(numberOfGuests + ' Guest');
            }
        },

        onRoomTypeChange: function (currentRoomType) {
            var roomTypeModel = [];

            _.each(this.model.attributes.Size.RoomTypes, function(roomType) {
                if (roomType.Value === currentRoomType.toString()) {
                    roomType.Selected = true;
                    this.model.attributes.RoomType = roomType.Value;
                } else {
                    roomType.Selected = false;
                }

                roomTypeModel.push(roomType);
            }, this);

            this.model.attributes.Size.RoomTypes = roomTypeModel;
            this.updateModel(this.model);
        }
    };

    module.exports = topSearchGuestSelector || window.topSearchGuestSelector;
})();

