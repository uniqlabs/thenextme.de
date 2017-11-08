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

function exitIntentModalDismissed() {
  var suppressEIM = readCookie('suppressEIM');
  if (!suppressEIM) {
    createCookie('suppressEIM', true, 3);
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
