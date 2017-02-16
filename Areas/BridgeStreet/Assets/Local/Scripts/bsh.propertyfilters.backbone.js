//var Model = Backbone.Model.extend( { url: '/briapi/SearchResults/GetFilterJSON' } );

//var View = Backbone.View.extend({
//    initialize: function () {
//        _.bindAll(this, "render"); // make sure 'this' refers to this View in the success callback below
//        this.model.fetch({
//            data: location.search,
//            success: this.render, 
//            error: this.renderError
//        });
//    },
//    render: function (data, status) {

//        var dateStr = this.model.attributes.StartDate;
//        dateStr = dateStr.replace(/[/\(\)]/g, '').replace('Date', '');

//        this.model.attributes.StartDate = new Date(Number(dateStr)).toISOString().slice(0, 10);

//        dateStr = this.model.attributes.EndDate;
//        dateStr = dateStr.replace(/[/\(\)]/g, '').replace('Date', '');

//        this.model.attributes.EndDate = new Date(Number(dateStr)).toISOString().slice(0, 10);

//        var filterTmpl = $("#filter-template").html();
//        var template = _.template(filterTmpl);
//        this.$el.html(template(this.model.attributes));

//    },
//    renderError: function (data, status) {
//        console.log(status.responseText);
//    },
//    events: {
//        "submit" : "reload"
//    },
//    reload: function (e) {
//        e.preventDefault();
//        var formValues = $("#filter-form").serialize();
//        window.history.pushState("object or string", "Title", location.pathname + "?" + formValues);
//        this.model.fetch({
//            data: formValues,
//            success: this.render,
//            error: this.renderError
//        });
//    }
//});
 