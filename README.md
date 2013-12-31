#jquery.cssAnimateAuto

A jQuery plugin that *uses CSS transitions* to animate an element's height or width to `auto`.

## Why you need this

You, like everybody else, enjoy making things slide open and closed -- but *neither CSS nor jQuery allow you to slide dimensions to `auto`, and very often that's exactly what you need to do*.

You have tried various workarounds (e.g. CSS-transitioning `max-height` instead of `height`) but have been annoyed by their limitations and weaknesses. Perhaps you have already found a JavaScript snippet for solving this problem, but the snippet eventually disappointed you, in one way or another, and you once again cursed under your breath.

So: **Let's stop messing around and develop an open-source jQuery plugin that solves, thoroughly and satisfactorily, this silly problem.**

That is what this simple plugin aspires to be.

(If, however, this plugin has not solved the problem for you, if you are still dissatisfied, still resorting to workarounds, please contribute and make the plugin better!)

## Show Me

[Please observe the demonstration.](http://davidtheclark.github.io/jquery.cssAnimateAuto)

## Arguments

The following arguments **are all optional** and can be passed **in any order**.

You might also consider skipping to the examples at the bottom, especially if you've seen this before.


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
$('#element').animateAuto(function() {
  alert('You did it!');
});

function cheer() {
  alert('Hooray!');
}

$('#element').animateAuto(cheer);
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
