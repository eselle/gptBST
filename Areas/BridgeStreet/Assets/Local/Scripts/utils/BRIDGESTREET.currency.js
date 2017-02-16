var currencyUtil = (function () {
    var my = {},
    currency_symbols = {
        'USD': '$', // US Dollar
        'EUR': '€', // Euro
        'CRC': '₡', // Costa Rican Colón
        'GBP': '£', // British Pound Sterling
        'ILS': '₪', // Israeli New Sheqel
        'INR': '₹', // Indian Rupee
        'JPY': '¥', // Japanese Yen
        'KRW': '₩', // South Korean Won
        'NGN': '₦', // Nigerian Naira
        'PHP': '₱', // Philippine Peso
        'PLN': 'zł', // Polish Zloty
        'PYG': '₲', // Paraguayan Guarani
        'THB': '฿', // Thai Baht
        'UAH': '₴', // Ukrainian Hryvnia
        'VND': '₫', // Vietnamese Dong
    };

    my.convert = function (code) {
        return currency_symbols[code];
    };
    
    my.formatCurrency = function (value) {
        value = value.toFixed(2);
        return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

    return my;
}());

module.exports = currencyUtil || window.currencyUtil;