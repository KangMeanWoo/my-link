import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lite SDK용 별도 앱 초기화 또는 기존 앱 사용
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const dbLite = getFirestore(app);

export async function getUserIdByDisplayNameLite(displayName: string): Promise<string | null> {
  const usersRef = collection(dbLite, "users");
  const q = query(usersRef, where("displayName", "==", displayName));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;
  return snapshot.docs[0].id;
}

export async function getUserProfileLite(userId: string) {
  const docRef = doc(dbLite, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}
