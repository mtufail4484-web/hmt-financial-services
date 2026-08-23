# HMT Student Portal - Deployment Guide
**Manual Deployment Instructions**

---

## 📋 Pre-Deployment Checklist

### **1. Verify All Changes Locally**
```bash
# Start development server
npm run dev

# Server should start at http://localhost:3000
# No errors in console
```

### **2. Test Key Features**
- [ ] Sign up with invalid email → Error message shown
- [ ] Sign up with weak password (less than 8 chars) → Error message shown
- [ ] Sign up with valid data → Account created, verification email prompt
- [ ] Existing students can still login
- [ ] Admin functions work
- [ ] Questions/Announcements work
- [ ] Student can't see other students' data (test in browser console)

### **3. Verify Environment Files**
```bash
# Check .env.local has all Firebase keys
cat .env.local

# Should contain:
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
# NEXT_PUBLIC_FIREBASE_APP_ID=...
# RESEND_API_KEY=...
```

### **4. Check Git Status**
```bash
# View what changed
git status

# Should show:
# Modified: app/portal/page.js
# Modified: firebase.js
# Modified: firestore.rules
# Modified: .env.local
# New file: lib/validation.js
# New file: .env.local.example
```

---

## 🔒 STEP 1: Clean Git History (Remove Exposed Keys)

### **⚠️ CRITICAL - Only do ONCE, affects all developers**

**Run this ONLY if:**
- You own the repository
- No one else is actively working on it
- You're ready to force-push

```bash
# Navigate to your project
cd c:\Users\PMLS\hmt-financial-services

# Remove firebase.js from entire git history
# This removes the file from all previous commits
git filter-branch --tree-filter 'rm -f firebase.js' HEAD

# Alternative: Use git-filter-repo (newer, safer)
# pip install git-filter-repo
# git filter-repo --path firebase.js --invert-paths

# After cleaning, force push (WARNING: Rewrites history)
git push origin main --force
```

**What this does:**
- ✅ Removes firebase.js with exposed keys from ALL commits
- ❌ Changes all commit hashes (must be coordinated with team)
- ✅ Old keys are no longer in git history

**If team uses this repo:**
- Tell all developers to re-clone: `rm -rf repo && git clone ...`
- Update any deployment tools that reference old commits

---

## 📝 STEP 2: Commit Security Changes

```bash
cd c:\Users\PMLS\hmt-financial-services

# Stage all changes
git add .

# Commit with detailed message
git commit -m "Security Upgrade: Phase 2 - Input Validation & Email Verification

SECURITY IMPROVEMENTS:
- Add comprehensive input validation (email, password, phone, DOB)
- Require email verification before portal access
- Sanitize user inputs to prevent XSS attacks
- Move API keys to environment variables (.env.local)
- Remove plaintext password storage from Firestore
- Improve Firestore security rules for student privacy

NEW FILES:
- lib/validation.js: Reusable validation utilities

UPDATED FILES:
- app/portal/page.js: Added validation checks, email verification
- firestore.rules: Stricter access control (students see only own data)
- firebase.js: Read from environment variables
- .env.local: Environment configuration (git-ignored)
- .env.local.example: Template for developers

BACKWARD COMPATIBILITY:
- Existing students continue to work
- Only new accounts require email verification
- No student data loss or schema changes
- All existing features intact"

# View the commit
git log -1

# Push to repository
git push origin main
```

---

## 🚀 STEP 3: Build for Production

```bash
# Clean previous build
rm -r .next

# Install dependencies (if needed)
npm install

# Build production version
npm run build

# Should complete with no errors
# Output: "creating optimized production build..."
# "successfully compiled client and server"
```

---

## 📦 STEP 4: Deploy to Your Hosting

### **Option A: Vercel Deployment**
```bash
# Install Vercel CLI (if not already)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Vercel will ask for project settings
# Select your HMT project
# Deployment completes and shows live URL
```

### **Option B: Firebase Hosting**
```bash
# Install Firebase tools (if not already)
npm install -g firebase-tools

# Login
firebase login

# Configure (if not already done)
firebase init hosting

# Build
npm run build

# Deploy
firebase deploy --only hosting

# Shows deployment URL
```

### **Option C: Custom Server / VPS**
```bash
# Build
npm run build

# Copy to server
scp -r .next package.json server:/path/to/app/

# On server:
cd /path/to/app
npm install --production
npm start

# Should start at http://localhost:3000
# Use reverse proxy (nginx) to expose publicly
```

### **Option D: Docker (Any Server)**
```bash
# Build Docker image
docker build -t hmt-portal .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=... \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=... \
  hmt-portal

# Container runs on port 3000
```

---

## ✅ STEP 5: Verify Deployment

### **Test Deployed Site**
```bash
# Visit your live URL (replace with your actual URL)
https://your-domain.com

# OR if using Vercel
https://hmt-portal-XXXXX.vercel.app
```

