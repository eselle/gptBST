using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using BridgeStreet.Data.Services.AvailabilitySearch;
using BridgeStreet.Website.Domain.DTOs;
using BridgeStreet.Website.Service;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers.WebAPI
{
    public class YourTripController : ApiController
    {
        private readonly PropertySearchService _propertySearchService;

        public YourTripController(PropertySearchService propertySearchService)
        {
            if (propertySearchService == null)
            {
                throw new ArgumentNullException("propertySearchService");
            }

            this._propertySearchService = propertySearchService;
        }

        [HttpGet]
        [ActionName("Index")]
        public IEnumerable<AvailabilitySearchResult> Get(int propertyId, DateTime startDate, DateTime endDate, int? roomType = null, string promoCode = "")
        {
            var service = new AvailabilitySearchService();
            var searchCriteria = new AvailabilitySearchCriteria(propertyId, startDate, endDate, promoCode);
            var result = service.AvailabilitySearch(searchCriteria);
            return result;
        }
    }
}