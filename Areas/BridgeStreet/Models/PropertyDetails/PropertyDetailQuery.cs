using System;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.PropertyDetails
{
    public class PropertyDetailQuery
    {
        public int PropertyId { get; set; }

        public DateTime ArrivalDate { get; set; }

        public DateTime DepartureDate { get; set; }
        
        public int RoomType { get; set; }

        public int Adults { get; set; }

        public int Children { get; set; }

        public int Pets { get; set; }

        public int Nights { get; set; }
    }
}