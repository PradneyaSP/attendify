import {
    collection,
    onSnapshot,
    query,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    orderBy,
    Timestamp,
    runTransaction,
    where,
    addDoc,
    getFirestore,
    arrayUnion,
    setDoc,
} from "firebase/firestore";

import { db } from "./clientApp";
import { User } from "firebase/auth";

export const addNewUser = async (user: User) => {
    try {
        const userDocRef = doc(collection(db, 'userDetails'), user.uid);
        const userData = {
            email: user.email,
            uid: user.uid,
            photoUrl: user.photoURL,
            displayName: user.displayName,
        }
        await setDoc(userDocRef, userData);
        console.log("New user document created.");
        return { success: true }
    } catch (error) {
        console.error("Error writing document: ", error);
        return { success: false }
    }
}

export const userLogin = async (user: User) => {
    try {
        const userDocRef = doc(collection(db, 'userDetails'), user.uid);
        const userSnap = await getDoc(userDocRef);
        if (!userSnap.exists()) {
            await addNewUser(user);
        }
        console.log("User login logged.");
        return { success: true };
    } catch (error) {
        console.error("Error logging user login: ", error);
        return { success: false };
    }
};

export const addTimetable = async (user: User, timetableDetails: Timetable) => {
    const timetableEntry = timetableDetails;

    try {
        const userDocRef = doc(db, "timetable", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            // If the document exists, add the new entry to the user's existing timetable
            await updateDoc(userDocRef, {
                timetableEntries: arrayUnion(timetableEntry),
            });
            console.log("Timetable entry added to existing user document.");
        } else {
            // If the document does not exist, create it with the new entry
            await setDoc(userDocRef, {
                timetableEntries: [timetableEntry],
                userId: user.uid,
            });
            console.log("New user document created with timetable entry.");
        }
        return { success: true }
    } catch (error) {
        console.error("Error writing document: ", error);
        return { success: false }
    }
};
