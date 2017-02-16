(function () {
    var $window = $(window);
    var splitscreen = {

        init : function () {

            if ($('.split-pane').length == 0) return;

            this.setSplitView();

            this.currentState = 1;
    
            $window.on('resize', this._onResize);

   			$window.trigger('resize');
        },

        setListView : function() {

            this.setPosition("0%", "0%", "0%");

            this.getComponentsSizes().first.style.width = "100%";

        },

        setMapView : function () {

            this.setPosition("100%", "10%", "100%");

            jQuery('div.split-pane').trigger('dividerupdate');            

        },

        setSplitView : function () {


            this.setPosition("50%", "50%", "50%");

            this.getComponentsSizes().first.style.width = "50%";

            jQuery('div.split-pane').trigger('dividerupdate');   

        },

        getComponentsSizes : function() {

            return {

                first: jQuery('div.split-pane').children('.property-view')[0],
                
                divider: jQuery('div.split-pane').children('.split-pane-divider')[0],
                
                last: jQuery('div.split-pane').children('.map-view')[0]

            }
        },

        setPosition : function (left, right, w) {

            if(!DOMUtils.isNull(left)) {

                this.getComponentsSizes().first.style.right = left;

            }

            this.getComponentsSizes().divider.style.right = right;

            this.getComponentsSizes().last.style.width = w;

        },

        _onResize : function () {


            if(DOMUtils.is_mobile()) {

                splitscreen.setListView();   

            } else {
                
               if(splitscreen.currentState === 1) splitscreen.setSplitView();

                if(splitscreen.currentState === 2) splitscreen.setMapView();

               jQuery('div.split-pane').trigger('dividerupdate');
               
            }

        },

        setState : function(num, callback){

            $window.trigger('resize');

            this.currentState = num;

            if(_.isFunction(callback)) {

                callback.apply(this);

                if (!DOMUtils.isUndefined(document.getElementsByClassName('property-pod')[0]))  {

                    jQuery.fn.matchHeight._update();

                }                            

            }            

        }


    }

    module.exports = splitscreen || window.splitscreen;

})();
