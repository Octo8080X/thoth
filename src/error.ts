type ThothError =
  | "Duplicate key"
  | "Failed to save"
  | "Failed to delete"
  | "Failed to analysis"
  | "Failed to find key"
  | "Same error";

export function getThothError(error: ThothError, message?: string) {
  return new Error(`Thoth Error: ${error} ${message || ""}`);
}
