using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web.Mvc;
using BridgeStreet.Data.Services.AvailabilitySearch;
using BridgeStreet.Website.Areas.BridgeStreet.Models.BookingFlow;
using BridgeStreet.Website.Areas.BridgeStreet.Models.Global;
using BridgeStreet.Website.Areas.BridgeStreet.Models.PartnerPage;
using BridgeStreet.Website.Domain.DTOs;
using BridgeStreet.Website.Domain.Models.Content.Partners;
using BridgeStreet.Website.Domain.Models.Lists.LocationList;
using BridgeStreet.Website.Domain.Models.Pages.BookingFlow;
using BridgeStreet.Website.Infrastructure.Attributes;
using BridgeStreet.Website.Service;
using Glass.Mapper;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class BookingFlowController : BridgeStreetController
    {
        private readonly PropertySearchService _propertySearchService;
        private readonly AvailabilitySearchService _availabilitySearchService;

        public BookingFlowController(PropertySearchService propertySearchService)
        {
            this._propertySearchService = propertySearchService;
            this._availabilitySearchService = new AvailabilitySearchService();
        }

        public ActionResult GetBookingView()
        {
            var bookingPage = new BookingModel()
            {
                BookingPage = this.SitecoreContext.GetCurrentItem<BookingPage>()
            };

            this.GetQueryStringParameters(bookingPage, HttpContext.Request.QueryString);

            int propId;
            if (int.TryParse(bookingPage.PropertyId, out propId))
            {
                var property = this._propertySearchService.GetPropertyById(propId);
                int roomType;
                int.TryParse(bookingPage.RoomType, out roomType);
                DateTime toDate;
                DateTime fromDate;
                DateTime.TryParse(bookingPage.ToDate, out toDate);
                DateTime.TryParse(bookingPage.FromDate, out fromDate);

                var searchCriteria = new AvailabilitySearchCriteria(
                    propId,
                    fromDate,
                    toDate,
                    bookingPage.PromoCode,
                    roomType);
                var rate = this._availabilitySearchService.AvailabilitySearch(searchCriteria).Where(a => a.RoomType == roomType).ToList();
                bookingPage.Rate = rate.FirstOrDefault();
                bookingPage.Property = property;
            }
            
            foreach (var item in bookingPage.BookingPage.Titles)
            {
                bookingPage.BookingPage.TitleOptions.Add(this.SitecoreContext.GetItem<ValueDropDownOption>(item));
            }

            foreach (var item in bookingPage.BookingPage.ContactSource)
            {
                bookingPage.BookingPage.ContactSourceOptions.Add(this.SitecoreContext.GetItem<ValueDropDownOption>(item));
            }

            foreach (var item in bookingPage.BookingPage.CountryList)
            {
                bookingPage.BookingPage.CountryOptions.Add(this.SitecoreContext.GetItem<Country>(item));
            }

            if (bookingPage.BookingPage.TermsAndConditions != Guid.Empty)
            {
                var terms = this.SitecoreContext.GetItem<TermsAndConditions>(bookingPage.BookingPage.TermsAndConditions);
                bookingPage.BookingPage.TermsAndConditionsText = terms.Text;
            }

            return this.View("~/Areas/Bridgestreet/Views/Renderings/BookingFlow/BookingFlow.cshtml", bookingPage);
        }

        private void GetQueryStringParameters(BookingModel bookingModel, NameValueCollection requestQueryString)
        {
            foreach (var prop in bookingModel.GetType().GetProperties())
            {
                var map =
                    (QueryStringParameterMapping)
                    prop.GetCustomAttributes(typeof(QueryStringParameterMapping), false).FirstOrDefault();

                if (map == null || !requestQueryString[map.ParameterName].HasValue())
                {
                    continue;
                }

                bookingModel.GetType()
                        .GetProperty(prop.Name)
                        .SetValue(bookingModel, requestQueryString[map.ParameterName]);
            }
        }
    }
}