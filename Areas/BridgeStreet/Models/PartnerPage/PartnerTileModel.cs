using System;
using System.Collections.Generic;
using System.Web;
using BridgeStreet.Website.Domain.Models.Content.Partners;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.PartnerPage
{
    public class PartnerTileModel
    {
        public PartnerTileModel()
        {
            this.Heading = string.Empty;
            this.Description = string.Empty;
            this.Link = string.Empty;
            this.Image = string.Empty;
            this.ButtonText = string.Empty;
        }

        public PartnerTileModel(PartnerTile affiliate)
            : base()
        {
            if (affiliate != null)
            {
                this.Heading = affiliate.Heading ?? "{ Tile Heading }";

                this.Description = affiliate.Description ?? "{ Description }";
                if (!this.Description.Contains("<p>") && !this.Description.Contains("<div>"))
                    this.Description = "<p>" + this.Description + "</p>";

                this.ButtonText = affiliate.ButtonText ?? "Go";

                if (affiliate.Link != null)
                    this.Link = affiliate.Link.Url ?? "#";

                if (affiliate.Image != null)
                    this.Image = affiliate.Image.Src ?? string.Empty;
            }
        }

        public string Heading { get; set; }
        
        public string Description { get; set; }

        public string Link { get; set; }

        public string Image { get; set; }

        public string ButtonText { get; set; }
    }
}