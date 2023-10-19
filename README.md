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

## Basic Usage

### Example

```ts
import drino from 'drino';

type Cat = { name: string }

// With Observer's callbacks
drino.get('/cat/meow').consume({
  result: (res: Cat) => {
    // handle result 
  },
  error: (err: any) => {
    // handle error
  },
  finish: () => {
    // after result or error
  }
});

// With Promise async/await
async function getCatInfo() {
  try {
    const res: Cat = await drino.get('/cat/meow').consume();
    // handle result 
  }
  catch (err: any) {
    // handle error
  }
  finally {
    // after result or error
  }
}
```

### Request Methods

drino.get(url, config?)

drino.delete(url, config?)

drino.head(url, config?)

[//]: # (drino.options&#40;url, config?&#41;)

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
  headers?: Headers | Record<string, string>;

  // HTTP Parameters
  queryParams?: URLSearchParams | Record<string, string>;

  // Response type that will be passed into :
  // - result() callback when using Observer
  // - then() callback when using Promise
  // 
  // If 'auto' is specified, read will be deducted from "content-type" response header.
  // 
  // default: 'object'
  read?: 'object' | 'string' | 'blob' | 'arrayBuffer' | 'formData' | 'auto' | 'none';

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

```ts
import drino from 'drino';
import type { DrinoInstance } from 'drino';

const instance: DrinoInstance = drino.create({
  baseUrl: 'http://localhost:8080'
});

instance.get('/cat/meow').consume() // GET -> http://localhost:8080/cat/meow
```

You can create another instance from a parent instance to inherit its config by using `child` method :

```ts
const child: DrinoInstance = instance.child({
  requestsConfig: {
    prefix: '/cat'
  }
});

child.get('/meow').consume() // GET -> http://localhost:8080/cat/meow
```

### Instance Config

```ts
interface DrinoDefaultConfig {
  // Base URL
  // Example : 'https://example.com/v1/api'
  //
  // default: 'http://localhost'
  baseUrl?: string;

  // Interceptors in order to take action during http request lifecyle.
  //
  // See below in section 'Interceptors'
  interceptors?: {
    beforeConsume?: (request: HttpRequest) => void;
    afterConsume?: (request: HttpRequest) => void;
    beforeResult?: (result: any) => void;
    beforeError?: (errorResponse: HttpErrorResponse) => void;
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

## Advanced Usage

### Pipe methods

Before calling `consume()` method, you can chain call methods to modify or inspect the current value before being passed
into final callbacks.

#### Transform

Change the result value.

Example :

```ts
drino.get<Cat>('/cat/meow')
  .transform((res: Cat) => res.name)
  .consume({
    result: (name: string) => {
      // handle value
    }
  });
```

#### Check

Read the result value without changing it.

Example :

```ts
drino.get<Cat>('/cat/meow')
  .check((res: Cat) => console.log(res)) // (1)
  .consume({
    result: (res: Cat) => {
      // Output (1) : { name: "Gaïa" }
      // handle value
    }
  });
```

#### Report

Read the error value without changing it.

Example :

```ts
drino.get<Cat>('/cat/meow')
  .report((err: any) => console.error(err.name)) // (1)
  .consume({
    error: (err: any) => {
      // Output (1) : "ErrorName" 
      // handle error
    }
  });
```

#### Finalize

Finalize when controller finished.

Example :

```ts
drino.get<Cat>('/cat/meow')
  .finalize(() => console.log('Finished')) // (1)
  .consume({
    finish: () => {
      // Output (1) : "Finished"
    }
  });
```

#### Follow

Make another http request sequentially that depends on previous one.

Example :

```ts
drino.get<Cat>('/cat/meow')
  .follow((cat: Cat) => drino.get<Dog>(`/dog/wouaf/cat-friend/${cat.name}`))
  .consume({
    result: (res: Dog) => {
      // handle value
    }
  });
```

#### Methods combination

Pipe methods can be combined.

Example :

```ts
drino.get<Cat>('/cat/meow')
  .check((val: Cat) => console.log(val)) // (1)
  .transform((val: Cat) => cat.name)
  .check((val: string) => console.log(val)) // (2)
  .consume({
    result: (name: string) => {
      // Output (1) : { name: "Gaïa" }
      // Output (2) : "Gaïa"
      // handle value
    }
  });
```

### Interceptors

You can intercept request, result or error throughout the http request lifecycle.

Interceptors can be passed into instance config .

```ts
const instance: DrinoInstance = drino.create({
  interceptors: {
    // ...
  }
});
```

#### Before consume

Intercept a `HttpRequest` before the request is launched.

Example :

```ts
const instance: DrinoInstance = drino.create({
  interceptors: {
    beforeConsume: (request: HttpRequest) => {
      const token: string = myService.getToken();
      request.headers.set('Authorization', `Bearer ${token}`);
    }
  }
});
```

#### After consume

Intercept a `HttpRequest` just after the response has been received.

Example :

```ts
const instance: DrinoInstance = drino.create({
  interceptors: {
    afterConsume: (request: HttpRequest) => {
      console.info(`Response received from ${request.url}`);
    }
  }
});
```

#### Before result

Intercept a result before being passed into `result` callback (Observer) or into `then()` arg callback (Promise).

Example :

```ts
const instance: DrinoInstance = drino.create({
  interceptors: {
    beforeResult: (result: any) => {
      console.info(`Result : ${result}`);
    }
  }
});
```

#### Before error

Intercept an error before being passed into `error` callback (Observer) or into `catch()` arg callback (Promise).

Example :

```ts
const instance: DrinoInstance = drino.create({
  interceptors: {
    beforeError: (errorResponse: HttpErrorResponse) => {
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
const instance: DrinoInstance = drino.create({
  interceptors: {
    beforeFinish: () => {
      console.info('Finished');
    }
  }
});
```

### Progress capturing

You can inspect download progress with `downloadProgress` observer's callback.

Progress capturing can be disabled for the instance or for the request by set `inspect: false` into ProgressConfig in RequestConfig.

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

Example : 

```ts
import type { DrinoProgressEvent } from 'drino';

drino.get('/cat/image').consume({
  downloadProgress: ({ loaded, total, iteration }: DrinoProgressEvent) => {
    console.info(`(Iteration n°${iteration}) Received ${loaded} bytes of ${total}.`);
    if (loaded === total) console.info('Done.')
  },
  result: (res) => {
    // handle result
  },
});
```

### Request annulation

#### AbortController

You can cancel a send request (before receive response) by using `AbortSignal` and `AbortController`.

Example :

```ts
const abortCtrl: AbortController = new AbortController();
const signal: AbortSignal = abortCtrl.signal;

setTimeout(() => abortCtrl.abort('Too Long'), 2_000);

// With Observer
drino.get<Cat>('/cat/meow', { signal }).consume({
  result: (res: Cat) => {
    // handle result
  },
  abort: (reason: any) => {
    console.error(reason); // "Too Long"
    // handle abort reason
  }
});

// With Promise async/await
async function getCatInfo() {
  try {
    const result: Cat = await drino.get<Cat>('/cat/meow', { signal }).consume();
    // handle result
  }
  catch (err: any) {
    if (signal.aborted) {
      const reason: any = signal.reason;
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
drino.get<Cat>('/cat/meow', { timeoutMs: 2_000 }).consume({
  result: (res: Cat) => {
    // handle result
  },
  error: (err: any) => {
    console.error(err.message); // "The operation timed out."
    // handle timeout error
  }
});

// With Promise async/await
async function getCatInfo() {
  try {
    const result: Cat = await drino.get<Cat>('/cat/meow', { timeoutMs: 2_000 }).consume();
    // handle result
  }
  catch (err: any) {
    const message: string = err.message;
    console.error(message); // "The operation timed out."
    // handle timeout error
  }
}
```

### Request retry

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

When using Observer you can use the `retry` callback to get info about current retry via `RetryArgs`.

```ts
export interface RetryArgs {
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
import type { RetryArgs } from 'drino';

instance.get('/my-failed-api').consume({
  retry: ({ count, error, abort }: RetryArgs) => {
    console.log(`Will retry for the ${count} time caused by the error : ${error}.`);
    if (count > 2) abort('Too many retries.');
  },
  abort: (reason: any) => {
    console.log(reason); // "Too many retries."
  }
});
```

## License

[MIT](LICENSE) © Rémy Abitbol.
