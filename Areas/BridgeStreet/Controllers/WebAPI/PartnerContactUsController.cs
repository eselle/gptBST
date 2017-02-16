using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BridgeStreet.Website.Areas.BridgeStreet.Models.PartnerPage;
using BridgeStreet.Website.Domain.Models.Pages.PartnerPage;
using BridgeStreet.Website.Infrastructure.Constants;
using BridgeStreet.Website.Infrastructure.Diagnostics;
using BridgeStreet.Website.Service;
using BridgeStreet.Website.Service.Implementations;
using BridgeStreet.Website.Service.Interfaces;
using BridgeStreet.Website.Service.Models;
using Glass.Mapper.Sc;
using Sitecore.Data;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers.WebAPI
{
    public class PartnerContactUsController : GlobalWebApiController
    {
        private const string RecaptchaUrl = Constants.Urls.ReCaptchaServiceUrl;
        private readonly INotificationService<PartnerContactFormSubmission> _notificationServiceDb;
        private readonly INotificationService<PartnerContactFormSubmission> _notificationServiceEmail;

        public PartnerContactUsController(
            INotificationService<Service.Models.NotificationType.Email> emailService,
            SiteService siteService) : base(siteService)
        {
            this._notificationServiceDb = new PartnerContactUsNotificationServiceDb();
            this._notificationServiceEmail = new PartnerContactUsNotificationServiceEmail(emailService);
        }
        
        [HttpPost]
        [ActionName("Index")]
        public string Post([FromBody] PartnerContactUsFormModel model)
        {
            if (!this.VerifyRecaptcha(model.RecaptchaResponse))
            {
                return "Bad Recaptcha response";
            }

            try
            {
                var submission = new PartnerContactFormSubmission
                {
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    Phone = model.Phone,
                    Email = model.Email,
                    Company = model.Company,
                    CompanyType = model.CompanyType,
                    AreasOfInterest = model.AreasOfInterest,
                    Region = model.Regions,
                    Comments = model.Comments,
                    ContactType = model.ContactMethod,
                    FormType = model.FormType
                };

                var partnerContactForm = Sitecore.Context.Database.GetItem(new ID(new Guid(submission.FormType)));
                if (partnerContactForm != null)
                {
                    submission.Recipients = partnerContactForm.Fields["Recipient List"].Value;
                    this._notificationServiceDb.HandleNotification(submission);
                    this._notificationServiceEmail.HandleNotification(submission);
                }
                else
                {
                    Log.Custom.Error("Partner Contact Form not located.  Attempting to find recipients for form id " + submission.FormType);
                }                
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

            if (!string.IsNullOrEmpty(response) && response.Contains("\"success\": true"))
            {
                return true;
            }

            return false;
        }
    }
}
