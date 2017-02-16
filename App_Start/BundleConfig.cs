using System.Web.Optimization;
using BridgeStreet.Website.Extensions;

namespace BridgeStreet.Website
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            RegisterScripts(BundleTable.Bundles);
            RegisterStyles(BundleTable.Bundles);
        }

        private static void RegisterStyles(BundleCollection bundles)
        {
            //Need to have bundle in same path as CSS files to accomodate relative image URLs.   

            /* ToDo: Add this new CssRewriteUrlTransform() 
            bundles.Add(new StyleBundle("~/bundles/css/vendor")
                .Include("~/Areas/Brdigestreet/Assets/Vendor/font-awesome-4.6.1/css/font-awesome.min.css", new CssRewriteUrlTransform())
                .Include("~/Areas/Bridgestreet/Assets/Local/Css/adient.min.css", new CssRewriteUrlTransform()));
            */

            bundles.Add(
                new StyleBundle("~/bundles/css/vendor")
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/bootstrap-3.3.6/css/bootstrap.min.css")
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/bootstrap-select/css/bootstrap-select.min.css")
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/idangero.swiper-3.3.1/css/swiper.min.css")
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/font-awesome-4.6.3/css/font-awesome.min.css",
                    new CssRewriteUrlTransform())
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/jquery-ui-1.12.0/css/jquery-ui.min.css")
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/jquery-ui-1.12.0/css/jquery-ui.theme.min.css")
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/jquery-ui-1.12.0/css/jquery-ui.structure.min")
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/mobiscroll/css/mobiscroll.custom-3.0.0-beta4.min.css",
                    new CssRewriteUrlTransform())
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/prettify/css/prettify.css")
                .Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/foundation/css/foundation-datepicker.min.css")
                .Include(
                    "~/Areas/BridgeStreet/Assets/Local/Css/main.css",
                    new CssRewriteUrlTransform()));
        }

        private static void RegisterScripts(BundleCollection bundles)
        {
            bundles.Add(
                new ScriptBundle("~/bundles/js/vendor").Include(
                    "~/Areas/BridgeStreet/Assets/Vendor/gsap-1.19.0/TweenMax.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/gsap-1.19.0/plugins/CSSPlugin.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/gsap-1.19.0/plugins/EasePack.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/gsap-1.19.0/plugins/ScrollToPlugin.min.js"));

            var vendorBundle = new ScriptBundle("~/bundles/js/vendors").Include(
                "~/Areas/BridgeStreet/Assets/Vendor/jquery/jquery.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/jquery-countTo/jquery.countTo.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/jquery-ui-1.12.0/js/jquery-ui.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/jquery-ui-1.12.0/js/jquery-ui.spinner.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/bootstrap-3.3.6/js/bootstrap.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/bootstrap-select/js/bootstrap-select.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/idangero.swiper-3.3.1/js/swiper.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/underscore/underscore-min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/backbone/backbone-min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/watermark/watermark.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/prettify/js/prettify.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/remodal-1.1.0/remodal.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/nouislider/js/nouislider.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/wNumb/wNumb.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/elementresize/element.resize.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/mobiscroll/js/mobiscroll.custom-3.0.0-beta4.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/SimpleAccordion/jquery.simpleaccordion.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/stickup/stickUp.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/gmaps/gmaps.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/sticky-kit/sticky-kit.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/slideout/slideout.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/vivus/vivus.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/scrolltrigger/ScrollTrigger.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/raty/js/jquery.raty.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/foundation/js/foundation-datepicker.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/jquery-validate/jquery.validate.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/recaptcha/api.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/popcorn/popcorn.min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/jquery.matchHeight/jquery.matchHeight-min.js",
                    "~/Areas/BridgeStreet/Assets/Vendor/tweenmaxscrollto/tweenmax.scrollto.js");
            vendorBundle.Orderer = new BundleOrderer();
            bundles.Add(vendorBundle);

            bundles.Add(
                new ScriptBundle("~/bundles/js/local").Include(
                    "~/Areas/BridgeStreet/Assets/Local/Scripts/scripts.js"
                    /*,"~/Areas/BridgeStreet/Assets/Local/Scripts/bookingflow.js"*/));
        }
    }
}
