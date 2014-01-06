;(function($) {

  function cssAnimateAuto(element, options, callback) {

    var $el = $(element),
        settings = $.extend({}, $.fn.cssAnimateAuto.defaults, options),
        dimension = settings.transition.split(' ')[0],
        oppositeDimension = (dimension === 'height') ? 'width' : 'height';

    // Determine which function to run based on the setting `action`.
    switch (settings.action) {
      case ('open'):
        openEl($el);
        break;
      case ('close'):
        closeEl($el);
        break;
      case ('toggle'):
        toggleEl($el);
        break;
      default:
        throw new Error('jquery.cssAnimateAuto only performs the actions "open", "close" and "toggle". You seem to have tried something else.');
    }

    function createTransition($el, stuffToDo) {
      // Create the transition (here in JS instead of in the CSS
      // so it can easily be removed here in JS).
      // jQuery will provide the requisite vendor prefixes.
      $el.css('transition', settings.transition)
        .one('transitionend webkitTransitionEnd', function(e) {
          if (e.originalEvent.propertyName === dimension) {
            removeTransition($el);
            stuffToDo();
            callback();
          }
        })
        .data('transitioning', true);
    }

    function removeTransition($el) {
      $el.css('transition', '')
        .data('transitioning', false);
    }

    function getTargetDimension($el) {
      // Create a hidden clone of $el, appended to
      // $el's parent and with $el's `oppositeDimension`,
      // to ensure it will have dimensions tailored to
      // $el's context.
      // Return the clone's relevant dimension.
      var $clone = $el.clone()
        .css({
          oppositeDimension: $el.css(oppositeDimension),
          'visibility': 'hidden'
        })
        .appendTo($el.parent());
      var cloneContentDimension = $clone
        .css(dimension, 'auto')
        .css(dimension);
      $clone.remove();
      return cloneContentDimension;
    }

    function openEl($el) {
      // If el is not already open ...
      if (!$el.hasClass(settings.openClass)) {
        // Create a transition, set a one-time event
        // for the transition's end, then change
        // the dimension.
        createTransition($el, function(e) {
          $el.css(dimension, 'auto');
          $el.addClass(settings.openClass);
        });
        $el.css(dimension, getTargetDimension($el));
      }
    }

    function closeEl($el) {
      // Set the dimension to a number (it's current state
      // is probably `auto`); then create a transition,
      // set what to do when the transition ends, and
      // change the dimension.
      $el.css(dimension, $el.css(dimension));
      $el[0].offsetHeight; // force repaint (http://n12v.com/css-transition-to-from-auto/)
      createTransition($el, function(e) {
        $el.removeClass(settings.openClass);
      });
      $el.css(dimension, '');
    }

    function toggleEl($el) {
      if ($el.hasClass(settings.openClass))
        closeEl($el);
      else
        openEl($el);
    }
  }

  function processArgs() {
    // Arguments can be passed in any order.
    // The options `transition` and `action` can also
    // be passed as isolated strings.
    var options = {},
        callback = function(){},
        l = arguments.length;
    for (var i = 0; i < l; i++) {
      var arg = arguments[i],
          argType = typeof arg;
      if (!arg)
        continue;
      switch (argType) {
        case ('string'):
          if (arg === 'open' || arg === 'close' || arg === 'toggle') {
            $.extend(options, { action: arg });
            continue;
          } else {
            var dimension = arg.split(' ')[0];
            if (dimension === 'height' || dimension === 'width') {
              $.extend(options, { transition: arg });
            } else {
              throw new Error('jquery.cssAnimateAuto doesn\'t know what to do with your argument "' + arg + '"');
            }
          }
          continue;
        case ('function'):
          callback = arg;
          continue;
        case ('object'):
          $.extend(options, arg);
          continue;
      }
    }
    return [options, callback];
  }

  $.fn.cssAnimateAuto = function() {
    var argsArray = processArgs.apply(this, arguments);
    return this.each(function () {
      // If element is already transitioning, ignore.
      if ($(this).data('transitioning'))
        return;
      cssAnimateAuto.apply(null, [this].concat(argsArray));
    });
  };

  $.fn.cssAnimateAuto.defaults = {
    transition: 'height 0.3s', // any CSS transition (shorthand) prop
    action: 'toggle', // or 'open' or 'close'
    openClass: 'is-opened'
  };

})(jQuery);