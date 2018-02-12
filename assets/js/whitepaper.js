$(document).ready(function () {
  var $form = $('#whitepaper-form');
  var $inputs = $('#whitepaper-form :input');
  var $captchaErr = $('.with-errors.captcha');
  var $btnSpinner = $('#btn-submit .spinner');
  var $btnText = $('#btn-submit .text');
  var $errMsg = $('.alert-danger');

  function init() {
    $form.validator().on('submit', requestWhitepaper);
  }

  function requestWhitepaper(event) {
    if (event.isDefaultPrevented()) return;
    event.preventDefault();
    var res = grecaptcha.getResponse();
    if (!res.length) {
      $captchaErr.slideDown();
      return;
    }
    var url = r('uggcf://zl.fraqvaoyhr.pbz/hfref/fhofpevorrzorq/wf_vq/2ldcb/vq/1');
    var data = $form.serialize();
    hideError();
    setBusy(true);
    var req = {
      url: url,
      data: data,
      dataType: 'json',
      type: 'POST',
      success: onReqSuccess
    };
    $.ajax(req);
  }

  function onReqSuccess(data) {
    setBusy(false);
    var msg = 'Unbekannter Fehler';
    if (!data || !data.result || !data.result.result) {
      showError(msg);
      return;
    }
    var res = data.result.result;
    if (res === 'success') {
      window.location = '/de/danke-whitepaper/';
      return;
    }
    if (res === 'emailExist')
      msg = 'Diese E-Mail ist bereits registriert.';
    else if (res === 'invalidCaptcha')
      msg = 'Das Captcha ist ungültig.<br>Bitte lade die Seite neu und versuche es erneut.';
    showError(msg);
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

  function showError(msg) {
    $errMsg.html(msg);
    $errMsg.slideDown();
  }

  function hideError() {
    $errMsg.slideUp();
  }

  init();
});

var renderCaptcha = function () {
  if (!$('div#gcaptcha').length) return;
  grecaptcha.render('gcaptcha', {
    'sitekey': r('6YrJbwpHNNNNNCxKU1p4kCLk9VMhsek0Be1tUqg6'),
    'theme': 'light',
    'callback': onUserVerified
  });
};

var onUserVerified = function () {
  $('div#gcaptcha').data('valid', true);
  $('.with-errors.captcha').slideUp();
};