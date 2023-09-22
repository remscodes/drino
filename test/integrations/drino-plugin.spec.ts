import drino from '../../src';
import { mockPlugin } from '../fixtures/mocks/plugin.mock';
import { expectProperty } from '../fixtures/utils/expect-util';

describe('Drino - Plugin', () => {
  drino.use(mockPlugin);

  it('should propagate plugin', () => {
    const rc = drino.get('/');

    expectProperty(rc, 'log', 'function');
  });
});
