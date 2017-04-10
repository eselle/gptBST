(function () {
    var $window = $(window);

    var topSearch = {
        init: function () {
            var $city = $('#searchKeywords');
            console.log('top search initialized', $city);

        }
    };

    module.exports = topSearch || window.topSearch;
})();

