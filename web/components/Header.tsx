import { DocIndex } from "./DocIndex.tsx";

export function Header() {
  return (
    <>
      <div class="drawer">
        <input id="drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content flex flex-col">
          <div class="w-full navbar bg-base-100">
            <div class="flex-none lg:hidden">
              <label
                for="drawer"
                aria-label="open sidebar"
                class="btn btn-square btn-ghost"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  class="inline-block w-6 h-6 stroke-current"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  >
                  </path>
                </svg>
              </label>
            </div>
            <div class="flex-1 px-2 mx-2">
              <span class="text-2xl font-black">Thoth</span>
            </div>
            <div class="flex-none mr-2">
              <a href="https://github.com/Octo8080X/thoth/tree/main" class="hover:text-green-600 inline-block transition" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <svg class="h-8 w-8 " fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-darkreader-inline-fill="" style="--darkreader-inline-fill: currentColor;"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>
              </a>
            </div>
          </div>
        </div>
        <div class="drawer-side z-10">
          <label for="drawer" aria-label="close sidebar" class="drawer-overlay">
          </label>

          <DocIndex />
        </div>
      </div>
    </>
  );
}
