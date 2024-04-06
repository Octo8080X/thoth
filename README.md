# Thoth

`Thoth` is full-text search on Deno KV.

## Usage

```ts sample
import { createThothClient } from "../src/thoth.ts";

const kv = await Deno.openKv();
const thoth = createThothClient(kv, 3);

await thoth.flash();

await thoth.register(["ABCDEFG", "abcdefg"], "000001");
await thoth.register(["あいうえお", "aiueo"], "000002");

console.log(await thoth.search("ABC"));
// => Set(1) { "000001" }

console.log(await thoth.search("AC"));
// => Set(0) { }
```
