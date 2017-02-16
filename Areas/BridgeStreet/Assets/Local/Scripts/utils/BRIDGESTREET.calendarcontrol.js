var BSGlobalSearchGuest = require('../elements/BRIDGESTREET.global.search.guests');

var calendarControl = (function() {

    var insObj = {};   

    return  {
        nr : 0,

		update : function(inst, event) {

            var values = inst.getVal(true),
                
                start = values && values[0],
                
                end = values && values[1];
                
                this.nr = start && end ? Math.max(1, Math.round((new Date(end).setHours(0, 0, 0, 0) - new Date(start).setHours(0, 0, 0, 0)) / 86400000) + 1) : 0;
                
            inst._markup.find('.popup-days-nr').html(this.nr);

            if (start && end && this.nr < 1) {                
                inst._markup.find('.popup-alert').addClass('popup-alert-visible');           
            } else {
                
                inst._markup.find('.popup-alert').removeClass('popup-alert-visible');

                if ( event.active == 'end') {
                    setTimeout(function () 
                    {
                        inst.select();

                        BSGlobalSearchGuest.show();

                    }, 1000);
                }
            }

            inst.position();
            inst.redraw();
		},

        set : function(msInstance) {

            insObj = msInstance;

        },

        setValue : function(start, end) {

            insObj.setVal([new Date(start), new Date(end)], true);

        },
        
        get : function() {

            return insObj;

        },

        getMarkup :  function() {

            return '<div class="popup-alert"><i class="fa fa-exclamation-triangle"></i>The minimum length of stay for this location is 30 days. Please adjust date range or property location.</div><div class="popup-explore"><div class="popup-explore-left"><div class="popup-explore-left-container">Length of stay <span class="popup-days-nr">'+ this.nr +'</span> <span class="pop-days-label">Days</span></div></div><div class="popup-explore-right"></div></div>';                 

        }

    }

})();

module.exports = calendarControl || window.calendarControl;