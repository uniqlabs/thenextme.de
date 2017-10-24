$(document).ready(function () {
  var $window = $(window);
  var $navbarToggler = $('button.navbar-toggler');
  var $navClose = $('button.nav-close');
  var $mobileNav = $('.mobile-nav');
  var $navbar = $('nav');
  var $logo = $('#logo');
  var $logoWhite = $('#logo-white');
  var $testis = $('#testis');
  var scrollTop = 0;
  var navbarOn = 0;
  var navbarOff = 0;
  var navbarOpaque = false;
  var mobileNavVisible = false;

  function init() {
    new Rellax('.rellax');
    initSlider();
    initNav();
    initTooltips();
    updateDimensions();
    initToggles();
    $window.scroll(handleScroll);
    handleScroll();
  }

  function updateDimensions() {
    navbarOn = $window.height() / 4 + 10;
    navbarOff = $window.height() / 4 - 10;
    scrollTop = $window.scrollTop();
  }

  function initSlider() {
    $prev = $('.sec-testimonials .btn-prev');
    $next = $('.sec-testimonials .btn-next');
    // Randomize the slides
    $testis.each(function () {
      $(this).children().sort(function () {
        return Math.round(Math.random()) - 0.5;
      }).detach().appendTo(this);
    });
    $testis.slick({
      infinite: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: $prev,
      nextArrow: $next,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }

  function initNav() {
    $navbarToggler.click(function () {
      $mobileNav.fadeIn();
      mobileNavVisible = true;
    });
    $navClose.click(function () {
      $mobileNav.fadeOut();
      mobileNavVisible = false;
    });
    $("a[href^='#']").click(function (event) {
      var target;
      target = this.hash;
      event.preventDefault();
      var navOffset;
      navOffset = $('#navbar').height() - 6;
      if (mobileNavVisible) $mobileNav.fadeOut();
      return $('html, body').animate({
        scrollTop: $(this.hash).offset().top - navOffset
      }, 300, function () {
        return window.history.pushState(null, null, target);
      });
    });
  }

  function initTooltips() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  function initToggles() {
    $('.sec-faq .q').click(function () {
      $(this).toggleClass('open');
      $(this).next('.a').slideToggle();
    });
  }

  function handleScroll() {
    scrollTop = $window.scrollTop();
    if (scrollTop >= navbarOn && !navbarOpaque) {
      $navbar.addClass('opaque');
      $logoWhite.fadeOut();
      $logo.fadeIn();
      navbarOpaque = true;
    } else if (scrollTop <= navbarOff && navbarOpaque) {
      $navbar.removeClass('opaque');
      $logoWhite.fadeIn();
      $logo.fadeOut();
      navbarOpaque = false;
    }
  }

  init();
});