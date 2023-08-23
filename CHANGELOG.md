# 1.1.0 (2023-08-24)

### Features

- Interceptors :
  - `beforeConsume` : before the request is launched.
  - `afterConsume` : when the response has been received.
  - `beforeResult` : before the `result` callback (observer) or before the `then()` arg callback (promise).
  - `beforeError` : before the `error` callback (observer) or before the `catch()` arg callback (promise).
  - `beforeFinish` : before the `finish` callback (observer) or before the `finally()` arg callback (promise).


- `HttpRequest` object for being passed into interceptors.

> Commits : https://github.com/remscodes/drino/commits/v1.1.0

# 1.0.0 (2023-08-19)

### Features

- Requests `GET`, `DELETE`, `HEAD`, `POST`, `PUT` and `PATCH`
- Instance : `create()` and `child()`
- Abort request
- Pipe methods : `transform()` and `check()`

> Commits : https://github.com/remscodes/drino/commits/v1.0.0
