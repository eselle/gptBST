var bsh = bsh || {};

bsh.propertySearch = (function ($, constants, utils) {
    var pub = {};

    pub.init = function (searchContainerClass, searchPageUrl) {
        var $searchContainerClass = $(searchContainerClass);

        // Wire the ability Show/Hide if this is the search overlay
        if (isSearchOverlay) {
            $('.searchbox-form').click(function () {
                $searchContainerClass.toggle();
            });
        }

        var $searchinputBox = $searchContainerClass.find('.search-text-input');
        var $searchButton = $searchContainerClass.find('.searchbox-form');

        var searchButtonClicked = function () {
            var searchKeywords = $searchinputBox.val();

            if (searchKeywords.trim()) {
                // Get the current query string
                var currentQueryString = window.location.search;

                // Get the current hash
                var currentHashString = window.location.hash;

                // Remove current model if it exists
                var newQueryString = utils.updateQueryStringParameter(currentQueryString, constants.QueryStrings.Page, '1');

                // Add in new search term
                newQueryString = utils.updateQueryStringParameter(newQueryString, constants.QueryStrings.SearchTerm, searchKeywords);

                // Assemble the search url
                var searchUrl = searchPageUrl + newQueryString + currentHashString;

                // Redirect to the search url
                window.location.assign(searchUrl);
            }
            else {
                var searchParent = $searchinputBox.parent();
                if (!searchParent.hasClass('has-error')) {
                    $searchinputBox.parent().addClass('has-error');
                }
            }
        };

        // Submit search on click
        $searchButton.click(function () {
            searchButtonClicked();
        });

        // Submit search on entry key
        $searchinputBox.keyup(function (e) {
            if (e.which === adi.constants.Keys.Enter) {
                searchButtonClicked();
            }
        });
    };

    return pub;
}(jQuery, bsh.constants, bsh.utils));