using System.Web.Mvc;

namespace BridgeStreet.Website.ViewEngine
{
    public class BridgeStreetRazorViewEngine : RazorViewEngine
    {
        public BridgeStreetRazorViewEngine()
        {
            this.AreaViewLocationFormats = new[]
            {
                "~/Areas/{2}/Views/{1}/{0}.cshtml",
                "~/Areas/{2}/Views/Shared/{0}.cshtml",
                "~/Areas/{2}/Views/Renderings/{1}/{0}.cshtml",
                "~/Areas/{2}/Views/Renderings/Shared/{1}/{0}.cshtml",
                "~/Areas/{2}/Views/Sublayouts/{1}/{0}.cshtml",
                "~/Areas/{2}/Views/Sublayouts/Shared/{1}/{0}.cshtml",
                "~/Areas/{2}/Views/Layouts/{1}/{0}.cshtml",
                "~/Areas/{2}/Views/Layouts/Shared/{1}/{0}.cshtml"
            };

            this.AreaPartialViewLocationFormats = new string[]
            {
                "~/Areas/{2}/Views/{1}/{0}.cshtml",
                "~/Areas/{2}/Views/Shared/{0}.cshtml",
                "~/Areas/{2}/Views/Renderings/{1}/{0}.cshtml",
                "~/Areas/{2}/Views/Renderings/Shared/{1}/{0}.cshtml"
            };
        }
    }
}