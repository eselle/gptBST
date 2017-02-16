using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BridgeStreet.Website.Extensions
{
    public static class UtilityExtensions
    {
        public static DateTime GetDateTimeSafe(this string str)
        {
            var d = DateTime.MinValue;
            DateTime.TryParse(str, out d);
            return d;
        }

        public static int GetIntSafe(this string str)
        {
            var i = 0;
            int.TryParse(str, out i);
            return i;
        }
    }
}