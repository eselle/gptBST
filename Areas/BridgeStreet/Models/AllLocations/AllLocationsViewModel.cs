using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.AllLocations
{
    public class AllLocationsViewModel
    {
        public string SearchUrl { get; set; }

        public IEnumerable<AreaListResult> Lists { get; set; }
    }
}