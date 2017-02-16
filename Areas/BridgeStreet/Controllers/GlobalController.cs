using System;
using System.Web.Mvc;
using BridgeStreet.Website.Areas.BridgeStreet.Models.Global;
using BridgeStreet.Website.Service;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class GlobalController : BridgeStreetController
    {
        private readonly PageService _pageService;

        public GlobalController(PageService pageService, SiteService siteService)
        {
            if (pageService == null)
            {
                throw new ArgumentNullException("pageService");
            }

            if (siteService == null)
            {
                throw new ArgumentNullException("siteService");
            }
            
            this._pageService = pageService;
            this.SiteService = siteService;
        }

        public ActionResult HtmlHead()
        {
            var page = this._pageService.GetCurrentPage();
            var siteConfiguration = this.SiteService.GetSettings();
            var model = new HtmlHeadViewModel(page, siteConfiguration);
            return this.View(model);
        }

        public ActionResult CssBundles()
        {
            return this.View();
        }

        public ActionResult ScriptVendorBundles()
        {
            return this.View();
        }

        public ActionResult ScriptVendorBundles2()
        {
            return this.View();
        }

        public ActionResult ScriptsTop()
        {
            var page = this._pageService.GetCurrentPage();
            return this.View(page);
        }

        public ActionResult ScriptLocalBundles()
        {
            return this.View();
        }

        public ActionResult ScriptsBottom()
        {
            var page = this._pageService.GetCurrentPage();
            return this.View(page);
        }

        public string Language()
        {
            return global::Sitecore.Context.Language.Name;
        }
    }
}