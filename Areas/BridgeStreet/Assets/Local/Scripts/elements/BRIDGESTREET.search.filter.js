var BSmapview = require('./BRIDGESTREET.mapview.js');
var BSsearchlisting = require('./BRIDGESTREET.search.listing.js');
var BSuicomponents = require('../widgets/BRIDGESTREET.ui.components.js');
var BSTopSearch = require('./BRIDGESTREET.topsearch.js');
var CurrencyUtil = require('../utils/BRIDGESTREET.currency.js');
(function () {
    var $window = $(window);

    var searchfilter = {
        searchFilter: null,
        searchView: null,
        searchModel: null,
        init: function ($window) {

            if ($('#filter-container').length == 0) return;

            var dfd = jQuery.Deferred();

            var Model = Backbone.Model.extend({ url: 'http://localhost:5000/bridge-mock' });

            var View = Backbone.View.extend({
                initialize: function () {
                    _.bindAll(this, "render");
                    this.processForm(location.search);
                    dfd.resolve("hurray");
                },
                events: {
                    "submit": "applyFilter",
                    "click .filter-close": "removeFilter",
                    "click .cancel-btn": "cancelFilter",
                    "change #RoomType": "redoSearch",
                    "change #IsRealTimeBookable": "applyFilter",
                    "change #PropertySpecial": "applyFilter"
                },
                redoSearch: function (e) {
                    if (e) e.preventDefault();
                    var formValues = $("#filter-container").serialize();

                    this.processForm(formValues);
                },
                cancelFilter: function (e) {
                    //uncheck all the sub filters
                    $('#bottom-filter input').removeAttr('checked');

                    //check the sub filters that are in the model
                    for (var i = 0; i < this.model.attributes.filters.PropertyTypes.length; i++) {
                        var id = this.model.attributes.filters.PropertyTypes[i];
                        $('input[name=PropertyTypes]#' + id).prop('checked', 'checked');
                    }
                    for (var i = 0; i < this.model.attributes.filters.Attributes.length; i++) {
                        var id = this.model.attributes.filters.Attributes[i];
                        $('input[name=Attributes]#' + id).prop('checked', 'checked');
                    }
                    if (this.model.attributes.filters.IsPetFriendly) {
                        $('input[name=IsPetFriendly]#' + id).prop('checked', 'checked');
                    }
                },
                applyFilter: function (e) {

                    if (e != undefined && e.preventDefault != undefined)
                        e.preventDefault();

                    if (
                        e.target.id != "IsRealTimeBookable" &&
                        e.target.id != "PropertySpecial" &&
                        e.target.id != "RangeSlider"
                        ) {
                        $('#CollapseExample').collapse('toggle')
                    }
                    $("#thinking").show();

                    //collect the values that were selected
                    var filters = {
                        PropertyTypes: [],
                        IsPetFriendly: false,
                        IsRealTimeBookable: false,
                        PropertySepecial: false,
                        PriceMin: null,
                        PriceMax: null,
                        Attributes: []
                    };

                    var priceMin = $('#RangeSlider .noUi-handle.noUi-handle-lower .noUi-tooltip').text().replace("$", "");
                    if (priceMin != "") {
                        filters.PriceMin = Number(priceMin);
                    }

                    var priceMax = $('#RangeSlider .noUi-handle.noUi-handle-upper .noUi-tooltip').text().replace("$", "");
                    if (priceMax != "") {
                        filters.PriceMax = Number(priceMax);
                    }

                    if ($('input[name=IsRealTimeBookable]:checked').length) {
                        filters.IsRealTimeBookable = true;
                    }
                    if ($('input[name=PropertySpecial]:checked').length) {
                        filters.PropertySpecial = true;
                    }
                    if ($('input[name=IsPetFriendly]:checked').length) {
                        filters.IsPetFriendly = true;
                        $(".filter-close[value='IsPetFriendly=true']").show();
                    }
                    $('input[name=PropertyTypes]:checked').each(function () {
                        var val = Number($(this).val());
                        $(".filter-close[value='PropertyTypes=" + val + "']").show();
                        filters.PropertyTypes.push(val);
                    });
                    $('input[name=Attributes]:checked').each(function () {
                        var val = Number($(this).val());
                        $(".filter-close[value='Attributes=" + val + "']").show();
                        filters.Attributes.push(val);
                    });

                    this.model.attributes.filters = filters;

                    this.showHideAllPods();
                    $("#thinking").hide();

                    //update the contact us links with all the filters that they selected
                    var placeinQueryStr = decodeURI(location.search).match(/Place=[\w\,\.\s\d]+/);
                    $('a[href="/contact-us"]').attr('href', '/contact-us?' + $('#filter-container').serialize() + "&" + placeinQueryStr);
                },
                removeFilter: function (e) {

                    $("#thinking").show();

                    var removeMe = e.currentTarget.value;
                    $('.filter-close[value="' + removeMe + '"]').hide();

                    var filterName = removeMe.split('=')[0];
                    var filterValue = removeMe.split('=')[1];

                    //uncheck the checkbox & remove filter value
                    switch (filterName) {
                        case "IsPetFriendly":
                            $('input[name=IsPetFriendly]:checked').removeAttr('checked');
                            this.model.attributes.filters.IsPetFriendly = false;
                            break;
                        case "PropertyTypes":
                            $('input[name=PropertyTypes]#' + filterValue).removeAttr('checked');
                            filterValue = Number(filterValue);
                            this.model.attributes.filters.PropertyTypes = this.model.attributes.filters.PropertyTypes.filter(function (o) { return filterValue !== o; });
                            break;
                        case "Attributes":
                            $('input[name=Attributes]#' + filterValue).removeAttr('checked');
                            filterValue = Number(filterValue);
                            this.model.attributes.filters.Attributes = this.model.attributes.filters.Attributes.filter(function (o) { return filterValue !== o; });
                            break;
                    }

                    // hide property pods that don't conform to filters
                    this.showHideAllPods();

                    $("#thinking").hide();

                    //update the contact us links with all the filters that they selected
                    var placeinQueryStr = decodeURI(location.search).match(/Place=[\w\,\.\s\d]+/);
                    $('a[href="/contact-us"]').attr('href', '/contact-us?' + $('#filter-container').serialize() + "&" + placeinQueryStr);
                },
                processForm: function (formValues) {

                    $('#extra-results-intro').hide();
                    $('#partial-results-only-intro').hide();
                    $("#no-results").hide();
                    $("#thinking").show();

                    formValues = formValues.replace('\?', '');

                    var priceMin = $('#RangeSlider .noUi-handle.noUi-handle-lower .noUi-tooltip').text().replace("$", "");
                    if (priceMin != "") formValues += "&PriceMin=" + priceMin;

                    var priceMax = $('#RangeSlider .noUi-handle.noUi-handle-upper .noUi-tooltip').text().replace("$", "");
                    if (priceMax != "") formValues += "&PriceMax=" + priceMax;

                    var url = (location.pathname + "?" + formValues).replace(/\?+/, '?').replace(/\&+/, '&');

                    window.history.pushState("object or string", "Title", url);

                    this.model.fetch({
                        success: this.render,
                        error: this.renderError
                    });
                },
                cleanModel: function (data, status) {
                    var dateStr = this.model.attributes.ArrivalDate;
                    var selectedRoomTypeModel = [];
                    var selectedRoomType = $("#filter-container #RoomType option:selected");

                    dateStr = dateStr.replace(/[/\(\)]/g, '').replace('Date', '');

                    this.model.attributes.ArrivalDate = new Date(Number(dateStr)).toISOString().slice(0, 10);

                    dateStr = this.model.attributes.DepartureDate;
                    dateStr = dateStr.replace(/[/\(\)]/g, '').replace('Date', '');

                    this.model.attributes.DepartureDate = new Date(Number(dateStr)).toISOString().slice(0, 10);

                    this.model.attributes.ShowInstantBook = false;
                    this.model.attributes.ShowSpecials = false;

                    this.model.attributes.Price.CurrencyCode = CurrencyUtil.convert(this.model.attributes.Price.CurrencyCode);

                    for (var i = 0; i < this.model.attributes.PropertyResults.length ; i++) {
                        var item = this.model.attributes.PropertyResults[i];
                        this.model.attributes.PropertyResults[i] = this.formatPropertyCard(item);
                        if (item.MinLOS > this.model.attributes.LengthOfStay)
                            this.model.attributes.PropertyResults[i].IsRealTimeBookable = false;
                        if (item.MinLead > this.model.attributes.Lead)
                            this.model.attributes.PropertyResults[i].IsRealTimeBookable = false;
                    }
                    this.model.attributes.PropertyResults = _(this.model.attributes.PropertyResults)
                        .chain()
                        .sortBy(function (o) {
                            return o.DistanceFromPoint;
                        })
                        .sortBy(function (o) {
                            var rank = o.IsRealTimeBookable ? 0 : 1;
                            return rank;
                        })
                        .sortBy(function (o) {
                            var rank = 2;
                            if (o.IsSpecial && o.IsFeatured) rank = 0;
                            else if (o.IsFeatured || o.IsSpecial) rank = 1;
                            return rank;
                        })
                        .value();

                    for (var i = 0; i < this.model.attributes.PartialMatchPropertyResults.length ; i++) {
                        var item = this.model.attributes.PartialMatchPropertyResults[i];
                        this.model.attributes.PartialMatchPropertyResults[i] = this.formatPropertyCard(item);
                        if (item.MinLOS > this.model.attributes.LengthOfStay)
                            this.model.attributes.PartialMatchPropertyResults[i].IsRealTimeBookable = false;
                        if (item.MinLead > this.model.attributes.Lead)
                            this.model.attributes.PartialMatchPropertyResults[i].IsRealTimeBookable = false;
                    }
                    this.model.attributes.PartialMatchPropertyResults = _(this.model.attributes.PartialMatchPropertyResults)
                        .chain()
                        .sortBy(function (o) {
                            return o.DistanceFromPoint;
                        })
                        .sortBy(function (o) {
                            var rank = o.IsRealTimeBookable ? 0 : 1;
                            return rank;
                        })
                        .sortBy(function (o) {
                            var rank = 2;
                            if (o.IsSpecial && o.IsFeatured) rank = 0;
                            else if (o.IsFeatured || o.IsSpecial) rank = 1;
                            return rank;
                        })
                        .value();

                    if (selectedRoomType.attr('value')) {
                        _.each(this.model.attributes.Size.RoomTypes, function(roomtype) {
                            if (roomtype.Value === selectedRoomType.attr('value')) {
                                roomtype.Selected = true;
                            } else {
                                roomtype.Selected = false;
                            }

                            selectedRoomTypeModel.push(roomtype);
                        });

                        if (selectedRoomTypeModel.length) {
                            this.model.attributes.Size.RoomTypes = selectedRoomTypeModel;
                        }
                    }

                },

                formatPropertyCard: function (item) {
                    if (item.MinRate > 0) {
                        item.MinRate = CurrencyUtil.formatCurrency(item.MinRate);
                        item.CurrencyCode = CurrencyUtil.convert(item.CurrencyCode);
                    }
                    if (item.IsRealTimeBookable) this.model.attributes.ShowInstantBook = true;
                    if (item.IsSpecial) this.model.attributes.ShowSpecials = true;

                    item.URL += location.search;
                    return item;
                },
                loadTemplates: function () {
                    $("#thinking").hide();

                    var mobileIntro = "Results for properties in " + this.model.attributes.Place +
                        " from " + this.fromUrlDate(this.model.attributes.ArrivalDate) +
                        " through " + this.fromUrlDate(this.model.attributes.DepartureDate);

                    var selRmType = _.find(this.model.attributes.Size.RoomTypes, function (x) {
                        if (x.Selected == true)
                            return x;
                    });
                    selRmType = selRmType == undefined ? 0 : selRmType.Value;

                    if (selRmType == 0) mobileIntro += " with a studio unit.";
                    if (selRmType == 1) mobileIntro += " with one bedroom.";
                    if (selRmType > 1) mobileIntro += " with " + selRmType + " bedrooms.";

                    $('#filter-container p#intro').text(mobileIntro);

                    var filterTmpl1 = $("#top-filter-template").html();
                    var template1 = _.template(filterTmpl1);
                    this.$el.find('#top-filter').html(template1(this.model.attributes));

                    var filterTmpl2 = $("#bottom-filter-template").html();
                    var template2 = _.template(filterTmpl2);
                    this.$el.find('#bottom-filter').html(template2(this.model.attributes));

                    $('.filter-close').hide();

                    var gridTmpl = $("#grid-template").html();
                    var gridtemplate = _.template(gridTmpl);
                    this.$el.find('#full-match').html(gridtemplate({
                        'PropertyList': this.model.attributes.PropertyResults,
                        'PlaceName': this.model.attributes.Place
                    }));

                    var pmGridTmpl = $("#grid-template").html();
                    var pmGridtemplate = _.template(pmGridTmpl);
                    this.$el.find('#partial-match').html(pmGridtemplate({
                        'PropertyList': this.model.attributes.PartialMatchPropertyResults,
                        'PlaceName': this.model.attributes.Place
                    }));

                    //update the contact us links with all the filters that they selected
                    var placeinQueryStr = decodeURI(location.search).match(/Place=[\w\,\.\s\d]+/);
                    $('a[href="/contact-us"]').attr('href', '/contact-us?' + $('#filter-container').serialize() + "&" + placeinQueryStr);

                    if (this.model.attributes.PropertyResults.length > 0 && this.model.attributes.PartialMatchPropertyResults.length > 0) {
                        $('#extra-results-intro').show();
                    }
                    else if (this.model.attributes.PartialMatchPropertyResults.length > 0) {
                        $('#partial-results-only-intro').show();
                    } else if (this.model.attributes.PropertyResults.length == 0) {
                        $("#no-results").show();
                    }
                },
                render: function (data, status) {
                    this.cleanModel(data, status);
                    this.loadTemplates();

                    BSuicomponents.initSearchPageUIComponents();
                    BSuicomponents.initRangeSliderComponent(this);

                    if (
                        this.model.attributes.PropertyResults.length == 0 &&
                        this.model.attributes.PartialMatchPropertyResults.length == 0
                        ) {
                        BSmapview.drawEmptyMap(this.model.attributes.Latitude, this.model.attributes.Longitude);

                    } else {
                        var allProps = this.model.attributes.PropertyResults.concat(this.model.attributes.PartialMatchPropertyResults);
                        BSmapview.drawMarkers(allProps, true);

                        var mapBoundProperties = _.sortBy(allProps, function (o) { return o.DistanceFromPoint; });
                        BSmapview.zoomInOn(allProps.splice(0, 15));
                    }

                    DOMUtils.resizeForOldBrowsers();
                },
                renderError: function (data, status) {
                    console.log(status.responseText);
                    dfd.reject("sorry");
                },
                onModelChangeCallback: function(model) {
                    this.model.set(model.attributes);
                },
                onSearchCallback: function() {
                    //TODO: apply filters
                    var searchUrl = '/Search?Latitude=' + this.model.attributes.Latitude +
                        '&Longitude=' + this.model.attributes.Longitude +
                        '&ArrivalDate=' + this.model.attributes.ArrivalDate +
                        '&DepartureDate=' + this.model.attributes.DepartureDate +
                        '&Adults=' + this.model.attributes.Adults +
                        '&Children=' + this.model.attributes.Children +
                        '&RoomType=' + this.model.attributes.RoomType +
                        '&Place=' + this.model.attributes.Place;

                    document.location.href = searchUrl;
                },
                fromUrlDate: function (dateStr) {
                    var bits = dateStr.split('-');
                    return bits[1] + "/" + bits[2] + "/" + bits[0];
                },
                showHideAllPods: function () {

                    $('#extra-results-intro').hide();
                    $('#partial-results-only-intro').hide();
                    $("#no-results").hide();
                    $('.property-pod').show();

                    // hide property pods that don't conform to filters
                    for (var i = 0; i < this.model.attributes.PropertyResults.length; i++) {
                        var prop = this.model.attributes.PropertyResults[i];
                        this.showHidePod(prop);
                    }

                    for (var i = 0; i < this.model.attributes.PartialMatchPropertyResults.length; i++) {
                        var prop = this.model.attributes.PartialMatchPropertyResults[i];
                        this.showHidePod(prop);
                    }

                    var partialMatchCount = $('#partial-match .property-pod:visible').length;
                    var exactMatchCount = $('#full-match .property-pod:visible').length;

                    if (exactMatchCount > 0 && partialMatchCount > 0) {
                        $('#extra-results-intro').show();
                    }
                    else if (partialMatchCount > 0) {
                        $('#partial-results-only-intro').show();
                    } else if (exactMatchCount == 0) {
                        $("#no-results").show();
                    }
                },
                showHidePod: function (prop) {
                    var propPod = $('.property-pod#' + prop.PropertyId);
                    BSmapview.enableMarker(prop);

                    var filters = this.model.attributes.filters;

                    if (filters.IsPetFriendly && !prop.IsPetFriendly) {
                        propPod.hide();
                        BSmapview.disableMarker(prop);
                        //console.log(prop.Name + ' is not pet friendly');
                    }
                    else if (filters.PropertySepecial && !prop.PropertySepecial) {
                        propPod.hide();
                        BSmapview.disableMarker(prop);
                        //console.log(prop.Name + ' is not special');
                    }
                    else if (filters.IsRealTimeBookable && !prop.IsRealTimeBookable) {
                        propPod.hide();
                        BSmapview.disableMarker(prop);
                        //console.log(prop.Name + ' is not RTB');
                    }
                    else if (filters.PropertyTypes.length > 0 && !_.contains(filters.PropertyTypes, prop.PropertyType)) {
                        propPod.hide();
                        BSmapview.disableMarker(prop);
                        //console.log(prop.Name + ' is not in property types ' + filters.PropertyTypes);
                    }
                    else if (filters.Attributes.length > 0) {
                        for (var j = 0; j < filters.Attributes.length; j++) {
                            var attr = filters.Attributes[j];
                            if (!_.contains(prop.Attributes, attr)) {
                                propPod.hide();
                                BSmapview.disableMarker(prop);
                                //console.log(prop.Name + ' does not have attribute #' + attr);
                                break;
                            }
                        }
                    } else if (prop.MinRate > 0) {
                        if (prop.MinRate < filters.PriceMin || prop.MinRate > filters.PriceMax) {
                            propPod.hide();
                            BSmapview.disableMarker(prop);
                        }
                    }
                },

                initializeTopSearch: function() {
                    BSTopSearch.init(this.model, this.onModelChangeCallback.bind(this), this.onSearchCallback.bind(this));
                }
            });

            this.searchModel = new Model();
            this.searchView = new View({ model: this.searchModel, tagName: "form", el: $("#filter-container") });

            this.searchModel.on('sync', (function (event) {
                this.searchModel.off('sync')
                this.searchView.initializeTopSearch();
            }).bind(this));

            return dfd.promise();
        },
        getExactMatches: function () {
            return this.searchModel.attributes.PropertyResults;
        },
        getFuzzyMatches: function () {
            return this.searchModel.attributes.PartialMatchPropertyResults;
        },
        getPriceRange: function () {
            return this.searchModel.attributes.Price;
        }
    };

    module.exports = searchfilter || window.searchfilter;

})();

