import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import { SERVER_READY } from '../fixtures.constants.mjs';
import { authRouter } from "./auth.router.mjs";
import { errorRouter } from './error.router.mjs';
import { fileRouter } from "./file.router.mjs";
import { itemRouter } from './item.router.mjs';

const hostname = 'localhost';
const port = 8080;

function requestInfo() {
  return ({ method, originalUrl }, _, next) => {
    console.info(`Request ${method} on route : ${originalUrl}`);
    next();
  }
}

express()
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
  .listen(port, hostname, () => {
    console.info(`Test server running on : http://${hostname}:${port}`);
    process.send?.(SERVER_READY);
  });
