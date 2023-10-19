export type Optional<T> =
  | T
  | undefined

export type Nullable<T> =
  | T
  | null

export type Prefix<Str extends string, Prefix extends string> = `${Prefix}${Str}`

export type PlainObject = Record<string, string>

export interface Constructor<Instance = any, Args extends any[] = any[]> extends Function {
  new(...args: Args): Instance;
}

export interface NumberRange {
  start: number;
  end: number;
}

export type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T;
