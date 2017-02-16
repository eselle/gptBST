using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BridgeStreet.Website.Domain.Models.Content.Partners;
using BridgeStreet.Website.Domain.Models.Pages.BookingFlow;
using BridgeStreet.Website.Infrastructure.Attributes;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.BookingFlow
{
    public class BaseBookingModel
    {
        public string Title { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string City { get; set; }

        public string StateCounty { get; set; }

        public string ZipPost { get; set; }

        public string Country { get; set; }

        public string MobileNumber { get; set; }

        public string EmailAddress { get; set; }

        public string ContactMethod { get; set; }

        public string CompanyName { get; set; }

        public string CompanyWebsite { get; set; }

        public string HowDidYouHearAboutUs { get; set; }

        public string BillingAddress1 { get; set; }

        public string BillingAddress2 { get; set; }

        public string BillingCity { get; set; }

        public string BillingStateCounty { get; set; }

        public string BillingZipPost { get; set; }

        public string BillingCountry { get; set; }

        public string PurposeOfTrip { get; set; }

        public string CreditCardNumber { get; set; }

        public string NameOnCard { get; set; }

        public string ExpMonth { get; set; }

        public string ExpYear { get; set; }

        public string CVV { get; set; }

        public string EmailBillingCopyTo { get; set; }

        public string Comments { get; set; }

        public string TermsAndConditions { get; set; }

        [QueryStringParameterMapping("PropertyId")]
        public string PropertyId { get; set; }

        [QueryStringParameterMapping("ArrivalDate")]
        public string FromDate { get; set; }

        [QueryStringParameterMapping("DepartureDate")]
        public string ToDate { get; set; }

        [QueryStringParameterMapping("RoomType")]
        public string RoomType { get; set; }

        [QueryStringParameterMapping("Adults")]
        public string NumberOfAdults { get; set; }

        [QueryStringParameterMapping("Children")]
        public string NumberOfChildren { get; set; }

        [QueryStringParameterMapping("Pets")]
        public string NumberOfPets { get; set; }

        public List<PetType> Pets { get; set; }

        [QueryStringParameterMapping("Promocode")]
        public string PromoCode { get; set; }

        [QueryStringParameterMapping("OscarToken")]
        public string OscarToken { get; set; }

        [QueryStringParameterMapping("SessionId")]
        public string SessionId { get; set; }

        [QueryStringParameterMapping("ReservationToken")]
        public string ReservationToken { get; set; }
    }
}