### **Checklist:**
- [ ] Site loads without errors
- [ ] Sign up page works
- [ ] Email validation works (try invalid email)
- [ ] Password validation works (try weak password)
- [ ] Existing student can sign in
- [ ] Admin can sign in
- [ ] Lectures load
- [ ] Student card generation works
- [ ] Questions & announcements work
- [ ] No console errors (Check browser DevTools)

### **Test Security Features**
```javascript
// Open browser console (F12 → Console)

// Test 1: Try to fetch another student's data
// Should fail with Firestore permission error

// Test 2: New student account requires email verification
// Should show "Check email for verification" message

// Test 3: Try XSS in question input
// Should sanitize and show as text, not execute
```

---

## 🔄 STEP 6: Rollback Plan (If Something Goes Wrong)

### **Option A: Rollback to Previous Deployment**

**On Vercel:**
```
1. Go to vercel.com/dashboard
2. Select your project
3. Go to "Deployments" tab
4. Find previous stable deployment
5. Click "..." → "Promote to Production"
```

**On Firebase:**
```bash
firebase hosting:channel:list
firebase hosting:channel:deploy [previous-channel-id]
```

**On Custom Server:**
```bash
# Keep backup of previous version
cd /path/to/app
git reset --hard <previous-commit-hash>
npm run build
npm start
```

### **Option B: Disable New Features Temporarily**

If validation is causing issues:
```javascript
// In app/portal/page.js, comment out validation
// const validateEmail = (email) => true; // Bypass for now
```

Then redeploy.

### **Option C: Restart Application**

Most issues resolve with restart:
```bash
# Vercel: Auto-restarts on redeploy
# Firebase: Auto-restarts
# Custom: Kill and restart process
```

---

## 📊 Post-Deployment Monitoring

### **Monitor Logs**
```bash
# Vercel
vercel logs --follow

# Firebase  
firebase functions:log

# Custom server
tail -f /var/log/app.log
```

### **Check Error Tracking** (if configured)
- Check Sentry, LogRocket, or similar services
- Look for new errors in first hour after deployment

### **Monitor Database**
```javascript
// Check Firestore in Firebase Console
// Look for:
// - New student records with emailVerified: false
// - Sanitized text in questions/announcements
// - No student-to-student data reads (permission errors expected)
```

### **Student Feedback**
- Send email: "Portal updated with new security features"
- New students: "Verify your email after signup"
- Existing students: "No changes needed, everything works as before"

---

## 📞 Troubleshooting

### **Issue: "API keys undefined" or blank page**
**Solution:**
```bash
# Check .env.local exists and has all keys
cat .env.local

# Redeploy with env vars set:
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Enter your key when prompted
vercel redeploy
```

### **Issue: "Email verification not working"**
**Solution:**
```javascript
// Check Firebase Authentication is enabled
// Check Resend API key is valid
// Check email sending in Firebase Console > Auth > Templates
```

### **Issue: "New students can't access portal after email verify"**
**Solution:**
```javascript
// Firestore rules might be blocking
// Check Security Rules in Firebase Console
// Should allow read: if signedIn() for most collections
```

### **Issue: "Student sees other students' data"**
**Solution:**
```javascript
// Firestore rules not updated
// Manually update firestore.rules in Firebase Console
// Should have: allow read, write: if isOwner(userId) || isAdmin();
```

---

## 🎉 Success Indicators

✅ **Deployment successful when:**
- [ ] Site loads without errors
- [ ] New students required to verify email
- [ ] Existing students can sign in without verification
- [ ] Password validation prevents weak passwords
- [ ] XSS inputs are sanitized
- [ ] No console errors
- [ ] Database shows new validation records
- [ ] Admin functions work normally

---

## 📧 Notify Users

**Send email to students:**

```
Subject: HMT Student Portal Security Update

Dear HMT Students,

We've updated the portal with improved security features:

✅ STRONGER PASSWORDS: New accounts require stronger passwords (8+ characters, uppercase, number)
✅ EMAIL VERIFICATION: New students will verify email before accessing portal
✅ BETTER PROTECTION: Improved data privacy - you can only see your own information

⚡ WHAT CHANGES FOR YOU:
- If you're an existing student: No changes! Login as usual.
- If you're registering now: Verify your email after signup
- If you forgot password: Use "Reset Password" link on login

Questions? Contact: admin@hmtfinancialservices.com
```

---

## ✅ Final Checklist

- [ ] Code changes tested locally
- [ ] Git history cleaned (firebase.js removed)
- [ ] Changes committed and pushed
- [ ] Production build successful (`npm run build`)
- [ ] Deployed to hosting platform
- [ ] Live site verified working
- [ ] Security features tested
- [ ] Database updated with new rules
- [ ] Logs monitored for errors
- [ ] Students notified of changes
- [ ] Team briefed on new features

---

**Questions?** Refer back to this guide or check Firebase/Vercel documentation.

**Status: Ready for manual deployment! 🚀**
