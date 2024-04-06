
import { createThothClient } from "../src/thoth.ts";

const kv = await Deno.openKv();
const thoth = createThothClient(kv, 3);

await thoth.flash();

console.log("register");
console.log("  register 000001: ABCDEFG, abcdefg");
await thoth.register(["ABCDEFG", "abcdefg"], "000001", true);

console.log("  register 000002: あいうえお, aiueo");
await thoth.register(["あいうえお", "aiueo"], "000002", true);

console.log("  register 000003: 一二三, one-two-three");
await thoth.register(["一二三", "one-two-three"], "000003", true);

Deno.cron("THOTH TASK", "* * * * *", async () => {
  console.log("START: THOTH TASK");
  await thoth.analysis();
  await thoth.unregisterTask();
  console.log("END: THOTH TASK ");
});

setInterval(async () => {
  console.log("search");
  console.log("  Keyword: ABC =>", await thoth.search("ABC"));
  console.log("  Keyword: DEF =>", await thoth.search("DEF"));
  console.log("  Keyword: DF  =>", await thoth.search("DF"));
  console.log("  Keyword: あいう =>", await thoth.search("あいう"));
  console.log("  Keyword: あい =>", await thoth.search("あい"));
  console.log("  Keyword: あいえ =>", await thoth.search("あいえ"));
  console.log("  Keyword: ueo =>", await thoth.search("ueo"));
  console.log("  Keyword: 一  =>", await thoth.search("一"));
}, 5000);

