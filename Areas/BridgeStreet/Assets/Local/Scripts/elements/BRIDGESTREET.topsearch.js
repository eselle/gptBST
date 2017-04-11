(function () {
    var $window = $(window);

    var topSearch = {
        init: function (model, onModelUpdate) {
            var $city = $('#searchKeywords');

            if ($('#topsearch-guests').length) {
                this.initGuestDropdown();
            }
            this.model = model;
            this.updateModel = onModelUpdate;
            //TODO: remove previous listeners
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

            this.changeHeader();

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

            if (people > 1) {
                this.numberOfGuestsNode.val(people + ' Guests');
            } else {
                this.numberOfGuestsNode.val(people + ' Guest');
            }

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
        },

        changeHeader: function () {
            $('#searchbox-form > .form-container').hide();
            $('#searchbox-form > .btn-search').hide();
            $('.logo-container').append('<div class="slogan-site"><div class="content-slogan">Every Stay Guaranteed</div></div>');
        }
    };

    module.exports = topSearch || window.topSearch;
})();

