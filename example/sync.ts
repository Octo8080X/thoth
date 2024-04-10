import { createThothClient } from "../src/thoth.ts";

const kv = await Deno.openKv();
const thoth = createThothClient(kv, 3);

await thoth.flash();

console.log("register");
console.log("  register 000001: ABCDEFG, abcdefg");
await thoth.register(["ABCDEFG", "abcdefg"], "000001");

console.log("  register 000002: あいうえお, aiueo");
await thoth.register(["あいうえお", "aiueo"], "000002");

console.log("  register 000003: 一二三, one-two-three");
await thoth.register(["一二三", "one-two-three"], "000003");

console.log("  register 000004: EFGABCD", "efgabcd");
await thoth.register(["EFGABCD", "efgabcd"], "000004");

console.log("  register 000005: EFGABCD", "ABCDEFGABCD", "abcdefABDg");
await thoth.register(["ABCDEFGABCD", "abcdefABDg"], "000005");

console.log("search");
console.log("  Keyword: ABC =>", await thoth.search("ABC"));
console.log("  Keyword: DEF =>", await thoth.search("DEF"));
console.log("  Keyword: DF  =>", await thoth.search("DF"));
console.log("  Keyword: あいう =>", await thoth.search("あいう"));
console.log("  Keyword: あい =>", await thoth.search("あい"));
console.log("  Keyword: あいえ =>", await thoth.search("あいえ"));
console.log("  Keyword: ueo =>", await thoth.search("ueo"));
console.log("  Keyword: 一  =>", await thoth.search("一"));
console.log("  Keyword: ABCD =>", await thoth.search("ABCD"));

console.log("unregister");
console.log("  unregister 000001");
await thoth.unregister("000001");
console.log("  Keyword: ABC =>", await thoth.search("ABC"));

console.log("flash");
await thoth.flash();
console.log("  Keyword: ABC =>", await thoth.search("ABC"));
