var BSTopSearchGuestSelector = require('./BRIDGESTREET.topsearch.guest.selector.js');

(function () {
    var $window = $(window);

    var topSearch = {
        init: function (model, onModelUpdateCallback) {
            this.model = model;
            this.onModelUpdateCallback = onModelUpdateCallback;

            BSTopSearchGuestSelector.init(this.model, this.updateModel.bind(this));
            //TODO: remove previous listeners
        },

        updateModel: function (model) {
            this.onModelUpdateCallback(model);
        }
    };

    module.exports = topSearch || window.topSearch;
})();

