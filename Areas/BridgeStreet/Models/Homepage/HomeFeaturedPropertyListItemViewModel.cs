using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BridgeStreet.Website.Domain.DomainModels;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.Homepage
{
    public class HomeFeaturedPropertyListItemViewModel
    {
        public HomeFeaturedPropertyListItemViewModel(PropertyDetail property, string url)
        {
            this.Property = property;
            this.Url = url;
        }

        public PropertyDetail Property { get; set; }

        public string Url { get; set; }
    }
}