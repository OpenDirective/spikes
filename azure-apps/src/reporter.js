  import SMS from 'source-map-support'
  import XWS from 'xhr-write-stream'
  import WS from 'utf8-stream'

  SMS.install();

  if (/Phantom/.test(window.navigator.userAgent)) {
    window.close = function () {
      setTimeout(function () {
        phantom.exit();
      }, 1000);
    };
  }

  if (!/Phantom|Electron/.test(window.navigator.userAgent)) {
    window.onerror = function (back, _1, _2, _3, err) {
      console.error(err && err.stack
        || err
        || back);
    };

    var xws = XWS('/xws');
    var ws = WS();
    ws.pipe(xws);

    var console = window.console || {};
    var methods = ['log', 'error', 'warn', 'dir', 'debug', 'info', 'trace'];
    for (var i = 0; i < methods.length; i++) (function (method) {
      var old = console[method];
      console[method] = function (msg) {
        ws.write(Array.prototype.slice.call(arguments, 0).join(' ') + '\n');
        if (old) old.apply(console, arguments);
        if (msg instanceof Error && typeof JSON != 'undefined') {
          ws.write(JSON.stringify(msg) + '\n');
        }
      }
    })(methods[i]);
  }

