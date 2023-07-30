import drinko from '../src';

const mockPets = {
  id: 1,
  name: 'Pet1',
  photoUrls: ['test1', "test2"],
  tags: [],
  status: 'available'
};

// @ts-ignore
global.fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
  return Promise.resolve({
    json: () => Promise.resolve(mockPets),
    ok: true,
    headers: new Map()
  });
};

(async (): Promise<any> => {
  const result = await drinko.get('https://petstore3.swagger.io/api/v3/pet/1').consume();
  console.log('Promise result :', result);
})();

drinko
  .get('https://petstore3.swagger.io/api/v3/pet/1')
  .consume({
    result: (result: any) => {
      console.log('Callback result :', result);
    },
    error: (err: any) => {
      console.log('Callback error :', err);
    },
    finished: () => {
      console.log('Callback finished.');
    }
  });
