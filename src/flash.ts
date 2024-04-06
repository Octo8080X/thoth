/// <reference lib="deno.unstable" />
import { KV_SERVICE_KEY } from "./kvkey.ts";

export function getFlashFunc(kv: Deno.Kv) {
  return async function () {
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
