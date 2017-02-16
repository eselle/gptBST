using System;
using BridgeStreet.Website.Domain.Models.SiteConfiguration;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.Navigation
{
    public class FooterViewModel
    {
        public FooterViewModel(IFooterConfiguration footerConfiguration)
        {
            if (footerConfiguration == null)
            {
                throw new ArgumentNullException("footerConfiguration");
            }

            this.FooterConfiguration = footerConfiguration;
        }

        public IFooterConfiguration FooterConfiguration { get; private set; }
    }
}