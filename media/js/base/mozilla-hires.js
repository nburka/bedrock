/**
 * Utility class for high-resolution detection and display
 *
 * This code is licensed under the Mozilla Public License 1.1.
 *
 * @copyright 2013 Mozilla Foundation
 * @license   http://www.mozilla.org/MPL/MPL-1.1.html Mozilla Public License 1.1
 * @author    Nick Burka <nick@silverorange.com>
 */

$(document).ready(function() {
    Mozilla.Hires.initHiresImages();
});

// create namespace
if (typeof Mozilla == 'undefined') {
    var Mozilla = {};
}

// {{{ Mozilla.Hires

/**
 * Hires object
 */
Mozilla.Hires = function()
{
}

Mozilla.Hires.is_high_dpi = null;

// }}}
// {{{ initHiresImages()

Mozilla.Hires.initHiresImages = function()
{
    $('img[src=""][data-src][data-hires="true"]').each(function() {
        var src = $(this).data('src');
        if (Mozilla.Hires.isHighDpi()) {
            src = Mozilla.Hires.convertUrlToHires(src);
        }

        this.src = src;
    });
};

// }}}
// {{{ isHighDpi()

Mozilla.Hires.isHighDpi = function()
{
    if (Mozilla.Hires.is_high_dpi !== null) {
        return Mozilla.Hires.is_high_dpi;
    }

    var media_query = '(-webkit-min-device-pixel-ratio: 1.5),' +
                      '(-o-min-device-pixel-ratio: 3/2),' +
                      '(min--moz-device-pixel-ratio: 1.5),' +
                      '(min-resolution: 1.5dppx)';

    Mozilla.Hires.is_high_dpi = (window.devicePixelRatio > 1 ||
           (window.matchMedia && window.matchMedia(media_query).matches));

    return Mozilla.Hires.is_high_dpi;
};

// }}}
// {{{ convertUrlToHires()

Mozilla.Hires.convertUrlToHires = function(url)
{
    var i = url.lastIndexOf('.');
    var base = url.substring(0, i);
    var ext = url.substring(i);
    return base + '-hires' + ext;
};

// }}}
