const CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" as const;

export function generateText(length: number, chars: string = CHARS): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(length))).map((n) =>
    chars[n % chars.length]
  ).join("");
}

export function mixText(base: string, insert: string): string {
  const baseLength = base.length;

  const splitPoint = Math.random() * baseLength;

  const splits = [
    base.substr(0, splitPoint - 1),
    base.substr(splitPoint, baseLength),
  ];

  return [splits[0], insert, splits[1]].join("");
}
