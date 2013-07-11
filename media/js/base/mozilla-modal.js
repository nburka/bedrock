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

  /*
    origin: element that triggered the modal
    content: content to display in the modal
    options: object of optional params:
      onCreate: function to fire after modal has been created
      onDestroy: function to fire after modal has been closed
      allowScroll: boolean - allow/restrict page scrolling when modal is open
  */
  var _createModal = function(origin, content, opts) {
    // Make sure modal is closed (if one exists)
    if (open) {
      _closeModal();
    }

    // Create new modal
    if (typeof(window.trans) == "undefined") {
        var close_text = 'close'; // works on older pages on the site
    } else {
        var close_text = window.trans('close');
    }

    var title_text = (typeof options.title == 'string') ? options.title : '';

    var html = (
        '<div id="modal" role="dialog" aria-labelledby="' + origin.getAttribute('id') + '" tabindex="-1">' +
        '  <div class="inner">' +
        '  </div>' +
        '</div>'
    );

    if (options && !options.allowScroll) {
        $_body.addClass('noscroll');
    }

    // Add modal to page
    $body.append(html);

    $modal = $('#modal');

    $_content = content;
    $_content.addClass('modal-contents');
    $_content_parent = content.parent();
    $_content.addClass('overlay-contents');
    $("#modal .inner").append(content);

    // close modal on clicking close button
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

    // close modal on clicking close button
    $d.on('click.' + evtNamespace, '#modal .close', _closeModal);

    // close with escape key
    $d.on('keyup.' + evtNamespace, function(e) {
      if (e.keyCode === 27 && open) {
        _closeModal();
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

    // store options for later use
    options = opts;
  };

  var _closeModal = function() {
    $modal.fadeOut('fast', function() {
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
    if (options && typeof(_options.onDestroy) === 'function') {
      _options.onDestroy();
    }

    // free up options
    options = {};
  };

  return {
    createModal: function(origin, content, opts) {
      _createModal(origin, content, opts);
    },
    closeModal: function() {
      _closeModal();
    }
  };
})(window, window.jQuery);

$(document).ready(function() {
  Mozilla.Modal.init();
});
