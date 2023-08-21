<div align="center">
    <h1>Drino</h1>
    <p>Intuitive and Typed HTTP Client</p>
</div>

<div align="center">

[![github ci](https://img.shields.io/github/actions/workflow/status/remscodes/drino/npm-ci.yml.svg?&logo=github&label=CI&style=for-the-badge)](https://github.com/remscodes/thror/actions/workflows/npm-ci.yml)
[![codecov coverage](https://img.shields.io/codecov/c/github/remscodes/drino/main.svg?style=for-the-badge&logo=codecov)](https://codecov.io/gh/remscodes/thror)
[![npm version](https://img.shields.io/npm/v/drino.svg?&style=for-the-badge&logo=npm)](https://www.npmjs.org/package/thror)
[![bundle size](https://img.shields.io/bundlephobia/minzip/drino.svg?style=for-the-badge)](https://bundlephobia.com/package/drino)
[![license](https://img.shields.io/github/license/remscodes/thror.svg?style=for-the-badge)](LICENSE)

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

// With Promise then/catch
drino.get('/cat/meow').consume()
  .then((res: Cat) => {
    // handle result 
  })
  .catch((err: any) => {
    // handle error
  })
  .finally(() => {
    // after result or error
  });
```

### Request Methods

drino.get(url, config?)

drino.delete(url, config?)

drino.head(url, config?)

drino.options(url, config?)

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
  // @default: 'object'
  read?: 'object' | 'string' | 'blob' | 'arrayBuffer' | 'formData' | 'auto' | 'none';

  // Wrap response body into a specific Object.
  // - 'response' : HttpResponse
  // - 'none' : nothing
  //
  // @default: 'none'
  wrapper?: 'response' | 'none';

  // AbortSignal to cancel HTTP Request with an AbortController
  // See below in section 'Abort Request'
  signal?: AbortSignal;
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
  requestConfig: {
    prefix: '/cat'
  }
});

child.get('/meow').consume() // GET -> http://localhost:8080/cat/meow
```

### Instance Config

```ts
interface DrinoDefaultConfig {
  // Base URL
  // Example : 'http://localhost:8080'
  baseUrl?: string;

  // Default requestConfig applied to all requests hosted by the instance
  // See above in section 'Request Config'
  requestsConfig?: RequestConfig;
}
```

You can override config applied to a `drino` instance (default import or created instance)

```ts
drino.default.baseUrl = 'https://example.com';
drino.default.requestConfig.headers.set('Custom-Header', 'Cat');

drino.get('/cat/meow').consume(); // GET -> https://example.com/cat/meow (headers = { "Custom-Header", "Cat" })
```

## Advanced Usage

### Pipe methods

Before calling `consume` method, you can chain call methods to modify or inspect the current value before being passed
into callbacks.

#### Transform

Change the result value.

Example :

```ts
type Cat = { name: string }

drino.get<Cat>('/cat/meow')
  .transform((res: Cat) => res.name)
  .consume({
    result: (name: string) => {
      // handle value
    }
  });
```

#### Check

Check the result value.

Example :

```ts
drino.get<Cat>('/cat/meow')
  .check((res: Cat) => console.log(res))
  .consume({
    result: (res: Cat) => {
      // handle value
    }
  });
```

#### Methods combination

Pipe methods can be combined.

Example :

```ts
drino.get<Cat>('/cat/meow')
  .check((val: Cat) => console.log(val)) // { name: "Gaïa" }
  .transform((val: Cat) => cat.name)
  .check((val: string) => console.log(val)) // "Gaïa"
  .consume({
    result: (name: string) => {
      // handle value
    }
  });
```

[//]: # (### Interceptors)

[//]: # ()

[//]: # (You can intercept request before being sent or response before being passed into callbacks.)

[//]: # ()

[//]: # (#### Before request)

[//]: # ()

[//]: # (```ts)

[//]: # (drino)

[//]: # (```)

### Abort request

You can cancel a send request (before receive response) by using `AbortSignal` and `AbortController`.

Example :

```ts
const abortCtrl: AbortController = new AbortController();
const signal: AbortSignal = abortCtrl.signal;

setTimeout(() => abortCtrl.abort('Too Long'), 2000);

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

// With Promise
drino.get<Cat>('/cat/meow', { signal }).consume()
  .then((res: Cat) => {
    // handle result
  })
  .catch((err: any) => {
    if (signal.aborted) {
      const reason: any = signal.reason;
      console.error(reason); // "Too Long"
      // handle abort reason
    }
  });
```

[//]: # (### Timeout)

## License

[MIT](LICENSE) © Rémy Abitbol.
