import { FreshContext, Handlers } from "$fresh/server.ts";
import { createThothClient } from "thoth";

const kv = await Deno.openKv();

function chunkArray(array: (unknown)[], chunkSize: number) {
  const results = [];
  while (array.length) {
    results.push(array.splice(0, chunkSize));
  }
  return results;
}

export const handler: Handlers = {
  async GET(req: Request, _ctx: FreshContext) {
    const params = new URLSearchParams(new URLPattern(req.url).search);
    const q = params.get("q");

    if (q === null) {
      return new Response("No search keyword", { status: 400 });
    }

    const thoth = createThothClient(kv, 4);

    const startTime = performance.now();
    const result = await thoth.search(q);
    const endTime = performance.now();

    const time = Math.ceil((endTime - startTime) * 1000) / 1000;

    const searchResultRaw = Object.keys(result).map((key) => ["LINK", key]);

    const searchResult = chunkArray(searchResultRaw, 10);
    const data: { title: string; ahthor: string; url: string }[] = [];

    for await (const gp of searchResult) {
      (await kv.getMany<{ title: string; ahthor: string; url: string }[]>(gp))
        .forEach(
          (entry: any) => {
            if (entry.value === null) return;
            data.push(entry.value);
          },
        );
    }

    return new Response(JSON.stringify({ data, time: `${time} ms` }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
