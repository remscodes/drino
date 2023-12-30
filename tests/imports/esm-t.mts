import drino, { type DrinoInstance, HttpErrorResponse } from 'drino';

const instance: DrinoInstance = drino.create({});

const error = new HttpErrorResponse({
  error: '',
  url: 'http://localhost:8080',
  headers: new Headers(),
  status: 0,
  statusText: '',
});
