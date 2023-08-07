export type Optional<T> =
  | T
  | undefined

export type Nullable<T> =
  | T
  | null

export type InferPromiseType<T>
  = T extends Promise<infer A> ? A
  : T;
