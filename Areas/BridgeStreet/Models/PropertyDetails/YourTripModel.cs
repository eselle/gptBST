using System;
using System.Collections.Generic;
using BridgeStreet.Website.Service;
using Glass.Mapper.Sc.Fields;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.PropertyDetails
{
    public class YourTripModel
    {
        public YourTripModel()
        {
            this.BookItNowUrl = new Link();
            this.RequestBookUrl = new Link();
            this.RoomBookingOptions = new List<RoomBookingOption>();
        }

        public int PropertyId { get; set; }

        public DateTime ArrivalDate { get; set; }

        public DateTime DepartureDate { get; set; }
        
        public decimal CostPerNight { get; set; }

        public decimal TotalCost { get; set; }

        public int Nights { get; set; }

        public int RoomType { get; set; }

        public List<RoomBookingOption> RoomBookingOptions { get;  set; }
        
        public int Adults { get; set; }

        public int Children { get; set; }
        
        public int Pets { get; set; }
        
        public Link BookItNowUrl { get; set; }

        public Link RequestBookUrl { get; set; }

        public bool IsRealTimeBookable { get; set; }

        public string EncodedFullUrl { get; set; }

        public string CurrencyCode { get; set; }

        public string RoomTypeHTML { get; set; }        
    }
}