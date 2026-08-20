# Student Portal Audit — HMT Academy (`/portal`)

**Date:** 2026-08-20 · **Auditor:** Arena Agent Mode · **Scope:** `app/portal/page.js`, `firebase.js`, supporting configs; adjacent findings noted at the end.

**Method:** full source review, ESLint (`eslint .`), production build attempt (`npm run build`), dependency and repo-hygiene inspection. Build failed only because this sandbox blocks `fonts.googleapis.com` (environmental — see L8).

---

## Executive summary

The portal renders and the happy-path login works, but it is **currently impossible for a new student to register** (the sign-up UI is missing), **all errors are silent** (never rendered), and the "Secure Tracking Mode / 30-min lock" is **cosmetic** — it is a client-side timer with no tie to actual video playback and no server-side enforcement. Separately, the student counter **downloads every student's PII to every visitor's browser**, which is either a privacy leak or a silently broken feature depending on your Firestore rules.

| Severity | Count | Headline |
|---|---|---|
| 🔴 Critical | 3 | Registration unreachable · errors never shown · lint errors in portal |
| 🟠 High | 5 | Fake cheat protection · student PII exposed via count query · rules are the real auth · lost-update race · raw Firebase errors leaked |
| 🟡 Medium | 6 | Seconds-vs-minutes data bug · progress lost on lecture switch · no session persistence · post-signup dead end · orphaned quiz fields · `alert()` UX |
| 🔵 Low | 8 | Dead Expo/RN deps · repo hygiene · a11y attrs · unoptimized images · misc |

---

## 🔴 Critical — broken core behavior

### C1. New students cannot register — sign-up UI is missing
`app/portal/page.js` contains a complete sign-up *handler* (L95–112: `createUserWithEmailAndPassword`, `setDoc` to `students/{uid}`), but:

- `isSignUp` (L15) is **never set to `true` from the UI** — no toggle link/button exists in the rendered JSX, and `fullName` (L18) has **no input field** anywhere.

Result: the sign-up branch is dead code. Visitors see only a login form; nobody can create an account. This is the single biggest functional bug in the portal.

**Fix:** add a mode toggle plus, when `isSignUp`, a full-name input:

```jsx
{isSignUp && (
  <input type="text" required value={fullName}
    onChange={(e) => setFullName(e.target.value)} placeholder="Full name" ... />
)}
...
<p className="text-sm text-center mt-3">
  {isSignUp ? "Already have an account?" : "New student?"}{" "}
  <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-blue-600 font-semibold">
    {isSignUp ? "Log in" : "Create an account"}
  </button>
</p>
```

### C2. Errors are set but never rendered — every failure is silent
`setError(...)` is called on failed login, missing user doc, and exceptions (L122, L126, L132), but the login form JSX (L274–306) **never displays `{error}`**. A wrong password produces *no visible feedback at all*. (The form also only says "Log In" even when `isSignUp` is somehow true — related to C1.)

**Fix:** render it above the submit button:

```jsx
{error && <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</p>}
```

### C3. Portal fails ESLint with 2 errors
`npx eslint .` → `react-hooks/set-state-in-effect` at `app/portal/page.js:56` and `:61` (setState called synchronously in effect bodies). These are real anti-patterns that cause cascading renders, and they will fail any CI that runs lint. Restructure the timer effect to derive `secondsWatched`/`canComplete` inside the interval callback (or move reset logic into the `setActiveVideo` handler).

---

## 🟠 High — security & data integrity

### H1. "Secure Tracking Mode (30 Mins Lock)" provides no security
The claimed cheat protection (L31–34, L60–87, L137–170) is a plain `setInterval` that:

- runs whether or not the video is playing, paused, or even visible (no YouTube IFrame API integration);
- resets to zero when the student switches lectures and comes back (no persistence);
- gates only a client-side `canComplete` flag — the Firestore write (`updateDoc`, L150–154) has no server-side validation, so anyone with the (public, by-design) Firebase config can write completions directly via the console/SDK.

