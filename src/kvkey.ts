export const KV_SERVICE_KEY = "THOTH" as const;
export const THOTH_INPUT_ID_KEY = "INPUT_ID" as const;
export const THOTH_RAW_INPUT_KEY = "RAW_INPUT" as const;
export const THOTH_ANALYSIS_KEY = "ANALYSIS" as const;
export const THOTH_ANALYSIS_PROGRESS_KEY = "PROGRESS" as const;
export const THOTH_ANALYSIS_REVERSE_KEY = "ANALYSIS_REVERSE" as const;
export const THOTH_LAZY_UNREGISTER_KEY = "LAZY_UNREGISTER" as const;

export const getThothGramKeyPrefix = (gram: number) => {
  return [KV_SERVICE_KEY, `GRAM_${gram}`] as const;
};
export const getThothGramReverseKeyPrefix = (gram: number) => {
  return [KV_SERVICE_KEY, `GRAM_${gram}_REVERSE`] as const;
};

export function getThothInputIdKey(inputId: string | number) {
  return [KV_SERVICE_KEY, THOTH_INPUT_ID_KEY, inputId] as const;
}

export function getThothRawInputKey(thothId: string) {
  return [KV_SERVICE_KEY, THOTH_RAW_INPUT_KEY, thothId] as const;
}

export function getThothAnalysisKey(analysisId: string) {
  return [KV_SERVICE_KEY, THOTH_ANALYSIS_KEY, analysisId] as const;
}

export function getThothAnalysisProgressKey(analysisId: string) {
  return [KV_SERVICE_KEY, THOTH_ANALYSIS_PROGRESS_KEY, analysisId] as const;
}

export function getThothAnalysisProgressKeys() {
  return [KV_SERVICE_KEY, THOTH_ANALYSIS_PROGRESS_KEY] as const;
}

export function getThothAnalysisReverseKey(analysisId: string) {
  return [KV_SERVICE_KEY, THOTH_ANALYSIS_REVERSE_KEY, analysisId] as const;
}
export function getThothAnalysisReverseKeys() {
  return [KV_SERVICE_KEY, THOTH_ANALYSIS_REVERSE_KEY] as const;
}
export function getThothLazyUnregisterKey(inputId: string | number) {
  return [KV_SERVICE_KEY, THOTH_LAZY_UNREGISTER_KEY, inputId] as const;
}
export function getThothLazyUnregisterKeys() {
  return [KV_SERVICE_KEY, THOTH_LAZY_UNREGISTER_KEY] as const;
}
