import { Router } from "express";
import { setTimeout } from "node:timers";

export const errorRouter = Router()
  .get('/401', handle401)
  .post('/401', handle401)
  .get('/408/:timeout', handle408Timeout)
  .get('/503', handle503)
  .get('/504', handle504);

function handle401(_, res) {
  sendError(res, 401, 'Unauthorized');
}

function handle408Timeout({ params: { timeout: rawTimeout } }, res) {
  const timeout = parseInt(rawTimeout, 10);
  setTimeout(() => {
    sendError(res, 408, 'Request Timeout');
  }, timeout);
}

function handle503(_, res) {
  sendError(res, 503, 'Service Unavailable');
}

function handle504(_, res) {
  sendError(res, 504, 'Gateway Timeout');
}

function sendError(res, status, name) {
  res.status(status).json({ name });
}
