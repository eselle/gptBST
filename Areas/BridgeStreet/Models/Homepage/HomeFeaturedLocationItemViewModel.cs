using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BridgeStreet.Website.Domain.DomainModels;
using BridgeStreet.Website.Domain.Models.Pages.HomePage.HomeFeaturedLocationList;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.Homepage
{
    public class HomeFeaturedLocationItemViewModel
    {
        private HomeFeaturedLocationListItem _listItem;
        private AreaDetail _areaDetail;

        public HomeFeaturedLocationItemViewModel(HomeFeaturedLocationListItem listItem, AreaDetail areaDetail)
        {
            this._listItem = listItem;
            this._areaDetail = areaDetail;
        }

        public HomeFeaturedLocationListItem ListItem
        {
            get { return this._listItem; }
        }

        public AreaDetail Detail
        {
            get { return this._areaDetail; }
        }
    }
}