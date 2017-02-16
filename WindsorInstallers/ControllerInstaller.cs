using System.Web.Http;
using System.Web.Mvc;
using BridgeStreet.Website.Areas.BridgeStreet.Controllers;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Sitecore.Mvc.Controllers;

namespace BridgeStreet.Website.WindsorInstallers
{
    public class ControllerInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Classes.FromThisAssembly().BasedOn<BridgeStreetController>().LifestyleTransient());
            container.Register(Classes.FromThisAssembly().BasedOn<SitecoreController>().LifestyleTransient());
            container.Register(Classes.FromThisAssembly().BasedOn<ApiController>().LifestyleTransient());
            container.Register(Classes.FromAssemblyNamed("Sitecore.Speak.Client").BasedOn<Controller>().LifestylePerWebRequest());
            container.Register(Classes.FromAssemblyNamed("Sitecore.Services.Infrastructure.Sitecore").BasedOn<ApiController>().LifestylePerWebRequest());
            container.Register(Classes.FromAssemblyNamed("Sitecore.Services.Infrastructure.Sitecore").BasedOn<Controller>().LifestylePerWebRequest());
            container.Register(Component.For<SitecoreController>().ImplementedBy<SitecoreController>().LifestylePerWebRequest());
        }
    }
}
