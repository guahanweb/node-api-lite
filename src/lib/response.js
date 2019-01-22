const { EventEmitter } = require('events');

class Response extends EventEmitter {
  constructor(res) {
    super();
    res.setHeader('X-Powered-By', 'bacon 2.0');
    this.response = res;
  }

  /**
   * Helper to set up the status code for the response
   */
  status(status) {
    this.response.statusCode = status;
    return this;
  }

  /**
   * Attempt to auto-detect the data type and send it accordingly
   */
  send(data) {
    if (typeof data === 'object') {
      this.json(data);
    } else {
      this.html(data);
    }
  }

  html(str) {
    this.response.setHeader('Content-Type', 'text/html');
    this.response.end(String(str));
  }

  /**
   * Simplified plaintext response helper
   */
  text(str) {
    this.response.setHeader('Content-Type', 'text/plain');
    this.response.end(String(str));
  }

  /**
   * Simplified JSON response helper
   */
  json(o) {
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(o, null, 2));
  }

  /**
   * Simplified header control
   */
  set headers(headers) {
    Object.keys(headers).forEach(key => {
      this.response.setHeader(key, headers[key]);
    });
  }
}

module.exports = Response;