**Fix direction:** either (a) accept it as a soft nudge and drop the "Secure" branding, or (b) enforce server-side: use the YouTube IFrame Player API to track actual `PLAYING` seconds, and record completion via a Cloud Function / App Check-protected callable that validates elapsed time against a server timestamp.

### H2. Student counter downloads every student's PII
`fetchTotalStudentsCount` (L41–49) runs `getDocs(collection(db, "students"))` — fetching **every student document (name, email, scores, uid) into every visitor's browser** — only to display `querySnapshot.size`. Consequences depend entirely on your Firestore rules:

- rules allow collection reads → silent PII exposure of your entire student list (privacy/GDPR problem);
- rules deny it → the fetch throws, is swallowed by `console.error`, and "Total Portal Strength" permanently shows **0**.

**Fix:** use the server-side aggregation query, which returns only a number and should be the only collection-wide permission you grant:

```js
import { getCountFromServer, collection } from "firebase/firestore";
const snapshot = await getCountFromServer(collection(db, "students"));
setTotalStudents(snapshot.data().count);
```

### H3. Firestore rules are the real auth wall — verify them
The Firebase web config in `firebase.js` (L6–13) is public by design; **all** portal security (student docs, completions, scores) rests on Firestore rules that aren't in this repo. Minimum recommended:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create: if request.auth != null && request.auth.uid == uid;
      allow update: if request.auth != null && request.auth.uid == uid
                    && request.resource.data.diff(resource.data)
                       .affectedKeys().hasOnly(['completedVideos', 'watchTimeMinutes']);
      allow delete: if false; // no client deletes
    }
  }
}
```

Add `firebase-rules/firestore.rules` to the repo and deploy via the Firebase CLI so rules are versioned with the app.

### H4. Lost-update race on `watchTimeMinutes`
`handleMarkAsWatched` (L144–153) reads `user.watchTimeMinutes` from React state and writes `user.watchTimeMinutes + duration` — a classic read-modify-write. Two completions in quick succession (or stale state after a re-login) overwrite each other's totals.

**Fix:** let the server compute it:

```js
import { increment } from "firebase/firestore";
await updateDoc(docRef, {
  watchTimeMinutes: increment(activeVideo.duration),
  completedVideos: arrayUnion(activeVideo.id),
});
```

### H5. Raw Firebase errors surfaced to users
L123/L168 expose `err.message` verbatim ("Firebase: The password is invalid or the user does not have a password…"). It leaks internals, is developer-facing English, and gives attackers precise feedback. Map error codes (`auth/invalid-credential`, `auth/email-also-in-use`, `auth/weak-password`, …) to short, friendly messages — in Urdu/Roman-Urdu too, since your UI copy already mixes languages.

Also missing (cheap wins): **password reset** ("Forgot password?" → `sendPasswordResetEmail`), and **email verification** (`sendEmailVerification`) before certifying completions.

---

## 🟡 Medium — logic & UX

- **M1. Seconds-vs-minutes data bug.** Playlist `duration` values (L9–11: 85, 65, 76) are the videos' length in **seconds** (~1–1.5 min videos), yet the UI renders "⏱️ 85 mins" (L259) and `handleMarkAsWatched` credits **85 watch-minutes** (L146). Meanwhile every lecture requires a 30-minute lock (`REQUIRED_TIME = 1800`, L34) regardless of length. A student waits 30 minutes for a ~75-second video and is credited 85 "minutes". Decide the unit (minutes, presumably), store accurate values, and derive the lock from actual duration.
- **M2. Progress resets on lecture switch.** Switching lectures zeroes `secondsWatched` (L61) and nothing is persisted per-lecture; switching back restarts the 30-minute wait. Persist per-lecture partial watch time in Firestore (or at least in `localStorage`) and resume.
- **M3. No auth-session persistence.** `user` is only set inside `handleSubmit`. A page refresh (or deep link) silently logs the UI out even though Firebase Auth still has the session. Add `onAuthStateChanged` and fetch the `students/{uid}` doc there; sign-out should also clear `totalStudents`.
- **M4. Post-signup dead end.** After a successful `createUserWithEmailAndPassword` the code only `alert`s and flips back to login (L108–113) — `setUser` is never called, so the freshly created student must log in manually. Set the user state right away.
- **M5. Orphaned schema fields.** `quizScore` / `assignmentScore` are written at signup (L104–105) but no quiz or assignment UI exists anywhere. Ship the UI or drop the fields.
- **M6. `alert()` for everything.** Five blocking `alert()`s in the portal (success, cheat warning, save errors). They freeze the tab and look unprofessional — replace with inline toasts/status banners (as in C2).

---

## 🔵 Low — hygiene, a11y, performance

- **L1. Dead mobile dependencies.** `expo-router`, `expo-dev-client`, `@expo/vector-icons`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens` — zero imports of any of them in `app/` (verified). They bloat installs and can break Next 16 builds. Remove them.
- **L2. Expo artifacts in a Next repo.** `.expo/devices.json`, `.expo/README.md`, `app.json`, `eas.json` are tracked. Drop them (and ignore `.expo/`), unless a separate mobile app repo was intended.
- **L3. `next.config.mjs` sets `typescript.ignoreBuildErrors: true`.** Dangerous default to carry; the project is all-JS anyway — remove the override.
- **L4. Login form a11y/autocomplete.** Labels aren't associated with inputs (no `htmlFor`/`id`), and inputs lack `autoComplete="email"` / `"current-password"` / `"new-password"` and `minLength={6}` (Firebase's minimum — pre-validate to avoid an ugly server error).
- **L5. Iframe polish.** `frameBorder="0"` (L221) is deprecated; the CSS border suffices. Consider the YouTube IFrame API (also needed for H1).
- **L6. No page metadata.** `/portal` inherits the site title/description. `export const metadata = { title: "Student Portal — HMT Academy", robots: { index: false } }` (move the page into a layout or lift metadata into a server component wrapper).
- **L7. Site-wide images (adjacent):** ~27 MB of unoptimized PNG/JPGs in `public/` (~2 MB each: `logo.png`, `hero.png`, service cards) served via raw `<img>` (6 ESLint warnings). Compress + use `next/image`. Not portal-specific but it drags every portal page load, since the global header renders `logo.png`.
- **L8. Build-time Google Fonts dependency.** `next/font/google` (Geist) requires network access at build time — it failed in this sandbox and will fail in any offline/locked-down CI. Fine on Vercel; consider self-hosting the font for hermetic builds.
- **L9. `app/layout.js:43` — `boxSet` is not a CSS property** (should be `boxShadow`), so the header shadow silently doesn't render.

