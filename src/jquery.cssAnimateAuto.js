;(function($) {

function cssAnimateAuto(element, options, userCallback) {

  var $el = $(element),
      settings = $.extend({}, $.fn.cssAnimateAuto.defaults, options),
      dimension = settings.transition.split(' ')[0],
      oppositeDimension = (dimension === 'height') ? 'width' : 'height',
      transEnd = (typeof document.body.style.webkitTransition !== 'undefined') ? 'webkitTransitionEnd' : 'transitionend';

  function isOpen($el) {
    return $el.hasClass(settings.openClass) || $el.css(dimension) === getTargetDimension($el);
  }

  function namespaceEvent(eventName) {
    // Namespace an event.
    // If no eventName is passed, just return the namespace.
    var eName = eventName || '';
    return eName + '.' + settings.eventNamespace;
  }

  function createTransition($el, thingsToDo) {
    // `thingsToDo` is passed by `openEl` and `closeEl`,
    // according to the different needs of each.

    // `transTime` is used to time the fallback; should be
    // 300ms after the transition should have ended.
    var transTime = 1000 * (parseFloat($el.css('transition-duration')) + parseFloat($el.css('transition-delay'))) + 300;

    function afterTransition() {
      // Remove the transition.
      $el.css('transition', '');
      // Do the things that are required by the plugin
      // and then the user callback.
      thingsToDo();
      userCallback.call($el);
      // Remove listener and allow another transition.
      $el.off(namespaceEvent())
        .data('transitioning', false);
    }

    function fallbackFinisher() {
      if (!$el.data('transitioning')) {
        $el.trigger(namespaceEvent('fallback'));
      }
    }

    // Create the transition (here in JS instead of in the CSS
    // so it can easily be removed here in JS).
    // jQuery will provide the requisite vendor prefixes.
    $el.css('transition', settings.transition)
      // set listener for transitionend
      .on(namespaceEvent(transEnd), function(e) {
        if (e.originalEvent.propertyName === dimension) {
          afterTransition();
        }
      })
      // set listener for fallback
      .on(namespaceEvent('fallback'), afterTransition)
      // indicate that transition is in progress
      .data('transitioning', true);

    // Fallback should fire just after transition should have ended;
    // check if transitionend never fired; and if not fire the
    // fallback event.
    setTimeout(fallbackFinisher, transTime);
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
      // Revert dimension to auto in case of screen width changes.
      $el.css(dimension, 'auto');
      $el.addClass(settings.openClass);
    });
    $el.css(dimension, getTargetDimension($el));
  }

  function closeEl($el) {
    // If there is a 'to' setting, we will go to that;
    // otherwise, will go to nothing.
    var to = (settings.to) ? settings.to : '';
    // Set the dimension to a number (it's current state
    // is probably `auto`); then create a transition,
    // with things to do when the transition ends, and
    // change the dimension.
    $el.css(dimension, $el.css(dimension));
    // Force repaint (http://n12v.com/css-transition-to-from-auto/)
    $el[0].offsetHeight;
    createTransition($el, function(e) {
      $el.removeClass(settings.openClass);
    });
    $el.css(dimension, to);
  }

  function toggleEl($el) {
    if (isOpen($el)) {
      closeEl($el);
    } else {
      openEl($el);
    }
  }

  // Determine which function to run based on the setting `action`.
  switch (settings.action) {
    case 'open':
      if (!isOpen($el)) {
        openEl($el);
      }
      break;
    case 'close':
      if (isOpen($el)) {
        closeEl($el);
      }
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
  // The options `transition`, `action`, and `to` can also
  // be passed as isolated strings.
  // This function sorts them out.
  var options = {},
      callback = function() {},
      l = arguments.length,
      possibleActions = ['open', 'close', 'toggle'],
      possibleDimensions =['height', 'width'];
  // For each argument, determine whether it should be
  // added to the options object,
  // used as a callback,
  // or ignored.
  for (var i = 0; i < l; i++) {
    var arg = arguments[i],
        argType = typeof arg;
    // Ignore falsey values.
    if (!arg) { continue; }
    switch (argType) {
      case 'string':
        // Sort out whether the string is an action, to value, or dimension
        if (possibleActions.indexOf(arg) !== -1) {
          $.extend(options, { action: arg });
        } else if (arg.substring(0,2) === 'to') {
          $.extend(options, { to: arg.substring(3) });
        } else if (possibleDimensions.indexOf(arg.split(' ')[0]) !== -1) {
          $.extend(options, { transition: arg });
        } else {
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

// Define the plugin.
$.fn.cssAnimateAuto = function() {
  var argsArray = processArgs.apply(this, arguments);
  return this.each(function () {
    // If element is already transitioning, ignore.
    if ($(this).data('transitioning')) { return; }
    // Otherwise, do the stuff.
    cssAnimateAuto.apply(null, [this].concat(argsArray));
  });
};

// Define the (modifiable) defaults.
$.fn.cssAnimateAuto.defaults = {
  transition: 'height 0.3s', // any CSS transition (shorthand) prop
  action: 'toggle', // or 'open' or 'close'
  openClass: 'is-opened',
  eventNamespace: 'cssaa',
  to: false // any height value
};

})(jQuery);