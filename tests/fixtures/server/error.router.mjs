import { Router } from "express";
import { setTimeout } from "node:timers";

export const errorRouter = Router()
  .get('/401', handle401)
  .post('/401', handle401)
  .get('/408/:timeout', handle408)
  .get('/503', handle503)
  .get('/504', handle504);

function handle401({}, res) {
  sendError(res, 401, 'Unauthorized');
}

function handle408({ params: { timeout: rawTimeout } }, res) {
  if (!rawTimeout) return res.status(400).send(`Missing timeout path parameter !`);
  const timeout = parseInt(rawTimeout, 10);

  setTimeout(() => {
    sendError(res, 408, 'Request Timeout');
  }, timeout);
}

function handle503({ query: { format } }, res) {
  const delay = (format === 'date') ? new Date(new Date().getTime() + 1000) : 0.3
  res.append('retry-after', `${delay}`);
  sendError(res, 503, 'Service Unavailable');
}

function handle504({}, res) {
  sendError(res, 504, 'Gateway Timeout');
}

function sendError(res, status, name) {
  res.status(status).json({ name });
}
