using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.ContactUs
{
    public class ContactModel
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MobileNumber { get; set; }

        public string EmailAddress { get; set; }

        public string Company { get; set; }

        public string Location { get; set; }

        public string FeedbackType { get; set; }

        public string Subject { get; set; }

        public string Comments { get; set; }

        public string ContactMethod { get; set; }

        public string RecaptchaResponse { get; set; }

        public string FormType { get; set; }
    }
}