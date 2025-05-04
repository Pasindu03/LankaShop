// services/categoryService.ts
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

interface Category {
  heroImage: string | undefined;
  id: string;
  name: string;
  description: string;
  image: string;
}

const categoriesCollection = collection(db, "categories");

export async function getCategories(): Promise<Category[]> {
  try {
    const snapshot = await getDocs(categoriesCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const docRef = doc(db, "categories", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Category;
    }
    return null;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
}
