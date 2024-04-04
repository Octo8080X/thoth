import { ulid } from "../deps.ts";

export function generateThothId() {
  return ulid();
}
