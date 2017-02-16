using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BridgeStreet.Data.Services.Models.SearchResults;
using BridgeStreet.Website.Areas.BridgeStreet.Models.PropertyDetails;
using BridgeStreet.Website.Domain.DomainModels;
using BridgeStreet.Website.Domain.Models.Content.Properties;
using BridgeStreet.Website.Domain.Models.Pages.PropertyDetailPage.CuratedImagesList;
using BridgeStreet.Website.Infrastructure.Diagnostics;
using BridgeStreet.Website.Infrastructure.Settings;
using BridgeStreet.Website.Service;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class PropertyDetailController : BridgeStreetController
    {
        private readonly PropertySearchService _propertySearchService;

        public PropertyDetailController(PropertySearchService propertySearchService)
        {
            if (propertySearchService == null)
            {
                throw new ArgumentNullException("propertySearchService");
            }

            this._propertySearchService = propertySearchService;
        }
        
        public ActionResult PropertyImagesCurated()
        {
            var imageList = this.GetDataSourceItem<CuratedImagesList>();
            IEnumerable<string> images = new List<string>();
            if (imageList != null && imageList.Images != null && imageList.Images.Any())
            {
                images = imageList.Images.Select(i => i.Src).ToList();
            }

            var name = this.GetContextItem<Property>().Name;

            var model = new PropertyImageViewModel()
            {
                Images = images,
                PropertyName = name
            };

            return this.View("PropertyImages", model);
        }

        public ActionResult PropertyImagesSnap()
        {
            var currentProp = this.GetContextItem<Property>();
            List<string> imagePaths = new List<string>();
            if (!string.IsNullOrEmpty(currentProp.ImageSource))
            {
                string[] imageNames = new string[] { };

                if (SettingsManager.PropertyImages.TestMode.ToLower() == "true")
                {
                    imageNames = new string[] { "a.jpg", "b.jpg", "c.jpg", "d.jpg", "e.jpg", "f.jpg", "g.jpg", "h.jpg" };
                }
                else
                {
                    imageNames = currentProp.ImageSource.Split('|');
                }

                foreach (var imageName in imageNames)
                {
                    imagePaths.Add(SettingsManager.PropertyImages.ImagePath + imageName);
                }
            }

            var model = new PropertyImageViewModel
            {
                Images = imagePaths,
                PropertyName = currentProp.PropertyName
            };

            return this.View("PropertyImages", model);
        }

        #region header action - written in case we need to get available room types from the stored procedure. this is not desirable b/c it'll slow down page load. 
        //public ActionResult Header()
        //{
        //    var currentProp = this.GetContextItem<Property>();
        //    int id;
        //    int.TryParse(currentProp.PropertyId, out id);
        //    Property model = this.GetContextItem<Property>();

        //    PropertyDetail property = this._propertySearchService.GetPropertyById(id);
        //    PropertyDetailQuery query = this.ParseQueryString(property);

        //    var unitTypes = this._propertySearchService.GetRoomBookingOptions(query.PropertyId, query.ArrivalDate, query.DepartureDate, query.Nights);
        //    var minRoom = unitTypes.Select(x => x.Value).Min();
        //    var maxRoom = unitTypes.Select(x => x.Value).Max();

        //    string roomHTML;
        //    if (minRoom == maxRoom)
        //    {
        //        roomHTML = unitTypes.Select(x => x.Name).Min();
        //    }
        //    else
        //    {
        //        var minName = unitTypes.Where(x => x.Value == minRoom).Select(x => x.Name); 
        //        var maxName = unitTypes.Where(x => x.Value == maxRoom).Select(x => x.Name);
        //        roomHTML = string.Format("{0}-<br/>{1}", minName, maxName);
        //    }

        //    model.RoomTypeHTML = roomHTML;

        //    return this.View("~/Areas/Bridgestreet/Views/Renderings/PropertyDetail/PropertyHeader.cshtml", model);
        //}
        #endregion

        public ActionResult Amenities()
        {
            var currentProp = this.GetContextItem<Property>();
            int id;
            int.TryParse(currentProp.PropertyId, out id);
            var amenities = this._propertySearchService.GetPropertyAmenities(id);
            return this.View("~/Areas/Bridgestreet/Views/Renderings/PropertyDetail/Amenities.cshtml", amenities);
        }

        public ActionResult RelatedProperties()
        {
            var currentProp = this.GetContextItem<Property>();
            int id;
            int.TryParse(currentProp.PropertyId, out id);
            PropertyIdModel model = new PropertyIdModel() { PropertyId = id };

            return this.View("~/Areas/Bridgestreet/Views/Renderings/PropertyDetail/RelatedProperties.cshtml", model);
        }

        [HttpGet]
        public ActionResult RelatedPropertiesJSON(PropertyIdModel model)
        {
            PropertyDetail property = this._propertySearchService.GetPropertyById(model.PropertyId);
            PropertyDetailQuery query = this.ParseQueryString(property);

            IEnumerable<PropertyCard> relatedProperties = this._propertySearchService.GetRelatedProperties(query.PropertyId, property.Latitude, property.Longitude, query.ArrivalDate, query.DepartureDate, query.RoomType);

            return this.Json(relatedProperties, JsonRequestBehavior.AllowGet);
        }

        public ActionResult YourTrip()
        {
            var currentProp = this.GetContextItem<Property>();
            int id;
            int.TryParse(currentProp.PropertyId, out id);
            PropertyIdModel model = new PropertyIdModel() { PropertyId = id };

            return this.View("~/Areas/Bridgestreet/Views/Renderings/PropertyDetail/YourTrip.cshtml", model);
        }

        [HttpGet]
        public ActionResult YourTripJSON(PropertyIdModel propId)
        {
            try
            {
            PropertyDetail property = this._propertySearchService.GetPropertyById(propId.PropertyId);
            PropertyDetailQuery query = this.ParseQueryString(property);

            query.Nights = Convert.ToInt32(query.DepartureDate.Subtract(query.ArrivalDate).TotalDays);

            YourTripModel model = this.PopulateYourTripModel(query, property, propId.UrlBase);

            string cleanQueryString = this.GenerateQueryString(query);
         
                model.BookItNowUrl.Url += cleanQueryString;
                model.RequestBookUrl.Url += cleanQueryString;
                return this.Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception err)
            {
                Log.Custom.Error("Property Detail Your Trip failed. " + err.Message);
                PropertyIdModel model = new PropertyIdModel();
                return this.Json(model, JsonRequestBehavior.AllowGet);
            }            
        }

        private PropertyDetailQuery ParseQueryString(PropertyDetail property)
        {
            DateTime today = DateTime.Today;
            int minLead = property.MinLead > 0 ? property.MinLead : 30;
            int minLOS = property.MinLOS > 0 ? property.MinLOS : 30;

            var query = new PropertyDetailQuery()
            {
                PropertyId = int.Parse(property.PropertyId),
                ArrivalDate = today.AddDays(minLead),
                DepartureDate = today.AddDays(minLead + minLOS),
                Adults = 1,
                Children = 0,
                Pets = 0
            };

            var queryString = HttpContext.Request.Url.Query.Replace("?", string.Empty);
            var queryStringParams = queryString.Split('&');

            foreach (string param in queryStringParams)
            {
                var kvp = param.Split('=');
                switch (kvp[0].ToLower())
                {
                    case "arrivaldate":
                        DateTime arrDate = new DateTime();
                        DateTime.TryParse(kvp[1], out arrDate);
                        query.ArrivalDate = arrDate >= today ? arrDate : query.ArrivalDate;
                        break;
                    case "departuredate":
                        DateTime depDate = new DateTime();
                        DateTime.TryParse(kvp[1], out depDate);
                        query.DepartureDate = depDate >= today ? depDate : query.DepartureDate;
                        break;
                    case "adults":
                        int adults;
                        int.TryParse(kvp[1], out adults);
                        query.Adults = adults > 0 ? adults : 1;
                        break;
                    case "children":
                        int children;
                        int.TryParse(kvp[1], out children);
                        query.Children = children >= 0 ? children : 0;
                        break;
                    case "pets":
                        int pets;
                        int.TryParse(kvp[1], out pets);
                        query.Pets = pets >= 0 ? pets : 0;
                        break;
                    case "roomtype":
                        int roomType;
                        int.TryParse(kvp[1], out roomType);
                        query.RoomType = roomType >= 0 ? roomType : -1;
                        break;
                    case "propertyid":
                        int propertyid;
                        int.TryParse(kvp[1], out propertyid);
                        query.PropertyId = propertyid >= 0 ? propertyid : query.PropertyId;
                        break;
                }
            }

            if (query.ArrivalDate > query.DepartureDate)
            {
                query.DepartureDate = query.ArrivalDate.AddDays(minLOS);
            }

            query.Nights = Convert.ToInt32(query.DepartureDate.Subtract(query.ArrivalDate).TotalDays);

            return query;
        }

        private string GenerateQueryString(PropertyDetailQuery query)
        {
            int nights = Convert.ToInt32(query.DepartureDate.Subtract(query.ArrivalDate).TotalDays);

            string cleanQueryString = string.Format(
                "?ArrivalDate={0}&DepartureDate={1}&Adults={2}&Children={3}&Pets={4}&RoomType={5}&Nights={6}&PropertyId={7}",
                query.ArrivalDate.ToString("yyyy-MM-dd"),
                query.DepartureDate.ToString("yyyy-MM-dd"),
                query.Adults,
                query.Children,
                query.Pets,
                query.RoomType,
                nights,
                query.PropertyId);

            return cleanQueryString;
        }

        private YourTripModel PopulateYourTripModel(PropertyDetailQuery query, PropertyDetail property, string requestUrl)
        {
            var cleanQueryString = this.GenerateQueryString(query);
            var fullUrl = requestUrl + cleanQueryString;

            YourTripModel model = new YourTripModel()
            {
                BookItNowUrl = this.SiteService.GetSettings().BookNowPageLink,
                RequestBookUrl = this.SiteService.GetSettings().RequestBookingPageLink,
                EncodedFullUrl = HttpUtility.UrlEncode(fullUrl),
                ArrivalDate = query.ArrivalDate,
                DepartureDate = query.DepartureDate,
                Adults = query.Adults,
                Children = query.Children,
                Pets = query.Pets,
                RoomType = query.RoomType,
                PropertyId = query.PropertyId,
                IsRealTimeBookable = property.IsRealTimeBookable,
                CurrencyCode = property.CurrencyCode,
                Nights = query.Nights
            };

            var bookingUrl = this.SiteService.GetSettings().BookNowPageLink;
            var requestBookUrl = this.SiteService.GetSettings().RequestBookingPageLink;
            int nights = Convert.ToInt32(query.DepartureDate.Subtract(query.ArrivalDate).TotalDays);

            model.RoomBookingOptions = this._propertySearchService.GetRoomBookingOptions(query.PropertyId, query.ArrivalDate, query.DepartureDate, query.Nights);
            foreach (var option in model.RoomBookingOptions)
            {
                var queryString = string.Format(
                    "?ArrivalDate={0}&DepartureDate={1}&RoomType={2}&Nights={3}&PropertyId={4}",
                     query.ArrivalDate.ToString("yyyy-MM-dd"),
                     query.DepartureDate.ToString("yyyy-MM-dd"),
                     option.Value,
                     nights,
                     query.PropertyId);

                if (bookingUrl != null)
                {
                    option.BookUrl = bookingUrl.Url + queryString;
                }

                if (requestBookUrl != null)
                {
                    option.RequestUrl = requestBookUrl.Url + queryString;
                }
            }

            ////START room types in property
            ////this should not even exist; it's a work-around for unit types being unknown for some properties
            var unitTypes = this._propertySearchService.GetRoomBookingOptions(query.PropertyId, query.ArrivalDate, query.DepartureDate, query.Nights);
            var minRoom = unitTypes.Select(x => x.Value).Min();
            var maxRoom = unitTypes.Select(x => x.Value).Max();

            string roomHTML;
            if (minRoom == maxRoom)
            {
                roomHTML = unitTypes.Select(x => x.Name).Min();
            }
            else
            {
                var minName = unitTypes.Where(x => x.Value == minRoom).Select(x => x.Name).First().ToString();
                var maxName = unitTypes.Where(x => x.Value == maxRoom).Select(x => x.Name).First().ToString();
                roomHTML = string.Format("{0} -<br/>{1}", minName, maxName);
            }

            model.RoomTypeHTML = roomHTML;
            ////END room types in property

            return model;
        }
    }
}
