(function () {

    var statisticsPod = {

        init : function () {

            jQuery('.timer').countTo({

                speed: 2000,

                refreshInterval: 50,

                formatter: function (value, options) {

                  return DOMUtils.numberWithCommas(value.toFixed(options.decimals));
                
                }
            });

        }		
    }

    module.exports = statisticsPod || window.statisticsPod;

})();


