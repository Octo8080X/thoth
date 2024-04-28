import { openKv } from "@deno/kv";

import * as a  from "../../mod";
console.log(a);

//const kv = await openKv(":memory:");
//console.log(kv);
//const thoth = createThothClient(kv, 3);
//
//await thoth.flash();
//
//console.log("register");
//console.log("  register 000001: ABCDEFG, abcdefg");
//await thoth.register(["ABCDEFG", "abcdefg"], "000001");
