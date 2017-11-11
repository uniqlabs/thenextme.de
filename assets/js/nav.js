$(document).ready(function () {
  var $window = $(window);
  var $navbarToggler = $('button.navbar-toggler');
  var $navClose = $('button.nav-close');
  var $mobileNav = $('.mobile-nav');
  var $navbar = $('#navbar');
  var $logo = $('#logo');
  var $logoWhite = $('#logo-white');
  var scrollTop = 0;
  var navbarOn = 0;
  var navbarOff = 0;
  var navbarOpaque = false;
  var mobileNavVisible = false;

  function init() {
    initNav();
    updateDimensions();
    $window.scroll(handleScroll);
    handleScroll();
    initToggles();
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
      var target = this.hash;
      event.preventDefault();
      var navOffset = $navbar.height() - 6;
      if (mobileNavVisible) $mobileNav.fadeOut();
      return $('html, body').animate({
        scrollTop: $(this.hash).offset().top - navOffset
      }, 300, function () {
        return window.history.pushState(null, null, target);
      });
    });
  }

  function updateDimensions() {
    navbarOn = $navbar.height() * 2 + 10;
    navbarOff = $navbar.height() * 2 - 10;
    scrollTop = $window.scrollTop();
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

  $.scrollTo = function (el) {
    $('html, body').animate({
      scrollTop: el.offset().top - $navbar.outerHeight()
    }, 800);
  };

  function initToggles() {
    $('.toggleable .trigger').click(function () {
      $(this).toggleClass('open');
      $(this).next('.target').slideToggle();
    });
  }

  init();
});