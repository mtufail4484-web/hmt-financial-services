# Portal Development Changelog & Setup Guide

**Branch:** `arena/01a01cbb-hmt-financial-services` · **Date:** 2026-08-20
**Golden rule applied throughout:** existing student data, progress, and completions were never deleted, reset, or rewritten. Every database change is *additive*.

---

## 1. What changed (by phase)

### Phase 1 — Portal fully functional
- **Registration restored**: visible `Log In | Sign Up` toggle, Full Name + Email + Password + Confirm Password, automatic sign-in after registration (no second login).
- **Friendly auth errors**: inline red banners; raw Firebase messages mapped to plain language (incorrect email/password, already registered, weak password, invalid email, network error, too many attempts). Nothing technical leaks to students.
- **Forgot password**: `sendPasswordResetEmail` with a clear success message.
- **ESLint**: all errors fixed; `npm run lint` and `npm run build` are clean.

### Phase 2 — Security & data integrity
- **Student counter**: reads `stats/students` (a single number). The old code downloaded every student document (`getDocs`) just to show a count.
- **`firestore.rules` v3** (see §3 below): owner-only student records, admin-only listing/count, append-only `completedVideos`, monotonic per-lecture progress, protected config/admins/stats, default deny.
- **Watch-time race conditions**: all writes use atomic `increment()` / `arrayUnion()`; failed writes re-queue locally, so time is never lost or overwritten.

### Phase 3 — Flexible lecture completion
- Fixed **30-minute lock removed**. Required time = **threshold % of the video's real duration** (duration comes from the YouTube IFrame API at runtime; the old hardcoded numbers are only a fallback and are now correctly treated as *seconds*).
- **Threshold configurable by admin** from the portal (50/60/65/70/75/80/90/100% or custom 1–100), stored in `config/settings`, applied live. Default **70%**.
- **Completions are permanent**: `completedVideos` remains the source of truth and is append-only *in the database rules* — a later threshold change can never un-complete a lecture. Each completion is stamped with `completionThreshold` and `requiredSecondsAtCompletion` at completion time (audit trail).
- **Partial progress preserved**: existing watch time is kept; a threshold change only affects how much *more* time is needed.
- **Genuine playback tracking**: the clock advances only while the video is actually PLAYING and the tab is visible; it stops on pause/buffer/hide; saves every ~15 s; resumes where the student left off; credits at most 100% of a video.

### Phase 4 — Session & progress experience
- `onAuthStateChanged` session persistence with a loading screen (no wrong-page flash before auth resolves; refresh keeps you logged in).
- Per-lecture persisted progress + resume.
- Progress dashboard: total / completed / remaining lectures, overall %, per-lecture status (✅ Completed / ▶ In progress / ⏳ Not started).

### Phase 5 — UX
- All `alert()` replaced with accessible toasts (success / error / warning / info).
- Forms: proper `<label htmlFor>`, `autoComplete`, password requirements + show/hide, inline validation, mobile-friendly.
- Page title **"Student Portal — HMT Success Academy"** + `noindex` via metadata.

### Phase 6 — Codebase cleanup
- Removed unused Expo/React Native dependencies (verified: zero imports anywhere): `expo-router`, `expo-dev-client`, `@expo/vector-icons`, 4 × `react-native-*`. Removed `.expo/`, `app.json`, `eas.json`, and the Expo `tsconfig.json` (which broke the build).
- Removed `typescript.ignoreBuildErrors`; fixed `boxSet` → `boxShadow`.
- Images compressed **27 MB → 4.4 MB** (lossy-quality 80 / palette PNG; nothing enlarged; originals in git history) and switched to `next/image`.
- Fonts self-hosted via the `geist` package — builds no longer depend on Google Fonts at build time.
- `/api/send-email`: Resend client is now lazy (module-scope constructor crashed builds when `RESEND_API_KEY` was unset). No behavior change.

### Not implemented (per plan — Phase 7)
Quiz system, certificates, forced email verification, server-side watch enforcement, further `/api/send-email` hardening. Existing `quizScore` / `assignmentScore` fields preserved untouched.

---

## 2. Database schema (all changes additive)

**Existing (untouched):** `students/{uid}.{uid, name, email, watchTimeMinutes, completedVideos[], quizScore, assignmentScore, createdAt}`
- `watchTimeMinutes` keeps its accumulated value; new completions add the *real* video minutes (old code added mislabeled seconds-as-minutes; existing totals were never rewritten).

