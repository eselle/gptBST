using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BridgeStreet.Website.Domain.Models.Pages.BookingFlow;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.BookingFlow
{
    public class RequestBookingModel : BaseBookingModel
    {
        public RequestBookingPage RequestBookingPage { get; set; }
    }
}