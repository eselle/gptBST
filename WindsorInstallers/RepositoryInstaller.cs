using BridgeStreet.Website.Repository.Implementations;
using BridgeStreet.Website.Repository.Interfaces;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Sitecore.ContentSearch;

namespace BridgeStreet.Website.WindsorInstallers
{
    public class RepositoryInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For(typeof(IRepository<>)).ImplementedBy(typeof(SitecoreGenericRepository<>)).LifestyleTransient());
            container.Register(Component.For<ISiteConfigurationRepository>().ImplementedBy<SitecoreSiteConfigurationRepository>().LifestyleTransient());
            container.Register(Component.For<IPageRepository>().ImplementedBy<SitecorePageRepository>().LifestyleTransient());

            container.Register(Component
                .For<ISitemapRepository>()
                .ImplementedBy<SitecoreSitemapRepository>()
                .DependsOn(Dependency.OnComponent(typeof(ISearchIndex), "fullSiteSearchIndex"))
                .LifestyleTransient());

            container.Register(Component
                .For<IPropertySitecoreSearchRepository>()
                .ImplementedBy<PropertySitecoreSearchRepository>()
                .DependsOn(Dependency.OnComponent(typeof(ISearchIndex), "fullSiteSearchIndex"))
                .LifestyleTransient());
        }
    }
}
