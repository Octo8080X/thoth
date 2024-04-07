import { type PageProps } from "$fresh/server.ts";
import { DocIndex } from "../components/DocIndex.tsx";
import { Header } from "../components/Header.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html data-theme="cmyk">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>web</title>
        <link rel="stylesheet" href="/styles.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ts.min.js" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/sh.min.js" />
      </head>
      <body>
        <div class="px-4 mx-auto min-h-screen bg-base-300">
          <div class="container min-h-screen mx-auto bg-base-300 flex flex-col justify-between">
            <div class="container mx-0">
              <Header />
            </div>
            <div class="container mb-auto bg-base-300">
              <div class="hidden lg:flex">
                <div class="flex-col w-48 bg-base-300 my-2">
                  <div class="flex items">
                    <DocIndex />
                  </div>
                </div>
                <div class="grow pt-2 pl-2">
                  <main>
                    <div class="rounded-[4px] mx-auto bg-base-100">
                      <div class="max-w-screen-md mx-auto p-4">
                        <Component />
                      </div>
                    </div>
                  </main>
                </div>
              </div>
              <div class="block lg:hidden py-2">
                <main>
                  <div class="rounded-[4px] mx-auto bg-base-100 p-4">
                    <Component />
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
