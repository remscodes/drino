import type { DrinoInstance, DrinoProgressEvent } from '../../src';
import drino from '../../src/drino';

describe('Drino - Progress', () => {
  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost:8080/file',
    });
  });

  describe.skip('Upload', () => {

    it('should inspect upload progress', () => {

    });
  });

  describe('Download', () => {

    it('should inspect download progress', (done: Mocha.Done) => {
      instance.get('/download', { progress: { download: { inspect: true } } }).consume({
        downloadProgress: ({ loaded, total, iteration }: DrinoProgressEvent) => {
          // console.log(`Received ${loaded} of ${total}. Iteration ${iteration}`);
          if (loaded === total) done();
        },
      });
    }).timeout(4000);
  });
});
