import type { DrinoInstance, StreamProgressEvent } from '../../src';
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
      instance.get('/download').consume({
        downloadProgress: ({ loaded, total, percent, speed, estimatedMs }: StreamProgressEvent) => {
          // console.log(`Received ${loaded} bytes of ${total} bytes (${percent} %)`);
          // console.log(`${percent} % | ${speed.toFixed()} B/ms | ${(speed / 1024 * 1000).toFixed()} KB/s | ${(speed / 1024 / 1024 * 1000).toFixed(2)} MB/s | ${estimatedMs.toFixed()} ms remaining.`);
          if (loaded === total) done();
        },
      });
    }).timeout(4_000);
  });
});
