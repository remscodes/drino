export type Optional<T> =
  | T
  | undefined

export type Nullable<T> =
  | T
  | null

export type Prefix<Str extends string, Prefix extends string> = `${Prefix}${Str}`

export type PlainObject = Record<string, string>

export type PartialBy<Obj, Prop extends keyof Obj> =
  & Omit<Obj, Prop>
  & Partial<Pick<Obj, Prop>>

export type RequiredBy<Obj, Prop extends keyof Obj> =
  & Omit<Obj, Prop>
  & Required<Pick<Obj, Prop>>
