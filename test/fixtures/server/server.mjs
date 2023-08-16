import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import { itemRouter } from './item.router.mjs';

const hostname = 'localhost';
const port = 8080;

express()
  .use(
    urlencoded({ extended: true }),
    json(),
    helmet(),
    cors(),
    ({ method, originalUrl }, _, next) => {
      console.log(`Request ${method} on route : ${originalUrl}`);
      next();
    }
  )
  .use('/item', itemRouter)
  .listen(port, hostname, () => {
    console.info(`Test server running on : http://${hostname}:${port}`);
  });

