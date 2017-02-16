using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.AllLocations
{
    public class AreaListResult
    {
        public string Name { get; set; }

        public string ShortName { get; set; }

        public IEnumerable<AreaGroupingResult> Groupings { get; set; }
    }
}