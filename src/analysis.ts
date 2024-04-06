import {
  getThothAnalysisKey,
  getThothAnalysisProgressKey,
  getThothAnalysisProgressKeys,
  getThothGramKeyPrefix,
  getThothGramReverseKeyPrefix,
  getThothRawInputKey,
} from "./kvkey.ts";
import { getThothError } from "./error.ts";

export function getAnalysisOneFunc(kv: Deno.Kv, gram: number) {
  return async function (thothId: string) {
    const rawInput = await kv.get<string[]>(getThothRawInputKey(thothId));
    const analysisProgress = await kv.get<[number, number]>(
      getThothAnalysisProgressKey(thothId),
    );
    const analysis = await kv.get<string>(getThothAnalysisKey(thothId));

    if (rawInput.versionstamp == null || analysisProgress == null) {
      throw getThothError("Failed to analysis", thothId);
    }

    const initI = analysisProgress.value![0];
    const initJ = analysisProgress.value![1];

    const rows = rawInput.value.slice(initI, rawInput.value.length);

    let i = initI;
    let isZeroResetJ = false;
    for await (const row of rows) {
      const cells = [];
      for (let j = isZeroResetJ ? 0 : initJ; j + gram <= row.length; j++) {
        cells.push([j, row.slice(j, j + gram)]);
      }

      for await (const cell of cells) {
        const atomic = kv
          .atomic()
          .set(
            [...getThothGramKeyPrefix(gram), cell[1], thothId],
            analysis.value,
          )
          .set(
            [...getThothGramReverseKeyPrefix(gram), analysis.value!, cell[1]],
            [...getThothGramKeyPrefix(gram), cell[1], thothId],
          )
          .set(getThothAnalysisProgressKey(thothId), [i, cell[0]]);
        await atomic.commit();
      }
      i++;
      isZeroResetJ = true;
    }
    kv.delete(getThothAnalysisProgressKey(thothId));
  };
}

export function getAnalysisFunc(kv: Deno.Kv, gram: number) {
  return async function () {
    const targets = await kv.list<[number, number]>({
      prefix: getThothAnalysisProgressKeys(),
    });

    for await (const targetEntry of targets) {
      await getAnalysisOneFunc(kv, gram)(targetEntry.key[2].toString());
    }
  };
}
