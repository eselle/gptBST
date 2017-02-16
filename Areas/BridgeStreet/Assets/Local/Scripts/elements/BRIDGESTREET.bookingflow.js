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