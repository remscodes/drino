<div align="center">
    <h1>Drino</h1>
    <p>Modern and Reactive HTTP Client</p>
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
    - [Pipe Methods](#pipe-methods)
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

  // AbortSignal to cancel HTTP Request with an AbortController.
  // See below in section 'Abort Request'.
  signal?: AbortSignal;

  // Time limit from which the request is aborted.
  //
  // default: 0 (= meaning disabled)
  //
  // See below in section 'Timeout'.
  timeoutMs?: number;

  // Retry a failed request a certain number of times on a specific http status.
  // See below in section 'Request retry'.
  retry?: RetryConfig;

  // Config to inspect download progress.
  // See below in section 'Progress capturing'.
  progress?: ProgressConfig;
}
```

### Instance

Instance can be created to embded common configuration to all requests produced from this instance.

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
interface DrinoDefaultConfig {
  // Base URL
  // Example : 'https://example.com/v1/api'
  //
  // default: 'http://localhost'
  baseUrl?: string | URL;

  // Interceptors in order to take action during http request lifecyle.
  //
  // See below in section 'Interceptors'
  interceptors?: {
    beforeConsume?: (req: HttpRequest) => void;
    afterConsume?: (req: HttpRequest) => void;
    beforeResult?: (res: any) => void;
    beforeError?: (errRes: HttpErrorResponse) => void;
    beforeFinish?: () => void;
  };

  // Default requestConfig applied to all requests hosted by the instance
  // See above in section 'Request Config'
  requestsConfig?: RequestConfig;
}
```

You can override config applied to a `drino` instance (default import or created instance).

```ts
drino.default.baseUrl = 'https://example.com';
drino.default.requestsConfig.headers.set('Custom-Header', 'Cat');

drino.get('/cat/meow').consume(); // GET -> https://example.com/cat/meow (headers = { "Custom-Header", "Cat" })
```

### Plugin

You can use third-party plugin to add more features.

```ts
drino.use(myPlugin);
```

Plugin example : [drino-rx](https://github.com/remscodes/drino-rx)

## Advanced Usage

### Interceptors

You can intercept request, result or error throughout the http request lifecycle.

Interceptors can be passed into instance config .

```ts
const instance = drino.create({
  interceptors: {
    // ...
  }
});
```

#### Before consume

Intercept a `HttpRequest` before the request is launched.

Example :

```ts
const instance = drino.create({
  interceptors: {
    beforeConsume: (req) => {
      const token = myService.getToken();
      req.headers.set('Authorization', `Bearer ${token}`);
    }
  }
});
```

#### After consume

Intercept a `HttpRequest` just after the response has been received.

Example :

```ts
const instance = drino.create({
  interceptors: {
    afterConsume: (req) => {
      console.info(`Response received from ${req.url}`);
    }
  }
});
```

#### Before result

Intercept a result before being passed into `result` callback (Observer) or into `then()` arg callback (Promise).

Example :

```ts
const instance = drino.create({
  interceptors: {
    beforeResult: (res) => {
      console.info(`Result : ${res}`);
    }
  }
});
```

#### Before error

Intercept an error before being passed into `error` callback (Observer) or into `catch()` arg callback (Promise).

Example :

```ts
const instance = drino.create({
  interceptors: {
    beforeError: (errorResponse) => {
      if (errorResponse.status === 401) {
        myService.clearToken();
        myService.navigateToLogin();
      }
      else {
        console.error(`Error ${errorResponse.status} from ${errorResponse.url} : ${errorResponse.error}`);
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

You can inspect download progress with `downloadProgress` observer's callback.

Progress capturing can be disabled for the instance or for the request by set `inspect: false` into ProgressConfig in
RequestConfig.

```ts
interface ProgressConfig {
  download?: {
    // Enable download progress.
    //
    // default : true
    inspect?: boolean;
  };
}
```

A `StreamProgressEvent` is passed to `downloadProgress` callback for each progress iteration.

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
  remainingMs: number;

  // Current chunk received or sent.
  chunk: Uint8Array;

  // Current iteration number of the progress.
  iteration: number;
}
```

Example :

```ts
drino.get('/cat/image').consume({
  downloadProgress: ({ loaded, total, percent, speed, remainingTimeMs }) => {
    const remainingSeconds = remainingTimeMs / 1000;
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

### Pipe Methods

Before calling `consume()` method, you can chain call methods to modify or inspect the current value before being passed
into final callbacks.

#### Transform

Change the result value.

Example :

```ts
drino.get('/cat/meow')
  .transform((res) => res.name)
  .consume({
    result: (name) => {
      // handle value
    },
  });
```

#### Check

Read the result value without changing it.

Example :

```ts
drino.get('/cat/meow')
  .check((res) => console.log(res)) // { name: "Gaïa" }
  .consume({
    result: (res) => {
      // handle value
    }
  });
```

#### Report

Read the error value without changing it.

Example :

```ts
drino.get('/cat/meow')
  .report((err) => console.error(err.name)) // "ErrorName" 
  .consume({
    result: (res) => {
      // handle value
    }
  });
```

#### Finalize

Finalize when controller finished.

Example :

```ts
drino.get('/cat/meow')
  .finalize(() => console.log('Finished')) // "Finished"
  .consume({
    result: (res) => {
      // handle value
    }
  });
```

#### Follow

Make another http request sequentially that depends on previous one.

Example :

```ts
drino.get('/cat/meow')
  .follow((cat) => drino.get(`/dog/wouaf/cat-friend/${cat.name}`))
  .consume({
    result: (res) => {
      // handle value
    }
  });
```

#### Methods combination

Pipe methods can be combined.

Example :

```ts
drino.get('/cat/meow')
  .check((cat) => console.log(cat)) // { name: "Gaïa" }
  .transform((cat) => cat.name)
  .check((name) => console.log(name)) // "Gaïa"
  .consume({
    result: (name) => {
      // handle value
    }
  });
```

### Request Annulation

#### AbortController

You can cancel a send request (before receive response) by using `AbortSignal` and `AbortController`.

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

You can cancel a send request after a certain time using a `timeoutMs` (timeout in milliseconds).

Example :

```ts
// With Observer
drino.get('/cat/meow', { timeoutMs: 2_000 }).consume({
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
    const res = await drino.get('/cat/meow', { timeoutMs: 2_000 }).consume();
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

You can automatically retry failed request on conditions.

```ts
interface RetryConfig {
  // Maximum retries to do on failed request.
  //
  // default: 0
  max: number;

  // Use the "Retry-After" response Header to know how much time it waits before retry.
  //
  // default: true
  withRetryAfter?: boolean;

  // Specify the time in millisecond to wait before retry.
  //
  // Work only if `withRetryAfter` is `false` or if "Retry-After" response header is not present.
  //
  // default: 0
  withDelayMs?: number;

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
  onMethods?: '*' | string[];
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

When using Observer you can use the `retry` callback to get info about current retry via `RetryEvent`.

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
