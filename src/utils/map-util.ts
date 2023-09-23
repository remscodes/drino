import type { Constructor, Optional } from '../models/shared.model';

interface MapLike<T = any> {
  forEach(cb: (value: string, key: string, parent: T) => void): void;

  set(name: string, value: string): void;
}

type MapLikeCtor<T, InitType> = Constructor<T, [Optional<InitType>]>

export function mergeMapsLike<T extends MapLike, InitType>(MapLikeCtor: MapLikeCtor<T, InitType>, ...maps: InitType[]): T {
  return maps.reduce((finalMapLike: T, map: InitType) => {
    new MapLikeCtor(map).forEach((value: string, key: string) => finalMapLike.set(key, value));
    return finalMapLike;
  }, new MapLikeCtor(undefined));
}
