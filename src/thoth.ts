/// <reference lib="deno.unstable" />
import { ulid } from "https://deno.land/std@0.211.0/ulid/mod.ts";

const THOTH = "THOTH" as const;
const THOTH_RAW_DATA = "RAW_DATA" as const;
const THOTH_RESERVATION_ANALYSIS = "RESERVATION_ANALYSIS" as const;
const getThothGramKey = (gram: number) => {
  return `GRAM_${gram}` as const;
};
const getThothGramKeyReverse = (gram: number) => {
  return `GRAM_${gram}_REVERSE` as const;
};

const THOTH_ANALYSIS_DATA_ID = "ANALYSIS_DATA_ID" as const;
const THOTH_ORIGIN_DATA_ID = "ORIGIN_DATA_ID" as const;
const THOTH_ASYNCHRONOUS_FLASH = "ASYNCHRONOUS_FLASH" as const;
const THOTH_ASYNCHRONOUS_UNREGISTER = "ASYNCHRONOUS_UNREGISTER" as const;

function getRegisterFunc(
  kv: Deno.Kv,
  gram: number,
  defaultSynchronous: boolean = true,
) {
  return async function (
    rawData: string,
    originDataId: string,
    synchronous: boolean = true,
  ) {
    const analysisDataId = ulid();
    const checkData = await kv.get([THOTH, THOTH_RAW_DATA, analysisDataId]);
    console.log(checkData);
    if (checkData.versionstamp != null) {
      throw new Error("Data save Error");
    }
    const atomic = await kv.atomic()
      .check(checkData)
      .set([THOTH, THOTH_RAW_DATA, analysisDataId], rawData)
      .set([THOTH, THOTH_RESERVATION_ANALYSIS, analysisDataId], 0)
      .set([THOTH, THOTH_ANALYSIS_DATA_ID, originDataId], analysisDataId)
      .set([THOTH, THOTH_ORIGIN_DATA_ID, analysisDataId], originDataId)
      .commit();

    console.log("atomic:", atomic);

    if (!atomic.ok) {
      throw new Error("Data save Error");
    }

    if (defaultSynchronous && synchronous) {
      await getAnalysisFunc(kv, gram)(analysisDataId);
    }
  };
}

function getAnalysisFunc(kv: Deno.Kv, gram: number) {
  return async function (analysisDataId?: string) {
    console.log("analysisDataId");
    const targets = await kv.list<number>({
      prefix: [THOTH, THOTH_RESERVATION_ANALYSIS],
    });

    for await (const targetEntry of targets) {
      console.log("targetEntry", targetEntry);
      console.log("analysisDataId", analysisDataId != targetEntry.key[2]);
      if (analysisDataId != undefined && analysisDataId != targetEntry.key[2]) {
        console.log("continue");
        continue;
      }

      console.log("targetEntry", targetEntry);

      const targetAnalysisDataId = targetEntry.key[2];
      let count = targetEntry.value;
      const { value: rawDataValue } = await kv.get<string>([
        THOTH,
        THOTH_RAW_DATA,
        targetAnalysisDataId,
      ]);
      const { value: originDataId } = await kv.get<string>([
        THOTH,
        THOTH_ORIGIN_DATA_ID,
        targetAnalysisDataId,
      ]);
      console.log("rawDataValue", rawDataValue);
      console.log("originDataId", originDataId);

      if (rawDataValue == null) {
        throw new Error("Data not found");
      }

      let isContinue = true;
      while (isContinue) {
        console.log("count", count);
        const cell = rawDataValue.slice(count, count + gram);
        console.log("cell", cell);

        const atomic = kv.atomic()
          .set(
            [THOTH, getThothGramKey(gram), cell, targetAnalysisDataId],
            originDataId,
          )
          .set(
            [THOTH, getThothGramKeyReverse(gram), originDataId!, cell],
            [THOTH, getThothGramKey(gram), cell, targetAnalysisDataId],
          );

        count += 1;
        if (count + gram > rawDataValue.length) {
          isContinue = false;
          atomic.delete([
            THOTH,
            THOTH_RESERVATION_ANALYSIS,
            targetAnalysisDataId,
          ]);
        } else {
          atomic.set(
            [THOTH, THOTH_RESERVATION_ANALYSIS, targetAnalysisDataId],
            count + 1,
          );
        }
        await atomic.commit();
      }
    }
  };
}

