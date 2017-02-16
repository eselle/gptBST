<%@Application Language='C#' Inherits="Sitecore.ContentSearch.SolrProvider.CastleWindsorIntegration.WindsorApplication"%>
<%@ Import Namespace="System.Web.Optimization" %>
<%@ Import Namespace="BridgeStreet.Website" %>

<script RunAt="server">

    public override void Application_Start()
    {
        base.Application_Start();

        // Sitecore security hardening guide recommendation - https://doc.sitecore.net/sitecore_experience_platform/81/setting_up__maintaining/security_hardening/configuring/remove_header_information_from_responses_sent_by_your_website?roles=admin
        MvcHandler.DisableMvcResponseHeader = true;

        AreaRegistration.RegisterAllAreas();
        ViewEngineConfig.RegisterRazorViewEngine();
        FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
        RouteConfig.RegisterRoutes(RouteTable.Routes);
        BundleConfig.RegisterBundles(BundleTable.Bundles);
    }

        </script>

