using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BridgeStreet.Website.Areas.BridgeStreet.Models.AllLocations;
using BridgeStreet.Website.Domain.Models.Base;
using BridgeStreet.Website.Domain.Models.Pages.AllLocationsPage;
using BridgeStreet.Website.Infrastructure.Constants;
using BridgeStreet.Website.Service;
using Glass.Mapper.Sc;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class AllLocationsController : BridgeStreetController
    {
        private readonly PropertySearchService _propertySearchService;
        private readonly SiteService _siteService;

        public AllLocationsController(PropertySearchService propertySearchService, SiteService siteService)
        {
            this._propertySearchService = propertySearchService;
            this._siteService = siteService;
        }

        public ActionResult AllLocationsListing()
        {
            var service = new SitecoreService(Sitecore.Context.Database.Name);
            var root = service.GetItem<ItemBase>(new Guid(Constants.Folders.AreaListFolder));
            List<AreaListResult> lists = new List<AreaListResult>();
            if (root != null)
            {
                foreach (var list in root.Children.OfType<AreaGroupingList>())
                {
                    List<AreaGroupingResult> groupings = new List<AreaGroupingResult>();

                    foreach (var grouping in list.Groupings)
                    {
                        List<AreaResult> areas = new List<AreaResult>();

                        var ids = grouping.Areas.Select(a => int.Parse(a.AreaId)).ToList();
                        var areaModels = this._propertySearchService.GetAreasById(ids);
                        foreach (var area in areaModels)
                        {
                            var areaResult = new AreaResult
                            {
                                AreaName = area.Name,
                                AreaSearchParameters = area.DefaultSearchQuery
                            };

                            areas.Add(areaResult);
                        }

                        var groupingResult = new AreaGroupingResult
                        {
                            GroupingTitle = grouping.GroupName,
                            GroupingAreas = areas
                        };

                        groupings.Add(groupingResult);
                    }

                    var listResult = new AreaListResult
                    {
                        Name = list.Title,
                        ShortName = (!string.IsNullOrEmpty(list.MobileTitle)) ? list.MobileTitle : list.Title,
                        Groupings = groupings
                    };

                    lists.Add(listResult);
                }
            }

            var url = string.Empty;
            if (this._siteService.GetSettings().SearchPageLink != null)
            {
                url = this._siteService.GetSettings().SearchPageLink.Url;
            }

            var model = new AllLocationsViewModel
            {
                Lists = lists,
                SearchUrl = url
            };

            return this.View("~/Areas/Bridgestreet/Views/Renderings/AllLocations/AllLocationsListing.cshtml", model);
        }
    }
}