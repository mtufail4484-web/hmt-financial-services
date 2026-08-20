"use client";

// ============================================================================
// PortalApp — HMT Success Academy Student Portal (client)
// ----------------------------------------------------------------------------
// Auth: Firebase email/password + session persistence via onAuthStateChanged.
// Data: students/{uid} (profile), students/{uid}/progress/{lectureId}
//       (per-lecture watch time + completion stamps), config/settings
//       (completion threshold, admin-managed), stats/students (public count),
//       admins/{uid} (admin self-check).
// Data safety: existing fields are never rewritten or deleted; completions in
// completedVideos are permanent; watch writes are atomic increments.
// ============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  setDoc as setDocMerge,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";
import LecturePlayer from "./LecturePlayer";
import {
  DEFAULT_COMPLETION_THRESHOLD,
  HMT_LECTURES,
  THRESHOLD_OPTIONS,
  clampThreshold,
  formatClock,
  friendlyAuthError,
  requiredSeconds,
} from "./portalLib";

// ---------------------------------------------------------------------------
// Toasts (replace every browser alert())
// ---------------------------------------------------------------------------
function Toasts({ toasts, dismiss }) {
  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-amber-500",
    info: "bg-blue-600",
  };
  return (
    <div aria-live="polite" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[min(92vw,360px)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`${styles[t.kind] || styles.info} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-start justify-between gap-3`}
        >
          <span>{t.message}</span>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => dismiss(t.id)}
            className="text-white/80 hover:text-white font-bold leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Auth forms (login / signup / forgot password)
