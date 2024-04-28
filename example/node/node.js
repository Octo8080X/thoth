"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kv_1 = require("@deno/kv");
var kv = await (0, kv_1.openKv)(":memory:");
//const result = await kv.set(["from-client"], "hello!");
//console.log(result);
//
//kv.close();
//
console.log("done");
