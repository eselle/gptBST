using System.Collections.Generic;
using BridgeStreet.Website.Domain.Models.Content.Partners;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.PartnerPage
{
    public class PartnerTileListModel
    {
        public PartnerTileListModel()
        {
            this.Tiles = new List<PartnerTileModel>();
            this.RenderingParameters = null;
        }

        public List<PartnerTileModel> Tiles { get; set; }

        public PartnerTilesParams RenderingParameters { get; set; }
    }
}