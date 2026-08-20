// Unit tests for portal pure helpers (no Firebase, no emulator needed).
// Run: node --test tests/portal-lib.test.mjs
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_COMPLETION_THRESHOLD,
  HMT_LECTURES,
  clampThreshold,
  formatClock,
  friendlyAuthError,
  requiredSeconds,
  resumePositionSeconds,
} from "../app/portal/portalLib.js";

describe("clampThreshold", () => {
  it("accepts valid integers", () => {
    assert.equal(clampThreshold(70), 70);
    assert.equal(clampThreshold("85"), 85);
    assert.equal(clampThreshold(1), 1);
    assert.equal(clampThreshold(100), 100);
  });
  it("rejects out-of-range and invalid values", () => {
    assert.equal(clampThreshold(0), null);
    assert.equal(clampThreshold(101), null);
    assert.equal(clampThreshold(-5), null);
    assert.equal(clampThreshold("abc"), null);
    assert.equal(clampThreshold(NaN), null);
    assert.equal(clampThreshold(undefined), null);
  });
});

describe("requiredSeconds (threshold % of real duration)", () => {
  it("matches the owner's worked examples", () => {
    // 80-minute lecture @ 60% => 48 minutes
    assert.equal(requiredSeconds(80 * 60, 60), 48 * 60);
    // 80-minute lecture @ 70% => 56 minutes
    assert.equal(requiredSeconds(80 * 60, 70), 56 * 60);
    // 30-minute lecture @ 70% => 21 minutes
    assert.equal(requiredSeconds(30 * 60, 70), 21 * 60);
  });
  it("rounds up partial seconds and enforces a minimum of 1s", () => {
    assert.equal(requiredSeconds(101, 70), 71); // 70.7 -> 71
    assert.equal(requiredSeconds(1, 70), 1);
    assert.equal(requiredSeconds(100, 50), 50);
  });
  it("returns Infinity until the real duration is known", () => {
    assert.equal(requiredSeconds(0, 70), Infinity);
    assert.equal(requiredSeconds(undefined, 70), Infinity);
  });
  it("falls back to the default threshold if threshold is invalid", () => {
    assert.equal(requiredSeconds(100, null), Math.ceil(100 * DEFAULT_COMPLETION_THRESHOLD / 100));
  });
});

describe("formatClock", () => {
  it("formats seconds and minutes", () => {
    assert.equal(formatClock(0), "0:00");
    assert.equal(formatClock(45), "0:45");
    assert.equal(formatClock(125), "2:05");
  });
  it("formats hours", () => {
    assert.equal(formatClock(3725), "1:02:05");
  });
  it("never shows negative time", () => {
    assert.equal(formatClock(-10), "0:00");
  });
});

describe("friendlyAuthError", () => {
  const cases = [
    ["auth/invalid-credential", "Incorrect email or password."],
    ["auth/wrong-password", "Incorrect email or password."],
    ["auth/user-not-found", "Incorrect email or password."],
    ["auth/email-already-in-use", "This email is already registered — try logging in instead."],
    ["auth/weak-password", "Password is too weak — use at least 6 characters."],
    ["auth/invalid-email", "That email address doesn't look right."],
    ["auth/network-request-failed", "Network error — please check your connection and try again."],
  ];
  for (const [code, expected] of cases) {
    it(`${code} -> friendly message`, () => {
      assert.equal(friendlyAuthError({ code }), expected);
    });
  }
  it("unknown errors get a safe generic message (no internals leaked)", () => {
    assert.equal(friendlyAuthError({ code: "auth/something-new" }), "Something went wrong — please try again.");
    assert.equal(friendlyAuthError(null), "Something went wrong — please try again.");
  });
});

describe("resumePositionSeconds", () => {
  it("does not seek for fresh starts (<10s watched)", () => {
    assert.equal(resumePositionSeconds(5, 3600), 0);
    assert.equal(resumePositionSeconds(0, 3600), 0);
  });
  it("resumes mid-lecture where the student left off", () => {
    assert.equal(resumePositionSeconds(1920, 4800), 1920); // 32 min of 80 min
  });
  it("restarts a fully-watched lecture from the beginning", () => {
    assert.equal(resumePositionSeconds(4798, 4800), 0);
    assert.equal(resumePositionSeconds(4800, 4800), 0);
  });
});

describe("lecture catalogue integrity", () => {
  it("has unique ids and video ids", () => {
    const ids = new Set(HMT_LECTURES.map((l) => l.id));
    const vids = new Set(HMT_LECTURES.map((l) => l.videoId));
    assert.equal(ids.size, HMT_LECTURES.length);
    assert.equal(vids.size, HMT_LECTURES.length);
  });
  it("durations are defined in SECONDS (the old code mislabeled them as minutes)", () => {
    for (const l of HMT_LECTURES) {
      assert.ok(l.fallbackDurationSeconds > 0 && l.fallbackDurationSeconds < 3600);
    }
  });
});
