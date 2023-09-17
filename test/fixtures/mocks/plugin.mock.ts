import type { RequestController } from '../../../src';
import type { DrinoPlugin } from '../../../src/models/plugin.model';

export const mockPlugin: DrinoPlugin = {
  id: 'mock-plugin',
  run: (reqCtrlPrototype: any) => {
    Object.defineProperty(reqCtrlPrototype, 'log', {
      value: function (this: RequestController<any>) {},
      writable: true
    });
  }
};
