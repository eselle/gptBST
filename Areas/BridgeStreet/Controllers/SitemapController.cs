using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BridgeStreet.Website.Service;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class SitemapController : BridgeStreetController
    {
        private readonly SiteService _siteService;

        public SitemapController(SiteService siteService)
        {
            if (siteService == null) throw new ArgumentNullException("siteService");
            this._siteService = siteService;
        }

        public ActionResult Sitemap()
        {
            this.Response.ContentType = "text/xml";
            this.Response.ContentEncoding = System.Text.Encoding.UTF8;

            var sitemap = this._siteService.GetSitemap(Sitecore.Context.Site.ContentStartPath);
            return this.View(sitemap);
        }
    }
}