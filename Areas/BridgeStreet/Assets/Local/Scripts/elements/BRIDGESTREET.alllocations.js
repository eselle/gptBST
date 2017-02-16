(function () {
    var AllLocations = {
        init: function () {
            var selectedTarget = "#" + $(".tab-pane.active").attr("id");

            jQuery('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

                selectedTarget = jQuery(e.target).attr('data-target');
            });

            jQuery('.locations-filter-list .box a').click(function (evt) {
                evt.preventDefault();

                var hash = this.href;

                var target = hash.split('#')[1];

                topA_offset = 80;

                AllLocations.scrollToSection(target, selectedTarget);
            });

            jQuery('.alphabet-mobile').on("change", function (evt) {

                var target = evt.target.value.split('#')[1];

                topA_offset = 50;

                currentPanel = jQuery('.tab-pane').hasClass('active');

                AllLocations.scrollToSection(target, selectedTarget);
            });

        },

        scrollToSection: function (target, selectedTarget) {
            var topA_offset = 80;
            if (jQuery(selectedTarget).find('*[data-group="' + target + '"]').length) {
                TweenMax.to(window, 1, { scrollTo: { y: jQuery(selectedTarget).find('*[data-group="' + target + '"]').offset().top - topA_offset, x: 0 } });
            }
        }
    };

    module.exports = AllLocations || window.AllLocations;
})();