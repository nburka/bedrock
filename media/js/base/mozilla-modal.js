// create namespace
if (typeof Mozilla == 'undefined') {
    var Mozilla = {};
}

Mozilla.Modal = (function(w, $) {
  'use strict';

  var _open = false;
  var _modal = null;
  var $_body = $('body');
  var _options = {};
  var $_content = null;
  var $_content_parent = null;

  var _init = function() {
    var $d = $(w.document);

    // close on escape
    $d.keyup(function(e) {
      if (e.keyCode === 27 && _open) { // esc
        _close_modal();
      }
    });

    // prevent focusing out of modal while open
    $d.focus(function(e) {
      if (_open && !_modal.contains(e.target)) {
        e.stopPropagation();
        _modal.focus();
      }
    });
  };

  /*
    origin: element that triggered the modal
    content: content to display in the modal
    options: object of optional params:
      onCreate: function to fire after modal has been created
      onDestroy: function to fire after modal has been closed
      allowScroll: boolean - allow/restrict page scrolling when modal is open
  */
  var _create_modal = function(origin, content, options) {
    // Clear existing modal, if necessary,
    $('#modal').remove();
    $('.modalOrigin').removeClass('modalOrigin');

    // Create new modal
    if (typeof(window.trans) == "undefined") {
        var close_text = 'close'; // works on older pages on the site
    } else {
        var close_text = window.trans('close');
    }

    var html = (
        '<div id="modal" role="dialog" aria-labelledby="' + origin.getAttribute('id') + '" tabindex="-1">' +
        '  <div class="inner">' +
        '    <button type="button" id="modal-close" class="close">' +
        '      <span class="close-text">' + close_text + '</span>' +
        '    </button>' +
        '  </div>' +
        '</div>'
    );

    if (options && !options.allowScroll) {
        $_body.addClass('noscroll');
    }

    // Add it to the page.
    $_body.append(html);

    _modal = $('#modal');

    $_content = content;
    $_content_parent = content.parent();
    $("#modal .inner").append(content);

    // close modal on clicking close button or background.
    $('#modal-close').click(function (e) {
        _close_modal();
    });

    _modal.fadeIn('fast', function() {
      $(this).focus();
    });

    // remember which element opened the modal for later focus
    $(origin).addClass('modalOrigin');

    _open = true;

    // execute (optional) open callback
    if (typeof(options.onCreate) === 'function') {
        options.onCreate();
    }

    // store options for later use
    _options = options;
  };

  var _close_modal = function() {
    $('#modal').fadeOut('fast', function() {
        $_content_parent.append($_content);
        $(this).remove();
    });

    $_body.removeClass('noscroll');

    // restore focus to element that opened the modal
    $('.modalOrigin').focus().remove('modalOrigin');

    _open = false;
    _modal = null;

    // execute (optional) callback
    if (options && typeof(_options.onDestroy) === 'function') {
      _options.onDestroy();
    }

    // free up options
    _options = {};
  };

  return {
    init: function() {
      _init();
    },
    create_modal: function(origin, content, options) {
      _create_modal(origin, content, options);
    },
    close_modal: function() {
      _close_modal();
    }
  };
})(window, window.jQuery);

$(document).ready(function() {
  Mozilla.Modal.init();
});
