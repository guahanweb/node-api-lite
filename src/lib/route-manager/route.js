class Route {
  constructor(pattern) {
    this.parsePattern(pattern);
  }

  parsePattern(pattern) {
    // remove empty parts on both ends
    let parts = pattern.split('/').filter(part => part !== '');
    let placeholders = [];
    let regexp = '^/';

    parts = parts.map(part => {
      if (part.charAt(0) === ':') {
        // placeholder logic
        placeholders.push(part.substr(1));
        return '([^/]+)';
      }
      return part;
    });

    regexp += parts.join('/');
    if (regexp.charAt(regexp.length - 1) !== '/') {
      regexp += '/?';
    }
    regexp += '$';

    this.pattern = pattern;
    this.placeholders = placeholders;
    this.regexp = new RegExp(regexp, 'i');
  }


  match(url) {
    let match = url.match(this.regexp);
    if (!match) { return false; }
    if (this.placeholders.length === 0) { return true; }

    // we have a complex match
    let args = {};
    this.placeholders.forEach((p, i) => {
      args[p] = match[i + 1];
    });
    return args;
  }
}

module.exports = Route;
