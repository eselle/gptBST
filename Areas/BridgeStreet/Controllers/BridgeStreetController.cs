using BridgeStreet.Website.Service;
using Glass.Mapper.Sc.Web.Mvc;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class BridgeStreetController : GlassController
    {
        public BridgeStreetController()
        {
        }

        public BridgeStreetController(SiteService siteService)
        {
            this.SiteService = siteService;
        }

        public SiteService SiteService { get; set; }
    }
}