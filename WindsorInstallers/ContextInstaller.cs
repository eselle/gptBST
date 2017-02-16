using System.Web;
using BridgeStreet.Website.Infrastructure.Constants;
using BridgeStreet.Website.Repository.Resolvers.SiteContextResolver;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Glass.Mapper.Sc;
using Sitecore.Configuration;

namespace BridgeStreet.Website.WindsorInstallers
{
    public class ContextInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            // default
            container.Register(Component.For<HttpContextBase>().LifestyleTransient().UsingFactoryMethod(() => new HttpContextWrapper(HttpContext.Current)));
            container.Register(Component.For<ISitecoreContext>().ImplementedBy<SitecoreContext>().LifestylePerWebRequest());
            container.Register(Component.For<ISitecoreService>().ImplementedBy<SitecoreService>().LifestylePerWebRequest());

            container.Register(Component
                .For<ISiteContextResolver>()
                .ImplementedBy<PageEditorFriendlySiteContextResolver>()
                .DependsOn(Dependency.OnComponent(typeof(ISiteContextResolver), "defaultSiteCtxResolver"))
                .LifestylePerWebRequest());

            // named
            container.Register(Component
                .For<ISitecoreContext>()
                .ImplementedBy<SitecoreContext>()
                .UsingFactoryMethod(x => new SitecoreContext(Factory.GetDatabase(Constants.Databases.Master)))
                .Named("masterJobOnlyCtx")
                .LifestyleTransient());

            container.Register(
                Component.For<ISiteContextResolver>()
                .ImplementedBy<DefaultSiteContextResolver>()
                .Named("defaultSiteCtxResolver")
                .LifestylePerWebRequest());
        }
    }
}
