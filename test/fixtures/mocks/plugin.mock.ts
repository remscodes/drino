import type { DrinoPlugin, PluginTools, RequestController } from '../../../src';

export const mockPlugin: DrinoPlugin = {
  id: 'mock-plugin',
  run: ({ reqCtrlPrototype }: PluginTools) => {
    Object.defineProperty(reqCtrlPrototype, 'log', {
      value: function (this: RequestController<any>) {},
      writable: true
    });
  }
};
