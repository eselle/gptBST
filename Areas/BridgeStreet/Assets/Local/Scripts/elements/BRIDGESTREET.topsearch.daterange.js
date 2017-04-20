var CalendarUtil = require('../utils/BRIDGESTREET.calendarcontrol.js');

(function () {

    var topSearchDaterange = {
        topSearchRange: null,
        arrival: new Date(),
        departure: new Date(),
        init: function (search) {
            if (search.date) {
                var searchArrival = search.date.arrival;
                var searchDeparture = search.date.departure;
                var splittedArrival;
                var splitedDeparture;
                var arrival;
                var departure;

                if (typeof searchArrival === 'string') {
                    splittedArrival = searchArrival.split('-');
                    arrival = new Date(splittedArrival[0], (parseInt(splittedArrival[1]) - 1), splittedArrival[2]);
                } else if (searchArrival instanceof Date) {
                    arrival = searchArrival;
                }

                if (typeof searchDeparture === 'string') {
                    splitedDeparture = searchDeparture.split('-');
                    departure = new Date(splitedDeparture[0], (parseInt(splitedDeparture[1]) - 1), splitedDeparture[2]);
                } else if (searchDeparture instanceof Date) {
                    departure = searchDeparture;
                }

                if (arrival) {
                    this.arrival = arrival;
                }
                if (departure) {
                    this.departure = departure;
                }
            }

            var topSearchCalOptions = {
                theme: 'material',
                months: 2,
                display: 'bubble',
                calendarWidth: 742,
                animate: false,
                min: new Date(),
                weekDays: 'short',
                dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                showSelector: false,
                yearChange: false,
                buttons: [],
                defaultValue: [this.arrival, this.departure],
                onMarkupReady: function (event, inst) {
                    var $ = mobiscroll.$,
                    markup = $(event.target);
                    markup.find('.mbsc-fr-c').append(CalendarUtil.getMarkup());
                    CalendarUtil.set(inst);
                },
                onSetDate: function (event, inst) {
                    if (event.control == 'calendar') {
                        CalendarUtil.update(inst, event);
                    }
                },
                onSet: (function (event, inst) {
                    // save the date and ensure that the other control is updated
                    console.log('ON SET', inst._startDate, inst._endDate);
                    this.arrival = inst._startDate;
                    this.departure = inst._endDate;
                    this.topSearchRange.setVal([this.arrival, this.departure], true);
                }).bind(this)
            };

            topSearchCalOptions.startInput = '#topsearch-check_in_date';
            topSearchCalOptions.endInput = '#topsearch-check_out_date';

            this.topSearchRange = mobiscroll.range('#topsearchbox_date_range_target', topSearchCalOptions);

            if (this.arrival != null && this.departure != null) {
                this.topSearchRange.setVal([this.arrival, this.departure], true);
            }

            this.initListeners();

            return this;
        },

        initListeners: function () {
            $(window).on('resize', { self: this }, this.resizeBrowser);
        },

        resizeBrowser: function () {
            if (document.getElementById('topsearch-check_in_date')) {
                DOMUtils.fitToPlaceholder("topsearch-check_in_date");
            }
        },
        show: function () {
            this.topSearchRange.show();
        }
    };

    module.exports = topSearchDaterange || window.topSearchDaterange;

})();
