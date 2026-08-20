// ============================================================================
// HMT Success Academy — Firestore Security Rules test suite
// ----------------------------------------------------------------------------
// Runs against the Firestore EMULATOR (project "demo-hmt") — never touches any
// (invoked via scripts/run-rules-tests.mjs; failures are committed to ci-diagnostics/)
// real Firebase project. Run locally with:
//   npm run test:rules
// (requires Java + firebase-tools; also runs automatically in GitHub Actions)
// ============================================================================
import { readFileSync } from "node:fs";
import { describe, before, after, beforeEach, it } from "node:test";
import assert from "node:assert/strict";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import {
  collection, doc, getDoc, getDocs, getCountFromServer,
  setDoc, updateDoc, deleteDoc, serverTimestamp, increment,
} from "firebase/firestore";

const PROJECT_ID = "demo-hmt";
const UID_A = "student_a";       // ordinary student
const UID_B = "student_b";       // another ordinary student
const UID_ADMIN = "admin_user";  // uid listed in admins/{uid}
const UID_LEGACY = "student_legacy"; // oldest doc shape (no completedVideos field)

let testEnv;

function ctx(uid, email) {
  return uid === null
    ? testEnv.unauthenticatedContext()
    : testEnv.authenticatedContext(uid, email ? { email } : undefined);
}
function db(uid, email) { return ctx(uid, email).firestore(); }

async function seed() {
  await testEnv.withSecurityRulesDisabled(async (c) => {
    const f = c.firestore();
    await setDoc(doc(f, "admins", UID_ADMIN), { role: "admin" });
    await setDoc(doc(f, "students", UID_A), {
      uid: UID_A, name: "Student A", email: "a@test.com",
      watchTimeMinutes: 85, completedVideos: ["1"],
      quizScore: 0, assignmentScore: 0, createdAt: "2026-01-01T00:00:00.000Z",
    });
    await setDoc(doc(f, "students", UID_B), {
      uid: UID_B, name: "Student B", email: "b@test.com",
      watchTimeMinutes: 0, completedVideos: [],
      quizScore: 0, assignmentScore: 0, createdAt: "2026-01-02T00:00:00.000Z",
    });
    await setDoc(doc(f, "students", UID_LEGACY), {
      uid: UID_LEGACY, name: "Legacy", email: "legacy@test.com",
      watchTimeMinutes: 10, // NOTE: no completedVideos field at all (oldest shape)
      quizScore: 0, assignmentScore: 0, createdAt: "2025-12-01T00:00:00.000Z",
    });
    await setDoc(doc(f, "config", "settings"), { lectureCompletionThreshold: 70 });
    await setDoc(doc(f, "stats", "students"), { count: 3 });
  });
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: readFileSync("firestore.rules", "utf8") },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await seed();
});

after(() => testEnv?.cleanup());

// ---------------------------------------------------------------------------
describe("1. Anonymous visitors", () => {
  it("cannot read a student document", async () => {
    await assertFails(getDoc(doc(db(null), "students", UID_A)));
  });
  it("cannot list students", async () => {
    await assertFails(getDocs(collection(db(null), "students")));
  });
  it("cannot write a student document", async () => {
    await assertFails(setDoc(doc(db(null), "students", UID_A), { name: "x" }));
  });
  it("cannot read portal config", async () => {
    await assertFails(getDoc(doc(db(null), "config", "settings")));
  });
  it("cannot read the admin registry", async () => {
    await assertFails(getDoc(doc(db(null), "admins", UID_ADMIN)));
  });
  it("CAN read the public stats count (a number, no PII)", async () => {
    await assertSucceeds(getDoc(doc(db(null), "stats", "students")));
  });
});

