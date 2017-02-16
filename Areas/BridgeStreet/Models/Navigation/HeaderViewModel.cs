using System;
using BridgeStreet.Website.Domain.Models.SiteConfiguration;
using BridgeStreet.Website.Infrastructure.Constants;
using Sitecore.Globalization;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.Navigation
{
    public class HeaderViewModel
    {
        public HeaderViewModel(IHeaderConfiguration headerConfiguration, ICookieConfiguration cookieConfiguration)
        {
            if (headerConfiguration == null)
            {
                throw new ArgumentNullException("headerConfiguration");
            }

            if (cookieConfiguration == null)
            {
                throw new ArgumentNullException("cookieConfiguration");
            }

            this.HeaderConfiguration = headerConfiguration;
            this.CookieConfiguration = cookieConfiguration;
        }

        public IHeaderConfiguration HeaderConfiguration { get; private set; }

        public ICookieConfiguration CookieConfiguration { get; private set; }

        public bool HasCookiePolicyAcknowledgement { get; set; }

        public string GetHomeUrl()
        {
            var site = Sitecore.Context.Site;
            return Sitecore.Links.LinkManager.GetItemUrl(Sitecore.Context.Database.GetItem(site.RootPath + site.StartItem));
        }
    }
}