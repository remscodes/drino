import type { Constructor } from '../models/shared.model';

interface MapLike<T = any> {
  forEach(cb: (value: string, key: string, parent: T) => void): void;

  set(name: string, value: string): void;
}

type MapLikeCtor<T, InitType> = Constructor<T, [InitType | undefined]>

export function mergeMapsLike<T extends MapLike<T>, InitType>(MapLikeCtor: MapLikeCtor<T, InitType>, ...maps: InitType[]): T {
  return maps.reduce((finalMapLike: T, map: InitType) => {
    new MapLikeCtor(map).forEach((value: any, key: string) => finalMapLike.set(key, `${value}`));
    return finalMapLike;
  }, new MapLikeCtor(undefined));
}
