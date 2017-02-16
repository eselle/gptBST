using System.Web.Mvc;

namespace BridgeStreet.Website.Areas.BridgeStreet
{
    public class BridgeStreetAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "BridgeStreet";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "BridgeStreet_default",
                "BridgeStreet/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional },
                 namespaces: new string[] { "BridgeStreet.Website.Areas.BridgeStreet.Controllers" });
        }
    }
}