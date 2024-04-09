import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { createThothClient } from "../src/thoth.ts";
import { afterEach, beforeEach, describe, it } from "jsr:@std/testing/bdd";
import { generateText, mixText } from "./text_generator.ts";

describe("Thoth", () => {
  let kv: Deno.Kv;
  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
  });
  afterEach(() => {
    kv.close();
  });

  it("#flash", async () => {
    const thothClient = createThothClient(kv, 3);
    await thothClient.register(["ABCDEFG", "abcdefg"], "000001");

    const entriesNotFlashed = await kv.list<string>({ prefix: ["THOTH"] });

    let count = 0;
    for await (const _entry of entriesNotFlashed) {
      count++;
    }

    assertNotEquals(count, 0);
    await thothClient.flash(true);

    const entriesFlashed = await kv.list<string>({ prefix: ["THOTH"] });

    count = 0;
    for await (const _entry of entriesFlashed) {
      count++;
    }

    assertEquals(count, 0);
  });

  describe("#register", () => {
    it("sync 2-gram ", async () => {
      const thothClient = createThothClient(kv, 2);
      await thothClient.register(["ABCDEFG", "abcdefg"], "000001");

      assertEquals(await thothClient.search("AB"), { "000001": { "0": [0] } });
      assertEquals(await thothClient.search("BC"), { "000001": { "0": [1] } });
      assertEquals(await thothClient.search("CD"), { "000001": { "0": [2] } });
      assertEquals(await thothClient.search("DE"), { "000001": { "0": [3] } });
      assertEquals(await thothClient.search("EF"), { "000001": { "0": [4] } });
      assertEquals(await thothClient.search("FG"), { "000001": { "0": [5] } });

      assertEquals(await thothClient.search("ABCD"), {
        "000001": { "0": [0] },
      });

      assertEquals(await thothClient.search("BA"), {});
    });
    it("sync 3-gram ", async () => {
      const thothClient = createThothClient(kv, 3);
      await thothClient.register(["ABCDEFG", "abcdefg"], "000001");

      assertEquals(await thothClient.search("AB"), { "000001": { "0": [0] } });
      assertEquals(await thothClient.search("BC"), { "000001": { "0": [1] } });
      assertEquals(await thothClient.search("CD"), { "000001": { "0": [2] } });
      assertEquals(await thothClient.search("DE"), { "000001": { "0": [3] } });
      assertEquals(await thothClient.search("EF"), { "000001": { "0": [4] } });
      assertEquals(await thothClient.search("FG"), {});

      assertEquals(await thothClient.search("ABCD"), {
        "000001": { "0": [0] },
      });

      assertEquals(await thothClient.search("BA"), {});
    });

    it("lazy", async () => {
      const thothClient = createThothClient(kv, 3, true);
      await thothClient.register(["ABCDEFG", "abcdefg"], "000001", true);

      assertEquals(await thothClient.search("AB"), {});
      await thothClient.analysis();

      assertEquals(await thothClient.search("AB"), { "000001": { "0": [0] } });
    });

    it("long text", async () => {
      const thothClient = createThothClient(kv, 3);

      const chars1 =
        "abcdefghijklmnopqrstuvwxyzDEFGHIJKLMNOPQRSTUVWXYZ0123456789" as const;
      const chars2 =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" as const;
      const chars3 =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" as const;
      const baseText1 = generateText(1000, chars1);
      const baseText2 = generateText(1000, chars2);
      const baseText3 = generateText(1000, chars3);
      const text1 = mixText(baseText1, "ABC");
      const text2 = mixText(baseText2, "あいう");
      const text3 = mixText(baseText3, "佐藤");

      await thothClient.register([text1, text2, text3], "000001");
      await thothClient.register([baseText1, baseText2, baseText3], "000002");

      assertExists((await thothClient.search("ABC"))["000001"]["0"]);
      assertExists((await thothClient.search("あいう"))["000001"]["1"]);
      assertExists((await thothClient.search("佐藤"))["000001"]["2"]);
      assertExists((await thothClient.search("BC"))["000001"]["0"]);
      assertExists((await thothClient.search("あい"))["000001"]["1"]);
      assertExists((await thothClient.search("いう"))["000001"]["1"]);
      assertEquals(await thothClient.search("仁藤"), {});
    });
  });

  describe("#register multi", () => {
    it("sync 2-gram", async () => {
      const thothClient = createThothClient(kv, 2);
      await thothClient.register(["ABCDEFG", "abcdefg"], "000001");
      await thothClient.register(["EFGHIJK", "efghijk"], "000002");

      //      const entriesNotFlashed = await kv.list<string>({ prefix: ["THOTH"] });
      //      for await (const entry of entriesNotFlashed) {
      //        console.log(entry.key);
      //      }

      assertEquals(await thothClient.search("AB"), { "000001": { "0": [0] } });
      assertEquals(await thothClient.search("BC"), { "000001": { "0": [1] } });
      assertEquals(await thothClient.search("CD"), { "000001": { "0": [2] } });
      assertEquals(await thothClient.search("DE"), { "000001": { "0": [3] } });
      assertEquals(await thothClient.search("EF"), {
        "000001": { "0": [4] },
        "000002": { "0": [0] },
      });
      assertEquals(await thothClient.search("FG"), {
        "000001": { "0": [5] },
        "000002": { "0": [1] },
      });

      assertEquals(await thothClient.search("GH"), { "000002": { "0": [2] } });
      assertEquals(await thothClient.search("HI"), { "000002": { "0": [3] } });
      assertEquals(await thothClient.search("IJ"), { "000002": { "0": [4] } });
      assertEquals(await thothClient.search("JK"), { "000002": { "0": [5] } });
      assertEquals(await thothClient.search("BA"), {});
    });

    //
    //    it("sync 3-gram ", async () => {
    //      const thothClient = createThothClient(kv, 3);
    //      await thothClient.register(["ABCDEFG", "abcdefg"], "000001");
    //      await thothClient.register(["EFGHIJK", "efghijk"], "000002");
    //
    //      assertArrayIncludes(Array.from(await thothClient.search("AB")), [
    //        "000001",
    //      ]);
    //      assertArrayIncludes(Array.from(await thothClient.search("BC")), [
    //        "000001",
    //      ]);
    //      assertArrayIncludes(Array.from(await thothClient.search("CD")), [
    //        "000001",
    //      ]);
    //      assertArrayIncludes(Array.from(await thothClient.search("DE")), [
    //        "000001",
    //      ]);
    //      assertArrayIncludes(Array.from(await thothClient.search("EF")), [
    //        "000001",
    //      ]);
    //      assertArrayIncludes(Array.from(await thothClient.search("FG")), [
    //        "000002",
    //      ]);
    //      assertArrayIncludes(Array.from(await thothClient.search("GH")), [
    //        "000002",
    //      ]);
    //      assertArrayIncludes(Array.from(await thothClient.search("HI")), [
    //        "000002",
    //      ]);
    //      assertArrayIncludes(Array.from(await thothClient.search("IJ")), [
    //        "000002",
    //      ]);
    //      assertArrayIncludes(Array.from(await thothClient.search("JK")), []);
    //
    //      assertArrayIncludes(Array.from(await thothClient.search("BA")), []);
    //    });
    //
    //    it("lazy", async () => {
    //      const thothClient = createThothClient(kv, 3, true);
    //      await thothClient.register(["ABCDEFG", "abcdefg"], "000001", true);
    //      await thothClient.register(["EFGHIJK", "efghijk"], "000002", true);
    //
    //      assertArrayIncludes(Array.from(await thothClient.search("EFG")), []);
    //
    //      await thothClient.analysis();
    //
    //      assertArrayIncludes(Array.from(await thothClient.search("EFG")), [
    //        "000001",
    //        "000002",
    //      ]);
    //    });
    //  });
    //
    //  describe("#unregister", () => {
    //    it("sync", async () => {
    //      const thothClient = createThothClient(kv, 2);
    //      await thothClient.register(["ABCDEFG", "abcdefg"], "000001");
    //
    //      assertArrayIncludes(Array.from(await thothClient.search("AB")), [
    //        "000001",
    //      ]);
    //      await thothClient.unregister("000001");
    //
    //      assertArrayIncludes(Array.from(await thothClient.search("AB")), []);
    //    });
    //    it("lazy", async () => {
    //      const thothClient = createThothClient(kv, 3);
    //      await thothClient.register(["ABCDEFG", "abcdefg"], "000001");
    //
    //      assertArrayIncludes(Array.from(await thothClient.search("AB")), [
    //        "000001",
    //      ]);
    //      await thothClient.unregister("000001", true);
    //      assertArrayIncludes(Array.from(await thothClient.search("AB")), [
    //        "000001",
    //      ]);
    //
    //      await thothClient.unregisterTask();
    //      assertArrayIncludes(Array.from(await thothClient.search("AB")), []);
    //    });
  });
});