---

## Adjacent finding (outside portal, worth fixing while you're in there)

**`app/api/send-email/route.js` (consultancy form backend):**

1. **HTML injection into emails** — `name`, `email`, `requirements`, etc. are interpolated raw into the HTML sent to both admin and customer (L55–65, L104+). Escape all user input before interpolating (a `<script>` won't run in mail clients, but arbitrary HTML/links/phishing styling will):
   ```js
   const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
     ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
   ```
2. **No rate limiting / validation** — anyone can script infinite POSTs and burn your Resend quota (each request sends **two** emails). Add basic validation (email format, length caps), plus per-IP rate limiting (e.g., Upstash Ratelimit middleware).
3. **Error details leaked** — `details: error.message` (L181) is returned to the client. Log it server-side, return a generic message.

---

## Suggested fix order

1. **C1 + C2** — restore registration and surface errors (portal is effectively unusable for new students today).
2. **H2 + H3** — switch to `getCountFromServer` and lock down + version Firestore rules (one afternoon, eliminates the only real data-exposure risk).
3. **H4 + M1** — `increment()` and fix the seconds/minutes model (data integrity).
4. **H5 + M3 + M4** — friendly errors, `onAuthStateChanged`, sign in after signup, password reset.
5. **C3 + M2 + M6** — lint-clean timer with persisted, resumable progress; toasts.
6. **L1/L2/L3** — dependency & config cleanup; then decide whether "Secure Tracking Mode" stays marketing copy or becomes real (H1, YouTube IFrame API + server validation).

*Nothing in this audit found committed secrets: `RESEND_API_KEY` is env-only and `.env*` is gitignored; the Firebase web config is public by design (security correctly depends on rules — see H3).*
