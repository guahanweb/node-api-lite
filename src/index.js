const http = require('./lib/http');
const server = http.createServer({ port: 3000 });

server.on('error', err => {
  console.error('[ERROR]', err.message);
});

server.get('/foobar', (req, res) => {
  res.json({ foo: 'bar' });
});

server.get('/', (req, res) => {
  res.text('home');
});

server.start(({ port }) => {
  console.log(`Listening on port: ${port}`);
});
