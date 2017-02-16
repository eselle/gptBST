using System;
using System.Collections.Generic;
using System.Linq;
using BridgeStreet.Website.Domain.Models.Base;
using BridgeStreet.Website.Domain.Models.Component;
using BridgeStreet.Website.Domain.Models.SiteConfiguration;
using BridgeStreet.Website.Infrastructure.Extensions;
using Glass.Mapper.Sc.Fields;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.Global
{
    public class HtmlHeadViewModel
    {
        public HtmlHeadViewModel(PageBase page, SiteConfiguration siteConfiguration)
        {
            if (page == null)
            {
                throw new ArgumentNullException("page");
            }

            if (siteConfiguration == null)
            {
                throw new ArgumentNullException("siteConfiguration");
            }

            this.Page = page;
            this.SiteConfiguration = siteConfiguration;
        }

        public PageBase Page { get; private set; }

        public SiteConfiguration SiteConfiguration { get; private set; }

        public string OpenGraphImage
        {
            get
            {
                return this.SafeImgSrc(this.Page.OpenGraphImageWithFallback);
            }
        }

        public string Favicon
        {
            get
            {
                return this.SafeImgSrc(this.SiteConfiguration.Favicon);
            }
        }

        public string FaviconPng
        {
            get
            {
                return this.SafeImgSrc(this.SiteConfiguration.FaviconPng);
            }
        }

        public string IOSIcon76
        {
            get
            {
                return this.SafeImgSrc(this.SiteConfiguration.IOSIcon76);
            }
        }

        public string IOSIcon120
        {
            get
            {
                return this.SafeImgSrc(this.SiteConfiguration.IOSIcon120);
            }
        }

        public string IOSIcon152
        {
            get
            {
                return this.SafeImgSrc(this.SiteConfiguration.IOSIcon152);
            }
        }

        public string IOSIcon180
        {
            get
            {
                return this.SafeImgSrc(this.SiteConfiguration.IOSIcon180);
            }
        }

        public string Robots
        {
            get
            {
                var robotsStrings = new List<string>
                                        {
                                            this.Page.NoFollow ? "nofollow" : string.Empty,
                                            this.Page.NoIndex ? "noindex" : string.Empty
                                        };

                return string.Join(
                    ",",
                    robotsStrings
                        .Where(x => !x.IsNullOrWhiteSpace())
                        .Select(x => x));
            }
        }

        private string SafeImgSrc(Image img)
        {
            return img != null ? Convert.ToString(img.Src) : string.Empty;
        }
    }
}
