using System;
using System.Web.Http;
using BridgeStreet.Website.Areas.BridgeStreet.Models.ContactUs;
using BridgeStreet.Website.Infrastructure.Constants;
using BridgeStreet.Website.Service;
using BridgeStreet.Website.Service.Implementations;
using BridgeStreet.Website.Service.Interfaces;
using BridgeStreet.Website.Service.Models;
using Glass.Mapper;
using Sitecore.Data;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers.WebAPI
{
    public class ContactUsController : GlobalWebApiController
    {
        private const string RecaptchaUrl = Constants.Urls.ReCaptchaServiceUrl;
        private readonly IContactUsNotificationService _notificationService;
        private readonly INotificationService<ContactFormSubmission> _notificationServiceDb;
        private readonly INotificationService<ContactFormSubmission> _notificationServiceCrm;

        public ContactUsController(
            IContactUsNotificationService notification,
            SiteService siteService) : base(siteService)
        {
            this._notificationService = notification;
            this._notificationServiceDb = new ContactUsNotficationServiceViaDatabase();
            this._notificationServiceCrm = new ContactUsNotificationServiceViaCrm();
        }

        [HttpPost]
        [ActionName("Index")]
        public string Post([FromBody]ContactModel contactInfo)
        {
            if (!this.VerifyRecaptcha(contactInfo.RecaptchaResponse))
            {
                return "Bad Recaptcha response";
            }

            try
            {
                var submission = new ContactFormSubmission
                {
                    FirstName = contactInfo.FirstName,
                    LastName = contactInfo.LastName,
                    Email = contactInfo.EmailAddress,
                    MobileNumber = contactInfo.MobileNumber,
                    Company = contactInfo.Company,
                    Location = contactInfo.Location,
                    FeedbackType = contactInfo.FeedbackType,
                    ContactMethod = contactInfo.ContactMethod,
                    Subject = contactInfo.Subject,
                    Body = contactInfo.Comments,
                    FormType = contactInfo.FormType
                };

                var contactForm = Sitecore.Context.Database.GetItem(new ID(new Guid(submission.FormType)));
                if (contactForm != null)
                {
                    submission.Recipients = contactForm.Fields["Recipient List"].Value;
                }

                this._notificationService.Send(submission);
                this._notificationServiceDb.HandleNotification(submission);
                /////this._notificationServiceCrm.HandleNotification(submission);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return "Success";
        }

        private bool VerifyRecaptcha(string captchaResponse)
        {
            IHttpRequestService http = new HttpRequestService();
            captchaResponse = string.Format("secret={0}&response={1}", this.SiteService.GetSettings().SecretKey, captchaResponse);
            var response = http.Post(RecaptchaUrl, captchaResponse);

            if (!response.IsNullOrEmpty() && response.Contains("\"success\": true"))
            {
                return true;
            }

            return false;
        }
    }
}
