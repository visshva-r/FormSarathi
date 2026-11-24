import { describe, expect, it } from "vitest";
import { compareNames, levenshtein, normalizeName } from "./match";

describe("normalizeName", () => {
  it("strips honorifics and case", () => {
    expect(normalizeName("Shri Ramesh Kumar")).toBe("ramesh kumar");
  });
});

describe("compareNames", () => {
  it("matches identical names", () => {
    expect(compareNames("Priya Sharma", "Priya Sharma")).toBe("match");
  });
  it("flags Sharmaa typo", () => {
    expect(compareNames("Priya Sharmaa", "Priya Sharma")).toBe("typo");
  });
  it("flags real mismatch", () => {
    expect(compareNames("Amit Singh", "Priya Sharma")).toBe("mismatch");
  });
});

describe("levenshtein", () => {
  it("distance zero for equal strings", () => {
    expect(levenshtein("abc", "abc")).toBe(0);
  });
});