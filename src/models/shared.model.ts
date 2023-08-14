export type Optional<T> =
  | T
  | undefined

export type Nullable<T> =
  | T
  | null

export type InferPromiseType<T>
  = T extends Promise<infer A> ? A
  : never;

export type PlainObject = Record<string, string>

export type Prefix<prefix extends string, T extends string> = `${prefix}${T}`

export type PartialBy<T, P extends keyof T> =
  & Omit<T, P>
  & Partial<Pick<T, P>>

export type RequiredBy<T, P extends keyof T> =
  & Omit<T, P>
  & Required<Pick<T, P>>
