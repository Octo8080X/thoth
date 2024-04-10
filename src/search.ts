import { deepMerge } from "../deps.ts";
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

  let result: { [key: string]: { [key: string]: number[] } } = {};
  for await (const entry of entries) {
    const value = entry.value;
    const key = entry.key;

    if (!result[value]) {
      result[value] = {};
    }

    if (!result[value][key[4] as string]) {
      result[value][key[4] as string] = [];
    }

    result = deepMerge(result, {
      [value]: { [key[4].toString()]: [Number(key[5])] },
    });
  }
  return result;
}

async function searchEqualKeyword(kv: Deno.Kv, gram: number, keyword: string) {
  const entries = await kv.list<string>({
    prefix: [...getThothGramKeyPrefix(gram), keyword],
  });

  let result: { [key: string]: { [key: string]: number[] } } = {};
  for await (const entry of entries) {
    const value = entry.value;
    const key = entry.key;

    if (!result[value]) {
      result[value] = {};
    }

    if (!result[value][key[4].toString()]) {
      result[value][key[4].toString()] = [];
    }

    result = deepMerge(result, {
      [value]: { [key[4].toString()]: [Number(key[5])] },
    });
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

  let result: { [key: string]: { [key: string]: number[] } } = {};
  let isFirst = true;
  for await (const [index, gramKeyword] of keywords.entries()) {
    const gramResult = await searchEqualKeyword(kv, gram, gramKeyword);

    if (isFirst) {
      result = gramResult;
      isFirst = false;
      if (Object.keys(result).length == 0) {
        break;
      }
      continue;
    }

    Object.keys(result).forEach((v1) => {
      if (!gramResult[v1]) {
        delete result[v1];
        return;
      }

      Object.keys(result[v1]).forEach((v2: string) => {
        if (!gramResult[v1][v2]) {
          delete result[v1][v2];
          return;
        }

        result[v1][v2].forEach((v3: number) => {
          if (
            !gramResult[v1] || !gramResult[v1][v2] ||
            !gramResult[v1][v2].includes(v3 + index)
          ) {
            result[v1][v2] = result[v1][v2].filter((v4) => v4 != v3);
          }
        });
      });

      if (Object.keys(result).length == 0) {
        return {};
      }
    });
  }
  return result;
}
