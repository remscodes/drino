import type { DrinoInstance, StreamProgressEvent } from '../../src';
import drino from '../../src';

describe('Drino - Progress', () => {
  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost:8080/file',
    });
  });

  // describe.skip('Upload', () => {
  //
  //   it('should inspect upload progress', (done: Mocha.Done) => {
  //
  //     instance.post('/upload', mockItems).consume({
  //       uploadProgress: (ev: StreamProgressEvent) => {
  //         console.log(ev);
  //
  //         const { loaded, total } = ev;
  //         if (loaded === total) done();
  //       },
  //     });
  //   });
  // });

  describe('Download', () => {

    it('should inspect download progress', (done: Mocha.Done) => {
      instance.get('/download').consume({
        downloadProgress: ({ loaded, total, percent, speed, remainingTimeMs }: StreamProgressEvent) => {
          // console.log(`Received ${loaded} bytes of ${total} bytes (${percent} %)`);
          // console.log(`${Math.floor(percent * 100)} % | ${speed.toFixed()} B/ms | ${(speed / 1024 * 1000).toFixed()} KB/s | ${(speed / 1024 / 1024 * 1000).toFixed(2)} MB/s | ${remainingTimeMs.toFixed()} ms remaining.`);
          if (loaded === total) done();
        },
      });
    }).timeout(4_000);
  });
});
