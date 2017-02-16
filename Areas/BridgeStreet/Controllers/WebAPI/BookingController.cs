using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Http;
using BridgeStreet.Data.Services;
using BridgeStreet.Data.Services.AvailabilitySearch;
using BridgeStreet.Data.Services.Models;
using BridgeStreet.Website.Areas.BridgeStreet.Models.BookingFlow;
using BridgeStreet.Website.Extensions;
using BridgeStreet.Website.Infrastructure.Constants;
using BridgeStreet.Website.Infrastructure.Diagnostics;
using BridgeStreet.Website.Infrastructure.Settings;
using BridgeStreet.Website.Service;
using BridgeStreet.Website.Service.Implementations;
using BridgeStreet.Website.Service.Interfaces;
using BridgeStreet.Website.Service.Models;
using Sitecore.Globalization;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers.WebAPI
{
    public class BookingController : ApiController
    {
        protected readonly BookingFlowDataService BookingService;
        protected readonly PropertyDataService PropertyService;
        protected readonly IAscentRequestService AscentService;
        protected readonly AvailabilitySearchService AvailabilitySearchService;
        protected readonly SiteService SiteService;
        protected readonly PropertySearchDataService PropertySerachDataService;

        public BookingController(SiteService siteService)
        {
            this.BookingService = new BookingFlowDataService();
            this.PropertyService = new PropertyDataService();
            this.AscentService = new AscentRequestService();
            this.AvailabilitySearchService = new AvailabilitySearchService();
            this.SiteService = siteService;
            this.PropertySerachDataService = new PropertySearchDataService();
        }

        [HttpGet]
        [ActionName("Index")]
        public BookingConfirmation Get(string sessionId)
        {
            AscentServiceGatedResponse resp;
            try
            {
                resp = this.GetAscentGatedResponse(sessionId);
                if (resp == null)
                    throw new SystemException("Null response from Ascent");
            }
            catch (Exception ex)
            {
                Log.Custom.Error(ex.Message, ex);
                return new BookingConfirmation();
            }

            BookingRealtimeModel book = this.BookingService.UpdateRealtimeBookingWithGatedResponse(
                sessionId,
                resp.GateId,
                resp.CardName,
                resp.CardType,
                resp.Last4,
                resp.ExpYear,
                resp.ExpMonth,
                resp.AvsReply,
                resp.AvsReply);

            if (book == null)
            {
                return new BookingConfirmation();
            }

            var property = this.PropertyService.GetPropertyById(book.PropertyId.Value);
            if (property == null)
            {
                return new BookingConfirmation();
            }

            var bookingConfirmation = new BookingConfirmation();
            bookingConfirmation.BookingSuccessful = (string.IsNullOrEmpty(resp.GateId) || resp.GateId.Equals("0") || string.IsNullOrEmpty(resp.Last4)) ? false : true;
            bookingConfirmation.ReservationNumber = book.ReservationNumber;
            bookingConfirmation.TripInfo.Name = property.PropertyName;
            bookingConfirmation.TripInfo.PropertyId = property.PropertyId;
            bookingConfirmation.TripInfo.Address1 = property.PropertyAddress1;
            bookingConfirmation.TripInfo.Address2 = property.PropertyAddress2;
            bookingConfirmation.TripInfo.City = property.PropertyCity;
            bookingConfirmation.TripInfo.StateCounty = property.PropertyStateCode;
            bookingConfirmation.TripInfo.Country = property.PropertyCountryCode;
            bookingConfirmation.TripInfo.TotalAccomodation = book.TotalAccomodation;
            bookingConfirmation.TripInfo.Fees = book.Fees;
            bookingConfirmation.TripInfo.Tax = book.Taxes;
            bookingConfirmation.TripInfo.TotalDue = book.TotalDue;
            bookingConfirmation.TripInfo.CheckIn = DeterminecheckInOutTime(book.FromDate.Value.ToString("yyyy-MM-dd"), property.PropertyArriveTime);
            bookingConfirmation.TripInfo.CheckOut = DeterminecheckInOutTime(book.ToDate.Value.ToString("yyyy-MM-dd"), property.PropertyDepartTime);
            bookingConfirmation.TripDates =
                string.Format(@"<ul><li><b>{0}</b> Confirmation Email</li><li><b>{1}</b> Key Pick Up Information</li></ul>", book.FromDate.Value, book.ToDate.Value);    // ToDo: get trip dates
            bookingConfirmation.Message = "Success";
            bookingConfirmation.AvsReply = resp.AvsReply;
            bookingConfirmation.Last4 = resp.Last4;
            bookingConfirmation.TripInfo.ImageUrl = this.PropertySerachDataService.GetCardImage(SettingsManager.PropertyImages.ImagePath, SettingsManager.PropertyImages.DefaultImage, property.PropertyId);
            string currencySymbol;
            CurrencyConverter.TryGetCurrencySymbol(property.PropertyCurrencyCode, out currencySymbol);
            bookingConfirmation.TripInfo.CurrencySign = currencySymbol;
            bookingConfirmation.TripInfo.CurrencyCode = property.PropertyCurrencyCode;
            return bookingConfirmation;
        }

        // PUT: api/BookingPage
        // Return Booking Information for "Your Trip" module
        [HttpPut]
        [ActionName("Index")]
        public BookingTripInfo Put([FromBody]BookingModel value)
        {
            var propertyId = value.PropertyId.GetIntSafe();
            if (propertyId == 0)
            {
                return null;
            }

            var property = this.PropertyService.GetPropertyById(propertyId);
            if (property == null)
            {
                return null;
            }

            List<AvailabilitySearchResult> result = this.RunAvailabilityCheck(value);
            if (result == null || result.Count <= 0)
            {
                return null;
            }

            var avail = result.First();
            
            var bookingInfo = new BookingTripInfo()
            {
                Name = property.PropertyName,
                Address1 = property.PropertyAddress1,
                City = property.PropertyCity,
                StateCounty = property.PropertyStateCode,
                Country = property.PropertyCountryCode,
                ZipPostal = property.PropertyPostalCode,
                CheckIn = DeterminecheckInOutTime(value.FromDate, property.PropertyArriveTime),
                CheckOut = DeterminecheckInOutTime(value.ToDate, property.PropertyDepartTime),
                PricePerNight = avail.Rate,
                TotalAccomodation = avail.SubTotal,
                Subtotal = avail.SubTotal,
                Tax = avail.Tax,
                Fees = avail.Fees,
                TotalDue = avail.Total,
                ImageUrl = this.PropertySerachDataService.GetCardImage(SettingsManager.PropertyImages.ImagePath, SettingsManager.PropertyImages.DefaultImage, property.PropertyId)
            };

            if (!string.IsNullOrWhiteSpace(value.PromoCode))
            {
                bookingInfo.PromoCodeMessage = avail.PromoCodeMessage;
            }

            string currencySymbol;
            CurrencyConverter.TryGetCurrencySymbol(property.PropertyCurrencyCode, out currencySymbol);
            bookingInfo.CurrencySign = currencySymbol;
            bookingInfo.LengthOfStay = (bookingInfo.CheckOut.Date - bookingInfo.CheckIn.Date).Days;
            return bookingInfo;
        }

        // POST: api/BookingPage/5
        [HttpPost]
        [ActionName("Index")]
        public BookingConfirmation Post([FromBody] BookingModel model)
        {            
            if (model.IsRequest)
            {
                return this.ProcessBookingRequest(model);
            }

            // Re-validate availability
            if (!this.ConfirmAvailability(model))
            {
                var confirmation = this.ProcessBookingRequest(model);
                confirmation.PaymentProcessorUrl = this.SiteService.GetSettings().RequestBookingPageLink.Url + "?ReservationToken=" + confirmation.ReservationToken;
                return confirmation;
            }

            try
            {
                var dataModel = this.GetBookingRealtimeDataModel(model);
                var resp = this.GetAscentResponse();

                if (resp == null)
                    throw new Exception("Null response from Ascent");

                if (string.IsNullOrEmpty(resp.SessionId))
                    throw new Exception("Empty Session ID returned from Ascent");

                dataModel.SessionId = resp.SessionId;
                dataModel.DateCreated = DateTime.Now;

                dataModel = this.BookingService.InsertRealtimeBooking(dataModel);
                
                // Execute Booking_GetTripDates and return data back
                return new BookingConfirmation()
                {
                    ReservationNumber = dataModel.ReservationNumber,
                    Message = string.Empty,
                    PaymentProcessorUrl = resp.Url
                };
            }
            catch (Exception ex)
            {
                Log.Custom.Error(ex.Message);
                Log.Custom.Error(ex.StackTrace);
                return new BookingConfirmation()
                {
                    Message = Translate.Text(Constants.TranslationKeys.BookingErrorMessage)
                };
            }
        }

        private static DateTime DeterminecheckInOutTime(string date, string time)
        {
            string timeFormat = @"\d\d?\:\d\d";
            Regex r = new Regex(timeFormat);
            Match m = r.Match(time);
            if (m.Success)
            {
                return DateTime.Parse(date + " " + time);
            }
            else
            {
                return date.GetDateTimeSafe();
            }
        }

        private List<AvailabilitySearchResult> RunAvailabilityCheck(BookingModel value)
        {
            var searchCriteria = new AvailabilitySearchCriteria(
                value.PropertyId.GetIntSafe(),
                value.FromDate.GetDateTimeSafe(),
                value.ToDate.GetDateTimeSafe(),
                value.PromoCode,
                value.RoomType.GetIntSafe());
            int roomType = value.RoomType.GetIntSafe();

            var result = this.AvailabilitySearchService.AvailabilitySearch(searchCriteria).Where(x => x.RoomType == roomType);
            return result.ToList();
        }

        private bool ConfirmAvailability(BookingModel model)
        {
            var roomType = model.RoomType.GetIntSafe();
            var results = this.RunAvailabilityCheck(model).Where(m => m.RoomType == roomType).ToList();
            if (results == null || results.Count <= 0)
            {
                return false;
            }

            var result = results.First();
            return result.IsRealTimeBookable && result.IsRoomAvailable && result.SubTotal > 0;
        }

        private AscentServiceResponse GetAscentResponse()
        {
            var request = this.CreateAscentServiceRequest();
            return this.AscentService.Send(request);
        }

        private AscentServiceGatedResponse GetAscentGatedResponse(string sessionId)
        {
            var request = this.CreateAscentServiceRequest();
            request.SessionId = sessionId;

            return this.AscentService.GetGatedResponse(request);
        }

        private AscentServiceRequest CreateAscentServiceRequest()
        {
            var request = new AscentServiceRequest()
            {
                ClientId = SettingsManager.Ascent.ClientId,
                SiteId = SettingsManager.Ascent.SiteId,
                PriceId = SettingsManager.Ascent.PriceId,
                Password = SettingsManager.Ascent.Password,
                FormName = SettingsManager.Ascent.FormName
            };
            return request;
        }

        private BookingConfirmation ProcessBookingRequest(BookingModel model)
        {
            BookingRequestModel dataModel = this.GetBookingRequestDataModel(model);
            dataModel.DateCreated = DateTime.Now;
            dataModel.ReservationToken = Guid.NewGuid();
            try
            {
                dataModel = this.BookingService.InsertBookingRequest(dataModel);
            }
            catch (Exception ex)
            {
                Log.Custom.Error(ex.Message);
                Log.Custom.Error(ex.StackTrace);
                return new BookingConfirmation()
                {
                    Message = Translate.Text(Constants.TranslationKeys.BookingErrorMessage)
                };
            }

            return new BookingConfirmation()
            {
                Message = string.Empty,
                ReservationNumber = dataModel.ReservationNumber,
                ReservationToken = dataModel.ReservationToken
            };
        }

        private BookingRealtimeModel GetBookingRealtimeDataModel(BookingModel model)
        {
            var data = new BookingRealtimeModel()
            {
                Title = model.Title,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Address1 = model.Address1,
                Address2 = model.Address2,
                City = model.City,
                StateCounty = model.StateCounty,
                ZipPost = model.ZipPost,
                Country = model.Country,
                MobileNumber = model.MobileNumber,
                EmailAddress = model.EmailAddress,
                ContactMethod = model.ContactMethod,
                CompanyName = model.CompanyName,
                CompanyWebsite = model.CompanyWebsite,
                HowDidYouHearAboutUs = model.HowDidYouHearAboutUs,
                BillingAddress1 = model.BillingAddress1,
                BillingAddress2 = model.BillingAddress2,
                BillingCity = model.BillingCity,
                BillingStateCounty = model.BillingStateCounty,
                BillingZipPost = model.BillingZipPost,
                BillingCountry = model.BillingCountry,
                PurposeOfTrip = model.PurposeOfTrip,
                EmailBillingCopyTo = model.EmailBillingCopyTo,
                PropertyId = model.PropertyId.GetIntSafe(),
                Comments = model.Comments,
                FromDate = model.FromDate.GetDateTimeSafe(),
                ToDate = model.ToDate.GetDateTimeSafe(),
                RoomType = model.RoomType,
                NumberOfAdults = model.NumberOfAdults.GetIntSafe(),
                NumberOfChildren = model.NumberOfChildren.GetIntSafe(),
                NumberOfPets = model.NumberOfPets.GetIntSafe(),
                PromoCode = model.PromoCode,
                PricePerNight = model.Rate.Rate,
                TotalAccomodation = model.Rate.SubTotal,
                Taxes = model.Rate.Tax,
                TotalDue = model.Rate.Total
            };

            return data;
        }

        private BookingRequestModel GetBookingRequestDataModel(BookingModel model)
        {
            var data = new BookingRequestModel()
            {
                Title = model.Title,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Address1 = model.Address1,
                Address2 = model.Address2,
                City = model.City,
                StateCounty = model.StateCounty,
                ZipPost = model.ZipPost,
                Country = model.Country,
                MobileNumber = model.MobileNumber,
                EmailAddress = model.EmailAddress,
                ContactMethod = model.ContactMethod,
                CompanyName = model.CompanyName,
                CompanyWebsite = model.CompanyWebsite,
                HowDidYouHearAboutUs = model.HowDidYouHearAboutUs,
                BillingAddress1 = model.BillingAddress1,
                BillingAddress2 = model.BillingAddress2,
                BillingCity = model.BillingCity,
                BillingStateCounty = model.BillingStateCounty,
                BillingZipPost = model.BillingZipPost,
                BillingCountry = model.BillingCountry,
                PurposeOfTrip = model.PurposeOfTrip,
                EmailBillingCopyTo = model.EmailBillingCopyTo,
                PropertyId = model.PropertyId.GetIntSafe(),
                Comments = model.Comments,
                FromDate = model.FromDate.GetDateTimeSafe(),
                ToDate = model.ToDate.GetDateTimeSafe(),
                RoomType = model.RoomType,
                NumberOfAdults = model.NumberOfAdults.GetIntSafe(),
                NumberOfChildren = model.NumberOfChildren.GetIntSafe(),
                NumberOfPets = model.NumberOfPets.GetIntSafe(),
                PromoCode = model.PromoCode
            };

            return data;
        }
    }
}
