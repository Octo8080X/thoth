import type { FreshContext, Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import TextSearch from "../islands/TextSearch.tsx";

export default function ({ data }: PageProps<Page | null>) {
  return (
    <>
      <Head>
        <title>{`Thoth doc - playground`}</title>
      </Head>

      <h1 class="text-6xl font-black pb-6">
        Playground
      </h1>

      <div class="pl-2 py-2 font-normal">
        <p>
          Thoth full text search playground.
        </p>
        <p>
          Maximum of about 500 characters excerpted from{"  "}
          <a
            href="https://www.aozora.gr.jp/index.html"
            target="_blank"
            rel="noopener noreferrer"
            class="link link-primary"
          >
            www.aozora.gr.jp
          </a>{" "}
          and{" "}
          <a
            href="https://www.gutenberg.org/"
            target="_blank"
            rel="noopener noreferrer"
            class="link link-primary"
          >
            www.gutenberg.org
          </a>{" "}
          for each piece
        </p>
      </div>

      <TextSearch />
    </>
  );
}
