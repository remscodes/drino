export interface DrinoPlugin {
  id: string;
  run: PluginRunFn;
}

export type PluginRunFn = (tools: PluginTools) => void

export interface PluginTools {
  reqCtrlPrototype: any;
}
