const { EventEmitter } = require('events');

const fs = require('fs');
const path = require('path');
const http = require('http');
const Request = require('./request');
const Response = require('./response');
const RouteManager = require('./route-manager');

class Server extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.port = (opts.port || null);
    this.server = http.createServer();
    this.routes = new RouteManager();
    this.static_path = (opts.static_path || path.join(__dirname, 'static'));
    this.init();
  }

  init() {
    // check for any known static responders
    loadStaticPages.call(this);

    // lightweight request handling
    this.server.on('request', async (request, response) => {
      try {
        let req = new Request(request);
        let res = new Response(response);

        // check if we have a matching route and whether there are params
        // pulled from the path
        let { method, url } = req;
        let { handler, params } = this.routes.checkRoute(url, method);

        if (!!params) {
          req.params(params);
        }

        // we are expecting light payloads for this module, so no streaming currently
        await req.parse();

        if (typeof handler === 'function') {
          handler(req, res);
        } else {
          // unmanaged route
          let err = new Error(`[HTTP] No matching handler found for route ${url}`);
          this.emit('error', err);
          res.status(404).send(this.static['404'] || 'Not Found');
        }
      } catch (e) {
        res.status(500).send(this.static['500'] || 'Service Error');
      }
    });
  }

  get(route, handler) {
    this.routes.get(route, handler);
  }

  start(cb) {
    this.server.listen(this.port);
    cb(this.info);
  }

  get info() {
    return {
      port: this.port
    };
  }
}

/**
 * Rudimentary cache of static content for known keys
 */
function loadStaticPages() {
  let known_files = ['404'];
  let static_content = {};

  known_files.forEach(name => {
    let filename = `${this.static_path}/${name}.html`;
    if (fs.existsSync(filename)) {
      static_content[name] = fs.readFileSync(filename, 'utf8');
    }
  });

  this.static = static_content;
}

function createServer(opts) {
  return new Server(opts);
}

module.exports = {
  createServer
};
