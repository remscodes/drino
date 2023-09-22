import { Router } from "express";
import { setTimeout } from "node:timers";

export const errorRouter = Router()
  .get('/401', (_, res) => {
    res.status(401).json({
      name: 'Unauthorized',
    });
  })
  .get('/408/:timeout', ({ params: { timeout: rawTimeout } }, res) => {
    const timeout = parseInt(rawTimeout, 10);
    setTimeout(() => {
      res.status(408).json({
        name: 'Request Timeout'
      });
    }, timeout);
  })
  .get('/503', (_, res) => {
    res.status(504).json({
      name: 'Service Unavailable'
    })
  })
  .get('/504', (_, res) => {
    res.status(504).json({
      name: 'Gateway Timeout'
    })
  });
