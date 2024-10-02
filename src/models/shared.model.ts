export type Prefix<Str extends string, Prefix extends string> = `${Prefix}${Str}`

export type PlainObject = Record<string, any>

export interface Constructor<Instance = any, Args extends any[] = any[]> extends Function {
  new(...args: Args): Instance;
}

export interface NumberRange {
  start: number;
  end: number;
}
