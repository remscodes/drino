export type Nullable<T> =
  | T
  | null

export type Prefix<Str extends string, Prefix extends string> = `${Prefix}${Str}`

export type PlainObject = Record<string, string>

export interface NumberRange {
  start: number;
  end: number;
}
