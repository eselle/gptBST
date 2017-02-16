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