// ---------------------------------------------------------------------------
describe("2. Cross-student isolation (Student A vs Student B)", () => {
  it("student can read own profile", async () => {
    await assertSucceeds(getDoc(doc(db(UID_A, "a@test.com"), "students", UID_A)));
  });
  it("student CANNOT read another student's profile", async () => {
    await assertFails(getDoc(doc(db(UID_A, "a@test.com"), "students", UID_B)));
  });
  it("student CANNOT list the students collection", async () => {
    await assertFails(getDocs(collection(db(UID_A, "a@test.com"), "students")));
  });
  it("student CANNOT run a count aggregation over students (getCountFromServer)", async () => {
    await assertFails(getCountFromServer(collection(db(UID_A, "a@test.com"), "students")));
  });
  it("student CANNOT modify another student's progress", async () => {
    await assertFails(updateDoc(doc(db(UID_A, "a@test.com"), "students", UID_B), {
      watchTimeMinutes: increment(5),
    }));
  });
  it("student CANNOT delete own document", async () => {
    await assertFails(deleteDoc(doc(db(UID_A, "a@test.com"), "students", UID_A)));
  });
  it("student CANNOT delete another student's document", async () => {
    await assertFails(deleteDoc(doc(db(UID_A, "a@test.com"), "students", UID_B)));
  });
  it("student CANNOT create a profile under another uid", async () => {
    await assertFails(setDoc(doc(db(UID_A, "a@test.com"), "students", UID_B), {
      uid: UID_B, name: "Fake", email: "a@test.com", watchTimeMinutes: 0, completedVideos: [],
      quizScore: 0, assignmentScore: 0, createdAt: new Date().toISOString(),
    }));
  });
  it("student CANNOT list another student's progress subcollection", async () => {
    await setDoc(doc(db(UID_B, "b@test.com"), "students", UID_B, "progress", "1"),
      { watchedSeconds: 0, completed: false });
    await assertFails(getDocs(collection(db(UID_A, "a@test.com"), "students", UID_B, "progress")));
  });
});

// ---------------------------------------------------------------------------
describe("3. Profile document field protection", () => {
  it("identity fields are immutable from the client (name)", async () => {
    await assertFails(updateDoc(doc(db(UID_A, "a@test.com"), "students", UID_A), { name: "Hacker" }));
  });
  it("quizScore is immutable from the client", async () => {
    await assertFails(updateDoc(doc(db(UID_A, "a@test.com"), "students", UID_A), { quizScore: 100 }));
  });
  it("email is immutable from the client", async () => {
    await assertFails(updateDoc(doc(db(UID_A, "a@test.com"), "students", UID_A), { email: "x@y.z" }));
  });
  it("legitimate progress write works (arrayUnion + increment)", async () => {
    await assertSucceeds(updateDoc(doc(db(UID_A, "a@test.com"), "students", UID_A), {
      completedVideos: ["1", "2"], watchTimeMinutes: increment(76),
    }));
  });
  it("completedVideos is append-only: removal is DENIED", async () => {
    await assertFails(updateDoc(doc(db(UID_A, "a@test.com"), "students", UID_A), {
      completedVideos: [],
    }));
  });
  it("completedVideos is append-only: partial removal is DENIED", async () => {
    await assertFails(updateDoc(doc(db(UID_A, "a@test.com"), "students", UID_A), {
      completedVideos: ["2"], // dropped "1"
    }));
  });
  it("legacy doc without completedVideos field is NOT locked out", async () => {
    await assertSucceeds(updateDoc(doc(db(UID_LEGACY, "legacy@test.com"), "students", UID_LEGACY), {
      completedVideos: ["1"], watchTimeMinutes: increment(85),
    }));
  });
});

