using System.Web.Mvc;

namespace BridgeStreet.Website
{
    public class SiteViewEngine : RazorViewEngine
    { 
    }
}

/*
namespace Bridgestreet.Website 
{
    /// <summary>
    /// Custom site View Engine for site name paths
    /// </summary>
    public class SiteViewEngine : RazorViewEngine
    {
        /// <summary>
        /// The subfolder for the site files
        /// </summary>
        private const string SubFolder = "Bridgestreet";

        /// <summary>
        /// Initializes a new instance of the <see cref="SiteViewEngine" /> class
        /// </summary>
        public SiteViewEngine()
        {
            var viewsPath = string.Format("~/Views/{0}", SubFolder);
            this.ViewLocationFormats = new[]
            {
                viewsPath + "/Renderings/{0}.cshtml",
                viewsPath + "/Renderings/Shared/{0}.cshtml",
                viewsPath + "/Sublayouts/{0}.cshtml",
                viewsPath + "/Sublayouts/Shared/{0}.cshtml",
                viewsPath + "/Layouts/{0}.cshtml",
                viewsPath + "/Layouts/Shared/{0}.cshtml",
                viewsPath + "/{1}/{0}.cshtml",
                viewsPath + "/Renderings/{1}/{0}.cshtml",
                viewsPath + "/Renderings/Shared/{1}/{0}.cshtml",
                viewsPath + "/Sublayouts/{1}/{0}.cshtml",
                viewsPath + "/Sublayouts/Shared/{1}/{0}.cshtml",
            };

            this.PartialViewLocationFormats = new[]
            {
                viewsPath + "/{0}.cshtml",
                viewsPath + "/Shared/{0}.cshtml"
            };
        }
    }
}
*/