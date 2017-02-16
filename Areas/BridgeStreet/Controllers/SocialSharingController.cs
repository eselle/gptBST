using System;
using System.Web.Mvc;
using BridgeStreet.Website.Areas.BridgeStreet.Models.SocialSharing;
using BridgeStreet.Website.Domain.Models.Base;
using BridgeStreet.Website.Domain.Models.Component;
using BridgeStreet.Website.Service;
using Glass.Mapper.Sc.Web.Mvc;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class SocialSharingController : GlassController
    {
        private readonly PageService _pageService;
        private readonly SiteService _siteService;

        public SocialSharingController(PageService pageService, SiteService siteService)
        {
            if (pageService == null) throw new ArgumentNullException("pageService");
            if (siteService == null) throw new ArgumentNullException("siteService");

            this._pageService = pageService;
            this._siteService = siteService;
        }

        public ActionResult SocialSharingLinks(PageBase page = null)
        {
            SocialSharingViewModel viewModel = this.GetViewModel(page);
            return this.View(viewModel);
        }

        private SocialSharingViewModel GetViewModel(PageBase page = null)
        {
            page = page ?? this._pageService.GetCurrentPage();
            var siteConfiguration = this._siteService.GetSettings();

            var model = new SocialSharingViewModel
            {
                SocialSharing = siteConfiguration.SocialSharingList,
                PageUrl = page.FullUrl
            };

            return model;
        }
    }
}