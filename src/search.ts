/// <reference lib="deno.unstable" />

import { getThothGramKeyPrefix } from "./kvkey.ts";

export function getSearchFunc(kv: Deno.Kv, gram: number) {
  return async function (keyword: string) {
    const trimmedKeyword = keyword.trim();

    if (trimmedKeyword.length < gram) {
      return await searchShortKeyword(kv, gram, trimmedKeyword);
    } else if (trimmedKeyword.length == gram) {
      return await searchEqualKeyword(kv, gram, trimmedKeyword);
    }
    return await searchLongKeyword(kv, gram, trimmedKeyword);
  };
}

function getEndKeyWord(keyword: string) {
  const lastChar = keyword.slice(-1);
  const nextLastChar = String.fromCharCode(lastChar.charCodeAt(0) + 1);

  return keyword.slice(0, -1) + nextLastChar;
}

async function searchShortKeyword(kv: Deno.Kv, gram: number, keyword: string) {
  const startKeyword = keyword;
  const endKeyword = getEndKeyWord(keyword);

  const entries = await kv.list<string>({
    start: [...getThothGramKeyPrefix(gram), startKeyword],
    end: [...getThothGramKeyPrefix(gram), endKeyword],
  });

  const result = new Set<string>();
  for await (const entry of entries) {
    const value = entry.value;
    result.add(value);
  }
  return result;
}
async function searchEqualKeyword(kv: Deno.Kv, gram: number, keyword: string) {
  const entries = await kv.list<string>({
    prefix: [...getThothGramKeyPrefix(gram), keyword],
  });

  const result = new Set<string>();
  for await (const entry of entries) {
    const value = entry.value;
    result.add(value);
  }
  return result;
}

async function searchLongKeyword(kv: Deno.Kv, gram: number, keyword: string) {
  let count = 0;
  keyword = keyword.trim();
  const keywords: string[] = [];
  while (count + gram <= keyword.length) {
    keywords.push(keyword.slice(count, count + gram));
    count += 1;
  }

  let result: string[] = [];
  let isFirst = true;
  for await (const gramKeyword of keywords) {
    const gramResult = await searchEqualKeyword(kv, gram, gramKeyword);

    if (isFirst) {
      Array.from(gramResult).map((g) => result.push(g));
      isFirst = false;
      if (result.length == 0) {
        break;
      }
      continue;
    }
    if (gramResult.size == 0) {
      result = [];
      break;
    }

    result = result.filter((r) => gramResult.has(r));
  }
  return new Set(result);
}
