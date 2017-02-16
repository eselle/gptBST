using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BridgeStreet.Website.Domain.DomainModels;
using BridgeStreet.Website.Domain.Models.Pages.HomePage.HomeFeaturedPropertiesList;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.Homepage
{
    public class HomeFeaturedPropertyViewModel
    {
        public HomeFeaturedPropertyViewModel(HomeFeaturedPropertiesList propertiesList, IEnumerable<HomeFeaturedPropertyListItemViewModel> properties)
        {
            this.PropertiesList = propertiesList;
            this.Properties = properties;
        }

        public HomeFeaturedPropertiesList PropertiesList { get; set; }

        public IEnumerable<HomeFeaturedPropertyListItemViewModel> Properties { get; set; }
    }
}