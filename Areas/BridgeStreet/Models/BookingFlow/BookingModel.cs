using System.Collections.Generic;

using BridgeStreet.Data.Services.AvailabilitySearch;
using BridgeStreet.Website.Areas.BridgeStreet.Models.PartnerPage;
using BridgeStreet.Website.Domain.DomainModels;
using BridgeStreet.Website.Domain.DTOs;
using BridgeStreet.Website.Domain.Models.Content.Partners;
using BridgeStreet.Website.Domain.Models.Pages.BookingFlow;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.BookingFlow
{
    public class BookingModel : BaseBookingModel
    {
        public bool IsRequest { get; set; }

        public BookingPage BookingPage { get; set; }

        public PropertyDetail Property { get; set; }

        public AvailabilitySearchResult Rate { get; set; }
    }
}