// ---------------------------------------------------------------------------
describe("4. Per-lecture progress documents (monotonic guarantees)", () => {
  const p = (d, id) => doc(d, "students", UID_A, "progress", id);

  it("student can create own progress doc and list own progress", async () => {
    const d = db(UID_A, "a@test.com");
    await assertSucceeds(setDoc(p(d, "1"), { watchedSeconds: 0, completed: false }));
    await assertSucceeds(getDocs(collection(d, "students", UID_A, "progress")));
  });
  it("student CANNOT create progress under another student", async () => {
    await assertFails(setDoc(doc(db(UID_A, "a@test.com"), "students", UID_B, "progress", "1"), {
      watchedSeconds: 0, completed: false,
    }));
  });
  it("watchedSeconds can increase (30 -> 120)", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), { watchedSeconds: 30, completed: false, updatedAt: serverTimestamp() });
    await assertSucceeds(updateDoc(p(d, "1"), { watchedSeconds: increment(90) }));
  });
  it("watchedSeconds can NOT decrease (30 -> 10)", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), { watchedSeconds: 30, completed: false });
    await assertFails(updateDoc(p(d, "1"), { watchedSeconds: 10 }));
  });
  it("watchedSeconds can NOT be deleted", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), { watchedSeconds: 30, completed: false });
    const { deleteField } = await import("firebase/firestore");
    await assertFails(updateDoc(p(d, "1"), { watchedSeconds: deleteField() }));
  });
  it("unknown fields can NOT be introduced", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), { watchedSeconds: 0, completed: false });
    await assertFails(updateDoc(p(d, "1"), { evil: true }));
  });
  it("completed can transition false -> true (with stamps)", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), { watchedSeconds: 3600, completed: false });
    await assertSucceeds(updateDoc(p(d, "1"), {
      completed: true,
      completedAt: serverTimestamp(),
      completionThreshold: 70,
      requiredSecondsAtCompletion: 3360,
      updatedAt: serverTimestamp(),
    }));
  });
  it("completed can NOT transition true -> false", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), {
      watchedSeconds: 3600, completed: true,
      completedAt: serverTimestamp(), completionThreshold: 70, requiredSecondsAtCompletion: 3360,
    });
    await assertFails(updateDoc(p(d, "1"), { completed: false }));
  });
  it("completedAt is immutable once set", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), {
      watchedSeconds: 3600, completed: true,
      completedAt: serverTimestamp(), completionThreshold: 70, requiredSecondsAtCompletion: 3360,
    });
    await assertFails(updateDoc(p(d, "1"), { completedAt: serverTimestamp() }));
  });
  it("completionThreshold is immutable once set", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), {
      watchedSeconds: 3600, completed: true,
      completedAt: serverTimestamp(), completionThreshold: 70, requiredSecondsAtCompletion: 3360,
    });
    await assertFails(updateDoc(p(d, "1"), { completionThreshold: 10 }));
  });
  it("requiredSecondsAtCompletion is immutable once set", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), {
      watchedSeconds: 3600, completed: true,
      completedAt: serverTimestamp(), completionThreshold: 70, requiredSecondsAtCompletion: 3360,
    });
    await assertFails(updateDoc(p(d, "1"), { requiredSecondsAtCompletion: 1 }));
  });
  it("videoDurationSeconds is immutable once set", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), { watchedSeconds: 5, completed: false, videoDurationSeconds: 4800 });
    await assertFails(updateDoc(p(d, "1"), { videoDurationSeconds: 60 }));
  });
  it("progress documents can NOT be deleted", async () => {
    const d = db(UID_A, "a@test.com");
    await setDoc(p(d, "1"), { watchedSeconds: 0, completed: false });
    await assertFails(deleteDoc(p(d, "1")));
  });
  it("KNOWN LIMITATION (documented): account owner CAN forge a completion create — not cheat-proof", async () => {
    const d = db(UID_A, "a@test.com");
    // This must stay allowed because legitimate first-watch creates use the same path.
    await assertSucceeds(setDoc(p(d, "2"), {
      watchedSeconds: 0, completed: true, completedAt: serverTimestamp(),
      completionThreshold: 70, requiredSecondsAtCompletion: 3360,
    }));
  });
});

