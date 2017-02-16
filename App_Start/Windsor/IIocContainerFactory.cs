using Castle.Windsor;

namespace BridgeStreet.Website.Windsor
{
    /// <summary>
    /// Represents a contract for creating container configurations.
    /// </summary>
    public interface IIocContainerFactory
    {
        /// <summary>
        /// Builds up the container registrations.
        /// </summary>
        /// <returns>The container.</returns>
        IWindsorContainer BuildContainer();
    }
}