**New per-lecture documents:** `students/{uid}/progress/{lectureId}`
```
watchedSeconds             int    — only ever increases (rules-enforced)
videoDurationSeconds       int    — set once from YouTube API, then immutable
completed                  bool   — false → true only, never back
completedAt                ts     — immutable once set
completionThreshold        int    — threshold used at completion time (null = legacy import)
requiredSecondsAtCompletion int   — immutable once set
legacyImport               bool   — (legacy docs only) migrated from old completedVideos
updatedAt                  ts
```

**New supporting documents:**
- `config/settings` — `{ lectureCompletionThreshold: 70, updatedAt, updatedBy }` (admin-writable only)
- `stats/students` — `{ count, updatedAt, updatedBy }` (public read; signups may bump by exactly +1)
- `admins/{uid}` — `{ role: "admin" }` (console-managed; grants admin)

**Legacy migration (automatic, additive):** when a student with ids in `completedVideos` but no progress docs signs in, the portal *creates* progress docs marked `completed: true, legacyImport: true, completionThreshold: null`. Nothing is removed or recalculated.

---

## 3. Deploying the security rules + one-time setup

> The rules file `firestore.rules` is in the repo root. **Nothing has been deployed yet.**

1. **Publish the rules**: Firebase console → Firestore Database → Rules → paste `firestore.rules` → Publish. (Or `firebase deploy --only firestore:rules`.)
2. **Make yourself admin**: console → Firestore → Start collection `admins` → document ID = **your Firebase Auth UID** (Authentication → Users → copy the UID) → field `role` = `admin`. The portal then shows the ⚙️ Admin Settings panel when you're logged in.
3. **Seed the counter** (optional but recommended): create `stats/students` = `{ count: <current number of student docs> }`. Until it exists, the "Total Portal Strength" card is hidden; the admin panel's **Sync real student count** button creates/fixes it anytime.
4. `config/settings` is created automatically the first time an admin saves a threshold (defaults to 70% until then).

**Deployment order:** publish the new site and the new rules together — the old deployed site's student-count query (`getDocs`) is intentionally blocked by the new rules.

---

## 4. Testing

### Done ✅
- **Unit tests (22/22 pass):** `node --test tests/portal-lib.test.mjs` — threshold math (owner's exact examples: 80 min @60% = 48 min etc.), clock formatting, friendly error mapping, resume logic, catalogue integrity.
- **ESLint:** 0 errors / 0 warnings. **Production build:** succeeds (all 6 routes).
- **Rules test suite:** ~55 assertions in `tests/firestore.rules.test.mjs` covering every owner requirement (cross-student denial, append-only completions, monotonic progress, immutable stamps, admin isolation, counter +1-only, legacy lockout safety, anonymous denial).

### Pending — run the emulator suite (needs Java + emulator download; this sandbox's network blocks Google download hosts, and its GitHub token can't create workflow files)
**Option A (local):** `npm run test:rules` (installs nothing extra; `firebase-tools` + `@firebase/rules-unit-testing` are devDependencies).
**Option B (GitHub Actions):** in GitHub → your repo → *Add file → Create new file* → name it `.github/workflows/firestore-rules-tests.yml` on branch `arena/01a01cbb-hmt-financial-services`, paste the YAML from `docs/firestore-rules-ci.yml`, commit. It runs automatically on every push touching `firestore.rules` or `tests/`.

### Manual smoke test checklist (for the owner, against production after setup)
- Existing completed student: raise threshold 60 → 70 → lecture stays ✅ Completed.
- Partially-watched student: threshold change keeps watched time; remaining time adjusts.
- New student: register → auto-login → dashboard.
- Auth: login, logout, refresh (stays logged in), forgot password, wrong password, duplicate email.
- Watch time: play / pause / hide tab / switch lecture / refresh / re-login → progress persists.
- Security: student B's data invisible to student A (counter shows only a number).

---

## 5. Known limitations (explicit, per owner's request)
- **Not cheat-proof**: the account owner can forge completions/watch-time by writing to Firestore directly with an authenticated client (rules cannot distinguish the real app from a script). Rules prevent: un-completing, decreasing time, cross-student edits, threshold tampering, counter jumps, admin self-promotion. Real enforcement needs Cloud Functions/App Check (future phase).
- Counter can be inflated slowly (+1 per write) by a determined student; admin "Sync real count" resets it instantly.
- Legacy students' `watchTimeMinutes` totals keep their historical (slightly inflated) values — deliberately not rewritten.
