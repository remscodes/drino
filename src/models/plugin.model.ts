export interface DrinoPlugin {
  id: string;
  run: PluginRunFn;
}

type PluginRunFn = (reqCtrlPrototype: any) => void
