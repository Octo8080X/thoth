import { useState } from "preact/hooks";

export default function TextSearch() {
  const [q, setQ] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState([]);
  const [time, setTime] = useState("");

  const search = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const result = await fetch(`/api/search?q=${q}`);
    const json = await result.json();
    setList(json.data);
    setTime(json.time);
    setIsLoading(false);
  };

  return (
    <>
      <div class="container w-full pb-2">
        <form
          class=""
          noValidate
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <div class="flex">
            <div class="w-full">
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  onChange={(e: any) => setQ(e?.target?.value)}
                />
              </label>
            </div>
            <button class="btn btn-primary btn-outline mx-2" onClick={search}>
              Search
            </button>
          </div>
        </form>
      </div>
      {time != "" &&
        (
          <div class="container w-full pb-2">
            Search performance {isLoading ? "loading..." : time}
          </div>
        )}
      <div class="container w-full pb-2">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Title</th>
              <th>author</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading && list.map((item, _index: number) => (
              <tr>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>
                  <a
                    href={item.url}
                    class="link link-primary opacity-25 hover:opacity-100 inline-block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
