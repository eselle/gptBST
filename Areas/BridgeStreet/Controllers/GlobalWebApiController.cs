using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BridgeStreet.Website.Service;

namespace BridgeStreet.Website.Areas.BridgeStreet.Controllers
{
    public class GlobalWebApiController : ApiController
    {
        protected readonly SiteService SiteService;

        public GlobalWebApiController(SiteService siteService)
        {
            this.SiteService = siteService;
        }
    }
}
