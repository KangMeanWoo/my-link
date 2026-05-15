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
} from "firebase/firestore";
import { db } from "./firebase";

// Firestore 링크 데이터 타입
export interface FirestoreLinkItem {
  id: string; // Firestore 문서 ID
  title: string;
  url: string;
  createdAt?: Timestamp;
}

// 컬렉션 경로: users/anonymous/links
const linksCollectionRef = collection(db, "users", "anonymous", "links");

/**
 * Firestore에서 모든 링크를 가져옵니다.
 * createdAt 기준 내림차순 정렬 (최신순)
 */
export async function getLinks(): Promise<FirestoreLinkItem[]> {
  const q = query(linksCollectionRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    title: doc.data().title,
    url: doc.data().url,
    createdAt: doc.data().createdAt,
  }));
}

/**
 * Firestore에 새 링크를 추가합니다.
 */
export async function addLink(
  title: string,
  url: string
): Promise<FirestoreLinkItem> {
  const docRef = await addDoc(linksCollectionRef, {
    title,
    url,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    title,
    url,
  };
}

/**
 * Firestore에서 링크를 삭제합니다.
 */
export async function deleteLink(linkId: string): Promise<void> {
  const docRef = doc(db, "users", "anonymous", "links", linkId);
  await deleteDoc(docRef);
}
