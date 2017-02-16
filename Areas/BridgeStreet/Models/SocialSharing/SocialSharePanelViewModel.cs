using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BridgeStreet.Website.Domain.Models.Navigation;
using BridgeStreet.Website.Domain.Models.SocialMedia;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.SocialSharing
{
    public class SocialSharePanelViewModel
    {
        public IEnumerable<SocialMediaPlatform> SocialSharing { get; set; }
        
        public Menu BrandsMenu { get; set; }
    }
}