function getUnregisterFunc(kv: Deno.Kv, gram: number, defaultSynchronous: boolean = true) {
  return async function (originDataId?: string, synchronous: boolean = true) {
    if(originDataId){
      await kv.set(
        [THOTH, THOTH_ASYNCHRONOUS_UNREGISTER, originDataId!],
        originDataId,
      );
    }

    if (!(defaultSynchronous && synchronous)) {
      return
    }

    console.info("\u001b[31m11START UNREGISTER !\u001b[0m");

    const targetEntries = await kv.list<string>({
      prefix: [THOTH, THOTH_ASYNCHRONOUS_UNREGISTER],
    });

    for await (const targetEntry of targetEntries) {
      console.log("targetEntry", targetEntry);    
      if (originDataId != undefined && originDataId != targetEntry.key[2]) {
        continue;
      }

      const analysisDataId = await kv.get<string>([
        THOTH,
        THOTH_ANALYSIS_DATA_ID,
        targetEntry.key[2],
      ]);
      let entry = await kv.get<string>([
        THOTH,
        THOTH_RAW_DATA,
        analysisDataId.value!,
      ]);
      await kv.delete(entry.key);

      entry = await kv.get<string>([
        THOTH,
        THOTH_RESERVATION_ANALYSIS,
        analysisDataId.value!,
      ]);
      await kv.delete(entry.key);

      const entries = await kv.list<string[]>({
        prefix: [THOTH, getThothGramKeyReverse(gram), targetEntry.key[2]],
      });
      for await (const entry of entries) {
        await kv.delete(entry.value);
        await kv.delete(entry.key);
      }
      entry = await kv.get<string>([
        THOTH,
        THOTH_ANALYSIS_DATA_ID,
        targetEntry.key[2],
      ]);
      await kv.delete(entry.key);
      entry = await kv.get<string>([
        THOTH,
        THOTH_ORIGIN_DATA_ID,
        analysisDataId.value!,
      ]);
      await kv.delete(entry.key);
      await kv.delete(targetEntry.key);
    }
  };
}

function getSearchFunc(kv: Deno.Kv, gram: number) {
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
  console.log("startKeyword", startKeyword);
  console.log("endKeyword", endKeyword);

  const entries = await kv.list<string>({
    start: [THOTH, getThothGramKey(gram), startKeyword],
    end: [THOTH, getThothGramKey(gram), endKeyword],
  });

  const result = new Set<string>();
  for await (const entry of entries) {
    const value = entry.value;
    result.add(value);
  }
  console.log("result", result);
  return result;
}
async function searchEqualKeyword(kv: Deno.Kv, gram: number, keyword: string) {
  const entries = await kv.list<string>({
    prefix: [THOTH, getThothGramKey(gram), keyword],
  });

  const result = new Set<string>();
  for await (const entry of entries) {
    const key = entry.key;
    const value = entry.value;
    result.add(value);
  }
  console.log("result", result);
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
  console.log("keywords", keywords);

  let result: string[] = [];
  let isFirst = true;
  for await (const gramKeyword of keywords) {
    const gramResult = await searchEqualKeyword(kv, gram, gramKeyword);
    console.log("gramResult", gramResult);

    if (isFirst) {
      Array.from(gramResult).map((g) => result.push(g));
      isFirst = false;
      if (result.length == 0) {
        console.log("no result");
        break;
      }
      continue;
    }
    console.log("result", result);
    console.log("gramResult", gramResult);
    if (gramResult.size == 0) {
      console.log("no result3");
      result = [];
      break;
    }

    result = result.filter((r) => gramResult.has(r));
  }
  console.log("result", result);
  return new Set(result);
}

function getUpdateFunc(kv: Deno.Kv, gram: number, synchronous: boolean = true) {
  return function () {
  };
}

function getFlashFunc(kv: Deno.Kv, defaultSynchronous: boolean = true) {
  return async function (synchronous: boolean = true) {
    if (!(defaultSynchronous && synchronous)) {
      kv.set([THOTH, THOTH_ASYNCHRONOUS_FLASH], true);
      return;
    }

    const entries = await kv.list<string>({ prefix: [THOTH] });
    for await (const entry of entries) {
      console.info(
        "\u001b[31mTHOTH DATA DELETE : KV Key[",
        entry.key.toString(),
        "] \u001b[0m",
      );
      kv.delete(entry.key);
    }
  };
}

function getTaskFunc(kv: Deno.Kv, gram: number) {
  return function (schedule: string | Deno.CronSchedule = "* * * * *") {
    Deno.cron(`${THOTH}_TASK`, schedule, async () => {
      console.info(await kv.get([THOTH, THOTH_ASYNCHRONOUS_FLASH]));
      if ((await kv.get([THOTH, THOTH_ASYNCHRONOUS_FLASH]))?.value) {
        console.info("\u001b[31mSTART ASYNCHRONOUS FLASH !\u001b[0m");
        await getFlashFunc(kv)();
      }

      console.info("\u001b[32mSTART UNREGISTER !\u001b[0m");
      await getUnregisterFunc(kv, gram)();

      console.info("\u001b[32mSTART ANALYSIS !\u001b[0m");
      await getAnalysisFunc(kv, gram)();

    });
  };
}

export function createThothClient(
  kv: Deno.Kv,
  gram: number,
  defaultSynchronous: boolean = true,
) {
  return {
    register: getRegisterFunc(kv, gram, defaultSynchronous),
    analysis: getAnalysisFunc(kv, gram),
    unregister: getUnregisterFunc(kv, gram, defaultSynchronous),
    search: getSearchFunc(kv, gram),
    update: getUpdateFunc(kv, gram),
    flash: getFlashFunc(kv, defaultSynchronous),
    task: getTaskFunc(kv, gram),
  };
}
