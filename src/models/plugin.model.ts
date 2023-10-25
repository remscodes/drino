export interface DrinoPlugin {
  id: string;
  run: (tools: PluginTools) => void;
}

export interface PluginTools {
  reqCtrlPrototype: any;
}
