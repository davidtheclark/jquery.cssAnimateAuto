// height

$('#trigger-h-full').click(function() {
  $('#content-h-full').cssAnimateAuto();
});

$('#trigger-h-restricted').click(function() {
  $('#content-h-restricted').cssAnimateAuto('height 1s linear');
});

$('#trigger-h-starting').click(function() {
  $('#content-h-starting').cssAnimateAuto('height 1s linear', 'to 0');
});

// width

$('#trigger-w-min').click(function() {
  $('#content-w-min').cssAnimateAuto('width 0.3s linear');
});

$('#trigger-w-restricted').click(function() {
  $('#content-w-restricted').cssAnimateAuto({
    transition: 'width 0.3s linear 0.5s'
  });
});

// options -------

// open only

$('#trigger-open').click(function() {
  $('#content-open-close').cssAnimateAuto('open');
});

$('#trigger-open-option').click(function() {
  $('#content-open-close').cssAnimateAuto({
    action: 'open'
  });
});

// close only

$('#trigger-close').click(function() {
  $('#content-open-close').cssAnimateAuto('close');
});

$('#trigger-close-option').click(function() {
  $('#content-open-close').cssAnimateAuto({
    action: 'close'
  });
});

// closed height

$('#trigger-closed-height').click(function() {
  $('#content-closed-height').cssAnimateAuto();
});

// open class

$('#trigger-open-class').click(function() {
  $('#content-open-class').cssAnimateAuto({
    openClass: 'different-open-class'
  });
});

// speed

$('#trigger-speed').click(function() {
  $('#content-speed').cssAnimateAuto('height 1s');
});

$('#trigger-speed-option').click(function() {
  $('#content-speed').cssAnimateAuto({
    transition: 'height 0.1s'
  });
});

// easing

$('#trigger-easing').click(function() {
  $('#content-easing').cssAnimateAuto('height 0.3s linear');
});

$('#trigger-easing-option').click(function() {
  $('#content-easing').cssAnimateAuto({
    transition: 'height 0.5s steps(4, end)'
  });
});

// callback

$('#trigger-callback').click(function() {
  $('#content-callback').cssAnimateAuto(function() {
    alert('opening or closing, dunno which');
  });
});

$('#trigger-callback-open').click(function() {
  $('#content-callback').cssAnimateAuto('open', function() {
    alert('opening');
  });
});

$('#trigger-callback-close').click(function() {
  $('#content-callback').cssAnimateAuto({
    action: 'close'
  }, function() {
    alert('closing');
  });
});

function externalCallback() {
  alert('Successful external callback.');
}

$('#trigger-callback-external').click(function() {
  $('#content-callback').cssAnimateAuto(externalCallback);
});