import type { HttpContext } from '../context/http-context';

export type ContextChain = (ctx: HttpContext) => HttpContext
