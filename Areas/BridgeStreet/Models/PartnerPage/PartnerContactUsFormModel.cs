using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.PartnerPage
{
    public class PartnerContactUsFormModel
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }

        public string Company { get; set; }

        public string CompanyType { get; set; }

        public string Comments { get; set; }

        public IEnumerable<string> Regions { get; set; }

        public IEnumerable<string> AreasOfInterest { get; set; }

        public string ContactMethod { get; set; }

        public string RecaptchaResponse { get; set; }

        public string FormType { get; set; }
    }
}