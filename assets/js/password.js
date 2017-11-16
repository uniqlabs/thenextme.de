$(document).ready(function () {
  var $formRow = $('.form-row');
  var $inputs = $('#signup-form :input');
  var $fpForm = $('#forgot-password-form');
  var $email = $('#email');
  var $rpForm = $('#reset-password-form');
  var $pass = $('#password');
  var $btnSpinner = $('#btn-submit .spinner');
  var $btnText = $('#btn-submit .text');
  var $alertRow = $('.alert-row');
  var $msg = $('#msg');
  var $newLinkRow = $('.new-link');

  function init() {
    $btnSpinner.hide();
    $btnSpinner.css({ opacity: 1 });
    if ($fpForm.length) initForgotPassword();
    else if ($rpForm.length) initResetPassword();
  }

  function initForgotPassword() {
    $fpForm.validator().on('submit', requestLink);
    var params = getUrlParams();
    if (params.email) $email.val(decodeURIComponent(params.email));
  }

  function requestLink(event) {
    if (event.isDefaultPrevented()) return;
    event.preventDefault();
    var apiUrl = getBaseUrl() + r('/nhgu/cnffjbeq/erfrg');
    var email = $email.val();
    hideAlert();
    setBusy(true);

    var onReqSuccess = function () {
      hideForm();
      showSuccess('Wenn für diese Adresse ein Nutzerkonto existiert, erhältst Du in wenigen' +
        ' Minuten eine Email zum Zurücksetzen Deines Passworts. Bitte kontrolliere auch Deinen' +
        ' Spam-Ordner.');
    };

    var onReqError = function (jqxhr, status, err) {
      if (err) {
        console.log('jqXHR: ' + JSON.stringify(jqxhr));
        console.log('Status: ' + status);
        console.log('Error: ' + err);
      }
      var msg = 'Unbekannter Fehler';
      if (jqxhr.status === 400)
        msg = 'Ungültige E-Mail-Adresse';
      showError(msg);
      setBusy(false);
    };

    var req = {
      type: 'POST',
      contentType: 'application/json',
      url: apiUrl,
      data: JSON.stringify({ email: email }),
      success: onReqSuccess,
      error: onReqError
    };
    $.ajax(req);
  }

  function initResetPassword() {
    $rpForm.validator().on('submit', resetPassword);
    checkResetToken();
  }

  function checkResetToken() {
    var params = getUrlParams();
    var token = window.location.hash.slice(1);
    if (params.env && params.env != 'dev' && params.env != 'prod') {
      showError('Unbekannte Umgebung: "' + params.env + '"');
      return;
    }
    if (!token || token.split('.').length !== 3) {
      showError('Der Reset-Link hat ein ungültiges Format.');
      $newLinkRow.show();
      return;
    }

    try {
      jwt_decode(token);
    } catch (err) {
      showError('Der Reset-Link hat ein ungültiges Format.');
      $newLinkRow.show();
      return;
    }
    $alertRow.hide();
    $formRow.slideDown();
  }

  function resetPassword(event) {
    if (event.isDefaultPrevented()) return;
    event.preventDefault();
    var pass = $pass.val();
    var env = getUrlParams().env;
    var apiUrl = getBaseUrl(env) + r('/nhgu/cnffjbeq');
    var token = window.location.hash.slice(1);

    var onReqSuccess = function () {
      hideForm();
      showSuccess('🎉&emsp; Dein neues Passwort wurde erfolgreich gesetzt.');
    };

    var onReqError = function (jqxhr, status, err) {
      if (err) {
        console.log('jqXHR: ' + JSON.stringify(jqxhr));
        console.log('Status: ' + status);
        console.log('Error: ' + err);
      }
      var msg = 'Unbekannter Fehler';
      if (jqxhr.status === 404) {
        msg = 'Das Nutzerkonto für diese Adresse existiert nicht.';
        hideForm();
        $newLinkRow.show();
      } else if (jqxhr.status === 400) {
        msg = 'Der Reset-Link ist abgelaufen oder ungültig.';
        hideForm();
        $newLinkRow.show();
      }
      showError(msg);
    };


    var req = {
      type: 'PUT',
      contentType: 'application/json',
      url: apiUrl,
      data: JSON.stringify({ resetToken: token, pass: pass }),
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

  function showInfo(msg) {
    $msg.removeClass('alert-success');
    $msg.removeClass('alert-danger');
    $msg.addClass('alert-info');
    $msg.html(msg);
  }

  function showError(msg) {
    $msg.removeClass('alert-success');
    $msg.addClass('alert-danger');
    showAlert(msg);
  }

  function showSuccess(msg) {
    $msg.removeClass('alert-danger');
    $msg.addClass('alert-success');
    showAlert(msg);
  }

  function showAlert(msg) {
    $msg.html(msg);
    $alertRow.slideDown();
  }

  function hideAlert() {
    $alertRow.slideUp();
  }

  function hideForm() {
    $formRow.hide();
  }

  init();
});