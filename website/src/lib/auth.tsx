import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { db } from './firebase/clientApp';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { setUserCookie } from './cookiesClient';


export const googleSignIn = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  try {
    // Sign in with Google
    const result = await signInWithPopup(auth, provider);
    console.log(result.user.uid)
    const token = await result.user.getIdToken();
    const uid = result.user.uid;
    const email = result.user.email;

    // Check if user already exists in Firestore
    const userRef = doc(collection(db, 'userDetails'), uid);
    const userSnap = await getDoc(userRef);

    // If user does not exist, create a new user document
    if (!userSnap.exists()) {
      const userData = {
        email,
        uid,
      };

      // Save user details to Firestore
      await setDoc(userRef, userData);

      console.log("New Google user registered:", userData);
    }

    // Store UID in cookies (7 days)
    await setUserCookie(uid, 7);

    return { success: true, token };
  } catch (error) {
    console.error("Google sign-in error:", error);
    return { success: false, message: "GOOGLE SIGN_IN ERROR" };
  }
};
