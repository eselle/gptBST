var CurrencyUtil = require('../utils/BRIDGESTREET.currency.js');

(function () {

    var yourtrip = {
        yourTrip: null,
        yourTripView: null,
        yourTripModel: null,
        init: function () {

            if (DOMUtils.isUndefined(document.getElementById('your-trip'))) return;

            var dfd = jQuery.Deferred();

            var Model = Backbone.Model.extend({ url: '/briapi/PropertyDetail/YourTripJSON' })

            var View = Backbone.View.extend({
                initialize: function () {
                    _.bindAll(this, "renderYourTrip"); // make sure 'this' refers to this View in the success callback below
                    this.processForm(location.search.replace('?', ''));
                },
                events: {
                    "change #DepartureDate": "refresh",
                    "change #RoomType": "toggleRoomType",
                    "spinstop .trip-detail-spinner": "toggleRoomType",
                    "click #book-button": "onBookingClick",
                    "click #request-button": "onRequestClick"
                },
                refresh: function () {
                    var model = this.model.attributes;
                    model.ArrivalDate = this.toUrlDate(jQuery('#ArrivalDate').val());
                    model.DepartureDate = this.toUrlDate(jQuery('#DepartureDate').val());
                    model.Adults = $('input#Adults.trip-detail-spinner').spinner("value");
                    model.Children = $('input#Children.trip-detail-spinner').spinner("value");
                    model.RoomType = $('#RoomType').val();

                    this.processForm('');

                },
                toggleRoomType: function () {
                    var selection = $('#RoomType').val();
                    var item;
                    for (i = 0; i < this.model.attributes.RoomBookingOptions.length ; i++) {
                        item = this.model.attributes.RoomBookingOptions[i];
                        if (item.Value == selection) {
                            this.updateCostAndButtons(item);

                            this.hightlghtElement("#lblCostPerNight");
                            this.hightlghtElement("#lblSubtotalPrice");
                            break;
                        }
                    }
                },
                hightlghtElement: function (id) {
                    $(id).animate({ backgroundColor: 'yellow' }, 100, function () {
                        $(id).animate({ backgroundColor: 'white' }, 1000);
                    });
                },
                processForm: function (urlParams) {

                    $("#thinking").show();
                    this.model.fetch({
                        data: {
                            'PropertyId': $('.t-details-container #PropertyId').val(),
                            'UrlBase': window.location.origin + window.location.pathname,
                            'ArrivalDate': this.model.attributes.ArrivalDate,
                            'DepartureDate': this.model.attributes.DepartureDate,
                            'Adults': this.model.attributes.Adults,
                            'Children': this.model.attributes.Children,
                            'RoomType': this.model.attributes.RoomType
                        },
                        success: this.renderYourTrip,
                        error: this.renderYourTripError
                    });
                },
                renderYourTrip: function (data, status) {

                    //TODO: this is work-around for unknown room types in a property. should be removed once property data is improved. 
                    var $propRoomTypes = $('#property-room-types');
                    if ($propRoomTypes.html() != this.model.attributes.RoomTypeHTML) {
                        $propRoomTypes.html(this.model.attributes.RoomTypeHTML)
                    }
                    //TODO: end of work-around.

                    this.model.attributes.ArrivalDate = this.fromUrlDate(this.model.attributes.ArrivalDate);
                    this.model.attributes.DepartureDate = this.fromUrlDate(this.model.attributes.DepartureDate);
                    this.model.attributes.CurrencyCode = CurrencyUtil.convert(this.model.attributes.CurrencyCode);

                    var yourTripTmpl = $("#your-trip-template").html();
                    var template = _.template(yourTripTmpl);
                    console.log(this.model.attributes.RoomType);
                    this.$el.html(template(this.model.attributes));

                    // figure ourt which room dropdown option to default to
                    var roomSelection = this.model.attributes.RoomType;
                    var matchingRoomTypeItem = _.find(this.model.attributes.RoomBookingOptions, function (o) { return o.Value == roomSelection; });

                    if (roomSelection == undefined || matchingRoomTypeItem == undefined)
                    {
                        roomSelection = this.model.attributes.RoomBookingOptions[0].Value;
                    }
                    $('#RoomType').val(roomSelection);

                    // set up the spinners
                    this.buildCustomControls();

                    // go through booking options and forman proces.
                    for (i = 0; i < this.model.attributes.RoomBookingOptions.length ; i++) {

                        var item = this.model.attributes.RoomBookingOptions[i];
                        var avg = CurrencyUtil.formatCurrency(item.AvgPricePerNight);
                        var total = CurrencyUtil.formatCurrency(item.Subtotal);

                        this.model.attributes.RoomBookingOptions[i] = item;

                        if (item.Value == roomSelection) {
                            this.updateCostAndButtons(item);
                        }
                    }

                    $("#thinking").hide();

                    dfd.resolve("hurray");
                },
                updateCostAndButtons: function (unit) {

                    $('.no-rtb-reason-row').hide();
                    $('.no-rtb-reason').hide();

                    $('#lblCostPerNight').text(unit.AvgPricePerNight);
                    $('#lblSubtotalPrice').text(unit.Subtotal);

                    if (unit.AvgPricePerNight == "0.00" || unit.Subtotal == "0.00") {
                        $('.t-details-totals.t-details-price-per-night').hide();
                        $('.t-details-totals.t-details-cost-total').hide();
                    } else {
                        $('.t-details-totals.t-details-price-per-night').show();
                        $('.t-details-totals.t-details-cost-total').show();
                    }


                    var arrivalDate = this.toUrlDate(jQuery('#ArrivalDate').val());
                    var departureDate = this.toUrlDate(jQuery('#DepartureDate').val());
                    var roomType = unit.Value;
                    var propId = this.model.attributes.PropertyId;
                    var nights = this.model.attributes.Nights;
                    var adults = $('input#Adults.trip-detail-spinner').spinner("value");
                    var children = $('input#Children.trip-detail-spinner').spinner("value");
                    var pets = $('input#Pets.trip-detail-spinner').length > 0 ? $('input#Pets.trip-detail-spinner').spinner("value") : 0;

                    var urlParams =  "ArrivalDate="+arrivalDate+
                        "&DepartureDate="+departureDate+
                        "&RoomType="+roomType+
                        "&Nights="+nights+
                        "&PropertyId="+propId+
                        "&Adults=" + adults + "&Children=" + children + "&Pets=" + pets;

                    $("#book-button").attr('href', "/book?" + urlParams);
                    $("#request-button").attr('href', "/request-book?" + urlParams);

                    var RTB = false;
                    var noRtbReasons = [];

                    if (unit.IsRealTimeBookable && unit.AvgPricePerNight > 0) {
                        RTB = true;
                    }

                    var people = adults + children;
                    var minRoomType = Math.floor(people / 2);
                    var roomCapacity = unit.Value == 0 ? 1 : unit.Value;

                    if (roomCapacity < minRoomType) {
                        RTB = false;
                        noRtbReasons.push("OverCapacity");
                    }

                    if (unit.MinLOS > 0 && this.model.attributes.Nights < unit.MinLOS) {
                        RTB = false;
                        noRtbReasons.push("UnderLOS");
                    }

                    if (unit.CMessage == 'LOS violation') {
                        RTB = false;
                        noRtbReasons.push("UnderLOS");
                    }
                    else if (unit.CMessage == 'Lead Days violation')
                    {
                        RTB = false;
                        noRtbReasons.push("LeadViolation");
                    }
                    
                    if (!unit.IsRoomAvailable) {
                        RTB = false;
                    }

                    if (unit.PartialDateMatch) {
                        RTB = false;
                        noRtbReasons.push("PartialDateMatch");
                    }

                    if (!unit.PropertyIsPetFriendly && pets > 0) {
                        RTB = false;
                        noRtbReasons.push("PetsNotAllowed");
                    }

                    if (!unit.PropertyIsPetFriendly) {
                        $('input#Pets.trip-detail-spinner').closest('li').remove();
                    }

                    if (RTB) {
                        $("#book-button").show();
                        $("#request-button").hide();
                        $('#costTax').show();
                        $('#costTotal').show();
                    } else {
                        $("#book-button").hide();
                        $("#request-button").show();
                        $('.no-rtb-reason-row').show();

                        if (noRtbReasons.length > 0) {
                            noRtbReasons.forEach(function (reason, index, array) {
                                $("#" + reason).show();
                            });
                        }
                    }
                },
                renderYourTripError: function (data, status) {
                    console.log(status.responseText);
                    dfd.reject("error" + status.responseText);
                },
                toUrlDate: function (dateStr) {
                    var bits = dateStr.split('/');
                    return bits[2] + "-" + bits[0] + "-" + bits[1];
                },
                fromUrlDate: function (dateStr) {
                    dateStr = dateStr.replace(/[/\(\)]/g, '').replace('Date', '');
                    var date = new Date(Number(dateStr));

                    if (date < new Date())
                        date = new Date();

                    var bits = date.toISOString().slice(0, 10).split('-');
                    return bits[1] + "/" + bits[2] + "/" + bits[0];
                },
                buildCustomControls: function () {

                    var scope = this;
                    var nowTemp = new Date();
                    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

                    var checkin = jQuery('#ArrivalDate').fdatepicker({
                        onRender: function (date) {
                            return date.valueOf() < now.valueOf() ? 'disabled' : '';
                        }
                    }).on('changeDate', function (ev) {
                        if (ev.date.valueOf() > checkout.date.valueOf()) {
                            var newDate = new Date(ev.date)
                            newDate.setDate(newDate.getDate() + 1);
                            checkout.update(newDate);
                        }
                        checkin.hide();
                        jQuery('#DepartureDate')[0].focus();
                    }).data('datepicker');

                    var checkout = jQuery('#DepartureDate').fdatepicker({
                        onRender: function (date) {
                            return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
                        }
                    }).on('changeDate', function (ev) {
                        checkout.hide();
                    }).data('datepicker');

                    var spinners = jQuery('.trip-detail-spinner').spinner({
                        min: 0,
                        max: 20,
                        step: 1,
                        alignment: 'horizontal',
                        icons: {
                            left: "fa fa-minus",
                            right: "fa fa-plus"
                        },
                        spin: function () {
                            // ugly hack to re-validate the form
                            $('#RoomType').change();
                        }
                    })
                    .parent()
                    .find('.ui-spinner-up')
                    .find('span')
                    .parent()
                    .find('.ui-spinner-down')
                    .find('span');

                    jQuery('#RoomType.selectpicker').selectpicker();

                    if (!DOMUtils.is_mobile() & !DOMUtils.is_tablet()) {
                        if (DOMUtils.isNull(document.getElementById('Sticky'))) return false;


                        jQuery(".sticky-wrapper").stick_in_parent({

                            parent: ".t-details",

                            offset_top: jQuery('.sticky-header').height(),

                            recalc_every: 1,

                            bottoming: true

                        });
                    }

                    $(window).scroll(function () {
                        scope.updateStickyClass();
                    });

                    $(window).on('resize', function () {
                        scope._onResize(scope);
                    });

                    $(window).trigger('resize');

                    $(document).on("click", ".toggleTripDetails", function (e) {
                        e.preventDefault();
                        var $this = $(this);
                        $("#trip-details, #your-trip-container").toggleClass('hideTripDetails');
                    });

                },

                _onResize: function (scope) {
                    if (!DOMUtils.isUndefined(document.getElementsByClassName('t-details')[0])) {
                        if (!DOMUtils.is_mobile()) {

                            jQuery('.t-details-container').height('auto');

                            jQuery('.t-details').height(jQuery('.p-detail').height());
                        } else {
                            jQuery('.t-details').height('auto');
                        }

                        scope.updateStickyClass();
                    }
                },

                updateStickyClass: function () {
                    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
                        var fixed = $('.sticky-wrapper').filter(
                              function () {
                                  return $(this).css('position') == 'fixed';
                              }
                            );

                        if (fixed.length) {
                            var containerWidth = $(".two-col-container").width(),
                                windowWidth = $(window).width(),
                                parentPos = $(".t-details").position().left,
                                posLeft = (windowWidth - containerWidth) / 2 + parentPos;

                            $('.sticky-wrapper').css({
                                "left": posLeft
                            });
                        } else {
                            $('.sticky-wrapper').css({
                                "left": 0
                            });
                        }
                    }
                }
            });

            this.yourTripModel = new Model();
            this.yourTripModel.attributes.ArrivalDate = window.DOMUtils.getParameterByName('ArrivalDate');
            this.yourTripModel.attributes.DepartureDate = window.DOMUtils.getParameterByName('DepartureDate');
            this.yourTripModel.attributes.Adults = window.DOMUtils.getParameterByName('Adults');
            this.yourTripModel.attributes.Children = window.DOMUtils.getParameterByName('Children');
            this.yourTripModel.attributes.RoomType = window.DOMUtils.getParameterByName('RoomType');
            this.yourTripView = new View({ model: this.yourTripModel, tagName: "div", el: $("#your-trip") });

            return dfd.promise();
        },


    }

    module.exports = yourtrip || window.yourtrip;

})();

