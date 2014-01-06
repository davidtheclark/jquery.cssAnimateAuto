#jquery.cssAnimateAuto

A jQuery plugin that *uses CSS transitions* to animate an element's height or width to `auto`.

## Installation

Get the files in the `dist/` directory OR install with [Bower](http://bower.io): `bower install jquery.cssAnimateAuto --save-dev`.

## Demonstration

[Please observe the demonstration.](http://davidtheclark.github.io/jquery.cssAnimateAuto)

## Why you need this

You, like everybody else, enjoy making things slide open and closed -- but *neither CSS nor jQuery allow you to slide dimensions to `auto`, and very often that's exactly what you need to do*.

You have tried various workarounds (e.g. CSS-transitioning `max-height` instead of `height`) but have been annoyed by their limitations and weaknesses. Perhaps you have already found a JavaScript snippet for solving this problem, but the snippet eventually disappointed you, in one way or another, and you once again cursed under your breath.

So: **Let's stop messing around and develop an open-source jQuery plugin that solves this silly problem, as well as it can be solved.**

That is what this simple plugin aspires to be.

Here are some issues I've had with other snippets, which I've tried to take care of in this plugin:
- Standard jQuery plugin structure, with modifiable defaults.
- Customizable CSS transitioning.
- Transition is applied with JavaScript and removed when it's finished.
- You can use callbacks!
- Height/width value to animate to should be accurately calculated by creating a clone, appended to the original element's parent, with the same opposite dimension value as the original element. Once the animation is complete, this provisional value is removed and the dimension is left at `auto`, in case the page layout adjusts later.
- Flexible arguments (see below).
- An `openClass` is applied (and removed in turn) to allow for compound effects (e.g. after the height slides open, the content fades in).

(If, however, this plugin has not solved all the problems that *you* have run into, if you are still dissatisfied, still resorting to workarounds you don't like, please contribute and make the plugin better!)

## Arguments

The following arguments **are all optional** and can be passed **in any order**.

You might also consider skipping to the examples below, especially if you've been here before.


### Options

- type: `Object` or a limited variety of independent `String`s

Pass an object argument and it will be interpreted as `options`. The default options object looks like this:

```javascript
{
  transition: 'height 0.3s', // any CSS transition (shorthand) prop
  action: 'toggle', // or 'open' or 'close'
  openClass: 'is-opened'
}
```

**These defaults can be modified for your project by changing `$.fn.cssAnimateAuto.defaults`.**

The following options are available:

#### transition

- type: `String`
- default: `'height 0.3s'`
- passed as: a string *or* part of the Options object.
 
A value for [the CSS shorthand property `transition`](https://developer.mozilla.org/en-US/docs/Web/CSS/transition).

The `transition-property` value must be `width` or `height`, and all the other parameters should work just like in CSS.

Note this: If you want to animate width, be warned that *width only works if the content has a fixed height, or a min-height and content that will not exceed that min-height as width expands.*

```javascript
// e.g.
$('#element').cssAnimateAuto('width 0.5s ease-out');
$('#element').cssAnimateAuto({
  transition: 'width 0.5s ease-out'
});
```

#### action

- type: `String`
- default: `'toggle'`
- options: `'toggle'`, `'open'`, `'close'`
- passed as: a string *or* part of the Options object.

Which action should be performed?

```javascript
// e.g.
$('#element').cssAnimateAuto('open');
$('#element').cssAnimateAuto({
  action: 'open'
});
```

#### openClass

- type: `String`
- default: `is-opened`
- passed as: part of the Options object.

What class should be applied to the element when it is opened?

This class is used within the plugin to test whether or not the element is opened. It can also be used by you to add CSS rules to the open state.

```javascript
// e.g.
$('#element').cssAnimateAuto({
  openClass: 'thing-active'
});
```

### Callback

- type: `Function`

A function to call at the end of the CSS transition.

```javascript
// e.g.
$('#element').cssAnimateAuto(function() {
  alert('You did it!');
});

function cheer() {
  alert('Hooray!');
}

$('#element').cssAnimateAuto(cheer);
```

## Examples

```javascript
// Default
$('#element').cssAnimateAuto();

// Close the element (or if it's already closed, ignore)
$('#element').cssAnimateAuto('close');

// Use linear easing and fast animation
$('#element').cssAnimateAuto('height 0.1s linear');

// Animate width
$('#element').cssAnimateAuto('width 0.3s');

// Use a callback and pass a couple of options
function doThisAfter() {
  // something you want done
}
$('#element').cssAnimateAuto({
  transition: 'width 0.3s steps(4, end)',
  action: 'close'
}, doThisAfter);

// Make a button animate the height of your
// element to `auto`.
$('#button').click(function() {
  $('#element').cssAnimateAuto();
});

// Different open and close buttons.
$('#open-button').click(function() {
  $('#element').cssAnimateAuto('open');
});
$('#close-button').click(function() {
  $('#element').cssAnimateAuto('close');
});

// Only open, and add a special openClass,
// then call a callback.
$('#element').cssAnimateAuto({
  action: 'open'
  openClass: 'thing-active'
}, function() {
  alert('You did it again!');
});

// or do the same thing with differently written arguments
$('#element').cssAnimateAuto('open', function() {
  alert('Three cheers for you!');
}, { openClass: 'thing-active' });

// Change the default openClass for your project
$.fn.cssAnimateAuto.defaults.openClass = 'my-different-class';
```

## References

- [CSS-Tricks: "Animate Height/Width to 'Auto'" (article and comments)](http://css-tricks.com/snippets/jquery/animate-heightwidth-to-auto/)
- [Nikita Vasilyev: "CSS transition from/to auto values"](http://n12v.com/css-transition-to-from-auto/)
