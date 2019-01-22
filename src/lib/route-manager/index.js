const Route = require('./route');

class RouteManager {
  constructor() {
    this.routes = {
      GET: [],
      POST: [],
      PUT: [],
      DELETE: []
    };
  }

  /**
   * Dumb addition of handlers. We return the route for any custom
   * pre or post handling
   */
  addRoute(route, handler, verb) {
    let rt = new Route(route);

    this.routes[verb].push({
      route: new Route(route),
      handler
    });

    return rt;
  }

  /**
   * Check all registered routes for available handlers
   */
  checkRoute(path, verb) {
    let routes = this.routes[verb];
    for (let i = 0; i < routes.length; i++) {
      let { route, handler } = routes[i];
      let params = route.match(path);
      if (!!params) {
        let o = { handler };
        if (typeof params === 'object') {
          o.params = params;
        }
        return o;
      }
    }
    return false;
  }

  validateRoute(route, path) {
    return route === path;
  }

  get(route, handler) {
    this.addRoute(route, handler, 'GET');
  }

  post(route, handler) {
    this.addRoute(route, handler, 'POST');
  }

  put(route, handler) {
    this.addRoute(route, handler, 'PUT');
  }

  delete(route, handler) {
    this.addRoute(route, handler, 'DELETE');
  }
}

module.exports = RouteManager;
