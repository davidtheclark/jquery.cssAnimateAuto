;(function($) {

  function cssAnimateAuto(element, options, userCallback) {

    var $el = $(element),
        settings = $.extend({}, $.fn.cssAnimateAuto.defaults, options),
        dimension = settings.transition.split(' ')[0],
        oppositeDimension = (dimension === 'height') ? 'width' : 'height',
        transEnd = (document.body.style.webkitTransition) ? 'webkitTransitionEnd' : 'transitionend';

    function isOpen($el) {
      return $el.hasClass(settings.openClass);
    }

    function nm(eventName) {
      // Namespace an event.
      var eName = eventName || '';
      return eName + '.' + settings.eventNamespace;
    }

    function createTransition($el, thingsToDo) {
      // `thingsToDo` is passed by `openEl` and `closeEl`,
      // different for each.

      // `transTime` is used the time the fallback; should be
      // 300ms after the transition should have ended.
      var transTime = 1000 * (parseFloat($el.css('transition-duration'), 10) + parseFloat($el.css('transition-delay'), 10)) + 300;

      function checkTransitionEnd(e) {
        if (e.originalEvent.propertyName === dimension) {
          afterTransition();
        }
      }

      function afterTransition() {
        removeTransition($el);
        thingsToDo();
        userCallback();
        $el.off(nm())
          .data('transitioning', false);
      }

      function fallbackFinisher() {
        if (!$el.data('transitioning')) {
          $el.trigger(nm('fallback'));
        }
      }

      // Create the transition (here in JS instead of in the CSS
      // so it can easily be removed here in JS).
      // jQuery will provide the requisite vendor prefixes.
      $el.css('transition', settings.transition)
        // set listener for transitionend
        .on(nm(transEnd), checkTransitionEnd)
        // set listener for fallback
        .on(nm('fallback'), afterTransition)
        // indicate that transition is in progress
        .data('transitioning', true);

      // Fallback should fire just after transition should have ended;
      // check if transitionend never fired; and if not fire the
      // fallback event.
      setTimeout(fallbackFinisher, transTime);
    }

    function removeTransition($el) {
      $el.css('transition', '');
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
      // Create a transition, with things to do
      // when the transition ends, then change
      // the dimension.
      createTransition($el, function(e) {
        $el.css(dimension, 'auto');
        $el.addClass(settings.openClass);
      });
      $el.css(dimension, getTargetDimension($el));
    }

    function closeEl($el) {
      // Set the dimension to a number (it's current state
      // is probably `auto`); then create a transition,
      // with things to do when the transition ends, and
      // change the dimension.
      $el.css(dimension, $el.css(dimension));
      // force repaint (http://n12v.com/css-transition-to-from-auto/)
      $el[0].offsetHeight = $el[0].offsetHeight;
      createTransition($el, function(e) {
        $el.removeClass(settings.openClass);
      });
      $el.css(dimension, '');
    }

    function toggleEl($el) {
      if (isOpen($el))
        closeEl($el);
      else
        openEl($el);
    }

    // Determine which function to run based on the setting `action`.
    switch (settings.action) {
      case 'open':
        if (!isOpen($el))
          openEl($el);
        break;
      case 'close':
        if (isOpen($el))
          closeEl($el);
        break;
      case 'toggle':
        toggleEl($el);
        break;
      default:
        throw new Error('jquery.cssAnimateAuto only performs the actions "open", "close" and "toggle". You seem to have tried something else.');
    }
  }

  function processArgs() {
    // Arguments can be passed in any order.
    // The options `transition` and `action` can also
    // be passed as isolated strings.
    // This function sorts them out.
    var options = {},
        callback = function(){},
        l = arguments.length,
        possibleActions = ['open', 'close', 'toggle'],
        possibleDimensions =['height', 'width'];
    for (var i = 0; i < l; i++) {
      var arg = arguments[i],
          argType = typeof arg;
      if (!arg)
        continue;
      switch (argType) {
        case 'string':
          if (possibleActions.indexOf(arg) !== -1) {
            $.extend(options, { action: arg });
          } else {
            var dimension = arg.split(' ')[0];
            if (possibleDimensions.indexOf(dimension) !== -1)
              $.extend(options, { transition: arg });
            else
              throw new Error('jquery.cssAnimateAuto doesn\'t know what to do with your argument "' + arg + '"');
          }
          continue;
        case 'function':
          callback = arg;
          continue;
        case 'object':
          $.extend(options, arg);
          continue;
      }
    }
    return [options, callback];
  }

  // define the plugin
  $.fn.cssAnimateAuto = function() {
    var argsArray = processArgs.apply(this, arguments);
    return this.each(function () {
      // If element is already transitioning, ignore.
      if ($(this).data('transitioning'))
        return;
      cssAnimateAuto.apply(null, [this].concat(argsArray));
    });
  };

  // define the (modifiable) defaults
  $.fn.cssAnimateAuto.defaults = {
    transition: 'height 0.3s', // any CSS transition (shorthand) prop
    action: 'toggle', // or 'open' or 'close'
    openClass: 'is-opened',
    eventNamespace: 'cssaa'
  };

})(jQuery);