import { Router } from "express";

const TOKEN_KEY = 'JWT';

export const authRouter = Router()
  .post('/login', ({}, res) => {
    res.cookie(TOKEN_KEY, '1234', {
      httpOnly: true,
      secure: false,
      priority: 'high',
      maxAge: 2000,
    }).status(204).send();
  })
  .get('/context', ({ cookies }, res) => {
    if (!cookies[TOKEN_KEY]) return res.status(401).json({ name: 'Unauthorized' });

    res.status(200).json({ token: cookies[TOKEN_KEY] });
  });
