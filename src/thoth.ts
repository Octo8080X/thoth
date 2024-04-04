import {
  getRegisterFunc,
  getUnregisterFunc,
  getUnregisterTaskFunc,
} from "./register.ts";
import { getAnalysisFunc } from "./analysis.ts";
import { getFlashFunc } from "./flash.ts";
import { getSearchFunc } from "./search.ts";

export function createThothClient(
  kv: Deno.Kv,
  gram: number,
  defaultSync: boolean = false,
) {
  return {
    register: getRegisterFunc(kv, gram, defaultSync),
    analysis: getAnalysisFunc(kv, gram),
    unregister: getUnregisterFunc(kv, gram, defaultSync),
    search: getSearchFunc(kv, gram),
    flash: getFlashFunc(kv, defaultSync),
    unregisterTask: getUnregisterTaskFunc(kv, gram),
  };
}
