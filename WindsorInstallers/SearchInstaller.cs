using BridgeStreet.Website.Infrastructure.Constants;
using BridgeStreet.Website.Infrastructure.Sc.Extensions;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Sitecore.ContentSearch;

namespace BridgeStreet.Website.WindsorInstallers
{
    public class SearchInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(
                Component.For<ISearchIndex>()
                    .UsingFactoryMethod(x => DbBasedContentSearchManager.GetIndex(Constants.SearchIndexes.FullSitePrefix), managedExternally: true)
                    .Named("fullSiteSearchIndex")
                    .LifestyleTransient());
        }
    }
}