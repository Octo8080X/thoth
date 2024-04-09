import type { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { Head } from "$fresh/runtime.ts";
import markdownit from "npm:markdown-it";

interface Page {
  markdown: string;
  data: Record<string, unknown>;
}

export const handler: Handlers<Page> = {
  async GET(_req: Response, ctx: FreshContext) {
    const relativePath = import.meta.resolve(
      "../doc/introduction.md",
    );
    const localUrl = new URL(relativePath, import.meta.url).toString();
    try {
      const res = await fetch(localUrl);
      if (!res.ok) {
        return ctx.renderNotFound();
      }
      const markdown = await res.text();

      const { body, attrs } = await extract(markdown);

      const md = markdownit({
        html: true,
      });
      const html = md.render(body);

      return ctx.render({
        html,
        attrs,
      });
    } catch (e) {
      console.error(e);
      return ctx.renderNotFound();
    }
  },
};

export default function ({ data }: PageProps<Page | null>) {
  return (
    <>
      <Head>
        <title>{`Thoth doc - ${data?.attrs?.title}`}</title>
      </Head>
      <div
        class="markdown-body"
        dangerouslySetInnerHTML={{ __html: data?.html }}
      />
    </>
  );
}
