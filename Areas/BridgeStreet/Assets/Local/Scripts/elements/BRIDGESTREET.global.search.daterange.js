var CalendarUtil = require('../utils/BRIDGESTREET.calendarcontrol.js');

(function () {

    var globalSearchDaterange = {
        desktopRange: null,
        mobileRange: null,
        topSearchRange: null,
        arrival: new Date(),
        departure: new Date(),
        init: function (search) {
            var scope = this;
            if (search.date != null) {
                scope.arrival = search.date.arrival;
                scope.departure = search.date.departure;
            }

            var sharedCalOptions = {
                theme: 'material',
                animate: false,
                min: new Date(),
                weekDays: 'short',
                dayNamesMin: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
                dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                showSelector: false,
                yearChange: false,
                buttons: [],
                defaultValue: [scope.arrival, scope.departure],
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
                onSet: function (event, inst) {
                    // save the date and ensure that the other control is updated
                    scope.arrival = inst._startDate;
                    scope.departure = inst._endDate;

                    if (inst == scope.desktopRange || inst == scope.topSearchRange)
                        scope.mobileRange.setVal([scope.arrival, scope.departure], true);
                    else
                        scope.desktopRange.setVal([scope.arrival, scope.departure], true);
                        scope.topSearchRange.setVal([scope.arrival, scope.departure], true);
                }
            };

            var desktopCalOptions = _.clone(sharedCalOptions);
            desktopCalOptions.display = 'bubble';
            desktopCalOptions.months = 2;
            desktopCalOptions.calendarWidth = 742;

            var mobileCalOptions = _.clone(sharedCalOptions);
            mobileCalOptions.display = 'bottom';
            mobileCalOptions.months = 1;

            var self = this;

            this.desktopRange = mobiscroll.range('#check_in_date', desktopCalOptions);
            this.mobileRange = mobiscroll.range('#check_in_date_mobile', mobileCalOptions);

            setTimeout(function () {
                var topSearchCalOptions = _.clone(desktopCalOptions);

                topSearchCalOptions.startInput = '#topsearch-check_in_date';
                topSearchCalOptions.endInput = '#topsearch-check_out_date';
                self.topSearchRange = mobiscroll.range('#topsearchbox_date_range_target', topSearchCalOptions);
            }, 500, this);

            if (search.date != null && scope.arrival != null && scope.departure != null) {
                this.desktopRange.setVal([scope.arrival, scope.departure], true);
                this.mobileRange.setVal([scope.arrival, scope.departure], true);
                setTimeout(function () {
                    self.topSearchRange.setVal([scope.arrival, scope.departure], true);
                }, 500, this);
            }

            this.initListeners();

            return scope;
        },

        initListeners: function () {
            var scope = this;
            $(window).on('resize', { self: this }, scope.resizeBrowser);
        },

        resizeBrowser: function () {
            if (document.getElementById('check_in_date')) {
                DOMUtils.fitToPlaceholder("check_in_date");
            }
        },
        show: function () {
            if (DOMUtils.is_mobile()) {
                this.mobileRange.show();
            } else {
                if ($('#topsearch-check_in_date').length) {
                    this.topSearchRange.show();
                } else {
                    this.desktopRange.show();
                }
            }
        }
    };

    module.exports = globalSearchDaterange || window.globalSearchDaterange;

})();
