import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
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
    cors(),
    requestInfo()
  )
  .use('/item', itemRouter)
  .listen(port, hostname, () => {
    console.info(`Test server running on : http://${hostname}:${port}`);
  });

