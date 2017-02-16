using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BridgeStreet.Website.Areas.BridgeStreet.Models.PartnerPage;
using BridgeStreet.Website.Domain.Models.Base;
using BridgeStreet.Website.Domain.Models.Content.Partners;
using BridgeStreet.Website.Domain.Models.Pages.PartnerPage;
using BridgeStreet.Website.Infrastructure.Diagnostics;
using Sitecore.Data.Items;
using Sitecore.Mvc.Presentation;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class PartnerPageController : BridgeStreetController
    {
        // GET: BridgeStreet/PartnerPage
        public ActionResult PartnerContactUsForm()
        {
            var page = this.SitecoreContext.GetCurrentItem<Item>();
            string datasourceId = RenderingContext.Current.Rendering.DataSource;
            PartnerContactForm form = new PartnerContactForm();
            if (Sitecore.Data.ID.IsID(datasourceId))
            {
                form = SitecoreContext.GetItem<PartnerContactForm>(new Guid(datasourceId));
                form.RecaptchaKey = this.SiteService.GetSettings().SiteKey;
            }

            return this.View("~/Areas/Bridgestreet/Views/Renderings/PartnerPage/PartnerContactUs.cshtml", form);
        }

        // GET: BridgeStreet/PartnerTiles
        public ActionResult PartnerTiles()
        {
            var model = new PartnerTileListModel();

            model.RenderingParameters = this.GetRenderingParameters<PartnerTilesParams>();

            string datasourceId = RenderingContext.Current.Rendering.DataSource;

            if (Sitecore.Data.ID.IsID(datasourceId))
            {
                try
                {
                    var friends = this.SitecoreContext.GetItem<FriendsList>(new Guid(datasourceId));

                    ////string root = @"/sitecore/content/Bridgestreet/#Non Addressable Content#/Partner";
                    ////string query = root + @"/*[@@templateid=""{73C2BC65-BBD9-42AD-B1E5-12C368B4C8F5}"" and @Enabled = ""1""]";
                    ////var affiliates = this.SitecoreContext.Query<PartnerTile>(query);

                    var tiles = this.GetPartnerTiles(friends);
                    if (tiles != null)
                    {
                        foreach (var item in tiles)
                        {
                            var tile = SitecoreContext.GetItem<PartnerTile>(item.Id);
                            model.Tiles.Add(new PartnerTileModel(tile));
                        }
                    }
                }
                catch (Exception ex)
                {
                    Log.Custom.Error(string.Format("Failed to read datasource for FriendsList({0})", datasourceId), ex);
                }
            }

            return this.View("~/Areas/Bridgestreet/Views/Renderings/PartnerPage/PartnerTiles.cshtml", model);
        }

        private List<ItemBase> GetPartnerTiles(FriendsList item)
        {
            var list = new List<ItemBase>();

            if (item.Friends != null && item.Friends.Any())
            {
                foreach (var friend in item.Friends)
                {
                    list.Add((ItemBase)friend);
                }
            }
            else
            {
                var folder = this.SitecoreContext.GetItem<ItemBase>(item.DataSource);
                if (folder != null)
                {
                    var partnerTileTemplateId = new Guid("{73c2bc65-bbd9-42ad-b1e5-12c368b4c8f5}");
                    return folder.Children.Where(x => x.TemplateId == partnerTileTemplateId).ToList();
                }
            }

            return list;
        }
    }
}