(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {

    var accorodion = {

        init : function () {

        	if (DOMUtils.isUndefined(document.getElementsByClassName('p-accordion')[0])) return;
			
     			var accToggleBtn = jQuery('.accordion-toggle');

     			var accItems = jQuery('.p-accordion');

     			jQuery('.p-accordion').SimpleAccordion();
   			
        }

    }

    module.exports = accorodion || window.accorodion;

})();

},{}],2:[function(require,module,exports){
(function () {
    var AllLocations = {
        init: function () {
            var selectedTarget = "#" + $(".tab-pane.active").attr("id");

            jQuery('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

                selectedTarget = jQuery(e.target).attr('data-target');
            });

            jQuery('.locations-filter-list .box a').click(function (evt) {
                evt.preventDefault();

                var hash = this.href;

                var target = hash.split('#')[1];

                topA_offset = 80;

                AllLocations.scrollToSection(target, selectedTarget);
            });

            jQuery('.alphabet-mobile').on("change", function (evt) {

                var target = evt.target.value.split('#')[1];

                topA_offset = 50;

                currentPanel = jQuery('.tab-pane').hasClass('active');

                AllLocations.scrollToSection(target, selectedTarget);
            });

        },

        scrollToSection: function (target, selectedTarget) {
            var topA_offset = 80;
            if (jQuery(selectedTarget).find('*[data-group="' + target + '"]').length) {
                TweenMax.to(window, 1, { scrollTo: { y: jQuery(selectedTarget).find('*[data-group="' + target + '"]').offset().top - topA_offset, x: 0 } });
            }
        }
    };

    module.exports = AllLocations || window.AllLocations;
})();
},{}],3:[function(require,module,exports){
(function () {
    var BookingFlow = {

        btnPrint_Click: function (e) {
            e.preventDefault();
            window.print();
        },

        // Confirmation panel, Edit Guest details
        btnEditGuest_Click: function () {
            $("#bookingTab a[href='#tabConfirmation']").parent("li").attr("disabled", "disabled");
            $("#bookingTab a[href='#tabBillingDetails']").parent("li").attr("disabled", "disabled");
            $("#bookingTab a[href='#tabGuestInformation']").tab("show");

            BookingFlow.ScrollToTopOfTabs();
        },

        // Confirmation panel, Edit payment method
        btnEditPayment_Click: function () {
            $("#bookingTab a[href='#tabConfirmation']").parent("li").attr("disabled", "disabled");
            $("#bookingTab a[href='#tabBillingDetails']").tab("show");
            BookingFlow.ScrollToTopOfTabs();
        },

        // Billing Details, Edit Guest Details button
        onBtnGuestInfoEdit_Click: function () {
            $("#bookingTab a[href='#tabBillingDetails']").parent("li").attr("disabled", "disabled");
            $("#bookingTab a[href='#tabGuestInformation']").tab("show");
            if ($("#chkSameAsGuestAddress").prop('checked')) {
                $("#txtBillingAddress").val('');
                $("#txtBillingAddress2").val('');
                $("#txtBillingCity").val('');
                $("#txtBillingState").val('');
                $("#txtBillingZip").val('');
                $("#bCountry").val('');
                $("#chkSameAsGuestAddress").prop('checked', false);
            }

            BookingFlow.ScrollToTopOfTabs();
        },

        btnCompleteBooking_Click: function (fromBtn) {
            var agree = $("#chkAgreeToTerms").is(":checked");
            if (!agree) {
                $("#btnCompleteBooking").addClass("disabled");
                $(".message").text("Please read and agree to Terms and Conditions");
                return;
            }

            $("#btnCompleteBooking").removeClass("disabled");

            $(".message").text("");

            if (fromBtn) {
                var submitData = this.GatherRequestData(false);
                var url = "/api/Booking";
                $.post(url,
                    submitData,
                    function (data) {
                        if (data.Message) {
                            $(".message").text(data.Message);
                            return;
                        }
                        var urlParams = "&first_name="+$("#txtFirstName").val()+
                        "&last_name="+$("#txtLastName").val()+
                        "&address="+$("#txtBillingAddress").val() + " " + $("#txtBillingAddress2").val()+
                        "&zip=" + $("#txtBillingZip").val();
                        window.location.href = data.PaymentProcessorUrl + encodeURI(urlParams);                        
                    },
                    "json");
            }
        },
        // Billing Details tab, Continue to confirm button
        btnBillingDetailsConfirm_Click: function (fromBtn, element) {
            var $currentElement = element;
            var currentTab = "tabBillingDetails";
            var elementArray = BookingFlow.GetAllRequiredAttributes("tabBillingDetails");
            var errorCounter = 0;
            $.each(elementArray, function (i, element) {
                if ($(element).val() == "") {
                    errorCounter += 1;
                }
            });

            if (fromBtn || $currentElement == $("#chkSameAsGuestAddress")) {
                $.each(elementArray, function (i, $currentElement) {
                    BookingFlow.ValidateFormByTab(currentTab, $currentElement);
                });
            } else {
                BookingFlow.ValidateFormByTab(currentTab, $currentElement);
            }

            if (errorCounter == 0) {
                $("#bookingTab a[href='#tabConfirmation']").parent('li').removeClass('disabled');
                $("#btnBillingDetailsConfirm").removeClass("disabled");
                if (fromBtn) {
                    $("#bookingTab a[href='#tabConfirmation']").tab('show');
                    BookingFlow.ScrollToTopOfTabs();
                }

                $(".message").text("");

                $("#guestTitle2").text($("#sTitle").val());
                $("#guestFirstName2").text($("#txtFirstName").val());
                $("#guestLastName2").text($("#txtLastName").val());
                $("#guestAddress2-2").text($("#txtAddressLine1").val());
                $("#guestCity2").text($("#txtCity").val());
                $("#guestCountry2").text($("#bCountry").val());
                $("#guestZip2").text($("#txtZip").val());

                $("#lblguestTitle").text($("#sTitle").val());
                $("#lblguestFirstName").text($("#txtFirstName").val());
                $("#lblguestLastName").text($("#txtLastName").val());
                $("#lblguestAddress").text($("#txtBillingAddress").val() + " " + $("#txtBillingAddress2").val());
                $("#lblguestCity").text($("#txtBillingCity").val());
                $("#lblguestCountry").text($("#bCountry").val());
                $("#lblguestZip").text($("#txtBillingZip").val());


            } else {
                $("#btnBillingDetailsConfirm").addClass("disabled");
                $("#bookingTab a[href='#tabConfirmation']").parent('li').addClass('disabled');
                if (fromBtn) {
                    $(".message").text("Please fill out all the required fields.");
                }
            }
        },

        // Guest Information tab, Continue to Billing button

        UpdateBookingDetail: function (fromBtn, element) {
            var $currentElement = element;
            var currentTab = "tabGuestInformation";
            var elementArray = BookingFlow.GetAllRequiredAttributes(currentTab);
            var errorCounter = 0;

            $.each(elementArray, function (i, element) {
                if ($(element).val() == "" || $(element).val() == null) {
                    errorCounter += 1;
                }
            });

            if (fromBtn) {
                $.each(elementArray, function (i, $currentElement) {
                    BookingFlow.ValidateFormByTab(currentTab, $currentElement);
                });
            } else {
                BookingFlow.ValidateFormByTab(currentTab, $currentElement);
            }

            if (errorCounter == 0 && BookingFlow.validateEmail($("#txtEmail").val()) && BookingFlow.validateEmail($("#txtConfirmEmail").val())) {
                if ($("#txtEmail").val() != $("#txtConfirmEmail").val()) {
                    $(".message").text("Email and Confirm email must match");
                    $("#btnUpdateBookingDetail").addClass("disabled");
                    $("#bookingTab a[href='#tabBillingDetails']").parent("li").addClass("disabled");
                    return;
                }

                $("#guestTitle").text($("#sTitle").val());
                $("#guestFirstName").text($("#txtFirstName").val());
                $("#guestLastName").text($("#txtLastName").val());
                $("#guestAddress").text($("#txtAddressLine1").val());
                $("#guestAddress2").text($("txtAddressLine2").val());
                $("#guestCity").text($("#txtCity").val());
                $("#guestCountry").text($("#sCountry").val());
                $("#guestZip").text($("#txtZip").val());
                $("#bookingTab a[href='#tabBillingDetails']").parent("li").removeClass("disabled");
                $("#btnUpdateBookingDetail").removeClass("disabled");

                if (fromBtn) {
                    $("#bookingTab a[href='#tabBillingDetails']").tab("show");
                    BookingFlow.ScrollToTopOfTabs();
                }

                $(".message").text("");
            } else {
                if (fromBtn) {
                    $(".message").text("Please fill out all the required fields.");
                }
                $("#btnUpdateBookingDetail").addClass("disabled");
                $("#bookingTab a[href='#tabBillingDetails']").parent("li").addClass("disabled");
            }
        },

        ScrollToTopOfTabs: function () {
            if ($(".btnDetails").is(":visible") || $(".desktop-search").is(":visible")) {
                TweenMax.to(window, 1, { scrollTo: { y: 0, x: 0 } });
            } else {
                var offSetAmount = $("#your-trip-container").height();
                var headerHeight = $(".sticky-header").height();
                //Timer Needed for Mobile
                setTimeout(function () {
                    TweenMax.to(window, 1, { scrollTo: { y: offSetAmount + headerHeight, x: 0 } });
                }, 200);

            }
        },

        ValidateFormByTab: function (currentTab, $currentElement) {
            //if (currentTab != "tabConfirmation") {
            $("#bookingForm").submit(function (e) {
                e.preventDefault();
            });
            $("#requestForm").submit(function (e) {
                e.preventDefault();
            });
            //}
            var $currentElement = $($currentElement);
            if ($currentElement.val() == "" || $currentElement.val() == null) {
                $currentElement.addClass("error");
            } else {
                if ($currentElement.is("input[type=email]")) {
                    if (BookingFlow.validateEmail($currentElement.val()) && $("#txtEmail").val() === "" || BookingFlow.validateEmail($currentElement.val()) && $("#txtConfirmEmail").val() === "" || BookingFlow.validateEmail($currentElement.val()) && $("#txtEmail").val() === $("#txtConfirmEmail").val()) {
                        $currentElement.removeClass("error");
                        if ($("#txtEmail").val() === $("#txtConfirmEmail").val()) {
                            $("#txtEmail, #txtConfirmEmail").removeClass("error");
                        }
                    } else {
                        $currentElement.addClass("error");
                    }
                } else {
                    $currentElement.removeClass("error");
                }
            }
        },

        // Load Booking trip details information
        GetBookingTripDetails: function (promoCode) {
            var url = "/api/Booking";
            if (promoCode) {
                window.queryStrings.PromoCode = promoCode;
            }
            $.ajax({
                url: url,
                type: "PUT",
                data: window.queryStrings,
                success: function (data) {
                    $("#lblHotelName").text(data.Name);
                    $("#lblHotelAddress").text(data.Address1);
                    $("#lblHotelAddress").text(BookingFlow.FormatAddress(data));
                    $("#lblCheckIn").text(data.CheckInDate);
                    $("#lblCheckInTime").text(data.CheckInTime);
                    $("#lblCheckOut").text(data.CheckOutDate);
                    $("#lblCheckOutTime").text(data.CheckOutTime);
                    $("#lblPricePerNight").text(data.PricePerNightFormatted);
                    $("#lblLengthOfStay").text(data.LengthOfStay);
                    $("#lblTotalAccomodation").text(data.TotalAccomodationFormatted);
                    $("#lblTax").text(data.TaxFormatted);
                    $("#lblFees").text(data.FeesFormatted);
                    $("#lblTotalPrice").text(data.TotalDueFormatted);
                    $("#imgRoom").attr("src", data.ImageUrl);
                    $("#imgRoom").attr("alt", "Bridgestreet Property - " + data.Name);
                    $("#lblPromoCodeMessage").text(data.PromoCodeMessage);
                },
                dataType: "json"
            });
        },

        // Get Formatted address
        FormatAddress: function (data) {
            var addr = data.Address1;
            if (data.Address2) addr += " " + data.Address2;
            if (data.City) addr += " " + data.City;
            if (data.StateCounty) addr += " " + data.StateCounty;
            if (data.Country) addr += " " + data.Country;
            if (data.ZipPostal) addr += " " + data.ZipPostal;
            return addr;
        },

        // Get required attributes by ID
        GetAllRequiredAttributes: function (parentid) {
            var elementArray = [];

            $("#" + parentid + " input[required], #" + parentid + " select[required]")
                .each(function (i) {
                    elementArray[i] = this;
                });
            return elementArray;
        },

        ApplyPromo: function () {
            var promoCode = $("#txtPromoCode").val();
            if (!promoCode) return;

            BookingFlow.GetBookingTripDetails(promoCode);
        },

        // Validate for numeric key
        isNumberKey: function (evt) {
            var charCode = (evt.which) ? evt.which : event.keyCode;
            if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
                return false;
            }

            if (charCode == 46) {
                if (evt.srcElement.value.indexOf('.') > -1) {
                    return false;
                }
            }

            return true;
        },

        // Validate email
        validateEmail: function (email) {
            var reg =
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (reg.test(email)) {
                return true;
            } else {
                return false;
            }
        },

        // Validate email address
        Email: function (email) {
            if (email.indexOf('Email Address') < 0 && !BookingFlow.validateEmail(email))
                $("#message").text("Please enter a valid email.");
            else
                $("#message").text("");
        },

        PreventTabClick: function (e) {
            if ($(this).parent('li').hasClass('disabled')) {
                e.preventDefault();
                return false;
            }
        },

        CopyBillingAddress: function (element) {
            if (!element.is(':checked')) {
                $("#txtBillingAddress").val('');
                $("#txtBillingAddress2").val('');
                $("#txtBillingCity").val('');
                $("#txtBillingState").val('');
                $("#txtBillingZip").val('');
                $("#bCountry").val('');
                return;
            }

            $("#txtBillingAddress").val($("#txtAddressLine1").val());
            $("#txtBillingAddress2").val($("#txtAddressLine2").val());
            $("#txtBillingCity").val($("#txtCity").val());
            $("#txtBillingState").val($("#txtState").val());
            $("#txtBillingZip").val($("#txtZip").val());
            //$("#txtBillingCountry").val($("#sCountry").val());
            $("#bCountry").val($("#sCountry").val());
        },

        ToggleTripDetails: function ($this) {
            $("#trip-details, #your-trip-container").toggleClass('hideTripDetails');
        },

        Init: function () {

            $(".form-container, .btn-search").css('display', 'none');
            $("#btnPrint").on("click", BookingFlow.btnPrint_Click);
            $(".disabled").on("click", function (e) {
                e.preventDefault();
            });
            if (window.queryStrings.SessionId) {

                $("#bookingTab a[href='#tabStartPacking']").parent("li").removeAttr("disabled");
                $("#bookingTab a[href='#tabStartPacking']").tab("show");
                $("#bookingTab a[href='#tabGuestInformation']").parent("li").attr("disabled", "disabled");
                $("#bookingTab a[href='#tabGuestInformation']").parent("li").addClass("disabled");
                $("#bookingTab a[href='#tabBillingDetails']").parent("li").attr("disabled", "disabled");
                $("#bookingTab a[href='#tabConfirmation']").parent("li").attr("disabled", "disabled");
                BookingFlow.ScrollToTopOfTabs();
                $("#accomodation_container").hide();
                $("#btnEditTrip").hide();
                $("#important_dates_container").show();

                return BookingFlow.InitFinalStep();
            }

            $("#bookingTab a").on('click', BookingFlow.PreventTabClick);

            $("#txtPromoCode").on('keyup', function () {
                var val = $("#txtPromoCode").val();
                if (val) {
                    $("#btnApplyPromo").removeClass("disabled");
                } else {
                    $("#btnApplyPromo").addClass("disabled");
                }

            });

            $(document).on("change", "#chkSameAsGuestAddress", function () {
                var element = $(this);
                BookingFlow.CopyBillingAddress(element);
                BookingFlow.btnBillingDetailsConfirm_Click(false, element);
            });

            
            $("#btnEditGuest").on("click", BookingFlow.btnEditGuest_Click);
            $("#btnEditPayment").on("click", BookingFlow.btnEditPayment_Click);
            $(document).on("click", "#btnCompleteBooking", function () {
                BookingFlow.btnCompleteBooking_Click(true);
            });
            $(document).on("blur", "#tabConfirmation input:radio", function () {
                BookingFlow.btnCompleteBooking_Click(false);
            });
            $(document).on("change", "#chkAgreeToTerms", function () {
                BookingFlow.btnCompleteBooking_Click(false);
            });
            $(document).on("click", "#btnUpdateBookingDetail", function () {
                var element = $(this);
                BookingFlow.UpdateBookingDetail(true, element);
            });
            $(document).on("keyup", "#tabGuestInformation input", function () {
                var element = $(this);
                BookingFlow.UpdateBookingDetail(false, element);
            });
            $(document).on('change', "#sCountry, #sTitle", function () {
                var element = $(this);
                BookingFlow.UpdateBookingDetail(false, element);
            });
            $(document).on("click", "#btnBillingDetailsConfirm", function () {
                BookingFlow.btnBillingDetailsConfirm_Click(true);
            });
            $(document).on("keyup", "#tabBillingDetails input", function () {
                var element = $(this);
                BookingFlow.btnBillingDetailsConfirm_Click(false, element);
            });
            $(document).on("keypress", "#txtMobileNumber", function (event) {
                return BookingFlow.isNumberKey(event);
            });
            $(document).on("keyup", "#txtEmail, #txtConfirmEmail", function () {
                BookingFlow.Email($(this).val());
            });
            $(document).on("click", ".toggleTripDetails", function (e) {
                e.preventDefault();
                var $this = $(this);
                BookingFlow.ToggleTripDetails($this);
            });
            $("#btnGuestInfoEdit").on("click", BookingFlow.onBtnGuestInfoEdit_Click);
            $("#btnApplyPromo").on("click", BookingFlow.ApplyPromo);
            $("#txtPromoCode").val(window.queryStrings.PromoCode);
            BookingFlow.GetBookingTripDetails();
        },

        InitFinalStep: function () {
            var url = "/api/Booking";
            $.ajax({
                url: url,
                type: "GET",
                data: { sessionId: window.queryStrings.SessionId },
                success: function (data) {
                    $("#lblHotelName").text(data.TripInfo.Name);
                    $("#lblHotelAddress").text(data.TripInfo.Address1);
                    $("#lblHotelAddress").text(BookingFlow.FormatAddress(data.TripInfo));
                    $("#lblCheckIn").text(data.TripInfo.CheckInDate);
                    $("#lblCheckInTime").text(data.TripInfo.CheckInTime);
                    $("#lblCheckOut").text(data.TripInfo.CheckOutDate);
                    $("#lblCheckOutTime").text(data.TripInfo.CheckOutTime);
                    $("#lblPricePerNight").text(data.TripInfo.PricePerNightFormatted);
                    $("#lblLengthOfStay").text(data.TripInfo.LengthOfStay);
                    $("#lblTotalAccomodation").text(data.TripInfo.TotalAccomodationFormatted);
                    $("#lblTax").text(data.TripInfo.TaxFormatted);
                    $("#lblFees").text(data.TripInfo.FeesFormatted);
                    $("#lblTotalPrice").text(data.TripInfo.TotalDueFormatted);
                    $("#imgRoom").attr("src", data.TripInfo.ImageUrl);
                    $("#imgRoom").attr("alt", "Bridgestreet Property - " + data.TripInfo.Name);

                    if (data.BookingSuccessful) {

                        $("#booking-form #reservation-number-span").text(data.ReservationNumber);

                        ga('require', 'ecommerce');
                        ga('ecommerce:addTransaction', {
                            'id': data.ReservationNumber,                             // Transaction ID. Required.
                            'affiliation': data.TripInfo.Name,    // Affiliation or store name.
                            'revenue': data.TripInfo.TotalDue,                        // Grand Total.
                            'shipping': '0',                                            // Shipping.
                            'tax': data.TripInfo.Tax,   // Tax.
                            'currency': data.TripInfo.CurrencyCode   // local currency code.
                        });

                        ga('ecommerce:addItem', {
                            'id': data.ReservationNumber,                             // Transaction ID. Required.
                            'name': data.TripInfo.Name,           // Product name. Required.
                            'sku': data.TripInfo.PropertyId,              // SKU/code.
                            'category': 'Serviced Aparment',                            // Category or variation.
                            'price': data.TripInfo.PricePerNight,                           // Unit price.
                            'quantity': '1',                                            // Quantity.
                            'currency': data.TripInfo.CurrencyCode     // local currency code.
                        });


                        ga('ecommerce:send');

                        ga('ecommerce:clear');

                        ga('send', 'pageview', '/booking-confirmation.html');

                        var google_conversion_id = 1067780912;
                        var google_conversion_language = "en";
                        var google_conversion_format = "2";
                        var google_conversion_color = "ffffff";
                        var google_conversion_label = "ojIpCIyb9QEQsJaU_QM";
                        var google_conversion_value = data.TripInfo.TotalDue;
                        var google_conversion_currency = data.TripInfo.CurrencyCode;

                        $.getScript('//www.googleadservices.com/pagead/conversion.js');

                        var image = new Image(1, 1);
                        image.src = "http://www.googleadservices.com/pagead/conversion/1067780912/?value=" + data.TripInfo.TotalDue + "&conversion_currency=" + data.TripInfo.CurrencyCode + "&label=ojIpCIyb9QEQsJaU_QM&amp;guid=ON&amp;script=0";
                    }
                    else {
                        $('#tabStartPacking').text("Your reservation could not be completed due to a bad credit card number or a timeout in the payment window.");
                    }
                    
                },
                dataType: "json"
            });
        },

        // ___                      _     ___           _   _           
        //| _ \___ __ _ _  _ ___ __| |_  | _ ) ___  ___| |_(_)_ _  __ _ 
        //|   / -_) _` | || / -_|_-<  _| | _ \/ _ \/ _ \ / / | ' \/ _` |
        //|_|_\___\__, |\_,_\___/__/\__| |___/\___/\___/_\_\_|_||_\__, |
        //           |_|                                          |___/ 

        btnRequestContinueToReview_Click: function (fromBtn, element) {
            var $currentElement = element;
            var currentTab = "tabGuestInformation";
            var elementArray = BookingFlow.GetAllRequiredAttributes(currentTab);
            var errorCounter = 0;
            $.each(elementArray,
            function (i, element) {
                if ($(element).val() == "" || $(element).val() == null) {
                    errorCounter += 1;
                }
            });

            if (fromBtn) {
                $.each(elementArray, function (i, $currentElement) {
                    BookingFlow.ValidateFormByTab(currentTab, $currentElement);
                });
            } else {
                BookingFlow.ValidateFormByTab(currentTab, $currentElement);
            }

            if (errorCounter == 0 && BookingFlow.validateEmail($("#txtEmail").val()) && BookingFlow.validateEmail($("#txtConfirmEmail").val())) {
                if ($("#txtEmail").val() != $("#txtConfirmEmail").val()) {
                    $(".message").text("Email and Confirm email must match");
                    $("#bookingTab a[href='#tabReviewDetails']").parent('li').addClass('disabled');
                    $("#btnRequestContinueToReview").addClass("disabled");
                    return;
                }

                $("#guestTitle").text($("#sTitle").val());
                $("#guestFirstName").text($("#txtFirstName").val());
                $("#guestLastName").text($("#txtLastName").val());
                $("#guestAddress").text($("#txtAddressLine1").val() + " " + $("#txtAddressLine2").val());
                $("#guestCity").text($("#txtCity").val());
                $("#guestState").text($("#txtState").val());
                $("#guestCountry").text($("#sCountry").val());
                $("#guestZip").text($("#txtZip").val());

                $("#bookingTab a[href='#tabReviewDetails']").parent('li').removeClass('disabled');
                $("#btnRequestContinueToReview").removeClass("disabled");

                if (fromBtn) {
                    $("#bookingTab a[href='#tabReviewDetails']").tab('show');
                    BookingFlow.ScrollToTopOfTabs();
                }

                $(".message").text("");
            } else {
                if (fromBtn) {
                    $(".message").text("Please fill out all the required fields.");
                }

                $("#btnRequestContinueToReview").addClass("disabled");
                $("#bookingTab a[href='#tabReviewDetails']").parent('li').addClass('disabled');
            }
        },

        btnGuestInfoEdit_Click: function () {
            $("#bookingTab a[href='#tabReviewDetails']").parent('li').attr("disabled", "disabled");
            $("#bookingTab a[href='#tabGuestInformation']").tab('show');
            BookingFlow.ScrollToTopOfTabs();
        },

        btnRequestCompleteRequest_Click: function (fromBtn) {
            // ToDo: Validate Dates/Adults/Room Type etc
            var agree = $("#chkAgreeToTermsRequest").is(":checked");
            if (!agree) {
                $("#btnRequestCompleteRequest").addClass("disabled");
                $(".message").text("Please read and agree to Terms and Conditions");
                return;
            }
            $("#btnRequestCompleteRequest").removeClass("disabled");
            $(".message").text("");

            if (fromBtn) {
                ga('send', 'event', 'Create Booking', 'Create Booking', 'Click');
                var submitData = this.GatherRequestData(true);
                var url = "/api/Booking";
                $.post(url,
                    submitData,
                    function (data) {
                        if (data.Message) {
                            $(".message").text(data.Message);
                            return;
                        }
                        var name = $("#sTitle").val() + " " + $("#txtFirstName").val() + " " + $("#txtLastName").val();
                        $("#lblNameConfirmation").text(name);
                        $("#request-reservation-number").text(data.ReservationNumber);
                        $("#bookingTab a[href='#tabGuestInformation']").parent('li').attr("disabled", "disabled");
                        $("#bookingTab a[href='#tabReviewDetails']").parent('li').attr("disabled", "disabled");
                        $("#bookingTab a[href='#tabConfirmation']").parent('li').removeAttr('disabled');
                        $("#bookingTab a[href='#tabConfirmation']").tab('show');
                        $(".message").text("");
                        setTimeout(function () {
                            BookingFlow.ScrollToTopOfTabs();
                        }, 200);
                    },
                    "json");
            }

        },
        GatherRequestData: function (isRequest) {

            var submitData = {

                IsRequest: isRequest,
                Title: $("#sTitle").val(),
                FirstName: $("#txtFirstName").val(),
                LastName: $("#txtLastName").val(),
                Address1: $("#txtAddressLine1").val(),
                Address2: $("#txtAddressLine2").val(),
                City: $("#txtCity").val(),
                StateCounty: $("#txtState").val(),
                ZipPost: $("#txtZip").val(),
                Country: $("#sCountry").val(),
                MobileNumber: $("#txtMobileNumber").val(),
                EmailAddress: $("#txtEmail").val(),
                CompanyName: $("#txtCompanyName").val(),
                CompanyWebsite: $("#txtWebsite").val(),
                HowDidYouHearAboutUs: $("#sContactSource").val(),
                Comments: $("#txtComments").val(),
                PropertyId: window.queryStrings.PropertyId,
                FromDate: window.queryStrings.FromDate,
                ToDate: window.queryStrings.ToDate,
                RoomType: window.queryStrings.RoomType,
                NumberOfAdults: window.queryStrings.NumberOfAdults,
                NumberOfPets: window.queryStrings.NumberOfPets,
                PromoCode: $("#txtPromoCode").val()
            };

            if (!isRequest) {
                submitData.ContactMethod = $("input [name='ContactMethod']").val();
                submitData.BillingAddress1 = $("#txtBillingAddress").val();
                submitData.BillingAddress2 = $("#txtBillingAddress2").val();
                submitData.BillingCity = $("#txtBillingCity").val();
                submitData.BillingStateCounty = $("#txtBillingState").val();
                submitData.BillingZipPost = $("#txtBillingZip").val();
                submitData.BillingCountry = $("#bCountry").val();
                //submitData.PurposeOfTrip = $("#").val(),
                submitData.CreditCardNumber = $("#txtCardNumber").val();
                submitData.NameOnCard = $("#txtNameOnCard").val();
                submitData.ExpMonth = $("#txtExpirationMonth").val();
                submitData.ExpYear = $("#txtExpirationYear").val();
                submitData.CVV = $("#txtCVV").val();
                //submitData.EmailBillingCopyTo = $("#txtPromoCode").val();
                submitData.Rate =
                {
                    Rate: $("#lblPricePerNight").text().replace(/[^\d\.]/g, ''),
                    Tax: $("#lblTax").text().replace(/[^\d\.]/g, ''),
                    SubTotal: $("#lblTotalAccomodation").text().replace(/[^\d\.]/g, ''),
                    Total: $("#lblTotalPrice").text().replace(/[^\d\.]/g, '')
                };

            }

            return submitData;
        },

        InitRequest: function () {
            if (window.queryStrings.ReservationToken) {
                $("#bookingTab a[href='#tabGuestInformation']").parent('li').attr("disabled", "disabled");
                $("#bookingTab a[href='#tabReviewDetails']").parent('li').attr("disabled", "disabled");
                $("#bookingTab a[href='#tabConfirmation']").parent('li').removeAttr('disabled');
                $("#bookingTab a[href='#tabConfirmation']").tab('show');
                $.get("/api/BookingRequest?reservationToken=" + window.queryStrings.ReservationToken, null, function (data) {
                    $("#lblNameConfirmation").text(data.TripInfo.Name);
                    $("#request-reservation-number").text(data.ReservationNumber);
                    $("#lblCheckIn").text(data.TripInfo.CheckInDate);
                    $("#lblCheckInTime").text(data.TripInfo.CheckInTime);
                    $("#lblCheckOut").text(data.TripInfo.CheckOutDate);
                    $("#lblCheckOutTime").text(data.TripInfo.CheckOutTime);
                    $(".message").text("");
                });
                return;
            }

            $(".form-container, .btn-search").css('display', 'none');

            $("#bookingTab a").on('click', BookingFlow.PreventTabClick);
            $("#btnApplyPromo").on("click", BookingFlow.ApplyPromo);
            $(document).on('click', "#btnRequestCompleteRequest", function () {
                BookingFlow.btnRequestCompleteRequest_Click(true);
            });
            $(document).on('change', "#chkAgreeToTermsRequest", function () {
                BookingFlow.btnRequestCompleteRequest_Click(false);
            });
            $("#btnGuestInfoEdit").on('click', BookingFlow.btnGuestInfoEdit_Click);
            $("#txtCheckInDate").val(window.queryStrings.FromDate);
            $("#txtCheckOutDate").val(window.queryStrings.ToDate);
            $("#txtNumberOfAdults").val(window.queryStrings.NumberOfAdults);
            $("#txtNumberOfPets").val(window.queryStrings.NumberOfPets);
            $("#ddRoomType").val(window.queryStrings.RoomType);
            $("#txtNumberOfChildren").val(window.queryStrings.NumberOfChildren);
            $("#txtNumberOfBathrooms").val(window.queryStrings.NumberOfPets);

            $(document).on('click', "#btnRequestContinueToReview", function () {
                BookingFlow.btnRequestContinueToReview_Click(true);
            });
            $(document).on('keyup', "#tabGuestInformation input", function () {
                var element = $(this);
                BookingFlow.btnRequestContinueToReview_Click(false, element);
            });
            $(document).on('change', "#sCountry, #sTitle", function () {
                var element = $(this);
                BookingFlow.btnRequestContinueToReview_Click(false, element);
            });
            $(document).on("keypress", "#txtMobileNumber", function (event) {
                return BookingFlow.isNumberKey(event);
            });
            $(document).on("keyup", "#txtEmail, #txtConfirmEmail", function () {
                BookingFlow.Email($(this).val());
            });
            $(document).on("click", ".toggleTripDetails", function (e) {
                e.preventDefault();
                var $this = $(this);
                BookingFlow.ToggleTripDetails($this);
            });
            BookingFlow.GetBookingTripDetails();
        }
    }

    module.exports = BookingFlow || window.BookingFlow;
})();
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
(function () {
    var ContactUsForm = {
        init: function () {
            var scope = this;

            $("#panel-contact-us-form").submit(function (event) {
                /* stop form from submitting normally */
                event.preventDefault();
            });

            if (location.search.indexOf('?') >= 0) {
                var a = decodeURI(location.search).replace(/^\?/, '').replace(/=/g, ': ').replace(/([A-Z])/g, ' $1').split('&');
                $('#Comments').val("I tried searching for properties with the following criteria and didn't receive any property results:\n  - " + a.join("\n  - "));
            }

            $("#btnSubmit").on('click', function () {
                $("#panel-contact-us-form").validate();
                scope.btnSubmit_Click(scope);
            });
            
        },

        btnSubmit_Click: function (scope) {
            if (!$("#panel-contact-us-form").valid()) {
                return false;
            }

            var rc = grecaptcha.getResponse();
            if (!rc) {
                $("#recaptcha-error").show();
                return false;
            } else {
                $("#recaptcha-error").hide();
            }

            var contactMethod = scope.GetListValues("ContactMethod");

            var data = {
                FirstName: $("#FirstName").val(),
                LastName: $("#LastName").val(),
                MobileNumber: $("#MobileNumber").val(),
                EmailAddress: $("#EmailAddress").val(),
                Company: $("#Company").val(),
                Location: $("#Location").val(),
                FeedbackType: $("#FeedbackType").val(),
                Comments: $("#Comments").val(),
                Subject: $("#Subject").val(),
                ContactMethod: contactMethod,
                RecaptchaResponse: rc,
                FormType: $("#FormType").val()
            };

            $("#panel-contact-us-form").hide();
            $("#panel-thank-you-message").fadeIn(290);

            var offsetTop = $("#panel-thank-you-message").offset().top;

            $('html, body').animate({
                scrollTop: offsetTop - 110
            }, 400);

            $.post('/api/ContactUs', data, function (ret) { });
            return false;
        },

        GetListValues: function (listName) {
            var selector = "input[name=" + listName + "]:checked";
            var checkedCheckboxes = $(selector);
            var checked = [];
            checkedCheckboxes.each(function () {
                var value = $(this).val();
                checked.push(value);
            });

            return checked.toString();
        }
    }

    module.exports = ContactUsForm || window.ContactUsForm;

})();
},{}],6:[function(require,module,exports){
(function () {

    var propertyDetailCarousel = {

        init: function () {

            if (DOMUtils.isUndefined(document.getElementsByClassName('product-detail-carousel')[0])) return;


            var mySwiper = new Swiper('.c-horizontal', {

                direction: 'horizontal',

                slidesPerView: "auto",

                autoHeight: true,

                centeredSlides: true,

                spaceBetween: 1,

                loop: true,

                speed: 500,

                initialSlide: 0,

                slideToClickedSlide: false,

                nextButton: '.c-next',

                prevButton: '.c-prev',

                onInit : function (e) {

                    window.setTimeout(function() {

                        console.log('resizing swiper after 500ms');
                        
                        e.onResize();

                    }, 300);

                }

            });

        }

    }

    module.exports = propertyDetailCarousel || window.propertyDetailCarousel;

})();
},{}],7:[function(require,module,exports){
var CurrencyUtil = require('../utils/BRIDGESTREET.currency.js');

(function () {
    var $window = $(window);
    var relatedproperties = {
        relatedProperties: null,
        relatedPropertiesView: null,
        relatedPropertiesModel: null,
        init: function () {

            if (DOMUtils.isUndefined(document.getElementById('related-properties'))) return;

            var dfd = jQuery.Deferred();

            var Model = Backbone.Model.extend({ url: '/related-properties.json' });

            var View = Backbone.View.extend({
                initialize: function () {
                    _.bindAll(this, "renderRelatedProperties"); // make sure 'this' refers to this View in the success callback below

                    this.model.fetch({
                        data: { 'PropertyId': $('.related-properties #PropertyId').val() },
                        success: this.renderRelatedProperties,
                        error: this.renderRelatedPropertiesError
                    });
                },
                renderRelatedProperties: function (data, status) {
                    var properties = [];

                    for (var key in this.model.attributes) {
                        var item = this.model.attributes[key];

                        if (item.MinRate > 0) {
                            item.CurrencyCode = CurrencyUtil.convert(item.CurrencyCode);
                            item.MinRate = CurrencyUtil.formatCurrency(item.MinRate);
                        }

                        item.URL += window.location.search;

                        properties.push(item);
                    }

                    var relatedPropertiesTmpl = $("#related-properties-template").html();
                    var template = _.template(relatedPropertiesTmpl);
                    this.$el.html(template({ Properties: properties }));

                    DOMUtils.resizeForOldBrowsers();
                    dfd.resolve("hurray");
                },
                renderRelatedPropertiesError: function (data, status) {
                    console.log(status.responseText);
                    dfd.reject("error" + status.responseText);
                }
            });

            this.relatedPropertiesModel = new Model();
            this.relatedPropertiesView = new View({ model: this.relatedPropertiesModel, tagName: "div", el: $("#related-properties") });
            return dfd.promise();
        }
    }

    module.exports = relatedproperties || window.relatedproperties;

})();


},{"../utils/BRIDGESTREET.currency.js":30}],8:[function(require,module,exports){
var CurrencyUtil = require('../utils/BRIDGESTREET.currency.js');

(function () {

    var yourtrip = {
        yourTrip: null,
        yourTripView: null,
        yourTripModel: null,
        init: function () {

            if (DOMUtils.isUndefined(document.getElementById('your-trip'))) return;

            var dfd = jQuery.Deferred();

            var Model = Backbone.Model.extend({ url: '/your-trip.json' });

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


},{"../utils/BRIDGESTREET.currency.js":30}],9:[function(require,module,exports){
(function () {
    var featuredPropertyPod = {
        init: function () {
            if ($('.property-pod'))
                DOMUtils.resizeForOldBrowsers();
        }
    }
    module.exports = featuredPropertyPod || window.featuredPropertyPod;

})();



},{}],10:[function(require,module,exports){
var CalendarUtil = require('../utils/BRIDGESTREET.calendarcontrol.js');

(function () {

    var globalSearchDaterange = {
        desktopRange: null,
        mobileRange: null,
        topSearchRange: null,
        arrival: new Date(),
        departure: new Date(),
        init: function (search) {
            var scope = this;
            if (search.date != null) {
                scope.arrival = search.date.arrival;
                scope.departure = search.date.departure;
            }

            var sharedCalOptions = {
                theme: 'material',
                animate: false,
                min: new Date(),
                weekDays: 'short',
                dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                showSelector: false,
                yearChange: false,
                buttons: [],
                defaultValue: [scope.arrival, scope.departure],
                onMarkupReady: function (event, inst) {
                    var $ = mobiscroll.$,
                        markup = $(event.target);
                    markup.find('.mbsc-fr-c').append(CalendarUtil.getMarkup());
                    CalendarUtil.set(inst);
                },
                onSetDate: function (event, inst) {
                    if (event.control == 'calendar') {
                        CalendarUtil.update(inst, event);
                    }
                },
                onSet: function (event, inst) {
                    // save the date and ensure that the other control is updated
                    scope.arrival = inst._startDate;
                    scope.departure = inst._endDate;

                    if (inst == scope.desktopRange || inst == scope.topSearchRange)
                        scope.mobileRange.setVal([scope.arrival, scope.departure], true);
                    else
                        scope.desktopRange.setVal([scope.arrival, scope.departure], true);
                        scope.topSearchRange.setVal([scope.arrival, scope.departure], true);
                }
            };

            var desktopCalOptions = _.clone(sharedCalOptions);
            desktopCalOptions.display = 'bubble';
            desktopCalOptions.months = 2;
            desktopCalOptions.calendarWidth = 742;

            var mobileCalOptions = _.clone(sharedCalOptions);
            mobileCalOptions.display = 'bottom';
            mobileCalOptions.months = 1;

            var self = this;

            this.desktopRange = mobiscroll.range('#check_in_date', desktopCalOptions);
            this.mobileRange = mobiscroll.range('#check_in_date_mobile', mobileCalOptions);

            setTimeout(function () {
                self.topSearchRange = mobiscroll.range('#topsearch-check_in_date', desktopCalOptions);
            }, 500, this);

            if (search.date != null && scope.arrival != null && scope.departure != null) {
                this.desktopRange.setVal([scope.arrival, scope.departure], true);
                this.mobileRange.setVal([scope.arrival, scope.departure], true);
                setTimeout(function () {
                    self.topSearchRange.setVal([scope.arrival, scope.departure], true);
                }, 500, this);
            }

            this.initListeners();

            return scope;
        },

        initListeners: function () {
            var scope = this;
            $(window).on('resize', { self: this }, scope.resizeBrowser);
        },

        resizeBrowser: function () {
            if (document.getElementById('check_in_date')) {
                DOMUtils.fitToPlaceholder("check_in_date");
            }
        },
        show: function () {
            if (DOMUtils.is_mobile()) {
                this.mobileRange.show();
            } else {
                if ($('#topsearch-check_in_date')) {
                    this.topSearchRange.show();
                } else {
                    this.desktopRange.show();
                }
            }
        }
    };

    module.exports = globalSearchDaterange || window.globalSearchDaterange;

})();

},{"../utils/BRIDGESTREET.calendarcontrol.js":29}],11:[function(require,module,exports){
var CalendarUtil = require('../utils/BRIDGESTREET.calendarcontrol.js');
var DateFormat = require('../utils/BRIDGESTREET.date.format.js');
var BSgloballocationsearch = require('./BRIDGESTREET.global.search.location.js');
var BSglobalguests = require('./BRIDGESTREET.global.search.guests.js');
var BSglobaldaterange = require('./BRIDGESTREET.global.search.daterange.js');

var globalgosearch = (function (app, parent, dateFormat, guests, document) {


    var search = {
        location: null,
        date: null,
        guests: null
    };
    return {
        init: function () {
            var self = this;

            if (!$('.btn-search').length) return;

            this.populateSearchControls();

            jQuery('#searchbox-form .btn-search').on("click", this._issueSearch);
            jQuery('.mobileSearchButton').on("click", this._issueSearch);

            setTimeout(function () {
                jQuery('#top-search-box .topsearchbox__button-wrapper').on("click", self._issueSearch);
            }, 500);
        },

        _issueSearch: function (evt) {
            console.log('issueSearch');
            console.dir(search);
            var locationInputID = '';

            if (DOMUtils.is_mobile() || DOMUtils.is_tablet()) {
                locationInputID = '#searchKeywordsMobile';
            } else {
                console.log('has topsearch', $('#topsearch-guests').length);
                if ($('#topsearch-guests').length) {
                    locationInputID = '#topSearchKeywords';
                } else {
                    locationInputID = '#searchKeywords';
                }
            }
            console.log('locationInputID', locationInputID);
            // var locationInputID = (DOMUtils.is_mobile() || DOMUtils.is_tablet()) ? '#searchKeywordsMobile' : '#searchKeywords';

            var searchTerm = $(locationInputID).val().trim();
            if (searchTerm == '') {

                $(locationInputID + ', i.fa.fa-map-marker.form-control-icon').addClass('highlight');
                setTimeout(function () {
                    $(locationInputID + ', i.fa.fa-map-marker.form-control-icon').removeClass('highlight');
                }, 600);

            } else {

                $(locationInputID).attr("data-remodal-action", "confirm");
                
                var searchUrl = "/Search?Latitude=" + search.location.lat +
                                "&Longitude=" + search.location.lng +
                                "&ArrivalDate=" + DateFormat(search.date.arrival, "yyyy-mm-dd") +
                                "&DepartureDate=" + DateFormat(search.date.departure, "yyyy-mm-dd") +
                                "&Adults=" + search.guests.adults +
                                "&Children=" + search.guests.children +
                                "&RoomType=" + search.guests.roomType +
                                "&Place=" + search.location.place;

                document.location.href = searchUrl;
                console.log(search);
            }
        },

        populateSearchControls: function () {
            var arrival = '';
            var departure = '';

            var a = location.search.replace(/^\?/, '').split('&');
            for (var i = 0; i < a.length; i++) {
                if (a[i].indexOf('Place=') > -1) {
                    if (search.location == null)
                        search.location = {};
                    search.location.place = decodeURI(a[i].replace("Place=", ''));
                }
                else if (a[i].indexOf('Latitude=') > -1) {
                    if (search.location == null)
                        search.location = {};
                    search.location.lat = Number(a[i].replace("Latitude=", ''));
                }
                else if (a[i].indexOf('Longitude=') > -1) {
                    if (search.location == null)
                        search.location = {};
                    search.location.lng = Number(a[i].replace("Longitude=", ''));
                }
                else if (a[i].indexOf('ArrivalDate=') > -1) {
                    arrival = a[i].replace("ArrivalDate=", '');
                }
                else if (a[i].indexOf('DepartureDate=') > -1) {
                    departure = a[i].replace("DepartureDate=", '');
                }
                else if (a[i].indexOf('Adults=') > -1) {
                    if (search.guests == null)
                        search.guests = {};
                    search.guests.adults = Number(a[i].replace("Adults=", ''));
                }
                else if (a[i].indexOf('Children=') > -1) {
                    if (search.guests == null)
                        search.guests = {};
                    search.guests.children = Number(a[i].replace("Children=", ''));
                }
                else if (a[i].indexOf('RoomType=') > -1) {
                    if (search.guests == null)
                        search.guests = {};
                    search.guests.roomType = Number(a[i].replace("RoomType=", ''));
                }
            }

            if (arrival != "" && departure != "") {
                var arrDate = new Date(arrival);
                var depDate = new Date(departure);

                arrDate.setDate(arrDate.getDate() + 1);
                depDate.setDate(depDate.getDate() + 1);

                search.date = {
                    arrival: arrDate,
                    departure: depDate
                };
            }

            search.date = BSglobaldaterange.init(search);
            search.guests = BSglobalguests.init(search);
            search.location = BSgloballocationsearch.init(search);

            // when clicking on one of the non-location search controls, auto complete place if it hasn't been already
            $('#check_in_date, #check_in_date_mobile, .bedroom-type, #Adults, #Children, .dropdown-toggle').click(function () {

                if ($('#searchKeywordsMobile').val() != search.location.place) {
                    $('#searchKeywordsMobile').val(search.location.place);
                }
                if ($('#searchKeywords').val() != search.location.place) {
                    $('#searchKeywords').val(search.location.place);
                }
            });

        },

        _fromUrlDate: function (dateStr) {
            var bits = dateStr.split('-');
            return bits[1] + "/" + bits[2] + "/" + bits[0];
        }


    }

})(globalgosearch || {}, CalendarUtil, DateFormat, BSglobalguests, document);

module.exports = globalgosearch || window.globalgosearch;

},{"../utils/BRIDGESTREET.calendarcontrol.js":29,"../utils/BRIDGESTREET.date.format.js":31,"./BRIDGESTREET.global.search.daterange.js":10,"./BRIDGESTREET.global.search.guests.js":12,"./BRIDGESTREET.global.search.location.js":13}],12:[function(require,module,exports){
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

            if (ui && caller) {
                var callerID = jQuery(caller).attr('id');
                $('input.ui-spinner-input[id=' + callerID + ']').val(ui.value);
            }
            
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
            if($('#topsearch-guests').length) {
                jQuery('#topsearch-guests').addClass('open');
                jQuery('#topsearch-guests > .dropdown-toggle').attr('aria-expanded', 'true');
            } else {
                jQuery('.searchbox-guests').addClass('open');
                jQuery('.dropdown-toggle').attr('aria-expanded', 'true');
            }
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

},{"../utils/increment.js":33}],13:[function(require,module,exports){
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


},{"./BRIDGESTREET.global.search.daterange.js":10}],14:[function(require,module,exports){
var DateFormat = require('../utils/BRIDGESTREET.date.format.js');
var BSgloballocationsearch = require('./BRIDGESTREET.global.search.location.js');
var BSglobalguests = require('./BRIDGESTREET.global.search.guests.js');
var BSHomepageDateRange = require('./BRIDGESTREET.homepage.search.daterange.js');

(function () {
    var homepagehero = {
        init: function () {
            this.searchData = {
                location: null,
                date: null,
                guests: null
            };
            this.searchButton = $('.homepage-hero__form-submit-button');
            this.searchButtonMobile = $('.mobileSearchButton');
            this.locationInput = $('#searchKeywords');
            this.locationInputMobile = $('#searchKeywordsMobile');

            if (this.searchButton.length || this.searchButtonMobile.length) {
                this.populateSearchData();
                this.initializeForm();
            }

            if (this.searchButton.length) {
                this.searchButton.on('click', this.search.bind(this));
                $('.guest-fg__done-button').on('click', this.handleGuestDoneButtonClick.bind(this));
            }

            if (this.searchButtonMobile.length) {
                this.searchButtonMobile.on('click', this.search.bind(this));
            }
        },

        search: function (e) {
            e.preventDefault();
            var locationInput;
            var locationInputValue = '';
            var isMobile = $(e.target).is(this.searchButtonMobile);

            // Desktop/Tablet button triggered
            if ($(e.target).is(this.searchButton)) {
                locationInput = this.locationInput;
                locationInputValue = this.locationInput.val().trim();
            }

            // Mobile button triggered
            if (isMobile) {
                locationInput = this.locationInputMobile;
                locationInputValue = this.locationInputMobile.val().trim();

            }

            if (locationInput && locationInputValue) {
                var searchUrl = "/Search?Latitude=" + this.searchData.location.lat +
                    "&Longitude=" + this.searchData.location.lng +
                    "&ArrivalDate=" + DateFormat(this.searchData.date.arrival, "yyyy-mm-dd") +
                    "&DepartureDate=" + DateFormat(this.searchData.date.departure, "yyyy-mm-dd") +
                    "&Adults=" + this.searchData.guests.adults +
                    "&Children=" + this.searchData.guests.children +
                    "&RoomType=" + this.searchData.guests.roomType +
                    "&Place=" + this.searchData.location.place;

                document.location.href = searchUrl;
            } else {
                locationInput.focus();
            }
        },

        populateSearchData: function () {
            var keys = {
                adults: 'Adults',
                arrival: 'ArrivalDate',
                children: 'Children',
                departure: 'DepartureDate',
                latitude: 'Latitude',
                longitude: 'Longitude',
                place: 'Place',
                room: 'RoomType'

            };
            var arrival;
            var departure;

            var queryStringParameters = location.search.replace(/^\?/, '').split('&');

            queryStringParameters.forEach(function(parameter) {
                var equalSignIndex = parameter.indexOf('=');
                var slicedParameter = (equalSignIndex !== -1) ? parameter.slice(0, equalSignIndex) : '';
                var value = (equalSignIndex !== -1) ? parameter.replace(slicedParameter + '=', '') : '';

                if (slicedParameter && value) {
                    if ([keys.latitude, keys.longitude, keys.place].indexOf(slicedParameter) !== -1) {
                        if (!this.searchData.location) {
                            this.searchData.location = {};
                        }
                    }

                    if ([keys.arrival, keys.departure].indexOf(slicedParameter) !== -1) {
                        if (!this.searchData.date) {
                            this.searchData.date = {};
                        }
                    }

                    if ([keys.adults, keys.children, keys.room].indexOf(slicedParameter) !== -1) {
                        if (!this.searchData.guests) {
                            this.searchData.guests = {};
                        }
                    }

                    switch (slicedParameter) {
                        case keys.place:
                            this.searchData.location.place = decodeURI(value);
                            break;
                        case keys.latitude:
                            this.searchData.location.lat = Number(value);
                            break;
                        case keys.longitude:
                            this.searchData.location.lng = Number(value);
                            break;
                        case keys.arrival:
                            arrival = new Date(value);
                            arrival.setDate(arrival.getDate() + 1);
                            this.searchData.date.arrival = arrival;
                            break;
                        case keys.departure:
                            departure = new Date(value);
                            departure.setDate(departure.getDate() + 1);
                            this.searchData.date.departure = departure;
                            break;
                        case keys.adults:
                            this.searchData.guests.adults = Number(value);
                            break;
                        case keys.children:
                            this.searchData.guests.children = Number(value);
                            break;
                        case keys.room:
                            this.searchData.guests.roomType = Number(value);
                            break;
                    }
                }
            }, this);
        },

        initializeForm: function () {
            this.searchData.date = BSHomepageDateRange.init(this.searchData);
            this.searchData.guests = BSglobalguests.init(this.searchData);
            this.searchData.location = BSgloballocationsearch.init(this.searchData);
        },

        handleGuestDoneButtonClick: function (e) {
            e.preventDefault();
            // Due legacy code issues.. this is the guest dropdown instance....
            if (this.searchData.guests) {
                this.searchData.guests.updateRelatedControls();
            }
        }
    };

    module.exports = homepagehero || window.homepagehero;
})();
},{"../utils/BRIDGESTREET.date.format.js":31,"./BRIDGESTREET.global.search.guests.js":12,"./BRIDGESTREET.global.search.location.js":13,"./BRIDGESTREET.homepage.search.daterange.js":15}],15:[function(require,module,exports){
var CalendarUtil = require('../utils/BRIDGESTREET.calendarcontrol.js');

(function () {

    var homepageSearchDaterange = {
        desktopRange: null,
        mobileRange: null,
        arrival: new Date(),
        departure: new Date(),
        init: function (search) {
            var scope = this;
            if (search.date != null) {
                scope.arrival = search.date.arrival;
                scope.departure = search.date.departure;
            }

            var sharedCalOptions = {
                theme: 'material',
                animate: false,
                min: new Date(),
                weekDays: 'short',
                dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                showSelector: false,
                yearChange: false,
                buttons: [],
                defaultValue: [scope.arrival, scope.departure],
                onMarkupReady: function (event, inst) {
                    var $ = mobiscroll.$,
                        markup = $(event.target);
                    markup.find('.mbsc-fr-c').append(CalendarUtil.getMarkup());
                    CalendarUtil.set(inst);
                },
                onSetDate: function (event, inst) {
                    if (event.control == 'calendar') {
                        CalendarUtil.update(inst, event);
                    }
                },
                onSet: function (event, inst) {
                    // save the date and ensure that the other control is updated
                    scope.arrival = inst._startDate;
                    scope.departure = inst._endDate;

                    if (inst == scope.desktopRange)
                        scope.mobileRange.setVal([scope.arrival, scope.departure], true);
                    else
                        scope.desktopRange.setVal([scope.arrival, scope.departure], true);

                }
            };

            var desktopCalOptions = _.clone(sharedCalOptions);
            desktopCalOptions.display = 'bubble';
            desktopCalOptions.months = 2;
            desktopCalOptions.calendarWidth = 742;
            desktopCalOptions.startInput = '#desktop_check_in_date';
            desktopCalOptions.endInput = '#desktop_check_out_date';

            var mobileCalOptions = _.clone(sharedCalOptions);
            mobileCalOptions.display = 'bottom';
            mobileCalOptions.months = 1;
            mobileCalOptions.startInput = '#mobile_check_in_date';
            mobileCalOptions.endInput = '#mobile_check_out_date';

            this.desktopRange = mobiscroll.range('#desktop_date_range_target', desktopCalOptions);
            this.mobileRange = mobiscroll.range('#mobile_date_range_target', mobileCalOptions);

            if (search.date != null && scope.arrival != null && scope.departure != null) {
                this.desktopRange.setVal([scope.arrival, scope.departure], true);
                this.mobileRange.setVal([scope.arrival, scope.departure], true);
            }

            this.initListeners();

            return scope;
        },

        initListeners: function () {
            var scope = this;
            $(window).on('resize', { self: this }, scope.resizeBrowser);
        },

        resizeBrowser: function () {
            if (document.getElementById('desktop_check_in_date')) {
                DOMUtils.fitToPlaceholder("desktop_check_in_date");
            }
        },
        show: function () {
            if (DOMUtils.is_mobile()) {
                this.mobileRange.show();
            } else {
                this.desktopRange.show();
            }
        }
    }

    module.exports = homepageSearchDaterange || window.homepageSearchDaterange;

})();



},{"../utils/BRIDGESTREET.calendarcontrol.js":29}],16:[function(require,module,exports){
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


},{"./BRIDGESTREET.split.screen.js":24}],17:[function(require,module,exports){
(function () {
    var $window = $(window);
    var mobilemodal = {

        init : function () {

            if ($('.remodal').length == 0) return;     

            /*
             *  Setting REMODAL modal/mobile search settings
            */  

            window.REMODAL_GLOBALS = {

              NAMESPACE: 'modal',

              DEFAULTS: {

                hashTracking: false

              }

            };

            var inst = jQuery('[data-remodal-id=modal]').remodal();


            jQuery('#MobileSearch').on("click", function() {
                inst.open();
            });

            /*
             *  Handle modal close when in tablet+ mode
            */  

            $window.on('resize', DOMUtils.throttle(500, function () {

                if ($window.width() > 768) {

	                if (jQuery('body').hasClass('remodal-is-opened')) {

	                    inst.close();
	                }
	            }
                

            }))

            $window.trigger('resize');                         

        }           
    }

    module.exports = mobilemodal || window.mobilemodal;

})();


},{}],18:[function(require,module,exports){
(function () {

    var navigation = {

        init: function () {

            if (DOMUtils.isUndefined($('.nav-wrapper')[0])) return; 

                this.slideout = null; 

                DOMUtils.is_mobile() ? this.initSlideOutMenu(263) : this.initSlideOutMenu(500);

                $(window).on('resize', this._onResize);

        },

        initSlideOutMenu : function(num) {

            var self = this;          

            self.slideout = new Slideout({

                'panel': document.getElementsByClassName('page-wrapper')[0],
                
                'menu': document.getElementsByClassName('nav-wrapper')[0],
                
                'padding': num,

                'tolerance': 70,

                'side' : 'right',

                'fx' : 'ease-in-out'

            });   

            jQuery('.desktop-search .js-slideout-toggle').on("click", function(){

                self.slideout.toggle();

            })

            jQuery('.header-alt').find('.js-slideout-toggle').on("click", function(){

                self.slideout.toggle();

            })            
            // document.querySelector('desktop-search.js-slideout-toggle').addEventListener('click', function() {
               
            //     self.slideout.toggle();

            // });

            document.querySelector('.nav-wrapper').addEventListener('click', function(eve) {
                
                if (eve.target.nodeName === 'A') { self.slideout.close(); }

            });  

            self.slideout.on('open', this._onNavigationOpen);

            self.slideout.on('close', this._onNavigationClose);

        },

        _onNavigationOpen : function (event) {

            jQuery('.toggle').addClass('open');
        },

        _onNavigationClose : function (event) {

            jQuery('.toggle').removeClass('open');

        },

        _onResize : function () {

             if(DOMUtils.is_mobile() ){

                navigation.slideout.updateX(263, (navigation.slideout.isOpen()) ? true : false);


             } else {

                navigation.slideout.updateX(500, (navigation.slideout.isOpen()) ? true : false);
             }

        }

    }

    module.exports = navigation || window.navigation;

})();


},{}],19:[function(require,module,exports){
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
},{}],20:[function(require,module,exports){
(function () {
    var PartnerContactUsForm = {
	    
        init: function() {
            var scope = this;

            $("#partner-contact-us-form").submit(function (event) {
                /* stop form from submitting normally */
                event.preventDefault();
            });

            $("#btnSubmit").on('click', function() {
                scope.btnSubmit_Click(scope);
            });
        },

        btnSubmit_Click: function (scope) {
            if (!$("#partner-contact-us-form").valid()) {
                return false;
            }

            var rc = grecaptcha.getResponse();
            if (rc.length == 0) {
                $("#recaptcha-error").show();
                return false;
            } else {
                $("#recaptcha-error").hide();
            }
            
            var regionValues = scope.GetListValues("region");
            var areasOfInterest = scope.GetListValues("AreaOfInterest");
            var contactMethod = scope.GetListValues("ContactMethod");
            var data = {
                FirstName: $("#FirstName").val(),
                LastName: $("#LastName").val(),
                Phone: $("#Phone").val(),
                Email: $("#Email").val(),
                Company: $("#Company").val(),
                CompanyType: $("#CompanyType").val(),
                Comments: $("#Comments").val(),
                ContactMethod: contactMethod,
                Regions: regionValues,
                AreasOfInterest: areasOfInterest,
                RecaptchaResponse: rc,
                FormType: $("#FormType").val()
            };

            $("#partner-contact-us-form").hide();
            $("#partner-contact-us-form-thank-you").fadeIn(290);


            var offsetTop = $("#partner-contact-us-form-thank-you").offset().top;

            $('html, body').animate({
                scrollTop: offsetTop - 110
            }, 400);

            $.post('/api/PartnerContactUs', data, function (ret) {});
            return false;
        },

        GetListValues: function (listName) {
            var selector = "input[name=" + listName + "]:checked";
            var checkedCheckboxes = $(selector);
            var checked = [];
            checkedCheckboxes.each(function () {
                var value = $(this).val();
                checked.push(value);
            });

            return checked.toString();
        }
    }

    module.exports = PartnerContactUsForm || window.PartnerContactUsForm;

})();
},{}],21:[function(require,module,exports){
(function () {
    var $window = $(window);
    var peeldown = {

        init : function () {

            if ($('.pull-down').length == 0) return;
            
            $window.on('resize', this._onResize);

            $window.trigger('resize');
            
        },

        _onResize : function () {

            var v = 0;

            var currentHeight = jQuery('.pull-down-wrapper').outerHeight();

            jQuery('.pull-down-button').add('.close-btn').on("click", function() {

                currentHeight = jQuery('.pull-down-wrapper').outerHeight();

                v = (v == 0 ? 1 : 0);

                if( v === 0 ) jQuery('.p-d-container').css("margin-top", -currentHeight + 'px');
                
                if( v === 1 ) jQuery('.p-d-container').css("margin-top", "0");
      
            })

            jQuery('.p-d-container').css("margin-top", -currentHeight + 'px');

        }

    }

    module.exports = peeldown || window.peeldown;

})();


},{}],22:[function(require,module,exports){
var BSmapview = require('./BRIDGESTREET.mapview.js');
var BSsearchlisting = require('./BRIDGESTREET.search.listing.js');
var BSuicomponents = require('../widgets/BRIDGESTREET.ui.components.js');
var BSTopSearch = require('./BRIDGESTREET.topsearch.js');
var CurrencyUtil = require('../utils/BRIDGESTREET.currency.js');

(function () {
    var $window = $(window);

    var searchfilter = {
        searchFilter: null,
        searchView: null,
        searchModel: null,
        init: function ($window) {

            if ($('#filter-container').length == 0) return;

            var dfd = jQuery.Deferred();

            var Model = Backbone.Model.extend({ url: '/search-results.json' });

            var View = Backbone.View.extend({
                initialize: function () {
                    _.bindAll(this, "render");
                    this.processForm(location.search);
                    dfd.resolve("hurray");
                },
                events: {
                    "submit": "applyFilter",
                    "click .filter-close": "removeFilter",
                    "click .cancel-btn": "cancelFilter",
                    "change #RoomType": "redoSearch",
                    "change #IsRealTimeBookable": "applyFilter",
                    "change #PropertySpecial": "applyFilter"
                },
                redoSearch: function (e) {
                    if (e) e.preventDefault();
                    var formValues = $("#filter-container").serialize();

                    this.processForm(formValues);
                },
                cancelFilter: function (e) {
                    //uncheck all the sub filters
                    $('#bottom-filter input').removeAttr('checked');

                    //check the sub filters that are in the model
                    for (var i = 0; i < this.model.attributes.filters.PropertyTypes.length; i++) {
                        var id = this.model.attributes.filters.PropertyTypes[i];
                        $('input[name=PropertyTypes]#' + id).prop('checked', 'checked');;
                    }
                    for (var i = 0; i < this.model.attributes.filters.Attributes.length; i++) {
                        var id = this.model.attributes.filters.Attributes[i];
                        $('input[name=Attributes]#' + id).prop('checked', 'checked');;
                    }
                    if (this.model.attributes.filters.IsPetFriendly) {
                        $('input[name=IsPetFriendly]#' + id).prop('checked', 'checked');;
                    }
                },
                applyFilter: function (e) {

                    if (e != undefined && e.preventDefault != undefined)
                        e.preventDefault();

                    if (
                        e.target.id != "IsRealTimeBookable" &&
                        e.target.id != "PropertySpecial" &&
                        e.target.id != "RangeSlider"
                        ) {
                        $('#CollapseExample').collapse('toggle')
                    }
                    $("#thinking").show();

                    //collect the values that were selected
                    var filters = {
                        PropertyTypes: [],
                        IsPetFriendly: false,
                        IsRealTimeBookable: false,
                        PropertySepecial: false,
                        PriceMin: null,
                        PriceMax: null,
                        Attributes: []
                    };

                    var priceMin = $('#RangeSlider .noUi-handle.noUi-handle-lower .noUi-tooltip').text().replace("$", "");
                    if (priceMin != "") {
                        filters.PriceMin = Number(priceMin);
                    }

                    var priceMax = $('#RangeSlider .noUi-handle.noUi-handle-upper .noUi-tooltip').text().replace("$", "");
                    if (priceMax != "") {
                        filters.PriceMax = Number(priceMax);
                    }

                    if ($('input[name=IsRealTimeBookable]:checked').length) {
                        filters.IsRealTimeBookable = true;
                    }
                    if ($('input[name=PropertySpecial]:checked').length) {
                        filters.PropertySpecial = true;
                    }
                    if ($('input[name=IsPetFriendly]:checked').length) {
                        filters.IsPetFriendly = true;
                        $(".filter-close[value='IsPetFriendly=true']").show();
                    }
                    $('input[name=PropertyTypes]:checked').each(function () {
                        var val = Number($(this).val());
                        $(".filter-close[value='PropertyTypes=" + val + "']").show();
                        filters.PropertyTypes.push(val);
                    });
                    $('input[name=Attributes]:checked').each(function () {
                        var val = Number($(this).val());
                        $(".filter-close[value='Attributes=" + val + "']").show();
                        filters.Attributes.push(val);
                    });

                    this.model.attributes.filters = filters;

                    this.showHideAllPods();
                    $("#thinking").hide();

                    //update the contact us links with all the filters that they selected
                    var placeinQueryStr = decodeURI(location.search).match(/Place=[\w\,\.\s\d]+/);
                    $('a[href="/contact-us"]').attr('href', '/contact-us?' + $('#filter-container').serialize() + "&" + placeinQueryStr);
                },
                removeFilter: function (e) {

                    $("#thinking").show();

                    var removeMe = e.currentTarget.value;
                    $('.filter-close[value="' + removeMe + '"]').hide();

                    var filterName = removeMe.split('=')[0];
                    var filterValue = removeMe.split('=')[1];

                    //uncheck the checkbox & remove filter value
                    switch (filterName) {
                        case "IsPetFriendly":
                            $('input[name=IsPetFriendly]:checked').removeAttr('checked');
                            this.model.attributes.filters.IsPetFriendly = false;
                            break;
                        case "PropertyTypes":
                            $('input[name=PropertyTypes]#' + filterValue).removeAttr('checked');
                            filterValue = Number(filterValue);
                            this.model.attributes.filters.PropertyTypes = this.model.attributes.filters.PropertyTypes.filter(function (o) { return filterValue !== o; });
                            break;
                        case "Attributes":
                            $('input[name=Attributes]#' + filterValue).removeAttr('checked');
                            filterValue = Number(filterValue);
                            this.model.attributes.filters.Attributes = this.model.attributes.filters.Attributes.filter(function (o) { return filterValue !== o; });
                            break;
                    }

                    // hide property pods that don't conform to filters
                    this.showHideAllPods();

                    $("#thinking").hide();

                    //update the contact us links with all the filters that they selected
                    var placeinQueryStr = decodeURI(location.search).match(/Place=[\w\,\.\s\d]+/);
                    $('a[href="/contact-us"]').attr('href', '/contact-us?' + $('#filter-container').serialize() + "&" + placeinQueryStr);
                },
                processForm: function (formValues) {

                    $('#extra-results-intro').hide();
                    $('#partial-results-only-intro').hide();
                    $("#no-results").hide();
                    $("#thinking").show();

                    formValues = formValues.replace('\?', '');

                    var priceMin = $('#RangeSlider .noUi-handle.noUi-handle-lower .noUi-tooltip').text().replace("$", "");
                    if (priceMin != "") formValues += "&PriceMin=" + priceMin;

                    var priceMax = $('#RangeSlider .noUi-handle.noUi-handle-upper .noUi-tooltip').text().replace("$", "");
                    if (priceMax != "") formValues += "&PriceMax=" + priceMax;

                    var url = (location.pathname + "?" + formValues).replace(/\?+/, '?').replace(/\&+/, '&');

                    window.history.pushState("object or string", "Title", url);

                    this.model.fetch({
                        success: this.render,
                        error: this.renderError
                    });
                },
                cleanModel: function (data, status) {
                    var dateStr = this.model.attributes.ArrivalDate;
                    var selectedRoomTypeModel = [];
                    var selectedRoomType = $("#filter-container #RoomType option:selected");

                    dateStr = dateStr.replace(/[/\(\)]/g, '').replace('Date', '');

                    this.model.attributes.ArrivalDate = new Date(Number(dateStr)).toISOString().slice(0, 10);

                    dateStr = this.model.attributes.DepartureDate;
                    dateStr = dateStr.replace(/[/\(\)]/g, '').replace('Date', '');

                    this.model.attributes.DepartureDate = new Date(Number(dateStr)).toISOString().slice(0, 10);

                    this.model.attributes.ShowInstantBook = false;
                    this.model.attributes.ShowSpecials = false;

                    this.model.attributes.Price.CurrencyCode = CurrencyUtil.convert(this.model.attributes.Price.CurrencyCode);

                    for (var i = 0; i < this.model.attributes.PropertyResults.length ; i++) {
                        var item = this.model.attributes.PropertyResults[i];
                        this.model.attributes.PropertyResults[i] = this.formatPropertyCard(item);
                        if (item.MinLOS > this.model.attributes.LengthOfStay)
                            this.model.attributes.PropertyResults[i].IsRealTimeBookable = false;
                        if (item.MinLead > this.model.attributes.Lead)
                            this.model.attributes.PropertyResults[i].IsRealTimeBookable = false;
                    }
                    this.model.attributes.PropertyResults = _(this.model.attributes.PropertyResults)
                        .chain()
                        .sortBy(function (o) {
                            return o.DistanceFromPoint;
                        })
                        .sortBy(function (o) {
                            var rank = o.IsRealTimeBookable ? 0 : 1;
                            return rank;
                        })
                        .sortBy(function (o) {
                            var rank = 2;
                            if (o.IsSpecial && o.IsFeatured) rank = 0;
                            else if (o.IsFeatured || o.IsSpecial) rank = 1;
                            return rank;
                        })
                        .value();

                    for (var i = 0; i < this.model.attributes.PartialMatchPropertyResults.length ; i++) {
                        var item = this.model.attributes.PartialMatchPropertyResults[i];
                        this.model.attributes.PartialMatchPropertyResults[i] = this.formatPropertyCard(item);
                        if (item.MinLOS > this.model.attributes.LengthOfStay)
                            this.model.attributes.PartialMatchPropertyResults[i].IsRealTimeBookable = false;
                        if (item.MinLead > this.model.attributes.Lead)
                            this.model.attributes.PartialMatchPropertyResults[i].IsRealTimeBookable = false;
                    }
                    this.model.attributes.PartialMatchPropertyResults = _(this.model.attributes.PartialMatchPropertyResults)
                        .chain()
                        .sortBy(function (o) {
                            return o.DistanceFromPoint;
                        })
                        .sortBy(function (o) {
                            var rank = o.IsRealTimeBookable ? 0 : 1;
                            return rank;
                        })
                        .sortBy(function (o) {
                            var rank = 2;
                            if (o.IsSpecial && o.IsFeatured) rank = 0;
                            else if (o.IsFeatured || o.IsSpecial) rank = 1;
                            return rank;
                        })
                        .value();

                    if (selectedRoomType.attr('value')) {
                        _.each(this.model.attributes.Size.RoomTypes, function(roomtype) {
                            if (roomtype.Value === selectedRoomType.attr('value')) {
                                roomtype.Selected = true;
                            } else {
                                roomtype.Selected = false;
                            }

                            selectedRoomTypeModel.push(roomtype);
                        });

                        if (selectedRoomTypeModel.length) {
                            this.model.attributes.Size.RoomTypes = selectedRoomTypeModel;
                        }
                    }

                },

                formatPropertyCard: function (item) {
                    if (item.MinRate > 0) {
                        item.MinRate = CurrencyUtil.formatCurrency(item.MinRate);
                        item.CurrencyCode = CurrencyUtil.convert(item.CurrencyCode);
                    }
                    if (item.IsRealTimeBookable) this.model.attributes.ShowInstantBook = true;
                    if (item.IsSpecial) this.model.attributes.ShowSpecials = true;

                    item.URL += location.search;
                    return item;
                },
                loadTemplates: function () {
                    $("#thinking").hide();

                    var mobileIntro = "Results for properties in " + this.model.attributes.Place +
                        " from " + this.fromUrlDate(this.model.attributes.ArrivalDate) +
                        " through " + this.fromUrlDate(this.model.attributes.DepartureDate);

                    var selRmType = _.find(this.model.attributes.Size.RoomTypes, function (x) {
                        if (x.Selected == true)
                            return x;
                    });
                    selRmType = selRmType == undefined ? 0 : selRmType.Value;

                    if (selRmType == 0) mobileIntro += " with a studio unit.";
                    if (selRmType == 1) mobileIntro += " with one bedroom.";
                    if (selRmType > 1) mobileIntro += " with " + selRmType + " bedrooms.";

                    $('#filter-container p#intro').text(mobileIntro);

                    var filterTmpl1 = $("#top-filter-template").html();
                    var template1 = _.template(filterTmpl1);
                    this.$el.find('#top-filter').html(template1(this.model.attributes));

                    var filterTmpl2 = $("#bottom-filter-template").html();
                    var template2 = _.template(filterTmpl2);
                    this.$el.find('#bottom-filter').html(template2(this.model.attributes));

                    $('.filter-close').hide();

                    var gridTmpl = $("#grid-template").html();
                    var gridtemplate = _.template(gridTmpl);
                    this.$el.find('#full-match').html(gridtemplate({
                        'PropertyList': this.model.attributes.PropertyResults,
                        'PlaceName': this.model.attributes.Place
                    }));

                    var pmGridTmpl = $("#grid-template").html();
                    var pmGridtemplate = _.template(pmGridTmpl);
                    this.$el.find('#partial-match').html(pmGridtemplate({
                        'PropertyList': this.model.attributes.PartialMatchPropertyResults,
                        'PlaceName': this.model.attributes.Place
                    }));

                    //update the contact us links with all the filters that they selected
                    var placeinQueryStr = decodeURI(location.search).match(/Place=[\w\,\.\s\d]+/);
                    $('a[href="/contact-us"]').attr('href', '/contact-us?' + $('#filter-container').serialize() + "&" + placeinQueryStr);

                    if (this.model.attributes.PropertyResults.length > 0 && this.model.attributes.PartialMatchPropertyResults.length > 0) {
                        $('#extra-results-intro').show();
                    }
                    else if (this.model.attributes.PartialMatchPropertyResults.length > 0) {
                        $('#partial-results-only-intro').show();
                    } else if (this.model.attributes.PropertyResults.length == 0) {
                        $("#no-results").show();
                    }

                    if (BSTopSearch && !BSTopSearch.initialized) {
                        BSTopSearch.init(this.model, (function(model) {
                            this.model = model;
                            console.log(this.model);
                        }).bind(this));
                    }
                },
                render: function (data, status) {
                    this.cleanModel(data, status);
                    this.loadTemplates();

                    BSuicomponents.initSearchPageUIComponents();
                    BSuicomponents.initRangeSliderComponent(this);

                    if (
                        this.model.attributes.PropertyResults.length == 0 &&
                        this.model.attributes.PartialMatchPropertyResults.length == 0
                        ) {
                        BSmapview.drawEmptyMap(this.model.attributes.Latitude, this.model.attributes.Longitude);

                    } else {
                        var allProps = this.model.attributes.PropertyResults.concat(this.model.attributes.PartialMatchPropertyResults);
                        BSmapview.drawMarkers(allProps, true);

                        var mapBoundProperties = _.sortBy(allProps, function (o) { return o.DistanceFromPoint; });
                        BSmapview.zoomInOn(allProps.splice(0, 15));
                    }

                    DOMUtils.resizeForOldBrowsers();

                },
                renderError: function (data, status) {
                    console.log(status.responseText);
                    dfd.reject("sorry");
                },
                fromUrlDate: function (dateStr) {
                    var bits = dateStr.split('-');
                    return bits[1] + "/" + bits[2] + "/" + bits[0];
                },
                showHideAllPods: function () {

                    $('#extra-results-intro').hide();
                    $('#partial-results-only-intro').hide();
                    $("#no-results").hide();
                    $('.property-pod').show();

                    // hide property pods that don't conform to filters
                    for (var i = 0; i < this.model.attributes.PropertyResults.length; i++) {
                        var prop = this.model.attributes.PropertyResults[i];
                        this.showHidePod(prop);
                    }

                    for (var i = 0; i < this.model.attributes.PartialMatchPropertyResults.length; i++) {
                        var prop = this.model.attributes.PartialMatchPropertyResults[i];
                        this.showHidePod(prop);
                    }

                    var partialMatchCount = $('#partial-match .property-pod:visible').length;
                    var exactMatchCount = $('#full-match .property-pod:visible').length;

                    if (exactMatchCount > 0 && partialMatchCount > 0) {
                        $('#extra-results-intro').show();
                    }
                    else if (partialMatchCount > 0) {
                        $('#partial-results-only-intro').show();
                    } else if (exactMatchCount == 0) {
                        $("#no-results").show();
                    }
                },
                showHidePod: function (prop) {
                    var propPod = $('.property-pod#' + prop.PropertyId);
                    BSmapview.enableMarker(prop);

                    var filters = this.model.attributes.filters;

                    if (filters.IsPetFriendly && !prop.IsPetFriendly) {
                        propPod.hide();
                        BSmapview.disableMarker(prop);
                        //console.log(prop.Name + ' is not pet friendly');
                    }
                    else if (filters.PropertySepecial && !prop.PropertySepecial) {
                        propPod.hide();
                        BSmapview.disableMarker(prop);
                        //console.log(prop.Name + ' is not special');
                    }
                    else if (filters.IsRealTimeBookable && !prop.IsRealTimeBookable) {
                        propPod.hide();
                        BSmapview.disableMarker(prop);
                        //console.log(prop.Name + ' is not RTB');
                    }
                    else if (filters.PropertyTypes.length > 0 && !_.contains(filters.PropertyTypes, prop.PropertyType)) {
                        propPod.hide();
                        BSmapview.disableMarker(prop);
                        //console.log(prop.Name + ' is not in property types ' + filters.PropertyTypes);
                    }
                    else if (filters.Attributes.length > 0) {
                        for (var j = 0; j < filters.Attributes.length; j++) {
                            var attr = filters.Attributes[j];
                            if (!_.contains(prop.Attributes, attr)) {
                                propPod.hide();
                                BSmapview.disableMarker(prop);
                                //console.log(prop.Name + ' does not have attribute #' + attr);
                                break;
                            }
                        }
                    } else if (prop.MinRate > 0) {
                        if (prop.MinRate < filters.PriceMin || prop.MinRate > filters.PriceMax) {
                            propPod.hide();
                            BSmapview.disableMarker(prop);
                        }
                    }
                }
            });

            this.searchModel = new Model();
            this.searchView = new View({ model: this.searchModel, tagName: "form", el: $("#filter-container") });
            return dfd.promise();
        },
        getExactMatches: function () {
            return this.searchModel.attributes.PropertyResults;
        },
        getFuzzyMatches: function () {
            return this.searchModel.attributes.PartialMatchPropertyResults;
        },
        getPriceRange: function () {
            return this.searchModel.attributes.Price;
        }
    }

    module.exports = searchfilter || window.searchfilter;

})();


},{"../utils/BRIDGESTREET.currency.js":30,"../widgets/BRIDGESTREET.ui.components.js":35,"./BRIDGESTREET.mapview.js":16,"./BRIDGESTREET.search.listing.js":23,"./BRIDGESTREET.topsearch.js":26}],23:[function(require,module,exports){
(function () {
    var $window = $(window);

    var searchlisting = {

        searchListing: null,

        init: function () {

            if (DOMUtils.isUndefined(document.getElementsByClassName('split-pane')[0])) return;

            // Initializesplit pane component

            this.getFiltersHeight();

            this.contentHeight = 0;

            this.contentHeight = window.innerHeight - this.getFiltersHeight();

            jQuery('.results-list-map').height(this.contentHeight);

            this.searchListing = jQuery('.results-list-map');

            this.initListeners();

            this.oldState = null;

            this.wasMobile = false;

        },

        getFiltersHeight: function () {

            this.contentHeight = 0;

            this.desktopSearthHeight = jQuery('.desktop-search').outerHeight();

            this.resultsFilterHeight = jQuery('.results-filter').outerHeight();

            this.stateSliderHeight = jQuery('.state-slider-container').outerHeight();

            this.offsetHeight = this.desktopSearthHeight + this.stateSliderHeight + this.resultsFilterHeight;

            return this.offsetHeight;

        },


        getFiltersHeightMobile: function () {

            this.contentHeight = 0;

            this.headerHeight = jQuery('header').outerHeight();

            this.desktopSearthHeight = jQuery('.desktop-search').outerHeight();

            this.stateSliderHeight = jQuery('.state-slider-container').outerHeight();

            this.offsetHeight = this.headerHeight + this.desktopSearthHeight + this.stateSliderHeight + this.resultsFilterHeight;

            return this.offsetHeight;

        },


        initListeners: function () {

			var myElement = document.getElementById('left-component');

            $window.on('resize', {self:this}, this.resizeBrowser);

        },

        resizeBrowser: function (event) {

            if (!DOMUtils.isUndefined(event.data)) {

                var self = event.data.self;

                self.contentHeight = window.innerHeight - self.getFiltersHeight();

                if (!DOMUtils.is_mobile()) {

	            	jQuery('body').css('overflow', 'hidden');

                    jQuery('.results-list-map').height(self.contentHeight);

                    jQuery('.collapse-panel-wrapper').outerHeight(self.contentHeight - self.stateSliderHeight);

                    jQuery('.collapse-panel-wrapper').css('overflow-y', 'scroll');


                    if( window.innerWidth > 768 && window.innerWidth < 992) {

                        var slider = jQuery('.price-range-slider');

                        slider.css('width', '50%');

                    }

                    if( window.innerWidth > 991) {
                        
                        var screenWidth = window.innerWidth;

                        var sizeWidth = jQuery('.size-section').outerWidth();

                        var viewWidth = jQuery('.view-section').outerWidth();

                        var slider = jQuery('.price-range-slider');

                        var totalWidth = sizeWidth + viewWidth;

                        slider.css('width', (screenWidth - totalWidth) - 1);

                    }

                } else {

                    jQuery('.collapse-panel-wrapper').css('height', 'auto');

                    jQuery('.collapse-panel-wrapper').css('overflow-y', 'hidden');

                    jQuery('body').css('overflow', 'auto');

                    var slider = jQuery('.price-range-slider');

                    slider.css('width', '100%');

	            }

            }

        }
    }

    module.exports = searchlisting || window.searchlisting;

})();


},{}],24:[function(require,module,exports){
(function () {
    var $window = $(window);
    var splitscreen = {

        init : function () {

            if ($('.split-pane').length == 0) return;

            this.setSplitView();

            this.currentState = 1;
    
            $window.on('resize', this._onResize);

   			$window.trigger('resize');
        },

        setListView : function() {

            this.setPosition("0%", "0%", "0%");

            this.getComponentsSizes().first.style.width = "100%";

        },

        setMapView : function () {

            this.setPosition("100%", "10%", "100%");

            jQuery('div.split-pane').trigger('dividerupdate');            

        },

        setSplitView : function () {


            this.setPosition("50%", "50%", "50%");

            this.getComponentsSizes().first.style.width = "50%";

            jQuery('div.split-pane').trigger('dividerupdate');   

        },

        getComponentsSizes : function() {

            return {

                first: jQuery('div.split-pane').children('.property-view')[0],
                
                divider: jQuery('div.split-pane').children('.split-pane-divider')[0],
                
                last: jQuery('div.split-pane').children('.map-view')[0]

            }
        },

        setPosition : function (left, right, w) {

            if(!DOMUtils.isNull(left)) {

                this.getComponentsSizes().first.style.right = left;

            }

            this.getComponentsSizes().divider.style.right = right;

            this.getComponentsSizes().last.style.width = w;

        },

        _onResize : function () {


            if(DOMUtils.is_mobile()) {

                splitscreen.setListView();   

            } else {
                
               if(splitscreen.currentState === 1) splitscreen.setSplitView();

                if(splitscreen.currentState === 2) splitscreen.setMapView();

               jQuery('div.split-pane').trigger('dividerupdate');
               
            }

        },

        setState : function(num, callback){

            $window.trigger('resize');

            this.currentState = num;

            if(_.isFunction(callback)) {

                callback.apply(this);

                if (!DOMUtils.isUndefined(document.getElementsByClassName('property-pod')[0]))  {

                    jQuery.fn.matchHeight._update();

                }                            

            }            

        }


    }

    module.exports = splitscreen || window.splitscreen;

})();

},{}],25:[function(require,module,exports){
(function () {

    var statisticsPod = {

        init : function () {

            jQuery('.timer').countTo({

                speed: 2000,

                refreshInterval: 50,

                formatter: function (value, options) {

                  return DOMUtils.numberWithCommas(value.toFixed(options.decimals));
                
                }
            });

        }		
    }

    module.exports = statisticsPod || window.statisticsPod;

})();



},{}],26:[function(require,module,exports){
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


},{}],27:[function(require,module,exports){
(function () {

    var VideoSlider = {

        init : function (win) {

        	if (DOMUtils.isUndefined(document.getElementsByClassName('video-slider')[0])) return;
			
            this.$window = win;

            var dragging = false,
                scrolling = false,
                resizing = false;

            var videos = {
                a: Popcorn("#example_video_1"),    
                b: Popcorn("#example_video_2"), 
                
            },

            loadCount = 0, 
            events = "play pause timeupdate seeking".split(/\s+/g);

            requestAnimFrame = (function(){
              return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function( callback, element ) {
                  window.setTimeout( callback, 16 );
                };
            }());   


            var imageComparisonContainers = jQuery('.cd-image-container');
            //check if the .cd-image-container is in the viewport 
            //if yes, animate it
            checkPosition(imageComparisonContainers);

            jQuery(window).on('scroll', function(){
                if( !scrolling) {
                    scrolling =  true;
                    ( !window.requestAnimationFrame )
                        ? setTimeout(function(){checkPosition(imageComparisonContainers);}, 100)
                        : requestAnimationFrame(function(){checkPosition(imageComparisonContainers);});
                }
            });

            //make the .cd-handle element draggable and modify .cd-resize-img width according to its position
            imageComparisonContainers.each(function(){
                var actual = jQuery(this);
                drags(actual.find('.cd-handle'), actual.find('.cd-resize-img'), actual, actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-image-label[data-type="modified"]'));
            });

            //upadate images label visibility
            jQuery(window).on('resize', function(){
                if( !resizing) {
                    resizing =  true;
                    ( !window.requestAnimationFrame )
                        ? setTimeout(function(){checkLabel(imageComparisonContainers);}, 100)
                        : requestAnimationFrame(function(){checkLabel(imageComparisonContainers);});
                }
            });

            function checkPosition(container) {
                container.each(function(){
                    var actualContainer = jQuery(this);
                    if( jQuery(window).scrollTop() + jQuery(window).height()*0.5 > actualContainer.offset().top) {
                        actualContainer.addClass('is-visible');
                    }
                });

                scrolling = false;
            }

            function checkLabel(container) {
                container.each(function(){
                    var actual = jQuery(this);
                    updateLabel(actual.find('.cd-image-label[data-type="modified"]'), actual.find('.cd-resize-img'), 'left');
                    updateLabel(actual.find('.cd-image-label[data-type="original"]'), actual.find('.cd-resize-img'), 'right');
                });

                resizing = false;
            }

            //draggable funtionality - credits to http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
            function drags(dragElement, resizeElement, container, labelContainer, labelResizeElement) {
                dragElement.on("mousedown vmousedown", function(e) {
                    console.log('mousedown');

                    jQuery(document).trigger('sjs:synchronize');

                    dragElement.addClass('draggable');
                    resizeElement.addClass('resizable');

                    var dragWidth = dragElement.outerWidth(),
                        xPosition = dragElement.offset().left + dragWidth - e.pageX,
                        containerOffset = container.offset().left,
                        containerWidth = container.outerWidth(),
                        minLeft = containerOffset + 10,
                        maxLeft = containerOffset + containerWidth - dragWidth - 10;
                    
                    dragElement.parents().on("mousemove vmousemove", function(e) {
                        if( !dragging) {
                            dragging =  true;
                            ( !window.requestAnimationFrame )
                                ? setTimeout(function(){animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement);}, 100)
                                : requestAnimationFrame(function(){animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement);});
                        }
                    }).on("mouseup vmouseup", function(e){
                        dragElement.removeClass('draggable');
                        resizeElement.removeClass('resizable');
                    });
                    e.preventDefault();
                }).on("mouseup vmouseup", function(e) {
                    dragElement.removeClass('draggable');
                    resizeElement.removeClass('resizable');
                });
            }

            function animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement, labelContainer, labelResizeElement) {
                var leftValue = e.pageX + xPosition - dragWidth;   
                //constrain the draggable element to move inside his container
                if(leftValue < minLeft ) {
                    leftValue = minLeft;
                } else if ( leftValue > maxLeft) {
                    leftValue = maxLeft;
                }

                var widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';
                
                jQuery('.draggable').css('left', widthValue).on("mouseup vmouseup", function() {
                    jQuery(this).removeClass('draggable');
                    resizeElement.removeClass('resizable');
                });

                jQuery('.resizable').css('width', widthValue); 

                updateLabel(labelResizeElement, resizeElement, 'left');
                updateLabel(labelContainer, resizeElement, 'right');
                dragging =  false;
            }

            function updateLabel(label, resizeElement, position) {
                if(position == 'left') {
                    ( label.offset().left + label.outerWidth() < resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
                } else {
                    ( label.offset().left > resizeElement.offset().left + resizeElement.outerWidth() ) ? label.removeClass('is-hidden') : label.addClass('is-hidden') ;
                }
            }   



            // iterate both media sources
            Popcorn.forEach( videos, function( media, type ) {
                
                // when each is ready... 
                media.listen( "canplayall", function() {
                    
                    // trigger a custom "sync" event
                    this.emit("sync");
                    
                    // set the max value of the "scrubber"
               // scrub.attr("max", this.duration() );

                // Listen for the custom sync event...    
                }).listen( "sync", function() {
                    
                    // Once both items are loaded, sync events
                    if ( ++loadCount == 2 ) {
                        
                        // Iterate all events and trigger them on the video B
                        // whenever they occur on the video A
                        events.forEach(function( event ) {

                            videos.a.listen( event, function() {
                                
                                // Avoid overkill events, trigger timeupdate manually
                                if ( event === "timeupdate" ) {
                                    
                                    if ( !this.media.paused ) {
                                        return;
                                    } 
                                    videos.b.trigger( "timeupdate" );
                                    
                                    // update scrubber
                                    //scrub.val( this.currentTime() );
                                    
                                    return;
                                }
                                
                                if ( event === "seeking" ) {
                                    
                                    videos.b.currentTime( this.currentTime() );
                                }
                                
                                if ( event === "play" || event === "pause" ) {
                                    console.log(event);
                                    videos.b[ event ]();
                                }
                            });
                        });
                    }
                });
            });

            
            
            videos.a.loop( true );
            videos.b.loop( true );

            window.setTimeout(function() {

              videos.a.play();
              videos.b.play();

              

            }, 1000);
                

   			
        }

    }

    module.exports = VideoSlider || window.VideoSlider;

})();

},{}],28:[function(require,module,exports){
"use strict"

window.Utils = window.Utils || {};
var $window = $(window);
var BridgeStreet = {};
window.currentSplitState = "center";

var DOMUtils = require('./utils/DOMUtils');
var BSuicomponents = require('./widgets/BRIDGESTREET.ui.components.js');
var BSspinnerwidget = require('./widgets/BRIDGESTREET.spinner.widget');
var BSnavigation = require('./elements/BRIDGESTREET.navigation.js');
var BSpeeldown = require('./elements/BRIDGESTREET.peeldown.js');
var BShomepagehero = require('./elements/BRIDGESTREET.homepage.hero.js');
var BSstatisticspod = require('./elements/BRIDGESTREET.statistics.pod.js');
var BSfeaturedpod = require('./elements/BRIDGESTREET.featured.pod.js');
var BSsearchfilter = require('./elements/BRIDGESTREET.search.filter.js');
var BSsearchlisting = require('./elements/BRIDGESTREET.search.listing.js');
var BSmapview = require('./elements/BRIDGESTREET.mapview.js');
var BSglobalsearch = require('./elements/BRIDGESTREET.global.search.go.js');
var BSmobilemodal = require('./elements/BRIDGESTREET.mobile.modal.js');
var BSnearby = require('./elements/BRIDGESTREET.nearby.js');
var BSdetailcarousel = require('./elements/BRIDGESTREET.detail.carousel.js');
var BSaccordionlist = require('./elements/BRIDGESTREET.accordion.list.js');
var BStripdetails = require('./elements/BRIDGESTREET.detail.yourtrip.js');
var BSrelatedproperties = require('./elements/BRIDGESTREET.detail.related.properties.js');
var BSbookingflow = require('./elements/BRIDGESTREET.bookingflow.js');
var BScontactusform = require('./elements/BRIDGESTREET.contactusform.js');
var BScontactusMaps = require('./elements/BRIDGESTREET.contactusMaps.js');
var BSpartnercontactusform = require('./elements/BRIDGESTREET.partnercontactusform.js');
var BSallLocations = require('./elements/BRIDGESTREET.alllocations.js');
var BSVideoSlider = require('./elements/BRIDGESTREET.video.slider.js');

(function ($window, window, document, jQuery, app) {

    BridgeStreet = {

        initGlobal: function () {

            /*
             *  An easy-to-use library for eliminating the 300ms delay between a physical
             *  tap and the firing of a click event on mobile browsers.
            */

            //FastClick.attach(document.body); 

            /*
             *  jQuery UI and Bootstrap use 'button'. Need to create a noConflict
            */
            var bootstrapButton = $.fn.button.noConflict();

            BSnavigation.init($window);


            BSglobalsearch.init($window);

            /*
             *  Initializes the peeldown functionality
            */

            BSpeeldown.init($window);

            /*
             *  Intializing REMODAL modal/mobile search functionality
            */

            BSmobilemodal.init($window);

            /*
             *  Intializing Spinner widgets
            */

            BSspinnerwidget.init($window);

            /*
             *  Intializing Sticky functionality on
            */

            BSuicomponents.initSticky($window);

            
            /*
             *  Intializing Search Page state slider component
            */

            BSuicomponents.iniSearchPageStateSliderComponent($window);

            /*
             *  Intializing SVG animation
            */

            BSuicomponents.initSVGAnimation($window);

            /*
             *  Intializing Viewport animations..if any
            */

            BSuicomponents.initViewportAnimations($window);


        },

        /*
          *  Intializing homepage hero functionality
         */

        initHomepageHero: function () {

            BShomepagehero.init();

        },

        /*
          *  Intializing statistsics component functionality
         */

        initStatistics: function () {

            BSstatisticspod.init();

        },

        /*
          *  Intializing search results page functionality
         */

        initSearchResults: function () {

            if ($('#filter-container').length == 0) return false;
          
          $.when(BSsearchfilter.init()).then(

              function (status) {
                  console.log("filter rendering succeeded; " + status);
                             
                  BSsearchlisting.init();
                  BSmapview.init();

                  $('.p-accordion').SimpleAccordion();

                  BSuicomponents.initSearchPageUIComponents();
              },
              function (status) {
                  console.log("filter rendering failed; " + status);
              },
              function (status) {
                  console.log("filter rendering is done; " + status);
              }
            );

        },

        /*
         *  Homepage 4 column featured property pods. Slight functionality change depending on browser size.
        */

        initFeaturedPod: function () {

            BSfeaturedpod.init();

        },


        /*
          *  Intializing property detail page carousel functionality
         */

        initDetailCarousel: function () {

            BSdetailcarousel.init();
        },

        /*
          *  Intializing accordion functionality
         */
        initAccordionList: function () {

            BSaccordionlist.init();

        },
        /*
          *  Intializing trip details functionality
         */
        initTripDetails: function () {

            if ($('#your-trip').length == 0) return false;
            
            $.when(BStripdetails.init()).then(

                function (status) {
                    console.log("your trip rendering succeeded; " + status);
                },
                function (status) {
                    console.log("your trip rendering failed; " + status);
                },
                function (status) {
                    console.log("your trip rendering is done; " + status);
                }
              );
            
        },
        initRelatedProperties: function () {

            if ($('#related-properties').length == 0) return false;

            BSrelatedproperties.init();
            
        },
        /*
          *  Intializingnearby functionality
         */
        initNearby: function () {

            BSnearby.init();

        },
        initBookingFlow : function () {

            if ($("#booking-form").length) {

                BSbookingflow.Init();

                return;

            }

            if ($("#request-form").length) {

                BSbookingflow.InitRequest();

                return;

            }

        },

        initContactUsForm : function() {
            if ($("#panel-contact-us-form").length) {
                BScontactusform.init();
            }
        },

        initContactUsFormMaps: function () {
            if ($("#contactUsMaps").length) {
                BScontactusMaps.init();
            }
        },

        initPartnerContactUsForm: function () {

            if ($("#partner-contact-us-form").length) {
                BSpartnercontactusform.init();
            }
        },

        initAllLocations : function () {
            if ($(".locations-page").length) {
                BSallLocations.init();
            }
        },


        initVideoSlider : function ($window) {

            BSVideoSlider.init($window);

        }        
    }

})(window, document, jQuery, window.Utils);

jQuery( document ).ready( function (jQuery) {

    "use strict";

    BridgeStreet.initHomepageHero($window);

    BridgeStreet.initStatistics($window);

    BridgeStreet.initFeaturedPod($window);

    BridgeStreet.initSearchResults($window);

    BridgeStreet.initDetailCarousel($window);

    BridgeStreet.initAccordionList($window);

    BridgeStreet.initTripDetails($window);

    BridgeStreet.initRelatedProperties($window);

    BridgeStreet.initNearby($window);

    BridgeStreet.initGlobal($window);

    BridgeStreet.initBookingFlow($window);

    BridgeStreet.initContactUsForm($window);

    BridgeStreet.initContactUsFormMaps($window);

    BridgeStreet.initPartnerContactUsForm($window);

    BridgeStreet.initAllLocations($window);

    BridgeStreet.initVideoSlider();

    //Look for a hash and scroll to the id if it exist on the page
    DOMUtils.scrollPageToId();

});
},{"./elements/BRIDGESTREET.accordion.list.js":1,"./elements/BRIDGESTREET.alllocations.js":2,"./elements/BRIDGESTREET.bookingflow.js":3,"./elements/BRIDGESTREET.contactusMaps.js":4,"./elements/BRIDGESTREET.contactusform.js":5,"./elements/BRIDGESTREET.detail.carousel.js":6,"./elements/BRIDGESTREET.detail.related.properties.js":7,"./elements/BRIDGESTREET.detail.yourtrip.js":8,"./elements/BRIDGESTREET.featured.pod.js":9,"./elements/BRIDGESTREET.global.search.go.js":11,"./elements/BRIDGESTREET.homepage.hero.js":14,"./elements/BRIDGESTREET.mapview.js":16,"./elements/BRIDGESTREET.mobile.modal.js":17,"./elements/BRIDGESTREET.navigation.js":18,"./elements/BRIDGESTREET.nearby.js":19,"./elements/BRIDGESTREET.partnercontactusform.js":20,"./elements/BRIDGESTREET.peeldown.js":21,"./elements/BRIDGESTREET.search.filter.js":22,"./elements/BRIDGESTREET.search.listing.js":23,"./elements/BRIDGESTREET.statistics.pod.js":25,"./elements/BRIDGESTREET.video.slider.js":27,"./utils/DOMUtils":32,"./widgets/BRIDGESTREET.spinner.widget":34,"./widgets/BRIDGESTREET.ui.components.js":35}],29:[function(require,module,exports){
var BSGlobalSearchGuest = require('../elements/BRIDGESTREET.global.search.guests');

var calendarControl = (function() {

    var insObj = {};   

    return  {
        nr : 0,

		update : function(inst, event) {

            var values = inst.getVal(true),
                
                start = values && values[0],
                
                end = values && values[1];
                
                this.nr = start && end ? Math.max(1, Math.round((new Date(end).setHours(0, 0, 0, 0) - new Date(start).setHours(0, 0, 0, 0)) / 86400000) + 1) : 0;
                
            inst._markup.find('.popup-days-nr').html(this.nr);

            if (start && end && this.nr < 1) {                
                inst._markup.find('.popup-alert').addClass('popup-alert-visible');           
            } else {
                
                inst._markup.find('.popup-alert').removeClass('popup-alert-visible');

                if ( event.active == 'end') {
                    setTimeout(function () 
                    {
                        inst.select();

                        BSGlobalSearchGuest.show();

                    }, 1000);
                }
            }

            inst.position();
            inst.redraw();
		},

        set : function(msInstance) {

            insObj = msInstance;

        },

        setValue : function(start, end) {

            insObj.setVal([new Date(start), new Date(end)], true);

        },
        
        get : function() {

            return insObj;

        },

        getMarkup :  function() {

            return '<div class="popup-alert"><i class="fa fa-exclamation-triangle"></i>The minimum length of stay for this location is 30 days. Please adjust date range or property location.</div><div class="popup-explore"><div class="popup-explore-left"><div class="popup-explore-left-container">Length of stay <span class="popup-days-nr">'+ this.nr +'</span> <span class="pop-days-label">Days</span></div></div><div class="popup-explore-right"></div></div>';                 

        }

    }

})();

module.exports = calendarControl || window.calendarControl;
},{"../elements/BRIDGESTREET.global.search.guests":12}],30:[function(require,module,exports){
var currencyUtil = (function () {
    var my = {},
    currency_symbols = {
        'USD': '$', // US Dollar
        'EUR': '€', // Euro
        'CRC': '₡', // Costa Rican Colón
        'GBP': '£', // British Pound Sterling
        'ILS': '₪', // Israeli New Sheqel
        'INR': '₹', // Indian Rupee
        'JPY': '¥', // Japanese Yen
        'KRW': '₩', // South Korean Won
        'NGN': '₦', // Nigerian Naira
        'PHP': '₱', // Philippine Peso
        'PLN': 'zł', // Polish Zloty
        'PYG': '₲', // Paraguayan Guarani
        'THB': '฿', // Thai Baht
        'UAH': '₴', // Ukrainian Hryvnia
        'VND': '₫', // Vietnamese Dong
    };

    my.convert = function (code) {
        return currency_symbols[code];
    };
    
    my.formatCurrency = function (value) {
        value = value.toFixed(2);
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    return my;
}());

module.exports = currencyUtil || window.currencyUtil;
},{}],31:[function(require,module,exports){
var dateFormat = (function() {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
})();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

module.exports = dateFormat || window.dateFormat;
},{}],32:[function(require,module,exports){
(function(window) {

    'use strict';

    var comparator = {

        '<': function (a, b) { return a < b; },

        '<=': function (a, b) { return a <= b; },

        '>': function (a, b) { return a > b; },

        '>=': function (a, b) { return a >= b; }

    }    

    window.DOMUtils = function(selector, context) {

        return new DOMUtils.query(selector, context);

    };

    DOMUtils.extend = function() {

        var target = this, key, count = 0;

        if (arguments.length > 1) {

            target = arguments[0];

            count = 1;

        }

        for (count; count < arguments.length; count++) {

            for (key in arguments[count]) {

                if (arguments[count].hasOwnProperty(key)) {

                    target[key] = arguments[count][key];

                }

            }

        }

        return target;
    };

    DOMUtils.extend({

        ready: function(func) {

            if (typeof func === 'function') {

                window.addEventListener('load', func);

            }

        },

        each: function(object, callback) {
            
            // Stop if no object or callback given.
            if (!object || !callback) {

                return false;

            }

            for (var i = 0; i < object.length; i++) {

                callback.call(object[i], i);

            }

            return this;

        },

        query: function(selector, context) {

            // If no context is given then use document.
            context = context || document;

            // Stop if no selector or blank selector found.
            if (!selector || selector === "") {

                return false;

            }

            // Return selector if is already a DOM instance.
            if (selector instanceof DOMUtils) {

                return selector;

            }

            // If the selector is a single node then return it.
            if (selector.nodeType === 1 || selector.nodeType === 9) {

                this[0] = selector;

                this.length = 1;

                return this;

            }

            [].push.apply(this, context.querySelectorAll(selector));

            return this;

        },

        isNull: function (element) {

            return element === null;

        },

        isUndefined: function (element) {

            return element === void 0;

        },

        isElement: function (element) {

            if (typeof HTMLElement === 'object') {

                return element instanceof HTMLElement;

            }

            return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === 'string';

        },

        isNode: function (node) {

            if (typeof Node === 'object') {

                return node instanceof Node;

            }

            return node && typeof node === 'object' && typeof node.nodeType === 'number' && typeof node.nodeName === 'string';

        },

        isObj: function (obj) {

            return obj === Object(obj);

        },

        isNumber: function (num) {

            return !isNaN(parseFloat(num)) && isFinite(num);

        },

        isFunction: function (value) {    // fallback check is for IE

            return toString.call(value) === '[object Function]' || typeof value === 'function';

        },


        // Arithmetic checks
        /* -------------------------------------------------------------------------- */
        random: function () {

            return Math.random();

        },

        // Array utils
        /* -------------------------------------------------------------------------- */
        is_arr: function (arr) {

            return typeof (arr) == 'object' && (arr instanceof Array);

        },

        // Mobile device detection
        /*--------------------------------------------------------------------------- */


        compareVersion: function (version, range) {

            var string = (range + '');

            var n = +(string.match(/\d+/) || NaN);

            var op = string.match(/^[<>]=?|/)[0];

            return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);

        },

        uAgent: function () {
            return (navigator && navigator.userAgent || '').toLowerCase();
        },

        appVersion: function () {

            return (navigator && navigator.appVersion || '').toLowerCase();

        },

        is_tablet: function () {

            return  this.androidTablet() ||

                    this.ipad() ||

                    this.windowsTablet();
        },

        ipad : function(range) {

            var match = this.uAgent().match(/ipad.+?os (\d+)/);

            return match !== null && this.compareVersion(match[1], range);
        
        },       

        androidTablet : function() {

            return /android/.test(this.uAgent()) && !/mobile/.test(this.uAgent());
        
        },  

        windowsTablet : function() {
           
            return this.windows() && !this.is_windowsPhone() && /touch/.test(this.uAgent());
        
        },      

        is_tabletSize : function () {

            return ((window.innerWidth >= 768) && (window.innerWidth < 1025)) ? true : false;

        },      


        is_mobile: function () {


            return this.is_iphone() ||

                   this.is_ipod() ||

                   this.is_androidPhone() ||

                   this.is_blackberry() ||

                   this.is_windowsPhone() ||

                   this.is_mobileSize();

        },

        is_iphone: function (range) {

            var match = this.uAgent().match(/iphone(?:.+?os (\d+))?/);

            return !!match && this.compareVersion(match[1] || 1, range);

        },

        is_ipod: function (range) {

            var match = this.uAgent().match(/ipod.+?os (\d+)/);

            return !!match && this.compareVersion(match[1], range);

        },

        is_androidPhone: function () {

            return /android/.test(this.uAgent()) && /mobile/.test(this.uAgent());

        },

        is_blackberry: function () {

            return /blackberry/.test(this.uAgent()) || /bb10/.test(this.uAgent());

        },

        windows: function () {

            return /win/.test(this.appVersion());

        },

        is_windowsPhone: function () {

            return this.windows() && /phone/.test(this.uAgent());

        },

        is_mobileSize: function () {

            return (window.innerWidth) < 768 ? true : false;

        },

        // Array utils
        /* ----------------------------------------------------------------------------- */

        emptyArray: function (arr) {

            for (var i = arr.length; i > 0; i--) {

                arr.pop();

            }

            arr.length = 0;
        },

        shuffle: function (array) {

            var arrLength = array.length;

            for (var i = 0; i < arrLength; i++) {

                var random = arrLength * this.random() | 0;

                if (random == i) { continue; }

                var newArrElement = array[random];

                array[random] = array[i];

                array[i] = newArrElement;

            }

            return array;
        },

        transformToArray: function (parameters) {

            var params = {};

            var arr = parameters.split("&");

            for (var i = 0; i < arr.length; i++) {

                var newArr = arr[i].split("=");

                params[newArr[0]] = newArr[1];

            }

            return params;

        },


        // String utils
        /* -------------------------------------------------------------------------- */
        capitaliseFirst: function (string) {

            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

        },

        capitaliseAllWords: function (str) {

            str = str.toLocaleLowerCase();

            var pieces = str.split(" ");

            for (var i = 0; i < pieces.length; i++) {

                var j = pieces[i].charAt(0).toUpperCase();

                pieces[i] = j + pieces[i].substr(1);

            }

            return pieces.join(" ");

        },

        searchWord: function (word, string) {

            word = word.toLowerCase();

            string = string.toLowerCase();

            var result = string.search(word);

            if (result == -1)

                return false;

            else

                return true;

        },

        stripCharacters : function(string) {

            return string.replace(/\D/g,'');

        },

        // Timer utils
        /* -------------------------------------------------------------------------- */

        debounce: function (func, wait, immediate) {

            var timeout;

            return function () {

                var context = this, args = arguments;

                var later = function () {

                    timeout = null;

                    if (!immediate) func.apply(context, args);

                };

                var callNow = immediate && !timeout;
                
                clearTimeout(timeout);

                timeout = setTimeout(later, wait);

                if (callNow) func.apply(context, args);

            };
        },

        throttle: function (delay, fn) {

            var last, deferTimer;

            return function () {

                var context = this, args = arguments, now = +new Date;

                if (last && now < last + delay) {

                    clearTimeout(deferTimer);

                    deferTimer = setTimeout(function () { last = now; fn.apply(context, args); }, delay);

                }

                else {

                    last = now;

                    fn.apply(context, args);

                }
            };
        },


        // URL utils
        /* -------------------------------------------------------------------------- */

        getURLInformation : function() {

            var location = window.location;

            return {

                protocol : location.protocol,

                host     : location.host,

                hostname : location.hostname,

                port     : location.port,

                pathname : location.pathname

            }

        },

        getParameterByName: function (name) {

            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        },

        getQueryParams: function (string) {

            if (_.isEmpty(app.utils.getParameterByName(string))) return false;

            return app.utils.getParameterByName(string);

        },

        getAllQueryParams: function () {

            var string = window.location.search.substr(1);

            return string != null && string != "" ? app.utils.transformToArray(string) : {};

        },

        vendor_prefix: function () {

            var prefix;

            var styles = window.getComputedStyle(document.documentElement, '');

            prefix = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];

            return prefix;
        },

        numberWithCommas : function(x) {

            var parts = x.toString().split(".");

            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            return parts.join(".");

        },

        // Map utils
        /* -------------------------------------------------------------------------- */

        // defines the SVG paths
        mapMarkerPath : function () {
            return "M19.2,0C8.7,0,0.1,8.3,0,18.5c0,4.2,1.3,8,3.7,11.1l15,18.4l15.4-18.4c2.4-3.1,3.9-6.9,3.9-11.1C38.1,8.3,29.7,0,19.2,0z   M19,26.2c-4,0-7.2-3.2-7.2-7.2s3.2-7.2,7.2-7.2s7.2,3.2,7.2,7.2S23,26.2,19,26.2z";
        },

        //Sytles the look for the new map marker
        newMarkerImage: function () {
            var mapMarkerPath = DOMUtils.mapMarkerPath();
            return {

                path: mapMarkerPath,

                fillColor: '#024',

                fillOpacity: 1,

                strokeColor: '#fff',

                strokeWeight: 2,

                scale: 0.75,

                anchor: new google.maps.Point(19, 47)
            };
        },

        //Sytles the look for the hover state for new map marker
        markerImageHover: function () {
            var mapMarkerPath = DOMUtils.mapMarkerPath();
            return {

                path: mapMarkerPath,

                fillColor: "#FF6600",

                fillOpacity: 1,

                strokeColor: '',

                strokeWeight: 0,

                scale: 0.75,

                anchor: new google.maps.Point(19, 47)
            };
        },

        //Scroll to an id from hash but offset by the height of the fixed seach bar
        scrollPageToId: function () {
            var scrollId = DOMUtils.getParameterByName("scrollLoc");
            var scrollElem = $("#" + scrollId);
            if (scrollId != null && scrollElem.length) {
                var searchHeight = $(".sticky-header").height() + 20;
                var scrollLocation = scrollElem.offset().top - searchHeight;
                setTimeout(function () {
                    TweenMax.to(window, 1, { scrollTo: { y: scrollLocation, x: 0 } });
                }, 1000)
                
            }
        },

        fitToPlaceholder: function (id) {
            var $control = $("#"+id);

            var pxPerLetter = 7;
            var fullTextLength = ($control.attr('data-value-large').length + 1);
            var placholderWidth = fullTextLength * pxPerLetter;
            var controlWidth = $control.width();

            var attr = (placholderWidth < controlWidth) ? 'data-value-large' : 'data-value-small';
            var placeholderText = $control.attr(attr);
            $control.attr('placeholder', placeholderText);            
        },
        resizeForOldBrowsers: function () {

            if (navigator.userAgent.match(/8[.\d]+ Safari/)) {
                $('.property-pod').matchHeight();
                $(window).on('resize', { self: this }, function () {
                    $('.property-pod').matchHeight();
                });
            }
        }

    });

    DOMUtils.query.prototype = DOMUtils.prototype;    

    module.exports = window.DOMUtils;

})(window);
   
},{}],33:[function(require,module,exports){
(function () {

    var factory = (function() {

        return  {

    		incrementGuest : function(currentValue, index) {

    			var scope = this;

    			var _currentTotal = 0;

    	        _.each(jQuery('.spinner-incredment input'), function(a, b) {

    	        	_currentTotal += (Number( jQuery(a).val() )) ;

    	        });			

                return _currentTotal;
    		}

        }

    })();

    module.exports = factory || window.factory;

})();

},{}],34:[function(require,module,exports){
(function () {

    var SpinnerWidget = {

    	_currentTotal : null,

        init : function () {

            /*
             *  Initializes jQuery UI Spinner
            */

            if (DOMUtils.isUndefined(document.getElementsByClassName('spinner')[0])) return;

            var spinner = jQuery('.trip-detail-spinner').spinner({ 

                min: 0, 

                max: 20,

                step: 1,

                alignment: 'horizontal',

                icons: {
                       
                  left: "fa fa-minus",   
                      
                  right: "fa fa-plus"

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

            .empty()                  

		}

    }

    module.exports = SpinnerWidget || window.SpinnerWidget;

})();

},{}],35:[function(require,module,exports){
var BSsplitscreen = require('../elements/BRIDGESTREET.split.screen.js');
(function ($window) {

    var uiComponents = {

        init: function () {

        },

        initSticky: function () {

        	if (DOMUtils.is_mobile()) {

				jQuery('#MobileSearch').stickUp();

                if (!DOMUtils.isNull(document.getElementById('Sticky'))) {

					jQuery("[data-sticky_column]").trigger("sticky_kit:detach");

				}

			} else {

				if (!DOMUtils.isUndefined(document.getElementsByClassName('sticky-header')[0])) {
		
					jQuery('.sticky-header').stick_in_parent({
                        bottoming: false
					});

				}

			}
        },

        initRangeSliderComponent: function (filter) {

        	if (DOMUtils.isNull(document.getElementById('RangeSlider'))) return false;
				
				var rSlider = document.getElementById('RangeSlider');

	            var price = filter.model.attributes.Price;

	            if (price == null || price.Max == price.Min)

	                price = { Min: 0, Max: 1000, RangeMax: 1000 };

           		if (DOMUtils.isUndefined(rSlider.noUiSlider)) {

					noUiSlider.create(rSlider, {

                    	start: [price.Min, price.Max],

							connect: true,

							tooltips: true,

							range: {

		                        'min': Math.floor(0),

		                        'max': Math.floor(price.RangeMax)

							},

							format: wNumb({

								decimals: 0,

								mark: '.',

								thousand: ',',

								prefix: ''

							})

						});

	                rSlider.noUiSlider.on('end', function (values, handle) {
	                    filter.applyFilter(this);
	                });

				}

				jQuery('.selectpicker').selectpicker();
					
        },

        iniSearchPageStateSliderComponent: function () {

        	if (DOMUtils.isNull(document.getElementById('StateSlider'))) return false;

	        	window.stateSlider = document.getElementById('StateSlider');

				noUiSlider.create(stateSlider, {

					start: 50,

					connect: 'lower',

					animate: false,

					step: 50,

					cssPrefix: 'noUiState-',

					range: {

						'min': 0,

						'max': 100

					},

					format: wNumb({

						decimals: 0

					})					

				});  

            stateSlider.noUiSlider.on('change', function (values) {

            	jQuery(".PropertyPodSearchMapview").html("");
           	
                switch (Math.round(values)) {
                    case 0:

							window.currentSplitState = "left";

							jQuery('#grid').removeClass("split-view").addClass('list-view');

							BSsplitscreen.setState(0, BSsplitscreen.setListView);

							break;

                    case 50:

							window.currentSplitState = "center";

							jQuery('#grid').removeClass("list-view").addClass('split-view');

							BSsplitscreen.setState(1, BSsplitscreen.setSplitView);

							break;

                    case 100:

							window.currentSplitState = "right";

							BSsplitscreen.setState(2, BSsplitscreen.setMapView);
							

							break;							
					}
				});				

        },

        getFiltersHeight: function () {

			this.contentHeight = 0;

        	this.desktopSearthHeight = jQuery('.desktop-search').outerHeight();
        	
        	this.resultsFilterHeight = jQuery('.results-filter').outerHeight();	
        	       	
        	this.offsetHeight =  this.desktopSearthHeight + this.resultsFilterHeight;

        	return this.offsetHeight;			

        },        

        initSearchPageUIComponents: function () {
        	
        	var self = this;

			if (DOMUtils.isUndefined(document.getElementsByClassName('results-filter')[0])) return false;
			
				jQuery('.cancel-btn').on("click", function () {

					jQuery('.collapse-panel').collapse('hide');

				})				

				jQuery('#CollapseExample').on('hidden.bs.collapse', function () {
					
					jQuery('.results-list-map-wrapper').css('visibility', 'visible');
					
					jQuery('.results-list-map-wrapper').css('overflow', 'visible');

					jQuery('.pane-slider').show();
					
				})

				jQuery('#CollapseExample').on('shown.bs.collapse', function () {
					
					jQuery('.results-list-map-wrapper').css('visibility', 'hidden');
					
					jQuery('.results-list-map-wrapper').css('overflow', 'hidden');

					if (!DOMUtils.is_mobile()) {

						jQuery('.pane-slider').hide();

		            	self.contentHeight = window.innerHeight - self.getFiltersHeight();

		            	jQuery('.results-list-map').height(self.contentHeight); 


		            	jQuery('.collapse-panel-wrapper').outerHeight(self.contentHeight);
								
					}
				})				

				var toggle = 0;

            jQuery('.filters-edit-btn').on('click', function () {

					toggle = (toggle == 0 ? 1 : 0);

                if (toggle == 0) {

						jQuery('#top-filter').removeClass('active');

					} else {

						jQuery('#top-filter').addClass('active');

					}

            })

            if (!DOMUtils.isUndefined(document.getElementsByClassName('p-accordion')[0])) {
                var accToggleBtn = jQuery('.accordion-toggle');

                var accItems = jQuery('.p-accordion');

                jQuery('.p-accordion').SimpleAccordion();
            }

            

        },

        initSVGAnimation: function () {

        	if (DOMUtils.isUndefined(document.getElementsByClassName('img-svg')[0])) return false;

			var trigger = new ScrollTrigger({

			      toggle: {

			        visible: 'visibleClass',

			        hidden: 'hiddenClass'

			      },

			      once: true

			    }, document.body, window);


			var watchSVG,
			    bedSVG,
			    deviceSVG,
                bathtubSVG,
			    svgArray = [];

			var intervalSVG;

			this.intervalIndex = 0;

			this.atEnd = false;

            var callback = function (scrollLeft, scrollTop, width, height) {
                watchSVG = new Vivus('svg-animate-stopwatch', { start: "manual", duration: 60 });
                bedSVG = new Vivus('svg-animate-bed', { start: "manual", duration: 60 });
                deviceSVG = new Vivus('svg-animate-device', { start: "manual", duration: 60 });
                bathtubSVG = new Vivus('svg-animate-bathtub', { start: "manual", duration: 60 });

				svgArray.push(watchSVG, bedSVG, deviceSVG, bathtubSVG);

				intervalSVG = setInterval(fadeInSVG, 500);
				trigger.detach(callback);
			};

			trigger.attach(callback);

			function fadeInSVG(index) {

				var num = uiComponents.isAtEnd();

                if (DOMUtils.isNumber(num)) {

                    if (num - 1 < svgArray.length) {

						svgArray[num - 1].stop().reset().play();

					} else {

						uiComponents.atEnd = true;

						clearInterval(intervalSVG);
					}
				}

			}

        },

        isAtEnd: function () {
			
            return this.atEnd ? this.intervalIndex = 0 : ++this.intervalIndex;
		
		},        

        initViewportAnimations: function () {

			var trigger = new ScrollTrigger({

			      toggle: {

			        visible: 'visibleClass',

			        hidden: 'hiddenClass'

			      },

			      offet: {

			        x: 0,

			        y: 20

			      },

			      addHeight: true,

			      once: true

			    }, document.body, window);

            var callback = function (scrollLeft, scrollTop, width, height) {

			    trigger.detach(callback);
			  };


			trigger.attach(callback);

		}

    }

    module.exports = uiComponents || window.uiComponents;

})();


},{"../elements/BRIDGESTREET.split.screen.js":24}]},{},[28]);
