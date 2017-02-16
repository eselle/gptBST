(function () {
    var featuredPropertyPod = {
        init: function () {
            if ($('.property-pod'))
                DOMUtils.resizeForOldBrowsers();
        }
    }
    module.exports = featuredPropertyPod || window.featuredPropertyPod;

})();


