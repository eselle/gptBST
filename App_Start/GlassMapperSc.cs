using Glass.Mapper.Maps;
using Glass.Mapper.Sc.Configuration.Fluent;
using Glass.Mapper.Sc.IoC;
using Sitecore.Pipelines;

namespace BridgeStreet.Website
{
    public class GlassMapperSc
    {
        public static void Start()
        {
            var resolver = GlassMapperScCustom.CreateResolver();

            var context = Glass.Mapper.Context.Create(resolver);

            LoadConfigurationMaps(resolver, context);

            context.Load(GlassMapperScCustom.GlassLoaders());

            GlassMapperScCustom.PostLoad();
        }

        public static void LoadConfigurationMaps(IDependencyResolver resolver, Glass.Mapper.Context context)
        {
            var dependencyResolver = resolver as DependencyResolver;
            if (dependencyResolver == null)
            {
                return;
            }

            if (dependencyResolver.ConfigurationMapFactory is ConfigurationMapConfigFactory)
            {
                GlassMapperScCustom.AddMaps(dependencyResolver.ConfigurationMapFactory);
            }

            IConfigurationMap configurationMap = new ConfigurationMap(dependencyResolver);
            SitecoreFluentConfigurationLoader configurationLoader = configurationMap.GetConfigurationLoader<SitecoreFluentConfigurationLoader>();
            context.Load(configurationLoader);
        }

        public void Process(PipelineArgs args)
        {
            GlassMapperSc.Start();
        }
    }
}