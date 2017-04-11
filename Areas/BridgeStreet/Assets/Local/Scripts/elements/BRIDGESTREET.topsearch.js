var BSTopSearchGuestSelector = require('./BRIDGESTREET.topsearch.guest.selector.js');

(function () {
    var $window = $(window);

    var topSearch = {
        init: function (model, onModelUpdateCallback, onSearchCallback) {
            this.model = model;
            this.onModelUpdateCallback = onModelUpdateCallback;
            this.onSearchCallback = onSearchCallback;

            //TODO: remove previous listeners
            BSTopSearchGuestSelector.init(this.model, this.updateModel.bind(this));

            $('.topsearchbox #topsearch-search_button').on('click', (function(event) {
                event.preventDefault();
                this.updateModel(this.model);
                this.onSearchCallback();
            }).bind(this));
        },

        updateModel: function (model) {
            this.model = model;
            this.onModelUpdateCallback(model);
        }
    };

    module.exports = topSearch || window.topSearch;
})();

