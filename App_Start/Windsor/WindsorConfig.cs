using System;
using System.Web.Http;
using System.Web.Http.Dispatcher;
using System.Web.Mvc;
using BridgeStreet.Website.Windsor;
using Castle.Windsor;
using WebActivatorEx;

[assembly: PreApplicationStartMethod(typeof(WindsorConfig), "RegisterComponents")]

[assembly: ApplicationShutdownMethod(typeof(WindsorConfig), "ReleaseComponents")]

namespace BridgeStreet.Website.Windsor
{
    public class WindsorConfig
    {
        private static readonly IIocContainerFactory Factory;

        private static readonly Lazy<IWindsorContainer> Container;

        static WindsorConfig()
        {
            Factory = new WindsorContainerFactory();
            Container = new Lazy<IWindsorContainer>(() => Factory.BuildContainer());
        }

        public static IWindsorContainer WindsorContainer
        {
            get { return Container.Value; }
        }

        public static void RegisterComponents()
        {
            ControllerBuilder.Current.SetControllerFactory(new WindsorControllerFactory(WindsorContainer));
            GlobalConfiguration.Configuration.Services.Replace(
                typeof(IHttpControllerActivator),
                new WindsorControllerActivator(WindsorContainer));
        }

        public static void ReleaseComponents()
        {
            WindsorContainer.Dispose();
        }
    }
}