import { openKv } from "@deno/kv";
import { createThothClient } from "../../src/thoth.ts";


const kv = await openKv(":memory:");
const thoth = createThothClient(kv, 3);

await thoth.flash();

console.log("register");
console.log("  register 000001: ABCDEFG, abcdefg");
await thoth.register(["ABCDEFG", "abcdefg"], "000001");
