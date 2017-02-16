using System.Collections.Generic;
using BridgeStreet.Website.Domain.Models.SocialMedia;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.SocialSharing
{
    public class SocialSharingViewModel
    {
        public IEnumerable<SocialMediaPlatform> SocialSharing { get; set; }
        
        public string PageUrl { get; set; }
    }
}