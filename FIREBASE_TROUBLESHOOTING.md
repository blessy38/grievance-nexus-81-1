# 🔧 Firebase Troubleshooting Guide

## 🚨 **Current Issues:**
- User login fails
- User shows as "offline"
- Authentication not working properly

## 🔍 **Step 1: Test Firebase Connection**

1. **Run the Firebase Test:**
   - Go to your app homepage
   - Click the "🔧 Test Firebase" button
   - Check the console for detailed results

2. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Look for Firebase initialization messages
   - Check for any error messages

## 🔧 **Step 2: Verify Firebase Configuration**

### **Your Current Firebase Config:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCZOup5dZj5jrx6JirInSON58u7hRLywkk",
  authDomain: "gs-login-a4bbf.firebaseapp.com",
  projectId: "gs-login-a4bbf",
  storageBucket: "gs-login-a4bbf.firebasestorage.app",
  messagingSenderId: "894060511384",
  appId: "1:894060511384:web:7cfb297394f66c7032d0ed"
};
```

### **Check These in Firebase Console:**

1. **Go to Firebase Console:** https://console.firebase.google.com/
2. **Select your project:** `gs-login-a4bbf`
3. **Check Authentication:**
   - Go to Authentication > Sign-in method
   - Ensure "Email/Password" is enabled
   - Check if there are any restrictions

4. **Check Firestore Database:**
   - Go to Firestore Database
   - Ensure database is created
   - Check security rules

## 🛠️ **Step 3: Common Issues & Solutions**

### **Issue 1: Authentication Not Enabled**
**Solution:**
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Save changes

### **Issue 2: Firestore Rules Too Restrictive**
**Solution:**
1. Go to Firebase Console > Firestore Database > Rules
2. Temporarily set rules to:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Click "Publish"

### **Issue 3: Project Not Active**
**Solution:**
1. Check if your Firebase project is active
2. Ensure billing is set up if required
3. Check project status in Firebase Console

### **Issue 4: Network/Firewall Issues**
**Solution:**
1. Check your internet connection
2. Try from a different network
3. Check if your firewall blocks Firebase

## 🔍 **Step 4: Debug Information**

### **Check Console Logs:**
Look for these messages in browser console:
- `Firebase initialized: {auth: true, db: true, ...}`
- `Attempting login for: [email]`
- `Login successful, user: [uid]`
- Any error messages

### **Test with Different Credentials:**
1. Try registering a new user first
2. Then try logging in with that user
3. Check if the issue is with existing users or all users

## 🚀 **Step 5: Quick Fixes**

### **Fix 1: Reset Firebase Configuration**
If the test fails, try updating your Firebase config:
1. Go to Firebase Console > Project Settings
2. Scroll down to "Your apps"
3. Click on your web app
4. Copy the new config and replace in `src/lib/firebase.ts`

### **Fix 2: Clear Browser Data**
1. Clear browser cache and cookies
2. Try in incognito/private mode
3. Try a different browser

### **Fix 3: Check Network**
1. Try from a different network
2. Check if your ISP blocks Firebase
3. Try using a VPN

## 📞 **Step 6: Get Help**

If the Firebase test fails, please share:
1. The test results from the "🔧 Test Firebase" button
2. Any error messages from browser console
3. Screenshots of Firebase Console settings

## 🎯 **Expected Results**

**Successful Firebase Test should show:**
- ✅ Firebase initialized successfully
- ✅ Firebase services accessible
- ✅ Test user created successfully
- ✅ Firestore write successful
- ✅ Firestore read successful
- ✅ Test user cleaned up
- 🎉 All Firebase tests passed!

**If you see these, your Firebase is working correctly!**

