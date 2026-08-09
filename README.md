<div align="center">
    <h1>Drino</h1>
    <p>Flexible and Reactive HTTP Client</p>
</div>

<div align="center">

[![github ci](https://img.shields.io/github/actions/workflow/status/remscodes/drino/npm-ci.yml.svg?&logo=github&label=CI&style=for-the-badge)](https://github.com/remscodes/drino/actions/workflows/npm-ci.yml)
[![codecov coverage](https://img.shields.io/codecov/c/github/remscodes/drino/main.svg?style=for-the-badge&logo=codecov)](https://codecov.io/gh/remscodes/drino)
[![npm version](https://img.shields.io/npm/v/drino.svg?&style=for-the-badge&logo=npm)](https://www.npmjs.org/package/drino)
[![bundle size](https://img.shields.io/bundlephobia/minzip/drino.svg?style=for-the-badge)](https://bundlephobia.com/package/drino)
[![license](https://img.shields.io/github/license/remscodes/drino.svg?style=for-the-badge)](LICENSE)

</div>

## Installation

```shell
npm install drino
```

## Table of contents

- [Basic Usage](#basic-usage)
    - [Example](#example)
    - [Request Methods](#request-methods)
    - [Request Config](#request-config)
    - [Instance](#instance)
    - [Plugin](#plugin)
- [Advanced Usage](#advanced-usage)
    - [Interceptors](#interceptors)
    - [Progress Capturing](#progress-capturing)
    - [Pipe Operators](#pipe-operators)
    - [Request Annulation](#request-annulation)
    - [Request Retry](#request-retry)
- [React Native support](#react-native-support)

## Basic Usage

### Example

```ts
import drino from 'drino';

// With Observer's callbacks
drino.get('/cat/meow').consume({
  result: (res) => {
    // handle result 
  },
  error: (err) => {
    // handle error
  },
  finish: () => {
    // after result or error
  }
});

// With Promise async/await
async function getCatInfo() {
  try {
    const res = await drino.get('/cat/meow').consume();
    // handle result 
  }
  catch (err) {
    // handle error
  }
  finally {
    // after result or error
  }
}
```

### Request Methods

drino.get(url, config?)

drino.head(url, config?)

drino.delete(url, config?)

drino.post(url, body, config?)

drino.put(url, body, config?)

drino.patch(url, body, config?)

Each of them builds a request controller : **nothing is sent until `consume()` is called**. `head`
resolves the response `Headers` instead of a body.

### Request Config

```ts
interface RequestConfig {
  // Prefix URL
  // Example : 'https://example.com' OR '/api'
  prefix?: string;

  // HTTP Headers
  headers?: Headers | Record<string, any>;

  // HTTP Parameters
  queryParams?: URLSearchParams | Record<string, any>;

  // Response type that will be passed into :
  // - `result` callback when using Observer
  // - `then` callback when using Promise
  // 
  // If 'auto' is specified, the response type will be inferred from "content-type" response header.
  // 
  // default: 'auto'
  read?: 'auto' | 'object' | 'string' | 'blob' | 'arrayBuffer' | 'formData' | 'none';

  // Wrap response body into a specific Object.
  // - 'response' : HttpResponse
  // - 'none' : nothing
  //
  // default: 'none'
  wrapper?: 'none' | 'response';

  // Context to be used with interceptors.
  context?: (ctx: HttpContext) => HttpContext;

  // AbortSignal to cancel HTTP Request with an AbortController.
  // See below in section 'Request Annulation'.
  signal?: AbortSignal;

  // Time limit in milliseconds from which the request is aborted.
  //
  // default: 0 (= meaning disabled)
  //
  // See below in section 'Timeout'.
  timeout?: number;

  // Retry a failed request a certain number of times on a specific http status.
  // See below in section 'Request Retry'.
  retry?: RetryConfig;

  // The `fetch` function used to perform the request.
  //
  // default: globalThis.fetch
  fetch?: typeof fetch;

  // Passed through to `fetch`.
  credentials?: RequestCredentials;    // default: 'same-origin'
  mode?: RequestMode;                  // default: 'cors'
  priority?: RequestPriority;          // default: 'auto'
  cache?: RequestCache;                // default: 'default'
  redirect?: RequestRedirect;          // default: 'follow'
  keepalive?: boolean;                 // default: false
  referrerPolicy?: ReferrerPolicy;     // default: 'origin-when-cross-origin'
  integrity?: string;
}
```

Download progress is not configured here : it is enabled by providing a `download` callback (see
[Progress Capturing](#progress-capturing)).

### Instance

An instance can be created to embed a common configuration into all requests produced from this instance.

```ts
import drino from 'drino';

const instance = drino.create({
  baseUrl: 'http://localhost:8080'
});

instance.get('/cat/meow').consume() // GET -> http://localhost:8080/cat/meow
```

You can create another instance from a parent instance to inherit its config by using `child` method :

```ts
const child = instance.child({
  requestsConfig: {
    prefix: '/cat'
  }
});

child.get('/meow').consume() // GET -> http://localhost:8080/cat/meow
```

#### Instance Config

```ts
interface DrinoConfig {
  // Base URL
  // Example : 'https://example.com/v1/api'
  //
  // default: the current page origin (`window.location.origin`), or '' outside a browser
  baseUrl?: string | URL;

  // Interceptors to take action during http request lifecyle.
  //
  // See below in section 'Interceptors'
  interceptors?: {
    beforeConsume?: ({ req, ctx, abort }) => Promise<void> | void;
    afterConsume?: ({ req, ctx, res, ok }) => Promise<void> | void;
    beforeResult?: ({ req, ctx, res }) => Promise<void> | void;
    beforeError?: ({ req, ctx, errRes, err }) => Promise<void> | void;
    beforeFinish?: ({ req, ctx }) => Promise<void> | void;
  };

  // Default config applied to all requests hosted by the instance.
  // See above in section 'Request Config'.
  //
  // `read`, `wrapper` and `signal` can only be set per request.
  // `retry` accepts the extra `onMethods` option at this level.
  requestsConfig?: DrinoDefaultRequestsConfigInit;
}
```

You can override config applied to a `drino` instance (default import or created instance).

```ts
drino.default.baseUrl = 'https://example.com';
drino.default.requestsConfig.headers.set('Custom-Header', 'Cat');

drino.get('/cat/meow').consume(); // GET -> https://example.com/cat/meow (headers = { "Custom-Header", "Cat" })
```

### Plugin

You can use a third-party plugin to add more features.

```ts
drino.use(myPlugin);
```

Plugin example : [drino-rx](https://github.com/remscodes/drino-rx)

## Advanced Usage

### Interceptors

You can intercept request, result or error throughout the http request lifecycle.

Interceptors can be passed into instance config.

```ts
const instance = drino.create({
  interceptors: {
    // ...
  }
});
```

Every interceptor receives a single object argument and can be `async` : it is awaited before the
lifecycle goes on. All of them receive at least `req` (the `HttpRequest`) and `ctx` (the `HttpContext`
shared by all interceptors of the same request).

Interceptors of a child instance run after those of its parent.

#### Before consume

Intercept a `HttpRequest` before the request is launched.

It also receives an `abort` function to cancel the request before it is even sent.

Example :

```ts
const instance = drino.create({
  interceptors: {
    beforeConsume: ({ req }) => {
      const token = myService.getToken();
      req.headers.set('Authorization', `Bearer ${token}`);
    }
  }
});
```

#### After consume

Intercept just after the response has been received, whether it succeeded or not.

`ok` discriminates the response type : `res` is a `HttpResponse` when `ok` is `true`, a
`HttpErrorResponse` otherwise.

It is called once per request, not once per retry.

Example :

```ts
const instance = drino.create({
  interceptors: {
    afterConsume: ({ req, res, ok }) => {
      console.info(`Response ${res.status} received from ${req.url} (ok: ${ok})`);
    }
  }
});
```

#### Before result

Intercept a result before being passed into `result` callback (Observer) or into `then()` arg callback (Promise).

`res` is always the full `HttpResponse`, even when `wrapper` is `'none'`.

Example :

```ts
const instance = drino.create({
  interceptors: {
    beforeResult: ({ res }) => {
      console.info(`Result : ${res.body}`);
    }
  }
});
```

#### Before error

Intercept an error before being passed into `error` callback (Observer) or into `catch()` arg callback (Promise).

It is called once the retries — if any — have all failed.

Example :

```ts
const instance = drino.create({
  interceptors: {
    beforeError: ({ errRes }) => {
      if (errRes.status === 401) {
        myService.clearToken();
        myService.navigateToLogin();
      }
      else {
        console.error(`Error ${errRes.status} from ${errRes.url} : ${errRes.error}`);
      }
    }
  }
});
```

#### Before finish

Intercept before being passed into `finish` callback (Observer) or into `finally()` arg callback (Promise).

Example :

```ts
const instance = drino.create({
  interceptors: {
    beforeFinish: () => {
      console.info('Finished');
    }
  }
});
```

### Progress Capturing

#### Download

You can inspect download progress with the `download` observer's callback, or with the
[`onDownload`](#pipe-operators) pipe operator.

There is nothing to enable : the response stream is only inspected when a `download` callback is
present (and the response is not a `204 No Content`).

A `StreamProgressEvent` is passed to the `download` callback for each progress iteration.

```ts
export interface StreamProgressEvent {
  // Total bytes to be received or to be sent;
  total: number;

  // Total bytes received or sent.
  loaded: number;

  // Current percentage received or sent.
  // Between 0 and 1.
  percent: number;

  // Current speed in bytes/ms.
  // Equals to `0` for the first `iteration`.
  speed: number;

  // Estimated remaining time in milliseconds to complete the progress.
  // Equals to `0` for the first `iteration`.
  remainingTime: number;

  // Current chunk received or sent.
  chunk: Uint8Array;

  // Current iteration number of the progress.
  iteration: number;
}
```

Example :

```ts
drino.get('/cat/image').consume({
  download: ({ loaded, total, percent, speed, remainingTime }) => {
    const remainingSeconds = remainingTime / 1000;
    const speedKBs = speed / 1024 * 1000;

    console.info(`Received ${loaded} of ${total} bytes (${Math.floor(percent * 100)} %).`);
    console.info(`Speed ${speedKBs.toFixed(1)} KB/s | ${remainingSeconds.toFixed(2)} seconds remaining.`);

    if (loaded === total) console.info('Download completed.');
  },
  result: (res) => {
    // handle result
  }
});
```

### Pipe Operators

Before calling `consume()`, you can pass operators to `pipe()` to modify or inspect the current value
before it is passed into the final callbacks.

Example :

```ts
import drino, { mapResult, tap } from 'drino';

drino.get('/cat/meow')
  .pipe(
    tap({ result: (cat) => console.log(cat) }), // { name: "Gaïa" }
    mapResult((cat) => cat.name),
  )
  .consume({
    result: (name) => {
      // handle value -> "Gaïa"
    }
  });
```

`pipe()` is **immutable** : it returns a new controller and leaves the source untouched, so a piped
controller can be stored, reused and consumed several times.

```ts
const req = drino.get('/cat/meow');
const name = req.pipe(mapResult((cat) => cat.name));

await req.consume();  // { name: "Gaïa" }
await name.consume(); // "Gaïa"
await name.consume(); // "Gaïa" — consumed again, new http request
```

#### Available operators

| Operator | Signature | Description |
|---|---|---|
| `mapResult` | `(res: T1) => T2 \| Promise<T2>` | Change the result value. |
| `tap` | `Observer<T>` | Read the value and lifecycle events without changing them. |
| `reportError` | `(err: any) => void` | Read the error value without changing it. |
| `finalize` | `() => void` | Run a callback when the controller finished (result, error or abort). |
| `onAbort` | `(reason: any) => void` | Run a callback when the request is aborted. |
| `onRetry` | `(ev: RetryEvent) => void` | Run a callback on each retry. |
| `onDownload` | `(ev: StreamProgressEvent) => void` | Run a callback on each download progress iteration. |
| `delay` | `(ms: number)` | Delay the emission of the result. |
| `follow` | `(res: T1) => RequestController<T2>` | Make another http request that depends on the previous one. |

#### Map result

Change the result value. The mapper can be asynchronous.

```ts
drino.get('/cat/meow')
  .pipe(mapResult((cat) => cat.name))
  .consume({
    result: (name) => {
      // handle value -> "Gaïa"
    }
  });
```

#### Tap

Read the value without changing it. It accepts a full Observer, so any of its callbacks can be used.

```ts
drino.get('/cat/meow')
  .pipe(
    tap({
      result: (cat) => console.log(cat), // { name: "Gaïa" }
      error: (err) => console.error(err),
      finish: () => console.log('Finished'),
    })
  )
  .consume();
```

#### Report error

Read the error value without changing it.

```ts
drino.get('/cat/meow')
  .pipe(reportError((err) => console.error(err.status))) // 404
  .consume({
    result: (res) => {
      // handle value
    }
  });
```

#### Finalize

Run a callback when the controller finished.

```ts
drino.get('/cat/meow')
  .pipe(finalize(() => console.log('Finished'))) // "Finished"
  .consume({
    result: (res) => {
      // handle value
    }
  });
```

#### On abort / On retry / On download

Same callbacks as the ones of the Observer passed to `consume()`, but attached to the pipe.

```ts
drino.get('/cat/image')
  .pipe(
    onRetry(({ count }) => console.log(`Retry n°${count}`)),
    onDownload(({ percent }) => console.log(`${Math.floor(percent * 100)} %`)),
    onAbort((reason) => console.error(reason)),
  )
  .consume();
```

#### Delay

Delay the emission of the result by a given time in milliseconds.

```ts
drino.get('/cat/meow')
  .pipe(delay(1_000)) // result emitted 1 second later
  .consume();
```

#### Follow

Make another http request sequentially that depends on the previous one.

```ts
drino.get('/cat/meow')
  .pipe(follow((cat) => drino.get(`/dog/wouaf/cat-friend/${cat.name}`)))
  .consume({
    result: (res) => {
      // handle the dog
    }
  });
```

#### Custom operators

An operator is simply a function taking a `RequestController` and returning another one. Two helpers
are exported to build them : `pipeToMap` to transform the value, `pipeToObserve` for side effects.

```ts
import { Pipeline, pipeToMap, pipeToObserve } from 'drino';

function extractField<T, K extends keyof T>(field: K): Pipeline<T, T[K]> {
  return pipeToMap((res) => res[field]);
}

function logAll<T>(prefix: string): Pipeline<T> {
  return pipeToObserve({
    result: (res) => console.log(prefix, res),
    error: (err) => console.error(prefix, err),
  });
}

drino.get('/cat/meow')
  .pipe(logAll('[cat]'), extractField('name'))
  .consume();
```

### Request Annulation

#### AbortController

You can cancel a sent request (before receive response) by using `AbortSignal` and `AbortController`.

Example :

```ts
const controller = new AbortController();
const signal = controller.signal;

setTimeout(() => controller.abort('Too Long'), 2_000);

// With Observer
drino.get('/cat/meow', { signal }).consume({
  result: (res) => {
    // handle result
  },
  abort: (reason) => {
    console.error(reason); // "Too Long"
    // handle abort reason
  }
});

// With Promise async/await
async function getCatInfo() {
  try {
    const result = await drino.get('/cat/meow', { signal }).consume();
    // handle result
  }
  catch (err) {
    if (signal.aborted) {
      const reason = signal.reason;
      console.error(reason); // "Too Long"
      // handle abort reason
    }
  }
}
```

#### Timeout

You can cancel a sent request after a certain time using `timeout` (in milliseconds).

Example :

```ts
// With Observer
drino.get('/cat/meow', { timeout: 2_000 }).consume({
  result: (res) => {
    // handle result
  },
  error: (err) => {
    console.error(err.message); // "The operation timed out."
    // handle timeout error
  },
});

// With Promise async/await
async function getCatInfo() {
  try {
    const res = await drino.get('/cat/meow', { timeout: 2_000 }).consume();
    // handle result
  }
  catch (err) {
    const message = err.message;
    console.error(message); // "The operation timed out."
    // handle timeout error
  }
}
```

### Request Retry

You can automatically retry a failed request on conditions.

```ts
interface RetryConfig {
  // Maximum retries to do on failed request.
  //
  // default: 0
  max?: number;

  // Use the "Retry-After" response Header to know how much time it waits before retry.
  //
  // default: true
  withRetryAfter?: boolean;

  // Specify the time in milliseconds to wait before retry.
  //
  // Work only if `withRetryAfter` is `false` or if "Retry-After" response header is not present.
  //
  // default: 0
  delay?: number;

  // HTTP response status code to filter which request should be retried on failure.
  //
  // default: [408, 429, 503, 504]
  onStatus?: number[] | { start: number, end: number } | { start: number, end: number }[];

  // Http method to filter which request should be retried on failure.
  // Can only be used for instance configuration.
  // 
  // "*" means all methods.
  //
  // Example: ["GET", "POST"]
  // 
  // default: "*"
  onMethods?: '*' | RequestMethodType[];
}
```

Example :

```ts
const instance = drino.create({
  requestsConfig: {
    retry: { max: 2, onMethods: ['GET'] }
  }
});

instance.get('/my-failed-api', {
  retry: { max: 1 }
});
```

You can use the `retry` observer callback — or the [`onRetry`](#pipe-operators) operator — to get info
about the current retry via `RetryEvent`.

```ts
export interface RetryEvent {
  // Current retry count.
  count: number;

  // Error that causes the retry.
  error: any;

  // Function to abort retrying.
  abort: (reason?: any) => void;

  // Current retry delay.
  delay: number;
}
```

Example :

```ts
instance.get('/my-failed-api').consume({
  retry: ({ count, error, abort }) => {
    console.log(`Will retry for the ${count} time caused by the error : ${error}.`);
    if (count > 2) abort('Too many retries.');
  },
  abort: (reason) => {
    console.log(reason); // "Too many retries."
  }
});
```

## React Native support

Install `react-native-url-polyfill` and add the following line at the top of your `index.js` file :

```js
import 'react-native-url-polyfill/auto';
```

## License

[MIT](LICENSE) © Rémy Abitbol.
