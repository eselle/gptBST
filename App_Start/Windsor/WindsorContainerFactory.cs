using BridgeStreet.Website.WindsorInstallers;
using Castle.Windsor;

namespace BridgeStreet.Website.Windsor
{
    /// <summary>
    /// Windsor Container Factory
    /// </summary>
    public class WindsorContainerFactory : IIocContainerFactory
    {
        /// <summary>
        /// Build the Container
        /// </summary>
        /// <returns>returns container</returns>
        public IWindsorContainer BuildContainer()
        {
            IWindsorContainer container = new WindsorContainer();

            this.RegisterDependencies(container);

            return container;
        }

        /// <summary>
        /// Register the dependencies
        /// </summary>
        /// <param name="container">windsor container</param>
        private void RegisterDependencies(IWindsorContainer container)
        {
            container.Install(new ServiceInstaller());
            container.Install(new ContextInstaller());
            container.Install(new ControllerInstaller());
            container.Install(new SearchInstaller());
            container.Install(new RepositoryInstaller());
        }
    }
}
