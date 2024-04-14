import {
  getRegisterFunc,
  getUnregisterFunc,
  getUnregisterTaskFunc,
} from "./register.ts";
import { getAnalysisFunc } from "./analysis.ts";
import { getFlashFunc } from "./flash.ts";
import { getSearchFunc } from "./search.ts";

type ThothClient = {
  register: (
    rawData: string[],
    originId: string,
    lazy?: boolean,
  ) => Promise<void>;
  analysis: () => Promise<void>;
  unregister: (originId: string, lazy?: boolean) => Promise<void>;
  search: (
    keyword: string,
  ) => Promise<{ [key: string]: { [key: string]: number[] } }>;
  flash: (lazy?: boolean) => Promise<void>;
  unregisterTask: () => Promise<void>;
};

/** 
 * Create a Thoth client
 * @param kv Deno.Kv instance
 * @param gram number of grams
 * @param defaultSync default sync mode
 * @returns ThothClient
 * 
 * @example
 * ```ts
 * const kv = new ThothKv("thoth");
 * const thoth = createThothClient(kv, 2);
 * ```
*/

export function createThothClient(
  kv: Deno.Kv,
  gram: number,
  defaultSync: boolean = false,
): ThothClient {
  return {
    register: getRegisterFunc(kv, gram, defaultSync),
    analysis: getAnalysisFunc(kv, gram),
    unregister: getUnregisterFunc(kv, gram, defaultSync),
    search: getSearchFunc(kv, gram),
    flash: getFlashFunc(kv),
    unregisterTask: getUnregisterTaskFunc(kv, gram),
  };
}
