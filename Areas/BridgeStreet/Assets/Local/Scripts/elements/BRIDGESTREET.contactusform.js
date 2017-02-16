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