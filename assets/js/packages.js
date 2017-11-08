$(document).ready(function () {

  function init() {
    fillInPrices();
    initSmoothScroll();
    initToggles();
  }

  function fillInPrices() {
    var packages = ['m3', 'm6', 'm12'];
    packages.forEach(function (pkg) {
      var prc = getPrice(pkg);
      var p = prc.d ? prc.dp : prc.p;
      var t = prc.d ? prc.dt : prc.t;
      var op = prc.d ? ' (<strike>' + formatPrice(prc.t) + '</strike>)' : '';
      $('.price span.' + pkg).html(formatPrice(p).replace(',', ',<sup>') + '</sup>');
      $('.ticks span.' + pkg).html(formatPrice(t) + op);
      // if (prc.d) {
      //   $('.discount span.' + pkg).html(Math.round(prc.d * 100));
      //   $('.discount').show();
      // } else
      //   $('.discount').hide();
    });
  }
  
  function initToggles() {
    $('.sec-faq .q').click(function () {
      $(this).toggleClass('open');
      $(this).next('.a').slideToggle();
    });
  }

  function initSmoothScroll() {
    $("a[href^='#']").click(function (event) {
      var target = this.hash;
      event.preventDefault();
      return $('html, body').animate({
        scrollTop: $(this.hash).offset().top
      }, 300, function () {
        return window.history.pushState(null, null, target);
      });
    });
  }

  init();
});