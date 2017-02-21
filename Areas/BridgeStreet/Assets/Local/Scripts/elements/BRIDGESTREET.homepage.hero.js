(function () {

    var $window = $(window);
    var homepagehero = {

        init : function () {

            if ($('.homepage-hero').length == 0) return;

                throttleTimeout = 500,


                this.homepageHero = jQuery('.homepage-hero');

                this.videoContainer = jQuery('.full-video-container').add('.split-video-container');

                this.heroBackground = jQuery('.hero-background');


                $window.on('resize', { self: this }, this._onResize);

                $window.trigger('resize');



                TweenMax.from(jQuery('.hero-messaging'), 0.5, {opacity:0, y: 30, delay:1}, 0.2);  


        },

        _onResize : function (event) {

            if(!DOMUtils.isUndefined(event.data)) {

                var self = event.data.self;
                var homeHeroHomepage = jQuery(window).height() - jQuery('.alt-header').height();

                self.homepageHero.css('height', homeHeroHomepage);

                if (DOMUtils.is_mobile() || DOMUtils.is_tabletSize()) {
                    self.videoContainer.css('display', 'none');
                    self.heroBackground.css('display', 'block');
                } else {
                    self.videoContainer.css('display', 'block');
                    self.heroBackground.css('display', 'none');
               }
            }      

        },

        _setVideo : function () {

            var video = document.getElementsByTagName('video')[0];

            var videoButton = document.getElementsByClassName('video-btn')[0];

            var videoCloseButton = document.getElementsByClassName('full-video-close-button')[0];

            videoButton.addEventListener("click", this._play, false);

            videoCloseButton.addEventListener("click", this._stop, false);

        },

        _play : function () {

            var video = document.getElementsByTagName('video')[0];

            var videoContainer = document.getElementsByClassName('full-video-container')[0];

            jQuery('.full-video-container').addClass('visible');

            video.play();

        },

        _stop : function () {

            var video = document.getElementsByTagName('video')[0];

            var videoContainer = document.getElementsByClassName('full-video-container')[0];

            jQuery('.full-video-container').removeClass('visible');

            video.pause();

            video.currentTime = 0;            
        }		

    }

    module.exports = homepagehero || window.homepagehero;

})();