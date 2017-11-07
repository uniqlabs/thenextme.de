$(document).ready(function () {
  var $document = $(document);
  var $window = $(window);
  var $navbarToggler = $('button.navbar-toggler');
  var $navClose = $('button.nav-close');
  var $mobileNav = $('.mobile-nav');
  var $navbar = $('#navbar');
  var $logo = $('#logo');
  var $logoWhite = $('#logo-white');
  var $cats = new Array(9);
  var $activeCat = $('#active-cat');
  var $featureBoxes = new Array(4);
  var $featureSlides = new Array(4);
  var $testis = $('#testis');
  var $vidModal = $('#modal-video');
  var $vidFrame = $('#cover-video');
  var $extModal = $('#modal-exit');
  var scrollTop = 0;
  var navbarOn = 0;
  var navbarOff = 0;
  var navbarOpaque = false;
  var mobileNavVisible = false;
  var catNames = ['Liebe &amp;<br>Partnerschaft', 'Vitalität &amp;<br>Fitness', 'Geld', 'Freizeit', 'Freunde',
    'Wohnen &amp;<br>Leben', 'Weiter-<br>bildung', 'Familie', 'Karriere'];
  var actCat = 0;
  var catTimer = null;
  var actFeat = 0;

  function init() {
    initNav();
    initTestiSlider();
    initFeatureSlider();
    updateDimensions();
    initCats();
    initExitIntent();
    initVideo();
    $window.scroll(handleScroll);
    handleScroll();
  }

  function updateDimensions() {
    navbarOn = $navbar.height() * 2 + 10;
    navbarOff = $navbar.height() * 2 - 10;
    scrollTop = $window.scrollTop();
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

  function initTestiSlider() {
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
      slidesToShow: 4,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: $prev,
      nextArrow: $next,
      responsive: [
        {
          breakpoint: 1800,
          settings: {
            slidesToShow: 3
          }
        }, {
          breakpoint: 1440,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }

  function initFeatureSlider() {
    for (var i = 0; i < $featureBoxes.length; i++) {
      $featureBoxes[i] = $('#feat' + (i + 1));
      $featureBoxes[i].click(showFeatureSlide.bind(null, i));
      $featureSlides[i] = $('#slide' + (i + 1));
      if (i !== actFeat) {
        $featureSlides[i].hide();
        $featureSlides[i].css({ opacity: 1 });
      }
    }
  }

  function showFeatureSlide(idx) {
    scrollTo($featureBoxes[idx]);
    if (idx === actFeat) return;
    $featureBoxes[actFeat].removeClass('active');
    $featureBoxes[idx].addClass('active');
    $featureSlides[actFeat].fadeOut();
    $featureSlides[idx].fadeIn();
    actFeat = idx;
  }

  function scrollTo(el) {
    $('html, body').animate({
      scrollTop: el.offset().top - $navbar.outerHeight()
    }, 800);
  }

  function initCats() {
    for (var i = 0; i < $cats.length; i++) {
      $cats[i] = $('#cat' + (i + 1));
      $cats[i].hover(fnIn.bind(null, i), switchCatTimer.bind(null, true));
    }
    selectCat(0);
    switchCatTimer(true);
  }

  function fnIn(idx) {
    switchCatTimer(false);
    selectCat(idx);
  }

  function initExitIntent() {
    $.exitIntent('enable');
    $document.bind('exitintent', showExitModal);
  }

  function showExitModal() {
    $extModal.modal({ backdrop: true, show: true });
  }

  function initVideo() {
    $('.video-title').click(function (e) {
      e.preventDefault();
      $vidModal.modal();
      startVideo();
    });
    $vidModal.on('hidden.bs.modal', function () {
      stopVideo();
    });
  }

  function selectCat(idx) {
    $cats[actCat].removeClass('active');
    $cats[idx].addClass('active');
    $activeCat.html(catNames[idx]);
    actCat = idx;
  }

  function switchCatTimer(on) {
    if (on === !!catTimer) return;
    if (on)
      catTimer = setInterval(function () { selectCat((actCat + 1) % 9); }, 4000);
    else {
      clearInterval(catTimer);
      catTimer = null;
    }
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

  function startVideo() {
    var src = $vidFrame.attr('src');
    console.log('SRC: ' + src);
    $vidFrame.attr('src', src.replace('autoplay=0', 'autoplay=1'));
  }

  function stopVideo() {
    var src = $vidFrame.attr('src');
    $vidFrame.attr('src', '');
    $vidFrame.attr('src', src.replace('autoplay=1', 'autoplay=0'));
  }

  init();
});