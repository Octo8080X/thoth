---
title: Lazy API
---

<h1 class="text-6xl font-black pb-6">
 Lazy API
</h1>

<h2 class="text-3xl font-black pb-2" id="about-lazy-processing">
  <a href="#about-lazy-processing" class="link link-primary opacity-25 hover:opacity-100 inline-block">
    #
  </a>
  About lazy Processing
</h2>

<div class="pl-2 font-normal py-2">
  <p>
    `Thoth` has a lazy execution method for parsing and deregistration.
  </p>
  <p>
    Delayed execution is easiest to implement with Deno Cron.
  </p>
  <p>
    A sample is shown below.
  </p>
</div>

<pre
class="theme-arta shadow-3xl text-sm relative overflow-hidden max-w-full tab-size h-full"
>
<code class="language-ts">import { createThothClient } from "jsr:@octo/thoth";

const kv = await Deno.openKv();
const thoth = createThothClient(kv, 3);

await thoth.register(["ABCDEFG", "abcdefg"], "000001", true);

Deno.cron("THOTH TASK", "* * * * *", async () => {
  console.log("START: THOTH TASK");
  await thoth.analysis();
  await thoth.unregisterTask();
  console.log("END: THOTH TASK ");
});

console.log("search");
console.log("  Keyword: ABC =>", await thoth.search("ABC"));

setInterval(async () => {
  console.log("search");
  console.log("  Keyword: ABC =>", await thoth.search("ABC"));
}, 5000);

</code></pre>

<div class="pl-2 font-normal">
  <p class="py-2">
    Please execute the following command.
  </p>
</div>

<pre class="theme-arta shadow-3xl text-sm relative overflow-hidden max-w-full tab-size h-full"><code class="language-sh">$ deno run --unstable-kv lazy.ts
search
  Keyword: ABC => {}
search
  Keyword: ABC => {}
START: THOTH TASK
END: THOTH TASK
search
  Keyword: ABC => { "000001": { "0": [ 0 ] } }
</code></pre>

<script>hljs.highlightAll();</script>