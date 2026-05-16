import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  updateDoc,
  setDoc,
  getDoc,
  where,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

// Firestore 링크 데이터 타입
export interface FirestoreLinkItem {
  id: string; // Firestore 문서 ID
  title: string;
  url: string;
  clicks: number; // 클릭 수
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}


export interface UserProfile {
  displayName: string;
  name: string;
  bio: string;
}

// 헬퍼: 특정 사용자의 링크 컬렉션 참조 반환
const getLinksCollectionRef = (userId: string) => collection(db, "users", userId, "links");

// 헬퍼: 특정 사용자의 프로필 문서 참조 반환
const getUserDocRef = (userId: string) => doc(db, "users", userId);

/**
 * Firestore에서 모든 링크를 가져옵니다.
 * createdAt 기준 내림차순 정렬 (최신순)
 */
export async function getLinks(userId: string): Promise<FirestoreLinkItem[]> {
  const q = query(getLinksCollectionRef(userId), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    url: doc.data().url,
    clicks: doc.data().clicks || 0,
    createdAt: doc.data().createdAt,
    updatedAt: doc.data().updatedAt,
  }));
}

/**
 * Firestore에 새 링크를 추가합니다.
 */
export async function addLink(
  userId: string,
  title: string,
  url: string
): Promise<FirestoreLinkItem> {
  const docRef = await addDoc(getLinksCollectionRef(userId), {
    title,
    url,
    clicks: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    title,
    url,
    clicks: 0,
  };
}

/**
 * Firestore에서 링크를 삭제합니다.
 */
export async function deleteLink(userId: string, linkId: string): Promise<void> {
  const docRef = doc(db, "users", userId, "links", linkId);
  await deleteDoc(docRef);
}

/**
 * Firestore에서 링크를 수정합니다.
 */
export async function updateLink(
  userId: string,
  linkId: string,
  title: string,
  url: string
): Promise<void> {
  const docRef = doc(db, "users", userId, "links", linkId);
  await updateDoc(docRef, {
    title,
    url,
    updatedAt: serverTimestamp(),
  });
}

/**
 * 특정 링크의 클릭 수를 1 증가시킵니다.
 */
export async function incrementLinkClickCount(userId: string, linkId: string): Promise<void> {
  const docRef = doc(db, "users", userId, "links", linkId);
  await updateDoc(docRef, {
    clicks: increment(1),
  });
}

/**
 * 사용자 프로필 정보를 가져옵니다.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = getUserDocRef(userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

/**
 * 사용자 프로필 정보를 업데이트(또는 초기화)합니다.
 */
export async function updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<void> {
  const docRef = getUserDocRef(userId);
  await setDoc(docRef, profile, { merge: true });
}

/**
 * 주어진 displayName이 현재 사용자 외에 다른 사용자에 의해 사용 중인지 확인합니다.
 * @returns {boolean} 사용 가능한 고유한 닉네임이면 true, 중복이면 false
 */
export async function isDisplayNameUnique(displayName: string, currentUserId: string): Promise<boolean> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", displayName));
  const snapshot = await getDocs(q);

  // 검색 결과가 없으면 고유함 (true)
  if (snapshot.empty) return true;

  // 검색 결과가 있다면, 찾은 문서가 전부 자기 자신인지 확인
  let isUnique = true;
  snapshot.forEach((doc) => {
    if (doc.id !== currentUserId) {
      isUnique = false;
    }
  });

  return isUnique;
}

/**
 * displayName으로 사용자의 userId(문서 ID)를 검색합니다.
 */
export async function getUserIdByDisplayName(displayName: string): Promise<string | null> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", displayName));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  // 가장 첫 번째로 매칭되는 사용자의 ID를 반환
  return snapshot.docs[0].id;
}
