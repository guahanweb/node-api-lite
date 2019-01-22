const { EventEmitter } = require('events');

class Request extends EventEmitter {
  constructor(req) {
    super();
    this.request = req;
  }

  /**
   * Simple body parser that will emit "ready" when done.
   * Also, this parser will check for JSON headers and
   * attempt to parse the object in the payload.
   */
  async parse() {
    return new Promise((resolve, reject) => {
      let body = [];
      let { headers, method } = this.request;

      if (method === 'POST' || method === 'PUT') {
        this.request.on('error', err => {
          this.emit('error', err);
          reject(err);
        }).on('data', chunk => {
          body.push(chunk);
        }).on('end', () => {
          body = Buffer.concat(body).toString();
          if (headers['content-type'] && headers['content-type'].toLowerCase() === 'application/json') {
            body = JSON.parse(body);
          }

          this.payload = body;
          resolve();
        });
      } else {
        // ready without parsing the body
        resolve();
      }
    });
  }

  get headers() {
    return this.request.headers;
  }

  get url() {
    return this.request.url;
  }

  get method() {
    return this.request.method;
  }
}

module.exports = Request;
