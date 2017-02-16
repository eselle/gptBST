using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BridgeStreet.Website.Areas.BridgeStreet.Models.ContactUs;
using BridgeStreet.Website.Domain.Models.Pages.ContactUs;
using BridgeStreet.Website.Service;
using BridgeStreet.Website.Service.Models;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class ContactUsController : BridgeStreetController
    {
        public ContactUsController(SiteService siteService) : base(siteService)
        {
        }

        // GET: BridgeStreet/ContactUs
        public ActionResult ContactUsForm()
        {
            ContactUsPage page = this.SitecoreContext.GetCurrentItem<ContactUsPage>();
            page.SiteKey = this.SiteService.GetSettings().SiteKey;
            return this.View("~/Areas/Bridgestreet/Views/Renderings/ContactUs/ContactUsForm.cshtml", page);
        }
    }
}