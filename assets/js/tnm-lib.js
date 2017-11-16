var pricing = {
  a: {
    m12: { m: 12, p: 49 },
    m6: { m: 6, p: 59 },
    m3: { m: 3, p: 69 }
  },
  b: {
    m12: { m: 12, p: 69 },
    m6: { m: 6, p: 79 },
    m3: { m: 3, p: 89 }
  },
  discount: 0.15
};

function getBaseUrl(env) {
  var nv = env || (isLocalhost() ? r('qri') : r('cebq'));
  return r('uggcf://havd-ncv-') + nv + r('.urebxhncc.pbz');
}

function getPrice(id) {
  var variant = readCookie('variant');
  if (!variant) {
    variant = Math.random() < 0.5 ? 'a' : 'b';
    createCookie('variant', variant, 7);
  }
  var prc = pricing[variant][id];
  if (!prc) return null;
  var res = {
    v: variant,
    m: prc.m,
    p: prc.p,
    t: prc.p * prc.m
  };
  if (pricing.discount) {
    res.d = pricing.discount;
    res.dp = res.p * (1 - pricing.discount);
    res.dt = res.t * (1 - pricing.discount);
  }
  return res;
}

function formatPrice(price) {
  return ('' + price.toFixed(2)).replace('.', ',') + '&euro;';
}

function initExitIntentModal(doc, cb) {
  var suppressEIM = readCookie('suppressEIM');
  if (suppressEIM) return;
  $.exitIntent('enable');
  doc.bind('exitintent', cb);
}

function switchOffEIM(days) {
  var numDays = !isNaN(days) ? days : 1;
  console.log('DAYS: ' + numDays);
  var suppressEIM = readCookie('suppressEIM');
  if (!suppressEIM) {
    createCookie('suppressEIM', true, numDays);
    $.exitIntent('disable');
  }
}

function readCookie(name) {
  var nameEQ = encodeURIComponent(name) + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function createCookie(name, value, days) {
  var expires;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toGMTString();
  } else {
    expires = "";
  }
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getUrlParams() {
  var params = {};
  location.search.substr(1).split("&").forEach(function (item) {
    params[item.split("=")[0]] = item.split("=")[1];
  });
  return params;
}


function r(s) {
  return s.replace(/[a-zA-Z]/g, function (c) {
    return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
  });
}

function isLocalhost() {
  return (location.hostname === "localhost" || location.hostname === "127.0.0.1");
}
