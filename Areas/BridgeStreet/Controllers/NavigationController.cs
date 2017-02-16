using System;
using System.Linq;
using System.Web.Mvc;
using BridgeStreet.Website.Areas.BridgeStreet.Models.Navigation;
using BridgeStreet.Website.Areas.BridgeStreet.Models.SocialSharing;
using BridgeStreet.Website.Service;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class NavigationController : BridgeStreetController
    {
        private readonly SiteService _siteService;
        private readonly CookiePolicyService _cookiePolicyService;

        public NavigationController(SiteService siteService, CookiePolicyService cookiePolicyService)
        {
            if (siteService == null)
            {
                throw new ArgumentNullException("siteService");
            }

            if (cookiePolicyService == null)
            {
                throw new ArgumentNullException("cookiePolicyService");
            }

            this._siteService = siteService;
            this._cookiePolicyService = cookiePolicyService;
        }

        public ActionResult SlideOutMenu()
        {
            var siteConfiguration = this._siteService.GetSettings();
            var model = new HeaderViewModel(siteConfiguration, siteConfiguration)
            {
                //HasCookiePolicyAcknowledgement = this._cookiePolicyService.HasCookie()
            };

            return this.View(model);
        }

        public ActionResult HeaderAlt()
        {
            var siteConfiguration = this._siteService.GetSettings();
            var model = new HeaderViewModel(siteConfiguration, siteConfiguration)
            {
                //HasCookiePolicyAcknowledgement = this._cookiePolicyService.HasCookie()
            };

            return this.View(model);
        }

        public ActionResult Header()
        {
            var siteConfiguration = this._siteService.GetSettings();
            var model = new HeaderViewModel(siteConfiguration, siteConfiguration)
            {
                //HasCookiePolicyAcknowledgement = this._cookiePolicyService.HasCookie()
            };

            return this.View(model);
        }

        public ActionResult SetCookiePolicy()
        {
            this._cookiePolicyService.SetCookie(System.Web.HttpContext.Current.Response);
            return this.Json(new { Result = true }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SocialSharePanel()
        {
            var siteConfiguration = this._siteService.GetSettings();

            var model = siteConfiguration.SocialConnectedPanel;

            return this.View(model);
        }

        public ActionResult BrandsList()
        {
            var siteConfiguration = this._siteService.GetSettings();
            var model = siteConfiguration.BrandsList;
            return this.View(model);
        }

        public ActionResult Footer()
        {
            var siteConfiguration = this._siteService.GetSettings();
            var model = new FooterViewModel(siteConfiguration);
            return this.View(model);
        }
    }
}