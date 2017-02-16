using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.AllLocations
{
    public class AreaGroupingResult
    {
        public string GroupingTitle { get; set; }

        public IEnumerable<AreaResult> GroupingAreas { get; set; }
    }
}