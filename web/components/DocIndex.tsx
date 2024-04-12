export function DocIndex() {
  return (
    <div class="menu p-0 w-80 min-h-full bg-base-100">
      <div class="flex flex-row lg:hidden navbar bg-base-100">
        <div class="flex-1 px-2 mx-2">
          <span class="text-2xl font-black">Thoth</span>
        </div>
      </div>

      <ul class="menu p-4 bg-base-100">
        <li>
          <a href="/#whot-is-thoth">Introduction</a>
        </li>
        <li>
          <ul>
            <li>
              <a href="/#whot-is-thoth">Whot is 'Thoth'</a>
            </li>
            <li>
              <a href="/#install">Install</a>
            </li>
          </ul>
        </li>

        <li>
          <a href="/api_doc">API</a>
        </li>
        <li>
          <ul>
            <li>
              <a href="/api_doc/lazy">Lazy API</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="/playground">
            Playground<span class="indicator-item badge badge-primary">
              new
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
}
