import { HttpContext } from '../../../../../src/features/interceptors/context/http-context';
import { HttpContextToken } from '../../../../../src/features/interceptors/context/http-context-token';
import { expectEqual } from '../../../../fixtures/utils/expect-util';

describe('HttpContext', () => {
  const token = new HttpContextToken(() => 0);

  let context: HttpContext;

  beforeEach(() => {
    context = new HttpContext();
  });

  describe('set / get', () => {

    it('should set', () => {
      expectEqual(context.get(token), 0 /* default value */);

      context.set(token, 1);

      expectEqual(context.get(token), 1);
    });
  });

  describe('has', () => {

    it('should not has', () => {
      expectEqual(context.has(token), false);
    });

    it('should has', () => {
      context.set(token, 1);
      expectEqual(context.has(token), true);
    });
  });

  describe('delete', () => {

    it('should delete', () => {
      context.set(token, 1);

      expectEqual(context.has(token), true);

      context.delete(token);

      expectEqual(context.has(token), false);
    });
  });

  describe('keys / entries', () => {

    it('should keys', () => {
      expectEqual(context.keys().length, 0);
    });

    it('should entries', () => {
      expectEqual(context.entries().length, 0);
    });
  });

  describe('init', () => {

    it('should init', () => {
      const context = new HttpContext([
        { token, value: 1 },
      ]);

      expectEqual(context.has(token), true);
    });
  });
});
