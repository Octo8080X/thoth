import { createThothClient } from "./src/thoth.ts";

const kv = await Deno.openKv();
const thoth = createThothClient(kv, 2);

await thoth.flash();

await thoth.register("たなかもおわり", "000003");
await thoth.register("てっかもおわり", "000004");

await thoth.task("* * * * *");

await thoth.search("たな");

await thoth.unregister("000004", false);

await thoth.search("てっ");

setInterval(() => {
  thoth.search("てっ");
}, 5000);
