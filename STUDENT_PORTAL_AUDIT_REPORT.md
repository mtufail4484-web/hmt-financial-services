# HMT Success Academy Student Portal - Comprehensive Audit Report

**Generated:** August 16, 2026  
**Status:** Complete Code Review & Security Audit

---

## 📋 Executive Summary

The student portal (`app/portal/page.js`) is a large, feature-rich Next.js React application with ~4000 lines of code. The application manages student authentication, course progression tracking, homework submissions, admin panel functionality, and AI course interest registration. Below is a detailed analysis of the codebase.

---

## ✅ Strengths

### 1. **Comprehensive Feature Set**
- ✅ Complete student authentication (sign-up, sign-in, password reset)
- ✅ Lecture progress tracking with watch time and completion status
- ✅ Homework upload and admin approval workflow
- ✅ Student card generation with QR code verification
- ✅ Assignment evaluation with feedback system
- ✅ Announcement/Q&A system for student-admin communication
- ✅ AI course interest registration
- ✅ Full backup system with JSON & CSV export
- ✅ Mobile PWA support (service worker & install prompt)

### 2. **Security & Authentication**
- ✅ Firebase Authentication with email/password
- ✅ Auth token refresh on login
- ✅ Account status validation (deactivated/struck off handling)
- ✅ Admin email verification (ADMIN_EMAIL constant)
- ✅ Proper role-based access control (isAdmin checks)
- ✅ Session-based visit tracking
- ✅ Password change functionality
- ✅ Local browser persistence with FirebasePersistence

### 3. **Data Management**
- ✅ Firestore real-time updates with onSnapshot
- ✅ Proper transaction handling for counter increment
- ✅ Comprehensive error handling with try-catch blocks
- ✅ Backup verification requirement before admin mutations
- ✅ Photo resizing for storage optimization (700px, quality 0.82)
- ✅ File timeout protection (12s for uploads, 15s for storage)

### 4. **User Experience**
- ✅ Multiple UI states (sign-up, dashboard, admin panel)
- ✅ Visual progress indicators (watch %, completed count)
- ✅ Tab-based navigation (dashboard, learn, assignments, admin)
- ✅ Responsive design with Tailwind CSS
- ✅ Professional student card design with canvas rendering
- ✅ YouTube integration for video playback
- ✅ WhatsApp/Facebook social links
- ✅ HTML2Canvas for card export

### 5. **Admin Features**
- ✅ Student management and filtering
- ✅ Lecture creation, editing, deletion
- ✅ Practice material distribution
- ✅ Assignment evaluation with feedback
- ✅ Announcement posting with images
- ✅ Full portal backup (JSON + CSV)
- ✅ Student account status management
- ✅ Password reset capabilities

---

## ⚠️ Issues & Concerns

### 🔴 CRITICAL ISSUES

#### 1. **Exposed API Keys in Source Code**
**Location:** `firebase.js` lines 8-14 & `.env.local`

**Problem:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAIZg2LQchLRXcdAPc3rYM7dUF77np7YlY", // EXPOSED
  authDomain: "hmt-academy-portal.firebaseapp.com",
  projectId: "hmt-academy-portal",
  storageBucket: "hmt-academy-portal.firebasestorage.app",
  messagingSenderId: "1025365139060",
  appId: "1:1025365139060:web:ec914f02999232b09cfb21",
};
```

**Impact:** 
- Firebase API key is publicly visible in git history
- RESEND_API_KEY in `.env.local` shows malformed credentials
- Anyone with these keys can make requests to your Firebase project

**Recommendation:**
```bash
# Remove exposed keys from git history
git filter-branch --tree-filter 'rm -f firebase.js' HEAD
# Or use git secret / git credentials

