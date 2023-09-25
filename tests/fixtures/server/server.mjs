import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import { SERVER_READY } from '../fixtures.constants.mjs';
import { errorRouter } from './error.router.mjs';
import { itemRouter } from './item.router.mjs';

const hostname = 'localhost';
const port = 8080;

function requestInfo() {
  return ({ method, originalUrl }, _, next) => {
    // console.info(`Request ${method} on route : ${originalUrl}`);
    next();
  }
}

express()
  .use(
    urlencoded({ extended: true }),
    json(),
    helmet(),
    cors({ exposedHeaders: '*' }),
    requestInfo()
  )
  .use('/item', itemRouter)
  .use('/error', errorRouter)
  .listen(port, hostname, () => {
    console.info(`Test server running on : http://${hostname}:${port}`);
    process.send?.(SERVER_READY);
  });

