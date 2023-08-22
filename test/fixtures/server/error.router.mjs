import { Router } from "express";

export const errorRouter = Router()
  .get('/401', (_, res) => {
    res.status(401).json({
      name: 'Bad Token',
      message: 'Token expired.'
    });
  });
