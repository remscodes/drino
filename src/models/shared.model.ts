import { HttpResponse } from '../response';

export type Optional<T> =
  | T
  | undefined

export type Nullable<T> =
  | T
  | null

export type UnwrapPromise<T>
  = T extends Promise<infer F> ? F
  : never;

export type UnwrapHttpResponse<T>
  = T extends HttpResponse<infer F> ? F
  : T

export type PlainObject = Record<string, string>

export type Prefix<Prefix extends string, Str extends string> = `${Prefix}${Str}`

export type PartialBy<Obj, Prop extends keyof Obj> =
  & Omit<Obj, Prop>
  & Partial<Pick<Obj, Prop>>

export type RequiredBy<Obj, Prop extends keyof Obj> =
  & Omit<Obj, Prop>
  & Required<Pick<Obj, Prop>>
