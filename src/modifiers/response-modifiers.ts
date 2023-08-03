import type { Modifier } from '@_/models/modifier.model';
import type { DrinoResponse } from '../drino-response';

type JsonModifier<A, B> = Modifier<DrinoResponse<A>, Promise<Extract<B, object>>>

export function toJson<T>(): JsonModifier<T, T> {
  return (res: DrinoResponse<T>) => res.toJson();
}

type TextModifier<T> = Modifier<DrinoResponse<T>, Promise<string>>

export function toText<T>(): TextModifier<T> {
  return (res: DrinoResponse<T>) => res.toText();
}

type BlobModifier<T> = Modifier<DrinoResponse<T>, Promise<Blob>>

export function toBlob<T>(): BlobModifier<T> {
  return (res: DrinoResponse<T>) => res.toBlob();
}

type ArrayBufferModifier<T> = Modifier<DrinoResponse<T>, Promise<ArrayBuffer>>

export function toArrayBuffer<T>(): ArrayBufferModifier<T> {
  return (res: DrinoResponse<T>) => res.toArrayBuffer();
}

type FormDataModifier<T> = Modifier<DrinoResponse<T>, Promise<FormData>>

export function toFormData<T>(): FormDataModifier<T> {
  return (res: DrinoResponse<T>) => res.toFormData();
}

