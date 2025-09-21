# 🔥 Firestore Security Rules Fix

## 🚨 **The Problem:**
Your Firestore is returning **400 (Bad Request)** errors because the security rules are too restrictive or not properly configured.

## 🛠️ **Solution: Update Firestore Rules**

### **Step 1: Go to Firebase Console**
1. Open: https://console.firebase.google.com/
2. Select your project: `gs-login-a4bbf`
3. Go to **Firestore Database** → **Rules**

### **Step 2: Replace Your Current Rules**

**Replace your current rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Complaints collection - authenticated users can read/write their own complaints
    match /complaints/{complaintId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Test collection - for testing purposes only
    match /test/{testId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### **Step 3: Publish the Rules**
1. Click **"Publish"** button
2. Wait for the rules to be deployed (usually takes a few seconds)

## 🔧 **Alternative: Temporary Open Rules (For Testing Only)**

**If you want to test quickly, use these temporary rules:**

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

⚠️ **WARNING:** These rules allow anyone to read/write your database. Only use for testing!

## 🎯 **What These Rules Do:**

1. **Users Collection:**
   - Users can only read/write their own user document
   - Requires authentication

2. **Complaints Collection:**
   - Users can only read/write complaints they created
   - Requires authentication
   - Prevents users from accessing other users' complaints

3. **Test Collection:**
   - Allows authenticated users to read/write test documents
   - Used for the Firebase test component

## 🔍 **After Updating Rules:**

1. **Test the Firebase connection** using the "🔧 Test Firebase" button
2. **Try logging in** with existing credentials
3. **Try submitting a complaint**
4. **Check browser console** for any remaining errors

## 🚨 **If Still Getting Errors:**

1. **Check Authentication is enabled:**
   - Go to Authentication → Sign-in method
   - Ensure "Email/Password" is enabled

2. **Check Firestore is created:**
   - Go to Firestore Database
   - Ensure database exists and is in the correct region

3. **Check Project Status:**
   - Ensure your Firebase project is active
   - Check if billing is required

## 📞 **Need Help?**

If you're still getting errors after updating the rules, share:
1. The new error messages from browser console
2. Screenshot of your Firestore rules page
3. Results from the "🔧 Test Firebase" button

