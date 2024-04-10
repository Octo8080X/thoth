# Thoth

`Thoth` is full-text search on Deno KV.

## Docs

Documentation is here.

[thoth-doc.deno.dev](https://thoth-doc.deno.dev/)

## Usage

```ts sample
import { createThothClient } from "jsr:@octo/thoth";

const kv = await Deno.openKv();
const thoth = createThothClient(kv, 3);

await thoth.flash();

await thoth.register(["ABCDEFG", "abcdefg"], "000001");
await thoth.register(["あいうえお", "aiueo"], "000002");
await thoth.register(["ABCDEFGABCDEFG", "abcdefgabcdefg"], "000003");

console.log(await thoth.search("ABC"));
// => { "000001": { "0": [ 0 ] } }

console.log(await thoth.search("AC"));
// => {}

console.log(await thoth.search("ef"));
// => { "000001": { "1": [ 4 ] }, "000003": { "1": [ 4, 11 ] } }
```
