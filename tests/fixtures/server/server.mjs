import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import { SERVER_READY } from '../fixtures.constants.mjs';
import { authRouter } from "./auth.router.mjs";
import { errorRouter } from './error.router.mjs';
import { fileRouter } from "./file.router.mjs";
import { itemRouter } from './item.router.mjs';

const port = 8080;

function requestInfo() {
  return ({ method, originalUrl }, _, next) => {
    console.info(`Request ${method} on route : ${originalUrl}`);
    next();
  }
}

const server = express()
  .use(
    cors({
      origin: [
        'http://localhost:8000',
        'http://localhost:4200',
      ],
      exposedHeaders: ['retry-after'],
      credentials: true,
    }),
    urlencoded({ extended: true }),
    json(),
    helmet(),
    cookieParser(),
    // requestInfo(),
  )
  .use('/auth', authRouter)
  .use('/error', errorRouter)
  .use('/item', itemRouter)
  .use('/file', fileRouter)
  .get('/empty', ({}, res) => {
    res.status(204).send();
  })
  // No hostname : binds every interface. With a hostname, 'localhost' resolves to `::1`
  // on macOS and the server only listens in IPv6, while Firefox connects in IPv4 and
  // silently reaches whatever else holds the port.
  .listen(port);

server.on('error', ({ code }) => {
  console.error(`Test server cannot listen on port ${port} : ${code}. Is another server already running ?`);
  process.exit(1);
});

// `express` calls the `listen` callback even when the bind failed, so readiness is
// announced only once an address is actually assigned.
server.on('listening', () => {
  if (!server.address()) return;

  console.info(`Test server running on : http://localhost:${port}`);
  process.send?.(SERVER_READY);
});
