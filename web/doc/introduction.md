---
title: introduction
---

<h1 class="text-6xl font-black pb-6">
  Introduction
</h1>

<h2 class="text-3xl font-black pb-2" id="whot-is-thoth">
  <a href="#whot-is-thoth" class="link link-primary opacity-25 hover:opacity-100 inline-block">
    #
  </a>
  Whot is 'Thoth'
</h2>

<div class="pl-2 font-normal">
  <p>`Thoth` is simple full-text search on <a href="https://deno.com/kv" target="_blank" rel="noopener noreferrer" class="link link-primary">Deno KV</a>.</p>
  <p>
    It serves as a wrapper for Deno KV that builds the key information used in
    <a href="https://en.wikipedia.org/wiki/N-gram"  target="_blank" rel="noopener noreferrer" class="link link-primary">
    n-gram</a>
     search.
  </p>
</div>

<div class="divider"></div>

<h2 class="text-3xl font-black pb-2" id="install">
  <a href="#install" class="link link-primary opacity-25 hover:opacity-100 inline-block">
    #
  </a>
  Install
</h2>

<h2 class="text-2xl font-black pb-2">
  1. Install Deno
</h2>

<div class="pl-2 font-normal">
  <p>First, install deno cli.</p>
  <p><a href="https://docs.deno.com/runtime/manual" target="_blank" rel="noopener noreferrer" class="link link-primary">Please refer to the official document.</a></p>
</div>

<div class="divider"></div>

<h2 class="text-2xl font-black pb-2">
  2. Run
</h2>

<div class="pl-2 font-normal">
  <p class="py-2">
      Write the following script.
  </p>
</div>

<pre
class="theme-arta shadow-3xl text-sm relative overflow-hidden max-w-full tab-size h-full"
>
<code class="language-ts">// main.ts
import { createThothClient } from "jsr:@octo/thoth";

const kv = await Deno.openKv(":memory:");
const thoth = createThothClient(kv, 3);

await thoth.register(["ABCDEFG", "abcdefg"], "000001");
await thoth.register(["あいうえお", "aiueo"], "000002");

console.log(await thoth.search("ABC"));
// => Set(1) { "000001" }

console.log(await thoth.search("AC"));
// => Set(0) { }
</code></pre>

<div class="pl-2 font-normal">
  <p class="py-2">
    Please execute the following command.
  </p>
</div>

<pre class="theme-arta shadow-3xl text-sm relative overflow-hidden max-w-full tab-size h-full"><code class="language-sh">$ deno run --unstable-kv main.ts
Set(1) { "000001" }
Set(0) { }
</code></pre>

<div class="divider"></div>

<script>hljs.highlightAll();</script>
