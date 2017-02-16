using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Glass.Mapper.Sc.Fields;
using Microsoft.Ajax.Utilities;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.Homepage
{
    public class HomeFeaturedLocationListViewModel
    {
        private List<HomeFeaturedLocationItemViewModel> _locationItems;
        private Link _propertySearchPage; 

        public HomeFeaturedLocationListViewModel(List<HomeFeaturedLocationItemViewModel> locationItems, Link propertySearchPage)
        {
            this._locationItems = locationItems;
            this._propertySearchPage = propertySearchPage;
        }

        public List<HomeFeaturedLocationItemViewModel> LocationItems
        {
            get { return this._locationItems; }
        }

        public Link PropertySearchPage
        {
            get { return this._propertySearchPage; }
        }
    }
}