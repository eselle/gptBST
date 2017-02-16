using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BridgeStreet.Website.Areas.BridgeStreet.Models.BookingFlow;
using BridgeStreet.Website.Service;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers.WebAPI
{
    public class BookingRequestController : BookingController
    {
        public BookingRequestController(SiteService siteService) : base(siteService)
        {
        }

        [System.Web.Http.AcceptVerbs("GET", "POST")]
        [HttpGet]
        [ActionName("Index")]
        public new BookingConfirmation Get(string reservationToken)
        {
            var request = this.BookingService.GetBookingRequestByReservationToken(reservationToken);
            var conf = new BookingConfirmation()
            {
                ReservationNumber = request.ReservationNumber,
                ReservationToken = request.ReservationToken
            };

            conf.TripInfo.Name = string.Format("{0} {1}", request.FirstName, request.LastName);
            conf.TripInfo.Address1 = request.Address1;
            conf.TripInfo.Address2 = request.Address2;
            conf.TripInfo.City = request.City;
            conf.TripInfo.StateCounty = request.StateCounty;
            conf.TripInfo.ZipPostal = request.ZipPost;
            conf.TripInfo.Country = request.Country;
            conf.TripInfo.CheckIn = request.FromDate;
            conf.TripInfo.CheckOut = request.ToDate;
            conf.TripInfo.PricePerNight = request.PricePerNight;
            conf.TripInfo.TotalAccomodation = request.TotalAccomodation;
            conf.TripInfo.Tax = request.Taxes;
            conf.TripInfo.TotalDue = request.TotalDue;

            return conf;
        }
    }
}
