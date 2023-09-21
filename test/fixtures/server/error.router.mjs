import { Router } from "express";

export const errorRouter = Router()
  .get('/401', (_, res) => {
    res.status(401).json({
      name: 'Bad Token',
      message: 'Token expired.'
    });
  })
  .get('/408', (_, res) => {
    res.status(504).json({
      name: 'Request Timeout'
    })
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
