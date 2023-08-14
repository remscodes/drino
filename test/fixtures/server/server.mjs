import cors from 'cors';
import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import { Item } from "./item.mjs";
import { itemRouter } from './item.router.mjs';
import { service } from "./item.service.mjs";

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
    service.create(new Item('My First Item'));
    service.create(new Item('My Second Item'));
    service.create(new Item('My Third Item'));
    console.info(`Testing server running on : http://${hostname}:${port}`);
  });

