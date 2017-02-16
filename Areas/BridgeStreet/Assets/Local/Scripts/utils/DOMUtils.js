(function(window) {

    'use strict';

    var comparator = {

        '<': function (a, b) { return a < b; },

        '<=': function (a, b) { return a <= b; },

        '>': function (a, b) { return a > b; },

        '>=': function (a, b) { return a >= b; }

    }    

    window.DOMUtils = function(selector, context) {

        return new DOMUtils.query(selector, context);

    };

    DOMUtils.extend = function() {

        var target = this, key, count = 0;

        if (arguments.length > 1) {

            target = arguments[0];

            count = 1;

        }

        for (count; count < arguments.length; count++) {

            for (key in arguments[count]) {

                if (arguments[count].hasOwnProperty(key)) {

                    target[key] = arguments[count][key];

                }

            }

        }

        return target;
    };

    DOMUtils.extend({

        ready: function(func) {

            if (typeof func === 'function') {

                window.addEventListener('load', func);

            }

        },

        each: function(object, callback) {
            
            // Stop if no object or callback given.
            if (!object || !callback) {

                return false;

            }

            for (var i = 0; i < object.length; i++) {

                callback.call(object[i], i);

            }

            return this;

        },

        query: function(selector, context) {

            // If no context is given then use document.
            context = context || document;

            // Stop if no selector or blank selector found.
            if (!selector || selector === "") {

                return false;

            }

            // Return selector if is already a DOM instance.
            if (selector instanceof DOMUtils) {

                return selector;

            }

            // If the selector is a single node then return it.
            if (selector.nodeType === 1 || selector.nodeType === 9) {

                this[0] = selector;

                this.length = 1;

                return this;

            }

            [].push.apply(this, context.querySelectorAll(selector));

            return this;

        },

        isNull: function (element) {

            return element === null;

        },

        isUndefined: function (element) {

            return element === void 0;

        },

        isElement: function (element) {

            if (typeof HTMLElement === 'object') {

                return element instanceof HTMLElement;

            }

            return element && typeof element === 'object' && element.nodeType === 1 && typeof element.nodeName === 'string';

        },

        isNode: function (node) {

            if (typeof Node === 'object') {

                return node instanceof Node;

            }

            return node && typeof node === 'object' && typeof node.nodeType === 'number' && typeof node.nodeName === 'string';

        },

        isObj: function (obj) {

            return obj === Object(obj);

        },

        isNumber: function (num) {

            return !isNaN(parseFloat(num)) && isFinite(num);

        },

        isFunction: function (value) {    // fallback check is for IE

            return toString.call(value) === '[object Function]' || typeof value === 'function';

        },


        // Arithmetic checks
        /* -------------------------------------------------------------------------- */
        random: function () {

            return Math.random();

        },

        // Array utils
        /* -------------------------------------------------------------------------- */
        is_arr: function (arr) {

            return typeof (arr) == 'object' && (arr instanceof Array);

        },

        // Mobile device detection
        /*--------------------------------------------------------------------------- */


        compareVersion: function (version, range) {

            var string = (range + '');

            var n = +(string.match(/\d+/) || NaN);

            var op = string.match(/^[<>]=?|/)[0];

            return comparator[op] ? comparator[op](version, n) : (version == n || n !== n);

        },

        uAgent: function () {
            return (navigator && navigator.userAgent || '').toLowerCase();
        },

        appVersion: function () {

            return (navigator && navigator.appVersion || '').toLowerCase();

        },

        is_tablet: function () {

            return  this.androidTablet() ||

                    this.ipad() ||

                    this.windowsTablet();
        },

        ipad : function(range) {

            var match = this.uAgent().match(/ipad.+?os (\d+)/);

            return match !== null && this.compareVersion(match[1], range);
        
        },       

        androidTablet : function() {

            return /android/.test(this.uAgent()) && !/mobile/.test(this.uAgent());
        
        },  

        windowsTablet : function() {
           
            return this.windows() && !this.is_windowsPhone() && /touch/.test(this.uAgent());
        
        },      

        is_tabletSize : function () {

            return ((window.innerWidth >= 768) && (window.innerWidth < 1025)) ? true : false;

        },      


        is_mobile: function () {


            return this.is_iphone() ||

                   this.is_ipod() ||

                   this.is_androidPhone() ||

                   this.is_blackberry() ||

                   this.is_windowsPhone() ||

                   this.is_mobileSize();

        },

        is_iphone: function (range) {

            var match = this.uAgent().match(/iphone(?:.+?os (\d+))?/);

            return !!match && this.compareVersion(match[1] || 1, range);

        },

        is_ipod: function (range) {

            var match = this.uAgent().match(/ipod.+?os (\d+)/);

            return !!match && this.compareVersion(match[1], range);

        },

        is_androidPhone: function () {

            return /android/.test(this.uAgent()) && /mobile/.test(this.uAgent());

        },

        is_blackberry: function () {

            return /blackberry/.test(this.uAgent()) || /bb10/.test(this.uAgent());

        },

        windows: function () {

            return /win/.test(this.appVersion());

        },

        is_windowsPhone: function () {

            return this.windows() && /phone/.test(this.uAgent());

        },

        is_mobileSize: function () {

            return (window.innerWidth) < 768 ? true : false;

        },

        // Array utils
        /* ----------------------------------------------------------------------------- */

        emptyArray: function (arr) {

            for (var i = arr.length; i > 0; i--) {

                arr.pop();

            }

            arr.length = 0;
        },

        shuffle: function (array) {

            var arrLength = array.length;

            for (var i = 0; i < arrLength; i++) {

                var random = arrLength * this.random() | 0;

                if (random == i) { continue; }

                var newArrElement = array[random];

                array[random] = array[i];

                array[i] = newArrElement;

            }

            return array;
        },

        transformToArray: function (parameters) {

            var params = {};

            var arr = parameters.split("&");

            for (var i = 0; i < arr.length; i++) {

                var newArr = arr[i].split("=");

                params[newArr[0]] = newArr[1];

            }

            return params;

        },


        // String utils
        /* -------------------------------------------------------------------------- */
        capitaliseFirst: function (string) {

            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

        },

        capitaliseAllWords: function (str) {

            str = str.toLocaleLowerCase();

            var pieces = str.split(" ");

            for (var i = 0; i < pieces.length; i++) {

                var j = pieces[i].charAt(0).toUpperCase();

                pieces[i] = j + pieces[i].substr(1);

            }

            return pieces.join(" ");

        },

        searchWord: function (word, string) {

            word = word.toLowerCase();

            string = string.toLowerCase();

            var result = string.search(word);

            if (result == -1)

                return false;

            else

                return true;

        },

        stripCharacters : function(string) {

            return string.replace(/\D/g,'');

        },

        // Timer utils
        /* -------------------------------------------------------------------------- */

        debounce: function (func, wait, immediate) {

            var timeout;

            return function () {

                var context = this, args = arguments;

                var later = function () {

                    timeout = null;

                    if (!immediate) func.apply(context, args);

                };

                var callNow = immediate && !timeout;
                
                clearTimeout(timeout);

                timeout = setTimeout(later, wait);

                if (callNow) func.apply(context, args);

            };
        },

        throttle: function (delay, fn) {

            var last, deferTimer;

            return function () {

                var context = this, args = arguments, now = +new Date;

                if (last && now < last + delay) {

                    clearTimeout(deferTimer);

                    deferTimer = setTimeout(function () { last = now; fn.apply(context, args); }, delay);

                }

                else {

                    last = now;

                    fn.apply(context, args);

                }
            };
        },


        // URL utils
        /* -------------------------------------------------------------------------- */

        getURLInformation : function() {

            var location = window.location;

            return {

                protocol : location.protocol,

                host     : location.host,

                hostname : location.hostname,

                port     : location.port,

                pathname : location.pathname

            }

        },

        getParameterByName: function (name) {

            var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);

            return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
        },

        getQueryParams: function (string) {

            if (_.isEmpty(app.utils.getParameterByName(string))) return false;

            return app.utils.getParameterByName(string);

        },

        getAllQueryParams: function () {

            var string = window.location.search.substr(1);

            return string != null && string != "" ? app.utils.transformToArray(string) : {};

        },

        vendor_prefix: function () {

            var prefix;

            var styles = window.getComputedStyle(document.documentElement, '');

            prefix = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o']))[1];

            return prefix;
        },

        numberWithCommas : function(x) {

            var parts = x.toString().split(".");

            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            return parts.join(".");

        },

        // Map utils
        /* -------------------------------------------------------------------------- */

        // defines the SVG paths
        mapMarkerPath : function () {
            return "M19.2,0C8.7,0,0.1,8.3,0,18.5c0,4.2,1.3,8,3.7,11.1l15,18.4l15.4-18.4c2.4-3.1,3.9-6.9,3.9-11.1C38.1,8.3,29.7,0,19.2,0z   M19,26.2c-4,0-7.2-3.2-7.2-7.2s3.2-7.2,7.2-7.2s7.2,3.2,7.2,7.2S23,26.2,19,26.2z";
        },

        //Sytles the look for the new map marker
        newMarkerImage: function () {
            var mapMarkerPath = DOMUtils.mapMarkerPath();
            return {

                path: mapMarkerPath,

                fillColor: '#024',

                fillOpacity: 1,

                strokeColor: '#fff',

                strokeWeight: 2,

                scale: 0.75,

                anchor: new google.maps.Point(19, 47)
            };
        },

        //Sytles the look for the hover state for new map marker
        markerImageHover: function () {
            var mapMarkerPath = DOMUtils.mapMarkerPath();
            return {

                path: mapMarkerPath,

                fillColor: "#FF6600",

                fillOpacity: 1,

                strokeColor: '',

                strokeWeight: 0,

                scale: 0.75,

                anchor: new google.maps.Point(19, 47)
            };
        },

        //Scroll to an id from hash but offset by the height of the fixed seach bar
        scrollPageToId: function () {
            var scrollId = DOMUtils.getParameterByName("scrollLoc");
            var scrollElem = $("#" + scrollId);
            if (scrollId != null && scrollElem.length) {
                var searchHeight = $(".sticky-header").height() + 20;
                var scrollLocation = scrollElem.offset().top - searchHeight;
                setTimeout(function () {
                    TweenMax.to(window, 1, { scrollTo: { y: scrollLocation, x: 0 } });
                }, 1000)
                
            }
        },

        fitToPlaceholder: function (id) {
            var $control = $("#"+id);

            var pxPerLetter = 7;
            var fullTextLength = ($control.attr('data-value-large').length + 1);
            var placholderWidth = fullTextLength * pxPerLetter;
            var controlWidth = $control.width();

            var attr = (placholderWidth < controlWidth) ? 'data-value-large' : 'data-value-small';
            var placeholderText = $control.attr(attr);
            $control.attr('placeholder', placeholderText);            
        },
        resizeForOldBrowsers: function () {

            if (navigator.userAgent.match(/8[.\d]+ Safari/)) {
                $('.property-pod').matchHeight();
                $(window).on('resize', { self: this }, function () {
                    $('.property-pod').matchHeight();
                });
            }
        }

    });

    DOMUtils.query.prototype = DOMUtils.prototype;    

    module.exports = window.DOMUtils;

})(window);
   