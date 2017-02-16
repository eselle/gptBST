using System.Web.Mvc;

namespace BridgeStreet.Website.Extensions
{
    public static class HtmlHelperExtensions
    {
        public static BridgeStreetHtmlHelper SitecoreEx(this HtmlHelper helper)
        {
            return new BridgeStreetHtmlHelper(helper);
        }
    }
}
