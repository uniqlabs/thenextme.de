$(document).ready(function () {
  var $typed = $('.typed');

  function init() {
    initTypedSpan();
  }

  function initTypedSpan() {
    var strings = [];
    for (var i = 0; i < 8; i++)
      strings.push($typed.data('h' + (i + 1)));
    new Typed('.typed', {
      strings: strings,
      typeSpeed: 70,
      backSpeed: 40,
      startDelay: 400,
      backDelay: 2000,
      smartBackspace: true,
      onComplete: function () { $('.typed-cursor').hide(); }
    });
  }

  init();
});