// create namespace
if (typeof Mozilla == 'undefined') {
  var Mozilla = {};
}

Mozilla.Modal = (function(w, $) {
  'use strict';

  var open = false;
  var $modal = null;
  var $body = $('body');
  var options = {};
  var $d = $(w.document);
  var evtNamespace = 'moz-modal';

  var $_content_parent;
  var $_content;

  /*
    origin: element that triggered the modal
    content: content to display in the modal
    options: object of optional params:
      onCreate: function to fire after modal has been created
      onDestroy: function to fire after modal has been closed
      allowScroll: boolean - allow/restrict page scrolling when modal is open
  */
  var _create_modal = function(origin, content, opts) {
    options = opts;

    // Make sure modal is closed (if one exists)
    if (open) {
        _close_modal();
    }

    // Create new modal
    if (typeof window.trans == "undefined") {
        var close_text = 'Close'; // works on older pages on the site
    } else {
        //TODO var close_text = window.trans('close');
        var close_text = 'Close';
    }

    var title = (options && options.title) ? options.title : '';

    var html =
        '<div id="modal" role="dialog" aria-labelledby="' + origin.getAttribute('id') + '" tabindex="-1">' +
        '  <div class="window">' +
        '    <div class="inner">' +
        '      <header>' + title + '</header>' +
        '      <button type="button" id="modal-close" class="close">' +
        '        <span class="close-text">' + close_text + '</span>' +
        '      </button>' +
        '    </div>' +
        '  </div>' +
        '</div>';

    if (options && !options.allowScroll) {
        $body.addClass('noscroll');
    }

    // Add modal to page
    $body.append(html);

    $modal = $('#modal');

    $_content = content;
    $_content_parent = content.parent();

    $_content = content;
    $_content_parent = content.parent();
    $("#modal .inner").append(content);
    $_content.addClass('overlay-contents');

    // close modal on clicking close button or background.
    $('#modal-close').click(function (e) {
        _close_modal();
    });

    // close modal on clicking the background (but not bubbled event).
    $('#modal').click(function (e) {
        if (e.target == this) {
            _close_modal();
        }
    });

    $modal.fadeIn('fast', function() {
        $modal.focus();
    });

    // close with escape key
    $d.on('keyup.' + evtNamespace, function(e) {
        if (e.keyCode === 27 && open) {
            _close_modal();
        }
    });

    // prevent focusing out of modal while open
    $d.on('focus.' + evtNamespace, 'body', function(e) {
      // .contains must be called on the underlying HTML element, not the jQuery object
      if (open && !$modal[0].contains(e.target)) {
        e.stopPropagation();
        $modal.focus();
      }
    });

    // remember which element opened the modal for later focus
    $(origin).addClass('modalOrigin');

    open = true;

    // execute (optional) open callback
    if (options && typeof(options.onCreate) === 'function') {
         options.onCreate();
    }
  };

  var _close_modal = function() {
    $('#modal').fadeOut('fast', function() {
        $_content_parent.append($_content);
        $(this).remove();
    });

    // allow page to scroll again
    $body.removeClass('noscroll');

    // restore focus to element that opened the modal
    $('.modalOrigin').focus().removeClass('modalOrigin');

    open = false;
    $modal = null;

    // unbind document listeners
    $d.off('.' + evtNamespace);

    // execute (optional) callback
    if (options && typeof(options.onDestroy) === 'function') {
      options.onDestroy();
    }

    // free up options
    options = {};
  };

  return {
    createModal: function(origin, content, opts) {
        _create_modal(origin, content, opts);
    },
    closeModal: function() {
        _close_modal();
    }
  };
})(window, window.jQuery);
