import {
  getThothAnalysisKey,
  getThothAnalysisProgressKey,
  getThothAnalysisReverseKey,
  getThothGramReverseKeyPrefix,
  getThothInputIdKey,
  getThothLazyUnregisterKey,
  getThothLazyUnregisterKeys,
  getThothRawInputKey,
} from "./kvkey.ts";
import { generateThothId } from "./utils.ts";
import { getThothError } from "./error.ts";
import { getAnalysisOneFunc } from "./analysis.ts";

export function getRegisterFunc(
  kv: Deno.Kv,
  gram: number,
  defaultLazy: boolean = false,
) {
  return async function (
    rawData: string[],
    originId: string,
    lazy: boolean = defaultLazy,
  ) {
    const inputKey = getThothInputIdKey(originId);
    const checkData = await kv.get(inputKey);

    if (checkData.versionstamp != null) {
      throw new Error("Data save Error");
    }

    const thothId = generateThothId();
    const atomic = await kv
      .atomic()
      .check(checkData)
      .set(inputKey, thothId)
      .set(getThothRawInputKey(thothId), rawData)
      .set(getThothAnalysisProgressKey(thothId), [0, 0])
      .set(getThothAnalysisKey(thothId), originId)
      .set(getThothAnalysisReverseKey(originId), thothId)
      .commit();

    if (!atomic.ok) {
      throw getThothError("Failed to save");
    }

    if (!(defaultLazy || lazy)) {
      await getAnalysisOneFunc(kv, gram)(thothId);
    }
  };
}

export function getUnregisterFunc(
  kv: Deno.Kv,
  gram: number,
  defaultLazy: boolean = false,
) {
  return async function (
    originId: string,
    lazy: boolean = defaultLazy,
  ) {
    if (!(defaultLazy || lazy)) {
      await getUnregisterOneFunc(kv, gram)(originId);
      return;
    }

    getUnregisterPushFunc(kv)(originId);
  };
}

function getUnregisterPushFunc(
  kv: Deno.Kv,
) {
  return async function (originId: string) {
    await kv.set(getThothLazyUnregisterKey(originId), originId);
  };
}

function getUnregisterOneFunc(
  kv: Deno.Kv,
  gram: number,
) {
  return async function (originId: string) {
    const thothId = await kv.get<string>(getThothAnalysisReverseKey(originId));

    if (thothId.versionstamp == null) {
      throw getThothError("Failed to find key", originId);
    }

    const gramEntries = await kv.list<string[]>({
      prefix: [...getThothGramReverseKeyPrefix(gram), originId],
    });

    for await (const entry of gramEntries) {
      await kv.atomic().delete(entry.value).delete(entry.key).commit();
    }

    const result = await kv
      .atomic()
      .delete(getThothInputIdKey(originId))
      .delete(getThothRawInputKey(thothId.value))
      .delete(getThothAnalysisProgressKey(thothId.value))
      .delete(getThothAnalysisKey(thothId.value))
      .delete(getThothAnalysisReverseKey(originId))
      .commit();

    if (!result.ok) {
      throw getThothError("Failed to delete");
    }
  };
}

export function getUnregisterTaskFunc(
  kv: Deno.Kv,
  gram: number,
) {
  return async function () {
    const entries = await kv.list<string>({
      prefix: getThothLazyUnregisterKeys(),
    });

    for await (const entry of entries) {
      await getUnregisterOneFunc(kv, gram)(entry.value);
      await kv.delete(entry.key);
    }
  };
}
