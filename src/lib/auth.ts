import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User,
  UserCredential
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserData {
  uid: string;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
}

export const authService = {
  // Register a new user
  async register(email: string, password: string, userData: {
    name: string;
    phoneNumber: string;
    address: string;
  }): Promise<UserData> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare user data
      const userDocData: UserData = {
        uid: user.uid,
        email: user.email!,
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        address: userData.address,
        createdAt: new Date().toISOString()
      };

      // Run profile update and Firestore document creation in parallel for faster response
      await Promise.all([
        updateProfile(user, { displayName: userData.name }),
        setDoc(doc(db, "users", user.uid), userDocData)
      ]);

      return userDocData;
    } catch (error: any) {
      // Provide specific error messages for better user experience
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please use a different email or try logging in.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(error.message || "Registration failed. Please try again.");
    }
  },

  // Sign in existing user
  async login(email: string, password: string): Promise<UserData> {
    try {
      console.log('Attempting login for:', email);
      
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('Login successful, user:', user.uid);

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc && userDoc.exists()) {
        console.log('User data found in Firestore');
        return userDoc.data() as UserData;
      } else {
        console.log('User data not found in Firestore, using fallback');
        // Fallback to basic user data if Firestore document doesn't exist
        return {
          uid: user.uid,
          email: user.email!,
          name: user.displayName || "User",
          createdAt: new Date().toISOString()
        };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Provide specific error messages for better user experience
      if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email. Please check your email or register for a new account.');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      } else if (error.code === 'auth/network-request-failed') {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid credentials. Please check your email and password.');
      }
      throw new Error(error.message || "Login failed. Please try again.");
    }
  },

  // Sign out current user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  },

  // Get current user data
  async getCurrentUser(): Promise<UserData | null> {
    const user = auth.currentUser;
    if (!user) return null;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      
      // If it's a permission error, return basic user data
      if (error.code === 'permission-denied' || error.message?.includes('offline')) {
        return {
          uid: user.uid,
          email: user.email!,
          name: user.displayName || "User",
          createdAt: new Date().toISOString()
        };
      }
    }

    return null;
  }
};
