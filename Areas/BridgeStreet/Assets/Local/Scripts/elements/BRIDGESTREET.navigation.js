(function () {

    var navigation = {

        init: function () {

            if (DOMUtils.isUndefined($('.nav-wrapper')[0])) return; 

                this.slideout = null; 

                DOMUtils.is_mobile() ? this.initSlideOutMenu(263) : this.initSlideOutMenu(500);

                $(window).on('resize', this._onResize);

        },

        initSlideOutMenu : function(num) {

            var self = this;          

            self.slideout = new Slideout({

                'panel': document.getElementsByClassName('page-wrapper')[0],
                
                'menu': document.getElementsByClassName('nav-wrapper')[0],
                
                'padding': num,

                'tolerance': 70,

                'side' : 'right',

                'fx' : 'ease-in-out'

            });   

            jQuery('.desktop-search .js-slideout-toggle').on("click", function(){

                self.slideout.toggle();

            })

            jQuery('.header-alt').find('.js-slideout-toggle').on("click", function(){

                self.slideout.toggle();

            })            
            // document.querySelector('desktop-search.js-slideout-toggle').addEventListener('click', function() {
               
            //     self.slideout.toggle();

            // });

            document.querySelector('.nav-wrapper').addEventListener('click', function(eve) {
                
                if (eve.target.nodeName === 'A') { self.slideout.close(); }

            });  

            self.slideout.on('open', this._onNavigationOpen);

            self.slideout.on('close', this._onNavigationClose);

        },

        _onNavigationOpen : function (event) {

            jQuery('.toggle').addClass('open');
        },

        _onNavigationClose : function (event) {

            jQuery('.toggle').removeClass('open');

        },

        _onResize : function () {

             if(DOMUtils.is_mobile() ){

                navigation.slideout.updateX(263, (navigation.slideout.isOpen()) ? true : false);


             } else {

                navigation.slideout.updateX(500, (navigation.slideout.isOpen()) ? true : false);
             }

        }

    }

    module.exports = navigation || window.navigation;

})();

