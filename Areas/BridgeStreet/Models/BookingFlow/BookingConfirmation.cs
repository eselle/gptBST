using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.BookingFlow
{
    public class BookingConfirmation
    {
        private BookingTripInfo _tripInfo;

        public string OscarToken { get; set; }

        public int ReservationNumber { get; set; }

        public Guid ReservationToken { get; set; }

        public string TripDates { get; set; }

        public string Message { get; set; }

        public string PaymentProcessorUrl { get; set; }

        public string Last4 { get; set; }

        public string AvsReply { get; set; }

        public bool BookingSuccessful { get; set; }
        
        public BookingTripInfo TripInfo
        {
            get
            {
                if (this._tripInfo == null)
                {
                    this._tripInfo = new BookingTripInfo();
                }

                return this._tripInfo;
            }

            set
            {
                this._tripInfo = value;
            }
        }
    }
}