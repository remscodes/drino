export interface DrinoPlugin {
  id: string;
  run: PluginRunFn;
}

type PluginRunFn = (tools: PluginTools) => void

export interface PluginTools {
  reqCtrlPrototype: any;
}
