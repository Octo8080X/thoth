import { createThothClient } from "./src/thoth.ts";

const kv = await Deno.openKv();
const thoth = createThothClient(kv, 2);

await thoth.flash();

await thoth.register("ABCDEFG", "000003");
await thoth.register("あいうえおかきくけこ", "000004");

await thoth.task("* * * * *");

await thoth.search("DF");
await thoth.search("DEF");
await thoth.search("くけ");

await thoth.unregister("000004", false);

setInterval(() => {
  thoth.search("くけ");
}, 5000);