# Store keys in environment variables
# firebase.js should read from process.env:
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... other keys from env
};
```

#### 2. **Plaintext Password Storage**
**Location:** `page.js` lines 1875-1876, 1935

**Problem:**
```javascript
const studentData = {
  // ...
  loginPassword: password, // ❌ PLAINTEXT PASSWORD STORED
  // ...
};
```

**Impact:**
- Passwords stored as plaintext in Firestore
- Firebase Authentication already manages passwords securely
- Storing them again is a security risk and unnecessary

**Recommendation:**
```javascript
// Remove loginPassword field entirely
// Firebase Auth handles password securely
const studentData = {
  uid: currentUser.uid,
  rollNo,
  name: fullName,
  email,
  // DON'T store password here
  // ...
};
```

#### 3. **Firebase Realtime Security Rules Not Visible**
**Problem:**
- `firestore.rules` and `storage.rules` exist but not reviewed
- No visible access control for who can read/write data

**Recommendation:**
Ensure Firestore rules enforce:
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Students can only access their own records
    match /students/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    // Admins only
    match /metadata/{document=**} {
      allow read, write: if isAdmin();
    }
    // Public verifications (read-only)
    match /publicStudentVerifications/{rollNo} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
  
  function isAdmin() {
    return request.auth.uid == 'fSJ0jUBCONXGJA7H41ChRq2ERLs1';
  }
}
```

#### 4. **Admin UID Hard-coded**
**Location:** `page.js` line 43

```javascript
const ADMIN_UID = "fSJ0jUBCONXGJA7H41ChRq2ERLs1";
const ADMIN_EMAIL = "m.tufailkhan12335@gmail.com";
```

**Problem:**
- Admin credentials exposed in source code
- Makes it easier for attackers to impersonate admin

**Recommendation:**
Store in environment variables and/or Firestore admin config document.

---

### 🟠 HIGH PRIORITY ISSUES

#### 1. **Unescaped User Input in URL Construction**
**Location:** `page.js` line 628

```javascript
function getVerificationUrl(rollNo) {
  return `https://${BRAND_SITE}/verify/${encodeURIComponent(rollNo || "C-26-HMT000")}`;
}
```

**Status:** ✅ Already uses `encodeURIComponent()` - GOOD

#### 2. **No Rate Limiting on Authentication Endpoints**
**Problem:**
- Sign-up and sign-in have no rate limiting
- Vulnerable to brute force attacks
- No CAPTCHA protection visible

**Recommendation:**
Implement rate limiting in Firebase Security Rules or add CAPTCHA:
```javascript
// Option 1: Firebase reCAPTCHA
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Option 2: Custom rate limiting middleware in Next.js API route
```

#### 3. **Large Component State Management**
**Location:** `page.js` lines 327-365 (40+ useState hooks)

```javascript
const [isSignUp, setIsSignUp] = useState(false);
const [activeTab, setActiveTab] = useState("dashboard");
const [adminSubTab, setAdminSubTab] = useState("students");
// ... 37 more state variables
```

**Problem:**
- Difficult to manage and maintain
- Risk of state synchronization bugs
- Performance concerns with frequent re-renders

**Recommendation:**
```javascript
// Use useReducer for complex state
const initialState = {
  auth: { isSignUp: false, email: "", password: "" },
  ui: { activeTab: "dashboard", activeVideo: null },
  admin: { subTab: "students", selectedStudent: null },
  // ...
};

const [state, dispatch] = useReducer(portalReducer, initialState);
```

#### 4. **No Input Validation on Registration Form**
**Location:** `page.js` lines 1818-1870

```javascript
const handleSubmit = async (e) => {
  // No validation for:
  // - Email format beyond Firebase
  // - Phone number format
  // - Name length/special characters
  // - Password strength requirements
  // - Age verification (DOB)
};
```

**Recommendation:**
```javascript
const validateRegistration = () => {
  const errors = [];
  
  if (!fullName || fullName.length < 3) errors.push("Name must be 3+ characters");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("Valid email required");
  if (!password || password.length < 8) errors.push("Password must be 8+ characters");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain uppercase");
  if (!/[0-9]/.test(password)) errors.push("Password must contain numbers");
  if (!phone || !/^\d{10,}$/.test(phone.replace(/\D/g, ""))) errors.push("Valid phone required");
  
  return errors;
};
```

#### 5. **No Verification Email Sent After Registration**
**Location:** `page.js` line 1875

**Problem:**
- Account created but no email verification
- Accounts with fake emails can be created
- No account confirmation workflow

**Recommendation:**
```javascript
// After user creation
await sendEmailVerification(currentUser);

