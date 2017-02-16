using System;
using System.Collections.Generic;
using System.Web.Mvc;
using BridgeStreet.Data.Services.Models.SearchResults;
using BridgeStreet.Website.Infrastructure.Constants;
using BridgeStreet.Website.Infrastructure.Diagnostics;
using BridgeStreet.Website.Infrastructure.Settings;
using BridgeStreet.Website.Service;
using Sitecore.Data.Items;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class PropertySearchController : BridgeStreetController
    {
        private readonly PropertySearchService _propertySearchService;

        public PropertySearchController(PropertySearchService searchFilterService)
        {
            if (searchFilterService == null)
            {
                throw new ArgumentNullException("pageService");
            }

            this._propertySearchService = searchFilterService;
        }

        public ActionResult PropertySearchResults()
        {
            return this.View("~/Areas/Bridgestreet/Views/Renderings/SearchResults/PropertySearchResults.cshtml");
        }

        [HttpGet]
        public JsonResult PropertySearchResultsJSON(FilterValues values)
        {
            try
            { 
            values = this.ValidateFilter(values);
            SearchFilterModel viewModel = this.BuildFilterModel(values);
            viewModel = this._propertySearchService.GetSearchResults(viewModel, values);
            if (values.Area > 0)
            {
                var area = this._propertySearchService.GetAreaById(values.Area);
                viewModel.Price.CurrencyCode = area.CurrencyCode;
            }

            if (viewModel.PropertyResults.Count > 0 && string.IsNullOrWhiteSpace(viewModel.Price.CurrencyCode))
            {
                viewModel.Price.CurrencyCode = viewModel.PropertyResults[0].CurrencyCode;
            }

            return this.Json(viewModel, JsonRequestBehavior.AllowGet);
            }
            catch (Exception err)
            {
                Log.Custom.Error("Search failed. " + err.Message);
                Log.Custom.Error("Search failed. " + err.StackTrace);
                SearchFilterModel model = new SearchFilterModel();
                return this.Json(model, JsonRequestBehavior.AllowGet);
            }
        }

        public SearchFilterModel BuildFilterModel(FilterValues val)
        {
            DateTime today = new DateTime();

            SearchFilterModel filterModel = new SearchFilterModel();
            filterModel.Price.Min = val.PriceMin;
            filterModel.Price.Max = val.PriceMax;
            filterModel.ArrivalDate = val.ArrivalDate;
            filterModel.DepartureDate = val.DepartureDate;
            filterModel.Adults = val.Adults;
            filterModel.Children = val.Children;
            filterModel.Place = val.Place;
            filterModel.LengthOfStay = (val.DepartureDate.Date - val.ArrivalDate.Date).Days;
            filterModel.Lead = (val.ArrivalDate.Date - today.Date).Days;

            Sitecore.Data.Database context = Sitecore.Context.Database;

            //get UI text from the sitecore
            Item filterUI = context.GetItem(Constants.Items.Filters.FilterUI);

            filterModel.Size.Name = filterUI.Fields["Size Title Text"] != null ? filterUI.Fields["Size Title Text"].Value : "Size";

            //filterModel.Size.BathroomsDefault = filterUI.Fields["Bathroom Text"] != null ? filterUI.Fields["Bathroom Text"].Value : "Bathrooms";
            filterModel.Size.RoomTypeDefault = filterUI.Fields["Room Type Text"] != null ? filterUI.Fields["Room Type Text"].Value : "Room Type";

            filterModel.Price.Name = filterUI.Fields["Price Title Text"] != null ? filterUI.Fields["Price Title Text"].Value : "Price";

            filterModel.View.Name = filterUI.Fields["View Title Text"] != null ? filterUI.Fields["View Title Text"].Value : "View";

            filterModel.View.IsRealTimeBookable.Text = filterUI.Fields["Instant Book Text"] != null ? filterUI.Fields["Instant Book Text"].Value : "Instant Bookable";
            filterModel.View.PropertySpecial.Text = filterUI.Fields["Special Deals Text"] != null ? filterUI.Fields["Special Deals Text"].Value : "Special Deal";
            filterModel.IsPetFriendly.Text = filterUI.Fields["Pet Friendly Text"] != null ? filterUI.Fields["Pet Friendly Text"].Value : "Pet Friendly";

            filterModel.View.IsRealTimeBookable.Selected = val.IsRealTimeBookable;
            filterModel.View.PropertySpecial.Selected = val.PropertySpecial;
            filterModel.IsPetFriendly.Selected = val.IsPetFriendly;

            //get attributes from the sitecore
            Item attributeGroups = context.GetItem(Constants.Items.Filters.DynamicFilterSet);
            if (attributeGroups != null)
            {
                foreach (Item group in attributeGroups.GetChildren())
                {
                    if (!string.IsNullOrEmpty(group.Fields["Title"].Value))
                    {
                        AttributeSet set = new AttributeSet()
                        {
                            DisplayName = group.Fields["Title"].Value,
                            Options = new List<TextValueWithType>()
                        };
                        foreach (Item attr in group.GetChildren())
                        {
                            if (!string.IsNullOrEmpty(attr.Fields["Filter Id"].Value) && !string.IsNullOrEmpty(attr.Fields["Display Text"].Value))
                            {
                                int attrId = int.Parse(attr.Fields["Filter Id"].Value);
                                set.Options.Add(new TextValueWithType()
                                {
                                    Text = attr.Fields["Display Text"].Value,
                                    Value = attrId,
                                    Selected = val.Attributes.Count == -1 ? false : val.Attributes.Contains(attrId)
                                });
                                val.Attributes.Add(attrId);
                            }
                        }

                        filterModel.Attributes.Add(set);
                    }
                }
            }

            //get property types from the sitecore
            Item propTypes = context.GetItem(Constants.Items.Filters.PropertyTypeGroup);

            if (!string.IsNullOrEmpty(propTypes.Fields["Title"].Value))
            {
                filterModel.PropertyTypes.DisplayName = propTypes.Fields["Title"].Value;
                foreach (Item propType in propTypes.GetChildren())
                {
                    if (!string.IsNullOrEmpty(propType.Fields["Filter Id"].Value) && !string.IsNullOrEmpty(propType.Fields["Display Text"].Value))
                    {
                        int attrId = int.Parse(propType.Fields["Filter Id"].Value);

                        filterModel.PropertyTypes.Options.Add(new TextValueWithType()
                        {
                            Text = propType.Fields["Display Text"].Value,
                            Value = attrId,
                            Selected = val.PropertyTypes.Count == -1 ? false : val.PropertyTypes.Contains(attrId)
                        });
                    }
                }
            }

            return filterModel;
        }

        private FilterValues ValidateFilter(FilterValues val)
        {
            if (val == null)
            {
                val = new FilterValues();
            }

            if (val.Attributes == null)
            {
                val.Attributes = new List<int>();
            }

            if (val.PropertyTypes == null)
            {
                val.PropertyTypes = new List<int>();
            }

            //val.Bathrooms = val.Bathrooms ?? -1;
            val.PriceMax = val.PriceMax > 0 ? val.PriceMax : -1;
            val.PriceMin = val.PriceMin > 0 ? val.PriceMin : -1;

            val.Adults = val.Adults > 0 ? val.Adults : 1;
            val.Children = val.Children > 0 ? val.Children : 0;
            val.RoomType = val.RoomType;

            val.ImagePath = val.ImagePath ?? SettingsManager.PropertyImages.ImagePath;
            val.DefaultImage = val.DefaultImage ?? SettingsManager.PropertyImages.DefaultImage;

            return val;
        }
    }
}