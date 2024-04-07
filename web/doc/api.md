---
title: API
---

<h1 class="text-6xl font-black pb-6">
  API
</h1>

<h2 class="text-3xl font-black pb-2" id="basic-information">
  <a href="#basic-information" class="link link-primary opacity-25 hover:opacity-100 inline-block">
    #
  </a>
  Basic Information
</h2>

<div class="pl-2 font-normal">
  <p>`Thoth` works with <a href="https://deno.com/kv" target="_blank" rel="noopener noreferrer" class="link link-primary">Deno KV</a>.</p>
  <p>
    Thoth prefixes all keys with `THOTH` to avoid conflicts with other services or functions.
  </p>

<div role="alert" class="alert alert-warning my-2">
    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-8 w-8" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      <span class="font-black">Care should be taken to ensure that the keys used do not conflict.</span>
  </div>

<p>
    For example, the following keys are stored.
  </p>
</div>

<div class="overflow-x-auto">
  <table class="table table-zebra">
    <thead>
      <tr>
        <th></th>
        <th>Thoth use keys</th>
      </tr>
    </thead>
    <tbody class="text-xs">
      <tr class=""><th>1</th><td>[ THOTH,ANALYSIS,01HTWMTZA6ZG96X04Q48FR81QF ]</td></tr>
      <tr class=""><th>2</th><td>[ THOTH,ANALYSIS_REVERSE,000001 ]</td></tr>
      <tr class=""><th>3</th><td>[ THOTH,GRAM_3,ABC,01HTWMTZA6ZG96X04Q48FR81QF ]</td></tr>
      <tr class=""><th>4</th><td>[ THOTH,GRAM_3_REVERSE,000001,ABC ]</td></tr>
      <tr class=""><th>5</th><td>[ THOTH,INPUT_ID,000001 ]</td></tr>
      <tr class=""><th>6</th><td>[ THOTH,RAW_INPUT,01HTWMTZA6ZG96X04Q48FR81QF ]</td></tr>
    </tbody>
  </table>
</div>

<div class="divider"></div>

<h2 class="text-3xl font-black pb-2" id="the-parsing-process-is-unpredictable">
  <a href="#the-parsing-process-is-unpredictable" class="link link-primary opacity-25 hover:opacity-100 inline-block">
    #
  </a>
  The parsing process is unpredictable.
</h2>

<div class="pl-2 font-normal">
  <p>
    It takes time to parse the text, but this is not constant.The more input, the longer the parsing takes.
  </p>
  <p>
    Therefore, `Thoth` provides a delayed process for parsing data as it is registered and for unregistering data.
  </p>
  <p>
    Perform it however the developer prefers. (Deno Cron, upstash...)
  </p>
  <p>
    I sincerely hope this will help you when you want that power.
  </p>
</div>

<div class="divider"></div>

<h2 class="text-3xl font-black pb-2" id="links">
  <a href="#links" class="link link-primary opacity-25 hover:opacity-100 inline-block">
    #
  </a>
  Links
</h2>

<ul>
  <li>
    <a href="/api/sync" class="link link-primary hover:opacity-90 inline-block">
      Sync API
    </a>

</li>
  <li>
    <a href="/api/lazy" class="link link-primary hover:opacity-90 inline-block">
      Lazy API
    </a>

</li>
</ul>