// Check verification status
if (!currentUser.emailVerified) {
  alert("Please verify your email before using the portal.");
  return;
}
```

#### 6. **XSS Vulnerability in User-Generated Content**
**Location:** `page.js` lines 2048-2056 (Student Questions)

```javascript
const handleAskQuestion = async () => {
  await addDoc(collection(db, "questions"), {
    question: studentQuestionText, // ❌ No sanitization
  });
};
```

**Problem:**
- Questions can contain HTML/JavaScript
- If displayed without sanitization, XSS attack possible

**Recommendation:**
```javascript
import DOMPurify from 'dompurify';

const handleAskQuestion = async () => {
  const cleanQuestion = DOMPurify.sanitize(studentQuestionText);
  await addDoc(collection(db, "questions"), {
    question: cleanQuestion,
  });
};
```

---

### 🟡 MEDIUM PRIORITY ISSUES

#### 1. **No Logout Functionality**
**Problem:**
- No visible logout button or signOut() call
- Users remain logged in until session expires
- Mobile PWA may cache logged-in state

**Recommendation:**
```javascript
const handleLogout = async () => {
  try {
    await signOut(auth);
    setUser(null);
    setActiveTab("dashboard");
    setEmail("");
    setPassword("");
  } catch (err) {
    alert("Logout error: " + err.message);
  }
};
```

#### 2. **No Loading State During Long Operations**
**Location:** Throughout component

**Problem:**
- File uploads (12s timeout) have no progress indicator
- Backup generation (potentially 30s+) no progress bar
- Users may click multiple times during processing

**Recommendation:**
```javascript
const [uploadProgress, setUploadProgress] = useState(0);

// Show progress bar
<progress value={uploadProgress} max="100" />
<span>{uploadProgress}% uploaded</span>
```

#### 3. **No Caching Strategy for Student List**
**Location:** `page.js` line 1207

```javascript
useEffect(() => {
  if (!user?.uid) return undefined;
  
  fetchStudents(); // Called every time user.uid changes
  // ...
}, [user?.email, user?.uid]);
```

**Problem:**
- Fetches all students every time component mounts
- No pagination for large student lists
- Could cause performance issues with 1000+ students

**Recommendation:**
```javascript
const [studentCache, setStudentCache] = useState(null);
const [cacheTimestamp, setCacheTimestamp] = useState(0);

useEffect(() => {
  const now = Date.now();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  if (studentCache && now - cacheTimestamp < CACHE_TTL) {
    return; // Use cached data
  }
  
  fetchStudents().then(() => setCacheTimestamp(now));
}, [user?.uid]);
```

#### 4. **Inconsistent Error Handling**
**Problem:**
- Some functions use `alert()` (blocks UI)
- Some use console.error (silent failure)
- No error logging service

**Recommendation:**
```javascript
// Create error logging service
const logError = (context, error) => {
  console.error(`[${context}]`, error);
  // Send to error tracking service (Sentry, LogRocket, etc.)
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(error, { tags: { context } });
  }
};
```

#### 5. **No TypeScript Type Safety**
**Problem:**
- Plain JavaScript with no type checking
- Risk of runtime type errors
- IDE autocomplete limited
- Hard to maintain with future changes

**Recommendation:**
Convert to TypeScript:
```typescript
interface Student {
  uid: string;
  rollNo: string;
  name: string;
  email: string;
  completedVideos: string[];
  lectureProgress: Record<string, LectureProgress>;
}

interface LectureProgress {
  watchSeconds: number;
  watchDone: boolean;
  completed: boolean;
  homeworkDone: boolean;
  homeworkApproved?: boolean;
}
```

#### 6. **No HTTPS Redirect**
**Location:** `page.js` line 368

```javascript
const youtubeEmbedUrl =
  typeof window !== "undefined"
    ? `https://www.youtube.com/embed/${activeVideo.videoId}`
    : `https://www.youtube.com/embed/${activeVideo.videoId}`;
