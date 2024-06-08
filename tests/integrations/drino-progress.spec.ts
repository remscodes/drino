import type { DrinoInstance, StreamProgressEvent } from '../../src';
import drino from '../../src';

describe('Drino - Progress', () => {
  let instance: DrinoInstance;

  beforeEach(() => {
    instance = drino.create({
      baseUrl: 'http://localhost:8080/file',
    });
  });

  describe('Download', () => {
    // const sandbox = createSandbox();
    // let consoleSpy: SinonSpy<Parameters<Console['error']>, void>;
    //
    // beforeEach(() => {
    //   consoleSpy = sandbox.spy(console, 'error');
    // });
    //
    // afterEach(() => {
    //   sandbox.restore();
    // });

    it('should inspect download progress', (done: Mocha.Done) => {
      instance.get('/download').consume({
        download: (ev: StreamProgressEvent) => {
          // logDownloadStats(ev);
          if (ev.loaded === ev.total) done();
        },
      });
    }).timeout(4_000);

    it('should not inspect download progress', (done: Mocha.Done) => {
      instance.get('/download-wo-cl').consume({
        download: () => done('Test failed.'),
        finish: () => done(),
      });
    }).timeout(4_000);
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
});
