$(document).ready(function () {
  var $form = $('#signup-form');
  var $inputs = $('#signup-form :input');
  var $firstName = $('#firstName');
  var $newsletter = $('#newsletter')
  var $email = $('#email');
  var $password = $('#password');
  var $btnSpinner = $('#btn-submit .spinner');
  var $btnText = $('#btn-submit .text');
  var $reqError = $('.req-error');
  var $errMsg = $('.alert-danger');
  var apiUrl = r('uggcf://havd-ncv-') + (isLocalhost() ? r('qri') : r('cebq')) + r('.urebxhncc.pbz/hfref');
  // var apiUrl = r('uggcf://havd-ncv-qri.urebxhncc.pbz/hfref');
  var params;

  function init() {
    getUrlParams();
    checkRedirect();
    fillInPackageDetails();
    initSignUp();
    $firstName.focus();
  }

  function getUrlParams() {
    params = {};
    location.search.substr(1).split("&").forEach(function (item) {
      params[item.split("=")[0]] = item.split("=")[1];
    });
  }

  function checkRedirect() {
    if (!params.p || (params.p !== 'm3' && params.p !== 'm6' && params.p !== 'm12'))
      window.location = '/de/pakete/';
  }

  function fillInPackageDetails() {
    var billed = { m3: 'quartalsweise', m6: 'halbjährlich', m12: 'jährlich' };
    var pkg = params.p;
    var prc = getPrice(pkg);
    var p = prc.d ? prc.dp : prc.p;
    var discount = prc.d ? '(inkl. ' + Math.round(prc.d * 100) +
    '% Rabatt für die erste Abbuchung)' : '';
    $('.months').html(prc.m);
    $('.price .amount').html(formatPrice(p));
    $('.price .billed').html('Abbuchung ' + billed[pkg]);
    $('.discount').html(discount);
  }

  function initSignUp() {
    $btnSpinner.hide();
    $btnSpinner.css({ opacity: 1 });
    $form.validator().on('submit', signUp);
  }

  function signUp(event) {
    if (event.isDefaultPrevented()) return;
    event.preventDefault();
    var firstName = $firstName.val();
    var email = $email.val();
    var pass = $password.val();
    var newsletter = $newsletter.is(":checked");
    var pkg = params.p;
    var prc = getPrice(pkg);
    hideError();
    setBusy(true);
    var req = {
      type: 'POST',
      contentType: 'application/json',
      url: apiUrl,
      data: JSON.stringify({
        firstName: firstName,
        email: email,
        lang: 'de',
        pass: pass,
        pricingTest: {
          newsletter: newsletter,
          package: pkg,
          variant: prc.v,
          price: prc.p,
          total: prc.t,
          discount: prc.d
        }
      }),
      success: onReqSuccess,
      error: onReqError
    };
    $.ajax(req);
  }

  function setBusy(b) {
    if (b) {
      $inputs.attr('disabled', true);
      $btnSpinner.fadeIn();
      $btnText.fadeOut();
    } else {
      $inputs.attr('disabled', false);
      $btnSpinner.fadeOut();
      $btnText.fadeIn();
    }
  }

  function onReqSuccess() {
    setBusy(false);
    window.location = '/de/danke-registrierung/?tk=' + Math.random().toString(36).substring(2, 8);
  }

  function onReqError(jqxhr, status, err) {
    if (err) {
      console.log('jqXHR: ' + JSON.stringify(jqxhr));
      console.log('Status: ' + status);
      console.log('Error: ' + err);
    }
    var msg = 'Unbekannter Fehler';
    if (jqxhr.status === 409)
      msg = 'Für diese E-Mail-Adresse existiert bereits ein Nutzerkonto.';
    else if (jqxhr.status === 400)
      msg = 'Ungültige Eingabe';
    showError(msg);
    setBusy(false);
  }

  function showError(msg) {
    $errMsg.html(msg);
    $reqError.slideDown();
  }

  function hideError() {
    $reqError.slideUp();
  }

  function isLocalhost() {
    return (location.hostname === "localhost" || location.hostname === "127.0.0.1");
  }

  init();
});