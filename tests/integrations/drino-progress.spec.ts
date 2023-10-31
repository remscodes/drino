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
        downloadProgress: (ev: StreamProgressEvent) => {
          // logDownloadStats(ev);
          if (ev.loaded === ev.total) done();
        },
      });
    }).timeout(4_000);
  });
});
