using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BridgeStreet.Website.Areas.BridgeStreet.Models.Homepage;
using BridgeStreet.Website.Domain.DomainModels;
using BridgeStreet.Website.Domain.Models.Component;
using BridgeStreet.Website.Domain.Models.Content.Properties;
using BridgeStreet.Website.Domain.Models.Lists.LocationList;
using BridgeStreet.Website.Domain.Models.Pages.HomePage.HomeFactsPanel;
using BridgeStreet.Website.Domain.Models.Pages.HomePage.HomeFeaturedLocationList;
using BridgeStreet.Website.Domain.Models.Pages.HomePage.HomeFeaturedPropertiesList;
using BridgeStreet.Website.Infrastructure.Sc.Providers;
using BridgeStreet.Website.Service;
using Sitecore.Links;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class HomepageController : BridgeStreetController
    {
        private readonly PropertySearchService _propertySearchService;
        private readonly SiteService _siteService;

        public HomepageController(SiteService siteService, PropertySearchService propertySearchService)
        {
            if (propertySearchService == null)
            {
                throw new ArgumentNullException("propertySearchService");
            }

            if (siteService == null)
            {
                throw new ArgumentNullException("siteService");
            }

            this._propertySearchService = propertySearchService;
            this._siteService = siteService;
        }

        public ActionResult GetFeaturedLocations()
        {
            var model = this.GetDataSourceItem<HomeFeaturedLocationList>();

            if (model == null || model.Locations == null) return new EmptyResult();

            var locations = model.Locations.ToList();
            var areaIds = locations.Select(x => x.AreaId).ToList();
            var areaDetails = this._propertySearchService.GetAreasById(areaIds).ToList();

            List<HomeFeaturedLocationItemViewModel> items = new List<HomeFeaturedLocationItemViewModel>();
            foreach (var m in model.Locations)
            {
                AreaDetail areaDetail = areaDetails.SingleOrDefault(x => x.AreaId == m.AreaId);
                if (areaDetail != null)
                {
                    HomeFeaturedLocationItemViewModel ivm = new HomeFeaturedLocationItemViewModel(m, areaDetail);
                    items.Add(ivm);
                }
            }

            HomeFeaturedLocationListViewModel listViewModel = new HomeFeaturedLocationListViewModel(items, this._siteService.GetSettings().SearchPageLink);

            return this.View("~/Areas/Bridgestreet/Views/Renderings/Homepage/HomeFeaturedLocationsList.cshtml", listViewModel);
        }

        public ActionResult GetFeaturedProperties()
        {
            var source = this.GetDataSourceItem<HomeFeaturedPropertiesList>();

            if (source == null)
            {
                return new EmptyResult();
            }

            var properties = new List<HomeFeaturedPropertyListItemViewModel>();
            foreach (var property in source.Properties.OfType<Property>())
            {
                int id;
                int.TryParse(property.PropertyId, out id);
                var pd = this._propertySearchService.GetPropertyById(id);
                pd.ImageSrc = property.GetPropertyImageUrl();
                ////var url = Sitecore.Links.LinkManager.Providers["bridgestreet"].GetItemUrl(property.InnerItem, new UrlOptions());
                var url = LinkManager.GetItemUrl(property.InnerItem);
                properties.Add(new HomeFeaturedPropertyListItemViewModel(pd, url));
            }

            var model = new HomeFeaturedPropertyViewModel(source, properties);
            return this.View("~/Areas/Bridgestreet/Views/Renderings/Homepage/HomeFeaturedPropertiesList.cshtml", model);
        }

        public ActionResult GetHomeFacts()
        {
            var model = this.GetDataSourceItem<HomeFactsPanel>();
            return this.View("~/Areas/Bridgestreet/Views/Renderings/Homepage/HomeFactsPanel.cshtml", model);
        }
    }
}