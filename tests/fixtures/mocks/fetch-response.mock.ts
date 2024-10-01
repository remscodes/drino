export function makeMockFetchResponse(contentType: string): Response {
  return {
    arrayBuffer(): Promise<ArrayBuffer> {
      return Promise.resolve(new ArrayBuffer(1));
    },
    blob(): Promise<Blob> {
      return Promise.resolve(new Blob());
    },
    body: null,
    bodyUsed: false,
    clone(): Response {
      return this;
    },
    formData(): Promise<FormData> {
      return Promise.resolve(new FormData());
    },
    headers: new Headers({
      'content-type': contentType,
    }),
    json(): Promise<object> {
      return Promise.resolve({});
    },
    ok: true,
    redirected: false,
    status: 200,
    statusText: 'OK',
    text(): Promise<string> {
      return Promise.resolve('');
    },
    type: 'default',
    url: '',
  };
}

export const mockFetchResponse: Response = makeMockFetchResponse('application/json');
