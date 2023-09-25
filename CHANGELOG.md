# 1.5.0 (2023-09-25)

### Features

- Request retry.

> Commits : https://github.com/remscodes/drino/commits/v1.5.0

# 1.4.0 (2023-09-18)

### Features

- Add new pipe method : `follow`.
- Add plugin compatibility with `drino.use`.

> Commits : https://github.com/remscodes/drino/commits/v1.4.0

# 1.3.0 (2023-09-09)

### Features

- Add new pipe methods : `report` and `finalize`.

### Improvements

- `Url` type is no longer restricted by specific prefix.
- Interceptors are moved from `requestConfig` to instance config.

> Commits : https://github.com/remscodes/drino/commits/v1.3.0

# 1.2.1 (2023-08-28)

### Fixes

- URL Pathname RegExp.

> Commits : https://github.com/remscodes/drino/commits/v1.2.1

# 1.2.0 (2023-08-28)

### Features

- Timeout request.

### Improvements

- `baseUrl` for instance config.
- `prefix` and `url` for request config.
- `Content-Type` header inferred from body type.

> Commits : https://github.com/remscodes/drino/commits/v1.2.0

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

- Requests `GET`, `DELETE`, `HEAD`, `POST`, `PUT` and `PATCH`.
- Instance : `create()` and `child()`.
- Abort request.
- Pipe methods : `transform()` and `check()`.

> Commits : https://github.com/remscodes/drino/commits/v1.0.0
