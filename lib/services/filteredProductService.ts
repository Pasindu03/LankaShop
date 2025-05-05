// services/filteredProductService.ts
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import type { Product } from "@/types/product";

export async function getProductsByCategory(
  categoryId: string
): Promise<Product[]> {
  try {
    const q = query(
      collection(db, "products"),
      where("categoryId", "==", categoryId),
      orderBy("date", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw error;
  }
}
