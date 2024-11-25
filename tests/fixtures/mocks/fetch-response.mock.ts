export function makeMockFetchResponse(contentType: string): Response {
  return {
    arrayBuffer: async () => new ArrayBuffer(1),
    blob: async () => new Blob(),
    bytes: async () => new Uint8Array(),
    body: null,
    bodyUsed: false,
    clone(): Response {
      return this;
    },
    formData: async () => new FormData(),
    headers: new Headers({ 'content-type': contentType }),
    json: async () => ({}),
    ok: true,
    redirected: false,
    status: 200,
    statusText: 'OK',
    text: async () => '',
    type: 'default',
    url: '',
  };
}

export const mockFetchResponse: Response = makeMockFetchResponse('application/json');
