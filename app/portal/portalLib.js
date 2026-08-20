// ============================================================================
// HMT Success Academy — portal pure helpers (no Firebase imports; unit-testable)
// ============================================================================

// Lecture catalogue. `fallbackDurationSeconds` is ONLY a fallback used until
// the YouTube IFrame API reports the real duration (source of truth).
// NOTE: the old code labelled these values "minutes" — they are seconds.
export const HMT_LECTURES = [
  {
    id: "1",
    title: "Lecture 1: Introduction to Computer Basic",
    videoId: "cPpKY2oEd2s",
    fallbackDurationSeconds: 85,
  },
  {
    id: "2",
    title: "Lecture 2: MS Word, MS Excel, and Power Point Basic",
    videoId: "FSQ1H1dcxYk",
    fallbackDurationSeconds: 65,
  },
  {
    id: "3",
    title: "Lecture 3: Professional CV Design",
    videoId: "f4xVXgFSElo",
    fallbackDurationSeconds: 76,
  },
];

export const DEFAULT_COMPLETION_THRESHOLD = 70;
export const THRESHOLD_OPTIONS = [50, 60, 65, 70, 75, 80, 90, 100];
export const FLUSH_INTERVAL_SECONDS = 15; // watch-time write cadence

/** Clamp a human threshold input to a valid integer 1..100 (null if invalid). */
export function clampThreshold(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n) || n < 1 || n > 100) return null;
  return n;
}

/** required watch seconds = ceil(duration * threshold / 100), min 1s */
export function requiredSeconds(durationSeconds, thresholdPercent) {
  if (!durationSeconds || durationSeconds <= 0) return Infinity;
  const t = clampThreshold(thresholdPercent) ?? DEFAULT_COMPLETION_THRESHOLD;
  return Math.max(1, Math.ceil((durationSeconds * t) / 100));
}

/** 45 -> "0:45", 125 -> "2:05", 3725 -> "1:02:05" */
export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/** Map a Firebase Auth error to a short, student-friendly message. */
export function friendlyAuthError(err) {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "This email is already registered — try logging in instead.";
    case "auth/weak-password":
      return "Password is too weak — use at least 6 characters.";
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/missing-password":
      return "Please enter your password.";
    case "auth/missing-email":
      return "Please enter your email address.";
    case "auth/network-request-failed":
      return "Network error — please check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts — please wait a moment and try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Contact your teacher.";
    default:
      return "Something went wrong — please try again.";
  }
}

/** Where to seek on re-open so a student resumes where they left off. */
export function resumePositionSeconds(watchedSeconds, durationSeconds) {
  if (!watchedSeconds || watchedSeconds < 10) return 0;
  if (durationSeconds && watchedSeconds >= durationSeconds - 5) return 0; // re-watch from start
  return watchedSeconds;
}