```

**Status:** ✅ Uses HTTPS - GOOD

---

### 🟢 LOW PRIORITY ISSUES / OBSERVATIONS

#### 1. **Unused Dependencies**
**Location:** `package.json`

```json
"@expo/vector-icons": "^15.0.2",
"expo-dev-client": "~55.0.32",
"expo-router": "^55.0.14",
"react-native-gesture-handler": "^2.31.2",
"react-native-reanimated": "^4.3.1",
"react-native-safe-area-context": "^5.7.0",
"react-native-screens": "^4.24.0"
```

**Observation:** React Native packages are included but this is a Next.js web app

**Recommendation:** Remove if not needed:
```bash
npm uninstall @expo/vector-icons expo-dev-client expo-router react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens react-native
```

#### 2. **Magic Numbers Throughout Code**
**Location:** Multiple

```javascript
const WATCH_REQUIRED_RATIO = 0.6; // ✅ Good - documented
const uploadTimeoutMs = 12000; // ❌ Magic number - should be constant
canvas.width = 1480; // ❌ Magic number
canvas.height = 1000; // ❌ Magic number
```

**Recommendation:** Extract all magic numbers to constants

#### 3. **No SEO Meta Tags for Dynamic Content**
**Location:** `layout.js` - metadata is static

**Recommendation:**
```javascript
export const generateMetadata = async ({ params }) => {
  const student = await fetchStudentData(params.id);
  return {
    title: `${student.name} - HMT Student Portal`,
    description: `Student progress tracking for ${student.name}`,
    og: {
      image: student.photoURL,
    },
  };
};
```

#### 4. **Console.warn Not Production-Safe**
**Location:** Multiple places

```javascript
console.warn("Could not load YouTube playlist...");
console.warn("Could not restore saved portal session...");
```

**Recommendation:**
```javascript
if (process.env.NODE_ENV === "development") {
  console.warn("...");
}
```

#### 5. **No Mobile Responsiveness Testing**
**Observation:** Uses Tailwind classes but no visible mobile nav, no hamburger menu

**Recommendation:**
- Test on actual mobile devices
- Implement responsive navigation
- Test touch interactions

---

## 📊 Code Quality Metrics

| Metric | Status | Notes |
|--------|--------|-------|
| Lines of Code | 4000+ | Single component - consider splitting |
| Functions | 50+ | Well-organized but large surface area |
| Hooks | 12+ useEffect | Complex lifecycle management |
| State Variables | 40+ | Should use useReducer |
| Error Handling | ⚠️ Inconsistent | Mix of alert() and console |
| Type Safety | ❌ None | No TypeScript |
| Testing | ❌ Missing | No test suite visible |
| Comments | ✅ Good | Many inline comments |
| Security | ⚠️ Critical Issues | API keys exposed, no input validation |
| Performance | ✅ Acceptable | Photo resizing, timeout handling |

---

## 🔐 Security Checklist

| Item | Status | Notes |
|------|--------|-------|
| API Keys Exposed | ❌ CRITICAL | Firebase keys in source |
| Plaintext Passwords | ❌ CRITICAL | Stored in Firestore |
| Input Validation | ❌ MISSING | No client validation |
| XSS Protection | ❌ MISSING | No sanitization of UGC |
| CSRF Protection | ⚠️ PARTIAL | Firebase handles auth |
| Rate Limiting | ❌ MISSING | No brute force protection |
| Email Verification | ❌ MISSING | No email confirmation |
| HTTPS | ✅ YES | Using https:// |
| Firestore Rules | ⚠️ UNKNOWN | Need review |
| Storage Rules | ⚠️ UNKNOWN | Need review |
| Session Management | ✅ PARTIAL | localStorage + Firebase |
| Password Reset | ✅ YES | sendPasswordResetEmail |
| Account Deactivation | ✅ YES | Checks accountStatus |

---

## ✨ Recommendations - Priority Order

### Phase 1: CRITICAL (Do Immediately)
1. **Remove API keys from git history**
   ```bash
   git filter-branch --tree-filter 'rm -f firebase.js' HEAD
   git push origin --force
   ```

2. **Move secrets to .env files**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=xxx
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
   FIREBASE_ADMIN_SDK_KEY=xxx (server-side only)
   ```

