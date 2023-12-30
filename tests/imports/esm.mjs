import drino, { HttpErrorResponse } from 'drino';

const instance = drino.create({});

const error = new HttpErrorResponse({
  error: '',
  url: 'http://localhost:8080',
  headers: new Headers(),
  status: 0,
  statusText: '',
});
