using System.Web.Mvc;
using BridgeStreet.Website.Repository.Resolvers.SiteContextResolver;
using BridgeStreet.Website.Windsor;
using Sitecore.Mvc.Helpers;
using Sitecore.Sites;

namespace BridgeStreet.Website.Extensions
{
    public class BridgeStreetHtmlHelper : SitecoreHelper
    {
        public BridgeStreetHtmlHelper(HtmlHelper helper)
            : base(helper)
        {
        }

        public SiteContext Site()
        {
            var siteContextResolver = WindsorConfig.WindsorContainer.Resolve<ISiteContextResolver>();
            var site = siteContextResolver.GetSite();
            WindsorConfig.WindsorContainer.Release(siteContextResolver);
            return site;
        }
    }
}