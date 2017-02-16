using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.PropertyDetails
{
    public class PropertyImageViewModel
    {
        public IEnumerable<string> Images { get; set; }

        public string PropertyName { get; set; }
    }
}