// ---------------------------------------------------------------------------
describe("5. Config (lecture completion threshold)", () => {
  it("signed-in students can read the threshold", async () => {
    await assertSucceeds(getDoc(doc(db(UID_A, "a@test.com"), "config", "settings")));
  });
  it("students CANNOT change the threshold", async () => {
    await assertFails(setDoc(doc(db(UID_A, "a@test.com"), "config", "settings"), {
      lectureCompletionThreshold: 10,
    }, { merge: true }));
  });
  it("admin can set a valid threshold", async () => {
    await assertSucceeds(setDoc(doc(db(UID_ADMIN), "config", "settings"), {
      lectureCompletionThreshold: 60, updatedAt: serverTimestamp(),
    }, { merge: true }));
  });
  it("admin threshold must be 1..100 (150 rejected)", async () => {
    await assertFails(setDoc(doc(db(UID_ADMIN), "config", "settings"), {
      lectureCompletionThreshold: 150,
    }, { merge: true }));
  });
  it("admin threshold must be an int (string rejected)", async () => {
    await assertFails(setDoc(doc(db(UID_ADMIN), "config", "settings"), {
      lectureCompletionThreshold: "70",
    }, { merge: true }));
  });
});

// ---------------------------------------------------------------------------
describe("6. Admin registry", () => {
  it("user can check own admins entry (admin)", async () => {
    await assertSucceeds(getDoc(doc(db(UID_ADMIN), "admins", UID_ADMIN)));
  });
  it("user can check own admins entry (non-admin -> simply not found)", async () => {
    await assertSucceeds(getDoc(doc(db(UID_A, "a@test.com"), "admins", UID_A)));
  });
  it("user CANNOT read someone else's admins entry", async () => {
    await assertFails(getDoc(doc(db(UID_A, "a@test.com"), "admins", UID_ADMIN)));
  });
  it("student CANNOT self-promote to admin", async () => {
    await assertFails(setDoc(doc(db(UID_A, "a@test.com"), "admins", UID_A), { role: "admin" }));
  });
  it("student CANNOT modify an admin record", async () => {
    await assertFails(updateDoc(doc(db(UID_A, "a@test.com"), "admins", UID_ADMIN), { role: "owner" }));
  });
  it("student CANNOT list the admins collection", async () => {
    await assertFails(getDocs(collection(db(UID_A, "a@test.com"), "admins")));
  });
});

// ---------------------------------------------------------------------------
describe("7. Stats counter", () => {
  const s = (d) => doc(d, "stats", "students");
  it("signup increment of exactly +1 with allowed keys is allowed", async () => {
    await assertSucceeds(updateDoc(s(db(UID_A, "a@test.com")), {
      count: increment(1), updatedAt: serverTimestamp(), updatedBy: UID_A,
    }));
  });
  it("counter CANNOT be decreased", async () => {
    await assertFails(updateDoc(s(db(UID_A, "a@test.com")), { count: increment(-1) }));
  });
  it("counter CANNOT jump by more than 1", async () => {
    await assertFails(updateDoc(s(db(UID_A, "a@test.com")), { count: increment(5) }));
  });
  it("counter update cannot smuggle other fields", async () => {
    await assertFails(updateDoc(s(db(UID_A, "a@test.com")), {
      count: increment(1), owner: UID_A,
    }));
  });
  it("students CANNOT create or delete stats docs", async () => {
    await assertFails(setDoc(doc(db(UID_A, "a@test.com"), "stats", "other"), { count: 0 }));
    await assertFails(deleteDoc(s(db(UID_A, "a@test.com"))));
  });
  it("admin can set the counter to the real value (sync)", async () => {
    await assertSucceeds(setDoc(s(db(UID_ADMIN)), {
      count: 1234, updatedAt: serverTimestamp(), updatedBy: UID_ADMIN,
    }, { merge: true }));
  });
});

// ---------------------------------------------------------------------------
describe("8. Admin capabilities (dashboard/count)", () => {
  it("admin CAN list students (dashboard)", async () => {
    await assertSucceeds(getDocs(collection(db(UID_ADMIN), "students")));
  });
  it("admin CAN run the real count aggregation (getCountFromServer)", async () => {
    const snap = await getCountFromServer(collection(db(UID_ADMIN), "students"));
    assert.equal(snap.data().count, 3);
  });
  it("admin CAN read a student document", async () => {
    await assertSucceeds(getDoc(doc(db(UID_ADMIN), "students", UID_A)));
  });
});
