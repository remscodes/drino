import { HttpContext } from './http-context';

export function mergeContext(...manyContexts: HttpContext[]): HttpContext {
  return manyContexts.reduce((finalContext: HttpContext, context: HttpContext) => {
    for (const [key, value] of context.entries()) finalContext.set(key, value);
    return finalContext;
  }, new HttpContext());
}
