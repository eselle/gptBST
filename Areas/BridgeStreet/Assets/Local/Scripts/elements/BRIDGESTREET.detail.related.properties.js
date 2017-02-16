var CurrencyUtil = require('../utils/BRIDGESTREET.currency.js');

(function () {
    var $window = $(window);
    var relatedproperties = {
        relatedProperties: null,
        relatedPropertiesView: null,
        relatedPropertiesModel: null,
        init: function () {

            if (DOMUtils.isUndefined(document.getElementById('related-properties'))) return;

            var dfd = jQuery.Deferred();

            var Model = Backbone.Model.extend({ url: '/briapi/PropertyDetail/RelatedPropertiesJSON' });

            var View = Backbone.View.extend({
                initialize: function () {
                    _.bindAll(this, "renderRelatedProperties"); // make sure 'this' refers to this View in the success callback below

                    this.model.fetch({
                        data: { 'PropertyId': $('.related-properties #PropertyId').val() },
                        success: this.renderRelatedProperties,
                        error: this.renderRelatedPropertiesError
                    });
                },
                renderRelatedProperties: function (data, status) {
                    var properties = [];

                    for (var key in this.model.attributes) {
                        var item = this.model.attributes[key];

                        if (item.MinRate > 0) {
                            item.CurrencyCode = CurrencyUtil.convert(item.CurrencyCode);
                            item.MinRate = CurrencyUtil.formatCurrency(item.MinRate);
                        }

                        item.URL += window.location.search;

                        properties.push(item);
                    }

                    var relatedPropertiesTmpl = $("#related-properties-template").html();
                    var template = _.template(relatedPropertiesTmpl);
                    this.$el.html(template({ Properties: properties }));

                    DOMUtils.resizeForOldBrowsers();
                    dfd.resolve("hurray");
                },
                renderRelatedPropertiesError: function (data, status) {
                    console.log(status.responseText);
                    dfd.reject("error" + status.responseText);
                }
            });

            this.relatedPropertiesModel = new Model();
            this.relatedPropertiesView = new View({ model: this.relatedPropertiesModel, tagName: "div", el: $("#related-properties") });
            return dfd.promise();
        }
    }

    module.exports = relatedproperties || window.relatedproperties;

})();

