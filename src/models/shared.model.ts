export type Optional<T> =
  | T
  | undefined

export type Nullable<T> =
  | T
  | null

export type Prefix<Str extends string, Prefix extends string> = `${Prefix}${Str}`

export type PlainObject = Record<string, string>

export interface Constructor<T = any, Args extends any[] = any[]> extends Function {
  new(...args: Args): T;
}

export interface NumberRange {
  start: number;
  end: number;
}
