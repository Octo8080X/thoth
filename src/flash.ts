/// <reference lib="deno.unstable" />
import { getThothLazyFlashKey, KV_SERVICE_KEY } from "./kvkey.ts";

export function getFlashFunc(kv: Deno.Kv, defaultSync: boolean = false) {
  return async function (sync: boolean = true) {
    if (!(defaultSync || sync)) {
      kv.set(getThothLazyFlashKey(), true);
      return;
    }

    const entries = await kv.list<string>({ prefix: [KV_SERVICE_KEY] });
    for await (const entry of entries) {
      console.info(
        "\u001b[31mTHOTH DATA DELETE : KV Key[",
        entry.key.toString(),
        "] \u001b[0m",
      );
      kv.delete(entry.key);
    }
  };
}
