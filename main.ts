import { createThothClient } from "./src/thoth.ts";

const kv = await Deno.openKv();
const thoth = createThothClient(kv, 3);

await thoth.flash(true);

await thoth.register(["ABCDEFG", "abcdefg"], "000003");
//await thoth.analysis();

//await thoth.register("あいうえおかきくけこ", "000004");

Deno.cron("THOTH TASK", "* * * * *", async () => {
  console.log("THOTH TASK");
  await thoth.analysis();
  await thoth.unregisterTask();
});

console.log(await thoth.search("DF"));
console.log(await thoth.search("DEF"));
//console.log(await thoth.search("くけ"));

await thoth.unregister("000003", true);
console.log(await thoth.search("DEF"));

//
//await thoth.unregister("000004", false);
//
setInterval(async () => {
  console.log("Search");
  console.log(await thoth.search("DEF"));
  //  thoth.search("くけ");
}, 5000);
