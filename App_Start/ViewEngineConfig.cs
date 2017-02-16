using System.Web.Mvc;
using BridgeStreet.Website.ViewEngine;

namespace BridgeStreet.Website
{
    public class ViewEngineConfig
    {
        public static void RegisterRazorViewEngine()
        {
            ViewEngines.Engines.Clear();
            ViewEngines.Engines.Add(new BridgeStreetRazorViewEngine());
        }
    }
}