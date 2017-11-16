$(document).ready(function () {
  var $msg = $('#msg');
  var $newLinkRow = $('#new-link');
  var $newLinkBtn = $('#new-link button');
  var env = 'prod';
  var token = null;

  function init() {
    $newLinkRow.hide();
    $newLinkRow.css({ opacity: 1 });
    checkEmailConfirmation();
  }

  function checkEmailConfirmation() {
    var params = getUrlParams();
    token = window.location.hash.slice(1);
    if (params.env && params.env != 'dev' && params.env != 'prod') {
      showError('Unbekannte Umgebung: "' + params.env + '"');
      return;
    }
    env = params.env || env;
    if (!token || token.split('.').length !== 3) {
      showError('Der Bestätigungslink hat ein ungültiges Format.');
      return;
    }

    var payload;
    try {
      payload = jwt_decode(token);
    } catch (err) {
      showError('Der Bestätigungslink hat ein ungültiges Format.');
      return;
    }
    var apiUrl = getBaseUrl(env) + r('.urebxhncc.pbz/nhgu/rznvy');

    var onReqSuccess = function () {
      showSuccess('Danke, Deine E-Mail-Adresse wurde erfolgreich bestätigt!');
    };

    var onReqError = function (jqxhr, status, err) {
      if (err) {
        console.log('jqXHR: ' + JSON.stringify(jqxhr));
        console.log('Status: ' + status);
        console.log('Error: ' + err);
      }
      var msg = 'Unbekannter Fehler';
      if (jqxhr.status === 404)
        msg = 'Das Nutzerkonto für diese Adresse existiert nicht oder wurde bereits bestätigt.';
      else if (jqxhr.status === 400) {
        msg = 'Der Bestätigungslink ist abgelaufen oder ungültig.';
        $newLinkBtn.click(requestEmailReset.bind(null, payload.email));
        $newLinkRow.show();
      }
      showError(msg);
    };

    var req = {
      type: 'PUT',
      contentType: 'application/json',
      url: apiUrl,
      data: JSON.stringify({ confirmToken: token }),
      success: onReqSuccess,
      error: onReqError
    };
    $.ajax(req);
  }

  function requestEmailReset(email) {
    $newLinkRow.hide();
    showInfo('Ein neuer Link wird angefordert...');

    var apiUrl = getBaseUrl(env) + r('.urebxhncc.pbz/nhgu/rznvy/pynvz');

    var onReqSuccess = function () {
      showSuccess('Falls ' + email + ' zu einem unbestätigten Nutzerkonto gehört, wurde gerade' +
        ' ein Bestätigungslink dorthin gesendet. Er ist 24h gültig. Bitte prüfe Dein Postfach' +
        ' und auch Deinen Spam-Ordner.');
    };

    var onReqError = function (jqxhr, status, err) {
      if (err) {
        console.log('jqXHR: ' + JSON.stringify(jqxhr));
        console.log('Status: ' + status);
        console.log('Error: ' + err);
      }
      var msg = 'Unbekannter Fehler';
      if (jqxhr.status === 400)
        msg = 'Der Link enthält eine ungültige E-Mail-Adresse (' + email +
          '). Bitte wende Dich an <span class="rv">ed.emtxeneht@ecivres</span>.';
      showError(msg);
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

  function showInfo(msg) {
    $msg.removeClass('alert-success');
    $msg.removeClass('alert-danger');
    $msg.addClass('alert-info');
    $msg.html(msg);
  }

  function showError(msg) {
    $msg.removeClass('alert-info');
    $msg.removeClass('alert-success');
    $msg.addClass('alert-danger');
    $msg.html(msg);
  }

  function showSuccess(msg) {
    $msg.removeClass('alert-info');
    $msg.removeClass('alert-danger');
    $msg.addClass('alert-success');
    $msg.html(msg);
  }

  function getUrlParams() {
    var params = {};
    location.search.substr(1).split("&").forEach(function (item) {
      params[item.split("=")[0]] = item.split("=")[1];
    });
    return params;
  }

  init();
});