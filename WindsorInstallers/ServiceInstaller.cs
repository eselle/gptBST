using BridgeStreet.Website.Service;
using BridgeStreet.Website.Service.Implementations;
using BridgeStreet.Website.Service.Interfaces;
using BridgeStreet.Website.Service.Models.NotificationType;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;

namespace BridgeStreet.Website.WindsorInstallers
{
    public class ServiceInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Component.For<PageService>().LifestyleTransient());
            container.Register(Component.For<SiteService>().LifestyleTransient());
            container.Register(Component.For<CookiePolicyService>().LifestyleTransient());
            container.Register(Component.For<PropertySearchService>().LifestyleTransient());
            container.Register(Component.For<SearchService>().LifestyleTransient());
            container.Register(Component.For<NotificationService>().LifestyleTransient());
            container.Register(Component.For<INotificationService<Email>>().ImplementedBy<EmailNotificationService>());
            container.Register(Component.For<IContactUsNotificationService>().ImplementedBy<ContactUsNotificationService>());
        }
    }
}
