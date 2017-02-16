using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BridgeStreet.Website.Areas.BridgeStreet.Models.BookingFlow
{
    public class BookingTripInfo
    {
        public int PropertyId { get; set; }

        public string Name { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string City { get; set; }

        public string StateCounty { get; set; }

        public string ZipPostal { get; set; }

        public string Country { get; set; }

        public DateTime CheckIn { get; set; }

        public DateTime CheckOut { get; set; }

        public decimal PricePerNight { get; set; }

        public int LengthOfStay { get; set; }

        public decimal TotalAccomodation { get; set; }

        public decimal Subtotal { get; set; }

        public decimal Tax { get; set; }

        public decimal Fees { get; set; }

        public decimal TotalDue { get; set; }

        public string CurrencySign { get; set; }

        public string CurrencyCode { get; set; }

        public string ImageUrl { get; set; }

        public string PromoCode { get; set; }

        public string PromoCodeMessage { get; set; }

        #region Formatted Properties
        public string TotalDueFormatted
        {
            get
            {
                return string.Format("{0}{1:N2}", this.CurrencySign, this.TotalDue);
            }
        }

        public string CheckInDate
        {
            get { return this.CheckIn.ToString("D"); }
        }

        public string CheckInTime
        {
            get { return this.CheckIn.ToString("t"); }
        }

        public string CheckOutDate
        {
            get { return this.CheckOut.ToString("D"); }
        }

        public string CheckOutTime
        {
            get { return this.CheckOut.ToString("t"); }
        }

        public string PricePerNightFormatted
        {
            get
            {
                return string.Format("{0}{1:N2}", this.CurrencySign, this.PricePerNight);
            }
        }

        public string TotalAccomodationFormatted
        {
            get
            {
                return string.Format("{0}{1:N2}", this.CurrencySign, this.TotalAccomodation);
            }
        }

        public string SubtotalFormatted
        {
            get
            {
                return string.Format("{0}{1:N2}", this.CurrencySign, this.Subtotal);
            }
        }

        public string TaxFormatted
        {
            get
            {
                return string.Format("{0}{1:N2}", this.CurrencySign, this.Tax);
            }
        }

        public string FeesFormatted
        {
            get
            {
                return string.Format("{0}{1:N2}", this.CurrencySign, this.Fees);
            }
        }
        #endregion
    }
}