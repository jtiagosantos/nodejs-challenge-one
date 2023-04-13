import http from 'node:http';
import { json } from './middlewares/json.js';
import { extractQueryParams } from './helpers/extract-query-params.js';
import { routes } from './routes.js';

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  req.url = decodeURIComponent(url);

  await json(req, res);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  res.writeHead(404).end('Route Not Found');
});

server.listen(3333);