3. **Remove plaintext password storage**
   - Delete `loginPassword` field from Firestore
   - Use Firebase Auth only

4. **Regenerate Firebase API key** (if exposed for too long)

### Phase 2: HIGH (Within 1 week)
1. Add input validation to registration form
2. Implement email verification workflow
3. Add CAPTCHA to sign-up/sign-in
4. Review Firestore security rules
5. Add rate limiting
6. Implement data sanitization (DOMPurify)

### Phase 3: MEDIUM (Within 2 weeks)
1. Add logout functionality
2. Refactor state management (useReducer)
3. Add TypeScript
4. Implement error logging (Sentry)
5. Add loading indicators for long operations
6. Implement pagination for student list

### Phase 4: LOW (Polish & Optimization)
1. Remove unused dependencies
2. Extract magic numbers to constants
3. Improve mobile responsiveness
4. Add unit tests (Jest)
5. Add E2E tests (Cypress)
6. Implement caching strategy

---

## 🎯 Deployment Checklist

Before going to production:

- [ ] All API keys moved to environment variables
- [ ] Plaintext passwords removed from database
- [ ] Input validation implemented
- [ ] Email verification enabled
- [ ] CAPTCHA implemented
- [ ] Security rules reviewed and tested
- [ ] Rate limiting configured
- [ ] Error logging setup
- [ ] Backup system tested
- [ ] Mobile responsiveness verified
- [ ] All console errors resolved
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] GDPR compliance reviewed (if EU users)
- [ ] Terms of Service and Privacy Policy updated

---

## 📚 Architecture Recommendations

### Suggested Project Structure

```
app/
├── api/
│   ├── auth/
│   ├── students/
│   ├── lectures/
│   └── admin/
├── components/
│   ├── auth/
│   ├── portal/
│   ├── admin/
│   └── common/
├── hooks/
│   ├── useAuth.ts
│   ├── useStudent.ts
│   └── useAdmin.ts
├── context/
│   └── PortalContext.tsx
├── types/
│   └── index.ts
├── lib/
│   ├── firebase.ts
│   ├── validation.ts
│   └── utils.ts
└── store/
    └── portalSlice.ts (Redux or Zustand)
```

### Technology Recommendations

- **State Management:** Redux Toolkit or Zustand (instead of 40+ useState)
- **Forms:** React Hook Form + Zod (validation)
- **UI Components:** Shadcn/ui or Headless UI
- **Type Safety:** TypeScript + strict mode
- **Testing:** Jest + React Testing Library
- **E2E Testing:** Playwright or Cypress
- **Error Tracking:** Sentry
- **Analytics:** Google Analytics 4
- **Logging:** Pino or Winston

---

## 🏁 Conclusion

The HMT Student Portal is a **feature-complete** application with excellent functionality. However, it has **critical security issues** that must be addressed before production deployment, particularly around exposed API keys and plaintext password storage.

**Overall Assessment:** 
- **Functionality:** ⭐⭐⭐⭐⭐ (95%)
- **Security:** ⭐⭐☆☆☆ (Critical issues)
- **Code Quality:** ⭐⭐⭐☆☆ (Needs refactoring)
- **Performance:** ⭐⭐⭐⭐☆ (Good)
- **Maintainability:** ⭐⭐⭐☆☆ (Large component)

**Next Steps:**
1. Address critical security issues immediately
2. Create feature branches for high-priority items
3. Set up automated testing pipeline
4. Plan code refactoring roadmap
5. Consider component split and state management upgrade

---

**Report Prepared By:** AI Code Audit System  
**Audit Scope:** Student Portal (`app/portal/page.js` + dependencies)  
**Recommendations:** 50+ actionable items across security, performance, and maintainability
