var BSTopSearchGuestSelector = require('./BRIDGESTREET.topsearch.guest.selector.js');

(function () {
    var $window = $(window);

    var topSearch = {
        init: function (model, onModelUpdateCallback, onSearchCallback) {
            this.model = model;
            this.onModelUpdateCallback = onModelUpdateCallback;
            this.onSearchCallback = onSearchCallback;

            //TODO: remove previous listeners
            if ($('#topsearch-guests').length) {
                BSTopSearchGuestSelector.init(this.model, this.updateModel.bind(this));
                this.changeHeader();
            }

            $('.topsearchbox #topsearch-search_button').on('click', (function(event) {
                event.preventDefault();
                this.updateModel(this.model);
                this.onSearchCallback();
            }).bind(this));
        },

        updateModel: function (model) {
            this.model = model;
            this.onModelUpdateCallback(model);
        },

        changeHeader: function () {
            $('#searchbox-form > .form-container').hide();
            $('#searchbox-form > .btn-search').hide();
            $('.logo-container').append('<div class="slogan-site"><div class="content-slogan">Every Stay Guaranteed</div></div>');
        }
    };

    module.exports = topSearch || window.topSearch;
})();
