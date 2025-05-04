// services/subCategoryService.ts
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";

interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
}

export async function getSubcategoriesByCategoryId(
  categoryId: string
): Promise<SubCategory[]> {
  try {
    const q = query(
      collection(db, "subcategories"),
      where("categoryId", "==", categoryId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SubCategory[];
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
}
