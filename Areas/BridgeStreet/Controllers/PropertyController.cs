using System;
using System.Web.Mvc;
using BridgeStreet.Website.Domain.Models.Content.Properties;
using BridgeStreet.Website.Service;
using Glass.Mapper.Sc;
using Sitecore.Mvc.Presentation;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class PropertyController : BridgeStreetController
    {
        private readonly PropertySearchService _propertySearchService;

        public PropertyController(SiteService siteService, PropertySearchService propertySearchService)
        {
            if (siteService == null)
            {
                throw new ArgumentNullException("siteService");
            }

            if (propertySearchService == null)
            {
                throw new ArgumentNullException("_propertySearchService");
            }

            this.SiteService = siteService;
            this._propertySearchService = propertySearchService;
        }

        public ActionResult Search()
        {
            var latitude = 41.881832;
            var longitude = -87.623177;
            var searchRadius = 50;
            var searchUnits = "M";

            var propertyList = this._propertySearchService.GetPropertiesByLocation(1, latitude, longitude, searchRadius, searchUnits);
            return this.View("~/Areas/Bridgestreet/Views/Renderings/Property/PropertyCard.cshtml", propertyList);
        }

        public ActionResult PropertySearchBar()
        {
            var searchPageLink = this.SiteService.GetSettings().SearchPageLink;
            return this.View("~/Areas/Bridgestreet/Views/Renderings/Widgets/PropertySearchBar.cshtml", searchPageLink);
        }

        /// <summary>
        /// Controller GET action for:
        /// \Areas\BridgeStreet\Views\Renderings\PropertyDetail\Nearby.cshtml
        /// </summary>
        /// <returns>Property model</returns>
        [HttpGet]
        public ActionResult NearBy()
        {
            var settings = this.SiteService.GetSettings();
            var property = RenderingContext.Current.Rendering.Item.GlassCast<Property>();
            property.NearMeZoom = settings.NearMeZoom;
            property.NearMeRadius = settings.NearMeRadius;
            property.NearMeSearchType = settings.NearMeSearchType;
            return this.View("~/Areas/Bridgestreet/Views/Renderings/PropertyDetail/Nearby.cshtml", property);
        }
    }
}