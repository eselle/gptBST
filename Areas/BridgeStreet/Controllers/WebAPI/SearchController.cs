using System.Web.Http;
using BridgeStreet.Data.Services.AvailabilitySearch;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers.WebAPI
{
    public class SearchController : ApiController
    {
        private readonly AvailabilitySearchService _searchService;

        public SearchController()
        {
            this._searchService = new AvailabilitySearchService();
        }        
    }
}