// ---------------------------------------------------------------------------
function AuthForms({ onToast, markSignupIntent }) {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setNotice("");
  };

  const validateSignup = () => {
    if (name.trim().length < 2) return "Please enter your full name.";
    if (password.length < 6) return "Password is too weak — use at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (mode === "signup") {
      const v = validateSignup();
      if (v) return setError(v);
    }
    setLoading(true);
    try {
      if (mode === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(cred.user, { displayName: name.trim() });
        // Profile document is created by the session listener (single code
        // path); the stats counter is bumped there too.
        onToast({ kind: "success", message: `Welcome, ${name.trim()}! Your account is ready.` });
      } else if (mode === "login") {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await sendPasswordResetEmail(auth, email.trim());
        setNotice(
          `If an account exists for ${email.trim()}, a password reset email is on its way. Please check your inbox (and spam folder).`
        );
      }
    } catch (err) {
      console.error("auth error:", err?.code || err);
      setError(friendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">HMT Student Portal</h1>
        <p className="text-center text-gray-500 text-sm mb-6">HMT Success Academy</p>

        {mode !== "forgot" && (
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1" role="tablist" aria-label="Authentication mode">
            {[
              ["login", "Log In"],
              ["signup", "Sign Up"],
            ].map(([m, label]) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
                  mode === m ? "bg-white text-blue-700 shadow" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
            {notice}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
          {mode === "signup" && (
            <div>
              <label htmlFor="portal-name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="portal-name"
                type="text"
                autoComplete="name"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputCls}
                placeholder="Your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="portal-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="portal-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="student@example.com"
            />
          </div>

          {mode !== "forgot" && (
            <div>
              <label htmlFor="portal-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="portal-password"
                  type={showPw ? "text" : "password"}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCls} pr-16`}
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 hover:text-gray-700 px-2 py-1"
                  aria-pressed={showPw}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-[11px] text-gray-400 mt-1">Use at least 6 characters.</p>
              )}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label htmlFor="portal-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="portal-confirm"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputCls}
                placeholder="Repeat your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-md transition"
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create Account"
                : mode === "login"
                  ? "Log In"
                  : "Send Reset Email"}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          {mode === "login" && (
            <button
              type="button"
              onClick={() => switchMode("forgot")}
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot password?
            </button>
          )}
          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => switchMode("login")}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back to Log In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin settings panel (visible only to admins — admins/{uid} exists)
// ---------------------------------------------------------------------------
function AdminPanel({ isAdmin, threshold, userEmail, onToast }) {
  const [selection, setSelection] = useState(String(threshold));
  const [custom, setCustom] = useState("");
  const [saving, setSaving] = useState(false);
  const [realCount, setRealCount] = useState(null);
  const [syncing, setSyncing] = useState(false);

  // Adjust local selection when the live threshold changes (render-time
  // adjustment — no cascading effect writes).
  const [lastThreshold, setLastThreshold] = useState(threshold);
  if (threshold !== lastThreshold) {
    setLastThreshold(threshold);
    setSelection(String(threshold));
  }

  if (!isAdmin) return null;

  const effective = selection === "custom" ? clampThreshold(custom) : clampThreshold(selection);

  const save = async () => {
    const value = effective;
    if (value == null) {
      onToast({ kind: "error", message: "Threshold must be a whole number between 1 and 100." });
      return;
    }
    setSaving(true);
    try {
      await setDocMerge(
        doc(db, "config", "settings"),
        {
          lectureCompletionThreshold: value,
          updatedAt: serverTimestamp(),
          updatedBy: userEmail || "admin",
        },
        { merge: true }
      );
      onToast({ kind: "success", message: `Completion threshold saved: ${value}%.` });
    } catch (err) {
      console.error(err);
      onToast({
        kind: "error",
        message: "Could not save the threshold — do you have admin rights in Firestore?",
      });
    } finally {
      setSaving(false);
    }
  };

  const syncCount = async () => {
    setSyncing(true);
    try {
      const snap = await getCountFromServer(collection(db, "students"));
      const count = snap.data().count;
      setRealCount(count);
      await setDocMerge(
        doc(db, "stats", "students"),
        { count, updatedAt: serverTimestamp(), updatedBy: userEmail || "admin" },
        { merge: true }
      );
      onToast({ kind: "success", message: `Public counter synced to the real count: ${count}.` });
    } catch (err) {
      console.error(err);
      onToast({ kind: "error", message: "Could not read the real student count." });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-200">
      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1">
        ⚙️ Admin Settings
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        Lecture Completion Threshold — students must watch this % of a lecture&apos;s real
        length to complete it. Changes apply to <strong>future</strong> watching only;
        already-completed lectures stay completed forever.
      </p>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {THRESHOLD_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setSelection(String(opt))}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              selection === String(opt)
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
            }`}
          >
            {opt}%
          </button>
        ))}
        <span className={selection === "custom" ? "hidden" : "inline-flex"}>
          <button
            type="button"
            onClick={() => setSelection("custom")}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50"
          >
            Custom…
          </button>
        </span>
        {selection === "custom" && (
          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
            <label htmlFor="admin-custom-threshold" className="sr-only">
              Custom threshold percentage
            </label>
            <input
              id="admin-custom-threshold"
              type="number"
              min={1}
              max={100}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="w-20 px-2 py-1.5 border border-gray-300 rounded-md"
              placeholder="e.g. 85"
            />
            %
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={save}
          disabled={saving || effective == null || effective === threshold}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg text-xs transition"
        >
          {saving ? "Saving..." : `Save Threshold${effective != null ? ` (${effective}%)` : ""}`}
        </button>
        <button
          type="button"
          onClick={syncCount}
          disabled={syncing}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg text-xs transition"
        >
          {syncing ? "Counting..." : "Sync real student count"}
        </button>
        {realCount != null && (
          <span className="text-xs text-gray-500 self-center">Real count: {realCount}</span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main portal shell
// ---------------------------------------------------------------------------
export default function PortalApp() {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [totalStudents, setTotalStudents] = useState(null);
  const [threshold, setThreshold] = useState(DEFAULT_COMPLETION_THRESHOLD);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeLectureId, setActiveLectureId] = useState(HMT_LECTURES[0].id);
  const [toasts, setToasts] = useState([]);

  const pendingSignupRef = useRef(false); // stats bump once per registration
  const backfillRef = useRef(""); // "uid:id,id" guard for legacy completions

  const addToast = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, ...toast }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ---- session persistence ---------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthLoading(false);
      if (!user) {
        setProfile(null);
        setProfileMissing(false);
        setProgressMap({});
        setIsAdmin(false);
        setTotalStudents(null);
      }
    });
    return unsub;
  }, []);

  // ---- student profile (create if a signed-in account has no doc yet) --------
  useEffect(() => {
    if (!authUser) return;
    const ref = doc(db, "students", authUser.uid);
    const unsub = onSnapshot(
      ref,
      async (snap) => {
        if (snap.exists()) {
          setProfile(snap.data());
          setProfileMissing(false);
          return;
        }
        setProfileMissing(true);
        // Signed-in account without a student document (e.g. interrupted
        // registration): create it once with the standard schema.
        if (backfillRef.current !== `create:${authUser.uid}`) {
          backfillRef.current = `create:${authUser.uid}`;
          const fallbackName =
            authUser.displayName?.trim() ||
            (authUser.email ? authUser.email.split("@")[0] : "Student");
          try {
            await setDoc(ref, {
              uid: authUser.uid,
              name: fallbackName,
              email: authUser.email || "",
              watchTimeMinutes: 0,
              completedVideos: [],
              quizScore: 0,
              assignmentScore: 0,
              createdAt: new Date().toISOString(),
            });
            addToast({ kind: "info", message: `Welcome, ${fallbackName}! Your student profile is ready.` });
          } catch (err) {
            console.error("profile auto-create failed", err);
            backfillRef.current = "";
          }
        }
      },
      (err) => {
        console.error("profile listener error", err);
        setProfileMissing(true);
      }
    );
    return unsub;
  }, [authUser, addToast]);

  // ---- per-lecture progress + lazy legacy backfill -----------------------------
  useEffect(() => {
    if (!authUser) return;
    const unsub = onSnapshot(
      collection(db, "students", authUser.uid, "progress"),
      (snap) => {
        const map = {};
        snap.forEach((d) => {
          map[d.id] = d.data();
        });
        setProgressMap(map);
      },
      (err) => console.error("progress listener error", err)
    );
    return unsub;
  }, [authUser]);

  // Legacy migration (additive only): students who completed lectures under the
  // old system have ids in completedVideos but no progress docs. We ADD a
  // progress doc marked completed (legacy) — existing completions are never
  // recalculated against the current threshold and never removed.
  useEffect(() => {
    if (!authUser || !profile || profileMissing) return;
    const completed = profile.completedVideos || [];
    const missing = completed.filter((id) => !progressMap[id]);
    if (missing.length === 0) return;
    const guard = `backfill:${authUser.uid}:${missing.sort().join(",")}`;
    if (backfillRef.current === guard) return;
    backfillRef.current = guard;
    (async () => {
      for (const id of missing) {
        try {
          await setDoc(
            doc(db, "students", authUser.uid, "progress", String(id)),
            {
              watchedSeconds: 0, // per-lecture seconds were not tracked before; total is untouched
              completed: true,
              completedAt: serverTimestamp(), // time of import, not original completion
              completionThreshold: null, // legacy: completed under old 30-min rule
              requiredSecondsAtCompletion: null,
              legacyImport: true,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (err) {
          console.error(`legacy backfill failed for lecture ${id}`, err);
        }
      }
    })();
  }, [authUser, profile, profileMissing, progressMap]);

  // ---- stats counter (public number; never downloads student records) ---------
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "stats", "students"),
      (snap) => setTotalStudents(snap.exists() ? snap.data().count ?? null : null),
      () => setTotalStudents(null)
    );
    return unsub;
  }, []);

  // ---- completion threshold (admin-managed, live) -------------------------------
  useEffect(() => {
    if (!authUser) return;
    const unsub = onSnapshot(
      doc(db, "config", "settings"),
      (snap) => {
        if (snap.exists()) {
          const t = clampThreshold(snap.data().lectureCompletionThreshold);
          if (t != null) setThreshold(t);
        }
      },
      (err) => console.error("config listener error", err)
    );
    return unsub;
  }, [authUser]);

  // ---- admin self-check (admins/{uid} readable only by its owner) ---------------
  useEffect(() => {
    if (!authUser) return;
    let alive = true;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "admins", authUser.uid));
        if (alive) setIsAdmin(snap.exists());
      } catch {
        if (alive) setIsAdmin(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [authUser]);

  // ---- registration stats bump (exactly +1 per new registration) ----------------
  useEffect(() => {
    if (!authUser || profileMissing) return;
    if (backfillRef.current !== `create:${authUser.uid}`) return; // only fresh creations
    backfillRef.current = `created:${authUser.uid}`;
    if (!pendingSignupRef.current) return;
    pendingSignupRef.current = false;
    (async () => {
      try {
        await updateDoc(doc(db, "stats", "students"), {
          count: increment(1),
          updatedAt: serverTimestamp(),
          updatedBy: authUser.uid,
        });
      } catch (err) {
        console.error("stats increment skipped/failed (admin can re-sync)", err);
      }
    })();
  }, [authUser, profileMissing]);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
      addToast({ kind: "error", message: "Could not log out — please try again." });
    }
  }, [addToast]);

  const activeLecture = useMemo(
    () => HMT_LECTURES.find((l) => l.id === activeLectureId) || HMT_LECTURES[0],
    [activeLectureId]
  );

  // ---- screens -------------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-56px)] grid place-items-center bg-gray-50">
        <div className="text-center">
          <div
            aria-label="Loading portal"
            className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"
          />
          <p className="text-sm text-gray-500">Loading your portal…</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <>
        <AuthForms onToast={addToast} markSignupIntent={() => { pendingSignupRef.current = true; }} />
        <Toasts toasts={toasts} dismiss={dismissToast} />
      </>
    );
  }

  const completedIds = profile?.completedVideos || [];
  const total = HMT_LECTURES.length;
  const doneCount = HMT_LECTURES.filter((l) => completedIds.includes(l.id)).length;
  const remaining = total - doneCount;
  const coursePct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const isLectureCompleted = (id) =>
    completedIds.includes(id) || Boolean(progressMap[id]?.completed);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* LEFT: profile + progress summary + admin */}
        <div className="lg:col-span-1 space-y-4 h-fit">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <div>
              <h1 className="text-xl font-bold text-blue-600 mb-1">HMT Academy</h1>
              <p className="text-gray-500 text-xs">
                Student: <span className="font-semibold text-gray-700">{profile?.name || "…"}</span>
              </p>
              {profileMissing && (
                <p className="text-xs text-amber-600 mt-1">Setting up your profile…</p>
              )}
            </div>

            {typeof totalStudents === "number" && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl text-white shadow-sm">
                <p className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                  Total Portal Strength
                </p>
                <h3 className="text-2xl font-black mt-1">
                  {totalStudents} <span className="text-sm font-normal">Students Registered</span>
                </h3>
              </div>
            )}

            <div className="border-t border-gray-100 pt-3 space-y-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Your Progress</h2>
              <div className="bg-blue-50 p-3 rounded-lg flex justify-between items-center">
                <span className="text-xs text-blue-700 font-medium">⏱️ Total Watch Time</span>
                <span className="font-bold text-blue-700 text-sm">{profile?.watchTimeMinutes ?? 0} mins</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 font-medium py-2 rounded-lg transition text-xs border border-gray-200"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Course progress dashboard */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
              Course Progress
            </h2>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-black text-gray-800">{coursePct}%</span>
              <span className="text-xs text-gray-500">
                {doneCount} of {total} lectures
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${coursePct}%` }} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 rounded-lg py-2">
                <p className="text-[10px] uppercase text-gray-400 font-semibold">Total</p>
                <p className="text-lg font-bold text-gray-700">{total}</p>
              </div>
              <div className="bg-green-50 rounded-lg py-2">
                <p className="text-[10px] uppercase text-green-600 font-semibold">Done</p>
                <p className="text-lg font-bold text-green-700">{doneCount}</p>
              </div>
              <div className="bg-amber-50 rounded-lg py-2">
                <p className="text-[10px] uppercase text-amber-600 font-semibold">Left</p>
                <p className="text-lg font-bold text-amber-700">{remaining}</p>
              </div>
            </div>
          </div>

          <AdminPanel isAdmin={isAdmin} threshold={threshold} userEmail={authUser.email} onToast={addToast} />
        </div>

        {/* CENTER: player */}
        <div className="lg:col-span-2">
          <LecturePlayer
            key={activeLecture.id}
            lecture={activeLecture}
            uid={authUser.uid}
            progress={progressMap[activeLecture.id] || null}
            threshold={threshold}
            isCompleted={isLectureCompleted(activeLecture.id)}
            onCompleted={() =>
              addToast({ kind: "success", message: "🎉 Lecture completed — permanently recorded!" })
            }
            addToast={addToast}
          />
        </div>

        {/* RIGHT: playlist */}
        <div className="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider border-b pb-2">
            📋 Course Playlist
          </h3>
          <div className="space-y-2">
            {HMT_LECTURES.map((lecture) => {
              const p = progressMap[lecture.id];
              const done = isLectureCompleted(lecture.id);
              const dur = p?.videoDurationSeconds || lecture.fallbackDurationSeconds;
              const watched = p?.watchedSeconds ?? 0;
              const req = requiredSeconds(dur, threshold);
              const pct = done ? 100 : Math.min(100, Math.round((watched / req) * 100));
              const status = done ? "✅ Completed" : watched > 0 ? "▶ In progress" : "⏳ Not started";
              return (
                <button
                  key={lecture.id}
                  type="button"
                  onClick={() => setActiveLectureId(lecture.id)}
                  aria-current={activeLecture.id === lecture.id}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium transition flex flex-col gap-1.5 border ${
                    activeLecture.id === lecture.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-gray-50 text-gray-700 border-gray-100 hover:bg-gray-100"
                  }`}
                >
                  <span className="font-semibold line-clamp-2">{lecture.title}</span>
                  <span className={`text-[10px] ${activeLecture.id === lecture.id ? "text-blue-100" : "text-gray-400"}`}>
                    {done
                      ? status
                      : `⏱️ ${formatClock(dur)} · ${watched > 0 ? `${formatClock(watched)} watched` : status}`}
                  </span>
                  <div className={`h-1 w-full rounded-full overflow-hidden ${done ? "bg-blue-200" : "bg-gray-200"}`}>
                    <div
                      className={`h-full rounded-full ${done ? "bg-blue-500" : "bg-green-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Toasts toasts={toasts} dismiss={dismissToast} />
    </div>
  );
}
