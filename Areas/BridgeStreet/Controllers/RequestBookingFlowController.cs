using System;
using System.Collections.Specialized;
using System.Linq;
using System.Web.Mvc;
using BridgeStreet.Website.Areas.BridgeStreet.Models.BookingFlow;
using BridgeStreet.Website.Areas.BridgeStreet.Models.Global;
using BridgeStreet.Website.Domain.Models.Lists.LocationList;
using BridgeStreet.Website.Domain.Models.Pages.BookingFlow;
using BridgeStreet.Website.Infrastructure.Attributes;
using Glass.Mapper;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class RequestBookingFlowController : BridgeStreetController
    {
        public ActionResult GetRequestBookingView()
        {
            var requestBookingPage = new RequestBookingModel()
            {
                RequestBookingPage = this.SitecoreContext.GetCurrentItem<RequestBookingPage>()
            };

            this.GetQueryStringParameters(requestBookingPage, HttpContext.Request.QueryString);

            foreach (var item in requestBookingPage.RequestBookingPage.Titles)
            {
                requestBookingPage.RequestBookingPage.TitleOptions.Add(this.SitecoreContext.GetItem<ValueDropDownOption>(item));
            }

            foreach (var item in requestBookingPage.RequestBookingPage.ContactSource)
            {
                requestBookingPage.RequestBookingPage.ContactSourceOptions.Add(this.SitecoreContext.GetItem<ValueDropDownOption>(item));
            }

            foreach (var item in requestBookingPage.RequestBookingPage.CountryList)
            {
                requestBookingPage.RequestBookingPage.CountryOptions.Add(this.SitecoreContext.GetItem<Country>(item));
            }

            if (requestBookingPage.RequestBookingPage.TermsAndConditions != Guid.Empty)
            {
                var terms = this.SitecoreContext.GetItem<TermsAndConditions>(requestBookingPage.RequestBookingPage.TermsAndConditions);
                requestBookingPage.RequestBookingPage.TermsAndConditionsText = terms.Text;
            }

            return this.View("~/Areas/Bridgestreet/Views/Renderings/BookingFlow/RequestFlow.cshtml", requestBookingPage);
        }

        private void GetQueryStringParameters(BaseBookingModel bookingModel, NameValueCollection requestQueryString)
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